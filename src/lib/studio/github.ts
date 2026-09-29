/**
 * GitHub transport for the studio admin.
 *
 * Thin on purpose. The *shape* of a commit — which files, which parent, how
 * conflicts are detected — lives in commit-payload.mjs so `node --test` can
 * exercise it without a network. This file only performs HTTP.
 *
 * `fetch` is injected rather than reached for, mirroring createJwksCache
 * (google.mjs), so tests drive the whole write path with a fake.
 *
 * THE ADMIN READS THROUGH THIS, NEVER THROUGH loadContent.
 *
 * That is not a style preference. `loadContent` reads the files bundled into
 * the *last deploy*, so for the 1-3 minutes between an editor's commit and
 * Vercel finishing, it serves stale content and a stale ledger — an editor
 * would publish and then not see their own change. It also has no blob sha,
 * which is what per-item conflict detection compares.
 */

const API = "https://api.github.com";

/**
 * The one message an editor sees when GitHub cannot be reached for any reason
 * other than "this file does not exist": expired/revoked/missing token (401),
 * under-scoped token or rate limit (403), GitHub outage (5xx), network failure.
 *
 * Deliberately generic. The raw upstream body can carry request ids, scope
 * names and documentation links, none of which the browser needs; the status
 * code goes to the server log instead (see logUnavailable).
 *
 * Outage context: the fine-grained PAT expired on 2026-09-26, listDir threw a
 * plain Error on the 401, nothing caught it, and /studio died with a Server
 * Components render error instead of saying what was wrong.
 */
export const PUBLISHING_UNAVAILABLE_MESSAGE =
  "Publishing is unavailable. The GitHub token may be expired or missing.";

export class PublishingUnavailableError extends Error {
  /** Upstream HTTP status, or null for a network failure / missing token. For logs only. */
  readonly status: number | null;
  constructor(status: number | null) {
    super(PUBLISHING_UNAVAILABLE_MESSAGE);
    this.name = "PublishingUnavailableError";
    this.status = status;
  }
}

export function isPublishingUnavailable(e: unknown): e is PublishingUnavailableError {
  return e instanceof PublishingUnavailableError;
}

/** Short server-side line: status code only — never the token, never the body. */
function logUnavailable(status: number | null, reason: string) {
  console.error(`[studio] GitHub unavailable: ${reason}${status === null ? "" : ` (status ${status})`}`);
}

/**
 * Statuses that mean "the publishing backend is not usable right now", as
 * opposed to an answer about the request itself. 404 (absent), 409/422
 * (conflicts, a ref that moved) stay ordinary results the callers interpret.
 */
function isUnavailableStatus(status: number): boolean {
  return status === 401 || status === 403 || status >= 500;
}

/**
 * Standard JSON reply for /api/studio/content/* when publishing is
 * unavailable. 503: the admin itself is up, the backend it depends on is not.
 * Plain `Response` (not NextResponse) so it can be unit-tested under node.
 */
export function publishingUnavailableResponse(): Response {
  return Response.json({ errors: [PUBLISHING_UNAVAILABLE_MESSAGE] }, { status: 503 });
}

export type GitHubFile = { content: string; sha: string };
export type GitHubEntry = { name: string; path: string; sha: string; type: string };

export type GitHubRequest = (
  method: string,
  endpoint: string,
  body?: unknown
) => Promise<{ ok: boolean; status: number; json: Record<string, unknown> | null }>;

export type GitHubClient = {
  request: GitHubRequest;
  branch: string;
  getFile(path: string): Promise<GitHubFile | null>;
  listDir(path: string): Promise<GitHubEntry[]>;
};

export type GitHubConfig = {
  token: string;
  repo: string;
  branch: string;
  fetchImpl?: typeof globalThis.fetch;
};

export function createGitHubClient({ token, repo, branch, fetchImpl }: GitHubConfig): GitHubClient {
  const doFetch = fetchImpl ?? globalThis.fetch;

  const request: GitHubRequest = async (method, endpoint, body) => {
    let res: Response;
    try {
      res = await doFetch(`${API}/repos/${repo}${endpoint}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
    } catch {
      /* DNS, TLS, reset… The error object is not logged: it can echo the
         request, and the request carries the Authorization header. */
      logUnavailable(null, "network error");
      throw new PublishingUnavailableError(null);
    }
    if (isUnavailableStatus(res.status)) {
      /* Thrown here, once, for every caller — reads AND the commit path —
         so no caller can forget to check and turn a 401 into a crash or,
         worse, into a null that reads as "file absent". Body not read. */
      logUnavailable(res.status, `${method} request failed`);
      throw new PublishingUnavailableError(res.status);
    }
    let json: Record<string, unknown> | null = null;
    try {
      json = (await res.json()) as Record<string, unknown>;
    } catch {
      /* 204s and empty bodies are normal; not an error on their own. */
    }
    return { ok: res.ok, status: res.status, json };
  };

  return {
    request,
    branch,

    /** Returns decoded content AND the blob sha, which conflict detection needs. */
    async getFile(path) {
      const res = await request("GET", `/contents/${encodeURI(path)}?ref=${encodeURIComponent(branch)}`);
      /* 404 is a normal answer — "this slug does not exist yet" — not a
         failure. Anything else is a real error and must not be swallowed
         into a null that reads as "absent". */
      if (res.status === 404) return null;
      if (!res.ok || !res.json) {
        /* Any other surprise (400, a directory where a file was expected…)
           is still "cannot read content", and still must not leak detail. */
        logUnavailable(res.status, "getFile unexpected response");
        throw new PublishingUnavailableError(res.status);
      }
      const encoded = String(res.json.content ?? "").replace(/\n/g, "");
      return {
        content: Buffer.from(encoded, "base64").toString("utf8"),
        sha: String(res.json.sha ?? ""),
      };
    },

    async listDir(path) {
      const res = await request("GET", `/contents/${encodeURI(path)}?ref=${encodeURIComponent(branch)}`);
      if (res.status === 404) return [];
      if (!res.ok || !Array.isArray(res.json)) {
        logUnavailable(res.status, "listDir unexpected response");
        throw new PublishingUnavailableError(res.status);
      }
      return (res.json as unknown as GitHubEntry[]).map((e) => ({
        name: e.name,
        path: e.path,
        sha: e.sha,
        type: e.type,
      }));
    },
  };
}

/**
 * Build a client from environment configuration, or null when the write path
 * is not configured.
 *
 * Fails closed like every other admin surface: a missing token must not
 * produce a client that throws deep inside a commit, half way through.
 */
export function createGitHubClientFromEnv(fetchImpl?: typeof globalThis.fetch): GitHubClient | null {
  const token = process.env.GITHUB_TOKEN?.trim();
  const repo = process.env.GITHUB_REPO?.trim();
  const branch = process.env.GITHUB_BRANCH?.trim() || "main";
  if (!token || !repo) return null;
  return createGitHubClient({ token, repo, branch, fetchImpl });
}

/**
 * Like createGitHubClientFromEnv, but a missing GITHUB_TOKEN / GITHUB_REPO is
 * reported as PublishingUnavailableError, so "token missing" and "token
 * expired" reach the editor as the same message through the same path.
 */
export function requireGitHubClientFromEnv(fetchImpl?: typeof globalThis.fetch): GitHubClient {
  const client = createGitHubClientFromEnv(fetchImpl);
  if (!client) {
    logUnavailable(null, "GITHUB_TOKEN or GITHUB_REPO not set");
    throw new PublishingUnavailableError(null);
  }
  return client;
}

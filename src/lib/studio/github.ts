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
    const res = await doFetch(`${API}/repos/${repo}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
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
        throw new Error(`GitHub getFile ${path} failed: ${res.status}`);
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
        throw new Error(`GitHub listDir ${path} failed: ${res.status}`);
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

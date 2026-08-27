/**
 * The atomic commit — source plan §6.5.4.
 *
 * Every editor action touches two or three files: the content file, the slug
 * ledger, and for a white paper the PDF. With one commit per file there is no
 * ordering that leaves a valid intermediate state — ledger-first names a file
 * that does not exist, content-first leaves a file the ledger does not list.
 * Either way the FIRST commit triggers a Vercel build that fails, so every
 * publish would emit a failure email followed by a success email.
 *
 * So: one commit, five calls.
 *
 *   1. GET  /git/ref/heads/{branch}   -> head sha
 *   2. POST /git/blobs   (per file)   -> blob shas
 *   3. POST /git/trees   base_tree=head tree
 *   4. POST /git/commits tree + parent + author
 *   5. PATCH /git/refs/heads/{branch} force:false
 *
 * Plain .mjs with an injected client so `node --test` drives the whole
 * sequence with a fake. The source plan's §10.6 states this logic has no
 * automated coverage and that E3 — a manual, owner-driven check on a
 * deployment — is its only verification. Writing it as a pure orchestrator
 * over an injectable client is what changes that.
 */

/** Refuse to build a commit at all rather than send a malformed one. */
export class ConflictError extends Error {
  constructor(message, kind) {
    super(message);
    this.name = "ConflictError";
    this.kind = kind; // "stale-item" | "branch-moved"
  }
}

export const RELOAD_MESSAGE =
  "This item changed since you opened it — reload to see the current version.";

/**
 * Commit message. Generated, never editor-supplied: it ends up in git history
 * and an editor should not be able to write arbitrary text there.
 */
export function commitMessage(collection, title) {
  const clean = String(title ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, 72);
  return `content(${collection}): update "${clean}" [studio]`;
}

/**
 * @param {object} args
 * @param {object} args.client         from createGitHubClient
 * @param {Array<{path: string, content?: string, encoding?: string, delete?: boolean, expectedSha?: string|null}>} args.changes
 * @param {string} args.message
 * @param {{name: string, email: string}} args.author
 * @param {number} [args.retriesLeft]  internal; the single retry
 * @returns {Promise<{commitSha: string}>}
 */
export async function commitFiles({ client, changes, message, author, retriesLeft = 1 }) {
  if (!Array.isArray(changes) || changes.length === 0) {
    throw new Error("commitFiles: refusing to build an empty commit");
  }
  if (!author?.email || !author?.name) {
    throw new Error("commitFiles: author name and email are required — the audit trail is the point");
  }

  /* --- conflict detection, level 1: per item, precise ------------------
     Compare the blob sha the editor loaded against the one at head. This is
     what produces a useful message; the ref check below only knows that
     *something* moved. Runs BEFORE any write call, so a stale edit costs
     nothing and changes nothing. */
  for (const change of changes) {
    if (change.expectedSha === undefined) continue;
    const current = await client.getFile(change.path);
    const currentSha = current?.sha ?? null;
    if (currentSha !== change.expectedSha) {
      throw new ConflictError(RELOAD_MESSAGE, "stale-item");
    }
  }

  const { commitSha, treeSha } = await getHead(client);

  /* --- blobs ---------------------------------------------------------- */
  const tree = [];
  for (const change of changes) {
    if (change.delete) {
      /* A null sha in a tree entry is how the Git Data API expresses
         deletion. Omitting the entry would leave the file in place, because
         the tree is built on base_tree. */
      tree.push({ path: change.path, mode: "100644", type: "blob", sha: null });
      continue;
    }
    const blob = await post(client, "/git/blobs", {
      content: change.content,
      encoding: change.encoding ?? "utf-8",
    });
    tree.push({ path: change.path, mode: "100644", type: "blob", sha: String(blob.sha) });
  }

  /* --- tree, commit, ref ---------------------------------------------- */
  const newTree = await post(client, "/git/trees", { base_tree: treeSha, tree });

  const commit = await post(client, "/git/commits", {
    message,
    tree: String(newTree.sha),
    parents: [commitSha],
    /* Authorship is the audit trail: `git log` answers "who published this?"
       without an audit table. The signed-in editor, never a bot identity. */
    author: { name: author.name, email: author.email, date: author.date ?? new Date().toISOString() },
  });

  /* --- conflict detection, level 2: the race -------------------------- */
  const patch = await client.request("PATCH", `/git/refs/heads/${client.branch}`, {
    sha: String(commit.sha),
    /* NEVER true. force:true is precisely how one editor silently discards
       another's commit. */
    force: false,
  });

  if (!patch.ok) {
    /* The branch moved between step 1 and step 5. Retry once against the new
       head — the usual cause is another editor finishing a second earlier,
       and the rebuilt commit is still correct because the per-item sha check
       above re-runs. Retry ONCE, then surface the same message: an unbounded
       retry against a busy branch is a livelock. */
    if (retriesLeft > 0) {
      return commitFiles({ client, changes, message, author, retriesLeft: retriesLeft - 1 });
    }
    throw new ConflictError(RELOAD_MESSAGE, "branch-moved");
  }

  return { commitSha: String(commit.sha) };
}

async function getHead(client) {
  const ref = await client.request("GET", `/git/ref/heads/${client.branch}`);
  if (!ref.ok || !ref.json) throw new Error(`Could not read head of ${client.branch}: ${ref.status}`);
  const commitSha = String(ref.json.object?.sha ?? "");
  const commit = await client.request("GET", `/git/commits/${commitSha}`);
  if (!commit.ok || !commit.json) throw new Error(`Could not read commit ${commitSha}: ${commit.status}`);
  return { commitSha, treeSha: String(commit.json.tree?.sha ?? "") };
}

async function post(client, endpoint, body) {
  const res = await client.request("POST", endpoint, body);
  if (!res.ok || !res.json) {
    /* 401/403 here means the token is missing, expired or under-scoped. That
       is the "publishing silently stopped working" failure, so it must say so
       rather than surfacing as a generic 500. */
    if (res.status === 401 || res.status === 403) {
      throw new Error("Publishing is unavailable — the GitHub token is missing, expired or lacks Contents write access.");
    }
    throw new Error(`GitHub ${endpoint} failed: ${res.status}`);
  }
  return res.json;
}

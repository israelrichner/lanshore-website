/**
 * The atomic commit, exercised end to end with a fake client.
 *
 * Source plan §10.6 states the write layer has NO automated coverage and
 * that E3 — manual, owner-driven, on a deployment — is its only
 * verification. These tests are what change that.
 *
 * They pin OUR payloads and OUR handling of documented responses. They
 * cannot prove GitHub accepts them (assumptions.md A1); only E3 does.
 *
 * Run: node --test src/lib/studio/commit-payload.test.mjs
 */

import test from "node:test";
import assert from "node:assert/strict";
import { commitFiles, commitMessage, ConflictError, RELOAD_MESSAGE } from "./commit-payload.mjs";

const AUTHOR = { name: "Editor", email: "editor@lanshore.com", date: "2026-08-27T00:00:00Z" };

/**
 * Fake client recording every call. `files` maps path -> {sha}. `refMoves`
 * makes the first N ref PATCHes fail, simulating another editor landing a
 * commit between our read and our write.
 */
function fakeClient({ files = {}, refFailures = 0 } = {}) {
  const calls = [];
  let remainingRefFailures = refFailures;
  const client = {
    branch: "main",
    calls,
    async getFile(path) {
      calls.push(["getFile", path]);
      return files[path] ? { content: "old", sha: files[path].sha } : null;
    },
    async listDir() {
      return [];
    },
    async request(method, endpoint, body) {
      calls.push([method, endpoint, body]);
      if (method === "GET" && endpoint.startsWith("/git/ref/heads/")) {
        return { ok: true, status: 200, json: { object: { sha: "HEADSHA" } } };
      }
      if (method === "GET" && endpoint.startsWith("/git/commits/")) {
        return { ok: true, status: 200, json: { tree: { sha: "TREESHA" } } };
      }
      if (method === "POST" && endpoint === "/git/blobs") {
        return { ok: true, status: 201, json: { sha: `blob-${calls.length}` } };
      }
      if (method === "POST" && endpoint === "/git/trees") {
        return { ok: true, status: 201, json: { sha: "NEWTREE" } };
      }
      if (method === "POST" && endpoint === "/git/commits") {
        return { ok: true, status: 201, json: { sha: "NEWCOMMIT" } };
      }
      if (method === "PATCH" && endpoint.startsWith("/git/refs/heads/")) {
        if (remainingRefFailures > 0) {
          remainingRefFailures -= 1;
          return { ok: false, status: 422, json: { message: "Update is not a fast forward" } };
        }
        return { ok: true, status: 200, json: { object: { sha: "NEWCOMMIT" } } };
      }
      return { ok: false, status: 500, json: null };
    },
  };
  return client;
}

const of = (client, method, endpoint) =>
  client.calls.filter((c) => c[0] === method && c[1] === endpoint);

/* ------------------------------------------------------------------ *
 * The core property: ONE commit carrying every file
 * ------------------------------------------------------------------ */

test("a multi-file change produces exactly ONE commit carrying all of them", async () => {
  /* This is E3's assertion. Two commits means every publish emits a failed
     deploy followed by a successful one. */
  const client = fakeClient();
  await commitFiles({
    client,
    changes: [
      { path: "content/blog/x.md", content: "---\ntitle: X\n---\n" },
      { path: "content/SLUGS.lock.json", content: "{}" },
    ],
    message: commitMessage("blog", "X"),
    author: AUTHOR,
  });

  assert.equal(of(client, "POST", "/git/commits").length, 1, "expected exactly one commit");
  assert.equal(of(client, "PATCH", "/git/refs/heads/main").length, 1, "expected exactly one ref update");

  const tree = of(client, "POST", "/git/trees")[0][2];
  assert.equal(tree.tree.length, 2, "both files must be in the one tree");
  assert.deepEqual(
    tree.tree.map((e) => e.path).sort(),
    ["content/SLUGS.lock.json", "content/blog/x.md"]
  );
});

test("the tree builds on head's tree, and the commit's parent is head", async () => {
  const client = fakeClient();
  await commitFiles({
    client,
    changes: [{ path: "a.md", content: "a" }],
    message: "m",
    author: AUTHOR,
  });
  assert.equal(of(client, "POST", "/git/trees")[0][2].base_tree, "TREESHA");
  assert.deepEqual(of(client, "POST", "/git/commits")[0][2].parents, ["HEADSHA"]);
});

test("the commit is authored by the signed-in editor", async () => {
  /* The audit trail is the whole reason there is no audit table. */
  const client = fakeClient();
  await commitFiles({ client, changes: [{ path: "a.md", content: "a" }], message: "m", author: AUTHOR });
  const commit = of(client, "POST", "/git/commits")[0][2];
  assert.equal(commit.author.name, "Editor");
  assert.equal(commit.author.email, "editor@lanshore.com");
});

test("deletions are expressed as a null sha, not by omission", async () => {
  /* Omitting the entry would leave the file in place, because the tree is
     built on base_tree. A delete that silently does nothing is worse than
     an error. */
  const client = fakeClient();
  await commitFiles({
    client,
    changes: [{ path: "content/blog/gone.md", delete: true }, { path: "content/SLUGS.lock.json", content: "{}" }],
    message: "m",
    author: AUTHOR,
  });
  const tree = of(client, "POST", "/git/trees")[0][2].tree;
  const del = tree.find((e) => e.path === "content/blog/gone.md");
  assert.equal(del.sha, null, "deletion must carry sha:null");
  assert.equal(of(client, "POST", "/git/blobs").length, 1, "a deletion must not create a blob");
});

/* ------------------------------------------------------------------ *
 * Conflict detection — level 1, per item
 * ------------------------------------------------------------------ */

test("a stale blob sha aborts with the reload message and writes NOTHING", async () => {
  const client = fakeClient({ files: { "content/blog/x.md": { sha: "CURRENT" } } });
  await assert.rejects(
    commitFiles({
      client,
      changes: [{ path: "content/blog/x.md", content: "new", expectedSha: "WHAT_THE_EDITOR_LOADED" }],
      message: "m",
      author: AUTHOR,
    }),
    (e) => e instanceof ConflictError && e.kind === "stale-item" && e.message === RELOAD_MESSAGE
  );
  /* Nothing was written — the check runs before any write call. */
  assert.equal(of(client, "POST", "/git/blobs").length, 0);
  assert.equal(of(client, "POST", "/git/commits").length, 0);
  assert.equal(of(client, "PATCH", "/git/refs/heads/main").length, 0);
});

test("creating a new file expects a null sha, and an existing file blocks it", async () => {
  const fresh = fakeClient();
  await commitFiles({
    client: fresh,
    changes: [{ path: "content/blog/new.md", content: "c", expectedSha: null }],
    message: "m",
    author: AUTHOR,
  });
  assert.equal(of(fresh, "POST", "/git/commits").length, 1);

  /* Same request when the slug already exists must not silently overwrite. */
  const taken = fakeClient({ files: { "content/blog/new.md": { sha: "EXISTS" } } });
  await assert.rejects(
    commitFiles({
      client: taken,
      changes: [{ path: "content/blog/new.md", content: "c", expectedSha: null }],
      message: "m",
      author: AUTHOR,
    }),
    ConflictError
  );
});

test("omitting expectedSha skips the per-item check (ledger writes)", async () => {
  const client = fakeClient({ files: { "content/SLUGS.lock.json": { sha: "ANY" } } });
  await commitFiles({
    client,
    changes: [{ path: "content/SLUGS.lock.json", content: "{}" }],
    message: "m",
    author: AUTHOR,
  });
  assert.equal(of(client, "POST", "/git/commits").length, 1);
});

/* ------------------------------------------------------------------ *
 * Conflict detection — level 2, the race
 * ------------------------------------------------------------------ */

test("a non-fast-forward retries EXACTLY once, then succeeds", async () => {
  const client = fakeClient({ refFailures: 1 });
  const res = await commitFiles({
    client,
    changes: [{ path: "a.md", content: "a" }],
    message: "m",
    author: AUTHOR,
  });
  assert.equal(res.commitSha, "NEWCOMMIT");
  assert.equal(of(client, "PATCH", "/git/refs/heads/main").length, 2, "one failure + one retry");
});

test("a persistently moving branch surfaces the reload message, not a livelock", async () => {
  const client = fakeClient({ refFailures: 99 });
  await assert.rejects(
    commitFiles({ client, changes: [{ path: "a.md", content: "a" }], message: "m", author: AUTHOR }),
    (e) => e instanceof ConflictError && e.kind === "branch-moved" && e.message === RELOAD_MESSAGE
  );
  /* Bounded: the original attempt plus exactly one retry. */
  assert.equal(of(client, "PATCH", "/git/refs/heads/main").length, 2);
});

test("force is never true", async () => {
  /* force:true is precisely how one editor silently discards another's work. */
  const client = fakeClient({ refFailures: 1 });
  await commitFiles({ client, changes: [{ path: "a.md", content: "a" }], message: "m", author: AUTHOR });
  for (const call of of(client, "PATCH", "/git/refs/heads/main")) {
    assert.equal(call[2].force, false);
  }
});

/* ------------------------------------------------------------------ *
 * Guards and messages
 * ------------------------------------------------------------------ */

test("an empty change set is refused rather than committed", async () => {
  await assert.rejects(
    commitFiles({ client: fakeClient(), changes: [], message: "m", author: AUTHOR }),
    /empty commit/
  );
});

test("a missing author is refused — the audit trail is the point", async () => {
  await assert.rejects(
    commitFiles({ client: fakeClient(), changes: [{ path: "a.md", content: "a" }], message: "m", author: { name: "X" } }),
    /author name and email/
  );
});

test("401/403 says the token is the problem, not 'something went wrong'", async () => {
  /* This is the "publishing silently stopped working" failure — an expired
     PAT. It must name itself. */
  const client = fakeClient();
  const original = client.request;
  client.request = async (m, e, b) => (e === "/git/blobs" ? { ok: false, status: 403, json: null } : original(m, e, b));
  await assert.rejects(
    commitFiles({ client, changes: [{ path: "a.md", content: "a" }], message: "m", author: AUTHOR }),
    /GitHub token is missing, expired or lacks Contents write access/
  );
});

test("commitMessage is generated, single-line and bounded", async () => {
  assert.equal(commitMessage("blog", "Hello"), 'content(blog): update "Hello" [studio]');
  /* Editor-supplied text reaches git history, so newlines must not let it
     forge extra header lines, and length is capped. */
  const nasty = commitMessage("blog", "a\nb\r\nc");
  assert.ok(!nasty.includes("\n") && !nasty.includes("\r"));
  assert.ok(commitMessage("blog", "x".repeat(500)).length < 120);
});

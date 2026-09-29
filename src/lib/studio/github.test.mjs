/**
 * GitHub transport failure handling.
 *
 * Outage 2026-09-26: the fine-grained PAT expired, GitHub answered 401, and
 * listDir/getFile threw a plain Error that nothing caught — /studio died with
 * a Server Components render error. The first test pins that ROOT CAUSE
 * against the pre-fix behaviour (a non-404 was a throw, never a null); the
 * rest pin the fix: every availability failure becomes
 * PublishingUnavailableError carrying only the fixed message, and 404 stays
 * "not found".
 *
 * Needs --experimental-strip-types (imports github.ts), like test:loaders.
 *
 * Run: node --experimental-strip-types --test src/lib/studio/github.test.mjs
 */

import test from "node:test";
import assert from "node:assert/strict";
import {
  createGitHubClient,
  createGitHubClientFromEnv,
  requireGitHubClientFromEnv,
  PublishingUnavailableError,
  isPublishingUnavailable,
  publishingUnavailableResponse,
  PUBLISHING_UNAVAILABLE_MESSAGE,
} from "./github.ts";

const FAKE_TOKEN = "fake-token-for-tests-only";
/* What GitHub actually sends on an expired PAT, plus a canary that must never surface. */
const UPSTREAM_BODY = { message: "Bad credentials", documentation_url: "https://docs.github.com/rest", canary: "UPSTREAM-CANARY" };

function fakeFetch(status, body = UPSTREAM_BODY) {
  const calls = [];
  const impl = async (url, init) => {
    calls.push({ url, init });
    return new Response(body === null ? null : JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  };
  impl.calls = calls;
  return impl;
}

const client = (fetchImpl) => createGitHubClient({ token: FAKE_TOKEN, repo: "o/r", branch: "main", fetchImpl });

/** Silence and capture console.error for the duration of fn. */
async function captureLogs(fn) {
  const orig = console.error;
  const lines = [];
  console.error = (...a) => lines.push(a.map(String).join(" "));
  try {
    return { result: await fn(), lines };
  } finally {
    console.error = orig;
  }
}

function assertUnavailable(err, status) {
  assert.ok(err instanceof PublishingUnavailableError, `expected PublishingUnavailableError, got ${err}`);
  assert.ok(isPublishingUnavailable(err));
  assert.equal(err.message, PUBLISHING_UNAVAILABLE_MESSAGE);
  assert.equal(err.status, status);
  assert.ok(!err.message.includes(FAKE_TOKEN));
  assert.ok(!err.message.includes("Bad credentials"));
  assert.ok(!String(err.stack).includes("UPSTREAM-CANARY"));
  return true;
}

test("hypothesis: a 401 makes listDir and getFile THROW (not return empty) — the uncaught error behind the crash", async () => {
  /* Holds before and after the fix; only the error type changed. Before:
     `Error("GitHub listDir content/blog failed: 401")`, uncaught in
     src/app/studio/(gated)/page.tsx -> Server Components render error. */
  await captureLogs(async () => {
    await assert.rejects(client(fakeFetch(401)).listDir("content/blog"));
    await assert.rejects(client(fakeFetch(401)).getFile("content/blog/x.md"));
  });
});

for (const status of [401, 403, 500, 502, 503]) {
  test(`HTTP ${status} on listDir and getFile -> PublishingUnavailableError`, async () => {
    const { lines } = await captureLogs(async () => {
      await assert.rejects(client(fakeFetch(status)).listDir("content/blog"), (e) => assertUnavailable(e, status));
      await assert.rejects(client(fakeFetch(status)).getFile("content/blog/x.md"), (e) => assertUnavailable(e, status));
    });
    /* A short server-side line with the status — never the token or body. */
    assert.ok(lines.length >= 1);
    for (const l of lines) {
      assert.match(l, new RegExp(`status ${status}`));
      assert.ok(!l.includes(FAKE_TOKEN) && !l.includes("Bad credentials") && !l.includes("UPSTREAM-CANARY"), l);
    }
  });
}

test("HTTP 401 on a raw request (the commit path) -> PublishingUnavailableError", async () => {
  await captureLogs(async () => {
    await assert.rejects(client(fakeFetch(401)).request("POST", "/git/blobs", { content: "x" }), (e) => assertUnavailable(e, 401));
  });
});

test("network error -> PublishingUnavailableError; the fetch error (which may echo headers) is not logged", async () => {
  const boom = async () => {
    throw new TypeError(`fetch failed: Authorization: Bearer ${FAKE_TOKEN}`);
  };
  const { lines } = await captureLogs(async () => {
    await assert.rejects(client(boom).listDir("content/blog"), (e) => assertUnavailable(e, null));
    await assert.rejects(client(boom).getFile("content/blog/x.md"), (e) => assertUnavailable(e, null));
  });
  for (const l of lines) assert.ok(!l.includes(FAKE_TOKEN), l);
});

test("404 is still 'not found': getFile -> null, listDir -> []", async () => {
  assert.equal(await client(fakeFetch(404, { message: "Not Found" })).getFile("content/blog/nope.md"), null);
  assert.deepEqual(await client(fakeFetch(404, { message: "Not Found" })).listDir("content/nope"), []);
});

test("409/422 are still returned to the caller, not thrown (commit-payload's branch-moved retry relies on it)", async () => {
  const res = await client(fakeFetch(422, { message: "Update is not a fast forward" })).request("PATCH", "/git/refs/heads/main", {});
  assert.equal(res.ok, false);
  assert.equal(res.status, 422);
});

test("an unexpected non-404 on reads (e.g. 400) is also mapped, not leaked", async () => {
  await captureLogs(async () => {
    await assert.rejects(client(fakeFetch(400)).getFile("content/blog/x.md"), (e) => assertUnavailable(e, 400));
  });
});

test("200 still works, and the token is only ever sent as the Authorization header", async () => {
  const f = fakeFetch(200, { content: Buffer.from("hello").toString("base64"), sha: "abc" });
  assert.deepEqual(await client(f).getFile("content/blog/x.md"), { content: "hello", sha: "abc" });
  assert.equal(f.calls[0].init.headers.Authorization, `Bearer ${FAKE_TOKEN}`);
  assert.ok(!f.calls[0].url.includes(FAKE_TOKEN));
});

test("missing token or repo: FromEnv returns null, requireGitHubClientFromEnv throws the same unavailable error", async () => {
  const saved = { t: process.env.GITHUB_TOKEN, r: process.env.GITHUB_REPO };
  try {
    for (const [t, r] of [[undefined, "o/r"], ["  ", "o/r"], [FAKE_TOKEN, undefined]]) {
      if (t === undefined) delete process.env.GITHUB_TOKEN; else process.env.GITHUB_TOKEN = t;
      if (r === undefined) delete process.env.GITHUB_REPO; else process.env.GITHUB_REPO = r;
      assert.equal(createGitHubClientFromEnv(), null);
      await captureLogs(async () => {
        assert.throws(() => requireGitHubClientFromEnv(), (e) => assertUnavailable(e, null));
      });
    }
    process.env.GITHUB_TOKEN = FAKE_TOKEN;
    process.env.GITHUB_REPO = "o/r";
    assert.ok(requireGitHubClientFromEnv(fakeFetch(200)));
  } finally {
    if (saved.t === undefined) delete process.env.GITHUB_TOKEN; else process.env.GITHUB_TOKEN = saved.t;
    if (saved.r === undefined) delete process.env.GITHUB_REPO; else process.env.GITHUB_REPO = saved.r;
  }
});

test("API reply: 503 JSON with the fixed message and nothing else", async () => {
  const res = publishingUnavailableResponse();
  assert.equal(res.status, 503);
  assert.match(res.headers.get("content-type") ?? "", /application\/json/);
  assert.deepEqual(await res.json(), { errors: [PUBLISHING_UNAVAILABLE_MESSAGE] });
});

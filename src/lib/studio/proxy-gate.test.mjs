/**
 * The proxy's studio decision table — signed-out /studio goes to the sign-in
 * page; every other gated path keeps its bare 404; the sign-in page and the
 * OAuth routes are never redirected; a session passes everything through.
 *
 * `node --test`, Node builtin, no framework added.
 *
 * Run: node --test src/lib/studio/proxy-gate.test.mjs
 */

import test from "node:test";
import assert from "node:assert/strict";
import {
  studioGate,
  needsSessionCheck,
  isStudioPath,
  STUDIO_EXEMPT_PATHS,
  SIGNED_OUT_PATH,
} from "./proxy-gate.mjs";

const REDIRECT = { action: "redirect", location: "/studio/signed-out" };
const NEXT = { action: "next" };
const NOT_FOUND = { action: "notFound" };

test("signed-out /studio and /studio/ redirect to the sign-in page", () => {
  assert.deepEqual(studioGate("/studio", false), REDIRECT);
  assert.deepEqual(studioGate("/studio/", false), REDIRECT);
});

test("every other gated path still 404s when signed out", () => {
  for (const p of [
    "/studio/blog/some-post",
    "/studio/blog/new",
    "/studio/caseStudies",
    "/studio//",
    "/studio/signed-out-and-then-something", // exact-match exemption, not prefix
    "/studio/signed-out/",
    "/api/studio/content/blog",
    "/api/studio/content/blog/some-post",
    "/api/studio/auth/login/extra",
  ]) {
    assert.deepEqual(studioGate(p, false), NOT_FOUND, p);
  }
});

test("the sign-in page and the OAuth routes are never redirected or 404'd", () => {
  for (const p of STUDIO_EXEMPT_PATHS) {
    assert.equal(needsSessionCheck(p), false, p);
    assert.deepEqual(studioGate(p, false), NEXT, p);
    assert.deepEqual(studioGate(p, true), NEXT, p);
  }
  assert.ok(STUDIO_EXEMPT_PATHS.has("/api/studio/auth/login"));
  assert.ok(STUDIO_EXEMPT_PATHS.has("/api/studio/auth/callback"));
  assert.ok(STUDIO_EXEMPT_PATHS.has("/api/studio/auth/logout"));
});

test("no redirect loop: the redirect target is itself exempt", () => {
  const r = studioGate("/studio", false);
  assert.equal(r.location, SIGNED_OUT_PATH);
  assert.deepEqual(studioGate(r.location, false), NEXT);
  assert.deepEqual(studioGate(studioGate("/login", false).location, false), NEXT);
});

test("signed-in /studio (where the OAuth callback lands) passes through", () => {
  assert.deepEqual(studioGate("/studio", true), NEXT);
  assert.deepEqual(studioGate("/studio/", true), NEXT);
  assert.deepEqual(studioGate("/studio/blog/some-post", true), NEXT);
  assert.deepEqual(studioGate("/api/studio/content/blog", true), NEXT);
});

test("/login is a redirect alias regardless of session; nothing else public is touched", () => {
  assert.deepEqual(studioGate("/login", false), REDIRECT);
  assert.deepEqual(studioGate("/login", true), REDIRECT);
  assert.equal(needsSessionCheck("/login"), false);
  for (const p of ["/", "/login/", "/logins", "/blog/studio", "/studios", "/api/careers"]) {
    assert.equal(isStudioPath(p), false, p);
    assert.deepEqual(studioGate(p, false), NEXT, p);
  }
});

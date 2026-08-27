import test from "node:test";
import assert from "node:assert/strict";
import { shouldLoadTracker, isAdminPath } from "./tracker-gate.mjs";

const canonical = (pathname, force) => shouldLoadTracker({ hostname: "lanshore.com", pathname, force });

test("loads on public pages on a canonical host", () => {
  for (const p of ["/", "/blog", "/resources", "/case-studies/x", "/studios-of-note"]) {
    assert.equal(canonical(p), true, `${p} should load`);
  }
});

test("does NOT load anywhere under /studio", () => {
  for (const p of ["/studio", "/studio/", "/studio/signed-out", "/studio/anything/deep"]) {
    assert.equal(canonical(p), false, `${p} must not load`);
  }
});

test("/studios-of-note is not treated as admin", () => {
  /* Guards against a sloppy startsWith("/studio") without the separator. */
  assert.equal(isAdminPath("/studios-of-note"), false);
  assert.equal(canonical("/studios-of-note"), true);
});

test("does not load on a non-canonical host regardless of path", () => {
  for (const h of ["preview.vercel.app", "localhost:3000", ""]) {
    assert.equal(shouldLoadTracker({ hostname: h, pathname: "/" }), false, `${h} must not load`);
  }
});

test("host matching is case-insensitive", () => {
  assert.equal(shouldLoadTracker({ hostname: "LANSHORE.COM", pathname: "/" }), true);
});

test("force overrides the host gate but NOT the admin exclusion", () => {
  assert.equal(shouldLoadTracker({ hostname: "preview.vercel.app", pathname: "/", force: true }), true);
  /* Forcing a tracker on for debugging is not a reason to record editors. */
  assert.equal(shouldLoadTracker({ hostname: "preview.vercel.app", pathname: "/studio", force: true }), false);
  assert.equal(shouldLoadTracker({ hostname: "lanshore.com", pathname: "/studio", force: true }), false);
});

test("missing input fails closed", () => {
  assert.equal(shouldLoadTracker(), false);
  assert.equal(shouldLoadTracker({}), false);
});

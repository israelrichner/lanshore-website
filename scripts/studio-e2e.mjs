/**
 * Live check of the studio sign-in redirect and the "publishing unavailable"
 * handling, against a locally running production build.
 *
 * Covers what node --test cannot reach: the real proxy, the real pages and
 * the real /api/studio/content/* route handlers, with a real session cookie.
 *
 * Uses FAKE configuration only — never real secrets. The server and this
 * script must share the same fake ADMIN_SESSION_SECRET / ADMIN_ALLOWED_EMAILS
 * (the script mints its own session cookie with them). Two modes, each
 * started with its own server:
 *
 *   GITHUB_MODE=bad-token  server has GITHUB_TOKEN=<obviously fake> and
 *                          GITHUB_REPO set: GitHub answers 401, exactly the
 *                          expired-PAT outage of 2026-09-26. (Needs network.)
 *   GITHUB_MODE=no-token   server has no GITHUB_TOKEN at all.
 *
 * Example:
 *   export ADMIN_SESSION_SECRET=fake-e2e-session-secret-not-real-0123456789 \
 *          ADMIN_ALLOWED_EMAILS=editor@example.com \
 *          GOOGLE_OAUTH_CLIENT_ID=fake-client-id GOOGLE_OAUTH_CLIENT_SECRET=fake-client-secret
 *   GITHUB_TOKEN=fake-e2e-token GITHUB_REPO=example-org/example-repo npx next start -p 3100 &
 *   BASE_URL=http://localhost:3100 GITHUB_MODE=bad-token node scripts/studio-e2e.mjs
 *
 * Exit 0 = all rows pass.
 */

import { signSession } from "../src/lib/studio/session.mjs";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const MODE = process.env.GITHUB_MODE ?? "bad-token";
const SECRET = process.env.ADMIN_SESSION_SECRET;
const EMAIL = (process.env.ADMIN_ALLOWED_EMAILS ?? "").split(",")[0].trim();
const MESSAGE = "Publishing is unavailable. The GitHub token may be expired or missing.";
/* Upstream detail that must never reach the browser. */
const LEAKS = ["Bad credentials", "documentation_url", "docs.github.com", process.env.E2E_FAKE_TOKEN ?? "fake-e2e-token"];

if (!SECRET || !EMAIL) {
  console.error("Set the same fake ADMIN_SESSION_SECRET and ADMIN_ALLOWED_EMAILS the server was started with.");
  process.exit(2);
}

const now = Math.floor(Date.now() / 1000);
const cookie = `studio_session=${await signSession({ email: EMAIL, iat: now, exp: now + 3600 }, SECRET)}`;

let failed = 0;
function check(label, cond, detail) {
  console.log(`${cond ? "  ok  " : " FAIL "}${label}${cond ? "" : `  -> ${detail}`}`);
  if (!cond) failed++;
}

async function hit(path, { signedIn = false, method = "GET", body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    redirect: "manual",
    headers: {
      ...(signedIn ? { Cookie: cookie } : {}),
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await res.text();
  return { status: res.status, location: res.headers.get("location"), text };
}

const loc = (r) => (r.location ? new URL(r.location, BASE).pathname + new URL(r.location, BASE).search : null);

console.log(`studio e2e against ${BASE} (GITHUB_MODE=${MODE})\n`);

/* --- 1. sign-in URL ------------------------------------------------------ */
for (const p of ["/studio", "/studio/"]) {
  const r = await hit(p);
  /* Next may first normalise /studio/ -> /studio (308); follow that one hop. */
  const final = r.status === 308 && loc(r) === "/studio" ? await hit("/studio") : r;
  check(`signed-out ${p} redirects to /studio/signed-out`, final.status === 307 && loc(final) === "/studio/signed-out",
    `status ${r.status} -> ${final.status}, location ${loc(final)}`);
}
{
  const r = await hit("/login");
  check("signed-out /login redirects to /studio/signed-out", r.status === 307 && loc(r) === "/studio/signed-out", `${r.status} ${loc(r)}`);
}
for (const p of ["/studio/blog/some-post", "/studio/blog/new", "/studio/signed-out-and-then-something"]) {
  const r = await hit(p);
  check(`signed-out ${p} is still 404`, r.status === 404, `${r.status} ${loc(r) ?? ""}`);
}
{
  const r = await hit("/api/studio/content/blog", { method: "POST", body: { slug: "x" } });
  check("signed-out POST /api/studio/content/blog is still 404", r.status === 404, `${r.status}`);
}
{
  const r = await hit("/studio/signed-out");
  check("signed-out /studio/signed-out renders (200, not redirected)", r.status === 200 && r.text.includes("Sign in with Google"), `${r.status} ${loc(r) ?? ""}`);
}
{
  const r = await hit("/api/studio/auth/login");
  check("signed-out /api/studio/auth/login starts OAuth (not sent to signed-out)",
    r.status === 307 && (r.location ?? "").startsWith("https://accounts.google.com/"), `${r.status} ${r.location}`);
}
{
  const r = await hit("/api/studio/auth/callback");
  /* The route's own refusal (no state cookie), not the proxy's redirect. */
  check("signed-out /api/studio/auth/callback reaches its handler", r.status === 307 && loc(r) === "/studio/signed-out?error=expired", `${r.status} ${loc(r)}`);
}

/* --- 2. signed in: /studio passes through, and GitHub failure is a message */
function noLeak(label, text) {
  const hits = LEAKS.filter((l) => l && text.includes(l));
  check(`${label}: no upstream detail or token in response`, hits.length === 0, hits.join(", "));
}
{
  const r = await hit("/studio", { signedIn: true });
  check("signed-in /studio passes the proxy and renders (200)", r.status === 200, `${r.status} ${loc(r) ?? ""}`);
  check("signed-in /studio shows the publishing-unavailable message", r.text.includes(MESSAGE), "message missing");
  noLeak("/studio", r.text);
}
{
  const r = await hit("/studio/blog/some-post", { signedIn: true });
  check("signed-in editor page (existing slug) shows the message", r.status === 200 && r.text.includes(MESSAGE), `${r.status}`);
  noLeak("editor page", r.text);
}
if (MODE === "no-token") {
  const r = await hit("/studio/blog/new", { signedIn: true });
  check("signed-in editor page (new) shows the message when no token", r.status === 200 && r.text.includes(MESSAGE), `${r.status}`);
}
for (const [path, body] of [
  ["/api/studio/content/blog", { slug: "e2e-test", record: {} }],
  ["/api/studio/content/blog/some-post", { action: "publish" }],
  ["/api/studio/content/blog/some-post", { action: "saveDraft", record: {}, expectedSha: "abc" }],
]) {
  const r = await hit(path, { signedIn: true, method: "POST", body });
  let json = null;
  try { json = JSON.parse(r.text); } catch {}
  check(`POST ${path} (${body.action ?? "create"}) -> 503 JSON with the message`,
    r.status === 503 && JSON.stringify(json) === JSON.stringify({ errors: [MESSAGE] }), `${r.status} ${r.text.slice(0, 120)}`);
  noLeak(`POST ${path}`, r.text);
}

console.log(`\n${failed === 0 ? "PASS" : `FAIL (${failed})`}`);
process.exit(failed === 0 ? 0 : 1);

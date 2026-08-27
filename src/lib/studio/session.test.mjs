/**
 * Tests for the studio session core — source plan §10.4 T1–T10, plus the
 * logic half of T13.
 *
 * `node --test`, Node builtin, no framework added.
 *
 * Every test asserts a REJECTION as well as an acceptance. A suite that only
 * proves valid input is valid cannot fail for the right reason, and this is
 * the one module where a silent failure means unauthorized write access to
 * the live site.
 *
 * Run: node --test src/lib/studio/session.test.mjs
 */

import test from "node:test";
import assert from "node:assert/strict";
import {
  signSession,
  verifySession,
  isAuthorized,
  parseAllowlist,
  readAdminConfig,
  resolveSession,
  REQUIRED_CONFIG_VARS,
} from "./session.mjs";

const SECRET = "a".repeat(43);
const OTHER_SECRET = "b".repeat(43);
const NOW = 1_800_000_000;
const payload = (over = {}) => ({ email: "editor@lanshore.com", iat: NOW, exp: NOW + 3600, ...over });

const fullEnv = (over = {}) => ({
  GOOGLE_OAUTH_CLIENT_ID: "cid",
  GOOGLE_OAUTH_CLIENT_SECRET: "csecret",
  ADMIN_SESSION_SECRET: SECRET,
  ADMIN_ALLOWED_EMAILS: "editor@lanshore.com",
  ...over,
});

/* ------------------------------------------------------------------ *
 * T1-T4 — session cookie
 * ------------------------------------------------------------------ */

test("T1: a valid signed cookie verifies", async () => {
  const c = await signSession(payload(), SECRET);
  const out = await verifySession(c, SECRET, NOW);
  assert.equal(out.email, "editor@lanshore.com");
});

test("T1: a payload tampered by one byte fails", async () => {
  const c = await signSession(payload(), SECRET);
  const [body, sig] = c.split(".");
  /* Flip one character of the encoded payload, keep the original signature. */
  const flipped = (body[0] === "A" ? "B" : "A") + body.slice(1);
  assert.equal(await verifySession(`${flipped}.${sig}`, SECRET, NOW), null);
});

test("T2: a signature made with a different secret fails", async () => {
  const c = await signSession(payload(), OTHER_SECRET);
  assert.equal(await verifySession(c, SECRET, NOW), null);
});

test("T3: an expired exp fails even with a valid signature", async () => {
  const c = await signSession(payload({ exp: NOW - 1 }), SECRET);
  assert.equal(await verifySession(c, SECRET, NOW), null);
  /* And is accepted before that instant, so the test pins the boundary
     rather than just "something rejected it". */
  const c2 = await signSession(payload({ exp: NOW + 1 }), SECRET);
  assert.ok(await verifySession(c2, SECRET, NOW));
});

test("T4: stripped, empty or null-ish signature fails — no unsigned-implies-trusted path", async () => {
  const c = await signSession(payload(), SECRET);
  const [body] = c.split(".");
  for (const bad of [body, `${body}.`, `${body}.null`, `${body}.undefined`, `.${body}`, "", ".", "..", null, undefined, 42]) {
    assert.equal(await verifySession(bad, SECRET, NOW), null, `should reject: ${String(bad)}`);
  }
});

test("T4: a non-base64url signature segment fails rather than being coerced", async () => {
  const c = await signSession(payload(), SECRET);
  const [body] = c.split(".");
  assert.equal(await verifySession(`${body}.!!!not base64!!!`, SECRET, NOW), null);
});

test("verify fails closed when the secret is missing", async () => {
  const c = await signSession(payload(), SECRET);
  assert.equal(await verifySession(c, "", NOW), null);
  assert.equal(await verifySession(c, undefined, NOW), null);
});

/* ------------------------------------------------------------------ *
 * T5-T10 — the allowlist
 * ------------------------------------------------------------------ */

test("T5: ADMIN_ALLOWED_EMAILS unset => every email rejected", () => {
  for (const raw of [undefined, null, 0, false]) {
    assert.equal(
      isAuthorized({ email: "editor@lanshore.com", email_verified: true }, { allowedEmails: raw }),
      false,
      `unset form ${String(raw)} must reject`
    );
  }
});

test("T6: ADMIN_ALLOWED_EMAILS='' => every email rejected", () => {
  /* The specific bug this feature is most likely to ship: reading an empty
     allowlist as "no restriction" instead of "nobody". */
  for (const raw of ["", "   ", ",", " , , "]) {
    assert.equal(parseAllowlist(raw).length, 0);
    assert.equal(
      isAuthorized({ email: "editor@lanshore.com", email_verified: true }, { allowedEmails: raw }),
      false,
      `empty form ${JSON.stringify(raw)} must reject`
    );
  }
});

test("T7: case and whitespace are normalised on both sides", () => {
  const config = { allowedEmails: " Editor@Lanshore.com , other@lanshore.com " };
  assert.equal(isAuthorized({ email: "editor@lanshore.com", email_verified: true }, config), true);
  assert.equal(isAuthorized({ email: "  EDITOR@LANSHORE.COM  ", email_verified: true }, config), true);
});

test("T8: near-miss addresses do not match", () => {
  const config = { allowedEmails: "editor@lanshore.com" };
  for (const email of [
    "editor@lanshore.com.attacker.com",
    "editor@lanshore.co",
    "xeditor@lanshore.com",
    "editor@lanshore.com ",          // trailing space is trimmed, so this one SHOULD pass
  ]) {
    const expected = email.trim() === "editor@lanshore.com";
    assert.equal(
      isAuthorized({ email, email_verified: true }, config),
      expected,
      `${JSON.stringify(email)} expected ${expected}`
    );
  }
});

test("T9: email_verified false is rejected even when allowlisted", () => {
  const config = { allowedEmails: "editor@lanshore.com" };
  assert.equal(isAuthorized({ email: "editor@lanshore.com", email_verified: false }, config), false);
  assert.equal(isAuthorized({ email: "editor@lanshore.com" }, config), false, "missing flag must reject");
  assert.equal(isAuthorized({ email: "editor@lanshore.com", email_verified: "true" }, config), false, "string must not count");
});

test("T10: ADMIN_ALLOWED_DOMAIN is ANDed with the allowlist, not ORed", () => {
  const config = { allowedEmails: "editor@lanshore.com,contractor@gmail.com", allowedDomain: "lanshore.com" };
  assert.equal(isAuthorized({ email: "editor@lanshore.com", email_verified: true }, config), true);
  /* Allowlisted but outside the domain — still rejected. */
  assert.equal(isAuthorized({ email: "contractor@gmail.com", email_verified: true }, config), false);
  /* In the domain but NOT allowlisted — also rejected. The domain never
     grants access on its own. */
  assert.equal(isAuthorized({ email: "stranger@lanshore.com", email_verified: true }, config), false);
});

test("malformed identities fail closed", () => {
  const config = { allowedEmails: "editor@lanshore.com" };
  for (const id of [null, undefined, {}, { email: "" }, { email: "no-at-sign", email_verified: true }, "string"]) {
    assert.equal(isAuthorized(id, config), false, `should reject: ${JSON.stringify(id)}`);
  }
});

/* ------------------------------------------------------------------ *
 * Fail-closed configuration
 * ------------------------------------------------------------------ */

test("readAdminConfig reports every missing required var", () => {
  assert.deepEqual(readAdminConfig({}).missing, REQUIRED_CONFIG_VARS);
  assert.equal(readAdminConfig({}).ok, false);
});

test("readAdminConfig treats whitespace-only as missing, not as present", () => {
  for (const k of REQUIRED_CONFIG_VARS) {
    const r = readAdminConfig(fullEnv({ [k]: "   " }));
    assert.equal(r.ok, false, `${k} whitespace-only must be missing`);
    assert.ok(r.missing.includes(k));
  }
});

test("readAdminConfig succeeds with all four present; ADMIN_ALLOWED_DOMAIN stays optional", () => {
  const r = readAdminConfig(fullEnv());
  assert.equal(r.ok, true);
  assert.equal(r.allowedDomain, "");
});

/* ------------------------------------------------------------------ *
 * T13 (logic half) — resolveSession
 *
 * The composition half — that requireAdmin() actually calls this — is a live
 * check in T12, because requireAdmin needs next/headers and cannot be loaded
 * by `node --test`. See 04-review.md M3.
 * ------------------------------------------------------------------ */

test("T13a: no cookie => no session", async () => {
  assert.equal(await resolveSession(undefined, fullEnv(), NOW), null);
  assert.equal(await resolveSession("", fullEnv(), NOW), null);
});

test("T13b: forged cookie => no session", async () => {
  const forged = await signSession(payload(), OTHER_SECRET);
  assert.equal(await resolveSession(forged, fullEnv(), NOW), null);
});

test("T13c: valid cookie whose email has left the allowlist => no session", async () => {
  const c = await signSession(payload(), SECRET);
  /* Same cookie, still cryptographically valid and unexpired. */
  assert.ok(await resolveSession(c, fullEnv(), NOW), "sanity: valid while allowlisted");
  /* Editor removed from the env var and redeployed. Revocation must be
     immediate, not deferred to cookie expiry 8 hours later. */
  const revoked = fullEnv({ ADMIN_ALLOWED_EMAILS: "someone-else@lanshore.com" });
  assert.equal(await resolveSession(c, revoked, NOW), null);
});

test("T13d: misconfigured env => no session, even with a perfect cookie", async () => {
  const c = await signSession(payload(), SECRET);
  const broken = fullEnv();
  delete broken.GOOGLE_OAUTH_CLIENT_ID;
  assert.equal(await resolveSession(c, broken, NOW), null);
});

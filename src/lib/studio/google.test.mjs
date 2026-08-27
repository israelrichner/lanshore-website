/**
 * Tests for the Google OAuth core — source plan §10.4 T11, T11a, T12.
 *
 * Table-driven against a LOCALLY GENERATED RSA key. No network. This proves
 * our verifier REJECTS malformed, wrongly-signed, wrongly-audienced and
 * alg-confused tokens. It does NOT prove it accepts a genuine Google token —
 * only a real sign-in does that, and assumptions.md A2 records it as open.
 *
 * Run: node --test src/lib/studio/google.test.mjs
 */

import test from "node:test";
import assert from "node:assert/strict";
import {
  buildAuthUrl,
  verifyIdToken,
  createJwksCache,
  GOOGLE_AUTH_ENDPOINT,
} from "./google.mjs";

const subtle = globalThis.crypto.subtle;
const enc = new TextEncoder();

const CLIENT_ID = "test-client-id.apps.googleusercontent.com";
const NONCE = "nonce-abc";
const NOW = 1_800_000_000;

const b64url = (bytes) => {
  let bin = "";
  for (const b of new Uint8Array(bytes)) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const b64urlJson = (o) => b64url(enc.encode(JSON.stringify(o)));

/* One RSA keypair for the whole suite. */
const pair = await subtle.generateKey(
  { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
  true,
  ["sign", "verify"]
);
const publicJwk = { ...(await subtle.exportKey("jwk", pair.publicKey)), kid: "kid-1", alg: "RS256", use: "sig" };

/* A second, unrelated keypair — used to forge a signature. */
const otherPair = await subtle.generateKey(
  { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
  true,
  ["sign", "verify"]
);

async function makeToken({ header = {}, claims = {}, signWith = pair.privateKey } = {}) {
  const h = b64urlJson({ alg: "RS256", typ: "JWT", kid: "kid-1", ...header });
  const c = b64urlJson({
    iss: "https://accounts.google.com",
    aud: CLIENT_ID,
    exp: NOW + 3600,
    iat: NOW,
    nonce: NONCE,
    email: "editor@lanshore.com",
    email_verified: true,
    ...claims,
  });
  const sig = signWith
    ? b64url(await subtle.sign("RSASSA-PKCS1-v1_5", signWith, enc.encode(`${h}.${c}`)))
    : "";
  return `${h}.${c}.${sig}`;
}

const jwksOf = (keys, counter = {}) =>
  createJwksCache({
    fetchJwks: async () => {
      counter.n = (counter.n ?? 0) + 1;
      return { keys };
    },
  });

const verify = (token, jwks) => verifyIdToken(token, { clientId: CLIENT_ID, nonce: NONCE, jwks, now: NOW });

/* ------------------------------------------------------------------ *
 * Sanity — a good token must pass, or every rejection below is vacuous
 * ------------------------------------------------------------------ */

test("a well-formed token signed by the published key verifies", async () => {
  const claims = await verify(await makeToken(), jwksOf([publicJwk]));
  assert.ok(claims, "expected the happy path to verify");
  assert.equal(claims.email, "editor@lanshore.com");
});

/* ------------------------------------------------------------------ *
 * T11 — claim validation
 * ------------------------------------------------------------------ */

const T11_CASES = [
  ["wrong aud", { aud: "someone-elses-client-id" }],
  ["empty aud", { aud: "" }],
  ["missing aud", { aud: undefined }],
  ["wrong iss", { iss: "https://evil.example" }],
  ["subtly wrong iss", { iss: "https://accounts.google.com.evil.example" }],
  ["missing iss", { iss: undefined }],
  ["expired exp", { exp: NOW - 1 }],
  ["missing exp", { exp: undefined }],
  ["non-numeric exp", { exp: "9999999999" }],
  ["mismatched nonce", { nonce: "not-the-nonce" }],
  ["missing nonce", { nonce: undefined }],
  ["missing email", { email: undefined }],
  ["iat far in the future", { iat: NOW + 100000 }],
];

for (const [name, claims] of T11_CASES) {
  test(`T11: rejects ${name}`, async () => {
    assert.equal(await verify(await makeToken({ claims }), jwksOf([publicJwk])), null);
  });
}

test("T11: rejects a signature made with a different key", async () => {
  const token = await makeToken({ signWith: otherPair.privateKey });
  assert.equal(await verify(token, jwksOf([publicJwk])), null);
});

test("T11: rejects a tampered payload with an otherwise valid signature", async () => {
  const token = await makeToken();
  const [h, , s] = token.split(".");
  const swapped = b64urlJson({ iss: "https://accounts.google.com", aud: CLIENT_ID, exp: NOW + 3600, nonce: NONCE, email: "attacker@evil.example" });
  assert.equal(await verify(`${h}.${swapped}.${s}`, jwksOf([publicJwk])), null);
});

test("T11: rejects structurally malformed tokens", async () => {
  const jwks = jwksOf([publicJwk]);
  for (const bad of ["", "a", "a.b", "a.b.c.d", "...", null, undefined, 42, "!!!.???.***"]) {
    assert.equal(await verifyIdToken(bad, { clientId: CLIENT_ID, nonce: NONCE, jwks, now: NOW }), null, `should reject ${String(bad)}`);
  }
});

/* ------------------------------------------------------------------ *
 * T12 — the alg trap
 * ------------------------------------------------------------------ */

test("T12: rejects alg:none with an empty signature", async () => {
  const token = await makeToken({ header: { alg: "none" }, signWith: null });
  assert.equal(await verify(token, jwksOf([publicJwk])), null);
});

test("T12: rejects a symmetric alg", async () => {
  for (const alg of ["HS256", "HS384", "HS512"]) {
    const token = await makeToken({ header: { alg } });
    assert.equal(await verify(token, jwksOf([publicJwk])), null, `${alg} must be rejected`);
  }
});

test("T12: rejects a different asymmetric alg even though it is 'strong'", async () => {
  /* Only RS256 is expected. Accepting anything the header names, even
     something reputable, is the same class of bug. */
  for (const alg of ["RS512", "PS256", "ES256"]) {
    const token = await makeToken({ header: { alg } });
    assert.equal(await verify(token, jwksOf([publicJwk])), null, `${alg} must be rejected`);
  }
});

test("T12: rejects a published key whose own alg disagrees", async () => {
  const token = await makeToken();
  assert.equal(await verify(token, jwksOf([{ ...publicJwk, alg: "RS512" }])), null);
});

test("T12: rejects a non-RSA key type", async () => {
  const token = await makeToken();
  assert.equal(await verify(token, jwksOf([{ ...publicJwk, kty: "oct" }])), null);
});

/* ------------------------------------------------------------------ *
 * T11a — JWKS rotation
 * ------------------------------------------------------------------ */

test("T11a: an unknown kid triggers exactly one refetch, then rejects", async () => {
  const counter = {};
  const jwks = jwksOf([publicJwk], counter);
  const token = await makeToken({ header: { kid: "kid-does-not-exist" } });
  assert.equal(await verify(token, jwks), null);
  /* One initial load + one rotation refetch. Bounded, so a bogus kid cannot
     drive unlimited outbound requests. */
  assert.equal(jwks.fetchCount, 2, "expected exactly one refetch on unknown kid");
});

test("T11a: a rotated key is picked up by the refetch rather than failing", async () => {
  /* First call publishes only the old key; the second call publishes the new
     one. A cache without a rotation path would reject forever. */
  let call = 0;
  const rotated = { ...publicJwk, kid: "kid-2" };
  const jwks = createJwksCache({
    fetchJwks: async () => {
      call += 1;
      return { keys: call === 1 ? [{ ...publicJwk, kid: "kid-old" }] : [rotated] };
    },
  });
  const token = await makeToken({ header: { kid: "kid-2" } });
  const claims = await verify(token, jwks);
  assert.ok(claims, "rotated key should verify after the refetch");
  assert.equal(claims.email, "editor@lanshore.com");
});

test("T11a: a known kid does not trigger a refetch", async () => {
  const jwks = jwksOf([publicJwk]);
  await verify(await makeToken(), jwks);
  assert.equal(jwks.fetchCount, 1);
});

/* ------------------------------------------------------------------ *
 * Authorization URL
 * ------------------------------------------------------------------ */

test("buildAuthUrl sets the required parameters", () => {
  const u = new URL(
    buildAuthUrl({ clientId: CLIENT_ID, redirectUri: "https://lanshore.com/api/studio/auth/callback", state: "s", nonce: "n" })
  );
  assert.ok(u.toString().startsWith(GOOGLE_AUTH_ENDPOINT));
  assert.equal(u.searchParams.get("client_id"), CLIENT_ID);
  assert.equal(u.searchParams.get("response_type"), "code");
  assert.equal(u.searchParams.get("scope"), "openid email profile");
  assert.equal(u.searchParams.get("state"), "s");
  assert.equal(u.searchParams.get("nonce"), "n");
  assert.equal(u.searchParams.get("prompt"), "select_account");
  assert.equal(u.searchParams.get("hd"), null, "hd omitted when no domain configured");
});

test("buildAuthUrl includes hd only when a domain is given", () => {
  const u = new URL(
    buildAuthUrl({ clientId: CLIENT_ID, redirectUri: "https://lanshore.com/cb", state: "s", nonce: "n", hd: "lanshore.com" })
  );
  assert.equal(u.searchParams.get("hd"), "lanshore.com");
});

test("buildAuthUrl refuses to build without state or nonce", () => {
  const base = { clientId: CLIENT_ID, redirectUri: "https://lanshore.com/cb", state: "s", nonce: "n" };
  for (const k of ["clientId", "redirectUri", "state", "nonce"]) {
    assert.throws(() => buildAuthUrl({ ...base, [k]: "" }), /required/, `missing ${k} must throw`);
  }
});

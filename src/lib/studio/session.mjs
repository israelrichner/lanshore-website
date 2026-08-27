/**
 * Studio session core — cookie signing/verification, the email allowlist, and
 * the fail-closed configuration guard.
 *
 * Plain `.mjs` with no `@/*` imports, deliberately: Node's resolver never
 * reads `tsconfig.json`, and `node --test` cannot load `.ts`. Keeping the
 * security logic here is what makes it testable with zero new packages. The
 * `.ts` wrapper re-exports this and adds `requireAdmin()`, which needs
 * `next/headers` and therefore cannot live in a file the test runner loads.
 *
 * Uses `globalThis.crypto.subtle`, available in both the Node runtime and the
 * proxy runtime, so the same verification runs in both places.
 *
 * NOTHING HERE TRUSTS ITS INPUT. Every function is reachable, directly or
 * indirectly, from an unauthenticated HTTP request.
 */

const enc = new TextEncoder();
const dec = new TextDecoder();

/** Seconds. Deliberately short enough that a stolen laptop is bounded. */
export const SESSION_TTL_SECONDS = 8 * 60 * 60;

export const COOKIE_NAME = "studio_session";

/* ------------------------------------------------------------------ *
 * base64url
 * ------------------------------------------------------------------ */

function toBase64Url(bytes) {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s) {
  if (typeof s !== "string" || s.length === 0) return null;
  /* Reject anything that is not strictly base64url. atob() is lenient about
     some of this, and a lenient decoder in front of a signature check is how
     malleable-encoding bugs happen. */
  if (!/^[A-Za-z0-9_-]+$/.test(s)) return null;
  const padded = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
  try {
    const bin = atob(padded);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ *
 * Signing
 * ------------------------------------------------------------------ */

async function hmacKey(secret, usages) {
  return globalThis.crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    usages
  );
}

/**
 * @param {{email: string, iat: number, exp: number}} payload
 * @param {string} secret
 * @returns {Promise<string>} `base64url(payload).base64url(sig)`
 */
export async function signSession(payload, secret) {
  if (!secret) throw new Error("signSession: missing secret");
  const body = toBase64Url(enc.encode(JSON.stringify(payload)));
  const key = await hmacKey(secret, ["sign"]);
  const sig = await globalThis.crypto.subtle.sign("HMAC", key, enc.encode(body));
  return `${body}.${toBase64Url(new Uint8Array(sig))}`;
}

/**
 * Verify signature and expiry. Returns the payload, or null.
 *
 * Returns null rather than throwing: every caller's correct response to a bad
 * cookie is identical (treat as signed-out), and a thrown error tempts a
 * caller into distinguishing failure modes it should not distinguish.
 *
 * @param {string} value cookie value
 * @param {string} secret
 * @param {number} [nowSeconds]
 */
export async function verifySession(value, secret, nowSeconds = Math.floor(Date.now() / 1000)) {
  if (!secret || typeof value !== "string") return null;

  /* Exactly two segments. "body" alone (no signature) and "body." (empty
     signature) must both fail — there is no unsigned-implies-trusted path. */
  const parts = value.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  if (!body || !sig) return null;

  const sigBytes = fromBase64Url(sig);
  const bodyBytes = fromBase64Url(body);
  if (!sigBytes || !bodyBytes) return null;

  const key = await hmacKey(secret, ["verify"]);
  /* crypto.subtle.verify is constant-time by construction. Never compare
     signature strings with ===. */
  const ok = await globalThis.crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(body));
  if (!ok) return null;

  let payload;
  try {
    payload = JSON.parse(dec.decode(bodyBytes));
  } catch {
    return null;
  }
  if (!payload || typeof payload !== "object") return null;
  if (typeof payload.email !== "string" || !payload.email) return null;
  if (typeof payload.exp !== "number" || !Number.isFinite(payload.exp)) return null;
  if (payload.exp <= nowSeconds) return null;

  return payload;
}

/* ------------------------------------------------------------------ *
 * Allowlist — the gate
 * ------------------------------------------------------------------ */

/**
 * Parse `ADMIN_ALLOWED_EMAILS`. An unset, empty, or whitespace-only value
 * yields an EMPTY list, and an empty list authorizes nobody.
 */
export function parseAllowlist(raw) {
  if (typeof raw !== "string") return [];
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Is this identity authorized?
 *
 * Three independent conditions, ANDed:
 *   1. Google says the address is verified.
 *   2. The address is on the allowlist, matched exactly after normalisation.
 *   3. If ADMIN_ALLOWED_DOMAIN is set, the address is in that domain.
 *
 * Fails closed on every unexpected shape.
 *
 * @param {{email?: string, email_verified?: boolean}} identity
 * @param {{allowedEmails?: string, allowedDomain?: string}} config
 */
export function isAuthorized(identity, config) {
  if (!identity || typeof identity !== "object") return false;

  /* An unverified address means Google will not vouch that the holder
     controls it. Being on the allowlist does not override that. */
  if (identity.email_verified !== true) return false;

  const email = typeof identity.email === "string" ? identity.email.trim().toLowerCase() : "";
  if (!email || !email.includes("@")) return false;

  const allowed = parseAllowlist(config?.allowedEmails);
  /* THE line. An empty allowlist is not "no restriction" — it is "nobody".
     Reading it the other way is the single most likely bug in this feature. */
  if (allowed.length === 0) return false;

  /* Exact membership, never endsWith/includes — `editor@lanshore.com` must
     not be matched by `editor@lanshore.com.attacker.com`. */
  if (!allowed.includes(email)) return false;

  const domain = typeof config?.allowedDomain === "string" ? config.allowedDomain.trim().toLowerCase() : "";
  if (domain) {
    /* ANDed with the allowlist, never a substitute for it. */
    if (!email.endsWith(`@${domain}`)) return false;
  }

  return true;
}

/* ------------------------------------------------------------------ *
 * Fail-closed configuration
 * ------------------------------------------------------------------ */

export const REQUIRED_CONFIG_VARS = [
  "GOOGLE_OAUTH_CLIENT_ID",
  "GOOGLE_OAUTH_CLIENT_SECRET",
  "ADMIN_SESSION_SECRET",
  "ADMIN_ALLOWED_EMAILS",
];

/**
 * Read admin config, failing closed.
 *
 * Deliberately stricter than this repo's existing `getFormId`
 * (src/lib/hubspot.ts:24-36), which returns undefined and lets the caller
 * decide. That leniency is right for an optional marketing form and wrong
 * for a gate on writes: a half-configured deploy must be a closed door.
 *
 * A whitespace-only value counts as MISSING, not as present-but-empty.
 */
export function readAdminConfig(env) {
  const source = env ?? {};
  const get = (k) => (typeof source[k] === "string" ? source[k].trim() : "");

  const missing = REQUIRED_CONFIG_VARS.filter((k) => get(k) === "");
  if (missing.length > 0) return { ok: false, missing };

  return {
    ok: true,
    clientId: get("GOOGLE_OAUTH_CLIENT_ID"),
    clientSecret: get("GOOGLE_OAUTH_CLIENT_SECRET"),
    sessionSecret: get("ADMIN_SESSION_SECRET"),
    allowedEmails: get("ADMIN_ALLOWED_EMAILS"),
    allowedDomain: get("ADMIN_ALLOWED_DOMAIN"),
  };
}

/**
 * The composed check: a cookie is only good if it verifies AND its email is
 * still authorized *right now*.
 *
 * Re-checking the allowlist on every call is what makes removing someone from
 * the env var revoke their live session immediately, rather than whenever
 * their 8-hour cookie happens to expire. It is the only revocation lever a
 * stateless session has that is finer than rotating the secret.
 */
export async function resolveSession(cookieValue, env, nowSeconds) {
  const config = readAdminConfig(env);
  if (!config.ok) return null;

  const payload = await verifySession(cookieValue, config.sessionSecret, nowSeconds);
  if (!payload) return null;

  /* email_verified was established at sign-in; the cookie only exists because
     it passed. Re-assert it here so this function has one contract. */
  if (!isAuthorized({ email: payload.email, email_verified: true }, config)) return null;

  return payload;
}

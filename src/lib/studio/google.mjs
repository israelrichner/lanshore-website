/**
 * Google OAuth core — authorization URL, code exchange, JWKS handling, and
 * full `id_token` verification.
 *
 * Plain `.mjs`, no `@/*` imports, for the same reason as session.mjs.
 *
 * Verification is done LOCALLY against Google's published keys rather than by
 * calling Google's tokeninfo endpoint. The deciding factor was testability,
 * not elegance (03-design.md Fork 1): local verification can be exercised
 * offline against a locally generated RSA key, which is what makes T11/T12
 * possible at all. A design whose security-critical step can only be tested
 * with a live network call forfeits its main defence.
 */

const enc = new TextEncoder();
const dec = new TextDecoder();

export const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
export const GOOGLE_JWKS_URI = "https://www.googleapis.com/oauth2/v3/certs";

/** Google issues with either form. Both are legitimate; nothing else is. */
export const VALID_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];

/** The ONLY algorithm we accept. Never read from the token header. */
const EXPECTED_ALG = "RS256";

/* ------------------------------------------------------------------ *
 * base64url
 * ------------------------------------------------------------------ */

function fromBase64Url(s) {
  if (typeof s !== "string" || s.length === 0) return null;
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

function decodeJsonSegment(seg) {
  const bytes = fromBase64Url(seg);
  if (!bytes) return null;
  try {
    const v = JSON.parse(dec.decode(bytes));
    return v && typeof v === "object" ? v : null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ *
 * Authorization URL
 * ------------------------------------------------------------------ */

/**
 * @param {{clientId: string, redirectUri: string, state: string, nonce: string, hd?: string}} args
 *
 * `redirectUri` must be built by the caller from the SITE_URL constant, never
 * from a request header — a header-derived redirect_uri is attacker-
 * controllable and turns the callback into an open redirect.
 */
export function buildAuthUrl({ clientId, redirectUri, state, nonce, hd }) {
  if (!clientId || !redirectUri || !state || !nonce) {
    throw new Error("buildAuthUrl: clientId, redirectUri, state and nonce are all required");
  }
  const u = new URL(GOOGLE_AUTH_ENDPOINT);
  u.searchParams.set("client_id", clientId);
  u.searchParams.set("redirect_uri", redirectUri);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("scope", "openid email profile");
  u.searchParams.set("state", state);
  u.searchParams.set("nonce", nonce);
  u.searchParams.set("prompt", "select_account");
  /* `hd` is a UI hint that pre-filters the account chooser. Google does NOT
     enforce it, so it is never a check — the allowlist is (session.mjs). */
  if (hd) u.searchParams.set("hd", hd);
  return u.toString();
}

/* ------------------------------------------------------------------ *
 * Code exchange
 * ------------------------------------------------------------------ */

/**
 * `fetchImpl` is injectable so tests never touch the network.
 */
export async function exchangeCode({ code, clientId, clientSecret, redirectUri }, fetchImpl = globalThis.fetch) {
  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });
  const res = await fetchImpl(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) return null;
  const json = await res.json().catch(() => null);
  if (!json || typeof json.id_token !== "string") return null;
  return json;
}

/* ------------------------------------------------------------------ *
 * JWKS cache
 * ------------------------------------------------------------------ */

/**
 * Cache Google's signing keys, with the rotation path that a naive cache
 * misses.
 *
 * Google rotates keys. Caching by `kid` with no refresh means the first token
 * signed with a new key fails, and every sign-in breaks until the process
 * restarts — on serverless, intermittently and unpredictably (04-review.md
 * M2). So: on an unknown `kid`, refetch ONCE and retry. Still unknown after
 * that is a real rejection, not a stale cache.
 *
 * @param {object} options
 * @param {() => Promise<{ keys: Array<Record<string, any>> }>} options.fetchJwks
 * @param {number} [options.ttlSeconds]
 */
export function createJwksCache({ fetchJwks, ttlSeconds = 3600 }) {
  let keys = null;
  let fetchedAt = -Infinity;
  let fetches = 0;

  async function load(now) {
    fetches += 1;
    const jwks = await fetchJwks();
    keys = new Map((jwks?.keys ?? []).filter((k) => k && k.kid).map((k) => [k.kid, k]));
    fetchedAt = now;
  }

  return {
    get fetchCount() {
      return fetches;
    },
    async getKey(kid, now = Math.floor(Date.now() / 1000)) {
      if (!kid) return null;
      if (keys === null || now - fetchedAt >= ttlSeconds) await load(now);
      if (keys.has(kid)) return keys.get(kid);
      /* Unknown kid: refetch once, then give up. Bounded so a token with a
         bogus kid cannot drive unlimited outbound requests. */
      await load(now);
      return keys.get(kid) ?? null;
    },
  };
}

/* ------------------------------------------------------------------ *
 * id_token verification
 * ------------------------------------------------------------------ */

/**
 * Verify a Google `id_token`. Returns the claims, or null.
 *
 * @param {string} token
 * @param {{clientId: string, nonce: string, jwks: {getKey: Function}, now?: number}} opts
 */
export async function verifyIdToken(token, { clientId, nonce, jwks, now = Math.floor(Date.now() / 1000) }) {
  if (typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerSeg, payloadSeg, sigSeg] = parts;
  if (!headerSeg || !payloadSeg || !sigSeg) return null;

  const header = decodeJsonSegment(headerSeg);
  if (!header) return null;

  /* ---- THE ALG TRAP ----------------------------------------------------
     The algorithm comes from OUR expectation, never from the token. A token
     claiming `alg: none` must be rejected here, before any key is selected,
     and so must any symmetric algorithm (HS256 et al) — the classic attack
     is signing with the *public* key as an HMAC secret. Checking this after
     key selection, or trusting header.alg to choose the algorithm, is the
     vulnerability. (source plan T12) */
  if (header.alg !== EXPECTED_ALG) return null;
  if (header.typ !== undefined && header.typ !== "JWT") return null;

  const jwk = await jwks.getKey(header.kid, now);
  if (!jwk) return null;
  if (jwk.kty !== "RSA") return null;
  /* If the key itself advertises an algorithm, it must agree with ours. */
  if (jwk.alg !== undefined && jwk.alg !== EXPECTED_ALG) return null;

  const sig = fromBase64Url(sigSeg);
  if (!sig) return null;

  let key;
  try {
    key = await globalThis.crypto.subtle.importKey(
      "jwk",
      { ...jwk, alg: EXPECTED_ALG, key_ops: ["verify"], ext: true },
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"]
    );
  } catch {
    return null;
  }

  const ok = await globalThis.crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    sig,
    enc.encode(`${headerSeg}.${payloadSeg}`)
  );
  if (!ok) return null;

  const claims = decodeJsonSegment(payloadSeg);
  if (!claims) return null;

  /* Every claim check below is a rejection path that has been a real CVE in
     someone's OAuth implementation. */
  if (!VALID_ISSUERS.includes(claims.iss)) return null;
  if (claims.aud !== clientId) return null;
  if (typeof claims.exp !== "number" || claims.exp <= now) return null;
  if (typeof claims.iat === "number" && claims.iat > now + 300) return null; // clock-skew sanity
  if (!nonce || claims.nonce !== nonce) return null;
  if (typeof claims.email !== "string" || !claims.email) return null;

  return claims;
}

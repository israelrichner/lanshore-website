/**
 * Typed surface over `google.mjs`.
 *
 * Thin re-export only — no rule from the `.mjs` is reimplemented here. The
 * verification logic must have exactly one implementation, and it is the one
 * `node --test` exercises.
 */

import {
  GOOGLE_AUTH_ENDPOINT,
  GOOGLE_TOKEN_ENDPOINT,
  GOOGLE_JWKS_URI,
  VALID_ISSUERS,
  buildAuthUrl,
  exchangeCode,
  createJwksCache,
  verifyIdToken,
} from "./google.mjs";

export type GoogleIdentity = {
  email: string;
  email_verified: boolean;
  sub: string;
  name?: string;
  hd?: string;
  nonce?: string;
  aud: string;
  iss: string;
  exp: number;
  iat?: number;
};

export type JwksCache = { getKey(kid: string, now?: number): Promise<Record<string, unknown> | null> };

export {
  GOOGLE_AUTH_ENDPOINT,
  GOOGLE_TOKEN_ENDPOINT,
  GOOGLE_JWKS_URI,
  VALID_ISSUERS,
  buildAuthUrl,
  exchangeCode,
  createJwksCache,
  verifyIdToken,
};

/* One cache per server instance. Google's keys are shared across the whole
   process, so a per-request cache would refetch on every sign-in. */
export const googleJwks: JwksCache = createJwksCache({
  fetchJwks: async () => {
    const res = await fetch(GOOGLE_JWKS_URI);
    if (!res.ok) throw new Error(`JWKS fetch failed: ${res.status}`);
    return res.json();
  },
});

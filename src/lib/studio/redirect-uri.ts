import { SITE_URL } from "@/lib/site";

/**
 * The OAuth `redirect_uri`, built from trusted configuration only.
 *
 * NEVER derive this from a request header. A header-derived redirect_uri is
 * attacker-controllable and turns the callback into an open redirect that
 * leaks the authorization code.
 *
 * Exactly two values are possible, and both are pre-registered on the Google
 * client. `NODE_ENV` is build-time configuration, not request input, so
 * branching on it does not reintroduce the hazard.
 *
 * Vercel preview hostnames are per-deployment and cannot be pre-registered,
 * so the admin does not work on preview URLs. That is deliberate: a preview
 * deployment must not be able to publish to main.
 */
export function getRedirectUri(): string {
  const base = process.env.NODE_ENV === "development" ? "http://localhost:3000" : SITE_URL;
  return `${base}/api/studio/auth/callback`;
}

/** Cookie carrying the OAuth `state` and `nonce` between login and callback. */
export const OAUTH_COOKIE = "studio_oauth";

/** Short: a long-lived state cookie only widens the replay window. */
export const OAUTH_COOKIE_MAX_AGE = 600;

export const secureCookies = process.env.NODE_ENV !== "development";

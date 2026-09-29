/**
 * The proxy's studio routing decision, as a pure function.
 *
 * Plain .mjs (like session.mjs) so `node --test` can pin every row without a
 * Next runtime. src/proxy.ts does the I/O — reading the cookie, verifying the
 * HMAC — and then asks this module what to do.
 *
 * Decision table for a request WITHOUT a plausible session:
 *
 *   /studio, /studio/          -> redirect to /studio/signed-out  (the URL
 *                                  editors type; a bare 404 there read as
 *                                  "the admin is gone")
 *   /login                     -> redirect to /studio/signed-out  (alias)
 *   STUDIO_EXEMPT_PATHS        -> pass through (sign-in page + OAuth routes)
 *   any other /studio/*,
 *   /api/studio/*              -> bare 404, unchanged
 *
 * With a session, every studio path passes through; the real gate is
 * requireAdmin()/requireAdminRoute() in each page and handler.
 *
 * No redirect loop is possible: the only redirect target is
 * /studio/signed-out, which is exempt and therefore always passes through.
 */

export const SIGNED_OUT_PATH = "/studio/signed-out";

/**
 * Paths reachable WITHOUT a session. Compared by EXACT EQUALITY, never by
 * prefix, and the list is exhaustive.
 *
 * A `startsWith("/studio/signed-out")` would also exempt
 * `/studio/signed-out-and-then-something`, and this check runs before the
 * real gate — so a prefix match here hands an attacker a way past it.
 *
 * The three auth routes are exempt because they are their own boundary: each
 * validates state/nonce/id_token/allowlist itself, and there is by definition
 * no session while signing in. 404ing them would break the flow exactly the
 * way review blocker B3 described.
 */
export const STUDIO_EXEMPT_PATHS = new Set([
  SIGNED_OUT_PATH,
  "/api/studio/auth/login",
  "/api/studio/auth/callback",
  "/api/studio/auth/logout",
]);

/** Exact matches only — `/studio/anything` must keep its 404. */
const SIGNED_OUT_REDIRECT_PATHS = new Set(["/studio", "/studio/"]);

/** Public alias for the sign-in page. Not a studio path: no session needed, no cookie read. */
export const LOGIN_ALIAS_PATH = "/login";

export function isStudioPath(pathname) {
  return (
    pathname === "/studio" ||
    pathname.startsWith("/studio/") ||
    pathname.startsWith("/api/studio/")
  );
}

/** True when the decision depends on the session — lets the proxy skip the HMAC otherwise. */
export function needsSessionCheck(pathname) {
  return isStudioPath(pathname) && !STUDIO_EXEMPT_PATHS.has(pathname);
}

/**
 * @param {string} pathname
 * @param {boolean} hasSession  only consulted when needsSessionCheck(pathname)
 * @returns {{ action: "next" } | { action: "redirect", location: string } | { action: "notFound" }}
 */
export function studioGate(pathname, hasSession) {
  if (pathname === LOGIN_ALIAS_PATH) return { action: "redirect", location: SIGNED_OUT_PATH };
  if (!needsSessionCheck(pathname) || hasSession) return { action: "next" };
  if (SIGNED_OUT_REDIRECT_PATHS.has(pathname)) return { action: "redirect", location: SIGNED_OUT_PATH };
  return { action: "notFound" };
}

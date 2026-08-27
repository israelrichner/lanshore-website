/**
 * Shared gate deciding whether a marketing tracker may load.
 *
 * Extracted into a pure `.mjs` because the original plan verified this by
 * comparing script tags in served HTML — and baseline measurement showed
 * there are NONE on any page. Both trackers are `"use client"` and inject
 * after hydration, so that check would have compared 0 to 0 and passed
 * vacuously (test/baseline.md T8).
 *
 * Pure and synchronous so `node --test` can exercise every branch.
 */

/* Keep in sync with CANONICAL_HOSTS in src/proxy.ts:12 and with each other.
   Non-canonical hosts (*.vercel.app previews, localhost) must not pollute
   the production analytics properties. */
export const CANONICAL_HOSTS = new Set(["lanshore.com", "www.lanshore.com"]);

/**
 * The admin is not a marketing surface.
 *
 * Editors working in /studio must not land in GA4 or HubSpot: it is their own
 * staff activity, it pollutes the funnel, and it puts identifiable internal
 * behaviour into two third-party systems for no benefit.
 *
 * Prefix match here, deliberately UNLIKE the proxy's exact-match exempt list
 * (src/proxy.ts). The goals are opposite: the proxy must not over-exempt, so
 * it matches exactly; this must not under-exclude, so it matches broadly.
 */
export function isAdminPath(pathname) {
  return typeof pathname === "string" && (pathname === "/studio" || pathname.startsWith("/studio/"));
}

/**
 * @param {{hostname?: string, pathname?: string, force?: boolean}} ctx
 */
export function shouldLoadTracker({ hostname, pathname, force } = {}) {
  /* The admin exclusion beats the force override: forcing a tracker on for a
     preview host is a debugging aid, not a reason to start recording editor
     sessions. */
  if (isAdminPath(pathname)) return false;
  if (force === true) return true;
  return CANONICAL_HOSTS.has(String(hostname ?? "").toLowerCase());
}

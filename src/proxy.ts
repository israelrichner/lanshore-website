import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
/* Imports the .mjs core DIRECTLY, never src/lib/studio/session.ts. The .ts
   wrapper pulls in next/headers for requireAdmin(), which does not belong in
   the proxy runtime. See 04-review.md M4. */
import { verifySession, COOKIE_NAME } from "@/lib/studio/session.mjs";
import { isStudioPath, needsSessionCheck, studioGate } from "@/lib/studio/proxy-gate.mjs";

/* Every page canonicalizes to lanshore.com (metadataBase), so any other host
   serving this build — *.vercel.app previews AND the production deployment's
   vercel.app alias before domain cutover — must not be indexed, or crawlers
   see two conflicting Lanshores. Host-based (not env-based) on purpose: the
   pre-cutover vercel.app alias runs with VERCEL_ENV=production. */
const CANONICAL_HOSTS = new Set(["lanshore.com", "www.lanshore.com"]);

/* Retired WordPress surface (pre-migration CMS). These paths are unmanaged in
   next.config.ts's redirect map and currently 403 at the platform layer, which
   Google retries instead of deindexing. Emit a true 410 so crawlers drop them
   for good. Checked inline (not via a separate config.matcher) because this
   file has no matcher — it must keep running on every request for the
   host-canonicalization check above; a matcher here would narrow that too. */
const WORDPRESS_DIRECTORIES = ["/wp-content", "/wp-includes", "/wp-admin", "/wp-json"];
const WORDPRESS_FILES = new Set(["/wp-login.php", "/xmlrpc.php"]);

function isRetiredWordPressPath(pathname: string): boolean {
  if (WORDPRESS_FILES.has(pathname)) return true;
  return WORDPRESS_DIRECTORIES.some(
    (dir) => pathname === dir || pathname.startsWith(`${dir}/`)
  );
}

/* ------------------------------------------------------------------ *
 * Studio admin
 * ------------------------------------------------------------------ */

/* Which studio paths are exempt, which redirect to the sign-in page and
   which 404 when signed out lives in proxy-gate.mjs as a pure function, so
   the table is unit-tested (proxy-gate.test.mjs). */

/**
 * Optimistic check only — Next's own guidance is explicit that proxy must not
 * be a full authorization solution. The real boundary is requireAdmin() in
 * each page and route handler. This exists to make the admin invisible
 * cheaply, not to be the gate.
 */
async function hasPlausibleSession(request: NextRequest): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  /* Fail closed: no secret configured means no session can be valid. */
  if (!secret) return false;
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) return false;
  return (await verifySession(cookie, secret)) !== null;
}

/* `proxy` is async because verifying the session HMAC uses crypto.subtle.
   That changes the return type for EVERY request to this site, not just
   /studio — the two behaviours above flow through the same function, which
   is why the baseline in
   .grokbit/plans/studio-auth-boundary/test/baseline/proxy-behaviour.mjs
   asserts all of them. */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isRetiredWordPressPath(pathname)) {
    return new NextResponse("410 Gone", {
      status: 410,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const studio = isStudioPath(pathname);
  /* The HMAC is only verified when the answer depends on it. */
  const hasSession = needsSessionCheck(pathname) ? await hasPlausibleSession(request) : false;
  const gate = studioGate(pathname, hasSession);

  if (gate.action === "redirect") {
    /* Signed-out /studio (and /login) -> the sign-in page. 307, not 308: a
       permanent redirect would be cached and keep bouncing an editor who has
       since signed in. The target is exempt, so this cannot loop. */
    const res = NextResponse.redirect(new URL(gate.location, request.url), 307);
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  if (gate.action === "notFound") {
    /* 404, not 401 and not a redirect, for every gated path except the bare
       /studio entry point: an unauthenticated hit on /studio/<anything> or
       /api/studio/* is indistinguishable from any other missing page. */
    return new NextResponse(null, {
      status: 404,
      headers: { "X-Robots-Tag": "noindex, nofollow" },
    });
  }

  const response = NextResponse.next();
  const host = (request.headers.get("host") ?? "").toLowerCase();
  if (!CANONICAL_HOSTS.has(host)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  /* The admin is never indexable, on any host. This is the ONLY control
     keeping /api/studio/* out of Googlebot's and the AI crawlers' indexes:
     the nine per-bot rules in src/app/robots.ts:22 carry `allow: "/"` with no
     disallow, which overrides the generic `disallow: "/api/"` for them
     (02-survey.md S4). robots.txt cannot help here — listing the admin path
     there would publish it. */
  if (studio) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

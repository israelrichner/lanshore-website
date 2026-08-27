import { NextResponse } from "next/server";
import { buildAuthUrl } from "@/lib/studio/google";
import { getAdminConfig } from "@/lib/studio/session";
import { getRedirectUri, OAUTH_COOKIE, OAUTH_COOKIE_MAX_AGE, secureCookies } from "@/lib/studio/redirect-uri";

/**
 * Start the OAuth flow.
 *
 * Exempt from the proxy's /studio 404 (there is by definition no session
 * yet), so this route is its own boundary and validates its own preconditions.
 */
export async function GET() {
  const config = getAdminConfig();
  /* Fail closed. A half-configured deploy must be a closed door — not a
     login flow that half-works and grants a session at the end of it. */
  if (!config.ok) return new NextResponse(null, { status: 404 });

  const state = crypto.randomUUID();
  const nonce = crypto.randomUUID();

  const url = buildAuthUrl({
    clientId: config.clientId,
    redirectUri: getRedirectUri(),
    state,
    nonce,
    hd: config.allowedDomain || undefined,
  });

  const res = NextResponse.redirect(url);
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  /* SameSite=Lax, not Strict: Strict would withhold this cookie on the
     top-level cross-site redirect back from Google and break the callback. */
  res.cookies.set(OAUTH_COOKIE, JSON.stringify({ state, nonce }), {
    httpOnly: true,
    secure: secureCookies,
    sameSite: "lax",
    path: "/api/studio/auth",
    maxAge: OAUTH_COOKIE_MAX_AGE,
  });
  return res;
}

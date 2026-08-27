import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { exchangeCode, verifyIdToken, googleJwks } from "@/lib/studio/google";
import { getAdminConfig, isAuthorized, signSession, COOKIE_NAME, SESSION_TTL_SECONDS } from "@/lib/studio/session";
import { getRedirectUri, OAUTH_COOKIE, secureCookies } from "@/lib/studio/redirect-uri";

/** Every failure lands here: back to the sign-in page, cookie cleared. */
function refuse(request: NextRequest, reason: string) {
  const url = new URL("/studio/signed-out", request.nextUrl.origin);
  url.searchParams.set("error", reason);
  const res = NextResponse.redirect(url);
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  /* Cleared on BOTH paths — a state cookie that survives a failed attempt is
     a replay window left open. */
  res.cookies.delete(OAUTH_COOKIE);
  return res;
}

export async function GET(request: NextRequest) {
  const config = getAdminConfig();
  if (!config.ok) return new NextResponse(null, { status: 404 });

  /* --- state: double-submit against the cookie set at login --- */
  const raw = request.cookies.get(OAUTH_COOKIE)?.value;
  if (!raw) return refuse(request, "expired");

  let expected: { state?: string; nonce?: string };
  try {
    expected = JSON.parse(raw);
  } catch {
    return refuse(request, "expired");
  }

  const returnedState = request.nextUrl.searchParams.get("state");
  if (!expected.state || !expected.nonce || returnedState !== expected.state) {
    return refuse(request, "state");
  }

  /* Google reports user-cancelled consent this way; not an error worth
     distinguishing to the visitor. */
  const code = request.nextUrl.searchParams.get("code");
  if (!code) return refuse(request, "denied");

  /* --- exchange, then verify --- */
  const tokens = await exchangeCode({
    code,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    redirectUri: getRedirectUri(),
  });
  if (!tokens) return refuse(request, "exchange");

  const claims = await verifyIdToken(tokens.id_token, {
    clientId: config.clientId,
    nonce: expected.nonce,
    jwks: googleJwks,
  });
  if (!claims) return refuse(request, "token");

  /* --- the gate --- */
  if (!isAuthorized(claims, config)) return refuse(request, "denied");

  const now = Math.floor(Date.now() / 1000);
  const cookie = await signSession(
    { email: String(claims.email).trim().toLowerCase(), iat: now, exp: now + SESSION_TTL_SECONDS },
    config.sessionSecret
  );

  const res = NextResponse.redirect(new URL("/studio", request.nextUrl.origin));
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.cookies.set(COOKIE_NAME, cookie, {
    httpOnly: true,
    secure: secureCookies,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  res.cookies.delete(OAUTH_COOKIE);
  return res;
}

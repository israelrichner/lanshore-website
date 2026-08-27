import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME } from "@/lib/studio/session";
import { secureCookies } from "@/lib/studio/redirect-uri";

/**
 * End the session.
 *
 * POST only, deliberately. This route is exempt from the proxy's /studio 404
 * so it works with an expired or invalid cookie — which also means any origin
 * can reach it. As a GET, a bare <img src=".../auth/logout"> on any page
 * would sign an editor out. Harmless, but trivially avoidable.
 */
export async function POST(request: NextRequest) {
  const res = NextResponse.redirect(new URL("/studio/signed-out", request.nextUrl.origin), { status: 303 });
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: secureCookies,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}

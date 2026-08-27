/**
 * Typed surface over `session.mjs`, plus the boundary function.
 *
 * This file exists because `requireAdmin()` needs `next/headers`, which
 * `node --test` cannot load. Everything testable stays in the `.mjs`; this
 * is a thin wrapper and MUST NOT reimplement any rule from it. Two copies of
 * an allowlist check is how the gate and its tests drift apart.
 */

import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import {
  COOKIE_NAME,
  SESSION_TTL_SECONDS,
  REQUIRED_CONFIG_VARS,
  signSession,
  verifySession,
  isAuthorized,
  parseAllowlist,
  readAdminConfig,
  resolveSession,
} from "./session.mjs";

export type StudioSession = { email: string; iat: number; exp: number };

export type AdminConfig =
  | { ok: false; missing: string[] }
  | {
      ok: true;
      clientId: string;
      clientSecret: string;
      sessionSecret: string;
      allowedEmails: string;
      allowedDomain: string;
    };

export { COOKIE_NAME, SESSION_TTL_SECONDS, REQUIRED_CONFIG_VARS, signSession, verifySession, isAuthorized, parseAllowlist };

export function getAdminConfig(): AdminConfig {
  return readAdminConfig(process.env) as AdminConfig;
}

/**
 * Resolve the caller's session, or null.
 *
 * Re-reads the allowlist on every call (in `resolveSession`), which is what
 * makes removing an email from the env var revoke a live session immediately
 * rather than 8 hours later when the cookie expires.
 */
export async function getSession(): Promise<StudioSession | null> {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  return (await resolveSession(value, process.env)) as StudioSession | null;
}

/**
 * The security boundary for admin PAGES.
 *
 * Fails one way and one way only: `notFound()`.
 *
 * This is deliberate and load-bearing. An editor who has been removed from
 * the allowlist still holds a cryptographically valid, unexpired cookie, so
 * they pass the proxy's optimistic check and arrive here. If this threw and
 * rendered a 500 while an unauthenticated stranger got a clean 404, the
 * difference would confirm to them that their cookie is still real. Every
 * unauthorised outcome must be byte-identical to a missing page.
 *
 * `notFound()` is also already this repo's idiom — src/app/blog/[slug]/page.tsx:45,
 * case-studies/[slug]/page.tsx:44, agentic-spm/[slug]/page.tsx:42.
 */
export async function requireAdmin(): Promise<StudioSession> {
  const session = await getSession();
  if (!session) notFound();
  return session;
}

/**
 * The boundary for admin ROUTE HANDLERS.
 *
 * Returns the session, or a bare bodyless 404. No error message: a route
 * handler that explains why it refused is a route handler that helps an
 * attacker enumerate. Call it as the FIRST statement, before reading the
 * request body.
 */
export async function requireAdminRoute(): Promise<
  { ok: true; session: StudioSession } | { ok: false; response: Response }
> {
  const session = await getSession();
  if (!session) return { ok: false, response: new Response(null, { status: 404 }) };
  return { ok: true, session };
}

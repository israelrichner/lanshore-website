import { requireAdmin } from "@/lib/studio/session";

/**
 * The security boundary for every admin page.
 *
 * It lives in a ROUTE GROUP rather than in src/app/studio/layout.tsx, and
 * that is not cosmetic. `/studio/signed-out` is the one admin URL a
 * signed-out person must be able to load — it carries the "Sign in with
 * Google" button. Putting requireAdmin() in the parent layout would gate it
 * too, and the sign-in page would 404 for exactly the people who need it,
 * leaving no way in at all.
 *
 * That is review blocker B3 in a different costume: B3 was the proxy 404ing
 * /studio/signed-out; this is the layout doing the same thing. The route
 * group keeps the URL as /studio while scoping the gate to the pages that
 * should have it.
 *
 * The proxy's 404 is an optimistic check only. This is the real gate.
 */
export default async function GatedStudioLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}

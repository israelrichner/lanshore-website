import type { Metadata } from "next";

/**
 * The one admin URL reachable without a session — this is what an editor
 * bookmarks.
 *
 * It sits OUTSIDE the (gated) route group on purpose. If the gate covered
 * it, the sign-in page would 404 for exactly the people who need it and
 * there would be no way in at all (review blocker B3).
 *
 * It is also the one admin URL a scanner can find, which is fine: it is a
 * sign-in button in front of Google. The unlinked path was never the
 * control — Google OAuth plus the allowlist is.
 */
export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

const MESSAGES: Record<string, string> = {
  denied: "That account is not permitted to sign in.",
  state: "That sign-in link expired or did not match. Please try again.",
  expired: "That sign-in attempt timed out. Please try again.",
  exchange: "Sign-in could not be completed. Please try again.",
  token: "Sign-in could not be verified. Please try again.",
};

export default async function SignedOutPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  /* Look the reason up in a fixed table rather than echoing the query
     string — reflecting arbitrary input onto the page is an XSS sink, and
     the distinctions are not useful to the visitor anyway. */
  const message = error ? (MESSAGES[error] ?? MESSAGES.exchange) : null;

  return (
    <main className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-ink">Lanshore Studio</h1>
      <p className="mt-2 text-muted">Sign in with your Lanshore Google account to continue.</p>

      {message && (
        <p className="mt-4 rounded border border-line bg-paper p-3 text-sm text-ink">{message}</p>
      )}

      <a
        href="/api/studio/auth/login"
        className="mt-6 inline-block rounded bg-accent px-5 py-2.5 font-semibold text-white hover:bg-accent-hover"
      >
        Sign in with Google
      </a>
    </main>
  );
}

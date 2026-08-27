import { getSession } from "@/lib/studio/session";

/**
 * Placeholder dashboard.
 *
 * P2 is the gate, not the thing behind it. There is deliberately nothing
 * editorial here — the editor UI and the GitHub write path are P3, and the
 * plan is explicit that P2 ships and is security-reviewed BEFORE any write
 * endpoint exists to attach to it.
 */
export default async function StudioPage() {
  /* The layout already called requireAdmin(); this only needs the identity. */
  const session = await getSession();

  return (
    <main>
      <h1 className="text-2xl font-bold text-ink">Studio</h1>
      <p className="mt-2 text-muted">
        Signed in as <span className="font-medium text-ink">{session?.email}</span>
      </p>

      <div className="mt-8 rounded-lg border border-line bg-paper p-6">
        <h2 className="font-bold text-ink">Nothing to edit yet</h2>
        <p className="mt-2 text-sm text-muted">
          This is the authentication boundary only. Editing blog posts, case studies and white
          papers arrives in the next package, once this gate has been reviewed.
        </p>
      </div>

      <form action="/api/studio/auth/logout" method="post" className="mt-8">
        <button
          type="submit"
          className="rounded border border-line px-4 py-2 text-sm font-medium text-ink hover:border-accent hover:text-accent"
        >
          Sign out
        </button>
      </form>
    </main>
  );
}

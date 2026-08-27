import type { Metadata } from "next";

/**
 * Admin shell. Deliberately does NOT call requireAdmin() — see
 * src/app/studio/(gated)/layout.tsx for why the gate is scoped to a route
 * group instead.
 *
 * This layout NESTS inside the public root layout, so /studio still renders
 * the site Header and Footer. App Router cannot remove ancestor chrome
 * without route groups at the app root, which would mean moving all 13 route
 * directories (02-survey.md S3). The owner chose to path-gate the analytics
 * instead, which removes the part that actually mattered: editor activity no
 * longer flows into GA4 or HubSpot.
 */
export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">{children}</div>;
}

import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import DemoDashboard from "@/components/DemoDashboard";
import CtaBand from "@/components/CtaBand";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Executive Dashboard Live Demo | AI Assisted SPM by Lanshore",
  description:
    "See the Executive Dashboards pillar of AI Assisted SPM by Lanshore in action: a working demo modeled on a financial institution, with views for the CRO, VP of Sales, CFO, and RevOps lead.",
  alternates: { canonical: "/agentic-spm/executive-dashboards/demo" },
  openGraph: {
    siteName: "Lanshore",
    locale: "en_US",
    title: "Executive Dashboard Live Demo | AI Assisted SPM by Lanshore",
    description:
      "A working executive comp dashboard demo with views for the CRO, VP of Sales, CFO, and RevOps lead.",
    url: "/agentic-spm/executive-dashboards/demo",
    type: "website",
  },
};

const PERSONA_ROWS = [
  { role: "CRO", solves: "Attainment vs. comp spend in real time, without waiting on ops" },
  { role: "VP of Sales", solves: "Rep and territory outliers spotted mid-quarter, not at review" },
  { role: "CFO", solves: "Accrual numbers they can trust before close" },
  { role: "RevOps lead", solves: "Fewer ad-hoc report requests; more time on plan design" },
];

export default function DemoPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Executive Dashboards", href: "/agentic-spm/executive-dashboards" },
          { name: "Live Demo", href: "/agentic-spm/executive-dashboards/demo" },
        ])}
      />

      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
            AI Assisted SPM · Executive Dashboards · Live Demo
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">See it with your own numbers</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            This is the Executive Dashboards pillar of AI Assisted SPM by Lanshore, running on
            Meridian Trust Bank, a fictitious regional financial institution. Pick your
            role and see what the dashboard answers for you. Every figure below is
            illustrative; on an engagement, this runs on your comp platform, CRM, and
            finance data.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* The dashboard's panel titles are h3. Without this h2 the outline
            jumps h1 to h3, which breaks the screen-reader outline and the
            document structure answer engines read. */}
        <h2 className="mb-6 text-2xl font-bold text-ink">
          Inside the Lanshore executive dashboard
        </h2>
        {/* DemoDashboard reads ?persona= via useSearchParams, which requires a
            Suspense boundary while the page prerenders. */}
        <Suspense
          fallback={<div className="min-h-[480px] rounded-xl bg-chart-surface shadow-2xl" />}
        >
          <DemoDashboard />
        </Suspense>
        <p className="mt-4 text-center text-xs text-muted">
          Meridian Trust Bank is fictitious; all data on this page is illustrative.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold text-ink">What each role gets</h2>
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr>
              <th className="border border-line bg-paper p-3 font-bold text-ink">Role</th>
              <th className="border border-line bg-paper p-3 font-bold text-ink">
                What this solves
              </th>
            </tr>
          </thead>
          <tbody>
            {PERSONA_ROWS.map((row) => (
              <tr key={row.role}>
                <th className="border border-line p-3 font-semibold text-ink">{row.role}</th>
                <td className="border border-line p-3 text-muted">{row.solves}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-6 text-muted">
          This demo is one pillar of AI Assisted SPM by Lanshore. Read more about{" "}
          <Link href="/agentic-spm/executive-dashboards" className="font-semibold text-accent">
            Executive Dashboards
          </Link>
          , or see{" "}
          <Link href="/agentic-spm/operations" className="font-semibold text-accent">
            SPM Operations
          </Link>{" "}
          and{" "}
          <Link href="/agentic-spm/custom-apps" className="font-semibold text-accent">
            Custom Apps
          </Link>
          .
        </p>
      </section>

      <CtaBand
        heading="Want this on your data?"
        body="Most engagements deliver a working executive dashboard against real data in four to six weeks."
      />
    </>
  );
}

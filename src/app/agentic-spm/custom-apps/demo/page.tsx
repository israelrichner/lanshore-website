import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import CustomAppDemo from "@/components/CustomAppDemo";
import CtaBand from "@/components/CtaBand";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Custom SPM App Live Demo | AI Assisted SPM by Lanshore",
  description:
    "See the Custom Apps pillar of AI Assisted SPM by Lanshore in action: a working custom comp tool with a statement viewer, dispute bot, approval workflows, and an interactive payout calculator.",
  alternates: { canonical: "/agentic-spm/custom-apps/demo" },
  openGraph: {
    siteName: "Lanshore",
    locale: "en_US",
    title: "Custom SPM App Live Demo | AI Assisted SPM by Lanshore",
    description:
      "A working custom comp tool demo: statement viewer, dispute bot, approvals, and an interactive payout calculator.",
    url: "/agentic-spm/custom-apps/demo",
    type: "website",
  },
};

export default function CustomAppsDemoPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Custom Apps", href: "/agentic-spm/custom-apps" },
          { name: "Live Demo", href: "/agentic-spm/custom-apps/demo" },
        ])}
      />

      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
            AI Assisted SPM · Custom Apps · Live Demo
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">
            A comp app your platform can&rsquo;t ship
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            This is the Custom Apps pillar of AI Assisted SPM by Lanshore: Meridian Comp Hub,
            a purpose-built tool for a fictitious regional bank. You&rsquo;re signed in as
            a relationship manager — read your statement, ask the dispute bot why June
            came in low, track a SPIF approval, and drag the payout calculator&rsquo;s
            sliders to model your quarter.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* The demo widget's panel titles are h3. Without this h2 the outline
            jumps h1 to h3, which breaks the screen-reader outline and the
            document structure answer engines read. */}
        <h2 className="mb-6 text-2xl font-bold text-ink">
          Inside the Lanshore custom comp app
        </h2>
        <CustomAppDemo />
        <p className="mt-4 text-center text-xs text-muted">
          Meridian Trust Bank is fictitious; all data on this page is illustrative.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h2 className="mb-4 text-2xl font-bold text-ink">What you just saw</h2>
        <p className="text-muted">
          Each tab is a capability from the Custom Apps pillar. The{" "}
          <strong className="text-ink">dispute bot</strong> answers statement questions
          from plan logic and live data, with clause references — questions that used to
          be week-long email threads. <strong className="text-ink">Approvals</strong>{" "}
          routes SPIFs and exceptions with full history, so nothing lives in an inbox.
          The <strong className="text-ink">payout calculator</strong> models draws,
          accelerators, and plan mechanics the platform can&rsquo;t — retiring the shadow
          spreadsheet only one person understands. Apps like this ship in eight to twelve
          weeks, documented and owned by you.
        </p>
        <p className="mt-6 text-muted">
          This demo is one pillar of AI Assisted SPM by Lanshore — read more about{" "}
          <Link href="/agentic-spm/custom-apps" className="font-semibold text-accent">
            Custom Apps
          </Link>
          , or see{" "}
          <Link href="/agentic-spm/executive-dashboards" className="font-semibold text-accent">
            Executive Dashboards
          </Link>{" "}
          and{" "}
          <Link href="/agentic-spm/operations" className="font-semibold text-accent">
            SPM Operations
          </Link>
          .
        </p>
      </section>

      <CtaBand
        heading="Have a gap your platform won't fill?"
        body="Tell us what the spreadsheet does today. Most custom apps ship in eight to twelve weeks from kickoff."
      />
    </>
  );
}

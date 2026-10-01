import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import OperationsDemo from "@/components/OperationsDemo";
import CtaBand from "@/components/CtaBand";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "SPM Operations Live Demo | AI Assisted SPM by Lanshore",
  description:
    "See the SPM Operations pillar of AI Assisted SPM by Lanshore in action: an agent-run monthly comp cycle and a live Xactly-to-Varicent vendor migration, modeled on a fictitious financial institution.",
  alternates: { canonical: "/agentic-spm/operations/demo" },
  openGraph: {
    siteName: "Lanshore",
    locale: "en_US",
    title: "SPM Operations Live Demo | AI Assisted SPM by Lanshore",
    description:
      "An agent-run monthly comp cycle and a live Xactly-to-Varicent migration demo.",
    url: "/agentic-spm/operations/demo",
    type: "website",
  },
};

export default function OperationsDemoPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "SPM Operations", href: "/agentic-spm/operations" },
          { name: "Live Demo", href: "/agentic-spm/operations/demo" },
        ])}
      />

      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
            AI Assisted SPM · SPM Operations · Live Demo
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">
            Watch a comp cycle run itself
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            This is the SPM Operations pillar of AI Assisted SPM by Lanshore, running on
            Meridian Trust Bank — a fictitious regional financial institution. Two
            scenarios: the June comp cycle executed by agents with humans approving what
            matters, and a live migration from Xactly Incent to Varicent ICM. Try the
            exception queue — approve a fix and watch it apply.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* The demo's stage titles are h3. Without this h2 the outline jumps
            h1 to h3, which breaks the screen-reader outline and the document
            structure answer engines read. */}
        <h2 className="mb-6 text-2xl font-bold text-ink">
          Inside the Lanshore comp operations run
        </h2>
        <OperationsDemo />
        <p className="mt-4 text-center text-xs text-muted">
          Meridian Trust Bank is fictitious; all data on this page is illustrative.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h2 className="mb-4 text-2xl font-bold text-ink">What you just saw</h2>
        <p className="text-muted">
          In the <strong className="text-ink">agent-run cycle</strong>, agents execute
          data loads, calculation runs, and validations on schedule, and route the three
          things that need judgment to a queue with suggested fixes — every action logged
          with timestamp and approver. In the{" "}
          <strong className="text-ink">vendor migration</strong>, agents translate plan
          rules between platforms and prove correctness with parallel runs before
          cutover, while consultants who know both systems rebuild what has no
          equivalent. Same team, both jobs.
        </p>
        <p className="mt-6 text-muted">
          This demo is one pillar of AI Assisted SPM by Lanshore — read more about{" "}
          <Link href="/agentic-spm/operations" className="font-semibold text-accent">
            SPM Operations
          </Link>
          , or see{" "}
          <Link href="/agentic-spm/executive-dashboards" className="font-semibold text-accent">
            Executive Dashboards
          </Link>{" "}
          and{" "}
          <Link href="/agentic-spm/custom-apps" className="font-semibold text-accent">
            Custom Apps
          </Link>
          .
        </p>
      </section>

      <CtaBand
        heading="Want your cycle to run like this?"
        body="Most engagements deliver the first agent-run cycle in six to ten weeks — migrations are scoped after a platform assessment."
      />
    </>
  );
}

import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import JsonLd from "@/components/JsonLd";
import FaqSection from "@/components/FaqSection";
import CustomAppDemo from "@/components/CustomAppDemo";
import DemoDashboard from "@/components/DemoDashboard";
import OperationsDemo from "@/components/OperationsDemo";
import PillarGraphic from "@/components/PillarGraphic";
import { faqSchema, serviceSchema } from "@/lib/schema";
import { PILLARS, type Pillar } from "@/lib/pillars";

/* Persona entry points into the Executive Dashboards live demo. */
const DEMO_PERSONAS = [
  {
    id: "cro",
    label: "I'm a CRO",
    hook: "Attainment vs. comp spend in real time, with a district filter and agent-flagged anomalies.",
  },
  {
    id: "cfo",
    label: "I'm a CFO",
    hook: "Accrual variance drill-downs, a filterable audit trail, and a what-if attainment scenario.",
  },
  {
    id: "vp-sales",
    label: "I'm a VP of Sales",
    hook: "Rep outliers explained by the agent, with drill-ins on every attainment bucket.",
  },
  {
    id: "revops",
    label: "I'm a RevOps lead",
    hook: "A triageable exception queue with agent-suggested fixes and SLA aging.",
  },
];

/* Each pillar's live demo, embedded on the page itself. Intros are condensed
   from the standalone demo pages' hero copy. */
const DEMO_SECTIONS: Record<string, { intro: string; demo: ReactNode }> = {
  "executive-dashboards": {
    intro:
      "The Executive Dashboards pillar running on Meridian Trust Bank, a fictitious regional financial institution. Pick your role and see what the dashboard answers for you. On an engagement, this runs on your comp platform, CRM, and finance data.",
    demo: (
      // DemoDashboard reads ?persona= via useSearchParams, which requires a
      // Suspense boundary while the page prerenders.
      <Suspense
        fallback={<div className="min-h-[480px] rounded-xl bg-chart-surface shadow-2xl" />}
      >
        <DemoDashboard />
      </Suspense>
    ),
  },
  operations: {
    intro:
      "The June comp cycle executed by agents with humans approving what matters, and a live migration from Xactly Incent to Varicent ICM, running on Meridian Trust Bank, a fictitious regional financial institution. Try the exception queue: approve a fix and watch it apply.",
    demo: <OperationsDemo />,
  },
  "custom-apps": {
    intro:
      "Meridian Comp Hub, a purpose-built comp tool for a fictitious regional bank. You’re signed in as a relationship manager: read your statement, ask the dispute bot why June came in low, track a SPIF approval, and drag the payout calculator’s sliders to model your quarter.",
    demo: <CustomAppDemo />,
  },
};

export default function PillarPage({ pillar }: { pillar: Pillar }) {
  const others = PILLARS.filter((p) => p.slug !== pillar.slug);
  const demoSection = DEMO_SECTIONS[pillar.slug];

  return (
    <>
      <JsonLd data={serviceSchema(pillar.name, pillar.firstSentence, pillar.path)} />
      <JsonLd data={faqSchema(pillar.faq)} />

      {/* Hero */}
      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
              AI Assisted SPM · Pillar {pillar.pillarNumber} of 3
            </p>
            <h1 className="text-4xl font-bold sm:text-5xl">{pillar.h1}</h1>
            <p className="mt-4 text-xl text-white/85">{pillar.sub}</p>
            <p className="mt-6 max-w-xl text-white/70">{pillar.firstSentence}</p>
          </div>
          <PillarGraphic slug={pillar.slug} />
        </div>
      </section>

      {/* Live demo */}
      {demoSection && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="mb-2 text-2xl font-bold text-ink sm:text-3xl">The live demo</h2>
          <p className="mb-8 max-w-2xl text-muted">{demoSection.intro}</p>
          {demoSection.demo}
          <p className="mt-4 text-center text-xs text-muted">
            Meridian Trust Bank is fictitious; all demo data is illustrative.
          </p>
        </section>
      )}

      {/* Pain cards */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="mb-8 text-2xl font-bold text-ink sm:text-3xl">
          The problem this solves
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {pillar.painCards.map((pain) => (
            <div key={pain} className="rounded-lg border border-line bg-paper p-6">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="mb-3 text-accent"
                aria-hidden
              >
                <path
                  d="M12 8v5m0 3.5v.5M10.3 3.9 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-foreground">{pain}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solution + capabilities */}
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="mx-auto mb-12 max-w-3xl text-center text-lg font-medium text-ink">
            {pillar.solutionStatement}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillar.capabilityCards.map((cap) => (
              <div key={cap.title} className="rounded-lg border border-line bg-white p-6">
                <h3 className="font-bold text-ink">{cap.title}</h3>
                <p className="mt-2 text-sm text-muted">{cap.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Persona-picker demo entry (executive-dashboards only) */}
      {pillar.slug === "executive-dashboards" && pillar.demoHref && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="mb-2 text-2xl font-bold text-ink sm:text-3xl">
            See the demo as your role
          </h2>
          <p className="mb-8 max-w-2xl text-muted">
            The live demo opens on the view built for you. Pick a role and it lands
            on that tab.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DEMO_PERSONAS.map((persona) => (
              <Link
                key={persona.id}
                href={`${pillar.demoHref}?persona=${persona.id}`}
                className="group flex flex-col rounded-lg border border-line bg-white p-6 transition-shadow hover:shadow-card-hover"
              >
                <h3 className="font-bold text-ink group-hover:text-accent">
                  {persona.label}
                </h3>
                <p className="mt-2 flex-1 text-sm text-muted">{persona.hook}</p>
                <span className="mt-4 text-sm font-semibold text-accent group-hover:text-accent-hover">
                  Open my view →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Agentic development in action (custom-apps only) */}
      {pillar.slug === "custom-apps" && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="mb-2 text-2xl font-bold text-ink sm:text-3xl">
            Agentic development in action
          </h2>
          <p className="mb-8 max-w-2xl text-muted">
            This is how custom apps get built at Lanshore: AI coding agents in Claude
            Code working inside VS Code: planning, writing, and verifying production
            code under senior engineer supervision.
          </p>
          <div className="overflow-hidden rounded-xl border border-line shadow-card-hover">
            <Image
              src="/images/claude-code-agentic-development.png"
              alt="Claude Code AI agents building a production web application inside VS Code"
              width={1917}
              height={1032}
              sizes="(min-width: 1152px) 1104px, 100vw"
              className="w-full"
            />
          </div>
        </section>
      )}

      {/* Persona table */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h2 className="mb-8 text-2xl font-bold text-ink sm:text-3xl">Who this is for</h2>
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
            {pillar.personaTable.map((row) => (
              <tr key={row.role}>
                <th className="border border-line p-3 font-semibold text-ink">
                  {row.role}
                </th>
                <td className="border border-line p-3 text-muted">{row.solves}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* FAQ */}
      <div className="bg-paper">
        <FaqSection items={pillar.faq} />
      </div>

      {/* Cross-link strip */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-center text-muted">
          One pillar of AI Assisted SPM by Lanshore. See also{" "}
          {others.map((other, i) => (
            <span key={other.slug}>
              <Link
                href={other.path}
                className="font-semibold text-accent hover:text-accent-hover"
              >
                {other.name}
              </Link>
              {i === 0 ? " and " : ""}
            </span>
          ))}
          .
        </p>
        <p className="mt-3 text-center text-sm text-muted">
          Further reading:{" "}
          <Link
            href="/blog/elevating-sales-performance-the-power-of-agentic-ai-in-spm"
            className="font-semibold text-accent hover:text-accent-hover"
          >
            Elevating Sales Performance: The Power of Agentic AI in SPM
          </Link>
        </p>
      </section>
    </>
  );
}

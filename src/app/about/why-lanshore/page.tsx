import type { Metadata } from "next";
import { GARTNER_2019 } from "@/lib/site";

export const metadata: Metadata = {
  title: "Why Lanshore | One Team From Platform to Agents",
  description:
    "Why teams pick Lanshore for AI Assisted SPM: we've run comp, not just advised on it; one team from platform to agents; and we own outcomes through managed services.",
  alternates: { canonical: "/about/why-lanshore" },
  openGraph: {
    siteName: "Lanshore",
    locale: "en_US",
    title: "Why Lanshore | One Team From Platform to Agents",
    description:
      "Why teams pick Lanshore for AI Assisted SPM: we've run comp, not just advised on it; one team from platform to agents; and we own outcomes through managed services.",
    url: "/about/why-lanshore",
    type: "website",
  },
};

const DIFFERENTIATORS = [
  {
    title: "We've run comp, not just advised on it",
    body: "Our team has administered live comp cycles for enterprise clients for years. We know where calculations break, where disputes come from, and what an auditor asks for, because we've been the ones answering.",
  },
  {
    title: "One team from platform to agents",
    body: "Platform selection, implementation, managed operations, and agentic development sit in one practice: dual SPM depth and agentic-build capability. You are not coordinating two vendors who hand off and blame each other when something breaks.",
  },
  {
    title: "We own outcomes",
    body: "Managed services means we're accountable after go-live. When the cycle has to close and the numbers have to be right, that responsibility is contractually ours.",
  },
];

export default function WhyLanshorePage() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
            About
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">Why Lanshore</h1>
          <p className="mt-6 text-lg text-white/75">
            AI Assisted SPM by Lanshore exists because fifteen years of implementing and
            running comp taught us exactly which work agents should take over.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="space-y-8">
          {DIFFERENTIATORS.map((diff, i) => (
            <div key={diff.title} className="flex gap-6">
              <span className="text-3xl font-bold text-accent" aria-hidden>
                {i + 1}
              </span>
              <div>
                <h2 className="text-xl font-bold text-ink">{diff.title}</h2>
                <p className="mt-2 text-muted">{diff.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Heritage claim: analyst-documented automation DNA predating the AI
            wave — deliberately in the narrative, not the hero. */}
        <p className="mt-12 text-muted">{GARTNER_2019.claims.heritage}</p>

        <blockquote className="mt-16 border-l-4 border-accent bg-paper p-8">
          <p className="text-2xl font-semibold text-ink">
            &ldquo;We run your commissions. We build your agents. We own the
            outcome.&rdquo;
          </p>
        </blockquote>
      </section>
    </>
  );
}

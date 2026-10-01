import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import {
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
  softwareApplicationSchema,
  type FaqItem,
} from "@/lib/schema";
import { SPM_PLATFORMS, NEAR_MISS_VENDORS } from "@/lib/spmPlatforms";

export const metadata: Metadata = {
  title: "SPM Platform Comparison: Varicent vs Xactly vs CaptivateIQ & More | Lanshore",
  description:
    "A vendor-neutral comparison of the leading sales performance management platforms — Varicent, Xactly, CaptivateIQ, SAP, Anaplan, Salesforce Spiff, Performio, Akeron, and Incentivate — by who each one fits, what it does, and its AI capabilities.",
  alternates: { canonical: "/spm/compare" },
  openGraph: {
    siteName: "Lanshore",
    locale: "en_US",
    title: "SPM Platform Comparison: Varicent vs Xactly vs CaptivateIQ & More | Lanshore",
    description:
      "A vendor-neutral comparison of the leading SPM platforms by who each one fits, what it does, and its AI capabilities.",
    url: "/spm/compare",
    type: "website",
  },
};

/* Answers restate the positioning already published on each platform's own
   page — no head-to-head verdicts are invented here. Lanshore resells none of
   these platforms, which is what makes the comparison worth anything. */
const COMPARE_FAQ: FaqItem[] = [
  {
    question: "What is the best SPM platform?",
    answer:
      "There is no single best SPM platform — the right one depends on your plan complexity, data reality, and budget. Enterprises with high-volume, intricate comp plans tend to land on Varicent, Xactly, SAP, or Anaplan; teams that want comp analysts (not developers) to own plan logic tend to prefer CaptivateIQ, Salesforce Spiff, Performio, Akeron, or Incentivate. Lanshore is technology-agnostic and does not resell any platform, so our recommendation comes from a scored evaluation against your plans rather than a reseller quota.",
  },
  {
    question: "How does Varicent compare to Xactly?",
    answer:
      "Both are established enterprise SPM suites, and both were named Leaders in the 2026 Gartner® Magic Quadrant™ for Sales Performance Management. Varicent spans incentive compensation, territory and quota planning, sales planning, and revenue intelligence, with a flexible calculation engine aimed at complex, high-volume plan mechanics. Xactly pairs incentive compensation with planning and its own benchmarking data. In practice the choice turns on your plan mechanics, your data volumes, and which platform's calculation model your comp logic maps onto most cleanly — which is what a scored platform evaluation is for.",
  },
  {
    question: "Do I have to switch SPM platforms to use agentic AI?",
    answer:
      "No. AI Assisted SPM by Lanshore runs on top of the SPM platform you already own. Every platform on this page can be augmented with AI agents for executive dashboards, comp operations, and custom apps — the agents sit above the system of record rather than replacing it. Replatforming is a separate decision, and it should be driven by whether the platform fits your comp plans, not by whether you want AI.",
  },
  {
    question: "Which SPM platforms have built-in AI features?",
    answer:
      "Most of the leading platforms now ship some form of AI assistance — plan design assistants, anomaly detection, forecasting, and natural-language querying are the common patterns. The AI capabilities column above lists what each vendor ships natively. The practical gap is that native features are scoped to what the vendor built; agentic augmentation is what covers the workflows your comp team actually runs across systems.",
  },
  {
    question: "Which SPM platforms does Lanshore implement?",
    answer: `Lanshore implements, operates, and extends ${SPM_PLATFORMS.map(
      (p) => p.name
    ).join(", ")}. We also support ${NEAR_MISS_VENDORS.join(
      ", "
    )} and legacy estates through our partner network.`,
  },
];

export default function SpmComparePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "SPM Platforms", href: "/spm" },
          { name: "Compare", href: "/spm/compare" },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          "SPM Platform Comparison",
          "/spm/compare",
          SPM_PLATFORMS.map((platform) => ({
            name: platform.name,
            href: `/spm/${platform.slug}`,
            item: softwareApplicationSchema(platform),
          }))
        )}
      />
      <JsonLd data={faqSchema(COMPARE_FAQ)} />

      <section className="bg-ink text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
            SPM Platforms
          </p>
          <h1 className="text-4xl font-black sm:text-5xl">SPM Platform Comparison</h1>
          {/* Direct, quotable answer paragraph — the shape answer engines lift. */}
          <p className="mt-6 text-lg text-white/75">
            There is no single best sales performance management platform. The right one
            depends on your plan complexity, data reality, and budget. Below is a
            vendor-neutral comparison of the {SPM_PLATFORMS.length} leading SPM platforms
            Lanshore implements — who each one fits, what it does, and what AI it ships.
            Lanshore resells none of them, which is what makes the comparison worth
            anything.
          </p>
        </div>
      </section>

      <section className="container-site py-16">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[64rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              Comparison of {SPM_PLATFORMS.length} sales performance management platforms
              by best fit, core capabilities, AI capabilities, and analyst recognition.
            </caption>
            <thead>
              <tr className="border-b-2 border-ink">
                <th scope="col" className="px-3 py-3 font-black text-ink">
                  Platform
                </th>
                <th scope="col" className="px-3 py-3 font-black text-ink">
                  Best for
                </th>
                <th scope="col" className="px-3 py-3 font-black text-ink">
                  Core capabilities
                </th>
                <th scope="col" className="px-3 py-3 font-black text-ink">
                  AI capabilities
                </th>
                <th scope="col" className="px-3 py-3 font-black text-ink">
                  Analyst recognition
                </th>
              </tr>
            </thead>
            <tbody>
              {SPM_PLATFORMS.map((platform) => (
                <tr key={platform.slug} className="border-b border-line align-top">
                  <th scope="row" className="px-3 py-5 font-bold text-ink">
                    <Link
                      href={`/spm/${platform.slug}`}
                      className="text-accent hover:text-accent-hover"
                    >
                      {platform.name}
                    </Link>
                    <span className="mt-1 block text-xs font-normal text-muted">
                      {platform.vendor}
                    </span>
                    {platform.formerNames && (
                      <span className="mt-1 block text-xs font-normal italic text-muted">
                        Formerly {platform.formerNames.join(", ")}
                      </span>
                    )}
                  </th>
                  <td className="px-3 py-5 text-muted">{platform.customerProfile}</td>
                  <td className="px-3 py-5">
                    <ul className="list-disc space-y-1 pl-4 text-muted">
                      {platform.capabilities.slice(0, 4).map((capability) => (
                        <li key={capability}>{capability}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-3 py-5">
                    <ul className="list-disc space-y-1 pl-4 text-muted">
                      {platform.aiFeatures.slice(0, 3).map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-3 py-5 text-muted">
                    {platform.analystNote ?? (
                      /* Deliberately blank rather than filled in: the repo only
                         carries analyst placements verified against public
                         sources, and an unverified one is worse than none. */
                      <span className="italic">Not published here</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-sm text-muted">
          Also supported through our partner network: {NEAR_MISS_VENDORS.join(", ")}. If
          your platform isn&apos;t listed,{" "}
          <Link href="/contact" className="font-semibold text-accent hover:text-accent-hover">
            talk to us
          </Link>{" "}
          — odds are we&apos;ve worked in it.
        </p>
      </section>

      <section className="bg-paper py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-3xl font-black text-ink">How to choose</h2>
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="font-bold text-ink">Start from your comp plans, not the demo</h3>
              <p className="mt-2 text-muted">
                The platform has to model the plan mechanics you actually run — accelerators,
                multi-tier crediting, clawbacks, true-ups. A platform that demos beautifully
                and can&apos;t express your crediting rules is the wrong platform.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-ink">
                Check who can change a plan — an analyst, or a developer
              </h3>
              <p className="mt-2 text-muted">
                Comp structures change, sometimes several times a year. If every plan change
                needs vendor professional services and a six-week cycle, the platform becomes
                the bottleneck. Prioritize the ones where comp analysts own plan logic through
                configuration.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-ink">Validate the integration, not the brochure</h3>
              <p className="mt-2 text-muted">
                An SPM platform that can&apos;t consume clean, real-time data from your CRM and
                ERP will produce numbers your reps don&apos;t trust. Validate the integration
                architecture against your system versions, data volumes, and sync frequency
                before you commit.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-ink">Decide AI separately from the platform</h3>
              <p className="mt-2 text-muted">
                Agentic AI runs on top of the platform you already own. Don&apos;t replatform to
                get agents, and don&apos;t pick a platform on the strength of an AI roadmap slide.{" "}
                <Link
                  href="/agentic-spm/operations"
                  className="font-semibold text-accent hover:text-accent-hover"
                >
                  See what agentic comp operations actually look like
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-black text-ink">
          SPM platform comparison: common questions
        </h2>
        <dl className="mt-8 space-y-8">
          {COMPARE_FAQ.map((item) => (
            <div key={item.question} className="border-b border-line pb-6">
              <dt className="text-lg font-bold text-ink">{item.question}</dt>
              <dd className="mt-2 text-muted">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}

import Link from "next/link";
import { BarChart3, RefreshCw, Blocks } from "lucide-react";

/* The three cards map 1:1 to the AI Assisted SPM pillar pages and their demos. */
const CARDS = [
  {
    icon: BarChart3,
    title: "Executive Dashboards",
    sub: "Ask your comp data a question in plain language and get a current, sourced answer",
    href: "/agentic-spm/executive-dashboards",
    demoHref: "/agentic-spm/executive-dashboards/demo",
  },
  {
    icon: RefreshCw,
    title: "SPM Operations",
    sub: "Agents run calculations, validations, and exceptions 24/7, with a full audit trail",
    href: "/agentic-spm/operations",
    demoHref: "/agentic-spm/operations/demo",
  },
  {
    icon: Blocks,
    title: "Custom Apps",
    sub: "Dispute bots, approval workflows, and calculators your platform can't build",
    href: "/agentic-spm/custom-apps",
    demoHref: "/agentic-spm/custom-apps/demo",
  },
];

export default function IntroAgenticSPM() {
  return (
    <>
      {/* Dark teal banner */}
      <section
        id="agentic-spm"
        className="relative scroll-mt-20 overflow-hidden bg-button pb-32 pt-20 text-center"
      >
        {/* Decorative background rings */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-2 border-white opacity-10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full border-2 border-white opacity-5"
        />

        <div className="container-site relative max-w-4xl">
          <h2 className="mb-6 text-3xl font-black uppercase tracking-wide text-white lg:text-4xl">
            AI Assisted SPM by Lanshore
          </h2>
          <p className="mx-auto mb-10 max-w-3xl text-base leading-relaxed text-white/80 lg:text-lg">
            An AI-native approach to Sales Performance Management built for the enterprise.
            Autonomous agents that continuously run commission calculations, surface risk in
            real time, and eliminate the manual work that slows your team, fully integrated
            with your existing SPM, CRM, ERP, and other platforms. No rip-and-replace
            required.
          </p>
          <Link
            href="/agentic-spm/executive-dashboards"
            className="inline-flex items-center justify-center gap-2 rounded border border-white px-8 py-3.5 text-sm font-bold text-white transition-colors duration-150 hover:bg-white/[0.12]"
          >
            Explore AI Assisted SPM by Lanshore
          </Link>
        </div>
      </section>

      {/* Three overlapping pillar cards — relative z-10 paints above the dark section */}
      <section className="relative z-10 bg-white pb-16">
        <div className="container-site">
          <div className="-mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {CARDS.map(({ icon: Icon, title, sub, href, demoHref }) => (
              <div
                key={title}
                className="flex flex-col rounded-lg border border-line bg-white p-6 shadow-card-hover"
              >
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-teal-light">
                    <Icon className="h-7 w-7 text-button" />
                  </div>
                  <div className="pt-1">
                    <h3 className="mb-1 text-base font-black text-button">{title}</h3>
                    <p className="text-sm leading-snug text-foreground">{sub}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 pl-[4.75rem] text-sm">
                  <Link href={href} className="font-bold text-accent hover:text-accent-hover">
                    Learn more →
                  </Link>
                  <Link
                    href={demoHref}
                    className="font-bold text-accent hover:text-accent-hover"
                  >
                    Live demo →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

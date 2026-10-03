import Link from "next/link";
import { Clock, LayoutGrid, Bot, Globe } from "lucide-react";
import { GARTNER_2019 } from "@/lib/site";

const STATS = [
  {
    icon: Clock,
    value: "15+",
    label: "Years",
    description: "Delivering SPM & Agentic AI implementations across enterprise clients",
  },
  {
    icon: LayoutGrid,
    value: "9",
    label: "SPM Platforms",
    description:
      "Supported: Varicent, Xactly, CaptivateIQ, SAP, Anaplan, Salesforce Spiff, Performio, Akeron, and Incentivate",
  },
  {
    icon: Bot,
    value: "AI-First",
    label: "Agentic",
    description:
      "Deep capability building autonomous AI agents directly into commission and incentive workflows, continuously monitoring, validating, and acting on your behalf.",
  },
  {
    icon: Globe,
    value: "Global",
    label: "Delivery",
    description:
      "Dedicated teams across the US and Latin America, operating in your time zone",
  },
];

export default function DifferentiatorsSection() {
  return (
    <section className="section-padding bg-ink text-white">
      <div className="container-site">
        <div className="mb-10 text-center sm:mb-14">
          <h2 className="mb-3 text-3xl font-black text-white lg:text-4xl">
            Proven SPM &amp; Agentic AI Expertise. Real Results.
          </h2>
          <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
            Microsoft Certified Partner &nbsp;·&nbsp; UiPath Fast Track Partner
          </p>
          {/* claims.short only — the full citation lives once, on /about. */}
          <p className="mx-auto mt-4 max-w-3xl text-sm text-white/60">
            {GARTNER_2019.claims.short}{" "}
            <Link
              href="/about#analyst-recognition"
              className="font-semibold text-link-hover hover:text-white"
            >
              Full citation →
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`px-5 py-5 text-center sm:px-8 sm:py-6 ${
                  i < STATS.length - 1 ? "border-white/10 lg:border-r" : ""
                } ${i > 0 ? "border-t border-white/10 lg:border-t-0" : ""}`}
              >
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-link-hover/[0.12]">
                    <Icon className="h-5 w-5 text-link-hover" />
                  </div>
                </div>
                <div className="mb-1 text-3xl font-black text-white sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mb-3 text-xs font-bold uppercase tracking-widest text-white/50">
                  {stat.label}
                </div>
                <p className="text-sm leading-relaxed text-white/65">{stat.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/about/why-lanshore" className="btn-outline-white">
            Why Lanshore
          </Link>
        </div>
      </div>
    </section>
  );
}

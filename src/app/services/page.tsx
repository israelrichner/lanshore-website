import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "SPM Implementation, Managed Services & AI Development | Lanshore",
  description:
    "Lanshore's services are how AI Assisted SPM gets delivered, from platform implementation to ongoing managed operations. One team from platform selection to agents in production.",
  alternates: { canonical: "/services" },
  openGraph: {
    siteName: "Lanshore",
    locale: "en_US",
    title: "SPM Implementation, Managed Services & AI Development | Lanshore",
    description:
      "From platform implementation to ongoing managed operations: one team from platform selection to agents in production.",
    url: "/services",
    type: "website",
  },
};

const SERVICES = [
  {
    title: "Implementation & Consulting",
    href: "/spm",
    description:
      "Varicent, Xactly, CaptivateIQ, SAP, Anaplan, Salesforce Spiff, Performio, Akeron, and Incentivate implementations, plan builds, and migrations, delivered by consultants who have done this for 15+ years.",
    cta: "See the platforms we implement →",
  },
  {
    title: "Managed Services",
    href: "/contact",
    description:
      "We run your comp operations, increasingly with agents doing the repetitive work and our team handling judgment calls, for a predictable monthly fee.",
    cta: "Talk to us →",
  },
  {
    title: "Automation & Integration",
    href: "/services/automation",
    description:
      "Tool-agnostic automation delivery: UiPath, n8n, Claude Code, VS Code, Microsoft Power Automate, and direct API integrations, from RPA bots to agentic workflows.",
    cta: "Explore automation services →",
  },
  {
    title: "Vendor Evaluation & Roadmap",
    href: "/spm",
    description:
      "Platform-neutral evaluation of SPM vendors against your plan complexity, data reality, and budget, ending in a scored recommendation and rollout roadmap.",
    cta: "Compare SPM platforms →",
  },
  {
    title: "Custom Agentic AI Development",
    href: "/agentic-spm/custom-apps",
    description:
      "The engineering practice behind the Custom Apps pillar: agent design, build, integration, and handover.",
    cta: "See the Custom Apps pillar →",
  },
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema(
          "SPM Implementation, Managed Services & Agentic AI Development",
          "Lanshore's services are how AI Assisted SPM gets delivered, from SPM platform implementation and managed comp operations to vendor evaluation and custom agentic AI development.",
          "/services",
          SERVICES.map((service) => ({
            name: service.title,
            description: service.description,
          }))
        )}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
        ])}
      />

      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
            Services
          </p>
          <h1 className="text-4xl font-black sm:text-5xl">How we deliver AI Assisted SPM</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            Lanshore&rsquo;s services are how AI Assisted SPM gets delivered, from platform
            implementation to ongoing managed operations. One team takes you from platform
            selection to agents in production. No handoffs between a &ldquo;strategy
            firm&rdquo; and a &ldquo;delivery shop.&rdquo;
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {SERVICES.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group rounded-lg border border-line p-8 shadow-card transition-all hover:border-accent hover:shadow-card-hover"
            >
              <h2 className="text-xl font-black text-ink group-hover:text-accent">
                {service.title}
              </h2>
              <p className="mt-3 text-muted">{service.description}</p>
              <span className="mt-4 inline-block font-semibold text-accent">
                {service.cta}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

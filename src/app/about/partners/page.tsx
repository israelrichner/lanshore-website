import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Partners | Microsoft, UiPath & SPM Platform Partnerships | Lanshore",
  description:
    "Lanshore's partnerships: Microsoft Gold, UiPath Fast Track, and platform partnerships with Varicent, Xactly, CaptivateIQ, Performio, SAP, Anaplan, Akeron, and Incentivate.",
  alternates: { canonical: "/about/partners" },
  openGraph: {
    siteName: "Lanshore",
    locale: "en_US",
    title: "Partners | Microsoft, UiPath & SPM Platform Partnerships | Lanshore",
    description:
      "Lanshore's partnerships: Microsoft Gold, UiPath Fast Track, and platform partnerships with Varicent, Xactly, CaptivateIQ, Performio, SAP, Anaplan, Akeron, and Incentivate.",
    url: "/about/partners",
    type: "website",
  },
};

const PARTNERS = [
  {
    name: "Microsoft Certified Partner",
    href: "/services/automation",
    cta: "Microsoft automation services",
    body: "Gold-level competency across the Microsoft stack means the Power Automate flows, Azure infrastructure, and integrations we build for clients follow supported patterns Microsoft will stand behind, and your IT team can maintain them.",
  },
  {
    name: "UiPath Fast Track Partner",
    href: "/services/automation",
    cta: "UiPath automation services",
    body: "Fast Track status gives our clients early access to UiPath capabilities and direct escalation paths. For automation work that sits alongside agents, it means faster delivery and vendor-backed support.",
  },
  {
    name: "Varicent",
    href: "/spm/varicent",
    cta: "Lanshore + Varicent",
    body: "Implementation and operations partnership on Varicent ICM. Our team implements new Varicent environments, rescues troubled ones, and runs ongoing operations under managed services.",
  },
  {
    name: "Xactly",
    href: "/spm/xactly",
    cta: "Lanshore + Xactly",
    body: "Partnership covering Xactly Incent implementations, plan migrations, and managed operations. Clients get consultants who have configured Xactly for enterprise plan complexity, not just certified on it.",
  },
  {
    name: "CaptivateIQ",
    href: "/spm/captivateiq",
    cta: "Lanshore + CaptivateIQ",
    body: "Implementation partnership for CaptivateIQ's modeling-first approach to comp. We help clients move from spreadsheets to CaptivateIQ without losing the flexibility that drew them to it.",
  },
  {
    name: "Performio",
    href: "/spm/performio",
    cta: "Lanshore + Performio",
    body: "Implementation and support partnership for Performio's ICM platform, including data integration and ongoing plan administration.",
  },
  {
    name: "SAP",
    href: "/spm/sap-incentive-management",
    cta: "Lanshore + SAP Incentive Management",
    body: "Partnership on SAP SuccessFactors Incentive Management (formerly SAP Commissions, CallidusCloud) for enterprises running comp inside the SAP ecosystem: implementations, upgrades, and managed operations.",
  },
  {
    name: "Anaplan",
    href: "/spm/anaplan",
    cta: "Lanshore + Anaplan",
    body: "Partnership covering Anaplan's SPM applications: territory and quota planning, capacity modeling, and incentive compensation. We build Anaplan models for clients who want sales planning connected to enterprise planning, and we wire those plans back to whichever ICM engine does the calculation.",
  },
  {
    name: "Akeron",
    href: "/spm/akeron",
    cta: "Lanshore + Akeron",
    body: "Implementation partnership on Vulki by Akeron, which handles variable compensation for sales and non-sales populations alike and embeds the Akyba agent center. We deliver Vulki rollouts end to end: plan design, configuration, data integration, and go-live.",
  },
  {
    name: "Incentivate",
    href: "/spm/incentivate",
    cta: "Lanshore + Incentivate",
    body: "Implementation and operations partnership on Incentivate, whose no-code plan builder and Agent Dhara assistant suit teams with intricate plan mechanics. Notable for supporting private-cloud and on-premise deployment, which keeps it in play where multi-tenant ICM isn't an option.",
  },
];

export default function PartnersPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
            About
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">Partners</h1>
          <p className="mt-6 text-lg text-white/75">
            Lanshore partners across the platforms AI Assisted SPM runs on, so clients get
            supported patterns, vendor escalation paths, and consultants the vendors
            know.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        {/* Partner badges */}
        <div className="mb-12 flex flex-wrap items-center gap-x-10 gap-y-6">
          <Image
            src="/images/partners/microsoft-gold.png"
            alt="Microsoft Certified Partner"
            width={220}
            height={96}
            className="h-14 w-auto"
          />
          <Image
            src="/images/partners/uipath-gold.png"
            alt="UiPath Gold Partner"
            width={288}
            height={62}
            className="h-10 w-auto"
          />
          <Image
            src="/images/partners/uipath-fast-track.png"
            alt="UiPath Fast Track Partner"
            width={200}
            height={96}
            className="h-14 w-auto"
          />
          <Image
            src="/images/partners/varicent.png"
            alt="Varicent Partner"
            width={220}
            height={64}
            className="h-9 w-auto"
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {PARTNERS.map((partner) => (
            <Link
              key={partner.name}
              href={partner.href}
              className="group flex flex-col rounded-lg border border-line p-6 shadow-card transition-all hover:border-accent hover:shadow-card-hover"
            >
              <h2 className="text-xl font-bold text-ink group-hover:text-accent">
                {partner.name}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground">
                {partner.body}
              </p>
              <span className="mt-4 text-sm font-bold text-accent">
                {partner.cta} →
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-10 text-sm text-muted">
          Looking for platform detail?{" "}
          <Link href="/spm" className="font-semibold text-accent hover:text-accent-hover">
            See the SPM platforms we implement
          </Link>
          .
        </p>
      </section>
    </>
  );
}

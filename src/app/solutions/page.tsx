import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import CtaBand from "@/components/CtaBand";
import { breadcrumbSchema, itemListSchema, webPageSchema } from "@/lib/schema";
import { SOLUTIONS } from "@/lib/solutions";

const DESCRIPTION =
  "Lanshore solutions for sales performance management: SPM consulting, CRM and ERP integration, managed services, global compliance, mid-market implementation, and AI agents for commissions and RevOps.";

export const metadata: Metadata = {
  title: "SPM Solutions: Consulting, Managed Services & AI Agents | Lanshore",
  description: DESCRIPTION,
  alternates: { canonical: "/solutions" },
  openGraph: {
    siteName: "Lanshore",
    locale: "en_US",
    title: "SPM Solutions: Consulting, Managed Services & AI Agents | Lanshore",
    description: DESCRIPTION,
    url: "/solutions",
    type: "website",
  },
};

export default function SolutionsIndexPage() {
  return (
    <>
      <JsonLd data={webPageSchema("CollectionPage", "Lanshore Solutions", DESCRIPTION, "/solutions")} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Solutions", href: "/solutions" },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          "Lanshore Solutions",
          "/solutions",
          SOLUTIONS.map((s) => ({ name: s.name, href: `/solutions/${s.slug}` }))
        )}
      />

      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">Solutions</p>
          <h1 className="text-4xl font-bold sm:text-5xl">Lanshore solutions</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">
            Sales performance management delivered the way enterprises actually need it:
            consulting, integration, managed operations, and AI agents, on the platform you
            already run.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {SOLUTIONS.map((s) => (
            <Link
              key={s.slug}
              href={`/solutions/${s.slug}`}
              className="group rounded-lg border border-line p-6 hover:border-accent"
            >
              <h2 className="text-xl font-bold text-ink group-hover:text-accent">{s.name}</h2>
              <p className="mt-2 text-sm text-muted">{s.metaDescription}</p>
            </Link>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}

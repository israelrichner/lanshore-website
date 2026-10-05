import type { Metadata } from "next";
import CaseStudyGrid from "@/components/CaseStudyGrid";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, itemListSchema } from "@/lib/schema";
import { CASE_STUDIES } from "@/lib/caseStudies";

export const metadata: Metadata = {
  title: "SPM & Agentic AI Case Studies | Lanshore",
  description:
    "Enterprise sales performance management and automation case studies from Lanshore, with numbers attached.",
  alternates: { canonical: "/case-studies" },
  openGraph: {
    siteName: "Lanshore",
    locale: "en_US",
    title: "SPM & Agentic AI Case Studies | Lanshore",
    description:
      "Enterprise sales performance management and automation case studies from Lanshore, with numbers attached.",
    url: "/case-studies",
    type: "website",
  },
};

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Case Studies", href: "/case-studies" },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          "Lanshore SPM & Agentic AI Case Studies",
          "/case-studies",
          CASE_STUDIES.map((study) => ({
            name: study.title,
            href: `/case-studies/${study.slug}`,
          }))
        )}
      />

      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
            Case Studies
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">Lanshore client results</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">
            Enterprise SPM work, with numbers attached.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <CaseStudyGrid studies={CASE_STUDIES} />
      </section>
    </>
  );
}

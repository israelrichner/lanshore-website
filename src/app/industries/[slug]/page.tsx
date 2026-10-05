import type { Metadata } from "next";
import { NOT_FOUND_METADATA } from "@/lib/site";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { INDUSTRIES, getIndustry } from "@/lib/industries";
import { getCaseStudy } from "@/lib/caseStudies";

export function generateStaticParams() {
  return INDUSTRIES.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return NOT_FOUND_METADATA;
  return {
    title: industry.titleTag,
    description: industry.metaDescription,
    alternates: { canonical: `/industries/${industry.slug}` },
    openGraph: {
      siteName: "Lanshore",
      locale: "en_US",
      title: industry.titleTag,
      description: industry.metaDescription,
      url: `/industries/${industry.slug}`,
      type: "website",
    },
  };
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const study = getCaseStudy(industry.caseStudySlug);

  return (
    <>
      <JsonLd
        data={serviceSchema(
          `${industry.name} Sales Performance Management`,
          industry.firstSentence,
          `/industries/${industry.slug}`
        )}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Industries", href: "/industries" },
          { name: industry.name, href: `/industries/${industry.slug}` },
        ])}
      />
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
            Industries
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">
            AI Assisted SPM for {industry.name}
          </h1>
          <p className="mt-6 text-lg text-white/75">{industry.firstSentence}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <p className="text-lg text-foreground">{industry.complexity}</p>

        <h2 className="mt-10 text-2xl font-bold text-ink">Problems we solve here</h2>
        <ul className="mt-4 space-y-3">
          {industry.problems.map((problem) => (
            <li key={problem} className="flex gap-3 text-muted">
              <span className="mt-1 text-accent" aria-hidden>
                •
              </span>
              {problem}
            </li>
          ))}
        </ul>

        {study && (
          <Link
            href={`/case-studies/${study.slug}`}
            className="group mt-10 block rounded-lg border border-line p-6 hover:border-accent"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Case study
            </p>
            <h3 className="mt-2 font-bold text-ink group-hover:text-accent">
              {study.title}
            </h3>
            <p className="mt-2 text-sm text-muted">{study.outcome}</p>
            <span className="mt-3 inline-block text-sm font-semibold text-accent">
              Read the story →
            </span>
          </Link>
        )}
      </section>
    </>
  );
}

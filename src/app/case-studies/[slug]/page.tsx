import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, caseStudySchema } from "@/lib/schema";
import { UPDATED } from "@/lib/contentDates";
import { CASE_STUDIES, getCaseStudy } from "@/lib/caseStudies";
import { PILLARS } from "@/lib/pillars";

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: `${study.title} | Lanshore`,
    description: study.outcome,
    alternates: { canonical: `/case-studies/${study.slug}` },
    openGraph: {
      siteName: "Lanshore",
      locale: "en_US",
      title: study.title,
      description: study.outcome,
      url: `/case-studies/${study.slug}`,
      type: "article",
    },
  };
}

export default async function CaseStudyDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const relatedPillar = PILLARS.find((p) => p.name === study.pillar);

  return (
    <>
      <JsonLd data={caseStudySchema({ ...study, dateModified: study.dateModified ?? UPDATED.caseStudies })} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Case Studies", href: "/case-studies" },
          { name: study.title, href: `/case-studies/${study.slug}` },
        ])}
      />
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
            {study.industry} · {study.pillar}
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">{study.title}</h1>
          <p className="mt-4 text-lg text-white/75">{study.client}</p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-ink">Challenge</h2>
        <p className="mt-3 text-muted">{study.challenge}</p>

        <h2 className="mt-10 text-2xl font-bold text-ink">What we did</h2>
        <p className="mt-3 text-muted">{study.whatWeDid}</p>

        <h2 className="mt-10 text-2xl font-bold text-ink">Result</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {study.results.map((result) => (
            <div key={result} className="rounded-lg border border-line bg-paper p-5">
              <p className="font-semibold text-ink">{result}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-10 text-2xl font-bold text-ink">Stack used</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {study.stack.map((item) => (
            <li
              key={item}
              className="rounded-full bg-paper px-3 py-1 text-sm font-medium text-muted"
            >
              {item}
            </li>
          ))}
        </ul>

        <p className="mt-10 text-muted">
          {relatedPillar ? (
            <>
              Related:{" "}
              <Link
                href={relatedPillar.path}
                className="font-semibold text-accent hover:text-accent-hover"
              >
                {relatedPillar.name} — AI Assisted SPM by Lanshore
              </Link>
            </>
          ) : (
            <>
              Related:{" "}
              <Link
                href="/services"
                className="font-semibold text-accent hover:text-accent-hover"
              >
                How we deliver AI Assisted SPM
              </Link>
            </>
          )}
        </p>
      </article>
    </>
  );
}

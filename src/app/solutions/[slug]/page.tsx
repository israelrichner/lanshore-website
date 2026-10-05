import type { Metadata } from "next";
import { NOT_FOUND_METADATA } from "@/lib/site";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import CtaBand from "@/components/CtaBand";
import FaqSection from "@/components/FaqSection";
import { SOLUTIONS, getSolution } from "@/lib/solutions";
import { getSpmPlatform, type SpmPlatform } from "@/lib/spmPlatforms";
import { getCaseStudy, type CaseStudy } from "@/lib/caseStudies";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) return NOT_FOUND_METADATA;
  return {
    title: s.titleTag,
    description: s.metaDescription,
    alternates: { canonical: `/solutions/${s.slug}` },
    openGraph: {
      siteName: "Lanshore",
      locale: "en_US",
      title: s.titleTag,
      description: s.metaDescription,
      url: `/solutions/${s.slug}`,
      type: "website",
    },
  };
}

/* Same layout grammar as /spm/[slug] (plan DC5): dark hero with the
   answer-first paragraph, then h2 sections, then the FAQ and CTA band. */
export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) notFound();

  /* Slugs are validated at module load in lib/solutions, so these resolve. */
  const platforms = s.platforms
    .map((p) => getSpmPlatform(p))
    .filter((p): p is SpmPlatform => Boolean(p));
  const studies = s.relatedCaseStudies
    .map((c) => getCaseStudy(c))
    .filter((c): c is CaseStudy => Boolean(c));

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Solutions", href: "/solutions" },
          { name: s.name, href: `/solutions/${s.slug}` },
        ])}
      />
      <JsonLd data={serviceSchema(s.name, s.metaDescription, `/solutions/${s.slug}`)} />
      <JsonLd data={faqSchema(s.faq)} />

      <section className="bg-ink text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
            <Link href="/solutions" className="hover:text-gold-light">
              Solutions
            </Link>
          </p>
          <h1 className="text-4xl font-black sm:text-5xl">{s.name}</h1>
          {/* Direct answer paragraph for answer-engine extraction */}
          <p className="mt-6 text-lg text-white/75">{s.firstSentence}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-black text-ink">Who it is for</h2>
        <p className="mt-4 text-lg leading-relaxed text-foreground">{s.whoItIsFor}</p>

        <h2 className="mt-12 text-2xl font-black text-ink">The problems it solves</h2>
        <div className="mt-4 space-y-6">
          {s.problems.map((p) => (
            <div key={p.title}>
              <h3 className="text-lg font-bold text-ink">{p.title}</h3>
              <p className="mt-1 text-foreground">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-teal-light p-6 sm:p-8">
          <h2 className="text-2xl font-black text-ink">How Lanshore delivers it</h2>
          <ol className="mt-5 space-y-5">
            {s.howWeDeliver.map((step, i) => (
              <li key={step.title} className="flex gap-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-ink">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link href="/contact" className="btn-primary mt-6">
            Get an assessment
          </Link>
        </div>

        {platforms.length > 0 && (
          <>
            <h2 className="mt-12 text-2xl font-black text-ink">Platforms we deliver on</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {platforms.map((p) => (
                <li key={p.slug} className="flex gap-3 text-foreground">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-button" />
                  <Link href={`/spm/${p.slug}`} className="font-semibold text-accent hover:text-accent-hover">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {studies.length > 0 && (
          <>
            <h2 className="mt-12 text-2xl font-black text-ink">Related case studies</h2>
            <ul className="mt-4 space-y-3">
              {studies.map((c) => (
                <li key={c.slug}>
                  <Link href={`/case-studies/${c.slug}`} className="font-semibold text-accent hover:text-accent-hover">
                    {c.title}
                  </Link>
                  <p className="text-sm text-muted">{c.outcome}</p>
                </li>
              ))}
            </ul>
          </>
        )}

        {s.related && s.related.length > 0 && (
          <p className="mt-10 text-sm text-muted">
            Related:{" "}
            {s.related.map((r, i) => (
              <span key={r.href}>
                {i > 0 && " · "}
                <Link href={r.href} className="font-semibold text-accent hover:text-accent-hover">
                  {r.label}
                </Link>
              </span>
            ))}
          </p>
        )}
      </section>

      <FaqSection items={s.faq} heading={`${s.name}: FAQ`} />

      <CtaBand
        heading="Talk to Lanshore"
        body="A 30-minute call. We look at your plans, your systems, and where this would change your comp operations first."
        {...(process.env.HUBSPOT_MEETINGS_URL
          ? { secondaryHref: "/contact#book", secondaryLabel: "Book a call" }
          : {})}
      />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Bot, ExternalLink } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import CtaBand from "@/components/CtaBand";
import FaqSection from "@/components/FaqSection";
import { SPM_PLATFORMS, getSpmPlatform } from "@/lib/spmPlatforms";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { GARTNER_2019 } from "@/lib/site";

export function generateStaticParams() {
  return SPM_PLATFORMS.map((platform) => ({ slug: platform.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const platform = getSpmPlatform(slug);
  if (!platform) return {};
  return {
    title: platform.titleTag,
    description: platform.metaDescription,
    alternates: { canonical: `/spm/${platform.slug}` },
    openGraph: {
      siteName: "Lanshore",
      locale: "en_US",
      title: platform.titleTag,
      description: platform.metaDescription,
      url: `/spm/${platform.slug}`,
      type: "website",
    },
  };
}

export default async function SpmPlatformPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const platform = getSpmPlatform(slug);
  if (!platform) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "SPM Platforms", href: "/spm" },
          { name: platform.name, href: `/spm/${platform.slug}` },
        ])}
      />
      <JsonLd
        data={serviceSchema(
          `${platform.name} Implementation & Managed Services`,
          platform.metaDescription,
          `/spm/${platform.slug}`
        )}
      />
      <JsonLd data={faqSchema(platform.faq)} />

      {/* Hero */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
            <Link href="/spm" className="hover:text-gold-light">
              SPM Platforms
            </Link>
          </p>
          <h1 className="text-4xl font-black sm:text-5xl">{platform.name}</h1>
          {platform.formerNames && (
            <p className="mt-2 text-sm text-white/60">
              Formerly {platform.formerNames.join(" · ")}
            </p>
          )}
          {/* Direct answer paragraph for answer-engine extraction */}
          <p className="mt-6 text-lg text-white/75">{platform.firstSentence}</p>
          <a
            href={platform.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-link-hover hover:text-white"
          >
            {platform.officialUrl.replace("https://", "")}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <p className="text-lg leading-relaxed text-foreground">{platform.positioning}</p>

        {platform.analystNote && (
          <div className="mt-6 rounded-lg border-l-4 border-gold bg-paper p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-muted">
              Analyst standing
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">
              {platform.analystNote}
            </p>
          </div>
        )}

        <h2 className="mt-12 text-2xl font-black text-ink">Platform capabilities</h2>
        <ul className="mt-4 space-y-3">
          {platform.capabilities.map((capability) => (
            <li key={capability} className="flex gap-3 text-foreground">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-button" />
              {capability}
            </li>
          ))}
        </ul>

        <h2 className="mt-12 text-2xl font-black text-ink">Who it fits</h2>
        <p className="mt-4 text-foreground">{platform.customerProfile}</p>

        <h2 className="mt-12 text-2xl font-black text-ink">
          AI &amp; agentic capabilities
        </h2>
        <ul className="mt-4 space-y-3">
          {platform.aiFeatures.map((feature) => (
            <li key={feature} className="flex gap-3 text-foreground">
              <Bot className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
              {feature}
            </li>
          ))}
        </ul>

        {/* Lanshore + platform */}
        <div className="mt-12 rounded-xl bg-teal-light p-6 sm:p-8">
          <h2 className="text-2xl font-black text-ink">Lanshore + {platform.name}</h2>
          <p className="mt-2 text-sm text-muted">
            Implementation, managed services, and agentic augmentation, from the team
            behind{" "}
            <Link
              href="/agentic-spm/executive-dashboards"
              className="font-semibold text-accent hover:text-accent-hover"
            >
              AI Assisted SPM by Lanshore
            </Link>
            .
          </p>
          {platform.gartnerPartnerLeadIn && (
            <p className="mt-3 text-sm text-muted">
              {platform.gartnerPartnerLeadIn} {GARTNER_2019.claims.short}
            </p>
          )}
          <ul className="mt-5 space-y-3">
            {platform.lanshoreAngle.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                {item}
              </li>
            ))}
          </ul>
          <Link href="/contact" className="btn-primary mt-6">
            Get an assessment
          </Link>
        </div>

        <p className="mt-10 text-sm text-muted">
          Comparing platforms?{" "}
          <Link href="/spm" className="font-semibold text-accent hover:text-accent-hover">
            See all SPM platforms we implement
          </Link>{" "}
          or brush up on terms in the{" "}
          <Link
            href="/resources/glossary"
            className="font-semibold text-accent hover:text-accent-hover"
          >
            SPM glossary
          </Link>
          .
        </p>
      </section>

      <FaqSection items={platform.faq} heading={`${platform.name}: FAQ`} />

      <CtaBand
        heading={`Talk to ${platform.name} specialists`}
        body="A 30-minute call. We look at your stack, your plans, and whether this platform, or another, fits best."
        {...(process.env.HUBSPOT_MEETINGS_URL
          ? { secondaryHref: "/contact#book", secondaryLabel: "Book a call" }
          : {})}
      />
    </>
  );
}

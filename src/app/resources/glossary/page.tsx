import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { GLOSSARY, glossarySlug } from "@/lib/glossary";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "SPM & Agentic AI Glossary | Lanshore",
  description:
    "Plain-English definitions of sales performance management and agentic AI terms: AI Assisted SPM, ICM, crediting, clawbacks, SPIFs, true-ups, and more.",
  alternates: { canonical: "/resources/glossary" },
  openGraph: {
    siteName: "Lanshore",
    locale: "en_US",
    title: "SPM & Agentic AI Glossary | Lanshore",
    description:
      "Plain-English definitions of sales performance management and agentic AI terms: AI Assisted SPM, ICM, crediting, clawbacks, SPIFs, true-ups, and more.",
    url: "/resources/glossary",
    type: "website",
  },
};

const GLOSSARY_URL = `${SITE_URL}/resources/glossary`;
const GLOSSARY_ID = `${GLOSSARY_URL}#termset`;

/* Each DefinedTerm carries its own @id and url pointing at the term's anchor,
   so an engine can cite a single definition rather than the whole page. */
const definedTermSetSchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  "@id": GLOSSARY_ID,
  name: "SPM & Agentic AI Glossary",
  url: GLOSSARY_URL,
  inLanguage: "en-US",
  hasDefinedTerm: GLOSSARY.map((entry) => {
    const anchor = `${GLOSSARY_URL}#${glossarySlug(entry.term)}`;
    return {
      "@type": "DefinedTerm",
      "@id": anchor,
      name: entry.term,
      description: entry.definition,
      url: anchor,
      inDefinedTermSet: { "@id": GLOSSARY_ID },
    };
  }),
};

export default function GlossaryPage() {
  return (
    <>
      <JsonLd data={definedTermSetSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Resources", href: "/resources" },
          { name: "FAQ & Glossary", href: "/resources/glossary" },
        ])}
      />

      <section className="bg-ink text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
            FAQ & Glossary
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">
            SPM & agentic AI, defined
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">
            The terms behind AI Assisted SPM by Lanshore: sales performance management,
            incentive compensation, and agentic AI, in plain English.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        {/* Jump index — gives every term an in-page link, so crawlers see the
            anchors the DefinedTerm URLs point at. */}
        <nav aria-label="Glossary terms" className="mb-12 border-b border-line pb-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
            Jump to a term
          </h2>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {GLOSSARY.map((entry) => (
              <li key={entry.term}>
                <a
                  href={`#${glossarySlug(entry.term)}`}
                  className="text-sm font-medium text-accent hover:text-accent-hover"
                >
                  {entry.term}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <dl className="space-y-8">
          {GLOSSARY.map((entry) => (
            <div
              key={entry.term}
              id={glossarySlug(entry.term)}
              className="scroll-mt-24 border-b border-line pb-6"
            >
              <dt className="text-lg font-bold text-ink">{entry.term}</dt>
              <dd className="mt-2 text-muted">
                {entry.definition}
                {entry.linkTo && (
                  <>
                    {" "}
                    <Link
                      href={entry.linkTo}
                      className="font-semibold text-accent hover:text-accent-hover"
                    >
                      Learn more about AI Assisted SPM →
                    </Link>
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-10 text-sm text-muted">
          Looking for a specific platform?{" "}
          <Link href="/spm" className="font-semibold text-accent hover:text-accent-hover">
            See the SPM platforms Lanshore implements
          </Link>
          : Varicent, Xactly, CaptivateIQ, SAP, Anaplan, Salesforce Spiff, Performio,
          Akeron, and Incentivate.
        </p>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, itemListSchema, webPageSchema } from "@/lib/schema";
import { formatDate } from "@/lib/contentDates";
import { GUIDES, postPath } from "@/lib/blog";

const DESCRIPTION =
  "In-depth guides from Lanshore on sales performance management: modernizing legacy SPM, global incentive governance, compensation data governance, preventing commission disputes, and choosing SPM software.";

export const metadata: Metadata = {
  title: "SPM Guides: Incentive Governance, Modernization & Disputes | Lanshore",
  description: DESCRIPTION,
  alternates: { canonical: "/resources/guides" },
  openGraph: {
    siteName: "Lanshore",
    locale: "en_US",
    title: "SPM Guides: Incentive Governance, Modernization & Disputes | Lanshore",
    description: DESCRIPTION,
    url: "/resources/guides",
    type: "website",
  },
};

/* Same layout grammar as /blog: guides are blog-collection records with
   kind: guide, listed here instead. */
export default function GuidesIndexPage() {
  return (
    <>
      <JsonLd data={webPageSchema("CollectionPage", "Lanshore SPM Guides", DESCRIPTION, "/resources/guides")} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Resources", href: "/resources" },
          { name: "Guides", href: "/resources/guides" },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          "Lanshore SPM Guides",
          "/resources/guides",
          GUIDES.map((guide) => ({ name: guide.title, href: postPath(guide) }))
        )}
      />

      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
            <Link href="/resources" className="hover:text-gold-light">
              Resources
            </Link>
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">Lanshore SPM guides</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">
            Long-form, practitioner guides to running sales performance management at
            enterprise scale, from the team behind AI Assisted SPM by Lanshore.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        {GUIDES.length === 0 ? (
          <p className="text-muted">Guides are on their way.</p>
        ) : (
          <div className="space-y-6">
            {GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={postPath(guide)}
                className="group block rounded-lg border border-line p-6 hover:border-accent"
              >
                <h2 className="text-xl font-bold text-ink group-hover:text-accent">{guide.title}</h2>
                <p className="mt-1 text-xs text-muted">
                  Updated <time dateTime={guide.dateModified}>{formatDate(guide.dateModified)}</time>
                </p>
                <p className="mt-2 text-sm text-muted">{guide.description}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-accent">
                  Read the guide →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

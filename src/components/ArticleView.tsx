import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import NewsletterForm from "@/components/NewsletterForm";
import Markdown from "@/components/Markdown";
import AuthorByline from "@/components/AuthorByline";
import KeyTakeaways from "@/components/KeyTakeaways";
import SourcesList from "@/components/SourcesList";
import {
  blogPostingSchema,
  breadcrumbSchema,
  faqSchema,
  howToSchema,
  inPageItemListSchema,
} from "@/lib/schema";
import { postPath, type BlogPost } from "@/lib/blog";

/* Where an article sits: the eyebrow label and the breadcrumb trail above it. */
type Section = { label: string; trail: { name: string; href: string }[] };

export const BLOG_SECTION: Section = {
  label: "Blog",
  trail: [{ name: "Blog", href: "/blog" }],
};

export const GUIDES_SECTION: Section = {
  label: "Guide",
  trail: [
    { name: "Resources", href: "/resources" },
    { name: "Guides", href: "/resources/guides" },
  ],
};

/** Page metadata for a post or guide, canonical at its postPath(). */
export function articleMetadata(post: BlogPost): Metadata {
  const path = postPath(post);
  return {
    title: `${post.title} | Lanshore`,
    description: post.description,
    alternates: { canonical: path },
    openGraph: {
      siteName: "Lanshore",
      locale: "en_US",
      title: post.title,
      description: post.description,
      url: path,
      type: "article",
    },
  };
}

/**
 * One rendering for every record in the blog collection, whether it is
 * published under /blog or /resources/guides. Every piece of structured data
 * here describes something the same page shows: FAQ and HowTo content lives
 * in the Markdown body (front matter mirrors it), ItemList entries are body
 * headings, sources render under the body. check-schema-mirror.mjs fails the
 * build if any of that drifts.
 */
export default function ArticleView({ post, section }: { post: BlogPost; section: Section }) {
  const path = postPath(post);

  return (
    <>
      <JsonLd data={blogPostingSchema(post)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          ...section.trail,
          { name: post.title, href: path },
        ])}
      />
      {post.faq && <JsonLd data={faqSchema(post.faq)} />}
      {post.howTo && <JsonLd data={howToSchema(post.howTo, path)} />}
      {post.itemList && <JsonLd data={inPageItemListSchema(post.itemList, path)} />}

      <section className="bg-ink text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
            {section.label}
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">{post.title}</h1>
          {/* Mirrors the article's author, datePublished and dateModified.
              Structured data has to match what a reader can actually see. */}
          <AuthorByline
            author={post.author}
            dateModified={post.dateModified}
            datePublished={post.datePublished}
          />
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <KeyTakeaways items={post.keyTakeaways} />
        <Markdown>{post.body}</Markdown>
        <SourcesList sources={post.sources} />

        <p className="mt-12 border-t border-line pt-6 text-muted">
          See how this works in practice in the three pillars of AI Assisted SPM by
          Lanshore:{" "}
          <Link href="/agentic-spm/executive-dashboards" className="font-semibold text-accent">
            Executive Dashboards
          </Link>
          ,{" "}
          <Link href="/agentic-spm/operations" className="font-semibold text-accent">
            SPM Operations
          </Link>
          , and{" "}
          <Link href="/agentic-spm/custom-apps" className="font-semibold text-accent">
            Custom Apps
          </Link>
          .
        </p>

        {process.env.HUBSPOT_FORM_ID_NEWSLETTER ? (
          <div className="mt-12 rounded-lg border border-line bg-paper p-6">
            <h2 className="text-lg font-bold text-ink">
              Get new SPM &amp; agentic AI posts by email
            </h2>
            <p className="mt-2 mb-4 text-sm text-muted">
              Occasional notes from Lanshore. No spam, unsubscribe anytime.
            </p>
            <NewsletterForm variant="light" />
          </div>
        ) : null}
      </article>
    </>
  );
}

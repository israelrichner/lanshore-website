import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import NewsletterForm from "@/components/NewsletterForm";
import Markdown from "@/components/Markdown";
import AuthorByline from "@/components/AuthorByline";
import KeyTakeaways from "@/components/KeyTakeaways";
import { blogPostingSchema, breadcrumbSchema, faqSchema, howToSchema } from "@/lib/schema";
import { BLOG_POSTS, getPost } from "@/lib/blog";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Lanshore`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      siteName: "Lanshore",
      locale: "en_US",
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd data={blogPostingSchema(post)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: post.title, href: `/blog/${post.slug}` },
        ])}
      />
      {/* FAQ and HowTo content lives in the Markdown body; the front matter
          mirrors it for schema. check-schema-mirror.mjs fails the build if
          the two drift apart. */}
      {post.faq && <JsonLd data={faqSchema(post.faq)} />}
      {post.howTo && <JsonLd data={howToSchema(post.howTo, `/blog/${post.slug}`)} />}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
            Blog
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">{post.title}</h1>
          {/* Mirrors BlogPosting author, datePublished and dateModified.
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

import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import WhitePaperGate from "@/components/WhitePaperGate";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { WHITE_PAPERS } from "@/lib/whitePapers";
import { BLOG_POSTS } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Resources: Blog, White Papers, Glossary & Press | Lanshore",
  description:
    "Resources from Lanshore on AI Assisted SPM and sales performance management: blog posts, gated white papers, the SPM & agentic AI glossary, and press.",
  alternates: { canonical: "/resources" },
  openGraph: {
    siteName: "Lanshore",
    locale: "en_US",
    title: "Resources: Blog, White Papers, Glossary & Press | Lanshore",
    description:
      "Resources from Lanshore on AI Assisted SPM and sales performance management: blog posts, gated white papers, the SPM & agentic AI glossary, and press.",
    url: "/resources",
    type: "website",
  },
};

/* Derived from the blog collection rather than duplicated here. The card
   shows `cardTitle` when a post defines one — one post's real title is far
   too long for this grid — and otherwise its title. */
const RESOURCE_POSTS = BLOG_POSTS.map((post) => ({
  title: post.cardTitle ?? post.title,
  summary: post.summary,
  url: `/blog/${post.slug}`,
  featured: post.featured,
}));

export default function ResourcesPage() {
  const hasPapers = WHITE_PAPERS.length > 0;

  return (
    <>
      <JsonLd
        data={webPageSchema(
          "CollectionPage",
          "Lanshore Resources",
          "Resources from Lanshore on AI Assisted SPM and sales performance management: blog posts, white papers, the SPM & agentic AI glossary, and press.",
          "/resources"
        )}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Resources", href: "/resources" },
        ])}
      />

      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
            Resources
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">
            AI Assisted SPM, explained in depth
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">
            Blog posts, white papers, and the glossary behind AI Assisted SPM by Lanshore.
          </p>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
        <h2 className="mb-8 text-2xl font-bold text-ink sm:text-3xl">Blog</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {RESOURCE_POSTS.map((post) => (
            <a
              key={post.url}
              href={post.url}
              className={`group rounded-lg border p-6 hover:border-accent ${
                post.featured ? "border-accent bg-paper md:col-span-2" : "border-line"
              }`}
            >
              {post.featured && (
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
                  Start here
                </p>
              )}
              <h3 className="font-bold text-ink group-hover:text-accent">{post.title}</h3>
              <p className="mt-2 text-sm text-muted">{post.summary}</p>
            </a>
          ))}
        </div>
      </section>

      {/* White papers */}
      <section id="white-papers" className="scroll-mt-20 bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="mb-4 text-2xl font-bold text-ink sm:text-3xl">White Papers</h2>
          {hasPapers ? (
            <>
              <p className="mb-8 max-w-2xl text-muted">
                Practical guides on commission strategy, SPM implementation, vendor
                evaluation, nearshore delivery, and retail incentives. Enter your details
                to download.
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                {WHITE_PAPERS.map((paper) => (
                  <WhitePaperGate key={paper.slug} paper={paper} />
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="max-w-2xl text-muted">
                In-depth guides on SPM platform selection, comp operations, and agentic AI
                architecture. Request any of our current white papers through the contact
                form and we&rsquo;ll send them directly.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-block font-semibold text-accent hover:text-accent-hover"
              >
                Request a white paper →
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Glossary */}
      <section id="glossary" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
        <h2 className="mb-4 text-2xl font-bold text-ink sm:text-3xl">FAQ & Glossary</h2>
        <p className="max-w-2xl text-muted">
          Plain-English definitions of SPM and agentic AI terms — from AI Assisted SPM and
          crediting to clawbacks, SPIFs, and true-ups.
        </p>
        <Link
          href="/resources/glossary"
          className="mt-6 inline-block font-semibold text-accent hover:text-accent-hover"
        >
          Browse the glossary →
        </Link>
      </section>

      {/* Events & Press */}
      <section id="events-press" className="scroll-mt-20 bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="mb-4 text-2xl font-bold text-ink sm:text-3xl">Events & Press</h2>
          <p className="max-w-2xl text-muted">
            Find us at SPM and RevOps industry events, or reach our team for press
            inquiries at{" "}
            <a href="mailto:sales@lanshore.com" className="font-semibold text-accent">
              sales@lanshore.com
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}

/* Blog posts, sourced from content/blog/*.md.
   Previously a hand-authored array in this file; the posts themselves were
   migrated verbatim from lanshore.com and are unchanged. */

import type { FaqItem } from "./schema";
import { loadBlog, type HowToEntry, type SourceEntry, type ItemListEntry } from "./content/loadContent";

export type BlogBlock = { type: "h2" | "h3" | "p" | "li"; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  /* ISO date (YYYY-MM-DD) this post's content last changed. Feeds the visible
     byline, BlogPosting.dateModified, and the sitemap's <lastmod>.
     Bump it when you edit the copy — not when the page is restyled.
     See blogPostingSchema() in lib/schema.ts. */
  dateModified: string;
  /* Real publish date, when one exists. The five migrated posts have none:
     the old lanshore.com never showed one and no original date survives, so
     the key stays absent rather than being guessed. Posts written for this
     site set it. */
  datePublished?: string;
  /* Byline, keyed into AUTHORS in lib/authors.ts. Absent means the post is
     attributed to Lanshore the company, which is how the migrated posts were
     actually published. */
  author?: string;
  /* Site-absolute path or https URL. Falls back to the generated OG card. */
  image?: string;
  /* Q&A also rendered in the post body — required for FAQPage schema,
     which must mirror visible content. */
  faq?: FaqItem[];
  /* Two to six one-line summaries, rendered above the body. */
  keyTakeaways?: string[];
  /* A procedure the body already contains as step headings. Emitted as
     HowTo JSON-LD; check-schema-mirror.mjs fails the build if a step name is
     not a heading on the rendered page. */
  howTo?: HowToEntry;
  /* "guide" publishes under /resources/guides as an Article; absent is a
     /blog post. Always build a URL with postPath(), never by hand. */
  kind?: "guide";
  /* Compares named vendors or firms; validation then requires `sources`. */
  comparison?: boolean;
  /* Dated public sources, rendered under the article. */
  sources?: SourceEntry[];
  /* Listicle entries, each the exact text of a body heading. */
  itemList?: ItemListEntry;
  /* Markdown source of the post body. */
  body: string;
  /* Parsed from `body`. Retained so the block renderer keeps working; once
     nothing reads it, it can go. */
  blocks: BlogBlock[];
  /* Surfaced on /resources, which shows a curated card per post. */
  featured: boolean;
  summary: string;
  /* A shorter title for the /resources card, when the full one is unwieldy. */
  cardTitle?: string;
  /* Drives the Gartner trademark footnote in the site footer. */
  mentionsGartner: boolean;
};

export const BLOG_POSTS: BlogPost[] = loadBlog();

/** The one place a post or guide URL is built. */
export function postPath(post: { slug: string; kind?: string }): string {
  return post.kind === "guide" ? `/resources/guides/${post.slug}` : `/blog/${post.slug}`;
}

/* The collection holds both; each route lists only its own. */
export const ARTICLES: BlogPost[] = BLOG_POSTS.filter((p) => p.kind !== "guide");
export const GUIDES: BlogPost[] = BLOG_POSTS.filter((p) => p.kind === "guide");

/** A /blog post by slug. A guide's slug does not resolve here. */
export function getPost(slug: string): BlogPost | undefined {
  return ARTICLES.find((p) => p.slug === slug);
}

/** A /resources/guides guide by slug. */
export function getGuide(slug: string): BlogPost | undefined {
  return GUIDES.find((p) => p.slug === slug);
}

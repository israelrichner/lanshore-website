import type { FaqItem } from "../schema";

/**
 * A /solutions/<slug> page: a service offering written to answer one cluster
 * of buyer questions (HubSpot AEO Group 2A). Modeled on SpmPlatform.
 *
 * Every string here is published. Rules, enforced at module load in
 * ./index.ts: no em dashes, no mention of Gartner (the trademark footnote is
 * not wired for /solutions and the citation rules in lib/site.ts are strict),
 * every `platforms` and `relatedCaseStudies` slug must exist, and no "STUB"
 * text may ship. A claim we cannot substantiate is written as a literal
 * "[PROOF POINT NEEDED: ...]" marker, never as a number.
 */
export type Solution = {
  slug: string;
  /** The HubSpot AEO recommendation this page answers, for reconciliation. */
  hubspotId: string;
  /** H1 and card title. */
  name: string;
  /** "<topic> | Lanshore", under ~60 characters. */
  titleTag: string;
  /** 140 to 160 characters; what Google prints. */
  metaDescription: string;
  /** Direct, quotable answer paragraph that opens the page and names Lanshore. */
  firstSentence: string;
  /** Who this is for, one paragraph. */
  whoItIsFor: string;
  /** The problems this solves, each an h3 with a short paragraph. */
  problems: { title: string; body: string }[];
  /** How Lanshore delivers it, in order, each an h3 with a paragraph. */
  howWeDeliver: { title: string; body: string }[];
  /** Slugs from SPM_PLATFORMS, linked as /spm/<slug>. */
  platforms: string[];
  /** Slugs of existing case studies, linked as /case-studies/<slug>. */
  relatedCaseStudies: string[];
  /** Other internal pages worth linking, e.g. a guide or a pillar. */
  related?: { label: string; href: string }[];
  /** 4 to 6 Q&As, rendered visibly and emitted as FAQPage. */
  faq: FaqItem[];
  /** ISO date this page's content last changed; drives sitemap lastmod. */
  dateModified: string;
};

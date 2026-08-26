/**
 * The filesystem read layer for repo-native content.
 *
 * Runs at module scope, which means at BUILD time for every page — the
 * public site keeps zero runtime data dependencies, so no CMS, database or
 * API outage can ever empty /blog. The one exception is the white-paper
 * download route, which runs in a serverless function and reads the same
 * files from its own bundle; that is what `outputFileTracingIncludes` in
 * next.config.ts exists for.
 *
 * Three rules this module enforces, all deliberate:
 *
 *   1. Slug comes from the FILENAME, never from front matter. One name, one
 *      URL, no way for the two to disagree.
 *   2. Drafts are filtered unconditionally. There is no preview deployment
 *      that shows them; a draft is invisible to the public site, full stop.
 *   3. Invalid content THROWS, which fails the build. This mirrors what
 *      src/lib/whitePapers.ts already did and is the property that keeps a
 *      malformed hand edit from reaching production as a broken page.
 *
 * Ordering comes from content/SLUGS.lock.json, not from the directory
 * listing. Directory order is alphabetical; the site's order is editorial,
 * and it is load-bearing — ItemList JSON-LD and the sitemap both encode it.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  VALIDATORS,
  markdownToBlocks,
  derivesMentionsGartner,
} from "../../../scripts/lib/content-rules.mjs";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type BlogBlock = { type: "h2" | "h3" | "p" | "li"; text: string };
export type FaqEntry = { question: string; answer: string };

export type CollectionKey = "blog" | "caseStudies" | "whitePapers";

type Ledger = {
  version: number;
  blog: string[];
  caseStudies: string[];
  whitePapers: string[];
  retired: { slug: string; collection: string; retiredOn?: string; redirectTo: string }[];
};

function readLedger(): Ledger {
  const file = path.join(CONTENT_DIR, "SLUGS.lock.json");
  if (!fs.existsSync(file)) {
    throw new Error(`Content ledger missing: ${file}. Run scripts/migrate-content.mjs.`);
  }
  return JSON.parse(fs.readFileSync(file, "utf8")) as Ledger;
}

const LEDGER = readLedger();

/**
 * Order by the ledger, then anything the ledger does not mention.
 *
 * An unregistered file is a rule-L3 violation that `check:content` fails the
 * build on — but this loader must not crash before that check can produce
 * its far more useful message, so unknown slugs sort last instead of
 * throwing here.
 */
function byLedgerOrder<T extends { slug: string }>(records: T[], collection: CollectionKey): T[] {
  const order = new Map(LEDGER[collection].map((slug, i) => [slug, i]));
  return [...records].sort(
    (a, b) => (order.get(a.slug) ?? Number.MAX_SAFE_INTEGER) - (order.get(b.slug) ?? Number.MAX_SAFE_INTEGER)
  );
}

function readDir(dirName: string, ext: string): { slug: string; raw: string }[] {
  const dir = path.join(CONTENT_DIR, dirName);
  if (!fs.existsSync(dir)) {
    throw new Error(`Content directory missing: ${dir}. Run scripts/migrate-content.mjs.`);
  }
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(ext))
    .map((f) => ({ slug: f.slice(0, -ext.length), raw: fs.readFileSync(path.join(dir, f), "utf8") }));
}

function validateOrThrow(collection: CollectionKey, record: object, slug: string): void {
  const errors: string[] = VALIDATORS[collection](record, slug);
  if (errors.length) {
    throw new Error(`Invalid content in ${collection}/${slug}:\n  ${errors.join("\n  ")}`);
  }
}

/* ------------------------------------------------------------------ *
 * Blog
 * ------------------------------------------------------------------ */

export type BlogRecord = {
  slug: string;
  title: string;
  description: string;
  dateModified: string;
  faq?: FaqEntry[];
  body: string;
  blocks: BlogBlock[];
  featured: boolean;
  summary: string;
  /** Shorter title for the /resources card, when it differs from `title`. */
  cardTitle?: string;
  /** Drives the Gartner trademark footnote in the site footer. */
  mentionsGartner: boolean;
};

export function loadBlog(): BlogRecord[] {
  const records: BlogRecord[] = [];

  for (const { slug, raw } of readDir("blog", ".md")) {
    const parsed = matter(raw);
    const data = parsed.data as Record<string, unknown>;
    const body = parsed.content;

    validateOrThrow("blog", { ...data, body }, slug);
    if (data.draft === true) continue;

    const faq = data.faq as FaqEntry[] | undefined;

    records.push({
      slug,
      title: String(data.title),
      description: String(data.description),
      dateModified: String(data.dateModified),
      ...(faq ? { faq } : {}),
      body,
      blocks: markdownToBlocks(body) as BlogBlock[],
      featured: data.featured === true,
      summary: typeof data.summary === "string" ? data.summary : String(data.description),
      ...(typeof data.cardTitle === "string" ? { cardTitle: data.cardTitle } : {}),
      /* Case-insensitive across every field a reader actually sees, so the
         trademark footnote fires whether "Gartner" appears in a heading, the
         body copy, or an FAQ answer. */
      mentionsGartner: derivesMentionsGartner(
        data.title,
        data.description,
        body,
        ...(faq ?? []).flatMap((f) => [f.question, f.answer])
      ),
    });
  }

  return byLedgerOrder(records, "blog");
}

/* ------------------------------------------------------------------ *
 * Case studies
 * ------------------------------------------------------------------ */

export type CaseStudyRecord = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  pillar: "Executive Dashboards" | "SPM Operations" | "Custom Apps" | "Services";
  outcome: string;
  challenge: string;
  whatWeDid: string;
  results: string[];
  stack: string[];
  legacyUrl: string;
  /** Optional; callers fall back to UPDATED.caseStudies when absent. */
  dateModified?: string;
};

export function loadCaseStudies(): CaseStudyRecord[] {
  const records: CaseStudyRecord[] = [];

  for (const { slug, raw } of readDir("case-studies", ".json")) {
    const data = JSON.parse(raw) as Record<string, unknown> & { draft?: boolean };
    validateOrThrow("caseStudies", data, slug);
    if (data.draft === true) continue;
    const { draft: _draft, ...rest } = data;
    records.push({ slug, ...(rest as Omit<CaseStudyRecord, "slug">) });
  }

  return byLedgerOrder(records, "caseStudies");
}

/* ------------------------------------------------------------------ *
 * White papers
 * ------------------------------------------------------------------ */

export type WhitePaperRecord = {
  slug: string;
  title: string;
  description: string;
  file: string;
  hubspotValue: string;
};

export function loadWhitePapers(): WhitePaperRecord[] {
  const records: WhitePaperRecord[] = [];

  for (const { slug, raw } of readDir("white-papers", ".json")) {
    const data = JSON.parse(raw) as Record<string, unknown> & { draft?: boolean };
    validateOrThrow("whitePapers", data, slug);
    if (data.draft === true) continue;

    records.push({
      slug,
      title: String(data.title),
      description: String(data.description),
      file: String(data.file),
      /* Defaults to the slug — true for all five current papers, and the
         value the HubSpot dropdown option is keyed on. */
      hubspotValue: typeof data.hubspotValue === "string" ? data.hubspotValue : slug,
    });
  }

  return byLedgerOrder(records, "whitePapers");
}

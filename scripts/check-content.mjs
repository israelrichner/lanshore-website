/**
 * Build gate for repo-native content. Wired into `prebuild`, so a violation
 * fails the build instead of silently 404ing a live URL in production.
 *
 *   node --experimental-strip-types scripts/check-content.mjs
 *
 * Two properties this file must not lose:
 *
 *   1. It reads content files from DISK, drafts INCLUDED — never the
 *      draft-filtered BLOG_POSTS/CASE_STUDIES/WHITE_PAPERS arrays. That
 *      sourcing choice is what makes Unpublish safe: the file is still
 *      there, so the ledger still resolves. Checking the filtered arrays
 *      was review blocker B1, where three of the admin's four buttons
 *      failed the build.
 *
 *   2. Redirect destinations come from scripts/lib/redirect-destinations.mjs,
 *      which is generated from next.config.ts and kept honest by its own
 *      drift test. The admin's request path needs the same list and must not
 *      import the framework config, so both sides read one source rather
 *      than each deriving it — a second derivation would drift and rule L4
 *      would quietly stop protecting whichever URLs fell out.
 *
 * All rules live in scripts/lib/content-rules.mjs. This file only gathers
 * inputs and reports.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { VALIDATORS, checkLedger } from "./lib/content-rules.mjs";
import { REDIRECT_DESTINATIONS } from "./lib/redirect-destinations.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const CONTENT = path.join(ROOT, "content");

function readCollection(dirName, ext) {
  const dir = path.join(CONTENT, dirName);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(ext))
    .map((f) => {
      const slug = f.slice(0, -ext.length);
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      if (ext === ".md") {
        const g = matter(raw);
        return { slug, record: { ...g.data, body: g.content }, draft: g.data.draft === true };
      }
      const record = JSON.parse(raw);
      return { slug, record, draft: record.draft === true };
    });
}

const onDiskRaw = {
  blog: readCollection("blog", ".md"),
  caseStudies: readCollection("case-studies", ".json"),
  whitePapers: readCollection("white-papers", ".json"),
};

const errors = [];

/* --- field validation, drafts included ------------------------------- */
for (const [collection, items] of Object.entries(onDiskRaw)) {
  for (const { slug, record } of items) {
    errors.push(...VALIDATORS[collection](record, slug));
  }
}

/* --- every registered white paper has its PDF ------------------------ */
for (const { slug, record } of onDiskRaw.whitePapers) {
  const pdf = path.join(ROOT, "public", "whitepapers", `${slug}.pdf`);
  if (!fs.existsSync(pdf)) {
    errors.push(`white-papers/${slug}: "${record.file}" has no file at public/whitepapers/${slug}.pdf`);
  }
}

/* --- redirect destinations ------------------------------------------- */

/* From the generated list, which redirect-destinations.test.mjs keeps in
   agreement with next.config.ts. The admin's request path needs the same
   data and must not import the framework config, so both read one source. */
const redirectDestinations = REDIRECT_DESTINATIONS;

/* --- ledger rules L1-L4 ---------------------------------------------- */
const ledgerPath = path.join(CONTENT, "SLUGS.lock.json");
if (!fs.existsSync(ledgerPath)) {
  console.error(`content/SLUGS.lock.json is missing. Run scripts/migrate-content.mjs.`);
  process.exit(1);
}
const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"));

const onDisk = Object.fromEntries(
  Object.entries(onDiskRaw).map(([k, items]) => [k, items.map(({ slug, draft }) => ({ slug, draft }))])
);

const livePaths = [
  "/blog",
  "/case-studies",
  "/resources",
  ...onDisk.blog.filter((r) => !r.draft).map((r) => `/blog/${r.slug}`),
  ...onDisk.caseStudies.filter((r) => !r.draft).map((r) => `/case-studies/${r.slug}`),
];

errors.push(...checkLedger({ ledger, onDisk, redirectDestinations, livePaths }));

/* --- report ----------------------------------------------------------- */
const counts = Object.entries(onDisk)
  .map(([k, v]) => `${k} ${v.length}`)
  .join(", ");

if (errors.length) {
  console.error(`check:content FAILED — ${errors.length} problem(s)\n`);
  for (const e of errors) console.error("  " + e);
  console.error(`\nchecked: ${counts}; 301 destinations guarded: ${redirectDestinations.blog.length} blog, ${redirectDestinations.caseStudies.length} case studies`);
  process.exit(1);
}

console.log(
  `check:content OK — ${counts}; 301 destinations guarded: ${redirectDestinations.blog.length} blog, ${redirectDestinations.caseStudies.length} case studies`
);

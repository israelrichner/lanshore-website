/**
 * One-shot migration: the three hand-authored TypeScript arrays become
 * repo-native content files under content/.
 *
 *   node --experimental-strip-types scripts/migrate-content.mjs          # write
 *   node --experimental-strip-types scripts/migrate-content.mjs --verify # check only
 *
 * The round-trip assertion is the real gate, not the file count. After
 * building each Markdown body the script parses it straight back into a
 * block sequence and asserts it is identical to the blocks it came from —
 * same types, same order, same text. A mismatch aborts before anything is
 * written. This fails on the developer's machine, which is worth far more
 * than the golden diff catching it at review time (source plan section 8).
 *
 * Ordering note. The source plan never says how the array order survives the
 * move to files, and it cannot survive on its own: none of the three arrays
 * is alphabetical, and all five blog posts share the same dateModified, so
 * neither filename nor date sorting reproduces it. Order is load-bearing —
 * ItemList JSON-LD and the sitemap both encode it. So this script also emits
 * content/SLUGS.lock.json with each collection in its original order, and
 * loadContent.ts uses that as the canonical sequence.
 */

import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
/* Absolute Windows paths ("C:\...") are not valid ESM URLs — the loader
   reads the drive letter as a protocol. Every dynamic import here goes
   through pathToFileURL so this runs on Windows as well as POSIX. */
import { pathToFileURL } from "node:url";
import matter from "gray-matter";
import { VALIDATORS } from "./lib/content-rules.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const CONTENT = path.join(ROOT, "content");
const VERIFY_ONLY = process.argv.includes("--verify");

/* ------------------------------------------------------------------ *
 * Markdown conversion
 * ------------------------------------------------------------------ */

/* Survey finding: across all 234 blocks, the ONLY Markdown-hostile
   construct is a paragraph whose text opens with an ordered-list marker
   ("1. ", "2. " ...). Ten p-blocks do. Written raw they would re-parse as
   <ol><li>, silently restructuring the article. Five h3 blocks share the
   prefix but are safe — heading content is never list-parsed.

   No block text contains an underscore, asterisk, bracket, or a leading
   #, -, > or +. The escaper below therefore handles exactly one case, and
   asserts loudly if that ever stops being true. */
const ORDERED_PREFIX = /^(\d+)\. /;
const ESCAPED_PREFIX = /^(\d+)\\\. /;
const UNEXPECTED_LEADER = /^([#\-*>|+~=]|\d+\))\s/;

function escapeParagraph(text) {
  if (UNEXPECTED_LEADER.test(text)) {
    throw new Error(
      `Unhandled Markdown-hostile prefix in paragraph, escaping table is incomplete: ${JSON.stringify(text.slice(0, 60))}`
    );
  }
  return text.replace(ORDERED_PREFIX, "$1\\. ");
}

function unescapeParagraph(text) {
  return text.replace(ESCAPED_PREFIX, "$1. ");
}

/** blocks[] -> Markdown body */
export function blocksToMarkdown(blocks) {
  const chunks = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === "li") {
      /* Consecutive li blocks are one list — the same grouping groupBlocks()
         did at render time, now expressed in the source format. */
      const items = [];
      while (i < blocks.length && blocks[i].type === "li") {
        items.push(`- ${escapeParagraph(blocks[i].text)}`);
        i++;
      }
      i--;
      chunks.push(items.join("\n"));
    } else if (b.type === "h2") {
      chunks.push(`## ${b.text}`);
    } else if (b.type === "h3") {
      chunks.push(`### ${b.text}`);
    } else if (b.type === "p") {
      chunks.push(escapeParagraph(b.text));
    } else {
      throw new Error(`Unknown block type: ${JSON.stringify(b.type)}`);
    }
  }
  return chunks.join("\n\n") + "\n";
}

/** Markdown body -> blocks[]. Verification only; the site renders Markdown. */
export function markdownToBlocks(md) {
  const blocks = [];
  for (const line of md.split("\n")) {
    if (!line.trim()) continue;
    if (line.startsWith("### ")) blocks.push({ type: "h3", text: line.slice(4) });
    else if (line.startsWith("## ")) blocks.push({ type: "h2", text: line.slice(3) });
    else if (line.startsWith("- ")) blocks.push({ type: "li", text: unescapeParagraph(line.slice(2)) });
    else blocks.push({ type: "p", text: unescapeParagraph(line) });
  }
  return blocks;
}

/* ------------------------------------------------------------------ *
 * Sources
 * ------------------------------------------------------------------ */

const importTs = (rel) => import(pathToFileURL(path.join(ROOT, rel)).href);

const { BLOG_POSTS } = await importTs("src/lib/blog.ts");
const { CASE_STUDIES } = await importTs("src/lib/caseStudies.ts");
const { WHITE_PAPERS } = await importTs("src/lib/whitePapers.ts");

/* The /resources page keeps its own copy of the blog list with a `summary`,
   a `featured` flag, and — for one post — a SHORTENED display title. All
   three must move into front matter or rewiring that page changes its
   rendered HTML. Parsed rather than imported because the array is a local
   const, not an export. */
function readResourcesSeed() {
  const src = fs.readFileSync(path.join(ROOT, "src/app/resources/page.tsx"), "utf8");
  const start = src.indexOf("const BLOG_POSTS");
  const end = src.indexOf("export default function ResourcesPage");
  assert.ok(start !== -1 && end > start, "could not locate the resources BLOG_POSTS array");
  const block = src.slice(start, end);

  const entries = [...block.matchAll(/\{\s*title:\s*\n?\s*"((?:[^"\\]|\\.)*)",\s*summary:\s*\n?\s*"((?:[^"\\]|\\.)*)",\s*url:\s*"([^"]+)",\s*featured:\s*(true|false),?\s*\}/g)];
  assert.equal(entries.length, 5, `expected 5 resources entries, parsed ${entries.length}`);

  const seed = new Map();
  for (const [, title, summary, url, featured] of entries) {
    seed.set(url.replace("/blog/", ""), {
      title: title.replace(/\\"/g, '"'),
      summary: summary.replace(/\\"/g, '"'),
      featured: featured === "true",
    });
  }
  return seed;
}

const seed = readResourcesSeed();

/* ------------------------------------------------------------------ *
 * Build records
 * ------------------------------------------------------------------ */

const files = []; // {abs, contents, collection, slug}

for (const post of BLOG_POSTS) {
  const body = blocksToMarkdown(post.blocks);

  /* Gate: parse the emitted Markdown straight back and demand the original
     block sequence. Aborts the whole migration on any mismatch. */
  assert.deepEqual(
    markdownToBlocks(body),
    post.blocks,
    `ROUND-TRIP FAILED for blog/${post.slug} — emitted Markdown does not parse back to the original blocks`
  );

  const s = seed.get(post.slug);
  assert.ok(s, `blog/${post.slug}: no /resources seed entry found`);

  const data = {
    title: post.title,
    description: post.description,
    dateModified: post.dateModified,
    featured: s.featured,
    summary: s.summary,
  };
  /* Only when /resources deliberately shows a shorter title than the post's
     own. One of the five does; without this, rewiring that page would
     lengthen the card and change the rendered HTML. */
  if (s.title !== post.title) data.cardTitle = s.title;
  if (post.faq) data.faq = post.faq;

  files.push({
    collection: "blog",
    slug: post.slug,
    abs: path.join(CONTENT, "blog", `${post.slug}.md`),
    contents: matter.stringify(body, data),
  });
}

for (const study of CASE_STUDIES) {
  const { slug, ...rest } = study;
  files.push({
    collection: "caseStudies",
    slug,
    abs: path.join(CONTENT, "case-studies", `${slug}.json`),
    contents: JSON.stringify(rest, null, 2) + "\n",
  });
}

for (const paper of WHITE_PAPERS) {
  const { slug, ...rest } = paper;
  files.push({
    collection: "whitePapers",
    slug,
    abs: path.join(CONTENT, "white-papers", `${slug}.json`),
    contents: JSON.stringify(rest, null, 2) + "\n",
  });
}

/* Canonical order, captured from the arrays before anything touches disk. */
const ledger = {
  version: 1,
  blog: BLOG_POSTS.map((p) => p.slug),
  caseStudies: CASE_STUDIES.map((c) => c.slug),
  whitePapers: WHITE_PAPERS.map((w) => w.slug),
  retired: [],
};

/* ------------------------------------------------------------------ *
 * Validate everything before writing anything
 * ------------------------------------------------------------------ */

const problems = [];
for (const f of files) {
  const parsed =
    f.collection === "blog"
      ? (() => {
          const g = matter(f.contents);
          return { ...g.data, body: g.content };
        })()
      : JSON.parse(f.contents);
  problems.push(...VALIDATORS[f.collection](parsed, f.slug));
}
if (problems.length) {
  console.error("VALIDATION FAILED — nothing written:");
  for (const p of problems) console.error("  " + p);
  process.exit(1);
}

/* Re-parse the emitted blog files and confirm the full record still equals
   the original, front matter included — not just the block sequence. */
for (const f of files.filter((x) => x.collection === "blog")) {
  const g = matter(f.contents);
  const original = BLOG_POSTS.find((p) => p.slug === f.slug);
  assert.deepEqual(markdownToBlocks(g.content), original.blocks, `blocks mismatch after front-matter round trip: ${f.slug}`);
  assert.equal(g.data.title, original.title, `title mismatch: ${f.slug}`);
  assert.equal(g.data.description, original.description, `description mismatch: ${f.slug}`);
  assert.equal(g.data.dateModified, original.dateModified, `dateModified mismatch: ${f.slug}`);
  if (original.faq) assert.deepEqual(g.data.faq, original.faq, `faq mismatch: ${f.slug}`);
}

for (const f of files.filter((x) => x.collection !== "blog")) {
  const source = f.collection === "caseStudies" ? CASE_STUDIES : WHITE_PAPERS;
  const original = source.find((x) => x.slug === f.slug);
  const { slug, ...rest } = original;
  assert.deepEqual(JSON.parse(f.contents), rest, `record mismatch: ${f.collection}/${f.slug}`);
}

console.log(`round-trip OK: ${files.length} records (${files.filter((f) => f.collection === "blog").length} blog, ${files.filter((f) => f.collection === "caseStudies").length} case studies, ${files.filter((f) => f.collection === "whitePapers").length} white papers)`);
console.log(`escaped paragraphs: ${BLOG_POSTS.flatMap((p) => p.blocks).filter((b) => b.type === "p" && ORDERED_PREFIX.test(b.text)).length}`);

if (VERIFY_ONLY) {
  /* Compare against what is already on disk rather than rewriting it. */
  let drift = 0;
  for (const f of [...files, { abs: path.join(CONTENT, "SLUGS.lock.json"), contents: JSON.stringify(ledger, null, 2) + "\n" }]) {
    if (!fs.existsSync(f.abs)) {
      console.error(`MISSING: ${path.relative(ROOT, f.abs)}`);
      drift++;
    } else if (fs.readFileSync(f.abs, "utf8").replace(/\r\n/g, "\n") !== f.contents) {
      console.error(`DRIFTED: ${path.relative(ROOT, f.abs)}`);
      drift++;
    }
  }
  if (drift) {
    console.error(`${drift} file(s) differ from what the migration would emit`);
    process.exit(1);
  }
  console.log("verify: on-disk content matches the source arrays exactly");
  process.exit(0);
}

for (const dir of ["blog", "case-studies", "white-papers"]) {
  fs.mkdirSync(path.join(CONTENT, dir), { recursive: true });
}
for (const f of files) fs.writeFileSync(f.abs, f.contents);
fs.writeFileSync(path.join(CONTENT, "SLUGS.lock.json"), JSON.stringify(ledger, null, 2) + "\n");

console.log(`wrote ${files.length} content files + SLUGS.lock.json into content/`);

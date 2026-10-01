/**
 * The single source of validation truth for repo-native content.
 *
 * Imported by scripts/migrate-content.mjs, scripts/check-content.mjs, and
 * (in P3) the studio admin's pre-flight check. Nothing reimplements these
 * rules — a second copy is how the admin and the build gate drift apart and
 * an editor learns about a violation from a Vercel failure email instead of
 * an inline form error.
 *
 * Plain .mjs on purpose: a build script cannot import a .ts module, and this
 * file must be loadable by `node` with no bundler and no `@/*` alias. The
 * TypeScript side wraps this, not the other way round.
 *
 * Every function here is PURE — it takes already-read data and returns an
 * array of human-readable error strings. Filesystem access lives in the
 * callers, which keeps this testable without fixtures on disk.
 */

import { normalize, containsPhrase, markdownText, markdownHeadings } from "./schema-mirror.mjs";
import { headingId } from "../../src/lib/heading-id.mjs";

export const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/* ------------------------------------------------------------------ *
 * Markdown <-> blocks
 *
 * Lives here, not in the migration script, because both the one-shot
 * migration and the runtime loader need the same mapping and a second copy
 * is how the two drift. Survey finding: across all 234 blocks the only
 * Markdown-hostile construct is a paragraph opening with an ordered-list
 * marker ("1. "). Ten p-blocks do; written raw they re-parse as <ol><li>,
 * silently restructuring the article. Five h3 blocks share the prefix but
 * are safe — heading content is never list-parsed. No block text contains
 * an underscore, asterisk, bracket, or a leading #, -, > or +.
 * ------------------------------------------------------------------ */

const ORDERED_PREFIX = /^(\d+)\. /;
const ESCAPED_PREFIX = /^(\d+)\\\. /;
const UNEXPECTED_LEADER = /^([#\-*>|+~=]|\d+\))\s/;

export function escapeParagraph(text) {
  if (UNEXPECTED_LEADER.test(text)) {
    throw new Error(
      `Unhandled Markdown-hostile prefix, escaping table is incomplete: ${JSON.stringify(text.slice(0, 60))}`
    );
  }
  return text.replace(ORDERED_PREFIX, "$1\\. ");
}

export function unescapeParagraph(text) {
  return text.replace(ESCAPED_PREFIX, "$1. ");
}

export function countEscapableParagraphs(blocks) {
  return blocks.filter((b) => b.type === "p" && ORDERED_PREFIX.test(b.text)).length;
}

/** blocks[] -> Markdown body */
export function blocksToMarkdown(blocks) {
  const chunks = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === "li") {
      /* Consecutive li blocks are one list — the grouping groupBlocks() did
         at render time, now expressed in the source format. */
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

/**
 * Markdown body -> blocks[].
 *
 * Safe as a line-based parser only because of a verified property of this
 * corpus: no block text contains a newline (checked across all 234 blocks).
 * If that ever stops holding, this needs a real Markdown AST walk.
 */
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

/** Case-insensitive, so "gartner" in body copy still trips the footnote. */
export function derivesMentionsGartner(...parts) {
  return parts.some((p) => typeof p === "string" && p.toLowerCase().includes("gartner"));
}

/** Mirrors the `pillar` union in src/lib/caseStudies.ts. */
export const PILLARS = [
  "Executive Dashboards",
  "SPM Operations",
  "Custom Apps",
  "Services",
];

export const COLLECTIONS = ["blog", "caseStudies", "whitePapers"];

/**
 * Bylines a content record is allowed to claim.
 *
 * The list lives here, in the .mjs layer, because three things need the same
 * answer and must not drift: the build gate (check:content), the studio admin's
 * author picker, and src/lib/authors.ts, which throws at module load if its
 * records do not match this list exactly.
 *
 * An id here is a person the site is willing to attribute work to in public and
 * in `Person` schema. Adding one means adding a real human, not a label.
 */
export const AUTHOR_IDS = ["doug-erb"];

/**
 * The `dateModified` a case study shows when it carries none of its own.
 *
 * Lives here, not only in src/lib/contentDates.ts (which re-exports it as
 * UPDATED.caseStudies), because the datePublished ordering rule must compare
 * against the date the page will actually display. Without it, a study with
 * no own dateModified could claim "Published Sep 15 · Last updated Jul 8".
 */
export const CASE_STUDIES_DEFAULT_MODIFIED = "2026-07-08";

/* ------------------------------------------------------------------ *
 * Shared field helpers
 * ------------------------------------------------------------------ */

function reqString(record, field, where, errors) {
  const v = record[field];
  if (typeof v !== "string" || v.trim() === "") {
    errors.push(`${where}: "${field}" must be a non-empty string`);
    return false;
  }
  return true;
}

function reqStringArray(record, field, where, errors) {
  const v = record[field];
  if (!Array.isArray(v) || v.length === 0) {
    errors.push(`${where}: "${field}" must be a non-empty array`);
    return false;
  }
  const bad = v.findIndex((x) => typeof x !== "string" || x.trim() === "");
  if (bad !== -1) {
    errors.push(`${where}: "${field}[${bad}]" must be a non-empty string`);
    return false;
  }
  return true;
}

/* A real calendar date, not just the right shape. "2026-02-30" matches
   DATE_RE but is not a day, and Date() would silently roll it to March. */
function validDate(value, field, where, errors) {
  if (typeof value !== "string" || !DATE_RE.test(value)) {
    errors.push(`${where}: "${field}" must be YYYY-MM-DD, got ${JSON.stringify(value)}`);
    return false;
  }
  const [y, m, d] = value.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) {
    errors.push(`${where}: "${field}" is not a real date: ${value}`);
    return false;
  }
  return true;
}

function validSlug(slug, where, errors) {
  if (typeof slug !== "string" || !SLUG_RE.test(slug)) {
    errors.push(
      `${where}: slug must match ${SLUG_RE} (lowercase, digits, hyphens), got ${JSON.stringify(slug)}`
    );
    return false;
  }
  return true;
}

/**
 * Optional byline, publish date and image. Shared by blog posts and case
 * studies, which carry identical rules for all three.
 *
 * All three fields are optional by design. `datePublished` in particular must
 * never be back-filled with a guess: most of this content was migrated from
 * the old lanshore.com, which never displayed a publish date, and an invented
 * one is a false freshness signal aimed at the exact engines the schema exists
 * to inform. Absent is honest; wrong is not.
 */
function validateBylineFields(record, where, errors, fallbackModified) {
  if (record.author !== undefined && !AUTHOR_IDS.includes(record.author)) {
    errors.push(
      `${where}: "author" must be one of ${AUTHOR_IDS.map((a) => `"${a}"`).join(", ")}, ` +
        `got ${JSON.stringify(record.author)}. Add the person to AUTHOR_IDS in ` +
        `scripts/lib/content-rules.mjs and to AUTHORS in src/lib/authors.ts first.`
    );
  }

  if (record.datePublished !== undefined) {
    if (validDate(record.datePublished, "datePublished", where, errors)) {
      /* Case studies may omit dateModified; the page then shows
         CASE_STUDIES_DEFAULT_MODIFIED, so compare against that. */
      const modified = record.dateModified ?? fallbackModified;
      if (
        typeof modified === "string" &&
        DATE_RE.test(modified) &&
        record.datePublished > modified
      ) {
        errors.push(
          `${where}: "datePublished" (${record.datePublished}) is after "dateModified" ` +
            `(${modified}). Content cannot be modified before it was published.`
        );
      }
    }
  }

  if (record.image !== undefined) {
    if (typeof record.image !== "string" || record.image.trim() === "") {
      errors.push(`${where}: "image" must be a non-empty string when present`);
    } else if (
      /* "//evil.example/x.png" starts with "/" but is protocol-relative and
         resolves to a third-party host, which is the same escape whitePapers.ts
         guards against for PDF paths. Check it before the generic prefix test. */
      record.image.startsWith("//") ||
      (!record.image.startsWith("/") && !record.image.startsWith("https://"))
    ) {
      errors.push(
        `${where}: "image" must be a site-absolute path ("/images/…") or an https URL, ` +
          `got ${JSON.stringify(record.image)}`
      );
    }
  }
}

/* A list of one is not a list, and past six the block stops being a
   summary. Both bounds are what the KeyTakeaways component is designed for. */
export const KEY_TAKEAWAYS_MIN = 2;
export const KEY_TAKEAWAYS_MAX = 6;

function validateKeyTakeaways(record, where, errors) {
  if (record.keyTakeaways === undefined) return;
  const items = record.keyTakeaways;
  if (!Array.isArray(items)) {
    errors.push(`${where}: "keyTakeaways" must be an array when present`);
    return;
  }
  if (items.length < KEY_TAKEAWAYS_MIN || items.length > KEY_TAKEAWAYS_MAX) {
    errors.push(
      `${where}: "keyTakeaways" must have ${KEY_TAKEAWAYS_MIN} to ${KEY_TAKEAWAYS_MAX} items, got ${items.length}`
    );
  }
  items.forEach((item, i) => {
    if (typeof item !== "string" || item.trim() === "") {
      errors.push(`${where}: keyTakeaways[${i}] must be a non-empty string`);
    }
  });
}

/* ISO 8601 duration, the form schema.org's `totalTime` requires: PT30M, P2D,
   P1W, P1DT2H. The lookaheads reject the empty "P" and a dangling "T". */
const ISO_DURATION_RE = /^P(?!$)(\d+Y)?(\d+M)?(\d+W)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?$/;

/**
 * Optional `howTo` block: a procedure already written into the post body.
 *
 * Only the shape is checked here. Whether each step name really is a heading
 * on the rendered page is checked against build output by
 * scripts/check-schema-mirror.mjs, because only the built HTML can answer it.
 */
function validateHowTo(record, where, errors) {
  if (record.howTo === undefined) return;
  const howTo = record.howTo;
  if (!howTo || typeof howTo !== "object" || Array.isArray(howTo)) {
    errors.push(`${where}: "howTo" must be an object when present`);
    return;
  }
  reqString(howTo, "name", `${where} howTo`, errors);
  if (howTo.description !== undefined && (typeof howTo.description !== "string" || howTo.description.trim() === "")) {
    errors.push(`${where} howTo: "description" must be a non-empty string when present`);
  }
  if (howTo.totalTime !== undefined && (typeof howTo.totalTime !== "string" || !ISO_DURATION_RE.test(howTo.totalTime))) {
    errors.push(
      `${where} howTo: "totalTime" must be an ISO 8601 duration such as "PT30M", got ${JSON.stringify(howTo.totalTime)}`
    );
  }
  if (!Array.isArray(howTo.steps) || howTo.steps.length < 2) {
    errors.push(`${where} howTo: "steps" must be an array of at least 2 steps; a one-step procedure is not a HowTo`);
    return;
  }
  const seen = new Set();
  howTo.steps.forEach((step, i) => {
    if (!step || typeof step !== "object") {
      errors.push(`${where} howTo.steps[${i}] must be an object`);
      return;
    }
    reqString(step, "name", `${where} howTo.steps[${i}]`, errors);
    reqString(step, "text", `${where} howTo.steps[${i}]`, errors);
    /* Two steps whose names reduce to one anchor would share one heading
       link ("Step 1: Define" and "Step 1 - Define" both become
       step-1-define), so compare anchors, not raw names. */
    if (typeof step.name === "string") {
      const anchor = headingId(step.name);
      if (seen.has(anchor)) {
        errors.push(`${where} howTo.steps[${i}]: duplicate step name ${JSON.stringify(step.name)} (anchor #${anchor})`);
      }
      seen.add(anchor);
    }
  });
}

/**
 * Front matter that restates the body must still match the body.
 *
 * A post's FAQ and HowTo live twice: as headings and prose in the Markdown
 * body, and in front matter for the JSON-LD. The studio edits the body but has
 * no fields for either copy, so without this rule a body edit would commit
 * cleanly and then fail the deploy in check:schema-mirror, where an editor
 * cannot fix it. Checking the source here puts the error in the editor's
 * pre-save list and in check:content instead. The build-output check stays as
 * the backstop for what this text-level match cannot see.
 */
function validateBodyMirror(record, where, errors) {
  if (typeof record.body !== "string") return;
  const needsText = Array.isArray(record.faq) || (record.howTo && Array.isArray(record.howTo.steps));
  if (!needsText) return;

  const text = normalize(markdownText(record.body));
  const headings = new Set(markdownHeadings(record.body));
  const inBody = (s) => typeof s === "string" && containsPhrase(text, normalize(s));

  if (Array.isArray(record.faq)) {
    record.faq.forEach((item, i) => {
      if (!item || typeof item !== "object") return;
      if (typeof item.question === "string" && !inBody(item.question)) {
        errors.push(`${where}: faq[${i}] question is not in the body. Edit both copies together: ${JSON.stringify(item.question)}`);
      }
      if (typeof item.answer === "string" && !inBody(item.answer)) {
        errors.push(`${where}: faq[${i}] answer does not match the body. Edit both copies together.`);
      }
    });
  }

  if (record.howTo && Array.isArray(record.howTo.steps)) {
    record.howTo.steps.forEach((step, i) => {
      if (!step || typeof step !== "object") return;
      if (typeof step.name === "string" && !headings.has(normalize(step.name))) {
        errors.push(
          `${where}: howTo.steps[${i}] name must be the exact text of a heading in the body, ` +
            `got ${JSON.stringify(step.name)}`
        );
      }
      if (typeof step.text === "string" && !inBody(step.text)) {
        errors.push(`${where}: howTo.steps[${i}] text does not appear in the body.`);
      }
    });
  }
}

/* ------------------------------------------------------------------ *
 * Per-collection field validation
 * ------------------------------------------------------------------ */

/**
 * @param {object} record parsed front matter plus `body`
 * @param {string} slug   derived from the filename, not the front matter
 */
export function validateBlogPost(record, slug) {
  const errors = [];
  const where = `blog/${slug}`;
  validSlug(slug, where, errors);
  reqString(record, "title", where, errors);
  reqString(record, "description", where, errors);
  validDate(record.dateModified, "dateModified", where, errors);
  reqString(record, "body", where, errors);
  validateBylineFields(record, where, errors);
  validateKeyTakeaways(record, where, errors);
  validateHowTo(record, where, errors);
  validateBodyMirror(record, where, errors);

  if (record.faq !== undefined) {
    if (!Array.isArray(record.faq)) {
      errors.push(`${where}: "faq" must be an array when present`);
    } else {
      record.faq.forEach((item, i) => {
        if (!item || typeof item !== "object") {
          errors.push(`${where}: faq[${i}] must be an object`);
          return;
        }
        reqString(item, "question", `${where} faq[${i}]`, errors);
        reqString(item, "answer", `${where} faq[${i}]`, errors);
      });
    }
  }

  if (record.featured !== undefined && typeof record.featured !== "boolean") {
    errors.push(`${where}: "featured" must be a boolean when present`);
  }
  if (record.summary !== undefined && typeof record.summary !== "string") {
    errors.push(`${where}: "summary" must be a string when present`);
  }
  if (record.draft !== undefined && typeof record.draft !== "boolean") {
    errors.push(`${where}: "draft" must be a boolean when present`);
  }
  /* Set by Publish and never cleared — the only durable answer to "was this
     ever live?", which Delete needs (see ledger-ops.mjs). Stripped from every
     public record by loadContent. */
  if (record.publishedOnce !== undefined && typeof record.publishedOnce !== "boolean") {
    errors.push(`${where}: "publishedOnce" must be a boolean when present`);
  }
  return errors;
}

export function validateCaseStudy(record, slug) {
  const errors = [];
  const where = `case-studies/${slug}`;
  validSlug(slug, where, errors);
  for (const f of ["title", "client", "industry", "outcome", "challenge", "whatWeDid", "legacyUrl"]) {
    reqString(record, f, where, errors);
  }
  reqStringArray(record, "results", where, errors);
  reqStringArray(record, "stack", where, errors);

  if (!PILLARS.includes(record.pillar)) {
    errors.push(
      `${where}: "pillar" must be one of ${PILLARS.map((p) => `"${p}"`).join(", ")}, got ${JSON.stringify(record.pillar)}`
    );
  }
  /* Optional per-study date; falls back to UPDATED.caseStudies when absent. */
  if (record.dateModified !== undefined) {
    validDate(record.dateModified, "dateModified", where, errors);
  }
  validateBylineFields(record, where, errors, CASE_STUDIES_DEFAULT_MODIFIED);
  if (record.draft !== undefined && typeof record.draft !== "boolean") {
    errors.push(`${where}: "draft" must be a boolean when present`);
  }
  /* Set by Publish and never cleared — the only durable answer to "was this
     ever live?", which Delete needs (see ledger-ops.mjs). Stripped from every
     public record by loadContent. */
  if (record.publishedOnce !== undefined && typeof record.publishedOnce !== "boolean") {
    errors.push(`${where}: "publishedOnce" must be a boolean when present`);
  }
  return errors;
}

export function validateWhitePaper(record, slug) {
  const errors = [];
  const where = `white-papers/${slug}`;
  validSlug(slug, where, errors);
  reqString(record, "title", where, errors);
  reqString(record, "description", where, errors);

  /* This is the rule src/lib/whitePapers.ts:24-33 throws on today. It is
     stricter than "looks like a pdf path": the filename must equal the slug,
     so a renamed slug cannot silently keep serving the old PDF. */
  const expected = `/whitepapers/${slug}.pdf`;
  if (record.file !== expected) {
    errors.push(`${where}: "file" must be exactly "${expected}", got ${JSON.stringify(record.file)}`);
  }
  if (record.hubspotValue !== undefined && (typeof record.hubspotValue !== "string" || !record.hubspotValue.trim())) {
    errors.push(`${where}: "hubspotValue" must be a non-empty string when present`);
  }
  if (record.draft !== undefined && typeof record.draft !== "boolean") {
    errors.push(`${where}: "draft" must be a boolean when present`);
  }
  /* Set by Publish and never cleared — the only durable answer to "was this
     ever live?", which Delete needs (see ledger-ops.mjs). Stripped from every
     public record by loadContent. */
  if (record.publishedOnce !== undefined && typeof record.publishedOnce !== "boolean") {
    errors.push(`${where}: "publishedOnce" must be a boolean when present`);
  }
  return errors;
}

export const VALIDATORS = {
  blog: validateBlogPost,
  caseStudies: validateCaseStudy,
  whitePapers: validateWhitePaper,
};

/* ------------------------------------------------------------------ *
 * Ledger rules L1-L4  (source plan section 6.6)
 * ------------------------------------------------------------------ */

/**
 * All four rules read what is ON DISK, drafts included — never the
 * draft-filtered BLOG_POSTS/CASE_STUDIES/WHITE_PAPERS arrays. That single
 * sourcing choice is what makes Unpublish safe: the file is still there, so
 * the ledger still resolves. Getting this wrong was review blocker B1, where
 * three of the admin's four buttons failed the build.
 *
 * The invariant is a SUBSET, not an equality.
 *
 * @param {object} args
 * @param {object} args.ledger  parsed SLUGS.lock.json
 * @param {object} args.onDisk  {blog|caseStudies|whitePapers: [{slug, draft}]}
 * @param {object} args.redirectDestinations {blog: string[], caseStudies: string[]}
 * @param {string[]} [args.livePaths] paths a retired redirectTo may point at
 * @returns {string[]} errors
 */
export function checkLedger({ ledger, onDisk, redirectDestinations, livePaths }) {
  const errors = [];

  if (!ledger || typeof ledger !== "object") return ["ledger: SLUGS.lock.json is missing or not an object"];
  if (ledger.version !== 1) errors.push(`ledger: "version" must be 1, got ${JSON.stringify(ledger.version)}`);

  const retired = Array.isArray(ledger.retired) ? ledger.retired : [];
  const retiredSlugs = new Set(retired.map((r) => r && r.slug));

  const diskBy = {};
  for (const c of COLLECTIONS) {
    diskBy[c] = new Map((onDisk[c] || []).map((r) => [r.slug, r]));
  }

  /* L1 — nothing vanishes. Every slug in a live list resolves to a file on
     disk, unless it has been formally retired. */
  for (const c of COLLECTIONS) {
    const live = Array.isArray(ledger[c]) ? ledger[c] : [];
    for (const slug of live) {
      if (!diskBy[c].has(slug) && !retiredSlugs.has(slug)) {
        errors.push(
          `L1 ${c}/${slug}: registered in SLUGS.lock.json but no content file on disk. ` +
            `If this was intentionally removed, add it to "retired[]" with a redirectTo and a 301.`
        );
      }
    }
  }

  /* L2 — retirement is complete. */
  for (const [i, entry] of retired.entries()) {
    if (!entry || typeof entry !== "object") {
      errors.push(`L2 retired[${i}]: must be an object`);
      continue;
    }
    const { slug, collection, redirectTo } = entry;
    const label = `L2 retired[${i}] (${slug})`;
    if (!COLLECTIONS.includes(collection)) {
      errors.push(`${label}: "collection" must be one of ${COLLECTIONS.join(", ")}`);
      continue;
    }
    if (diskBy[collection].has(slug)) {
      errors.push(`${label}: retired but a content file still exists on disk — remove the file or un-retire the slug`);
    }
    if (Array.isArray(ledger[collection]) && ledger[collection].includes(slug)) {
      errors.push(`${label}: a slug cannot be in both the live "${collection}" list and "retired[]"`);
    }
    if (typeof redirectTo !== "string" || !redirectTo.startsWith("/")) {
      errors.push(`${label}: "redirectTo" must be a site-absolute path starting with "/"`);
    } else if (Array.isArray(livePaths) && livePaths.length && !livePaths.includes(redirectTo)) {
      errors.push(`${label}: "redirectTo" (${redirectTo}) does not resolve to a live path`);
    }
    if (entry.retiredOn !== undefined) validDate(entry.retiredOn, "retiredOn", label, errors);
  }

  /* L3 — nothing is unregistered. Catches a hand-added file. The admin
     satisfies this automatically because the ledger update travels in the
     same atomic commit. */
  for (const c of COLLECTIONS) {
    const live = new Set(Array.isArray(ledger[c]) ? ledger[c] : []);
    for (const slug of diskBy[c].keys()) {
      if (!live.has(slug)) {
        errors.push(
          `L3 ${c}/${slug}: content file exists but is not registered. ` +
            `Add "${slug}" to the "${c}" array in content/SLUGS.lock.json.`
        );
      }
    }
  }

  /* L4 — live 301s still land on something published. The rule with teeth:
     unpublishing one of these 18 items turns a live 301 into a 301-to-404. */
  const redirectMap = {
    blog: (redirectDestinations && redirectDestinations.blog) || [],
    caseStudies: (redirectDestinations && redirectDestinations.caseStudies) || [],
  };
  for (const [c, dests] of Object.entries(redirectMap)) {
    for (const slug of dests) {
      const rec = diskBy[c].get(slug);
      if (!rec) {
        errors.push(
          `L4 ${c}/${slug}: a live 301 in next.config.ts points here but no content file exists — that redirect now 301s to a 404`
        );
      } else if (rec.draft === true) {
        errors.push(
          `L4 ${c}/${slug}: a live 301 in next.config.ts points here but the item is draft:true — ` +
            `that redirect now 301s to a 404. Republish it, or a developer must remove the redirect.`
        );
      }
    }
  }

  return errors;
}

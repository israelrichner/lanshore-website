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

export const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Mirrors the `pillar` union in src/lib/caseStudies.ts. */
export const PILLARS = [
  "Executive Dashboards",
  "SPM Operations",
  "Custom Apps",
  "Services",
];

export const COLLECTIONS = ["blog", "caseStudies", "whitePapers"];

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
  if (record.draft !== undefined && typeof record.draft !== "boolean") {
    errors.push(`${where}: "draft" must be a boolean when present`);
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

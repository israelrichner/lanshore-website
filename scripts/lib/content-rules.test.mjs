/**
 * Tests for the content validation core.
 *
 * Uses `node --test`, built into Node 22 — no test framework is added to the
 * repo. Every rule is exercised in BOTH directions: a valid record must pass
 * clean, and a specific violation must produce a specific error. A test that
 * only ever asserts "valid input is valid" cannot fail for the right reason.
 *
 * Run: node --test scripts/lib/content-rules.test.mjs
 */

import test from "node:test";
import assert from "node:assert/strict";
import {
  validateBlogPost,
  validateCaseStudy,
  validateWhitePaper,
  checkLedger,
  PILLARS,
} from "./content-rules.mjs";

/* ------------------------------------------------------------------ *
 * Fixtures — minimal valid records, cloned and broken per test
 * ------------------------------------------------------------------ */

const okBlog = () => ({
  title: "A Post",
  description: "About things.",
  dateModified: "2026-07-11",
  body: "## Heading\n\nSome prose.",
});

const okCaseStudy = () => ({
  title: "A Study",
  client: "Acme",
  industry: "Technology",
  pillar: "SPM Operations",
  outcome: "It worked.",
  challenge: "It was hard.",
  whatWeDid: "We did it.",
  results: ["40% faster"],
  stack: ["Varicent"],
  legacyUrl: "/case_studies/old-url",
});

const okWhitePaper = (slug = "death-of-commissions") => ({
  title: "A Paper",
  description: "About things.",
  file: `/whitepapers/${slug}.pdf`,
  hubspotValue: slug,
});

const has = (errors, needle) => errors.some((e) => e.includes(needle));

/* ------------------------------------------------------------------ *
 * Blog
 * ------------------------------------------------------------------ */

test("blog: a valid post produces no errors", () => {
  assert.deepEqual(validateBlogPost(okBlog(), "a-post"), []);
});

test("blog: rejects a bad slug", () => {
  assert.ok(has(validateBlogPost(okBlog(), "Not A Slug"), "slug must match"));
  assert.ok(has(validateBlogPost(okBlog(), "-leading-hyphen"), "slug must match"));
});

test("blog: requires title, description, body", () => {
  for (const field of ["title", "description", "body"]) {
    const rec = okBlog();
    delete rec[field];
    assert.ok(has(validateBlogPost(rec, "a-post"), `"${field}" must be a non-empty string`));
  }
});

test("blog: an empty-string field is not a present field", () => {
  const rec = okBlog();
  rec.title = "   ";
  assert.ok(has(validateBlogPost(rec, "a-post"), '"title" must be a non-empty string'));
});

test("blog: dateModified must be YYYY-MM-DD", () => {
  const rec = okBlog();
  rec.dateModified = "11-07-2026";
  assert.ok(has(validateBlogPost(rec, "a-post"), "must be YYYY-MM-DD"));
});

test("blog: dateModified must be a REAL date, not just the right shape", () => {
  const rec = okBlog();
  rec.dateModified = "2026-02-30";
  /* Shape-only validation would accept this and Date() would roll it to
     March 2nd, silently changing a sitemap lastmod. */
  assert.ok(has(validateBlogPost(rec, "a-post"), "is not a real date"));
});

test("blog: faq is optional but must be well-formed when present", () => {
  const ok = okBlog();
  ok.faq = [{ question: "Q?", answer: "A." }];
  assert.deepEqual(validateBlogPost(ok, "a-post"), []);

  const bad = okBlog();
  bad.faq = [{ question: "Q?" }];
  assert.ok(has(validateBlogPost(bad, "a-post"), '"answer" must be a non-empty string'));

  const notArray = okBlog();
  notArray.faq = { question: "Q?" };
  assert.ok(has(validateBlogPost(notArray, "a-post"), '"faq" must be an array'));
});

test("blog: featured/summary/draft are typed when present", () => {
  const rec = okBlog();
  rec.featured = "yes";
  assert.ok(has(validateBlogPost(rec, "a-post"), '"featured" must be a boolean'));

  const rec2 = okBlog();
  rec2.draft = "true";
  assert.ok(has(validateBlogPost(rec2, "a-post"), '"draft" must be a boolean'));
});

/* ------------------------------------------------------------------ *
 * Case studies
 * ------------------------------------------------------------------ */

test("case study: a valid study produces no errors", () => {
  assert.deepEqual(validateCaseStudy(okCaseStudy(), "a-study"), []);
});

test("case study: every pillar in the enum is accepted", () => {
  for (const pillar of PILLARS) {
    const rec = okCaseStudy();
    rec.pillar = pillar;
    assert.deepEqual(validateCaseStudy(rec, "a-study"), [], `pillar ${pillar} should be valid`);
  }
});

test("case study: rejects a pillar outside the enum", () => {
  const rec = okCaseStudy();
  rec.pillar = "Executive Dashboard"; // singular — a plausible typo
  assert.ok(has(validateCaseStudy(rec, "a-study"), '"pillar" must be one of'));
});

test("case study: results and stack must be non-empty arrays", () => {
  const empty = okCaseStudy();
  empty.results = [];
  assert.ok(has(validateCaseStudy(empty, "a-study"), '"results" must be a non-empty array'));

  const blank = okCaseStudy();
  blank.stack = ["Varicent", ""];
  assert.ok(has(validateCaseStudy(blank, "a-study"), '"stack[1]" must be a non-empty string'));
});

test("case study: dateModified is optional, but validated when present", () => {
  const absent = okCaseStudy();
  assert.deepEqual(validateCaseStudy(absent, "a-study"), []);

  const bad = okCaseStudy();
  bad.dateModified = "not-a-date";
  assert.ok(has(validateCaseStudy(bad, "a-study"), "must be YYYY-MM-DD"));
});

/* ------------------------------------------------------------------ *
 * White papers
 * ------------------------------------------------------------------ */

test("white paper: a valid paper produces no errors", () => {
  assert.deepEqual(validateWhitePaper(okWhitePaper(), "death-of-commissions"), []);
});

test("white paper: file must equal /whitepapers/<slug>.pdf", () => {
  /* This mirrors what src/lib/whitePapers.ts throws on today. A mismatch
     means a renamed slug would keep serving the old PDF. */
  const rec = okWhitePaper();
  rec.file = "/whitepapers/some-other-name.pdf";
  assert.ok(has(validateWhitePaper(rec, "death-of-commissions"), '"file" must be exactly'));
});

test("white paper: rejects an off-origin or traversing file path", () => {
  for (const file of [
    "https://evil.example/x.pdf",
    "//evil.example/x.pdf",
    "/whitepapers/../../etc/passwd",
    "/uploads/death-of-commissions.pdf",
  ]) {
    const rec = okWhitePaper();
    rec.file = file;
    assert.ok(
      has(validateWhitePaper(rec, "death-of-commissions"), '"file" must be exactly'),
      `${file} should be rejected`
    );
  }
});

test("white paper: hubspotValue is optional but must be non-empty when present", () => {
  const rec = okWhitePaper();
  delete rec.hubspotValue;
  assert.deepEqual(validateWhitePaper(rec, "death-of-commissions"), []);

  rec.hubspotValue = "  ";
  assert.ok(has(validateWhitePaper(rec, "death-of-commissions"), '"hubspotValue" must be a non-empty string'));
});

/* ------------------------------------------------------------------ *
 * Ledger L1-L4
 * ------------------------------------------------------------------ */

const baseLedger = () => ({
  version: 1,
  blog: ["post-a"],
  caseStudies: ["study-a"],
  whitePapers: ["paper-a"],
  retired: [],
});

const baseDisk = () => ({
  blog: [{ slug: "post-a", draft: false }],
  caseStudies: [{ slug: "study-a", draft: false }],
  whitePapers: [{ slug: "paper-a", draft: false }],
});

const baseRedirects = () => ({ blog: ["post-a"], caseStudies: ["study-a"] });

const runLedger = (over = {}) =>
  checkLedger({
    ledger: baseLedger(),
    onDisk: baseDisk(),
    redirectDestinations: baseRedirects(),
    ...over,
  });

test("ledger: a consistent ledger produces no errors", () => {
  assert.deepEqual(runLedger(), []);
});

test("ledger: version must be 1", () => {
  const ledger = baseLedger();
  ledger.version = 2;
  assert.ok(has(runLedger({ ledger }), '"version" must be 1'));
});

test("L1: a registered slug with no file on disk fails", () => {
  const onDisk = baseDisk();
  onDisk.blog = [];
  assert.ok(has(runLedger({ onDisk, redirectDestinations: { blog: [], caseStudies: ["study-a"] } }), "L1 blog/post-a"));
});

test("L1: a registered slug missing from disk is OK once retired", () => {
  const ledger = baseLedger();
  ledger.blog = [];
  ledger.retired = [
    { slug: "post-a", collection: "blog", retiredOn: "2026-09-01", redirectTo: "/blog" },
  ];
  const onDisk = baseDisk();
  onDisk.blog = [];
  const errors = checkLedger({
    ledger,
    onDisk,
    redirectDestinations: { blog: [], caseStudies: ["study-a"] },
    livePaths: ["/blog"],
  });
  assert.deepEqual(errors, []);
});

test("L2: a retired slug whose file still exists fails", () => {
  const ledger = baseLedger();
  ledger.blog = [];
  ledger.retired = [{ slug: "post-a", collection: "blog", redirectTo: "/blog" }];
  assert.ok(
    has(runLedger({ ledger, redirectDestinations: { blog: [], caseStudies: ["study-a"] } }), "still exists on disk")
  );
});

test("L2: a slug cannot be both live and retired", () => {
  const ledger = baseLedger();
  ledger.retired = [{ slug: "post-a", collection: "blog", redirectTo: "/blog" }];
  assert.ok(has(runLedger({ ledger }), "cannot be in both"));
});

test("L2: redirectTo must be a site-absolute path", () => {
  const ledger = baseLedger();
  ledger.blog = [];
  ledger.retired = [{ slug: "post-a", collection: "blog", redirectTo: "https://example.com" }];
  const onDisk = baseDisk();
  onDisk.blog = [];
  assert.ok(
    has(
      checkLedger({ ledger, onDisk, redirectDestinations: { blog: [], caseStudies: ["study-a"] } }),
      '"redirectTo" must be a site-absolute path'
    )
  );
});

test("L2: redirectTo must resolve to a live path when livePaths is supplied", () => {
  const ledger = baseLedger();
  ledger.blog = [];
  ledger.retired = [{ slug: "post-a", collection: "blog", redirectTo: "/nowhere" }];
  const onDisk = baseDisk();
  onDisk.blog = [];
  assert.ok(
    has(
      checkLedger({
        ledger,
        onDisk,
        redirectDestinations: { blog: [], caseStudies: ["study-a"] },
        livePaths: ["/blog"],
      }),
      "does not resolve to a live path"
    )
  );
});

test("L3: a file on disk that is not registered fails", () => {
  const onDisk = baseDisk();
  onDisk.blog.push({ slug: "hand-added", draft: false });
  assert.ok(has(runLedger({ onDisk }), "L3 blog/hand-added"));
});

test("L4: unpublishing a 301 destination fails the build", () => {
  /* This is the rule with teeth. Marking post-a draft:true while a live 301
     still points at it turns that redirect into a 301-to-404. */
  const onDisk = baseDisk();
  onDisk.blog = [{ slug: "post-a", draft: true }];
  const errors = runLedger({ onDisk });
  assert.ok(has(errors, "L4 blog/post-a"));
  assert.ok(has(errors, "draft:true"));
});

test("L4: deleting a 301 destination fails the build", () => {
  const ledger = baseLedger();
  ledger.caseStudies = [];
  const onDisk = baseDisk();
  onDisk.caseStudies = [];
  assert.ok(has(checkLedger({ ledger, onDisk, redirectDestinations: baseRedirects() }), "L4 caseStudies/study-a"));
});

test("L4: a draft item that is NOT a redirect destination is allowed", () => {
  /* Unpublishing something with no legacy URL is a normal, safe action —
     the gate must not block it, or Unpublish becomes useless. */
  const ledger = baseLedger();
  ledger.blog = ["post-a", "post-b"];
  const onDisk = baseDisk();
  onDisk.blog.push({ slug: "post-b", draft: true });
  assert.deepEqual(checkLedger({ ledger, onDisk, redirectDestinations: baseRedirects() }), []);
});

test("ledger: the invariant is a subset, not an equality", () => {
  /* Save-draft registers a new slug in the same commit; the file exists but
     is draft. Under v2's equality rule this failed the build (blocker B1). */
  const ledger = baseLedger();
  ledger.blog = ["post-a", "brand-new-draft"];
  const onDisk = baseDisk();
  onDisk.blog.push({ slug: "brand-new-draft", draft: true });
  assert.deepEqual(checkLedger({ ledger, onDisk, redirectDestinations: baseRedirects() }), []);
});

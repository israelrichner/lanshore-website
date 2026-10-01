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
  AUTHOR_IDS,
  CASE_STUDIES_DEFAULT_MODIFIED,
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
  ok.body += "\n\n### Q?\n\nA.";
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

/* ------------------------------------------------------------------ *
 * Byline fields: author, datePublished, image
 *
 * Shared by blog posts and case studies, so every rule is exercised against
 * both collections. The rule that matters most is the datePublished ordering
 * check: an invented publish date is the specific failure this whole field
 * exists to prevent.
 * ------------------------------------------------------------------ */

test("author: a known id is accepted on both collections", () => {
  const post = okBlog();
  post.author = AUTHOR_IDS[0];
  assert.deepEqual(validateBlogPost(post, "a-post"), []);

  const study = okCaseStudy();
  study.author = AUTHOR_IDS[0];
  assert.deepEqual(validateCaseStudy(study, "a-study"), []);
});

test("author: an unknown id is rejected", () => {
  const post = okBlog();
  post.author = "not-a-real-person";
  assert.ok(has(validateBlogPost(post, "a-post"), '"author" must be one of'));

  const study = okCaseStudy();
  study.author = "not-a-real-person";
  assert.ok(has(validateCaseStudy(study, "a-study"), '"author" must be one of'));
});

test("author: a non-string is rejected", () => {
  const post = okBlog();
  post.author = { name: "Doug" };
  assert.ok(has(validateBlogPost(post, "a-post"), '"author" must be one of'));
});

test("author: absent is valid, the org byline is the default", () => {
  assert.deepEqual(validateBlogPost(okBlog(), "a-post"), []);
});

test("datePublished: a real date at or before dateModified is accepted", () => {
  const earlier = okBlog();
  earlier.datePublished = "2026-03-02";
  assert.deepEqual(validateBlogPost(earlier, "a-post"), []);

  const same = okBlog();
  same.datePublished = same.dateModified;
  assert.deepEqual(validateBlogPost(same, "a-post"), []);
});

test("datePublished: a date AFTER dateModified is rejected", () => {
  const post = okBlog();
  post.dateModified = "2026-07-11";
  post.datePublished = "2026-09-01";
  assert.ok(has(validateBlogPost(post, "a-post"), "is after"));
});

test("datePublished: a shape-valid but impossible date is rejected", () => {
  const post = okBlog();
  post.datePublished = "2026-02-30";
  assert.ok(has(validateBlogPost(post, "a-post"), "is not a real date"));
});

test("datePublished: a malformed date is rejected", () => {
  const post = okBlog();
  post.datePublished = "March 2026";
  assert.ok(has(validateBlogPost(post, "a-post"), "must be YYYY-MM-DD"));
});

test("datePublished: a case study with no dateModified is checked against the fallback it displays", () => {
  const study = okCaseStudy();
  assert.equal(study.dateModified, undefined);
  study.datePublished = "2026-03-02";
  assert.deepEqual(validateCaseStudy(study, "a-study"), []);

  /* Would render "Published Sep 15 · Last updated Jul 8". */
  study.datePublished = "2026-09-15";
  assert.ok("2026-09-15" > CASE_STUDIES_DEFAULT_MODIFIED);
  assert.ok(has(validateCaseStudy(study, "a-study"), "is after"));
});

test("image: a site-absolute path or an https url is accepted", () => {
  for (const value of ["/images/x.png", "https://cdn.example.com/x.png"]) {
    const post = okBlog();
    post.image = value;
    assert.deepEqual(validateBlogPost(post, "a-post"), [], `expected ${value} to be valid`);
  }
});

test("image: a bare or protocol-relative path is rejected", () => {
  for (const value of ["images/x.png", "//cdn.example.com/x.png", "http://insecure.example/x.png"]) {
    const post = okBlog();
    post.image = value;
    assert.ok(
      has(validateBlogPost(post, "a-post"), '"image" must be a site-absolute path'),
      `expected ${value} to be rejected`
    );
  }
});

test("image: an empty string is rejected rather than treated as absent", () => {
  const post = okBlog();
  post.image = "   ";
  assert.ok(has(validateBlogPost(post, "a-post"), '"image" must be a non-empty string'));
});

/* ------------------------------------------------------------------ *
 * keyTakeaways and howTo
 * ------------------------------------------------------------------ */

/* A body that really contains the okHowTo() steps, as the mirror rule requires. */
const HOWTO_BODY = "## How\n\n### Step 1: Define TAM\n\nDefine it.\n\n### Step 2: Map coverage\n\nMap it.";

const howToPost = () => ({ ...okBlog(), body: HOWTO_BODY, howTo: okHowTo() });

const okHowTo = () => ({
  name: "How to identify white space",
  description: "A five-step framework.",
  steps: [
    { name: "Step 1: Define TAM", text: "Define it." },
    { name: "Step 2: Map coverage", text: "Map it." },
  ],
});

test("keyTakeaways: 2 to 6 non-empty strings are accepted; absent is valid", () => {
  const post = okBlog();
  post.keyTakeaways = ["One.", "Two."];
  assert.deepEqual(validateBlogPost(post, "a-post"), []);
  post.keyTakeaways = ["1", "2", "3", "4", "5", "6"];
  assert.deepEqual(validateBlogPost(post, "a-post"), []);
  assert.deepEqual(validateBlogPost(okBlog(), "a-post"), []);
});

test("keyTakeaways: one item or seven items is rejected", () => {
  for (const items of [["Only one."], ["1", "2", "3", "4", "5", "6", "7"]]) {
    const post = okBlog();
    post.keyTakeaways = items;
    assert.ok(has(validateBlogPost(post, "a-post"), "must have 2 to 6 items"), `length ${items.length}`);
  }
});

test("keyTakeaways: a blank item or a non-array is rejected", () => {
  const post = okBlog();
  post.keyTakeaways = ["Fine.", "  "];
  assert.ok(has(validateBlogPost(post, "a-post"), "keyTakeaways[1] must be a non-empty string"));
  post.keyTakeaways = "One string";
  assert.ok(has(validateBlogPost(post, "a-post"), '"keyTakeaways" must be an array'));
});

test("howTo: a well-formed procedure is accepted, with or without totalTime", () => {
  const post = howToPost();
  assert.deepEqual(validateBlogPost(post, "a-post"), []);
  for (const totalTime of ["P1DT2H", "PT30M", "P1W", "P1Y2M"]) {
    post.howTo.totalTime = totalTime;
    assert.deepEqual(validateBlogPost(post, "a-post"), [], totalTime);
  }
});

test("howTo: fewer than two steps, or no steps, is rejected", () => {
  for (const steps of [[], [{ name: "Only", text: "One." }], undefined]) {
    const post = okBlog();
    post.howTo = { ...okHowTo(), steps };
    assert.ok(has(validateBlogPost(post, "a-post"), "at least 2 steps"));
  }
});

test("howTo: a step missing text, or two steps sharing a name, is rejected", () => {
  const post = okBlog();
  post.howTo = okHowTo();
  post.howTo.steps[1] = { name: "Step 2: Map coverage" };
  assert.ok(has(validateBlogPost(post, "a-post"), 'howTo.steps[1]: "text"'));

  post.howTo = okHowTo();
  post.howTo.steps[1].name = post.howTo.steps[0].name;
  assert.ok(has(validateBlogPost(post, "a-post"), "duplicate step name"));

  /* Different text, same anchor. */
  post.howTo = okHowTo();
  post.howTo.steps[0].name = "Step 1: Define";
  post.howTo.steps[1].name = "Step 1 - Define";
  assert.ok(has(validateBlogPost(post, "a-post"), "duplicate step name"));
});

test("howTo: a non-ISO totalTime is rejected, including the empty forms", () => {
  for (const totalTime of ["2 hours", "P", "PT", "P1DT"]) {
    const post = okBlog();
    post.howTo = { ...okHowTo(), totalTime };
    assert.ok(has(validateBlogPost(post, "a-post"), "ISO 8601 duration"), totalTime);
  }
});

test("howTo: a non-object or a missing name is rejected", () => {
  const post = okBlog();
  post.howTo = ["step"];
  assert.ok(has(validateBlogPost(post, "a-post"), '"howTo" must be an object'));
  post.howTo = { ...okHowTo(), name: "" };
  assert.ok(has(validateBlogPost(post, "a-post"), 'howTo: "name"'));
});

/* ------------------------------------------------------------------ *
 * Body mirror: front matter that restates the body must match it.
 * These are the edits a studio user can make to the body alone.
 * ------------------------------------------------------------------ */

test("mirror: an FAQ whose question and answer are in the body passes, through Markdown formatting", () => {
  const post = okBlog();
  post.body = "## FAQ\n\n### Can it be **automated**?\n\nYes — to a [significant](https://x.example) degree.";
  post.faq = [{ question: "Can it be automated?", answer: "Yes — to a significant degree." }];
  assert.deepEqual(validateBlogPost(post, "a-post"), []);
});

test("mirror: rewording the body answer without the front matter copy is rejected", () => {
  const post = okBlog();
  post.body = "### How often?\n\nAt least quarterly.";
  post.faq = [{ question: "How often?", answer: "At least annually." }];
  const errors = validateBlogPost(post, "a-post");
  assert.ok(has(errors, "faq[0] answer does not match the body"));
  assert.equal(has(errors, "faq[0] question"), false);
});

test("mirror: a one-word answer is not satisfied by a longer word that contains it", () => {
  const post = okBlog();
  post.body = "### Is it done?\n\nYesterday it was.";
  post.faq = [{ question: "Is it done?", answer: "Yes" }];
  assert.ok(has(validateBlogPost(post, "a-post"), "faq[0] answer does not match the body"));
});

test("mirror: renaming a step heading in the body is rejected", () => {
  const post = howToPost();
  post.body = post.body.replace("### Step 2: Map coverage", "### Step 2: Map your coverage");
  assert.ok(has(validateBlogPost(post, "a-post"), "howTo.steps[1] name must be the exact text of a heading"));
});

test("mirror: a step name that is in the prose but not a heading is rejected", () => {
  const post = howToPost();
  post.body = post.body.replace("### Step 1: Define TAM", "Step 1: Define TAM");
  assert.ok(has(validateBlogPost(post, "a-post"), "howTo.steps[0] name must be the exact text of a heading"));
});

test("mirror: step text missing from the body is rejected", () => {
  const post = howToPost();
  post.howTo.steps[0].text = "Something the body never says.";
  assert.ok(has(validateBlogPost(post, "a-post"), "howTo.steps[0] text does not appear in the body"));
});

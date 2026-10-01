/**
 * Tests for the schema mirror rules, against synthetic built pages.
 *
 * Each negative case is a page whose structured data says something its body
 * does not: the exact defect the postbuild gate exists to fail on.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import { checkPage, visibleText, headingTexts, normalize, nodesOfType } from "./schema-mirror.mjs";

const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;

const faqLd = (pairs) =>
  ld({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  });

const howToLd = (steps) =>
  ld({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to",
    step: steps.map(([name, text, id], i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name,
      text,
      url: `https://lanshore.com/blog/x#${id}`,
    })),
  });

const page = (head, body) => `<html><head>${head}</head><body>${body}</body></html>`;

const has = (errors, code) => errors.some((e) => e.startsWith(code));

/* ---------------- FAQPage ---------------- */

test("faq: a question and answer rendered as body h3 + p passes", () => {
  const html = page(
    faqLd([["Can it be automated?", "Yes, to a significant degree."]]),
    `<h3 id="can-it-be-automated">Can it be automated?</h3><p class="my-4">Yes, to a significant degree.</p>`
  );
  assert.deepEqual(checkPage(html, "/blog/x"), []);
});

test("faq: FaqSection's dt/dd markup passes; visible is the rule, not heading", () => {
  const html = page(faqLd([["What is SPM?", "Sales performance management."]]), `<dl><dt>What is SPM?</dt><dd>Sales performance management.</dd></dl>`);
  assert.deepEqual(checkPage(html, "/spm/x"), []);
});

test("faq: M1 fails when the schema question is absent from the body", () => {
  const html = page(faqLd([["Is this hidden?", "Yes."]]), `<p>Yes.</p>`);
  assert.ok(has(checkPage(html, "/blog/x"), "M1"));
});

test("faq: M2 fails when the body answer was edited but the schema copy was not", () => {
  const html = page(
    faqLd([["How often?", "At least annually."]]),
    `<h3>How often?</h3><p>At least quarterly.</p>`
  );
  const errors = checkPage(html, "/blog/x");
  assert.ok(has(errors, "M2"));
  assert.equal(has(errors, "M1"), false);
});

test("faq: text that exists only inside a script (the RSC payload, or the JSON-LD itself) does not count", () => {
  const html = page(
    faqLd([["Only in schema?", "Only in schema."]]),
    `<script>self.__next_f.push([1,"Only in schema? Only in schema."])</script>`
  );
  const errors = checkPage(html, "/blog/x");
  assert.ok(has(errors, "M1"));
  assert.ok(has(errors, "M2"));
});

test("faq: curly quotes, entities, inline markup and React text separators still match", () => {
  const html = page(
    faqLd([["What's the company's rule?", 'It is "fair", always.']]),
    `<h3>What&#x27;s the company’s rule?</h3><p>It is <strong>“fair”</strong>,<!-- --> always.</p>`
  );
  assert.deepEqual(checkPage(html, "/blog/x"), []);
});

/* ---------------- HowTo ---------------- */

test("howTo: step names as headings, texts visible, anchors present passes", () => {
  const html = page(
    howToLd([["Step 1: Define", "Define it.", "step-1-define"], ["Step 2: Map", "Map it.", "step-2-map"]]),
    `<h3 id="step-1-define">Step 1: Define</h3><p>Define it.</p><h3 id="step-2-map">Step 2: Map</h3><p>Map it.</p>`
  );
  assert.deepEqual(checkPage(html, "/blog/x"), []);
});

test("howTo: M3 fails when a step name is visible but only as a paragraph", () => {
  const html = page(
    howToLd([["Step 1: Define", "Define it.", "step-1-define"]]),
    `<p id="step-1-define">Step 1: Define</p><p>Define it.</p>`
  );
  assert.ok(has(checkPage(html, "/blog/x"), "M3"));
});

test("howTo: M4 fails when step text is not on the page", () => {
  const html = page(
    howToLd([["Step 1: Define", "Text nobody can read.", "step-1-define"]]),
    `<h3 id="step-1-define">Step 1: Define</h3><p>Different text.</p>`
  );
  assert.ok(has(checkPage(html, "/blog/x"), "M4"));
});

test("howTo: M5 fails when a step url anchor has no matching id", () => {
  const html = page(
    howToLd([["Step 1: Define", "Define it.", "step-one"]]),
    `<h3 id="step-1-define">Step 1: Define</h3><p>Define it.</p>`
  );
  const errors = checkPage(html, "/blog/x");
  assert.ok(has(errors, "M5"));
  assert.equal(has(errors, "M3"), false);
});

/* ---------------- plumbing ---------------- */

test("a page with no FAQPage or HowTo produces no errors", () => {
  assert.deepEqual(checkPage(page(ld({ "@type": "Organization", name: "Lanshore" }), "<p>Hi</p>"), "/"), []);
});

test("M0: an unparseable JSON-LD block is reported, never silently skipped", () => {
  const html = page(`<script type="application/ld+json">{not json</script>`, "<p>x</p>");
  assert.ok(has(checkPage(html, "/"), "M0"));
});

test("nodesOfType finds nodes inside @graph and in multi-type arrays", () => {
  const doc = { "@graph": [{ "@type": ["WebPage", "FAQPage"], mainEntity: [] }, { "@type": "Thing" }] };
  assert.equal(nodesOfType(doc, "FAQPage").length, 1);
});

test("visibleText drops scripts and styles; headingTexts reads nested markup", () => {
  assert.equal(visibleText("<style>.a{}</style><p>One</p><p>Two</p>"), "one two");
  assert.deepEqual(headingTexts('<h2 class="x">A <em>b</em></h2><h3>C</h3>'), ["a b", "c"]);
  assert.equal(normalize("  A  B  "), "a b");
});

/* ---------------- review findings, pinned ---------------- */

test("faq: a question present only in <title> does not count as visible", () => {
  const html = `<html><head><title>What is SPM?</title>${faqLd([["What is SPM?", "An answer."]])}</head><body><p>An answer.</p></body></html>`;
  assert.ok(has(checkPage(html, "/x"), "M1"));
});

test("faq: a one-word answer is not satisfied by a longer word containing it", () => {
  const html = page(faqLd([["Is it done?", "Yes"]]), `<h3>Is it done?</h3><p>Yesterday it was.</p>`);
  assert.ok(has(checkPage(html, "/x"), "M2"));
});

test("howTo: M5 fails when the step url's id exists but sits on a different heading", () => {
  const html = page(
    howToLd([["Step 1", "Do it.", "step-1"]]),
    `<h2 id="step-1">Overview</h2><h3 id="step-1-2">Step 1</h3><p>Do it.</p>`
  );
  const errors = checkPage(html, "/x");
  assert.ok(errors.some((e) => e.startsWith("M5") && e.includes("lands on")), errors.join("\n"));
});

test("an id attribute in a data-id or similar is not mistaken for a heading id", () => {
  const html = page(
    howToLd([["Step 1", "Do it.", "step-1"]]),
    `<h3 data-id="step-1">Step 1</h3><p>Do it.</p>`
  );
  assert.ok(has(checkPage(html, "/x"), "M5"));
});

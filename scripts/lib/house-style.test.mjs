/**
 * Tests for the no-em-dash house style. Fixtures build the em dash from its
 * code point (EM_DASH) so this file carries none literally.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { findInHtml, findInRecord, findProofMarkers, findProofMarkersInHtml, EM_DASH } from "./house-style.mjs";

const D = EM_DASH;
const kinds = (html) => findInHtml(html).map((h) => h.kind);

test("clean page: nothing found", () => {
  assert.deepEqual(findInHtml("<html><head><title>A | Lanshore</title></head><body><p>Fine: no dash.</p></body></html>"), []);
});

test("finds em dashes in body text, title, meta, JSON-LD and readable attributes", () => {
  const html =
    `<html><head><title>A ${D} B</title><meta name="description" content="x ${D} y">` +
    `<script type="application/ld+json">{"@type":"Organization","name":"Lanshore ${D} US"}</script></head>` +
    `<body><p>one ${D} two</p><img alt="logo ${D} tagline" src="/x.png"></body></html>`;
  assert.deepEqual(kinds(html).sort(), ["attribute", "json-ld", "meta", "text", "title"]);
});

test("entity forms count: &mdash; and &#8212; render as the same character", () => {
  assert.deepEqual(kinds("<body><p>a &mdash; b</p><p>c &#8212; d</p></body>"), ["text", "text"]);
});

test("ignores non-published places: inline scripts (RSC payload), styles and HTML comments", () => {
  const html = `<body><script>self.__next_f.push("a ${D} b")</script><style>/* ${D} */</style><!-- ${D} --><p>ok</p></body>`;
  assert.deepEqual(findInHtml(html), []);
});

test("en dashes and hyphens are not em dashes", () => {
  assert.deepEqual(findInHtml("<body><p>2019–2024, well-known</p></body>"), []);
});

test("findInRecord reports the field path of every hit, including nested FAQ answers and the body", () => {
  const record = {
    title: "Fine",
    body: `para ${D} more`,
    faq: [{ question: "Q?", answer: "A." }, { question: "Q2?", answer: `yes ${D} no` }],
  };
  assert.deepEqual(findInRecord(record), ["body", "faq[1].answer"]);
  assert.deepEqual(findInRecord({ title: "clean", faq: [] }), []);
});

/* ------------------------------------------------------------------ *
 * Proof-point markers (plan aeo-hubspot-recs-2026-10-12, section 3.4)
 * ------------------------------------------------------------------ */

test("findProofMarkers reports the field path of a marker in a nested FAQ answer", () => {
  const record = {
    title: "Fine",
    faq: [
      { question: "Q0?", answer: "A0." },
      { question: "Q1?", answer: "A1." },
      { question: "Q2?", answer: "We cut close time. [PROOF POINT NEEDED: client and figure]" },
    ],
  };
  assert.deepEqual(findProofMarkers(record), ["faq[2].answer"]);
});

test("findProofMarkers: lowercase, extra whitespace, a line break and no brackets are all detected", () => {
  assert.deepEqual(findProofMarkers({ a: "x proof  point needed y" }), ["a"]);
  assert.deepEqual(findProofMarkers({ a: "Proof point needed" }), ["a"]);
  assert.deepEqual(findProofMarkers({ a: "PROOF\n\tPOINT   NEEDED" }), ["a"]);
  assert.deepEqual(findProofMarkers({ a: "[Proof Point Needed]" }), ["a"]);
  assert.deepEqual(findProofMarkers("proof point needed"), ["(value)"]);
});

test("findProofMarkers: ordinary prose about proof points is not a marker", () => {
  const record = {
    body: "Each claim needs a proof point. Proof points matter. A proof point is needed here.",
    faq: [{ question: "Why do proof points matter?", answer: "Proof is needed; points are earned." }],
  };
  assert.deepEqual(findProofMarkers(record), []);
});

test("findProofMarkers: numbers, booleans, null and undefined are ignored without throwing", () => {
  const record = { count: 3, draft: false, featured: true, image: null, missing: undefined, list: [1, null, "ok"] };
  assert.deepEqual(findProofMarkers(record), []);
  assert.deepEqual(findProofMarkers(null), []);
  assert.deepEqual(findProofMarkers(42), []);
});

test("findProofMarkers: hyphens, underscores and Markdown emphasis between the words are still a marker", () => {
  assert.deepEqual(findProofMarkers({ a: "[PROOF-POINT NEEDED: client figure]" }), ["a"]);
  assert.deepEqual(findProofMarkers({ a: "proof_point_needed" }), ["a"]);
  assert.deepEqual(findProofMarkers({ a: "**PROOF POINT** NEEDED" }), ["a"]);
  assert.deepEqual(findProofMarkers({ a: "_proof point_ needed" }), ["a"]);
  /* Negative: hyphenated prose without the third word is not a marker. */
  assert.deepEqual(findProofMarkers({ a: "Proof-points matter, and none is needed here." }), []);
});

test("findProofMarkers descends into every Solution field the module-load guard checks", () => {
  /* Same shape as src/lib/solutions/types.ts; solutions/index.ts throws on any hit. */
  const solution = {
    slug: "fixture",
    name: "Fixture",
    problems: [{ title: "P1", body: "fine" }],
    howWeDeliver: [
      { title: "Step 1", body: "fine" },
      { title: "Step 2", body: "We cut close time. [PROOF POINT NEEDED: figure]" },
    ],
    related: [{ label: "x", href: "/solutions/spm-consulting" }],
    faq: [{ question: "Q?", answer: "fine" }],
  };
  assert.deepEqual(findProofMarkers(solution), ["howWeDeliver[1].body"]);
  solution.howWeDeliver[1].body = "We cut close time.";
  assert.deepEqual(findProofMarkers(solution), []);
});

test("findProofMarkers: an explicit base path prefixes every hit", () => {
  assert.deepEqual(findProofMarkers({ answer: "proof point needed" }, "faq[0]"), ["faq[0].answer"]);
});

const M = "[PROOF POINT NEEDED: figure]";
const markerKinds = (html) => findProofMarkersInHtml(html).map((h) => h.kind);

test("findProofMarkersInHtml: one hit each in visible text, <title>, meta content and JSON-LD, with the right kind", () => {
  assert.deepEqual(markerKinds(`<html><head><title>A</title></head><body><p>Cut close. ${M}</p></body></html>`), ["text"]);
  assert.deepEqual(markerKinds(`<html><head><title>A ${M}</title></head><body><p>ok</p></body></html>`), ["title"]);
  assert.deepEqual(
    markerKinds(`<html><head><title>A</title><meta name="description" content="x ${M}"></head><body></body></html>`),
    ["meta"]
  );
  assert.deepEqual(
    markerKinds(
      `<html><head><script type="application/ld+json">{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Q","acceptedAnswer":{"@type":"Answer","text":"A ${M}"}}]}</script></head><body></body></html>`
    ),
    ["json-ld"]
  );
  assert.deepEqual(markerKinds(`<body><img alt="logo ${M}" src="/x.png"></body>`), ["attribute"]);
});

test("findProofMarkersInHtml: a marker only in an HTML comment or a non-JSON-LD script is not published", () => {
  assert.deepEqual(findProofMarkersInHtml(`<body><!-- ${M} --><p>ok</p></body>`), []);
  assert.deepEqual(findProofMarkersInHtml(`<body><script>self.__next_f.push("${M}")</script><p>ok</p></body>`), []);
  assert.deepEqual(findProofMarkersInHtml(`<body><style>/* ${M} */</style><p>ok</p></body>`), []);
});

test("findProofMarkersInHtml: a non-breaking space entity does not hide a marker; a clean page has none", () => {
  assert.deepEqual(markerKinds("<body><p>proof&nbsp;point&#160;needed</p></body>"), ["text"]);
  assert.deepEqual(findProofMarkersInHtml("<html><head><title>A | Lanshore</title></head><body><p>Each claim needs a proof point.</p></body></html>"), []);
});

test("findProofMarkersInHtml: a marker split by inline markup is found once, as text", () => {
  assert.deepEqual(markerKinds("<body><p><strong>PROOF POINT</strong> NEEDED: figure</p></body>"), ["text"]);
  assert.deepEqual(markerKinds("<body><p>proof <em>point</em> needed</p></body>"), ["text"]);
  /* Not double-reported when a single chunk already matched. */
  assert.deepEqual(markerKinds(`<body><p>${M}</p><p><b>proof point</b> needed</p></body>`), ["text"]);
  /* Negative: words in separate blocks with no separator between them do not join into a marker. */
  assert.deepEqual(findProofMarkersInHtml("<body><p>We need a proof point</p><p>needed later</p></body>"), []);
});

test("findProofMarkersInHtml reports an excerpt around the marker", () => {
  const [hit] = findProofMarkersInHtml(`<body><p>Close time fell. ${M}</p></body>`);
  assert.match(hit.text, /PROOF POINT NEEDED/);
});

test("the em dash rule is unchanged by the shared scan: a marker page with no dash has no em dash hits", () => {
  assert.deepEqual(findInHtml(`<body><p>${M}</p></body>`), []);
  assert.deepEqual(findProofMarkersInHtml(`<body><p>a ${D} b</p></body>`), []);
});

test("unparseable JSON-LD is skipped by both rules (check:schema-mirror M0 owns it), the rest of the page is still scanned", () => {
  const html = `<html><head><script type="application/ld+json">{not json ${M} ${D}</script></head><body><p>${M}</p></body></html>`;
  assert.deepEqual(markerKinds(html), ["text"]);
  assert.deepEqual(findInHtml(html), []);
});

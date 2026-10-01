/**
 * Tests for the no-em-dash house style. Fixtures build the em dash from its
 * code point (EM_DASH) so this file carries none literally.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { findInHtml, findInRecord, EM_DASH } from "./house-style.mjs";

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

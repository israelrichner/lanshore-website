import { test } from "node:test";
import assert from "node:assert/strict";

import {
  headline,
  optionalKey,
  personNode,
  authorRef,
  imageRef,
  articleDates,
  howToNode,
} from "./schema-nodes.mjs";
import { headingId } from "./heading-id.mjs";

const SITE = "https://lanshore.com";
const ORG = `${SITE}/#organization`;

const AUTHORS = {
  "doug-erb": { id: "doug-erb", name: "Doug Erb" },
  "full-record": {
    id: "full-record",
    name: "Full Record",
    jobTitle: "Principal",
    bio: "Fifteen years of comp operations.",
    linkedin: "https://www.linkedin.com/in/example",
    sameAs: ["https://example.com/profile"],
  },
};

/* ------------------------------------------------------------------ *
 * optionalKey — the discipline every other helper is built on
 * ------------------------------------------------------------------ */

test("optionalKey emits the key when there is a value", () => {
  assert.deepEqual(optionalKey("a", "x"), { a: "x" });
  assert.deepEqual(optionalKey("a", 0), { a: 0 });
  assert.deepEqual(optionalKey("a", false), { a: false });
});

test("optionalKey omits the key entirely for empty values", () => {
  for (const empty of [undefined, null, "", "   ", []]) {
    assert.deepEqual(optionalKey("a", empty), {}, `expected {} for ${JSON.stringify(empty)}`);
  }
});

test("optionalKey never produces a key holding undefined", () => {
  const obj = { ...optionalKey("datePublished", undefined) };
  assert.equal("datePublished" in obj, false, "key must be ABSENT, not present-and-undefined");
});

/* ------------------------------------------------------------------ *
 * headline — existing behavior, pinned so the move does not change it
 * ------------------------------------------------------------------ */

test("headline leaves a short title untouched", () => {
  assert.equal(headline("Short title"), "Short title");
});

test("headline passes a title at exactly the 110-char limit through", () => {
  const exact = "a".repeat(110);
  assert.equal(headline(exact), exact);
});

test("headline truncates past the limit on a word boundary with an ellipsis", () => {
  const long = `${"word ".repeat(40)}end`;
  const out = headline(long);
  assert.ok(out.length <= 110, `expected <= 110 chars, got ${out.length}`);
  assert.ok(out.endsWith("…"), "expected a trailing ellipsis");
  assert.ok(!out.endsWith(" …"), "ellipsis must not follow a bare space");
});

test("headline trims trailing punctuation before the ellipsis", () => {
  const long = `${"alpha beta, ".repeat(12)}tail`;
  const out = headline(long);
  assert.ok(!/[,;:]…$/.test(out), `punctuation left before ellipsis: ${out}`);
});

/* ------------------------------------------------------------------ *
 * personNode / authorRef
 * ------------------------------------------------------------------ */

test("personNode returns null when there is no author", () => {
  assert.equal(personNode(undefined, SITE, ORG), null);
});

test("personNode emits a stable @id and links the org", () => {
  const node = personNode(AUTHORS["doug-erb"], SITE, ORG);
  assert.equal(node["@type"], "Person");
  assert.equal(node["@id"], `${SITE}/#person-doug-erb`);
  assert.equal(node.name, "Doug Erb");
  assert.deepEqual(node.worksFor, { "@id": ORG });
});

test("personNode omits jobTitle, description and sameAs when the record has none", () => {
  const node = personNode(AUTHORS["doug-erb"], SITE, ORG);
  for (const key of ["jobTitle", "description", "sameAs"]) {
    assert.equal(key in node, false, `${key} must be absent, not empty`);
  }
});

test("personNode folds linkedin into sameAs and de-duplicates", () => {
  const node = personNode(AUTHORS["full-record"], SITE, ORG);
  assert.deepEqual(node.sameAs, [
    "https://example.com/profile",
    "https://www.linkedin.com/in/example",
  ]);
  assert.equal(node.jobTitle, "Principal");
});

test("personNode does not duplicate a linkedin url already present in sameAs", () => {
  const dup = {
    id: "dup",
    name: "Dup",
    linkedin: "https://www.linkedin.com/in/dup",
    sameAs: ["https://www.linkedin.com/in/dup"],
  };
  assert.deepEqual(personNode(dup, SITE, ORG).sameAs, ["https://www.linkedin.com/in/dup"]);
});

test("authorRef falls back to the organization when no author is named", () => {
  assert.deepEqual(authorRef(undefined, AUTHORS, SITE, ORG), { "@id": ORG });
});

test("authorRef falls back to the organization for an unknown id rather than throwing", () => {
  assert.deepEqual(authorRef("nobody", AUTHORS, SITE, ORG), { "@id": ORG });
});

test("authorRef emits the Person node for a known id", () => {
  assert.equal(authorRef("doug-erb", AUTHORS, SITE, ORG)["@type"], "Person");
});

/* ------------------------------------------------------------------ *
 * imageRef
 * ------------------------------------------------------------------ */

test("imageRef falls back to the generated OG card", () => {
  assert.equal(imageRef(undefined, SITE), `${SITE}/opengraph-image`);
  assert.equal(imageRef("", SITE), `${SITE}/opengraph-image`);
  assert.equal(imageRef("   ", SITE), `${SITE}/opengraph-image`);
});

test("imageRef makes a site-relative path absolute", () => {
  assert.equal(imageRef("/images/x.png", SITE), `${SITE}/images/x.png`);
});

test("imageRef leaves an already-absolute url alone", () => {
  assert.equal(imageRef("https://cdn.example.com/x.png", SITE), "https://cdn.example.com/x.png");
});

test("imageRef never returns an empty string", () => {
  for (const input of [undefined, null, "", "  "]) {
    assert.ok(imageRef(input, SITE).length > 0);
  }
});

/* ------------------------------------------------------------------ *
 * articleDates
 * ------------------------------------------------------------------ */

test("articleDates always carries dateModified", () => {
  assert.equal(articleDates("2026-07-11").dateModified, "2026-07-11");
});

test("articleDates OMITS datePublished when none is on file", () => {
  const out = articleDates("2026-07-11", undefined);
  assert.equal("datePublished" in out, false, "key must be absent, never null or empty");
  assert.deepEqual(Object.keys(out), ["dateModified"]);
});

test("articleDates emits datePublished when a real one is supplied", () => {
  const out = articleDates("2026-07-11", "2026-03-02");
  assert.equal(out.datePublished, "2026-03-02");
  assert.equal(out.dateModified, "2026-07-11");
});

/* ------------------------------------------------------------------ *
 * howToNode + headingId — a step URL must land on a real heading id
 * ------------------------------------------------------------------ */

const PAGE = `${SITE}/blog/a-post`;
const HOWTO = {
  name: "How to do the thing",
  description: "A short procedure.",
  steps: [
    { name: "Step 1: Define Your TAM", text: "First text." },
    { name: "Step 2: Map Coverage", text: "Second text." },
  ],
};

test("howToNode emits steps in source order with 1-based positions", () => {
  const node = howToNode(HOWTO, PAGE);
  assert.equal(node["@type"], "HowTo");
  assert.deepEqual(
    node.step.map((s) => [s.position, s.name, s.text]),
    [
      [1, "Step 1: Define Your TAM", "First text."],
      [2, "Step 2: Map Coverage", "Second text."],
    ]
  );
});

test("howToNode step urls use the same id Markdown stamps on the heading", () => {
  const node = howToNode(HOWTO, PAGE);
  assert.equal(node.step[0].url, `${PAGE}#${headingId("Step 1: Define Your TAM")}`);
  assert.equal(node.step[0].url, `${PAGE}#step-1-define-your-tam`);
});

test("howToNode omits totalTime and description when absent, never emits them empty", () => {
  const node = howToNode({ name: "n", steps: HOWTO.steps }, PAGE);
  assert.equal("totalTime" in node, false);
  assert.equal("description" in node, false);
  assert.equal(howToNode({ ...HOWTO, totalTime: "PT2H" }, PAGE).totalTime, "PT2H");
});

test("headingId: punctuation, apostrophes and accents collapse predictably", () => {
  assert.equal(headingId("Step 1: Define Your Total Addressable Market (TAM) with Precision"),
    "step-1-define-your-total-addressable-market-tam-with-precision");
  assert.equal(headingId("The company’s SPM"), "the-companys-spm");
  assert.equal(headingId("Café — Résumé"), "cafe-resume");
  assert.equal(headingId("  --Edge--  "), "edge");
});

/* ------------------------------------------------------------------ *
 * softwareApplicationNode — /spm/compare vendors
 * ------------------------------------------------------------------ */

import { softwareApplicationNode } from "./schema-nodes.mjs";

const PLATFORM = {
  slug: "varicent",
  name: "Varicent",
  vendor: "Varicent",
  officialUrl: "https://www.varicent.com/",
  firstSentence: "Varicent is an SPM platform.",
  capabilities: ["Territory planning", "Commissions"],
};

test("softwareApplicationNode carries identity and features, and no rating, review, offer or brand", () => {
  const node = softwareApplicationNode(PLATFORM, SITE);
  assert.equal(node["@type"], "SoftwareApplication");
  assert.equal(node["@id"], `${SITE}/spm/varicent#software`);
  assert.equal(node.url, PLATFORM.officialUrl);
  assert.deepEqual(node.publisher, { "@type": "Organization", name: "Varicent" });
  assert.deepEqual(node.featureList, PLATFORM.capabilities);
  for (const banned of ["aggregateRating", "review", "offers", "brand", "sameAs"]) {
    assert.equal(banned in node, false, `${banned} must not be emitted`);
  }
});

test("softwareApplicationNode emits alternateName only when former names exist", () => {
  assert.equal("alternateName" in softwareApplicationNode(PLATFORM, SITE), false);
  assert.equal("alternateName" in softwareApplicationNode({ ...PLATFORM, formerNames: [] }, SITE), false);
  assert.deepEqual(softwareApplicationNode({ ...PLATFORM, formerNames: ["IBM ICM"] }, SITE).alternateName, ["IBM ICM"]);
});

/* ------------------------------------------------------------------ *
 * createIdAllocator — unique, stable heading ids per page
 * ------------------------------------------------------------------ */

import { createIdAllocator } from "./heading-id.mjs";

test("allocator: repeated headings get -2, -3, and never collide with a literal '... 2'", () => {
  const next = createIdAllocator();
  assert.deepEqual(["Intro", "Intro", "Intro 2", "Intro"].map((t, i) => next(t, i)), ["intro", "intro-2", "intro-2-2", "intro-3"]);
});

test("allocator: the same key returns the same id, so a double render does not count twice", () => {
  const next = createIdAllocator();
  assert.equal(next("Intro", 10), "intro");
  assert.equal(next("Intro", 10), "intro");
  assert.equal(next("Intro", 20), "intro-2");
});

test("allocator: reserved ids are never issued to a body heading", () => {
  const next = createIdAllocator(["key-takeaways"]);
  assert.equal(next("Key Takeaways", 0), "key-takeaways-2");
});

test("allocator: a heading with no slug-able text still gets a usable id", () => {
  const next = createIdAllocator();
  assert.equal(next("???", 0), "section");
  assert.equal(next("!!!", 1), "section-2");
});

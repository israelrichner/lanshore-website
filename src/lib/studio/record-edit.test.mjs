/**
 * Clearing an optional field must survive every editor action, publish above
 * all: publish starts from head, so a cleared field that is merely omitted
 * comes back. Run: node --test src/lib/studio/record-edit.test.mjs
 */
import test from "node:test";
import assert from "node:assert/strict";
import { recordForAction, dropCleared, CLEARABLE_FIELDS } from "./record-edit.mjs";

const HEAD = { title: "T", author: "doug-erb", datePublished: "2026-03-02", publishedOnce: true, draft: true };

test("publish: a cleared author and publish date are removed, not resurrected from head", () => {
  const out = recordForAction("publish", HEAD, { title: "T", author: null, datePublished: null });
  assert.equal("author" in out, false);
  assert.equal("datePublished" in out, false);
  assert.equal(out.publishedOnce, true, "untouched head fields survive");
});

test("publish: a field the form omitted keeps head's value (stale-tab protection unchanged)", () => {
  const out = recordForAction("publish", HEAD, { title: "New" });
  assert.equal(out.author, "doug-erb");
  assert.equal(out.title, "New");
});

test("saveDraft: writes what was sent, minus cleared keys, ignoring head", () => {
  const out = recordForAction("saveDraft", HEAD, { title: "T", author: null, cardTitle: "Short" });
  assert.deepEqual(out, { title: "T", cardTitle: "Short" });
});

test("a null for a non-clearable field is NOT silently dropped; validation gets to reject it", () => {
  const out = recordForAction("publish", HEAD, { publishedOnce: null });
  assert.equal(out.publishedOnce, null);
  assert.equal(CLEARABLE_FIELDS.includes("publishedOnce"), false);
});

test("dropCleared leaves falsy-but-real values alone", () => {
  assert.deepEqual(dropCleared({ featured: false, summary: "", author: null }), { featured: false, summary: "" });
});

import { initialFor } from "./record-edit.mjs";

test("initialFor keeps fields the form does not edit, so a draft save cannot delete them", () => {
  const blog = initialFor("blog", { title: "T", cardTitle: "Short", image: "/x.png", publishedOnce: true }, "2026-10-01");
  assert.equal(blog.cardTitle, "Short");
  assert.equal(blog.image, "/x.png");
  assert.equal(blog.publishedOnce, true);

  const study = initialFor("caseStudies", { title: "S", dateModified: "2026-09-01", publishedOnce: true }, "2026-10-01");
  assert.equal(study.dateModified, "2026-09-01");
  assert.equal(study.publishedOnce, true);

  const paper = initialFor("whitePapers", { title: "P", file: "/papers/p.pdf", publishedOnce: true }, "2026-10-01");
  assert.equal(paper.file, "/papers/p.pdf");
  assert.equal(paper.publishedOnce, true);
});

test("initialFor gives a new record typed defaults and no invented byline", () => {
  const blog = initialFor("blog", {}, "2026-10-01");
  assert.equal(blog.dateModified, "2026-10-01");
  assert.equal(blog.author, undefined);
  assert.equal(blog.datePublished, undefined);
  assert.deepEqual(blog.faq, []);
  assert.equal(initialFor("caseStudies", {}, "2026-10-01").pillar, "SPM Operations");
});

test("initialFor ignores a non-string author rather than coercing it into the picker", () => {
  assert.equal(initialFor("blog", { author: { name: "x" } }, "2026-10-01").author, undefined);
});

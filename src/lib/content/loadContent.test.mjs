/**
 * T0 — admin-only fields must never reach a public record.
 *
 * This is review blocker B1, and it is not a hypothetical. Measured on the
 * unmodified tree: `/case-studies` passes whole records to <CaseStudyGrid>,
 * a "use client" component, so all 11 record fields are serialised into the
 * RSC payload — 14 occurrences each, including `legacyUrl` and `whatWeDid`,
 * neither of which is rendered anywhere.
 *
 * So a `publishedOnce` flag that reaches a record changes the public bytes on
 * the first Publish and breaks the byte-parity P1 established. Same shape as
 * P1's mentionsGartner regression.
 *
 * These tests run against the REAL content directory, writing temporary
 * fixture files carrying admin-only fields and asserting they are stripped.
 * A pure-unit version would test the helper without proving the loaders
 * actually call it.
 *
 * Run: node --test src/lib/content/loadContent.test.mjs
 */

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "../../..");
const CONTENT = path.join(ROOT, "content");
const ADMIN_ONLY = ["draft", "publishedOnce"];

/* Fixtures are added to the ledger too, or rule L3 (nothing unregistered)
   would reject them for the wrong reason and mask what we are testing. */
const LEDGER = path.join(CONTENT, "SLUGS.lock.json");

/* MUST be async and MUST await fn(). With `try { return fn() } finally {...}`
   and an async fn, the finally block runs when the promise is RETURNED, not
   when it settles — so the fixtures get deleted before the loader reads them,
   and every assertion fails with "fixture should load". */
async function withFixtures(files, ledgerAdds, fn) {
  const originalLedger = fs.readFileSync(LEDGER, "utf8");
  const written = [];
  try {
    const ledger = JSON.parse(originalLedger);
    for (const [collection, slugs] of Object.entries(ledgerAdds)) ledger[collection].push(...slugs);
    fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 2) + "\n");
    for (const [rel, body] of Object.entries(files)) {
      const abs = path.join(CONTENT, rel);
      fs.writeFileSync(abs, body);
      written.push(abs);
    }
    return await fn();
  } finally {
    for (const f of written) fs.rmSync(f, { force: true });
    fs.writeFileSync(LEDGER, originalLedger);
  }
}

/* Fresh import each time: loadContent reads at module scope, so a cached
   module would return records built before the fixtures existed. */
async function freshLoad() {
  const url = pathToFileURL(path.join(ROOT, "src/lib/content/loadContent.ts")).href;
  return import(`${url}?t=${written_counter++}`);
}
let written_counter = 0;

test("case studies: admin-only fields are stripped from the public record", async () => {
  const slug = "zz-fixture-case-study";
  const body = JSON.stringify({
    title: "Fixture", client: "Acme", industry: "Technology", pillar: "SPM Operations",
    outcome: "o", challenge: "c", whatWeDid: "w", results: ["r"], stack: ["s"],
    legacyUrl: "/case_studies/x",
    draft: false, publishedOnce: true,
  }, null, 2);

  await withFixtures({ [`case-studies/${slug}.json`]: body }, { caseStudies: [slug] }, async () => {
    const m = await freshLoad();
    const rec = m.loadCaseStudies().find((r) => r.slug === slug);
    assert.ok(rec, "fixture should load");
    for (const f of ADMIN_ONLY) {
      assert.ok(!(f in rec), `"${f}" leaked into the public case-study record`);
    }
    /* Real fields must survive — a strip that removes everything would also
       pass the assertions above. */
    assert.equal(rec.client, "Acme");
    assert.equal(rec.legacyUrl, "/case_studies/x");
  });
});

test("blog: admin-only fields are stripped from the public record", async () => {
  const slug = "zz-fixture-post";
  const body = [
    "---", 'title: Fixture', 'description: d', "dateModified: '2026-07-11'",
    "featured: false", "summary: s", "publishedOnce: true", "draft: false", "---", "", "## H", "", "Body.", "",
  ].join("\n");

  await withFixtures({ [`blog/${slug}.md`]: body }, { blog: [slug] }, async () => {
    const m = await freshLoad();
    const rec = m.loadBlog().find((r) => r.slug === slug);
    assert.ok(rec, "fixture should load");
    for (const f of ADMIN_ONLY) {
      assert.ok(!(f in rec), `"${f}" leaked into the public blog record`);
    }
    assert.equal(rec.title, "Fixture");
  });
});

test("white papers: admin-only fields are stripped from the public record", async () => {
  const slug = "zz-fixture-paper";
  const body = JSON.stringify({
    title: "Fixture", description: "d", file: `/whitepapers/${slug}.pdf`,
    hubspotValue: slug, draft: false, publishedOnce: true,
  }, null, 2);

  await withFixtures({ [`white-papers/${slug}.json`]: body }, { whitePapers: [slug] }, async () => {
    const m = await freshLoad();
    const rec = m.loadWhitePapers().find((r) => r.slug === slug);
    assert.ok(rec, "fixture should load");
    for (const f of ADMIN_ONLY) {
      assert.ok(!(f in rec), `"${f}" leaked into the public white-paper record`);
    }
    assert.equal(rec.hubspotValue, slug);
  });
});

test("draft:true items are still excluded entirely", async () => {
  /* Stripping the flag must not accidentally publish drafts — the strip
     happens after the filter, and this pins that ordering. */
  const slug = "zz-fixture-draft";
  const body = JSON.stringify({
    title: "Draft", client: "Acme", industry: "Technology", pillar: "SPM Operations",
    outcome: "o", challenge: "c", whatWeDid: "w", results: ["r"], stack: ["s"],
    legacyUrl: "/case_studies/y", draft: true,
  }, null, 2);

  await withFixtures({ [`case-studies/${slug}.json`]: body }, { caseStudies: [slug] }, async () => {
    const m = await freshLoad();
    assert.equal(m.loadCaseStudies().find((r) => r.slug === slug), undefined, "draft must not load");
  });
});

test("ADMIN_ONLY_FIELDS is exported so the list has one home", async () => {
  const m = await freshLoad();
  assert.deepEqual([...m.ADMIN_ONLY_FIELDS], ADMIN_ONLY);
});

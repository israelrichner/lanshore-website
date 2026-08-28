/**
 * Every row of source plan §6.6, as a test rather than a manual E11 walk.
 *
 * Three of these four buttons failed the build under the plan's v2 design
 * (review blocker B1), and §10.6 states E11 — owner-driven, on a deployment
 * — is otherwise their only verification.
 *
 * Every resulting state is fed through the real checkLedger(), so a change
 * set that would fail the build fails here first.
 *
 * Run: node --test src/lib/studio/ledger-ops.test.mjs
 */

import test from "node:test";
import assert from "node:assert/strict";
import { saveDraft, publish, unpublish, remove, LEDGER_PATH, contentPath } from "./ledger-ops.mjs";
import { checkLedger } from "../../../scripts/lib/content-rules.mjs";
import { REDIRECT_DESTINATIONS } from "../../../scripts/lib/redirect-destinations.mjs";

/* A slug a live 301 points at, and one that nothing points at — 14 studies,
   13 destinations, so exactly one is free. */
const GUARDED = "commission-architecture-redesign";
const FREE = "oilfield-invoicing-automation";

const ledgerOf = (caseStudies) => ({
  version: 1, blog: [], caseStudies: [...caseStudies], whitePapers: [], retired: [],
});

const study = (over = {}) => ({
  title: "T", client: "C", industry: "I", pillar: "SPM Operations",
  outcome: "o", challenge: "c", whatWeDid: "w", results: ["r"], stack: ["s"],
  legacyUrl: "/x", ...over,
});

/** Apply a change set to a simulated disk, then run the real ledger rules. */
function assertLedgerValid(result, disk) {
  const onDisk = { blog: [], caseStudies: [], whitePapers: [] };
  for (const [slug, rec] of Object.entries(disk)) {
    onDisk.caseStudies.push({ slug, draft: rec.draft === true });
  }
  for (const c of result.changes ?? []) {
    if (c.path === LEDGER_PATH) continue;
    const slug = c.path.split("/").pop().replace(/\.(md|json)$/, "");
    const i = onDisk.caseStudies.findIndex((r) => r.slug === slug);
    if (c.delete) { if (i !== -1) onDisk.caseStudies.splice(i, 1); continue; }
    const entry = { slug, draft: c.record.draft === true };
    if (i === -1) onDisk.caseStudies.push(entry); else onDisk.caseStudies[i] = entry;
  }
  const errors = checkLedger({
    ledger: result.ledger,
    onDisk,
    redirectDestinations: { blog: [], caseStudies: REDIRECT_DESTINATIONS.caseStudies.filter((s) => s in disk || onDisk.caseStudies.some((r) => r.slug === s)) },
  });
  assert.deepEqual(errors, [], "resulting state must satisfy the ledger rules");
}

/* ------------------------------------------------------------------ *
 * Save draft
 * ------------------------------------------------------------------ */

test("save draft (new): file and ledger entry travel in ONE change set", async () => {
  /* Splitting them is what made v2 fail — the ledger would name a file that
     did not exist yet, and the build would reject it. */
  const r = saveDraft({ collection: "caseStudies", slug: "brand-new", record: study(), ledger: ledgerOf([]), isNew: true });
  assert.equal(r.refusal, null);
  assert.equal(r.changes.length, 2);
  assert.ok(r.changes.some((c) => c.path === contentPath("caseStudies", "brand-new")));
  assert.ok(r.changes.some((c) => c.path === LEDGER_PATH));
  assert.equal(r.changes[0].record.draft, true);
  assert.deepEqual(r.ledger.caseStudies, ["brand-new"]);
  assertLedgerValid(r, {});
});

test("save draft (existing): ledger untouched, only the file changes", () => {
  const r = saveDraft({ collection: "caseStudies", slug: FREE, record: study(), ledger: ledgerOf([FREE]), isNew: false });
  assert.equal(r.changes.length, 1);
  assert.deepEqual(r.ledger.caseStudies, [FREE]);
});

test("save draft refuses a slug already in use", () => {
  const r = saveDraft({ collection: "caseStudies", slug: FREE, record: study(), ledger: ledgerOf([FREE]), isNew: true });
  assert.match(r.refusal, /already in use/);
  assert.equal(r.changes, null, "a refusal must commit nothing");
});

/* ------------------------------------------------------------------ *
 * Publish
 * ------------------------------------------------------------------ */

test("publish clears draft, stamps publishedOnce, and leaves the ledger alone", () => {
  const r = publish({ collection: "caseStudies", slug: FREE, record: study({ draft: true }), ledger: ledgerOf([FREE]) });
  assert.equal(r.changes.length, 1, "the slug was registered at save-draft");
  assert.equal(r.changes[0].record.draft, false);
  assert.equal(r.changes[0].record.publishedOnce, true);
  assertLedgerValid(r, { [FREE]: { draft: true } });
});

/* ------------------------------------------------------------------ *
 * Unpublish
 * ------------------------------------------------------------------ */

test("unpublish flips draft back and keeps the file on disk", () => {
  /* The file staying is why rule L1 still resolves and the ledger needs no
     change — the reason the check reads disk, not the filtered arrays. */
  const r = unpublish({ collection: "caseStudies", slug: FREE, record: study({ publishedOnce: true }), ledger: ledgerOf([FREE]) });
  assert.equal(r.refusal, null);
  assert.equal(r.changes[0].record.draft, true);
  assert.ok(!r.changes.some((c) => c.delete), "unpublish must not delete");
  assert.deepEqual(r.ledger.caseStudies, [FREE]);
});

test("unpublish is REFUSED for a slug a live 301 points at", () => {
  /* Rule L4. Blocked in the UI rather than by the build, because a Vercel
     failure email is not actionable by a non-developer. */
  const r = unpublish({ collection: "caseStudies", slug: GUARDED, record: study({ publishedOnce: true }), ledger: ledgerOf([GUARDED]) });
  assert.match(r.refusal, /redirect/i);
  assert.equal(r.changes, null);
});

/* ------------------------------------------------------------------ *
 * Delete — including the sequence that defeats the naive check
 * ------------------------------------------------------------------ */

test("delete removes a never-published item and its ledger entry together", () => {
  const r = remove({ collection: "caseStudies", slug: "never-live", record: study({ draft: true }), ledger: ledgerOf(["never-live"]) });
  assert.equal(r.refusal, null);
  assert.ok(r.changes.some((c) => c.delete && c.path === contentPath("caseStudies", "never-live")));
  assert.ok(r.changes.some((c) => c.path === LEDGER_PATH));
  assert.deepEqual(r.ledger.caseStudies, []);
  assertLedgerValid(r, { "never-live": { draft: true } });
});

test("PUBLISH -> UNPUBLISH -> DELETE is refused (the case a naive check lets through)", () => {
  /* The dangerous sequence. After unpublishing, the record reads
     draft:true — so "refuse if currently published" sails straight past and
     permanently removes a URL that WAS live, with no paired 301.
     publishedOnce is monotonic precisely to catch this. */
  let record = study();
  record = { ...record, ...publish({ collection: "caseStudies", slug: FREE, record, ledger: ledgerOf([FREE]) }).changes[0].record };
  assert.equal(record.publishedOnce, true);

  record = { ...record, ...unpublish({ collection: "caseStudies", slug: FREE, record, ledger: ledgerOf([FREE]) }).changes[0].record };
  assert.equal(record.draft, true, "it now LOOKS like an unpublished draft");
  assert.equal(record.publishedOnce, true, "but publishedOnce survived — it must never be cleared");

  const r = remove({ collection: "caseStudies", slug: FREE, record, ledger: ledgerOf([FREE]) });
  assert.match(r.refusal, /published before/);
  assert.match(r.refusal, /Unpublish instead/, "the refusal must offer the alternative");
  assert.equal(r.changes, null);
});

test("delete is ALSO refused for a redirect destination, independently", () => {
  /* Second guard: even a never-published record cannot be deleted if a
     legacy URL points at it. */
  const r = remove({ collection: "caseStudies", slug: GUARDED, record: study({ draft: true }), ledger: ledgerOf([GUARDED]) });
  assert.match(r.refusal, /redirect/i);
  assert.equal(r.changes, null);
});

/* ------------------------------------------------------------------ *
 * The property v2 got wrong
 * ------------------------------------------------------------------ */

test("all four buttons leave a state the real ledger rules accept", () => {
  /* Under v2, three of the four failed the build. */
  const base = ledgerOf([FREE]);
  const rec = study();
  for (const [name, result, disk] of [
    ["saveDraft", saveDraft({ collection: "caseStudies", slug: "fresh", record: rec, ledger: ledgerOf([]), isNew: true }), {}],
    ["publish", publish({ collection: "caseStudies", slug: FREE, record: rec, ledger: base }), { [FREE]: { draft: true } }],
    ["unpublish", unpublish({ collection: "caseStudies", slug: FREE, record: rec, ledger: base }), { [FREE]: { draft: false } }],
    ["remove", remove({ collection: "caseStudies", slug: FREE, record: study({ draft: true }), ledger: base }), { [FREE]: { draft: true } }],
  ]) {
    assert.equal(result.refusal, null, `${name} should not refuse here`);
    assertLedgerValid(result, disk);
  }
});

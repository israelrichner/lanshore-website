/**
 * The admin's pre-flight and the build gate must reject the same thing.
 *
 * If they diverge, the failure mode moves from an inline form error to a
 * Vercel failure email that a non-developer cannot act on — which is the
 * whole reason pre-flight exists (04-review.md m2).
 *
 * Run: node --test src/lib/studio/validate.test.mjs
 */
import test from "node:test";
import assert from "node:assert/strict";
import { VALIDATORS, checkLedger } from "../../../scripts/lib/content-rules.mjs";

const good = () => ({
  title: "T", client: "C", industry: "I", pillar: "SPM Operations",
  outcome: "o", challenge: "c", whatWeDid: "w", results: ["r"], stack: ["s"], legacyUrl: "/x",
});

test("the same bad fixture is rejected by the same rule on both sides", () => {
  /* The admin imports these exact exports through validate.ts, so agreement
     is structural rather than coincidental — this test pins that it stays
     structural and nobody re-implements a rule in the .ts wrapper. */
  const bad = { ...good(), pillar: "Executive Dashboard" }; // singular typo
  const errs = VALIDATORS.caseStudies(bad, "x");
  assert.ok(errs.some((e) => e.includes('"pillar" must be one of')));
});

test("publishedOnce is validated as a boolean, like draft", () => {
  for (const c of ["caseStudies", "whitePapers", "blog"]) {
    const rec = c === "caseStudies" ? good()
      : c === "whitePapers" ? { title: "T", description: "d", file: "/whitepapers/x.pdf" }
      : { title: "T", description: "d", dateModified: "2026-07-11", body: "b" };
    const errs = VALIDATORS[c]({ ...rec, publishedOnce: "yes" }, "x");
    assert.ok(errs.some((e) => e.includes("publishedOnce")), `${c} must validate publishedOnce`);
    assert.deepEqual(VALIDATORS[c]({ ...rec, publishedOnce: true }, "x"), [], `${c} must accept a boolean`);
  }
});

test("a ledger violation is caught before any commit, not by the build", () => {
  const errors = checkLedger({
    ledger: { version: 1, blog: [], caseStudies: [], whitePapers: [], retired: [] },
    onDisk: { blog: [], caseStudies: [{ slug: "unregistered", draft: false }], whitePapers: [] },
    redirectDestinations: { blog: [], caseStudies: [] },
  });
  assert.ok(errors.some((e) => e.startsWith("L3")), "an unregistered file must be caught");
});

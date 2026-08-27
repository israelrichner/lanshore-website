/**
 * The generated destination list must still agree with next.config.ts.
 *
 * If it drifts, ledger rule L4 silently stops protecting whichever URLs fell
 * out — an editor could then unpublish an item a live 301 points at, turning
 * that redirect into a 301-to-404 with nothing catching it.
 *
 * Run: node --experimental-strip-types --test scripts/lib/redirect-destinations.test.mjs
 */
import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  BLOG_REDIRECT_DESTINATIONS,
  CASE_STUDY_REDIRECT_DESTINATIONS,
  isRedirectDestination,
} from "./redirect-destinations.mjs";
import { destinationsFor } from "../gen-redirect-destinations.mjs";

const ROOT = path.resolve(import.meta.dirname, "../..");
const { default: cfg } = await import(pathToFileURL(path.join(ROOT, "next.config.ts")).href);
const rules = await cfg.redirects();

test("the generated list still matches next.config.ts", () => {
  assert.deepEqual(BLOG_REDIRECT_DESTINATIONS, destinationsFor("/blog/", rules),
    "blog destinations drifted — run scripts/gen-redirect-destinations.mjs");
  assert.deepEqual(CASE_STUDY_REDIRECT_DESTINATIONS, destinationsFor("/case-studies/", rules),
    "case-study destinations drifted — run scripts/gen-redirect-destinations.mjs");
});

test("the counts are the ones the plan expects", () => {
  assert.equal(BLOG_REDIRECT_DESTINATIONS.length, 5);
  assert.equal(CASE_STUDY_REDIRECT_DESTINATIONS.length, 13);
});

test("isRedirectDestination answers for both collections and neither over-matches", () => {
  assert.equal(isRedirectDestination("caseStudies", "commission-architecture-redesign"), true);
  /* The one study with no legacy URL — 14 studies, 13 destinations. */
  assert.equal(isRedirectDestination("caseStudies", "oilfield-invoicing-automation"), false);
  assert.equal(isRedirectDestination("blog", "elevating-sales-performance-the-power-of-agentic-ai-in-spm"), true);
  assert.equal(isRedirectDestination("whitePapers", "death-of-commissions"), false, "white papers have no redirects");
  assert.equal(isRedirectDestination("nonsense", "x"), false);
});

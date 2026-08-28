/**
 * Regenerate scripts/lib/redirect-destinations.mjs from next.config.ts.
 *
 *   node --experimental-strip-types scripts/gen-redirect-destinations.mjs
 *
 * Run this after adding or removing a redirect whose destination is a blog
 * post or case study. redirect-destinations.test.mjs fails if you forget.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "..");
const { default: cfg } = await import(pathToFileURL(path.join(ROOT, "next.config.ts")).href);
const rules = await cfg.redirects();

/** Concrete destination slugs only — wildcard and :param targets are not
    content the ledger can be asked to guarantee. */
export function destinationsFor(prefix, redirectRules) {
  return [
    ...new Set(
      redirectRules
        .map((r) => r.destination)
        .filter((d) => typeof d === "string" && d.startsWith(prefix))
        .map((d) => d.slice(prefix.length))
        .filter((s) => s && !s.includes("/") && !s.includes(":"))
    ),
  ].sort();
}

const blog = destinationsFor("/blog/", rules);
const caseStudies = destinationsFor("/case-studies/", rules);

const out = `/**
 * Concrete slugs that a live 301 in next.config.ts redirects to.
 *
 * GENERATED — do not hand-edit. Regenerate with:
 *   node --experimental-strip-types scripts/gen-redirect-destinations.mjs
 *
 * Why generated rather than importing next.config.ts directly: the request
 * path needs this list (ledger rule L4 refuses to unpublish or delete a slug
 * a live redirect points at), and importing next.config.ts from a route
 * handler would pull its ~200-entry redirect map into the serverless bundle
 * and rely on an undocumented contract that application code can import the
 * framework config at all.
 *
 * redirect-destinations.test.mjs asserts this file still agrees with
 * next.config.ts, so drift fails the build rather than silently disarming L4
 * for whichever URLs stopped being listed.
 */

/** ${blog.length} blog slugs reachable through a legacy root-level URL. */
export const BLOG_REDIRECT_DESTINATIONS = ${JSON.stringify(blog, null, 2)};

/** ${caseStudies.length} case-study slugs reachable through a legacy /case_studies/ URL. */
export const CASE_STUDY_REDIRECT_DESTINATIONS = ${JSON.stringify(caseStudies, null, 2)};

/** Shape checkLedger() expects for its redirectDestinations argument. */
export const REDIRECT_DESTINATIONS = {
  blog: BLOG_REDIRECT_DESTINATIONS,
  caseStudies: CASE_STUDY_REDIRECT_DESTINATIONS,
};

/** True when unpublishing or deleting this slug would 301 to a 404. */
export function isRedirectDestination(collection, slug) {
  return (REDIRECT_DESTINATIONS[collection] ?? []).includes(slug);
}
`;

fs.writeFileSync(path.join(ROOT, "scripts/lib/redirect-destinations.mjs"), out);
console.log(`regenerated: ${blog.length} blog, ${caseStudies.length} case-study destinations`);

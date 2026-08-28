/**
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

/** 5 blog slugs reachable through a legacy root-level URL. */
export const BLOG_REDIRECT_DESTINATIONS = [
  "beyond-dashboards-selecting-an-spm-system-in-the-age-of-agentic-ai",
  "elevating-sales-performance-the-power-of-agentic-ai-in-spm",
  "sales-performance-management-build-vs-buy-in-the-agentic-ai-era",
  "territory-white-space-in-sales-performance-management-what-it-is-why-it-matters-and-how-to-fix-it",
  "the-agent-advantage-how-ai-powered-agents-are-transforming-dispute-management-across-hr-finance-crm-and-sales-performance-management"
];

/** 13 case-study slugs reachable through a legacy /case_studies/ URL. */
export const CASE_STUDY_REDIRECT_DESTINATIONS = [
  "commission-architecture-redesign",
  "crm-financial-systems-commission-link",
  "flexible-spm-for-changing-business",
  "managed-services-commission-management",
  "rpa-banking-sba-loans",
  "rpa-government-reports",
  "rpa-healthcare-provider",
  "rpa-manufacturing-plants",
  "rpa-retail-order-processing",
  "rpa-sales-territory-tracking",
  "rpa-university-enrollments",
  "spm-build-on-existing-systems",
  "spreadsheet-to-spm-platform"
];

/** Shape checkLedger() expects for its redirectDestinations argument. */
export const REDIRECT_DESTINATIONS = {
  blog: BLOG_REDIRECT_DESTINATIONS,
  caseStudies: CASE_STUDY_REDIRECT_DESTINATIONS,
};

/** True when unpublishing or deleting this slug would 301 to a 404. */
export function isRedirectDestination(collection, slug) {
  return (REDIRECT_DESTINATIONS[collection] ?? []).includes(slug);
}

import type { Solution } from "./types";
import { SPM_PLATFORMS } from "../spmPlatforms";
import { CASE_STUDIES } from "../caseStudies";
import { findInRecord } from "../../../scripts/lib/house-style.mjs";

import spmConsulting from "./spm-consulting";
import enterpriseCrmErpIntegration from "./enterprise-crm-erp-integration";
import spmManagedServices from "./spm-managed-services";
import globalCompliance from "./global-compliance";
import midMarketImplementation from "./mid-market-implementation";
import revenueTeams from "./revenue-teams";
import aiAgentsSalesOperations from "./ai-agents-sales-operations";
import aiCommissionAutomation from "./ai-commission-automation";

export type { Solution } from "./types";

/* Display and sitemap order: HubSpot priority, then opportunity score. */
export const SOLUTIONS: Solution[] = [
  spmConsulting,
  enterpriseCrmErpIntegration,
  spmManagedServices,
  globalCompliance,
  midMarketImplementation,
  revenueTeams,
  aiAgentsSalesOperations,
  aiCommissionAutomation,
];

/* Fail the build, not the page, on anything that would publish wrong. Same
   line of defence whitePapers.ts puts in front of its PDF paths. */
const platformSlugs = new Set(SPM_PLATFORMS.map((p) => p.slug));
const caseStudySlugs = new Set(CASE_STUDIES.map((c) => c.slug));
const seen = new Set<string>();
for (const s of SOLUTIONS) {
  const where = `solutions/${s.slug}`;
  if (seen.has(s.slug)) throw new Error(`${where}: duplicate slug`);
  seen.add(s.slug);
  for (const p of s.platforms) {
    if (!platformSlugs.has(p)) throw new Error(`${where}: unknown platform "${p}" (not in SPM_PLATFORMS)`);
  }
  for (const c of s.relatedCaseStudies) {
    if (!caseStudySlugs.has(c)) throw new Error(`${where}: unknown case study "${c}"`);
  }
  const text = JSON.stringify(s);
  if (/gartner/i.test(text)) {
    throw new Error(`${where}: mentions Gartner. /solutions has no trademark footnote wiring; remove it.`);
  }
  if (text.includes("STUB")) throw new Error(`${where}: still contains STUB placeholder text`);
  const dashes = findInRecord(s);
  if (dashes.length) throw new Error(`${where}: em dash in ${dashes.join(", ")} (house style)`);
  if (s.faq.length < 4) throw new Error(`${where}: needs at least 4 FAQ entries`);
}

export function getSolution(slug: string): Solution | undefined {
  return SOLUTIONS.find((s) => s.slug === slug);
}

/* Case studies, sourced from content/case-studies/*.json.
   Migrated from lanshore.com. Legacy case studies that predate the agentic
   positioning are tagged under the Services layer per the site spec. */

import { loadCaseStudies } from "./content/loadContent";

export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  pillar: "Executive Dashboards" | "SPM Operations" | "Custom Apps" | "Services";
  outcome: string;
  challenge: string;
  whatWeDid: string;
  results: string[];
  stack: string[];
  legacyUrl: string;
  /* Optional per-study content date. Historically every study shared
     UPDATED.caseStudies; callers still fall back to it when this is absent,
     so a study only carries its own date once it actually diverges. */
  dateModified?: string;
};

export const CASE_STUDIES: CaseStudy[] = loadCaseStudies();

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((cs) => cs.slug === slug);
}

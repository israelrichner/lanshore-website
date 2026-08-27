/**
 * Gated white-paper registry, sourced from content/white-papers/*.json.
 * Each entry maps a public PDF under `/public/whitepapers/` to a HubSpot
 * contact-property option value.
 *
 * `file` must be a same-origin path: `/whitepapers/<name>.pdf` (no `..`,
 * no protocol-relative or absolute URLs).
 *
 * HubSpot: dropdown contact property `whitepaper_requested` must include
 * an option whose internal value matches each `hubspotValue` below.
 */

import { loadWhitePapers } from "./content/loadContent";

export type WhitePaper = {
  slug: string;
  title: string;
  description: string;
  /** Public path, e.g. `/whitepapers/spm-selection.pdf` */
  file: string;
  /** Value of the HubSpot `whitepaper_requested` property option */
  hubspotValue: string;
};

/** Same-origin white-paper PDF under /whitepapers/ only (slug-style names). */
const WHITEPAPER_FILE_RE = /^\/whitepapers\/[a-z0-9][a-z0-9-]*\.pdf$/;

function assertWhitePaperFile(file: string, slug: string): void {
  if (!WHITEPAPER_FILE_RE.test(file)) {
    throw new Error(
      `Invalid white paper file for "${slug}": expected /whitepapers/<slug>.pdf, got "${file}"`
    );
  }
}

export const WHITE_PAPERS: WhitePaper[] = loadWhitePapers();

/* Kept deliberately, even though content-rules.mjs enforces the same rule
   when each file is read. This is the last line of defence closest to the
   thing that matters: `file` is handed to the browser as a download URL by
   src/app/api/whitepaper/route.ts, so a bad value here is a same-origin
   escape, not a cosmetic bug. Throwing at module load fails the build. */
for (const paper of WHITE_PAPERS) {
  assertWhitePaperFile(paper.file, paper.slug);
  if (paper.file !== `/whitepapers/${paper.slug}.pdf`) {
    throw new Error(
      `White paper "${paper.slug}": file path should be /whitepapers/${paper.slug}.pdf`
    );
  }
}

export function getWhitePaper(slug: string): WhitePaper | undefined {
  return WHITE_PAPERS.find((p) => p.slug === slug);
}

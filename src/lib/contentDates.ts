/**
 * Last-modified dates for sitemap <lastmod> and Article `dateModified`.
 *
 * Seeded from real git history — each value is the date that route's *content*
 * last actually changed, not the date its markup or styling was touched.
 *
 * This matters: Google only honors <lastmod> when a site reports it
 * accurately, and a sitemap that stamps every URL with the build date is
 * treated as noise and ignored. So when you change a page's substance, bump
 * its entry here. When you restyle it, don't.
 *
 * Blog posts are the exception — they carry a per-post `dateModified` in
 * lib/blog.ts, because freshness is read per article, not per section.
 *
 * The three index pages (/blog, /case-studies, /resources) are NOT listed
 * here as content dates: sitemap.ts derives them from the collections they
 * list. `resources` survives as the floor for that derivation.
 */
export const UPDATED = {
  home: "2026-07-13",

  pillars: "2026-07-13",
  spm: "2026-07-13",
  services: "2026-07-13",
  automation: "2026-07-11",

  caseStudies: "2026-07-08",
  industries: "2026-07-08",
  glossary: "2026-07-13",
  resources: "2026-07-15",

  about: "2026-07-13",
  whyLanshore: "2026-07-09",
  partners: "2026-07-13",
  careers: "2026-07-14",
  contact: "2026-07-14",
  privacy: "2026-07-14",
} as const;


/* Render a YYYY-MM-DD content date for display. Forced to UTC: the bare date
   parses as UTC midnight, so formatting it in a negative-offset local zone
   (e.g. the Houston team's own browsers) would render the previous day. */
export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

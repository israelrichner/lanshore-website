import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { UPDATED } from "@/lib/contentDates";
import { PILLARS } from "@/lib/pillars";
import { CASE_STUDIES } from "@/lib/caseStudies";
import { INDUSTRIES } from "@/lib/industries";
import { BLOG_POSTS } from "@/lib/blog";
import { SPM_PLATFORMS } from "@/lib/spmPlatforms";

/* Every entry carries a real <lastmod> — the date that page's content actually
   changed (see lib/contentDates.ts). Deliberately NOT the build date: Google
   only honors lastmod from sites that report it accurately, and a sitemap that
   restamps every URL on every deploy gets the signal discarded wholesale. */
type Entry = { path: string; lastModified: string };

/* Index pages are stamped from the content they list, not from a
   hand-maintained registry entry. Otherwise publishing a post changes what
   /blog shows while its <lastmod> stays frozen — the inverse of the failure
   this file's header warns about, and just as corrosive.

   /resources keeps its manual date as a FLOOR: the page also carries press
   and glossary content that the collections know nothing about, so the
   registry value can legitimately be newer than any post. */
const BLOG_INDEX_LASTMOD = BLOG_POSTS.reduce(
  (max, p) => (p.dateModified > max ? p.dateModified : max),
  ""
);
const CASE_STUDIES_LASTMOD = CASE_STUDIES.reduce(
  (max, cs) => {
    const d = cs.dateModified ?? UPDATED.caseStudies;
    return d > max ? d : max;
  },
  UPDATED.caseStudies as string
);
const RESOURCES_LASTMOD =
  BLOG_INDEX_LASTMOD > UPDATED.resources ? BLOG_INDEX_LASTMOD : UPDATED.resources;

const staticEntries: Entry[] = [
  { path: "", lastModified: UPDATED.home },
  { path: "/agentic-spm/executive-dashboards/demo", lastModified: UPDATED.pillars },
  { path: "/agentic-spm/operations/demo", lastModified: UPDATED.pillars },
  { path: "/agentic-spm/custom-apps/demo", lastModified: UPDATED.pillars },
  { path: "/spm", lastModified: UPDATED.spm },
  { path: "/spm/compare", lastModified: UPDATED.spm },
  { path: "/services", lastModified: UPDATED.services },
  { path: "/services/automation", lastModified: UPDATED.automation },
  { path: "/case-studies", lastModified: CASE_STUDIES_LASTMOD },
  { path: "/industries", lastModified: UPDATED.industries },
  { path: "/blog", lastModified: BLOG_INDEX_LASTMOD },
  { path: "/resources", lastModified: RESOURCES_LASTMOD },
  { path: "/resources/glossary", lastModified: UPDATED.glossary },
  { path: "/about", lastModified: UPDATED.about },
  { path: "/about/why-lanshore", lastModified: UPDATED.whyLanshore },
  { path: "/about/partners", lastModified: UPDATED.partners },
  { path: "/about/careers", lastModified: UPDATED.careers },
  { path: "/contact", lastModified: UPDATED.contact },
  { path: "/privacy", lastModified: UPDATED.privacy },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: Entry[] = [
    ...staticEntries,
    ...PILLARS.map((p) => ({ path: p.path, lastModified: UPDATED.pillars })),
    ...SPM_PLATFORMS.map((p) => ({
      path: `/spm/${p.slug}`,
      lastModified: UPDATED.spm,
    })),
    ...CASE_STUDIES.map((cs) => ({
      path: `/case-studies/${cs.slug}`,
      lastModified: cs.dateModified ?? UPDATED.caseStudies,
    })),
    ...INDUSTRIES.map((i) => ({
      path: `/industries/${i.slug}`,
      lastModified: UPDATED.industries,
    })),
    /* Posts carry their own date — freshness is read per article. */
    ...BLOG_POSTS.map((post) => ({
      path: `/blog/${post.slug}`,
      lastModified: post.dateModified,
    })),
  ];

  return entries.map(({ path, lastModified }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority:
      path === ""
        ? 1
        : path.startsWith("/agentic-spm") || path.startsWith("/spm")
          ? 0.9
          : 0.7,
  }));
}

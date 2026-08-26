import type { NextConfig } from "next";

/* Full redirect map built from a crawl of lanshore.com's sitemap index
   (2026-07-05, ~200 URLs). Everything 301s directly to its new home — no
   chains. Order matters: specific rules must precede wildcards. */

const CASE_STUDY_REDIRECTS: { legacy: string; slug: string }[] = [
  {
    legacy:
      "/case_studies/rpa-university-graduate-enrollments-follow-up-means-more-students-successfully-reach-their-goals",
    slug: "rpa-university-enrollments",
  },
  {
    legacy:
      "/case_studies/rpa-automation-of-processes-software-company-increases-sales-and-territory-tracking-to-enhance-customer-satisfaction",
    slug: "rpa-sales-territory-tracking",
  },
  {
    legacy:
      "/case_studies/rpa-automating-manufacturing-plants-to-make-them-more-competitive-in-all-markets",
    slug: "rpa-manufacturing-plants",
  },
  {
    legacy:
      "/case_studies/rpa-automation-of-reports-governmental-answer-to-serving-constituents-more-efficiently-while-raising-job-satisfaction-of-multiple-employees",
    slug: "rpa-government-reports",
  },
  {
    legacy:
      "/case_studies/rpa-enhancing-productivity-in-retail-using-rpa-to-eliminate-backlogs-and-get-orders-to-customers",
    slug: "rpa-banking-sba-loans",
  },
  {
    legacy:
      "/case_studies/rpa-enhancing-productivity-in-retail-using-rpa-to-eliminate-backlogs-and-get-orders-to-customers-in-retail",
    slug: "rpa-retail-order-processing",
  },
  {
    legacy: "/case_studies/customized-rpa-solutions-for-healthcare",
    slug: "rpa-healthcare-provider",
  },
  {
    legacy:
      "/case_studies/sales-compensation-when-the-pressure-gets-too-much-for-a-manual-spreadsheet",
    slug: "spreadsheet-to-spm-platform",
  },
  {
    legacy:
      "/case_studies/sales-performance-management-a-smart-way-to-build-on-existing-systems-to-keep-pace-with-business-growth",
    slug: "spm-build-on-existing-systems",
  },
  {
    legacy: "/case_studies/linking-sales-commission-data-between-financial-systems-and-crm",
    slug: "crm-financial-systems-commission-link",
  },
  {
    legacy:
      "/case_studies/technology-reacting-to-changing-business-needs-for-variable-compensation",
    slug: "flexible-spm-for-changing-business",
  },
  {
    legacy: "/case_studies/tackling-resource-challenges-with-expert-advice-and-managed-services",
    slug: "managed-services-commission-management",
  },
  {
    legacy: "/case_studies/architecture-redesign-to-fix-a-broken-compensation-process",
    slug: "commission-architecture-redesign",
  },
];

/* Root-level blog posts that were migrated onto this site. */
const MIGRATED_POSTS = [
  "elevating-sales-performance-the-power-of-agentic-ai-in-spm",
  "sales-performance-management-build-vs-buy-in-the-agentic-ai-era",
  "beyond-dashboards-selecting-an-spm-system-in-the-age-of-agentic-ai",
  "territory-white-space-in-sales-performance-management-what-it-is-why-it-matters-and-how-to-fix-it",
  "the-agent-advantage-how-ai-powered-agents-are-transforming-dispute-management-across-hr-finance-crm-and-sales-performance-management",
];

/* Simple one-to-one moves, grouped by destination. */
const SIMPLE_REDIRECTS: Record<string, string[]> = {
  "/": [
    "/home",
    "/new-page-2",
    "/elementor-1265",
    "/__trashed-2",
    "/contact-page-test",
    "/health-check",
    "/dir-ai",
    "/agentic-spm-by-lanshore",
    "/spm-agentic",
  ],
  "/about": ["/about-us", "/about/lanshore-cares"],
  "/contact": ["/about/contact", "/free-automation-assessment-from-lanshore"],
  "/about/careers": ["/careers"],
  "/about/why-lanshore": ["/what-we-do/why-lanshore"],
  "/industries": ["/about/markets-served", "/industries-2"],
  "/industries/telecom": ["/industries/telecommunications"],
  "/industries/healthcare": ["/industries/healthcare/revenue-cycle-management"],
  "/blog": [
    "/knowledge-center",
    "/videos",
    "/did-you-say-managed-services-what-is-the-point-of-a-managed-service",
    "/empowering-intelligent-automation-through-nearshore-operations",
    "/introduction-an-overview-of-automation-technology",
    "/maximising-efficiency-the-power-of-managed-service-in-automation-technology",
  ],
  "/services": [
    "/agentic-pmo-by-lanshore",
    "/agentic-ai-rpa-roadmap-and-business-case",
    "/solutions",
    "/solutions/pmo",
    "/development-services",
    "/full-stack-development",
    "/high-tech-consulting",
    "/rpa-consulting",
    "/rpa-healthcare",
    "/rpa-services",
    "/sap-4-hana-migration-services",
    "/spm-development-services",
    "/staff-augmentation",
    "/transformation-services",
    "/vendor-assessment-services",
    "/crm",
  ],
  "/about/partners": [
    "/asug",
    "/automation-anywhere",
    "/beqom",
    "/forma-ai",
    "/microsoft-power-platform",
    "/openai",
    "/sap",
    "/sap-erp",
    "/uipath-lanshore",
    "/uipathvpat",
  ],
  /* Old vendor pages → dedicated /spm platform pages (or the /spm index for
     legacy partners without a dedicated page). */
  "/spm/varicent": ["/varicent", "/vaicent-icm"],
  "/spm/xactly": ["/xactly-incent"],
  "/spm/captivateiq": ["/captivate-iq"],
  "/spm/sap-incentive-management": ["/sap-commissions", "/sap-callidus"],
  "/spm/anaplan": ["/anaplan"],
  "/spm/salesforce-spiff": ["/spiff"],
  "/spm/performio": ["/performio"],
  "/spm/akeron": ["/akeron"],
  /* /spm/everstage is a retired page from this site (replaced by /spm/akeron,
     a different vendor — so it points at the index, not the new page). */
  "/spm": ["/iconixx", "/incentivate", "/spm/everstage"],
  /* Old automation/RPA pages → the automation & integration services page. */
  "/services/automation": [
    "/uipath",
    "/microsoft-power-automate",
    "/rpa-implementation-services",
    "/rpa-support-services",
  ],
  "/case-studies": ["/resources/case-studies"],
  "/resources#white-papers": [
    "/resources/white-papers-overview",
    "/white-paper-li-download",
  ],
  "/resources#events-press": ["/resources/press-releases"],
  "/privacy": [
    "/privacy-policy",
    "/terms-conditions",
    "/lanshore-international-services-terms-and-conditions",
  ],
};

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "img.youtube.com" }],
  },
  /* Pages read content/ at build time, so they need nothing at runtime. The
     white-paper download route is the exception: it is a POST handler that
     runs in a serverless function and imports the registry at module scope.
     @vercel/nft cannot trace a directory read through fs at runtime, so
     without this the build stays green and every gated download 500s in
     production on the first request. Local `next start` reads the real
     filesystem and passes either way — this can only be proven on a
     deployed preview. */
  outputFileTracingIncludes: {
    "/api/whitepaper": ["./content/white-papers/**", "./content/SLUGS.lock.json"],
  },
  async redirects() {
    return [
      // Migrated blog posts: old root-level slug → /blog/<slug>
      ...MIGRATED_POSTS.map((slug) => ({
        source: `/${slug}`,
        destination: `/blog/${slug}`,
        permanent: true,
      })),
      // Case studies: /case_studies/<legacy> → /case-studies/<slug>
      ...CASE_STUDY_REDIRECTS.map(({ legacy, slug }) => ({
        source: legacy,
        destination: `/case-studies/${slug}`,
        permanent: true,
      })),
      // One-to-one moves
      ...Object.entries(SIMPLE_REDIRECTS).flatMap(([destination, sources]) =>
        sources.map((source) => ({ source, destination, permanent: true }))
      ),
      // Content-type wildcards (after the specific rules above)
      { source: "/knowledge_articles/:path*", destination: "/blog", permanent: true },
      { source: "/category/:path*", destination: "/blog", permanent: true },
      { source: "/tag/:path*", destination: "/blog", permanent: true },
      { source: "/author/:path*", destination: "/blog", permanent: true },
      { source: "/video/:path*", destination: "/blog", permanent: true },
      { source: "/roles/:path*", destination: "/about/careers", permanent: true },
      { source: "/what-we-do/:path*", destination: "/services", permanent: true },
      { source: "/what-we-do", destination: "/services", permanent: true },
      { source: "/events/:path*", destination: "/resources#events-press", permanent: true },
      {
        source: "/event_category/:path*",
        destination: "/resources#events-press",
        permanent: true,
      },
      {
        source: "/press_releases/:path*",
        destination: "/resources#events-press",
        permanent: true,
      },
      {
        source: "/white_papers/:path*",
        destination: "/resources#white-papers",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

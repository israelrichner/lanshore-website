import type { Metadata } from "next";

export const SITE_URL = "https://lanshore.com";
export const SITE_NAME = "Lanshore";
export const ENTITY = "AI Assisted SPM by Lanshore";

/* Used by app/not-found.tsx and by every [slug] route's generateMetadata
   fallback. A notFound() thrown from a page keeps that page's metadata, so
   without the fallback an unknown slug would show the root layout's title. */
export const NOT_FOUND_METADATA = { title: "Page Not Found | Lanshore" } satisfies Metadata;

export const CONTACT = {
  email: "sales@lanshore.com",
  phone: "408-899-0140",
  address: "1795 N Fry Rd Suite 289, Katy, TX 77449, USA",
  linkedin: "https://www.linkedin.com/company/lanshore-llc",
};

/* Gartner 2019 citation (research note G00380338) — canonical citation object.
   The `claims` sentences are the ONLY approved wording; pages must render them
   verbatim so the claim never drifts. No reprint license, so: never reproduce
   the report's tables, never link/host the PDF, never name the other vendors
   it lists, and never say "recognized/recommended/endorsed by" — safe verbs
   are "named in / listed in / included in". Only the Xactly and SAP platform
   pages may carry the claim (the note listed Lanshore against those vendors).
   Every page that mentions Gartner must show the `disclaimer` as footer fine
   print — data-driven pages are computed in Footer.tsx (GARTNER_PATHS); add
   any new page that hardcodes a claim to that list. */
export const GARTNER_2019 = {
  publisher: "Gartner",
  title:
    "Include Implementation Partners to Successfully Deploy Sales Performance Management Solutions",
  analysts: ["Melissa Hilbert", "Patrick Sullivan"],
  published: "2019-03-18",
  docId: "G00380338",
  claims: {
    short:
      "Lanshore was named in Gartner® research on selecting SPM implementation partners (G00380338, March 2019).",
    standard:
      "Lanshore was named as a sample third-party SPM implementation provider in the Gartner® research note “Include Implementation Partners to Successfully Deploy Sales Performance Management Solutions” (Melissa Hilbert, Patrick Sullivan, 18 March 2019, G00380338).",
    heritage:
      "As far back as 2019, Gartner® research on SPM implementation partners noted Lanshore’s work expanding client toolsets beyond SPM into business intelligence, data lakes, and robotic process automation, the foundation of what is now AI Assisted SPM by Lanshore.",
  },
  disclaimer:
    "GARTNER is a registered trademark and service mark of Gartner, Inc. and/or its affiliates in the U.S. and internationally and is used herein with permission. All rights reserved. Gartner does not endorse any vendor, product or service depicted in its research publications, and does not advise technology users to select only those vendors with the highest ratings or other designation.",
} as const;

export const PLATFORMS = [
  "Varicent",
  "Xactly",
  "CaptivateIQ",
  "SAP SuccessFactors Incentive Management",
  "Anaplan",
  "Salesforce Spiff",
  "Performio",
  "Akeron",
  "Incentivate",
];

export type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

export const NAV: NavItem[] = [
  {
    label: "AI Assisted SPM",
    children: [
      { label: "Executive Dashboards", href: "/agentic-spm/executive-dashboards" },
      { label: "SPM Operations", href: "/agentic-spm/operations" },
      { label: "Custom Apps", href: "/agentic-spm/custom-apps" },
    ],
  },
  {
    label: "Services",
    children: [
      { label: "Services Overview", href: "/services" },
      { label: "Solutions", href: "/solutions" },
      { label: "Automation & Integration", href: "/services/automation" },
      { label: "SPM Platforms", href: "/spm" },
    ],
  },
  { label: "Case Studies", href: "/case-studies" },
  {
    label: "Resources",
    children: [
      { label: "Blog", href: "/blog" },
      { label: "Guides", href: "/resources/guides" },
      { label: "White Papers", href: "/resources#white-papers" },
      { label: "FAQ & Glossary", href: "/resources/glossary" },
      { label: "Events", href: "/resources#events-press" },
      { label: "Press", href: "/resources#events-press" },
    ],
  },
  {
    label: "About",
    children: [
      { label: "Company", href: "/about" },
      { label: "Why Lanshore", href: "/about/why-lanshore" },
      { label: "Partners", href: "/about/partners" },
      { label: "Careers", href: "/about/careers" },
    ],
  },
];


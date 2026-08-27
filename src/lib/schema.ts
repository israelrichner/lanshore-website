import { SITE_URL, GARTNER_2019 } from "./site";

export type FaqItem = { question: string; answer: string };

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": ORG_ID,
  name: "Lanshore",
  legalName: "Lanshore LLC",
  url: SITE_URL,
  logo: `${SITE_URL}/lanshore-logo.png`,
  description:
    "Lanshore is a sales performance management consultancy delivering AI Assisted SPM: AI agents, executive dashboards, and custom apps for comp operations across the US and Latin America.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1795 N Fry Rd Suite 289",
    addressLocality: "Katy",
    addressRegion: "TX",
    postalCode: "77449",
    addressCountry: "US",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+1-408-899-0140",
      email: "sales@lanshore.com",
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: "English",
    },
    {
      "@type": "ContactPoint",
      telephone: "+506-6204-3938",
      email: "infolatin@lanshore.com",
      contactType: "customer service",
      areaServed: ["CR", "MX", "CO", "CL", "PE", "AR"],
      availableLanguage: ["English", "Spanish"],
    },
  ],
  areaServed: [
    { "@type": "Country", name: "United States" },
    { "@type": "AdministrativeArea", name: "Latin America" },
  ],
  sameAs: [
    "https://www.linkedin.com/company/lanshore-llc",
    "https://www.facebook.com/lanshore1",
    "https://x.com/LanshoreLLC",
    "https://www.youtube.com/@Lanshore",
  ],
  /* Deliberately no `url`: without a reprint license we neither link the doc
     nor any unofficial PDF copy — identifier + publisher is the citation. */
  subjectOf: {
    "@type": "Article",
    name: GARTNER_2019.title,
    author: GARTNER_2019.analysts.map((name) => ({ "@type": "Person", name })),
    publisher: { "@type": "Organization", name: GARTNER_2019.publisher },
    datePublished: GARTNER_2019.published,
    identifier: GARTNER_2019.docId,
  },
  knowsAbout: [
    "Sales Performance Management",
    "Incentive Compensation Management",
    "Agentic AI",
    "Robotic Process Automation",
    "Varicent",
    "Xactly Incent",
    "CaptivateIQ",
    "SAP SuccessFactors Incentive Management",
    "Anaplan",
    "Salesforce Spiff",
    "Performio",
    "Vulki by Akeron",
    "Incentivate",
    "UiPath",
    "n8n",
    "Claude Code",
    "Microsoft Power Automate",
  ],
};

export const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: "Lanshore",
  description:
    "AI Assisted SPM by Lanshore — sales performance management expertise converged with agentic AI.",
  publisher: { "@id": ORG_ID },
};

/* US office has full address + geocoords (1795 N Fry Rd, Katy TX). */
export const localBusinessSchemas = [
  {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${SITE_URL}/#localbusiness-us`,
    name: "Lanshore — United States",
    parentOrganization: { "@id": ORG_ID },
    url: `${SITE_URL}/contact`,
    telephone: "+1-408-899-0140",
    email: "sales@lanshore.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "1795 N Fry Rd Suite 289",
      addressLocality: "Katy",
      addressRegion: "TX",
      postalCode: "77449",
      addressCountry: "US",
    },
    geo: { "@type": "GeoCoordinates", latitude: 29.8168, longitude: -95.7205 },
    /* US office NAP only — LATAM coverage lives on Organization + contactPoints. */
    areaServed: { "@type": "Country", name: "United States" },
  },
];

/* FAQPage — the questions/answers passed here MUST also be rendered visibly
   on the page; schema without visible content is treated as spam by Google. */
export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/* `offerings` describes what's sold under this service. It's an OfferCatalog
   rather than an ItemList because these are offerings, not child pages —
   several of them point at the same URL, which an ItemList would misreport as
   duplicate list entries. */
export function serviceSchema(
  pillarName: string,
  description: string,
  path: string,
  offerings?: { name: string; description: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `AI Assisted SPM by Lanshore — ${pillarName}`,
    serviceType: pillarName,
    description,
    url: `${SITE_URL}${path}`,
    provider: { "@id": ORG_ID },
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "AdministrativeArea", name: "Latin America" },
    ],
    ...(offerings && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${pillarName} — offerings`,
        itemListElement: offerings.map((offering) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: offering.name,
            description: offering.description,
          },
        })),
      },
    }),
  };
}

export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.href.startsWith("http") ? item.href : `${SITE_URL}${item.href}`,
    })),
  };
}

const BLOG_ID = `${SITE_URL}/blog#blog`;

/* Google truncates `headline` past ~110 chars and the Rich Results Test warns
   on it. Cut on a word boundary so the ellipsis doesn't land mid-word; the
   full, untruncated title still ships as `name`. */
function headline(title: string) {
  if (title.length <= 110) return title;
  const cut = title.slice(0, 109);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:—-]+$/, "")}…`;
}

/**
 * BlogPosting for a migrated post.
 *
 * Deliberately NO `datePublished`: these posts were migrated from the old
 * lanshore.com, which never displayed a publish date, and nothing in git
 * recovers one (all content landed in a single initial commit). Inventing a
 * date would feed a false freshness signal to the exact engines this schema
 * exists to inform. `dateModified` is real — it's when the post's content last
 * actually changed — so freshness is still expressed, just honestly.
 *
 * `author` is the Lanshore org, not a Person: the site names no individual
 * authors, and attributing posts to an invented byline would be worse than
 * attributing them to the company that actually published them.
 */
export function blogPostingSchema(post: {
  slug: string;
  title: string;
  description: string;
  dateModified: string;
}) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: headline(post.title),
    name: post.title,
    description: post.description,
    dateModified: post.dateModified,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@id": BLOG_ID },
    inLanguage: "en-US",
  };
}

export function blogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": BLOG_ID,
    url: `${SITE_URL}/blog`,
    name: "Lanshore Blog",
    description:
      "Practitioner writing on agentic AI, comp operations, and sales performance management.",
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
}

/* Case studies carry the site's only quantified outcome claims (`results`),
   which is exactly what answer engines lift and attribute. `about` and
   `mentions` give them the industry and platform entities to hang it on. */
export function caseStudySchema(study: {
  slug: string;
  title: string;
  client: string;
  industry: string;
  pillar: string;
  outcome: string;
  results: string[];
  stack: string[];
  dateModified: string;
}) {
  const url = `${SITE_URL}/case-studies/${study.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: headline(study.title),
    name: study.title,
    description: study.outcome,
    articleSection: "Case Study",
    dateModified: study.dateModified,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: "en-US",
    about: [
      { "@type": "Thing", name: study.industry },
      { "@type": "Thing", name: study.pillar },
    ],
    mentions: study.stack.map((name) => ({ "@type": "Thing", name })),
    /* `results` are bare fragments ("Manual override layer removed"), so they
       need punctuating — joined raw they read as one run-on sentence. */
    abstract: study.results
      .map((result) => result.replace(/[.\s]+$/, ""))
      .join(". ")
      .concat("."),
  };
}

/* ItemList on index pages so a crawler can enumerate what's underneath one
   without walking every link. */
export function itemListSchema(
  name: string,
  path: string,
  items: { name: string; href: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}${path}#itemlist`,
    name,
    url: `${SITE_URL}${path}`,
    numberOfItems: items.length,
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      url: `${SITE_URL}${item.href}`,
    })),
  };
}

export function webPageSchema(
  type: "AboutPage" | "ContactPage" | "CollectionPage",
  name: string,
  description: string,
  path: string
) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${SITE_URL}${path}#webpage`,
    name,
    description,
    url: `${SITE_URL}${path}`,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
}

/**
 * Serialize a schema object for a <script type="application/ld+json"> sink.
 * JSON.stringify alone is NOT safe inside <script>: a string containing
 * "</script>" terminates the element in the HTML parser and injects live
 * markup. The \uXXXX escapes are valid JSON, so consumers parse the exact
 * original strings.
 */
/* Implementation lives in ./jsonld-escape.mjs so `node --test` can cover it:
   this file cannot be loaded by bare Node ESM because it imports "./site"
   without a file extension. Re-exported, never duplicated. */
export { toJsonLd } from "./jsonld-escape.mjs";

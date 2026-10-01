import { SITE_URL, GARTNER_2019 } from "./site";
import { AUTHORS } from "./authors";
import {
  headline,
  authorRef,
  imageRef,
  articleDates,
  personNode,
  howToNode,
  softwareApplicationNode,
} from "./schema-nodes.mjs";

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

/**
 * HowTo for a procedure already written into a page at `path`.
 *
 * Note for whoever reads a Rich Results Test report: Google stopped showing
 * HowTo rich results in 2023, so that tool no longer evaluates this type. It
 * is still valid schema.org, other engines still read it, and
 * validator.schema.org is the tool that checks it.
 */
export function howToSchema(
  howTo: { name: string; description?: string; totalTime?: string; steps: { name: string; text: string }[] },
  path: string
) {
  return { "@context": "https://schema.org", ...howToNode(howTo, `${SITE_URL}${path}`) };
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

/**
 * `Person` node for a known byline.
 *
 * Lives here rather than in authors.ts so that ORG_ID has one definition. The
 * pure shaping is in schema-nodes.mjs, where `node --test` can reach it.
 */
export function personSchema(authorId: string) {
  return personNode(AUTHORS[authorId], SITE_URL, ORG_ID);
}

/**
 * BlogPosting for a post.
 *
 * `datePublished` is emitted only when the record carries a real one, and is
 * absent otherwise. Most of these posts were migrated from the old
 * lanshore.com, which never displayed a publish date, and nothing in git
 * recovers one (all content landed in a single initial commit). Inventing a
 * date would feed a false freshness signal to the exact engines this schema
 * exists to inform. `dateModified` is always real: it is when the post's
 * content last actually changed, so freshness is still expressed, just
 * honestly. New posts written for this site set `datePublished` and get it.
 *
 * `author` is a named `Person` when the record names one, and the Lanshore
 * Organization otherwise. The org fallback is not a degraded state: the site
 * published those posts as a company, and attributing them to an invented
 * byline would be worse than attributing them to the company that did publish
 * them.
 */
export function blogPostingSchema(post: {
  slug: string;
  title: string;
  description: string;
  dateModified: string;
  datePublished?: string;
  author?: string;
  image?: string;
}) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: headline(post.title),
    name: post.title,
    description: post.description,
    ...articleDates(post.dateModified, post.datePublished),
    image: imageRef(post.image, SITE_URL),
    author: authorRef(post.author, AUTHORS, SITE_URL, ORG_ID),
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
  datePublished?: string;
  author?: string;
  image?: string;
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
    ...articleDates(study.dateModified, study.datePublished),
    image: imageRef(study.image, SITE_URL),
    author: authorRef(study.author, AUTHORS, SITE_URL, ORG_ID),
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
   without walking every link.

   `item` is optional and additive: when an entry supplies one, the ListItem
   carries the full described thing (a SoftwareApplication, say) as well as the
   navigational name and url. Entries without it behave exactly as before. */
export function itemListSchema(
  name: string,
  path: string,
  items: { name: string; href: string; item?: Record<string, unknown> }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}${path}#itemlist`,
    name,
    url: `${SITE_URL}${path}`,
    numberOfItems: items.length,
    itemListElement: items.map((entry, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: entry.name,
      url: `${SITE_URL}${entry.href}`,
      ...(entry.item && { item: entry.item }),
    })),
  };
}

/**
 * SoftwareApplication node for a vendor on the comparison page.
 *
 * Deliberately NO `aggregateRating`, `review`, or `offers`.
 *
 * The AEO tool asked for Review/AggregateRating markup here. The page carries
 * no reviews and no ratings, and Lanshore resells none of these platforms, so
 * emitting rating markup would assert numbers that do not exist. That breaks
 * Google's rule that structured data must represent content visible on the
 * page, and on a page comparing commercial software it is an FTC endorsement
 * problem too. `offers` is omitted for the same reason: none of these vendors
 * publishes list pricing we could state accurately.
 *
 * What ships instead is the part that was actually useful: the identity of
 * each product, who makes it, what it used to be called, and what it does.
 * See docs/waivers/aeo-2026-10-review-schema.md.
 *
 * `url` is the vendor's own canonical product page, because that is what
 * identifies the product. The Lanshore page about it rides on the enclosing
 * ListItem's `url`, where it belongs as navigation.
 */
export function softwareApplicationSchema(platform: {
  slug: string;
  name: string;
  vendor: string;
  officialUrl: string;
  firstSentence: string;
  capabilities: string[];
  formerNames?: string[];
}) {
  return softwareApplicationNode(platform, SITE_URL);
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

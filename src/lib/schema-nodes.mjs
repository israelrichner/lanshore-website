/**
 * Pure JSON-LD node helpers.
 *
 * Lives in .mjs rather than in schema.ts for the same reason jsonld-escape.mjs
 * does: schema.ts cannot be loaded by `node --test`, because it imports
 * "./site" with no file extension and bare Node ESM will not resolve that.
 *
 * What lives here is the set of decisions worth testing directly, and all of
 * them are the same decision: which keys appear in the emitted object and
 * which are left out entirely. A JSON-LD node carrying `datePublished: null`
 * or `image: ""` is worse than one carrying neither, because it asserts a
 * value that is not there. Every helper below returns `{}` instead of a key
 * whose value it does not have.
 *
 * `siteUrl` and `orgId` are passed in rather than imported, which is what
 * keeps this file loadable without the TypeScript layer. schema.ts binds them
 * and re-exports; nothing here is duplicated there.
 */

import { headingId } from "./heading-id.mjs";

/* Google truncates `headline` past ~110 chars and the Rich Results Test warns
   on it. Cut on a word boundary so the ellipsis does not land mid-word; the
   full, untruncated title still ships as `name`.
   \p{Pd} is every dash (hyphen, en dash, em dash), written as a property
   class so no literal em dash sits in the source for the house-style check. */
const TRAILING_PUNCT = /[\s,;:\p{Pd}]+$/u;
const HEADLINE_MAX = 110;

export function headline(title) {
  if (title.length <= HEADLINE_MAX) return title;
  const cut = title.slice(0, HEADLINE_MAX - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(TRAILING_PUNCT, "")}…`;
}

/**
 * `{ [key]: value }` when there is a value, `{}` when there is not.
 *
 * Spread this, never assign it. The whole point is that the key is absent from
 * the emitted object rather than present and empty.
 */
export function optionalKey(key, value) {
  if (value === undefined || value === null) return {};
  if (typeof value === "string" && value.trim() === "") return {};
  if (Array.isArray(value) && value.length === 0) return {};
  return { [key]: value };
}

/**
 * A `Person` node for a known author, or null when there is no author.
 *
 * `sameAs` is how an answer engine reconciles this byline with the same human
 * elsewhere on the web, so the LinkedIn URL is folded into it rather than
 * living only in the rendered link. When the owner has not supplied one yet,
 * the key is absent and the Person node is still valid.
 */
export function personNode(author, siteUrl, orgId) {
  if (!author) return null;
  const sameAs = [...new Set([...(author.sameAs ?? []), author.linkedin].filter(Boolean))];
  return {
    "@type": "Person",
    "@id": `${siteUrl}/#person-${author.id}`,
    name: author.name,
    ...optionalKey("jobTitle", author.jobTitle),
    ...optionalKey("description", author.bio),
    ...optionalKey("sameAs", sameAs),
    worksFor: { "@id": orgId },
  };
}

/**
 * What goes in an article's `author`.
 *
 * A named Person when the record names one we know about, otherwise a
 * reference to the Lanshore Organization. The fallback is deliberate and is
 * not a degraded state: the site published these posts as a company, and
 * attributing them to an invented byline would be worse than attributing them
 * to the company that actually published them. An unknown id falls back too
 * rather than throwing, because content-rules.mjs already rejects unknown ids
 * at build time and this layer should not be the one that fails a render.
 */
export function authorRef(authorId, authors, siteUrl, orgId) {
  const node = personNode(authorId ? authors[authorId] : undefined, siteUrl, orgId);
  return node ?? { "@id": orgId };
}

/**
 * Absolute URL for an article image.
 *
 * Falls back to the site's generated OpenGraph card, which is a real,
 * permanently served 1200x630 PNG. Google wants an image on an Article and
 * wants it at least 1200px wide; the OG card satisfies both, so there is never
 * a reason to emit no image at all.
 */
export function imageRef(image, siteUrl) {
  if (!image || image.trim() === "") return `${siteUrl}/opengraph-image`;
  return image.startsWith("http") ? image : `${siteUrl}${image}`;
}

/**
 * The date pair for an article.
 *
 * `dateModified` is always real and always present. `datePublished` is emitted
 * only when a real one is on file. Most of this site's content was migrated
 * from the old lanshore.com, which never displayed a publish date, and nothing
 * in git recovers one. Inventing a date would feed a false freshness signal to
 * the exact engines this schema exists to inform.
 */
export function articleDates(dateModified, datePublished) {
  return {
    ...optionalKey("datePublished", datePublished),
    dateModified,
  };
}

/**
 * `HowTo` node for a procedure that is already written into the page.
 *
 * Every step's `url` points at the heading that carries that step, using the
 * same `headingId()` Markdown.tsx stamps onto the heading. That only resolves
 * if the step's `name` is the heading's exact text, which is what
 * check-schema-mirror.mjs enforces against the built HTML: a step that is not
 * a visible section heading is not a step, and Google treats markup that
 * describes content the reader cannot see as spam.
 *
 * Input shape is validated by validateHowTo() in content-rules.mjs before it
 * ever reaches here, so this only shapes, it does not police.
 */
export function howToNode(howTo, pageUrl) {
  return {
    "@type": "HowTo",
    name: howTo.name,
    ...optionalKey("description", howTo.description),
    ...optionalKey("totalTime", howTo.totalTime),
    step: howTo.steps.map((step, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: step.name,
      text: step.text,
      url: `${pageUrl}#${headingId(step.name)}`,
    })),
  };
}

/**
 * `SoftwareApplication` for a vendor on /spm/compare. Rationale for what is
 * left out (ratings, reviews, offers) is on softwareApplicationSchema() in
 * schema.ts and in docs/waivers/aeo-2026-10-review-schema.md.
 *
 * No `brand`: schema.org allows it on Product, Service, Organization and
 * Person, not on SoftwareApplication (a CreativeWork), and validators flag it.
 * `publisher` carries the vendor instead. No `sameAs` either: it would only
 * repeat `url`.
 */
export function softwareApplicationNode(platform, siteUrl) {
  return {
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/spm/${platform.slug}#software`,
    name: platform.name,
    ...optionalKey("alternateName", platform.formerNames),
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Sales Performance Management",
    description: platform.firstSentence,
    url: platform.officialUrl,
    publisher: { "@type": "Organization", name: platform.vendor },
    featureList: platform.capabilities,
    /* The Lanshore page that discusses this product, so a crawler that starts
       from the product node can find our coverage of it. */
    subjectOf: { "@type": "WebPage", "@id": `${siteUrl}/spm/${platform.slug}` },
  };
}

/**
 * `ItemList` whose entries are sections of one page (a listicle), each
 * linking to its heading by the same headingId() Markdown.tsx stamps on it.
 */
export function inPageItemListNode(list, pageUrl) {
  return {
    "@type": "ItemList",
    name: list.name,
    numberOfItems: list.items.length,
    itemListElement: list.items.map((name, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name,
      url: `${pageUrl}#${headingId(name)}`,
    })),
  };
}

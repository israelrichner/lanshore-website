/**
 * Structured data must describe content the reader can see.
 *
 * Google's rule for FAQPage and HowTo markup is that every marked-up question,
 * answer and step appears visibly on the same page. Markup that does not is
 * treated as spam, and it is invisible in the UI, so nobody notices it drift.
 * On this site the risk is concrete: a blog post's FAQ is written twice, once
 * as headings in the Markdown body and once in front matter for the schema,
 * and an edit to one does not touch the other.
 *
 * Every function here is PURE: it takes one page's built HTML and returns
 * error strings. The filesystem walk lives in scripts/check-schema-mirror.mjs,
 * which keeps this testable against synthetic pages.
 *
 * Rules:
 *
 *   M1  every FAQPage question appears in the page's visible text
 *   M2  every FAQPage answer appears in the page's visible text
 *   M3  every HowTo step name is the exact text of a heading on the page
 *   M4  every HowTo step text appears in the page's visible text
 *   M5  every HowTo step url's #fragment is the id of the heading that
 *       carries that step (not merely an id that exists somewhere)
 */

const LD_JSON_RE = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;

/** Every JSON-LD block on the page, parsed. A block that fails to parse is an error, not a skip. */
export function extractJsonLd(html) {
  const blocks = [];
  const errors = [];
  let m;
  LD_JSON_RE.lastIndex = 0;
  while ((m = LD_JSON_RE.exec(html)) !== null) {
    try {
      blocks.push(JSON.parse(m[1]));
    } catch (e) {
      errors.push(`unparseable JSON-LD block: ${e.message}`);
    }
  }
  return { blocks, errors };
}

/** Every node of `type`, wherever it sits: top level, inside @graph, or nested. */
export function nodesOfType(value, type, out = []) {
  if (Array.isArray(value)) {
    for (const v of value) nodesOfType(v, type, out);
  } else if (value && typeof value === "object") {
    const t = value["@type"];
    if (t === type || (Array.isArray(t) && t.includes(type))) out.push(value);
    for (const v of Object.values(value)) nodesOfType(v, type, out);
  }
  return out;
}

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "'", lsquo: "'", rdquo: '"', ldquo: '"', mdash: "—", ndash: "–", hellip: "…" };

function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code) => {
    if (code[0] === "#") {
      const n = code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : whole;
    }
    return ENTITIES[code.toLowerCase()] ?? whole;
  });
}

/**
 * Comparison form of a string. Tolerant of what typography and Markdown do to
 * text, and of nothing else: curly versus straight quotes, non-breaking
 * spaces, whitespace runs, and letter case. A changed word still fails.
 */
export function normalize(s) {
  return decodeEntities(String(s))
    .replace(/[‘’‚′]/g, "'")
    .replace(/[“”„″]/g, '"')
    .replace(/ /g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * True when `needle` occurs in `haystack` as whole words: "Yes" must not be
 * satisfied by "Yesterday". Both arguments are already normalize()d.
 */
export function containsPhrase(haystack, needle) {
  if (!needle) return false;
  const isWord = (ch) => ch !== undefined && /[\p{L}\p{N}]/u.test(ch);
  let from = 0;
  for (;;) {
    const at = haystack.indexOf(needle, from);
    if (at === -1) return false;
    const before = haystack[at - 1];
    const after = haystack[at + needle.length];
    const edgeOkStart = !isWord(needle[0]) || !isWord(before);
    const edgeOkEnd = !isWord(needle[needle.length - 1]) || !isWord(after);
    if (edgeOkStart && edgeOkEnd) return true;
    from = at + 1;
  }
}

/**
 * Plain text of a Markdown body, for the source-level mirror rule in
 * content-rules.mjs: links keep their text, emphasis and code markers and
 * backslash escapes go. Close enough to what Markdown.tsx renders for a
 * phrase match, which is all it is used for.
 */
export function markdownText(md) {
  return String(md)
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\\(.)/g, "$1")
    .replace(/(\*\*|__|\*|`)/g, "")
    .replace(/^\s{0,3}(#{1,6}|[-+]|\d+\.|>)\s+/gm, "");
}

/** Normalized text of every ATX heading (## to ######) in a Markdown body. */
export function markdownHeadings(md) {
  const out = [];
  for (const m of String(md).matchAll(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/gm)) {
    out.push(normalize(markdownText(m[1])));
  }
  return out;
}

/* Inline tags vanish so "**bold**," still reads "bold,". Every other tag
   becomes a space so adjacent blocks do not fuse into one word. */
const INLINE_TAGS = "a|abbr|b|code|em|i|mark|small|span|strong|sub|sup|time|u";
const INLINE_TAG_RE = new RegExp(`</?(?:${INLINE_TAGS})(?:\\s[^>]*)?>`, "gi");

/** The text a reader can see: no scripts, no styles, no comments, no tags. */
export function visibleText(html) {
  return normalize(
    html
      .replace(/<head[\s>][\s\S]*?<\/head>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<template[\s\S]*?<\/template>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(INLINE_TAG_RE, "")
      .replace(/<[^>]+>/g, " ")
  );
}

/** Normalized text of every h1 to h6, in document order. */
export function headingTexts(html) {
  const out = [];
  const re = /<h([1-6])(?:\s[^>]*)?>([\s\S]*?)<\/h\1>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    out.push(normalize(m[2].replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, "")));
  }
  return out;
}

/** Map of heading id -> normalized heading text, for headings that carry an id. */
export function headingIds(html) {
  const out = new Map();
  const re = /<h[1-6]\s(?:[^>]*\s)?id="([^"]+)"[^>]*>([\s\S]*?)<\/h[1-6]>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    out.set(decodeEntities(m[1]), normalize(m[2].replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, "")));
  }
  return out;
}

/** Every id attribute value on the page. */
export function idsOf(html) {
  const ids = new Set();
  const re = /\sid="([^"]+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) ids.add(decodeEntities(m[1]));
  return ids;
}

const clip = (s) => JSON.stringify(s.length > 80 ? `${s.slice(0, 77)}...` : s);

/** All mirror-rule violations on one built page. `route` only labels the errors. */
export function checkPage(html, route) {
  const { blocks, errors: parseErrors } = extractJsonLd(html);
  const errors = parseErrors.map((e) => `M0 ${route}: ${e}`);

  const faqs = nodesOfType(blocks, "FAQPage");
  const howTos = nodesOfType(blocks, "HowTo");
  if (faqs.length === 0 && howTos.length === 0) return errors;

  const text = visibleText(html);
  const visible = (s) => typeof s === "string" && containsPhrase(text, normalize(s));

  for (const faq of faqs) {
    for (const q of [faq.mainEntity ?? []].flat()) {
      if (!visible(q.name)) {
        errors.push(`M1 ${route}: FAQ question is in the schema but not on the page: ${clip(String(q.name))}`);
      }
      const answer = q.acceptedAnswer?.text;
      if (!visible(answer)) {
        errors.push(`M2 ${route}: FAQ answer to ${clip(String(q.name))} is in the schema but not on the page`);
      }
    }
  }

  if (howTos.length > 0) {
    const headings = new Set(headingTexts(html));
    const ids = idsOf(html);
    const byId = headingIds(html);
    for (const howTo of howTos) {
      for (const step of [howTo.step ?? []].flat()) {
        const name = String(step.name ?? "");
        if (!headings.has(normalize(name))) {
          errors.push(`M3 ${route}: HowTo step is not a heading on the page: ${clip(name)}`);
        }
        if (!visible(step.text)) {
          errors.push(`M4 ${route}: HowTo step text for ${clip(name)} is in the schema but not on the page`);
        }
        const fragment = typeof step.url === "string" && step.url.includes("#") ? step.url.split("#")[1] : null;
        if (fragment !== null) {
          if (!ids.has(fragment)) {
            errors.push(`M5 ${route}: HowTo step url points at #${fragment}, which is not an id on the page`);
          } else if (byId.get(fragment) !== normalize(name)) {
            errors.push(
              `M5 ${route}: HowTo step url #${fragment} lands on ${clip(byId.get(fragment) ?? "a non-heading element")}, ` +
                `not on the step ${clip(name)}`
            );
          }
        }
      }
    }
  }

  return errors;
}

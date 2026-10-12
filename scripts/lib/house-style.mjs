/**
 * House style for anything a visitor or a crawler reads. Two rules:
 *
 *   1. No em dashes. Owner decision (plan aeo-2026-10, D3 / WP7).
 *   2. No "[PROOF POINT NEEDED]" markers. Plan aeo-hubspot-recs-2026-10-12,
 *      section 3.4: a claim we cannot substantiate is never written into
 *      published copy, not even as a placeholder. Proposed proof points go in
 *      the owner review file instead, and this rule is the backstop that keeps
 *      a stray marker from reaching production.
 *
 * Scope is published output: page text, the attributes people and assistive
 * tech read (alt, title, aria-label, placeholder), <title> and <meta> content,
 * and JSON-LD. Code comments are not published and are out of scope.
 *
 * Pure functions over strings and records. The build-output walk lives in
 * scripts/check-house-style.mjs; content-rules.mjs uses findInRecord() and
 * findProofMarkers() so the studio's pre-save check reports a problem inline
 * instead of a failed deploy.
 */

/* Built from its code point so no literal em dash sits in this source. */
export const EM_DASH = String.fromCharCode(0x2014);

/* Strings that must keep an em dash, each with a reason. Empty by design:
   Gartner's verbatim disclaimer, the one string that could need it, has none. */
export const ALLOWLIST = [];

/* Case-insensitive, with or without the surrounding brackets. The words may be
   separated by any run of whitespace, hyphens, underscores or Markdown
   emphasis (so "PROOF-POINT NEEDED" and "**PROOF POINT** NEEDED" match).
   Deliberately needs all three words in order, so ordinary prose such as
   "each claim needs a proof point" does not match. */
export const PROOF_MARKER_RE = /proof[\s\-_*]+point[\s\-_*]+needed/i;

const allowed = (s) => ALLOWLIST.some((entry) => s.includes(entry.text));

const hasDash = (s) => s.includes(EM_DASH) && !allowed(s);

/* A short, single-line excerpt around position i, for error messages. */
const clip = (s, i) => {
  const from = Math.max(0, i - 40);
  return JSON.stringify(`${from > 0 ? "..." : ""}${s.slice(from, i + 40).replace(/\s+/g, " ").trim()}...`);
};

/**
 * The published parts of one built page, as {kind, raw}. Every HTML rule in
 * this file reads through here, so the rules cannot drift apart on scope.
 */
function publishedParts(html) {
  const parts = [];
  const push = (kind, raw) => parts.push({ kind, raw });

  const head = (html.match(/<head[\s>][\s\S]*?<\/head>/i) || [""])[0];
  for (const m of head.matchAll(/<title>([\s\S]*?)<\/title>/gi)) push("title", m[1]);
  for (const m of head.matchAll(/<meta\s[^>]*content="([^"]*)"/gi)) push("meta", m[1]);

  for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    let data;
    try {
      data = JSON.parse(m[1]);
    } catch {
      continue; // unparseable JSON-LD is check:schema-mirror's M0, not ours
    }
    for (const s of strings(data)) push("json-ld", s);
  }

  const body = html
    .replace(/<head[\s>][\s\S]*?<\/head>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, "");
  for (const m of body.matchAll(/\s(?:alt|title|aria-label|placeholder)="([^"]*)"/gi)) push("attribute", m[1]);
  for (const chunk of body.split(/<[^>]+>/)) push("text", chunk);

  return parts;
}

/** Every em dash in published parts of one built page, as {kind, text}. */
export function findInHtml(html) {
  const found = [];
  for (const { kind, raw } of publishedParts(html)) {
    /* The entity forms render as the same character, so they count too. */
    const text = raw.replace(/&mdash;|&#8212;|&#x2014;/gi, EM_DASH);
    if (hasDash(text)) found.push({ kind, text: clip(text, text.indexOf(EM_DASH)) });
  }
  return found;
}

/** Every proof-point marker in published parts of one built page, as {kind, text}. */
export function findProofMarkersInHtml(html) {
  const found = [];
  for (const { kind, raw } of publishedParts(html)) {
    /* A non-breaking space renders as a space, so it must not hide a marker. */
    const text = raw.replace(/&nbsp;|&#160;|&#xa0;/gi, " ");
    const m = PROOF_MARKER_RE.exec(text);
    if (m) found.push({ kind, text: clip(text, m.index) });
  }
  /* Inline markup splits visible text into chunks, so "<strong>PROOF
     POINT</strong> NEEDED" matches in no single chunk. Re-test the visible
     text joined back together, and report it only if no chunk already did. */
  if (!found.some((f) => f.kind === "text")) {
    const joined = publishedParts(html)
      .filter((p) => p.kind === "text")
      .map((p) => p.raw)
      .join("")
      .replace(/&nbsp;|&#160;|&#xa0;/gi, " ");
    const m = PROOF_MARKER_RE.exec(joined);
    if (m) found.push({ kind: "text", text: clip(joined, m.index) });
  }
  return found;
}

/** Every string inside a JSON value, depth first. */
export function strings(value, out = []) {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => strings(v, out));
  return out;
}

/* Field paths in a record whose string value satisfies `test`. Numbers,
   booleans and null are not text and are skipped. */
function recordHits(record, test, path) {
  const hits = [];
  if (typeof record === "string") {
    if (test(record)) hits.push(path || "(value)");
  } else if (Array.isArray(record)) {
    record.forEach((v, i) => hits.push(...recordHits(v, test, `${path}[${i}]`)));
  } else if (record && typeof record === "object") {
    for (const [k, v] of Object.entries(record)) hits.push(...recordHits(v, test, path ? `${path}.${k}` : k));
  }
  return hits;
}

/** Field paths in a content record whose string value carries an em dash. */
export function findInRecord(record, path = "") {
  return recordHits(record, hasDash, path);
}

/** Field paths in a content record whose string value carries a proof-point marker. */
export function findProofMarkers(record, path = "") {
  return recordHits(record, (s) => PROOF_MARKER_RE.test(s), path);
}

/**
 * House style: no em dashes in anything a visitor or a crawler reads.
 *
 * Owner decision (plan aeo-2026-10, D3 / WP7). Scope is published output:
 * page text, the attributes people and assistive tech read (alt, title,
 * aria-label, placeholder), <title> and <meta> content, and JSON-LD. Code
 * comments are not published and are out of scope.
 *
 * Pure functions over strings and records. The build-output walk lives in
 * scripts/check-house-style.mjs; content-rules.mjs uses findInRecord() so the
 * studio's pre-save check reports an em dash inline instead of a failed deploy.
 */

/* Built from its code point so no literal em dash sits in this source. */
export const EM_DASH = String.fromCharCode(0x2014);

/* Strings that must keep an em dash, each with a reason. Empty by design:
   Gartner's verbatim disclaimer, the one string that could need it, has none. */
export const ALLOWLIST = [];

const allowed = (s) => ALLOWLIST.some((entry) => s.includes(entry.text));

const clip = (s) => {
  const i = s.indexOf(EM_DASH);
  const from = Math.max(0, i - 40);
  return JSON.stringify(`${from > 0 ? "..." : ""}${s.slice(from, i + 40).replace(/\s+/g, " ").trim()}...`);
};

/** Every em dash in published parts of one built page, as {kind, text}. */
export function findInHtml(html) {
  const found = [];
  const push = (kind, raw) => {
    /* The entity forms render as the same character, so they count too. */
    const text = raw.replace(/&mdash;|&#8212;|&#x2014;/gi, EM_DASH);
    if (text.includes(EM_DASH) && !allowed(text)) found.push({ kind, text: clip(text) });
  };

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

  return found;
}

/** Every string inside a JSON value, depth first. */
export function strings(value, out = []) {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => strings(v, out));
  return out;
}

/** Field paths in a content record whose string value carries an em dash. */
export function findInRecord(record, path = "") {
  const hits = [];
  if (typeof record === "string") {
    if (record.includes(EM_DASH) && !allowed(record)) hits.push(path || "(value)");
  } else if (Array.isArray(record)) {
    record.forEach((v, i) => hits.push(...findInRecord(v, `${path}[${i}]`)));
  } else if (record && typeof record === "object") {
    for (const [k, v] of Object.entries(record)) hits.push(...findInRecord(v, path ? `${path}.${k}` : k));
  }
  return hits;
}

/**
 * The `id` a Markdown heading renders with, derived from its text.
 *
 * One function, two callers, and they must agree: Markdown.tsx stamps this id
 * onto every h2/h3 it renders, and howToNode() in schema-nodes.mjs points each
 * HowToStep's `url` at `#<this id>`. If the two derived ids separately, a step
 * URL could point at an anchor the page does not have, and nothing would say
 * so. Plain .mjs so `node --test` and both callers can load it.
 */
export function headingId(text) {
  return String(text)
    .normalize("NFKD")
    .replace(/\p{M}/gu, "") // drop the accent marks NFKD splits off, so an accented e becomes e
    .toLowerCase()
    .replace(/[‘’']/g, "") // "company's" -> "companys", not "company-s"
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Hands out unique heading ids for one rendered page.
 *
 * Tracks every id already issued, not just a count per base: headings
 * "Intro", "Intro", "Intro 2" would otherwise produce "intro", "intro-2",
 * "intro-2". `reserved` holds ids something else on the page already owns
 * (KeyTakeaways' "key-takeaways"), so a body heading cannot collide with it.
 *
 * `next(text, key)` is idempotent per `key`: asking again for the same heading
 * returns the same id, which is what keeps a StrictMode double render from
 * counting a heading twice. Markdown.tsx passes the heading's source offset.
 */
export function createIdAllocator(reserved = []) {
  const issued = new Set(reserved);
  const byKey = new Map();
  return function next(text, key) {
    if (key !== undefined && byKey.has(key)) return byKey.get(key);
    const base = headingId(text) || "section";
    let id = base;
    for (let n = 2; issued.has(id); n++) id = `${base}-${n}`;
    issued.add(id);
    if (key !== undefined) byKey.set(key, id);
    return id;
  };
}

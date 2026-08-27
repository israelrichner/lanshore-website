/**
 * The four editor buttons and what each does to the slug ledger —
 * source plan §6.6.
 *
 * Under the plan's v2 design, THREE of these four buttons failed the build
 * (review blocker B1). The fix was two-part: the ledger check reads files on
 * disk rather than the draft-filtered arrays, and the invariant is a subset
 * rather than an equality. This module is the writer half of that.
 *
 * Pure functions returning a change set. They perform no I/O, so every row of
 * §6.6's table is a unit test rather than a manual E11 walk — which matters,
 * because §10.6 states E11 is otherwise the only verification this logic has.
 *
 * A change set is `{changes, ledger, refusal}`:
 *   - `refusal` set  -> the UI shows it and NOTHING is committed
 *   - otherwise      -> `changes` goes to commitFiles() as ONE commit
 */

import { isRedirectDestination } from "../../../scripts/lib/redirect-destinations.mjs";

export const LEDGER_PATH = "content/SLUGS.lock.json";

const DIR = { blog: "content/blog", caseStudies: "content/case-studies", whitePapers: "content/white-papers" };
const EXT = { blog: ".md", caseStudies: ".json", whitePapers: ".json" };

export function contentPath(collection, slug) {
  return `${DIR[collection]}/${slug}${EXT[collection]}`;
}

const clone = (ledger) => JSON.parse(JSON.stringify(ledger));
const serialise = (ledger) => JSON.stringify(ledger, null, 2) + "\n";

function refuse(reason) {
  return { changes: null, ledger: null, refusal: reason };
}

/**
 * Save a draft.
 *
 * A NEW slug is registered in the ledger **in the same commit** as the file.
 * Splitting them is what made v2 fail: the ledger would name a file that did
 * not exist yet, or vice versa, and rule L3 or L1 would fail the build.
 */
export function saveDraft({ collection, slug, record, ledger, isNew }) {
  const next = clone(ledger);
  if (isNew) {
    if (next[collection].includes(slug)) {
      return refuse(`The slug "${slug}" is already in use in this collection.`);
    }
    next[collection].push(slug);
  }
  return {
    refusal: null,
    ledger: next,
    changes: [
      { path: contentPath(collection, slug), record: { ...record, draft: true } },
      ...(isNew ? [{ path: LEDGER_PATH, content: serialise(next) }] : []),
    ],
  };
}

/**
 * Publish.
 *
 * Stamps `publishedOnce: true`, which is MONOTONIC — never cleared, not even
 * by Unpublish. It is the only durable answer to "was this ever live?", and
 * without it Delete cannot enforce §6.6's rule: a content file records only
 * its CURRENT draft value, so published-then-unpublished is otherwise
 * byte-indistinguishable from never-published.
 *
 * The ledger is untouched — the slug was registered when the draft was saved.
 */
export function publish({ collection, slug, record, ledger }) {
  return {
    refusal: null,
    ledger: clone(ledger),
    changes: [
      { path: contentPath(collection, slug), record: { ...record, draft: false, publishedOnce: true } },
    ],
  };
}

/**
 * Unpublish — the tool for "take it down".
 *
 * Refused when a live 301 points at this slug: unpublishing it turns that
 * redirect into a 301-to-404. Blocked HERE, in the UI, rather than letting
 * the build catch it, because a Vercel failure email is not something a
 * non-developer can act on.
 *
 * The file stays on disk, so rule L1 still resolves and the ledger needs no
 * change. That is exactly why the ledger check reads disk rather than the
 * draft-filtered arrays.
 */
export function unpublish({ collection, slug, record, ledger }) {
  if (isRedirectDestination(collection, slug)) {
    return refuse(
      `"${slug}" cannot be unpublished: a permanent redirect from the old site points at this page, ` +
        `and taking it down would turn that redirect into a broken link. A developer needs to retire the redirect first.`
    );
  }
  return {
    refusal: null,
    ledger: clone(ledger),
    changes: [{ path: contentPath(collection, slug), record: { ...record, draft: true } }],
  };
}

/**
 * Delete — permanent, and deliberately hard to reach.
 *
 * Refused for anything ever published, because removing a live URL needs a
 * paired 301, which means editing next.config.ts — a developer task, exactly
 * like the slug renames §5 already carves out.
 *
 * TWO independent guards, because the cost of getting this wrong is a
 * permanently dead URL:
 *   1. `publishedOnce` — catches published-then-unpublished, which a naive
 *      "is it currently published?" check sails straight past.
 *   2. redirect destination — catches anything a legacy URL points at.
 */
export function remove({ collection, slug, record, ledger }) {
  if (record?.publishedOnce === true) {
    return refuse(
      `"${slug}" has been published before, so it cannot be deleted here. ` +
        `Use Unpublish instead — that hides the page while keeping its address alive. ` +
        `Permanently removing a page that was live needs a developer to add a redirect first.`
    );
  }
  if (isRedirectDestination(collection, slug)) {
    return refuse(
      `"${slug}" cannot be deleted: a permanent redirect from the old site points at this page.`
    );
  }
  const next = clone(ledger);
  next[collection] = next[collection].filter((s) => s !== slug);
  return {
    refusal: null,
    ledger: next,
    changes: [
      { path: contentPath(collection, slug), delete: true },
      { path: LEDGER_PATH, content: serialise(next) },
    ],
  };
}

export const BUTTONS = { saveDraft, publish, unpublish, remove };

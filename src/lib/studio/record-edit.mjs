/**
 * What an editor action writes, given what is at head and what the form sent.
 *
 * Pure, so the rules are tested rather than remembered. apply-action.ts is the
 * only caller.
 *
 * The problem this solves: an optional field the editor CLEARED has to reach
 * the server as something. If the form simply leaves the key out, a publish
 * (which starts from head so a stale tab cannot resurrect old values) keeps
 * head's value, and the byline or publish date the editor just removed goes
 * live anyway. So the forms send `null` for "cleared", and this module turns
 * null into "key absent" AFTER the merge. A null never reaches the file:
 * content-rules.mjs would reject it, and an emitted `datePublished: null` is
 * worse than no key.
 */

/**
 * The optional fields an editor may clear. Deliberately a short list: a null
 * for anything else (publishedOnce above all, which guards Delete) is left in
 * place for the validators to reject, rather than quietly deleting a field the
 * form never offered to clear.
 */
export const CLEARABLE_FIELDS = ["author", "datePublished", "image"];

/** Copy of `record` without the clearable keys whose value is null. */
export function dropCleared(record) {
  return Object.fromEntries(
    Object.entries(record).filter(([k, v]) => !(v === null && CLEARABLE_FIELDS.includes(k)))
  );
}

/**
 * The record an action operates on.
 *
 *   saveDraft  exactly what the form sent (the form loaded the whole record,
 *              see initialFor), minus cleared keys
 *   otherwise  head, overlaid with what the form sent, minus cleared keys
 */
export function recordForAction(action, head, sent) {
  if (action === "saveDraft") return dropCleared(sent ?? {});
  return dropCleared({ ...(head ?? {}), ...(sent ?? {}) });
}

const str = (v, fallback = "") => (v === undefined || v === null ? fallback : String(v));
const optStr = (v) => (typeof v === "string" ? v : undefined);

/**
 * A form's starting values for a record read from head.
 *
 * Starts from the WHOLE record and overlays the fields the form edits with
 * typed defaults. saveDraft writes exactly what the form sends, so a field the
 * form does not know about (cardTitle, image, publishedOnce, a case study's
 * dateModified) would otherwise be deleted from the file on the next draft
 * save. publishedOnce going missing is the dangerous one: it is what stops
 * Delete on anything that was ever live.
 */
export function initialFor(collection, record, today) {
  const r = record ?? {};
  if (collection === "blog") {
    return {
      ...r,
      title: str(r.title),
      description: str(r.description),
      dateModified: str(r.dateModified, today),
      author: optStr(r.author),
      datePublished: optStr(r.datePublished),
      summary: str(r.summary),
      featured: r.featured === true,
      body: str(r.body),
      faq: Array.isArray(r.faq) ? r.faq : [],
      draft: r.draft,
      publishedOnce: r.publishedOnce,
    };
  }
  if (collection === "caseStudies") {
    return {
      ...r,
      title: str(r.title),
      client: str(r.client),
      industry: str(r.industry),
      pillar: str(r.pillar, "SPM Operations"),
      outcome: str(r.outcome),
      challenge: str(r.challenge),
      whatWeDid: str(r.whatWeDid),
      results: Array.isArray(r.results) ? r.results : [""],
      stack: Array.isArray(r.stack) ? r.stack : [""],
      legacyUrl: str(r.legacyUrl),
      author: optStr(r.author),
      datePublished: optStr(r.datePublished),
      draft: r.draft,
    };
  }
  return {
    ...r,
    title: str(r.title),
    description: str(r.description),
    hubspotValue: str(r.hubspotValue),
    draft: r.draft,
  };
}

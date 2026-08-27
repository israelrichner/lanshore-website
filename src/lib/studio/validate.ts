/**
 * Pre-flight validation for the admin.
 *
 * A TYPED RE-EXPORT of scripts/lib/content-rules.mjs — never a second
 * implementation (source plan :870). Two copies of a validation rule is how
 * the admin and the build gate drift apart, and the failure mode of that
 * drift is the exact thing this package exists to prevent: an editor
 * learning about a violation from a Vercel failure email instead of an
 * inline form error.
 *
 * check-content.mjs runs the same functions at build time as the backstop
 * for hand edits. Same module, one implementation, two callers.
 */

import {
  VALIDATORS,
  checkLedger,
  SLUG_RE,
  PILLARS,
  COLLECTIONS,
} from "../../../scripts/lib/content-rules.mjs";
import { REDIRECT_DESTINATIONS } from "../../../scripts/lib/redirect-destinations.mjs";
import type { CollectionKey } from "@/lib/content/loadContent";

export { VALIDATORS, checkLedger, SLUG_RE, PILLARS, COLLECTIONS, REDIRECT_DESTINATIONS };

export type Ledger = {
  version: number;
  blog: string[];
  caseStudies: string[];
  whitePapers: string[];
  retired: { slug: string; collection: string; retiredOn?: string; redirectTo: string }[];
};

export type OnDiskEntry = { slug: string; draft: boolean };

/**
 * Everything that must hold before a commit is built.
 *
 * Returns the full list rather than the first failure: an editor fixing one
 * field at a time, with a round trip each, is a worse experience than seeing
 * everything at once.
 */
export function preflight(args: {
  collection: CollectionKey;
  slug: string;
  record: Record<string, unknown>;
  ledger: Ledger;
  onDisk: Record<CollectionKey, OnDiskEntry[]>;
}): string[] {
  const { collection, slug, record, ledger, onDisk } = args;

  if (!SLUG_RE.test(slug)) {
    return [`"${slug}" is not a valid address — use lowercase letters, numbers and hyphens only.`];
  }

  const fieldErrors: string[] = VALIDATORS[collection](record, slug);

  const ledgerErrors: string[] = checkLedger({
    ledger,
    onDisk,
    redirectDestinations: REDIRECT_DESTINATIONS,
  });

  return [...fieldErrors, ...ledgerErrors];
}

/**
 * The people this site is willing to put a byline on.
 *
 * Pure data. The `Person` JSON-LD node is built in lib/schema.ts, next to every
 * other schema builder and next to the ORG_ID it has to reference. Keeping that
 * builder out of this file is what avoids an import cycle between the two.
 *
 * Only `id` and `name` are required. `jobTitle`, `linkedin` and `bio` are
 * optional; when one is absent, AuthorByline renders an unlinked name and
 * `personNode` omits the key rather than emitting an empty one. Doug Erb's
 * values were supplied by him in the October 2026 owner review (plan OQ2).
 * Never fill these with a guess; an invented LinkedIn URL would be a
 * fabricated fact about a real person.
 */

import { AUTHOR_IDS } from "../../scripts/lib/content-rules.mjs";

export type Author = {
  /** Stable key. Used in content front matter and in the Person `@id`. */
  id: string;
  name: string;
  jobTitle?: string;
  /** Profile URL, folded into the Person node's `sameAs`. */
  linkedin?: string;
  /** One line, rendered under the byline and emitted as `description`. */
  bio?: string;
  /** Other canonical URLs for the same human. */
  sameAs?: string[];
};

export const AUTHORS: Record<string, Author> = {
  "doug-erb": {
    id: "doug-erb",
    name: "Doug Erb",
    jobTitle: "Founder & CEO",
    linkedin: "https://www.linkedin.com/in/douglaserb",
    bio: "Doug Erb has designed, built and run sales compensation systems since 2000, from Callidus and Trilogy through Varicent, Xactly, CaptivateIQ, Performio and SAP Commissions, and today leads Lanshore's SPM and agentic AI practice.",
  },
};

/**
 * The two lists must agree, or content validation and rendering disagree about
 * who exists: a byline that passes `check:content` but renders no Person node,
 * or vice versa. Throwing at module load fails the build, which is the same
 * line of defence whitePapers.ts puts in front of its PDF paths.
 */
const declared = [...AUTHOR_IDS].sort();
const defined = Object.keys(AUTHORS).sort();
if (declared.join(",") !== defined.join(",")) {
  throw new Error(
    `Author registry drift: AUTHOR_IDS in scripts/lib/content-rules.mjs is ` +
      `[${declared.join(", ")}] but AUTHORS in src/lib/authors.ts defines ` +
      `[${defined.join(", ")}]. Both must list exactly the same ids.`
  );
}

for (const [key, author] of Object.entries(AUTHORS)) {
  if (author.id !== key) {
    throw new Error(`Author "${key}" has mismatched id "${author.id}"; the key and id must match.`);
  }
}

export function getAuthor(id: string | undefined): Author | undefined {
  return id ? AUTHORS[id] : undefined;
}

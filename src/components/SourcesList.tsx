import type { SourceEntry } from "@/lib/content/loadContent";
import { formatDate } from "@/lib/contentDates";

/* Reserved in Markdown's id allocator, like KeyTakeaways' id. */
export const SOURCES_ID = "sources";

/**
 * The dated public sources behind an article, rendered visibly.
 *
 * Required on every comparison piece (validation enforces it): each claim
 * about a named vendor or firm has to trace to something a reader can check,
 * and the retrieval date says how current that claim was. Renders nothing
 * when a piece has no sources.
 */
export default function SourcesList({ sources }: { sources?: SourceEntry[] }) {
  if (!sources || sources.length === 0) return null;

  return (
    <section aria-labelledby={SOURCES_ID} className="mt-12 border-t border-line pt-6">
      <h2 id={SOURCES_ID} className="text-lg font-bold text-ink">
        Sources
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-6 text-sm text-muted">
        {sources.map((src, i) => (
          <li key={i}>
            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="break-words font-medium text-accent underline hover:text-accent-hover"
            >
              {src.title}
            </a>
            , retrieved <time dateTime={src.retrieved}>{formatDate(src.retrieved)}</time>
          </li>
        ))}
      </ol>
    </section>
  );
}

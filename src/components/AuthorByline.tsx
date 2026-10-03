import { getAuthor } from "@/lib/authors";
import { formatDate } from "@/lib/contentDates";

/**
 * The byline under an article heading.
 *
 * Whatever this renders, the Article JSON-LD on the same page must say the
 * same thing. Structured data that claims an author or a publish date the
 * reader cannot see is exactly the pattern Google treats as spam, so the two
 * are built from one record and never from two.
 *
 * Four states, all reachable with today's content:
 *
 *   1. author + published + updated   a post written for this site
 *   2. author + updated               author known, no publish date on file
 *   3. no author + updated            the migrated posts, attributed to Lanshore
 *   4. author without a linkedin url  name renders as plain text, never an
 *                                     empty or placeholder link
 *
 * State 4 is the current reality for every author: the owner has not supplied
 * profile URLs yet (plan OQ2). An invented URL would be a fabricated fact
 * about a real person, so the component is built to read correctly without
 * one rather than to wait for one.
 *
 * Styling targets the dark hero both call sites render it into.
 */
export default function AuthorByline({
  author: authorId,
  dateModified,
  datePublished,
}: {
  author?: string;
  dateModified: string;
  datePublished?: string;
}) {
  const author = getAuthor(authorId);
  const name = author?.name ?? "Lanshore";

  return (
    <div className="mt-4 text-sm text-white/60">
      <p>
        {author?.linkedin ? (
          <a
            href={author.linkedin}
            rel="author noopener noreferrer"
            target="_blank"
            className="font-semibold text-white/80 underline decoration-white/30 underline-offset-2 hover:text-white focus-visible:text-white"
          >
            {name}
          </a>
        ) : (
          <span className="font-semibold text-white/80">{name}</span>
        )}
        {author?.jobTitle ? <span>, {author.jobTitle}</span> : null}
        {" · "}
        {/* Published and updated on the same day reads as one fact, not two. */}
        {datePublished && datePublished === dateModified ? (
          <>
            Published <time dateTime={datePublished}>{formatDate(datePublished)}</time>
          </>
        ) : (
          <>
            {datePublished ? (
              <>
                Published{" "}
                <time dateTime={datePublished}>{formatDate(datePublished)}</time>
                {" · "}
              </>
            ) : null}
            {datePublished ? "Last updated " : "Updated "}
            <time dateTime={dateModified}>{formatDate(dateModified)}</time>
          </>
        )}
      </p>
      {author?.bio ? <p className="mt-2 max-w-2xl text-white/50">{author.bio}</p> : null}
    </div>
  );
}

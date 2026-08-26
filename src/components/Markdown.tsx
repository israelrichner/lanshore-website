import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders a post body written in Markdown.
 *
 * Replaces the bespoke block renderer that used to live in
 * src/app/blog/[slug]/page.tsx. The component map below reproduces that
 * renderer's classes exactly — this is a data-source migration, not a
 * restyle, and the rendered HTML is expected to be byte-identical.
 *
 * Two deliberate omissions:
 *
 *   - No `rehype-raw`. Raw HTML in a post body stays inert. Once the P3
 *     admin exists, body text is editor-supplied, and enabling raw HTML
 *     would turn a content field into an XSS vector.
 *   - `urlTransform` is left at its default, which strips dangerous URL
 *     schemes (javascript:, data:) from links. Overriding it to "fix" a
 *     link is how that protection gets lost.
 *
 * `remark-gfm` supplies autolink literals, which is what replaces the old
 * `linkify()` helper for the bare "Retrieved from https://…" reference
 * lines. GFM's trailing-punctuation handling is close to, but not
 * provably identical to, the old hand-rolled trimming — the golden diff is
 * what settles it.
 */
export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children }) => (
          <h2 className="mt-10 mb-3 text-2xl font-bold text-ink">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-8 mb-2 text-xl font-bold text-ink">{children}</h3>
        ),
        p: ({ children }) => <p className="my-4 text-foreground">{children}</p>,
        ul: ({ children }) => (
          <ul className="my-4 list-disc space-y-2 pl-6 text-muted">{children}</ul>
        ),
        li: ({ children }) => <li>{children}</li>,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all font-medium text-accent underline hover:text-accent-hover"
          >
            {children}
          </a>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

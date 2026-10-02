import { isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createIdAllocator } from "@/lib/heading-id.mjs";
import { KEY_TAKEAWAYS_ID } from "@/components/KeyTakeaways";
import { SOURCES_ID } from "@/components/SourcesList";

/** Plain text of a rendered heading's children, for deriving its id. */
function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

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
 *
 * Every h2 and h3 carries an `id` from headingId(), so sections are linkable
 * and HowToStep urls (see howToNode in lib/schema-nodes.mjs) land on a real
 * anchor. A repeated heading gets "-2", "-3" so ids stay unique per page.
 * `scroll-mt-24` keeps a deep-linked heading clear of the sticky header
 * (81px tall, 57px once scrolled), which would otherwise cover it.
 */
export default function Markdown({ children }: { children: string }) {
  /* Keyed on the heading's source offset, so a second render of the same
     heading (StrictMode double-invokes in the studio preview) returns the same
     id instead of counting it again as a duplicate. */
  const allocate = createIdAllocator([KEY_TAKEAWAYS_ID, SOURCES_ID]);
  const idFor = (children: ReactNode, offset: number | undefined) => allocate(textOf(children), offset);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children, node }) => (
          <h2 id={idFor(children, node?.position?.start.offset)} className="mt-10 mb-3 scroll-mt-24 text-2xl font-bold text-ink">{children}</h2>
        ),
        h3: ({ children, node }) => (
          <h3 id={idFor(children, node?.position?.start.offset)} className="mt-8 mb-2 scroll-mt-24 text-xl font-bold text-ink">{children}</h3>
        ),
        p: ({ children }) => <p className="my-4 text-foreground">{children}</p>,
        ul: ({ children }) => (
          <ul className="my-4 list-disc space-y-2 pl-6 text-muted">{children}</ul>
        ),
        /* Without this mapping the CSS reset strips the numbers off an
           ordered list, which a listicle or a procedure depends on. */
        ol: ({ children }) => (
          <ol className="my-4 list-decimal space-y-2 pl-6 text-muted">{children}</ol>
        ),
        li: ({ children }) => <li>{children}</li>,
        /* GFM tables (comparison pieces). A real <table>, which is what makes
           it extractable; it scrolls inside its own container at narrow
           widths so the page itself never scrolls sideways. */
        table: ({ children }) => (
          <div className="my-6 overflow-x-auto rounded-lg border border-line">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-paper">{children}</thead>,
        th: ({ children }) => (
          <th scope="col" className="border-b border-line px-3 py-2 font-semibold text-ink">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border-b border-line px-3 py-2 align-top text-foreground">{children}</td>
        ),
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

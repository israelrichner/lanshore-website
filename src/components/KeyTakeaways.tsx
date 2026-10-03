/**
 * The short summary above an article body.
 *
 * A real <section> with an <h2> and a <ul>, not styled divs: the point of the
 * block is that a reader skimming, a screen reader, and an answer engine
 * lifting a passage all find the same self-contained list. Renders nothing at
 * all when a post has no takeaways, so there is never an empty container.
 *
 * Copies FaqSection's bordered-block grammar on the light article surface.
 */
/* Reserved in Markdown's id allocator so a body heading "Key takeaways"
   becomes "key-takeaways-2" instead of duplicating this id. */
export const KEY_TAKEAWAYS_ID = "key-takeaways";

export default function KeyTakeaways({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section
      aria-labelledby={KEY_TAKEAWAYS_ID}
      className="mb-10 rounded-lg border border-line bg-paper p-6"
    >
      <h2 id={KEY_TAKEAWAYS_ID} className="mb-3 text-lg font-bold text-ink">
        Key takeaways
      </h2>
      <ul className="list-disc space-y-2 pl-6 text-foreground">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

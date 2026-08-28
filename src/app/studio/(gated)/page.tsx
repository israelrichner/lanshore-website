import Link from "next/link";
import { getSession } from "@/lib/studio/session";
import { createGitHubClientFromEnv } from "@/lib/studio/github";
import { parseRecord } from "@/lib/studio/apply-action";
import type { CollectionKey } from "@/lib/content/loadContent";

/* Read from GitHub at head, never from loadContent: local files are whatever
   the LAST deploy bundled, so for the 1-3 minutes a rebuild takes an editor
   would publish and then not see their own change. */
export const dynamic = "force-dynamic";

const COLLECTIONS: { key: CollectionKey; label: string; dir: string; ext: string }[] = [
  { key: "blog", label: "Blog posts", dir: "content/blog", ext: ".md" },
  { key: "caseStudies", label: "Case studies", dir: "content/case-studies", ext: ".json" },
  { key: "whitePapers", label: "White papers", dir: "content/white-papers", ext: ".json" },
];

type Item = { slug: string; title: string; draft: boolean };

async function loadItems(): Promise<Record<string, Item[]> | null> {
  const client = createGitHubClientFromEnv();
  if (!client) return null;
  const out: Record<string, Item[]> = {};
  for (const c of COLLECTIONS) {
    const entries = await client.listDir(c.dir);
    const items: Item[] = [];
    for (const e of entries) {
      if (e.type !== "file" || !e.name.endsWith(c.ext) || e.name === "SLUGS.lock.json") continue;
      const file = await client.getFile(e.path);
      if (!file) continue;
      const rec = parseRecord(c.key, file.content) as { title?: string; draft?: boolean };
      items.push({ slug: e.name.slice(0, -c.ext.length), title: rec.title ?? e.name, draft: rec.draft === true });
    }
    out[c.key] = items;
  }
  return out;
}

export default async function StudioPage() {
  const session = await getSession();
  const items = await loadItems();

  return (
    <main>
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold text-ink">Studio</h1>
        <form action="/api/studio/auth/logout" method="post">
          <button type="submit" className="text-sm text-muted underline hover:text-accent">Sign out</button>
        </form>
      </div>
      <p className="mt-1 text-sm text-muted">Signed in as {session?.email}</p>

      {items === null ? (
        <p className="mt-8 rounded border border-line bg-paper p-4 text-sm text-ink">
          Publishing is not configured yet — <code>GITHUB_TOKEN</code> or <code>GITHUB_REPO</code> is missing.
          You can sign in, but nothing can be saved.
        </p>
      ) : (
        COLLECTIONS.map((c) => (
          <section key={c.key} className="mt-10">
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-bold text-ink">{c.label}</h2>
              <Link href={`/studio/${c.key}/new`} className="text-sm font-semibold text-accent">
                New
              </Link>
            </div>
            <ul className="mt-3 divide-y divide-line rounded border border-line">
              {(items[c.key] ?? []).map((item) => (
                <li key={item.slug}>
                  <Link href={`/studio/${c.key}/${item.slug}`} className="flex items-center justify-between p-3 hover:bg-paper">
                    <span className="text-ink">{item.title}</span>
                    {item.draft && (
                      <span className="rounded bg-paper px-2 py-0.5 text-xs font-semibold text-muted">Draft</span>
                    )}
                  </Link>
                </li>
              ))}
              {(items[c.key] ?? []).length === 0 && (
                <li className="p-3 text-sm text-muted">Nothing here yet.</li>
              )}
            </ul>
          </section>
        ))
      )}
    </main>
  );
}

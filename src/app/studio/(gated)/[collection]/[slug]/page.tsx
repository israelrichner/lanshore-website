import { notFound } from "next/navigation";
import { createGitHubClientFromEnv } from "@/lib/studio/github";
import { parseRecord } from "@/lib/studio/apply-action";
import { contentPath } from "@/lib/studio/ledger-ops.mjs";
import { COLLECTIONS } from "@/lib/studio/validate";
import BlogForm from "@/components/studio/BlogForm";
import CaseStudyForm from "@/components/studio/CaseStudyForm";
import WhitePaperForm from "@/components/studio/WhitePaperForm";
import type { CollectionKey } from "@/lib/content/loadContent";

/* Reads from GitHub at head — see the note in github.ts. Also why this is
   dynamic: a cached render would show an editor stale state moments after
   their own commit. */
export const dynamic = "force-dynamic";

const today = () => new Date().toISOString().slice(0, 10);

export default async function EditorPage({ params }: { params: Promise<{ collection: string; slug: string }> }) {
  const { collection, slug } = await params;
  if (!COLLECTIONS.includes(collection)) notFound();
  const key = collection as CollectionKey;
  const isNew = slug === "new";

  let record: Record<string, unknown> = {};
  let sha: string | null = null;

  if (!isNew) {
    const client = createGitHubClientFromEnv();
    if (!client) notFound();
    const file = await client.getFile(contentPath(key, slug));
    if (!file) notFound();
    record = parseRecord(key, file.content);
    /* The sha the editor's tab loaded. Sent back on save so a second tab
       cannot silently clobber this one. */
    sha = file.sha;
  }

  if (key === "blog") {
    return (
      <BlogForm
        slug={isNew ? "" : slug}
        isNew={isNew}
        sha={sha}
        initial={{
          title: String(record.title ?? ""),
          description: String(record.description ?? ""),
          dateModified: String(record.dateModified ?? today()),
          summary: String(record.summary ?? ""),
          featured: record.featured === true,
          body: String(record.body ?? ""),
          faq: (record.faq as { question: string; answer: string }[]) ?? [],
          draft: record.draft as boolean | undefined,
          publishedOnce: record.publishedOnce as boolean | undefined,
        }}
      />
    );
  }

  if (key === "caseStudies") {
    return (
      <CaseStudyForm
        slug={isNew ? "" : slug}
        isNew={isNew}
        sha={sha}
        initial={{
          title: String(record.title ?? ""),
          client: String(record.client ?? ""),
          industry: String(record.industry ?? ""),
          pillar: String(record.pillar ?? "SPM Operations"),
          outcome: String(record.outcome ?? ""),
          challenge: String(record.challenge ?? ""),
          whatWeDid: String(record.whatWeDid ?? ""),
          results: (record.results as string[]) ?? [""],
          stack: (record.stack as string[]) ?? [""],
          legacyUrl: String(record.legacyUrl ?? ""),
          draft: record.draft as boolean | undefined,
        }}
      />
    );
  }

  return (
    <WhitePaperForm
      slug={isNew ? "" : slug}
      isNew={isNew}
      sha={sha}
      initial={{
        title: String(record.title ?? ""),
        description: String(record.description ?? ""),
        hubspotValue: String(record.hubspotValue ?? ""),
        draft: record.draft as boolean | undefined,
      }}
    />
  );
}

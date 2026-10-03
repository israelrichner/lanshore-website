import { notFound } from "next/navigation";
import { createGitHubClientFromEnv } from "@/lib/studio/github";
import { parseRecord } from "@/lib/studio/apply-action";
import { contentPath } from "@/lib/studio/ledger-ops.mjs";
import { COLLECTIONS } from "@/lib/studio/validate";
import BlogForm, { type BlogFormValues } from "@/components/studio/BlogForm";
import CaseStudyForm, { type CaseStudyValues } from "@/components/studio/CaseStudyForm";
import WhitePaperForm, { type WhitePaperValues } from "@/components/studio/WhitePaperForm";
import { initialFor } from "@/lib/studio/record-edit.mjs";
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

  /* initialFor() starts every form from the WHOLE record so a draft save
     cannot delete fields the form does not edit. See record-edit.mjs. */
  const initial = initialFor(key, record, today());
  const formSlug = isNew ? "" : slug;

  if (key === "blog") {
    return <BlogForm slug={formSlug} isNew={isNew} sha={sha} initial={initial as BlogFormValues} />;
  }
  if (key === "caseStudies") {
    return <CaseStudyForm slug={formSlug} isNew={isNew} sha={sha} initial={initial as CaseStudyValues} />;
  }
  return <WhitePaperForm slug={formSlug} isNew={isNew} sha={sha} initial={initial as WhitePaperValues} />;
}

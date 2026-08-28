"use client";

import { useState } from "react";
import Markdown from "@/components/Markdown";
import {
  useEditorActions, EditorMessages, Field, ActionButtons, SlugField, inputClass,
} from "./EditorShell";

/**
 * Blog editor with a side-by-side live preview.
 *
 * The preview renders through the SAME <Markdown> component the public page
 * uses. That is the entire reason preview deployments were dropped from the
 * plan: a second renderer would let preview and published diverge, and the
 * editor would be trusting a lie.
 */

export type BlogFormValues = {
  title: string;
  description: string;
  dateModified: string;
  summary: string;
  cardTitle?: string;
  featured: boolean;
  body: string;
  faq?: { question: string; answer: string }[];
  draft?: boolean;
  publishedOnce?: boolean;
};

export default function BlogForm({
  slug: initialSlug, initial, isNew, sha,
}: { slug: string; initial: BlogFormValues; isNew: boolean; sha: string | null }) {
  const [slug, setSlug] = useState(initialSlug);
  const [v, setV] = useState<BlogFormValues>(initial);
  const { state, run } = useEditorActions("blog", slug, isNew);
  const set = <K extends keyof BlogFormValues>(k: K, val: BlogFormValues[K]) => setV((p) => ({ ...p, [k]: val }));

  const record = () => ({ ...v, faq: v.faq?.filter((f) => f.question.trim() && f.answer.trim()) });

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">{isNew ? "New blog post" : v.title || slug}</h1>
      <EditorMessages state={state} />

      <SlugField value={slug} onChange={isNew ? setSlug : undefined} locked={!isNew} />

      <Field label="Title"><input className={inputClass} value={v.title} onChange={(e) => set("title", e.target.value)} /></Field>

      <Field label="Description" hint="Shown in search results and link previews.">
        <textarea className={inputClass} rows={2} value={v.description} onChange={(e) => set("description", e.target.value)} />
      </Field>

      <Field label="Card summary" hint="The shorter blurb used on the Resources page.">
        <textarea className={inputClass} rows={2} value={v.summary} onChange={(e) => set("summary", e.target.value)} />
      </Field>

      <Field
        label="Last updated"
        hint="Bump this when you change the words, not when the page is restyled — search engines only trust this date if it is honest."
      >
        <input type="date" className={inputClass} value={v.dateModified} onChange={(e) => set("dateModified", e.target.value)} />
      </Field>

      <label className="mt-4 flex items-center gap-2">
        <input type="checkbox" checked={v.featured} onChange={(e) => set("featured", e.target.checked)} />
        <span className="text-sm text-ink">Feature this post on the Resources page</span>
      </label>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div>
          <span className="block text-sm font-semibold text-ink">Body</span>
          <span className="block text-xs text-muted">
            Markdown. <code>## </code> for a heading, <code>### </code> for a sub-heading, <code>- </code> for a bullet.
          </span>
          <textarea
            className={`${inputClass} mt-1 font-mono text-sm`}
            rows={24}
            value={v.body}
            onChange={(e) => set("body", e.target.value)}
          />
        </div>
        <div>
          <span className="block text-sm font-semibold text-ink">Preview</span>
          <span className="block text-xs text-muted">Exactly how the published page will render.</span>
          <div className="mt-1 max-h-[36rem] overflow-y-auto rounded border border-line bg-white p-4">
            <Markdown>{v.body}</Markdown>
          </div>
        </div>
      </div>

      <ActionButtons
        state={state}
        isNew={isNew}
        isDraft={v.draft !== false}
        onSaveDraft={() => run("saveDraft", record(), sha)}
        onPublish={() => run("publish", record(), sha)}
        onUnpublish={() => run("unpublish", undefined, sha)}
        onDelete={() => run("delete", undefined, sha)}
      />
    </div>
  );
}

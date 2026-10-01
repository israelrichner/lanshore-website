"use client";

import { useState } from "react";
import Markdown from "@/components/Markdown";
import {
  useEditorActions, EditorMessages, Field, ActionButtons, SlugField, inputClass,
} from "./EditorShell";
import { AUTHORS } from "@/lib/authors";

/* Derived once. The picker offers exactly the people AUTHOR_IDS allows, so the
   admin cannot save a byline that check:content would then reject. */
const AUTHOR_OPTIONS = Object.values(AUTHORS);

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
  /* Optional byline. Blank in the form means "no named author" / "no known
     publish date" and is sent as null, which the server turns into an absent
     key (see lib/studio/record-edit.mjs). Never sent as "". */
  author?: string | null;
  datePublished?: string | null;
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

  /* A blank optional field is sent as null, never omitted and never "".
     Omitted would let Publish (which merges over head) bring back the value
     the editor just cleared; "" would fail validation. The server drops the
     nulls after the merge. */
  const record = () => ({
    ...v,
    faq: v.faq?.filter((f) => f.question.trim() && f.answer.trim()),
    author: v.author?.trim() ? v.author : null,
    datePublished: v.datePublished?.trim() ? v.datePublished : null,
  });

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

      <Field
        label="Published"
        hint="Leave blank unless you know the real date this went live. A guessed date is a false freshness signal, and search engines weigh it. Blank is honest; wrong is not."
      >
        <input
          type="date"
          className={inputClass}
          value={v.datePublished ?? ""}
          onChange={(e) => set("datePublished", e.target.value || undefined)}
        />
      </Field>

      <Field
        label="Author"
        hint="Leave as Lanshore unless a named person wrote this. The byline shown to readers and the author in structured data are the same value."
      >
        <select
          className={inputClass}
          value={v.author ?? ""}
          onChange={(e) => set("author", e.target.value || undefined)}
        >
          <option value="">Lanshore (no named author)</option>
          {AUTHOR_OPTIONS.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
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

"use client";

import { useState } from "react";
/* From the leaf module, NOT validate.ts: validate.ts re-exports the whole
   validation surface plus the redirect-destination list, and a client
   component has no business pulling either into the browser bundle just to
   populate a dropdown. */
import { PILLARS } from "../../../scripts/lib/content-rules.mjs";
import { useEditorActions, EditorMessages, Field, ActionButtons, SlugField, inputClass } from "./EditorShell";
import { AUTHORS } from "@/lib/authors";

/* Same picker as BlogForm: exactly the people AUTHOR_IDS allows. */
const AUTHOR_OPTIONS = Object.values(AUTHORS);

export type CaseStudyValues = {
  title: string; client: string; industry: string; pillar: string;
  outcome: string; challenge: string; whatWeDid: string;
  results: string[]; stack: string[]; legacyUrl: string; draft?: boolean;
  /* Optional byline. Blank is sent as null and becomes an absent key on the
     server (lib/studio/record-edit.mjs); never written to the file as "". */
  author?: string | null; datePublished?: string | null;
};

function RepeatableList({ label, hint, values, onChange }: {
  label: string; hint: string; values: string[]; onChange: (v: string[]) => void;
}) {
  return (
    <div className="mt-4">
      <span className="block text-sm font-semibold text-ink">{label}</span>
      <span className="block text-xs text-muted">{hint}</span>
      {values.map((row, i) => (
        <div key={i} className="mt-1 flex gap-2">
          <input
            className={inputClass}
            value={row}
            onChange={(e) => onChange(values.map((r, j) => (j === i ? e.target.value : r)))}
          />
          <button
            type="button"
            className="rounded border border-line px-3 text-sm text-muted"
            onClick={() => onChange(values.filter((_, j) => j !== i))}
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="mt-2 text-sm font-semibold text-accent" onClick={() => onChange([...values, ""])}>
        Add another
      </button>
    </div>
  );
}

export default function CaseStudyForm({ slug: initialSlug, initial, isNew, sha }: {
  slug: string; initial: CaseStudyValues; isNew: boolean; sha: string | null;
}) {
  const [slug, setSlug] = useState(initialSlug);
  const [v, setV] = useState(initial);
  const { state, run } = useEditorActions("caseStudies", slug, isNew);
  const set = <K extends keyof CaseStudyValues>(k: K, val: CaseStudyValues[K]) => setV((p) => ({ ...p, [k]: val }));
  /* Blank optional fields go as null so Publish cannot resurrect them from
     head; see BlogForm. */
  const record = () => ({
    ...v,
    results: v.results.filter(Boolean),
    stack: v.stack.filter(Boolean),
    author: v.author?.trim() ? v.author : null,
    datePublished: v.datePublished?.trim() ? v.datePublished : null,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">{isNew ? "New case study" : v.title || slug}</h1>
      <EditorMessages state={state} />
      <SlugField value={slug} onChange={isNew ? setSlug : undefined} locked={!isNew} />

      <Field label="Title"><input className={inputClass} value={v.title} onChange={(e) => set("title", e.target.value)} /></Field>
      <Field label="Client"><input className={inputClass} value={v.client} onChange={(e) => set("client", e.target.value)} /></Field>
      <Field label="Industry"><input className={inputClass} value={v.industry} onChange={(e) => set("industry", e.target.value)} /></Field>

      <Field label="Pillar" hint="One of the four service pillars. Drives the related links and the structured data.">
        {/* A select, never free text: the value joins an enum the schema
            depends on, and a typo would fail the build rather than degrade. */}
        <select className={inputClass} value={v.pillar} onChange={(e) => set("pillar", e.target.value)}>
          {PILLARS.map((p: string) => <option key={p} value={p}>{p}</option>)}
        </select>
      </Field>

      <Field label="Outcome" hint="One line. Used as the page description in search results.">
        <textarea className={inputClass} rows={2} value={v.outcome} onChange={(e) => set("outcome", e.target.value)} />
      </Field>
      <Field label="Challenge">
        <textarea className={inputClass} rows={4} value={v.challenge} onChange={(e) => set("challenge", e.target.value)} />
      </Field>
      <Field label="What we did">
        <textarea className={inputClass} rows={4} value={v.whatWeDid} onChange={(e) => set("whatWeDid", e.target.value)} />
      </Field>

      <RepeatableList
        label="Results"
        hint="The quantified claims. These are the only numbers on the site, so keep them defensible."
        values={v.results}
        onChange={(x) => set("results", x)}
      />
      <RepeatableList
        label="Technology"
        hint="Platforms and tools used."
        values={v.stack}
        onChange={(x) => set("stack", x)}
      />

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
        <select className={inputClass} value={v.author ?? ""} onChange={(e) => set("author", e.target.value || undefined)}>
          <option value="">Lanshore (no named author)</option>
          {AUTHOR_OPTIONS.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </Field>

      <Field label="Original address" hint="Provenance from the old site. Read-only.">
        <input className={inputClass} value={v.legacyUrl} readOnly disabled />
      </Field>

      <ActionButtons
        state={state} isNew={isNew} isDraft={v.draft !== false}
        onSaveDraft={() => run("saveDraft", record(), sha)}
        onPublish={() => run("publish", record(), sha)}
        onUnpublish={() => run("unpublish", undefined, sha)}
        onDelete={() => run("delete", undefined, sha)}
      />
    </div>
  );
}

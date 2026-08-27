"use client";

import { useState } from "react";
import { PILLARS } from "@/lib/studio/validate";
import { useEditorActions, EditorMessages, Field, ActionButtons, SlugField, inputClass } from "./EditorShell";

export type CaseStudyValues = {
  title: string; client: string; industry: string; pillar: string;
  outcome: string; challenge: string; whatWeDid: string;
  results: string[]; stack: string[]; legacyUrl: string; draft?: boolean;
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
  const record = () => ({ ...v, results: v.results.filter(Boolean), stack: v.stack.filter(Boolean) });

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

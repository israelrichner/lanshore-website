"use client";

import { useState } from "react";
import { useEditorActions, EditorMessages, Field, ActionButtons, SlugField, inputClass } from "./EditorShell";

export type WhitePaperValues = { title: string; description: string; hubspotValue: string; draft?: boolean };

export default function WhitePaperForm({ slug: initialSlug, initial, isNew, sha }: {
  slug: string; initial: WhitePaperValues; isNew: boolean; sha: string | null;
}) {
  const [slug, setSlug] = useState(initialSlug);
  const [v, setV] = useState(initial);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);
  const { state, run } = useEditorActions("whitePapers", slug, isNew);
  const set = <K extends keyof WhitePaperValues>(k: K, val: WhitePaperValues[K]) => setV((p) => ({ ...p, [k]: val }));

  async function onPick(file: File | undefined) {
    setPdfError(null);
    setPdfName(null);
    if (!file) return;
    /* Same module the server uses — client-side checking is a convenience so
       the editor gets a sentence instead of an opaque 413, never the control. */
    const { checkPdf } = await import("@/lib/studio/pdf-check.mjs");
    const head = new Uint8Array(await file.slice(0, 5).arrayBuffer());
    const problem = checkPdf({ type: file.type, size: file.size, head });
    if (problem) {
      setPdfError(problem);
      return;
    }
    setPdfName(file.name);
  }

  const record = () => ({ ...v, file: `/whitepapers/${slug}.pdf`, hubspotValue: v.hubspotValue || slug });

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">{isNew ? "New white paper" : v.title || slug}</h1>
      <EditorMessages state={state} />
      <SlugField value={slug} onChange={isNew ? setSlug : undefined} locked={!isNew} />

      <Field label="Title"><input className={inputClass} value={v.title} onChange={(e) => set("title", e.target.value)} /></Field>
      <Field label="Description">
        <textarea className={inputClass} rows={3} value={v.description} onChange={(e) => set("description", e.target.value)} />
      </Field>

      <Field label="PDF" hint="Up to 4 MB. The file is renamed to match the web address automatically.">
        <input type="file" accept="application/pdf" onChange={(e) => onPick(e.target.files?.[0])} />
      </Field>
      {pdfError && <p className="mt-2 rounded border border-line bg-paper p-3 text-sm text-ink">{pdfError}</p>}
      {pdfName && <p className="mt-2 text-sm text-muted">Checked. Will be stored as {slug}.pdf</p>}

      <Field
        label="HubSpot value"
        hint="Must match an option of the whitepaper_requested contact property. Defaults to the web address; a brand-new value may need adding in HubSpot first."
      >
        <input className={inputClass} value={v.hubspotValue} placeholder={slug} onChange={(e) => set("hubspotValue", e.target.value)} />
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

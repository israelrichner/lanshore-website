"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * The buttons every editor form shares, and the only place that talks to the
 * write API.
 *
 * Typing stays client-side until a button is pressed — keystrokes never
 * generate commits. Each press is one atomic commit (content file + ledger,
 * and for a white paper the PDF too).
 */

export type SaveState = { busy: boolean; errors: string[]; notice: string | null };

export function useEditorActions(collection: string, slug: string, isNew: boolean) {
  const router = useRouter();
  const [state, setState] = useState<SaveState>({ busy: false, errors: [], notice: null });

  async function run(action: string, record: Record<string, unknown> | undefined, expectedSha: string | null) {
    setState({ busy: true, errors: [], notice: null });
    const url = isNew
      ? `/api/studio/content/${collection}`
      : `/api/studio/content/${collection}/${slug}`;
    const body = isNew
      ? { slug, record }
      : { action, record, ...(expectedSha ? { expectedSha } : {}) };

    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch {
      setState({ busy: false, errors: ["Could not reach the server. Check your connection and try again."], notice: null });
      return;
    }

    const json = (await res.json().catch(() => null)) as { errors?: string[] } | null;
    if (!res.ok) {
      setState({
        busy: false,
        /* Show the server's own wording. These are written for an editor —
           "a permanent redirect points at this page" — not stack traces. */
        errors: json?.errors ?? [`Something went wrong (${res.status}).`],
        notice: null,
      });
      return;
    }

    setState({
      busy: false,
      errors: [],
      notice: "Saved. The site rebuilds automatically and usually shows the change within a few minutes.",
    });
    if (isNew) router.push(`/studio/${collection}/${slug}`);
    else router.refresh();
  }

  return { state, run };
}

export function EditorMessages({ state }: { state: SaveState }) {
  if (state.errors.length === 0 && !state.notice) return null;
  return (
    <div className="my-4">
      {state.errors.length > 0 && (
        <ul className="rounded border border-line bg-paper p-3 text-sm text-ink">
          {state.errors.map((e) => (
            <li key={e} className="list-inside list-disc">{e}</li>
          ))}
        </ul>
      )}
      {state.notice && (
        <p className="rounded border border-line bg-paper p-3 text-sm text-ink">{state.notice}</p>
      )}
    </div>
  );
}

export function Field({
  label, hint, children,
}: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="mt-4 block">
      <span className="block text-sm font-semibold text-ink">{label}</span>
      {hint && <span className="block text-xs text-muted">{hint}</span>}
      <span className="mt-1 block">{children}</span>
    </label>
  );
}

export const inputClass =
  "w-full rounded border border-line bg-white px-3 py-2 text-ink focus:border-accent focus:outline-none";

export function ActionButtons({
  state, isNew, isDraft, onSaveDraft, onPublish, onUnpublish, onDelete,
}: {
  state: SaveState;
  isNew: boolean;
  isDraft: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
  onDelete: () => void;
}) {
  const btn = "rounded px-4 py-2 text-sm font-semibold disabled:opacity-50";
  return (
    <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
      <button type="button" disabled={state.busy} onClick={onSaveDraft} className={`${btn} border border-line text-ink`}>
        Save draft
      </button>
      {!isNew && isDraft && (
        <button type="button" disabled={state.busy} onClick={onPublish} className={`${btn} bg-accent text-white`}>
          Publish
        </button>
      )}
      {!isNew && !isDraft && (
        <button type="button" disabled={state.busy} onClick={onUnpublish} className={`${btn} border border-line text-ink`}>
          Unpublish
        </button>
      )}
      {!isNew && (
        <button
          type="button"
          disabled={state.busy}
          onClick={() => {
            /* Delete is permanent and is refused server-side for anything
               ever published. The confirm is a second pair of eyes, not the
               control. */
            if (confirm("Delete this permanently? If it has ever been published, use Unpublish instead.")) onDelete();
          }}
          className={`${btn} ml-auto border border-line text-muted`}
        >
          Delete
        </button>
      )}
    </div>
  );
}

export function SlugField({ value, onChange, locked }: { value: string; onChange?: (v: string) => void; locked: boolean }) {
  return (
    <Field
      label="Web address"
      hint={
        locked
          ? "Fixed. Changing an address breaks existing links, so it needs a developer to add a redirect."
          : "Lowercase letters, numbers and hyphens. This becomes part of the page's URL and cannot be changed later."
      }
    >
      <input
        className={inputClass}
        value={value}
        readOnly={locked}
        disabled={locked}
        onChange={(e) => onChange?.(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
      />
    </Field>
  );
}

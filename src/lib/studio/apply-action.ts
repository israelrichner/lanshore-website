/**
 * Ties the pure pieces together for one editor action.
 *
 * Reads current state from GitHub at head, runs the ledger operation, runs
 * pre-flight, and commits — or returns a refusal and commits nothing.
 *
 * The pieces stay pure and separately tested (ledger-ops.mjs,
 * commit-payload.mjs, validate.ts); this is the only place that performs I/O
 * for a write, so there is exactly one path a change can take to the repo.
 */

import matter from "gray-matter";
import type { GitHubClient } from "./github";
import { commitFiles, commitMessage, ConflictError } from "./commit-payload.mjs";
import { saveDraft, publish, unpublish, remove, LEDGER_PATH, contentPath } from "./ledger-ops.mjs";
import { preflight, type Ledger, type OnDiskEntry } from "./validate";
import type { CollectionKey } from "@/lib/content/loadContent";

export type Action = "saveDraft" | "publish" | "unpublish" | "delete";

/**
 * The shape ledger-ops.mjs returns. Declared here because TypeScript cannot
 * infer the correlation between `refusal` and `changes` across the .mjs
 * boundary — a refusal always carries null changes, but only this type says
 * so, and without it every access below needs a non-null assertion.
 */
type Change = {
  path: string;
  record?: Record<string, unknown>;
  content?: string;
  encoding?: string;
  delete?: boolean;
  expectedSha?: string | null;
};
type OpResult =
  | { refusal: string; changes: null; ledger: null }
  | { refusal: null; changes: Change[]; ledger: Ledger };

const DIRS: Record<CollectionKey, string> = {
  blog: "content/blog",
  caseStudies: "content/case-studies",
  whitePapers: "content/white-papers",
};

/** Blog is Markdown + front matter; the other two are plain JSON. */
export function serialiseRecord(collection: CollectionKey, record: Record<string, unknown>): string {
  if (collection !== "blog") return JSON.stringify(record, null, 2) + "\n";
  const { body, ...front } = record as { body?: string } & Record<string, unknown>;
  return matter.stringify(String(body ?? ""), front);
}

export function parseRecord(collection: CollectionKey, raw: string): Record<string, unknown> {
  if (collection !== "blog") return JSON.parse(raw);
  const g = matter(raw);
  return { ...g.data, body: g.content };
}

/** Everything on disk at head, drafts included — what the ledger rules need. */
async function readState(client: GitHubClient) {
  const ledgerFile = await client.getFile(LEDGER_PATH);
  if (!ledgerFile) throw new Error(`${LEDGER_PATH} not found on ${client.branch}`);
  const ledger = JSON.parse(ledgerFile.content) as Ledger;

  const onDisk = {} as Record<CollectionKey, OnDiskEntry[]>;
  for (const collection of Object.keys(DIRS) as CollectionKey[]) {
    const entries = await client.listDir(DIRS[collection]);
    onDisk[collection] = [];
    for (const e of entries) {
      if (e.type !== "file") continue;
      const slug = e.name.replace(/\.(md|json)$/, "");
      if (e.name === "SLUGS.lock.json") continue;
      const file = await client.getFile(e.path);
      const rec = file ? parseRecord(collection, file.content) : {};
      onDisk[collection].push({ slug, draft: rec.draft === true });
    }
  }
  return { ledger, ledgerSha: ledgerFile.sha, onDisk };
}

export type ActionResult =
  | { ok: true; commitSha: string }
  | { ok: false; status: number; errors: string[] };

export async function applyAction(args: {
  client: GitHubClient;
  collection: CollectionKey;
  slug: string;
  action: Action;
  record?: Record<string, unknown>;
  expectedSha?: string | null;
  author: { name: string; email: string };
  extraFiles?: { path: string; content: string; encoding?: string }[];
}): Promise<ActionResult> {
  const { client, collection, slug, action, author, expectedSha, extraFiles = [] } = args;

  const { ledger, onDisk } = await readState(client);
  const existing = onDisk[collection].some((e) => e.slug === slug);

  /* The record the operation acts on. For publish/unpublish/delete we take
     what is at head rather than what the browser sent, so a stale tab cannot
     resurrect old field values or, worse, a cleared publishedOnce. */
  let record = args.record ?? {};
  if (action !== "saveDraft") {
    const file = await client.getFile(contentPath(collection, slug));
    if (!file) return { ok: false, status: 404, errors: [`"${slug}" no longer exists.`] };
    record = { ...parseRecord(collection, file.content), ...(args.record ?? {}) };
  }

  const op: OpResult =
    action === "saveDraft" ? saveDraft({ collection, slug, record, ledger, isNew: !existing })
    : action === "publish" ? publish({ collection, slug, record, ledger })
    : action === "unpublish" ? unpublish({ collection, slug, record, ledger })
    : remove({ collection, slug, record, ledger });

  /* !== null, not truthiness: the union is discriminated on a nullable
     string, and an empty string is falsy — so `if (op.refusal)` does not
     prove to TypeScript that we are in the non-refusal branch. */
  if (op.refusal !== null) return { ok: false, status: 409, errors: [op.refusal] };

  /* Pre-flight against the state the action WOULD produce. */
  if (action !== "delete") {
    const written = op.changes.find((c) => c.path === contentPath(collection, slug));
    if (!written?.record) {
      return { ok: false, status: 500, errors: ["Internal: the action produced no content change to validate."] };
    }
    const nextOnDisk = { ...onDisk, [collection]: [
      ...onDisk[collection].filter((e) => e.slug !== slug),
      { slug, draft: written.record.draft === true },
    ] };
    const errors = preflight({ collection, slug, record: written.record, ledger: op.ledger, onDisk: nextOnDisk });
    if (errors.length) return { ok: false, status: 422, errors };
  }

  const changes: Change[] = op.changes.map((c) =>
    c.record
      ? { path: c.path, content: serialiseRecord(collection, c.record), expectedSha: expectedSha ?? undefined }
      : c
  );

  try {
    const { commitSha } = await commitFiles({
      client,
      changes: [...changes, ...extraFiles],
      message: commitMessage(collection, (record.title as string) ?? slug),
      author,
    });
    return { ok: true, commitSha };
  } catch (e) {
    if (e instanceof ConflictError) return { ok: false, status: 409, errors: [e.message] };
    return { ok: false, status: 502, errors: [(e as Error).message] };
  }
}

# Plan — Studio editor and GitHub write path (Package 3)

Slug: `studio-editor-write-path` · Approach: pure `.mjs` core (commit payload + ledger mutation) behind a thin injectable-fetch transport, driven by route handlers gated on `requireAdminRoute()` · Blast radius: **~6 modified files, ~18 new, 0 new dependencies** · schema: no

**Source plan:** `docs/plans/dynamic-content-management.md` §P3 (`:864-879`), §§6.5.4, 6.5.5, 6.6, 7.4, 10.5.
**Base branch:** `feat/studio-editor-p3`, cut from `main` @ `1fa4346` (P1+P2 merged).
**Write target:** `main` (owner decision A3).
**Verification:** unit tests only — **no real GitHub API calls** (owner decision A2).

> **MERGE GATE.** P3 must not merge until a real Google sign-in has succeeded through P2 (`assumptions.md` A4). P3 builds a write path to `main`; the gate in front of it has never been exercised.

## Approval

- [ ] **Approved to implement**

## Tasks

### T0 — Strip admin-only fields in all three loaders (BLOCKER B1 fix — must be first)
- **intent:** Stop editorial state ever reaching a public record, before any writer exists to produce it
- **files:** `src/lib/content/loadContent.ts`, `src/lib/content/loadContent.test.mjs`
- **cwd:** none
- **depends:** none
- **verify:** `node --test src/lib/content/loadContent.test.mjs` exits 0 — asserts that a fixture record carrying `draft` and `publishedOnce` yields a public record containing **neither** key, for **all three** collections. AND `npm run build` exits 0. AND the golden diff still shows zero new differences versus P1's capture.
- **removes:** the case-study-only, `draft`-only strip at `src/lib/content/loadContent.ts:179-180`
- **baseline:** **REQUIRED.** `loadCaseStudies` currently strips only `draft` and spreads everything else (`:172-185`); `/case-studies` passes whole records to a `"use client"` grid (`page.tsx:56`), so the RSC payload carries every field — `legacyUrl` and `whatWeDid` are both in P1's golden capture.
- **rollback:** `git checkout src/lib/content/loadContent.ts && git rm -f src/lib/content/loadContent.test.mjs`
- **state-after:** working
- **notes:** **First on purpose** (`04-review.md` M3). If any later task writes `publishedOnce` before this lands, the parity break is live in between and the final diff misattributes it. Use one shared `ADMIN_ONLY_FIELDS` list applied to all three loaders — `loadBlog` and `loadWhitePapers` build records field-by-field and are incidentally safe today, but the rule must be explicit or the next admin-only field repeats this exactly.

### T1 — Extract 301 destinations into a request-safe `.mjs`
- **intent:** Give the request path the 18 live redirect destinations without importing `next.config.ts`
- **files:** `scripts/lib/redirect-destinations.mjs`, `scripts/check-content.mjs`
- **cwd:** none
- **depends:** T0
- **verify:** `node --test scripts/lib/redirect-destinations.test.mjs` exits 0 asserting **5** blog and **13** case-study destinations. AND `npm run check:content` still exits 0 (it now imports the shared module). AND `node -e` confirms no file under `src/` imports `next.config`.
- **removes:** the inline redirect-destination computation in `scripts/check-content.mjs`
- **baseline:** `check-content.mjs` currently derives destinations by importing `next.config.ts` and calling `redirects()`; it reports "5 blog, 13 case studies"
- **rollback:** `git checkout scripts/check-content.mjs && git rm -f scripts/lib/redirect-destinations.mjs`
- **state-after:** working
- **notes:** `04-review.md` M2. Importing `next.config.ts` from a route handler pulls a ~200-entry redirect map into the serverless bundle and relies on an undocumented contract. Generate the list into `.mjs` and have **both** `check-content.mjs` and the admin import it — one source, two readers.

### T2 — `src/lib/studio/github.ts` — transport with injectable fetch
- **intent:** Read files and refs from GitHub at head, with no network in tests
- **files:** `src/lib/studio/github.ts`
- **cwd:** none
- **depends:** T1
- **verify:** `npx tsc --noEmit` exits 0 AND `npm run lint` exits 0 AND `node -e` confirms the module exports a factory taking a `fetch` implementation (no bare `globalThis.fetch` at module scope)
- **removes:** none
- **baseline:** none — new module
- **rollback:** `git rm -f src/lib/studio/github.ts`
- **state-after:** working
- **notes:** `getFile(path)` returns decoded content **and the blob `sha`**; `listDir(path)` for index views. **The admin reads exclusively through this, never through `loadContent`** (`04-review.md` B2): local files are whatever the last deploy bundled, so between an editor's commit and Vercel finishing they are stale — an editor would publish and then not see their own change. Mirrors `createJwksCache`'s injectable-fetch shape (`google.mjs:131`).

### T3 — `src/lib/studio/commit-payload.mjs` — the atomic commit, as a pure function
- **intent:** Build the five-call Git Data sequence as testable data, not as network side effects
- **files:** `src/lib/studio/commit-payload.mjs`, `src/lib/studio/commit-payload.test.mjs`
- **cwd:** none
- **depends:** T2
- **verify:** `node --test src/lib/studio/commit-payload.test.mjs` exits 0 — with an injected fake fetch, asserts: one commit carries **all** changed files; `base_tree` is head's tree; parent is head; `author` is the signed-in editor's name+email; message matches `content(<collection>): update "<title>" [studio]`; a **stale blob sha** produces the precise reload message with **no** commit attempted; a **non-fast-forward** `PATCH` retries **exactly once** then surfaces the same message; `force` is never `true`
- **removes:** none
- **baseline:** none — new module
- **rollback:** `git rm -f src/lib/studio/commit-payload.mjs src/lib/studio/commit-payload.test.mjs`
- **state-after:** working
- **notes:** Source plan §6.5.4. **This is the logic §10.6 says has no automated coverage** and that E3 alone verifies. Making it pure is what closes that. Two-level conflict detection: per-item blob-sha compare gives a precise message, `force: false` closes the race the first check cannot see. `assumptions.md` A1 — these tests pin *our* payloads and *our* handling of documented responses; they cannot prove GitHub accepts them.

### T4 — `src/lib/studio/ledger-ops.mjs` — the four buttons
- **intent:** Encode §6.6's button semantics as pure functions so each row is a test, not a manual walk
- **files:** `src/lib/studio/ledger-ops.mjs`, `src/lib/studio/ledger-ops.test.mjs`
- **cwd:** none
- **depends:** T3
- **verify:** `node --test src/lib/studio/ledger-ops.test.mjs` exits 0 covering every row of §6.6: save-draft-new appends the slug **in the same change set** as the file; publish sets `draft:false` **and** `publishedOnce:true` and leaves the ledger alone; unpublish flips `draft` back and is **refused** when the slug is a live 301 destination; delete removes a never-published slug and is **refused** when `publishedOnce` is set. **Explicitly including the publish → unpublish → delete sequence** (`04-review.md` m3). AND every resulting state is fed through `checkLedger()` and passes.
- **removes:** none
- **baseline:** none — new module
- **rollback:** `git rm -f src/lib/studio/ledger-ops.mjs src/lib/studio/ledger-ops.test.mjs`
- **state-after:** working
- **notes:** Source plan §6.6 — three of these four buttons failed the build under v2 (blocker B1). `publishedOnce` is **monotonic**: set by Publish, never cleared, not by Unpublish. The publish→unpublish→delete case is the one a naive "refuse if currently published" check lets through, permanently removing a once-live URL with no paired 301. Delete is **also** refused for a 301 destination — two independent guards, because the cost of getting it wrong is a dead URL.

### T5 — `src/lib/studio/validate.ts` — pre-flight, sharing the build gate's rules
- **intent:** Turn a rule violation into an inline form error instead of a Vercel failure email
- **files:** `src/lib/studio/validate.ts`, `src/lib/studio/validate.test.mjs`
- **cwd:** none
- **depends:** T4
- **verify:** `node --test src/lib/studio/validate.test.mjs` exits 0 asserting the **same fixture** is rejected by the pre-flight and by `check-content.mjs`'s exports, with the same rule firing. AND `npx tsc --noEmit` exits 0. AND `node -e` confirms `validate.ts` declares no validation rule of its own — it only re-exports from `scripts/lib/content-rules.mjs`.
- **removes:** none
- **baseline:** `scripts/lib/content-rules.mjs` exports `VALIDATORS :263` and `checkLedger :289`, covered by 30 passing tests
- **rollback:** `git rm -f src/lib/studio/validate.ts src/lib/studio/validate.test.mjs`
- **state-after:** working
- **notes:** Source plan `:870` — a typed re-export, **never** a second implementation. `04-review.md` m2: if pre-flight and build gate diverge, the failure mode moves from an inline error to an email a non-developer cannot act on.

### T6 — Write route handlers, gated on `requireAdminRoute()`
- **intent:** The HTTP surface the forms call, with the authorization boundary visible on line one
- **files:** `src/app/api/studio/content/[collection]/route.ts`, `src/app/api/studio/content/[collection]/[slug]/route.ts`
- **cwd:** none
- **depends:** T5
- **verify:** `npm run build` exits 0, then with `npx next start` running and **no session cookie**: every write route returns **404** with a zero-byte body. AND `node -e` asserts `requireAdminRoute` is the **first statement** of every exported handler (appears before any `request.json`/`formData` call in each file). AND `npx tsc --noEmit` and `npm run lint` exit 0.
- **removes:** none
- **baseline:** **REQUIRED.** `requireAdminRoute()` (`src/lib/studio/session.ts:85`) currently has **0 callers** and no test — P2's own security report flags it as unproven code. Capture that it exists and is unexercised.
- **rollback:** `git rm -rf src/app/api/studio/content`
- **state-after:** working
- **notes:** `03-design.md` Fork 2 — route handlers over Server Actions specifically so the boundary is greppable and testable. **Before reading the body**, not after: a handler that parses input first has already done work for an unauthenticated caller.

### T7 — Replace the placeholder dashboard with a real index
- **intent:** List the three collections and their items, read from GitHub at head
- **files:** `src/app/studio/(gated)/page.tsx`
- **cwd:** none
- **depends:** T6
- **verify:** `npm run build` exits 0 AND `npm run lint` exits 0 AND `node -e` confirms `src/app/studio/(gated)/page.tsx` no longer contains "Nothing to edit yet" AND, with a valid session cookie, `/studio` returns 200 and lists all three collection names
- **removes:** the placeholder dashboard body ("Nothing to edit yet") in `src/app/studio/(gated)/page.tsx`
- **baseline:** **REQUIRED.** `/studio` currently renders the placeholder and "Signed in as <email>".
- **rollback:** `git checkout "src/app/studio/(gated)/page.tsx"`
- **state-after:** working
- **notes:** Reads via T2's client, **not** `loadContent` (`04-review.md` B2). Keep the sign-out form.

### T8 — Blog editor form with live Markdown preview
- **intent:** The editing surface, and the preview that makes preview deployments unnecessary
- **files:** `src/app/studio/(gated)/blog/[slug]/page.tsx`, `src/components/studio/BlogForm.tsx`, `src/components/studio/MarkdownPreview.tsx`
- **cwd:** none
- **depends:** T7
- **verify:** `npm run build` and `npm run lint` exit 0 AND `npx tsc --noEmit` exits 0 AND `node -e` confirms `MarkdownPreview.tsx` imports the **same** `@/components/Markdown` the public page uses, and defines no renderer of its own
- **removes:** none
- **baseline:** none — new routes
- **rollback:** `git rm -rf "src/app/studio/(gated)/blog" src/components/studio`
- **state-after:** working
- **notes:** Source plan §6.5.5. Slug free on create (validated against `SLUG_RE`, collision-checked), **read-only forever after**, with inline text explaining renames need a developer. Typing stays client-side; keystrokes never commit. The preview **must** render through the public `<Markdown>` — a second renderer makes preview ≠ published, which is the one thing this pane exists to prevent.

### T9 — Case-study and white-paper forms, including PDF upload
- **intent:** The remaining two collections, with the upload constraints enforced where the editor can see them
- **files:** `src/app/studio/(gated)/case-studies/[slug]/page.tsx`, `src/app/studio/(gated)/white-papers/[slug]/page.tsx`, `src/components/studio/CaseStudyForm.tsx`, `src/components/studio/WhitePaperForm.tsx`, `src/lib/studio/pdf-check.mjs`, `src/lib/studio/pdf-check.test.mjs`
- **cwd:** none
- **depends:** T8
- **verify:** `node --test src/lib/studio/pdf-check.test.mjs` exits 0 — rejects a non-`application/pdf` type, rejects a file whose first bytes are not `%PDF-` **even when the declared type is correct**, rejects over 4 MB, and normalises the filename to `<slug>.pdf`. AND `npm run build`, `npm run lint`, `npx tsc --noEmit` all exit 0. AND `node -e` confirms `pillar` renders as a `<select>` over `PILLARS` and never a free-text input.
- **removes:** none
- **baseline:** none — new routes
- **rollback:** `git rm -rf "src/app/studio/(gated)/case-studies" "src/app/studio/(gated)/white-papers" src/lib/studio/pdf-check.mjs`
- **state-after:** working
- **notes:** `04-review.md` M1 — **two different limits**: the inbound multipart request is bounded by Vercel's ~4.5 MB body cap, and the outbound base64 to GitHub inflates ~33% (a 4 MB file → ~5.3 MB). Comfortable today (largest current PDF is 696 KB), but enforce the cap on **both** sides so the editor sees a clear error rather than an opaque 413. Sniff `%PDF-` rather than trusting the declared type. `legacyUrl` is read-only provenance.

### T10 — `docs/CONTENT-EDITING.md`
- **intent:** The document a non-developer actually needs
- **files:** `docs/CONTENT-EDITING.md`
- **cwd:** none
- **depends:** T9
- **verify:** `node -e` asserts the file exists and contains sections covering: signing in, adding/editing/unpublishing each of the three types, the `dateModified` rule, drafts, what happens after Publish and how long it takes, how to tell a deploy failed, that slug renames need a developer, **why Unpublish is the tool for "take it down" and Delete is refused for anything ever published**, that the admin does not work on preview URLs, and **the `GITHUB_TOKEN` expiry date and who rotates it**
- **removes:** none
- **baseline:** none — new file
- **rollback:** `git rm -f docs/CONTENT-EDITING.md`
- **state-after:** working
- **notes:** Source plan `:878`. The token-expiry line is the one that matters most: the failure mode is "Publish silently stops working", a year from now, to someone who was not part of this. Also record `04-review.md` m1 — commits are authored with the editor's Google email, which will not link to a GitHub profile.

### T11 — Final verification and P1/P2 parity
- **intent:** Prove P3 added a write path without disturbing the public site or the gate
- **files:** none (verification only)
- **cwd:** none
- **depends:** T10
- **verify:** `npm run build` exits 0 with all gates green; full test suite green; P2's proxy baseline replays clean (`node .grokbit/plans/studio-auth-boundary/test/baseline/proxy-behaviour.mjs`, 16/16); and a fresh capture of all 56 public routes shows **zero new differences** versus P1's golden set beyond the 5 blog pages already justified in P1's R1
- **removes:** none
- **baseline:** **REQUIRED.** P1's golden capture and P2's proxy baseline, both already committed.
- **rollback:** n/a — read-only
- **state-after:** working
- **notes:** P3 adds routes and a client; it must change **nothing** on the public site. The `publishedOnce` field is the specific risk (T0's fix), and this is where that is proven end to end rather than in isolation.

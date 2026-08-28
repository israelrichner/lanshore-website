# Design — studio-editor-write-path (P3)

## Fork 1 — Where does the write logic live, given it must be testable without network?

| | Approach | Trade-off |
|---|---|---|
| **A (chosen)** | Split: a **pure `.mjs` core** that *builds* the commit payload and *mutates* the ledger, plus a thin `.ts` transport that performs the HTTP calls with an **injectable `fetch`** | Two files instead of one. But it makes the two things source plan §10.6 says are untestable — the atomic-commit payload and the per-button ledger semantics — into ordinary unit tests. |
| B | One `github.ts` doing shape and transport together | Fewer files, and matches the plan's literal "`src/lib/studio/github.ts`". Untestable without either network access or heavy mocking of a `.ts` module `node --test` cannot even load. |

**Chosen: A.** §10.6 states plainly that the write layer and ledger mutation have **no automated coverage**, and that E3/E11 are their only verification — both owner-driven, on a deployment, with real side effects. Given the owner has deferred real API calls, B would ship this package with **zero** verification of its riskiest logic. A closes most of that gap for the cost of one extra file.

The split also mirrors what P1 and P2 already do (`content-rules.mjs` + `loadContent.ts`; `session.mjs` + `session.ts`), so it is the repo's established shape rather than a new invention.

## Fork 2 — Server Actions or route handlers?

| | Approach | Trade-off |
|---|---|---|
| **A (chosen)** | Route handlers under `/api/studio/*`, called by client forms | Explicit boundary: `requireAdminRoute()` is literally the first statement, and that is checkable by grep and by test. |
| B | Server Actions | Less plumbing, but the authorization boundary becomes implicit and per-action, and the plan's own rule — "`requireAdmin()` as the first statement, before reading the body" — becomes something you have to trust rather than see. |

**Chosen: A**, and the deciding factor is that `requireAdminRoute()` (`session.ts:85`) exists, is designed for exactly this, and is **currently uncalled and untested**. Making it the visible first line of every write route is what turns it from unproven code into an exercised control.

## Fork 3 — How is "was this ever published?" recorded? *(the `02-survey.md` S6 problem)*

Source plan §6.6 requires Delete to be refused for a published item and allowed for a never-published one. Current state cannot distinguish "never published" from "published then unpublished".

| | Approach | Trade-off |
|---|---|---|
| **A (chosen)** | **Publish stamps a durable `publishedOnce: true`** into the record. Delete refuses whenever it is set. | One optional boolean per record. Monotonic — never cleared, including by Unpublish. Trivially checkable, and honest about what it means. |
| B | Read the file's commit history through the API | Expensive on every Delete, needs an extra token scope, and a squashed or rewritten history silently lies. |
| C | Approximate: refuse only if currently `draft: false` | **Wrong, and dangerously so.** Publish → Unpublish → Delete would sail through and permanently remove a URL that was live, with no paired 301 — precisely the outcome §6.6 exists to prevent. |

**Chosen: A.** C is the option a hurried implementer picks, and it defeats the rule while appearing to implement it.

`publishedOnce` is additive and optional, so every existing content file stays valid. The three validators gain one optional-boolean check.

**Second, independent guard:** Delete is *also* refused when the slug is one of the 18 live 301 destinations, from `next.config.ts`'s own `redirects()`. Belt and braces, because the cost of getting this wrong is a permanently dead URL.

## The atomic commit (source plan §6.5.4)

Five calls, one commit:

1. `GET /git/ref/heads/{branch}` → head sha
2. `POST /git/blobs` per changed file → blob shas
3. `POST /git/trees` with `base_tree` = head's tree → tree sha
4. `POST /git/commits` with that tree, head as parent, **author = the signed-in editor**
5. `PATCH /git/refs/heads/{branch}` with **`force: false`**

**Conflict detection at two levels, because they catch different things:**

- **Per-item, precise:** compare the blob `sha` the editor loaded against the one at current head. Different → stop with *"This item changed since you opened it — reload to see the current version."*
- **Race, at the ref:** `force: false` rejects a non-fast-forward if the branch moved between steps 1 and 5. Retry **once** against the new head, then surface the same message.

The first gives a useful message; the second closes the window the first cannot see. Two editors cannot silently clobber each other.

**Why atomic matters, restated:** every editor action touches two or three files — content, ledger, and for a white paper the PDF. With one commit per file there is no ordering that leaves a valid intermediate state: ledger-first names a file that does not exist; content-first leaves a file the ledger does not list. Either way the first commit triggers a Vercel build that **fails**, so every publish would emit a failure email followed by a success email.

## Ledger mutation — the four buttons

Pure functions in `.mjs`, so each row below is a unit test rather than a manual E11 walk.

| Button | Content file | Ledger | Refusal condition |
|---|---|---|---|
| Save draft (new) | created, `draft: true` | slug **appended** | slug collides, or fails validation |
| Save draft (existing) | updated | unchanged | validation |
| Publish | `draft: false`, **`publishedOnce: true`** | unchanged | validation |
| Unpublish | `draft: true` | unchanged | **slug is a live 301 destination** |
| Delete | removed | slug **removed** | **`publishedOnce` set**, or slug is a live 301 destination |

Every mutation is fed through `checkLedger()` (`content-rules.mjs:289`) **before** the commit is built. A violation is an inline form error and no API call is made.

## Pre-flight, not post-mortem

`check:content` at build time is the backstop for hand edits. The admin runs the same rules **before committing**, so the editor sees a form error rather than a Vercel failure email. Same module, one implementation.

## Supersession dispositions

| Item | Disposition | Reason |
|---|---|---|
| `requireAdminRoute()` (`session.ts:85`, 0 callers) | **REPLACE** its unused status | Becomes the first statement of every write route. It is currently untested; P3's route tests are its first exercise. |
| Placeholder dashboard `(gated)/page.tsx` | **REPLACE** | Becomes a real index listing the three collections. Its own task with a `removes:`. |
| Redirect-destination computation in `check-content.mjs` | **COEXIST**, via extraction | The same computation is needed at request time. Extracted into `.mjs` and imported by both — not duplicated, and not left in a build-only script the request path cannot reach. |
| `content/SLUGS.lock.json` | **COEXIST** | P3 becomes its first writer; readers unchanged. |
| `scripts/lib/content-rules.mjs` validators | **LEAVE** | Reused wholesale. `validate.ts` is a typed re-export (source plan `:870`), never a second implementation. |
| `<Markdown>` component | **LEAVE** | Reused verbatim for the preview pane; a second renderer would make preview ≠ published. |

**Net-additive check:** two genuine `REPLACE`s and one extraction, so this is not a silent-COEXIST plan.

## What this design does not attempt

No React component tests, no visual regression, no accessibility automation — consistent with §10.6. The gap that *is* closed is the one §10.6 called out as most serious: the atomic-commit payload and the ledger mutation are pure and unit-tested here.

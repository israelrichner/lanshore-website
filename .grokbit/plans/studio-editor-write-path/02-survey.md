# Survey — studio-editor-write-path (P3)

Read from disk 2026-08-27 on `feat/studio-editor-p3`, cut from `main` @ `1fa4346` (P1+P2 merged).

## S1 — What P2 leaves for P3 (all verified)

| Entity | Location | Note for P3 |
|---|---|---|
| `requireAdminRoute()` | `src/lib/studio/session.ts:85` | **Exists, and is currently called by nothing.** Written for exactly this package. Returns `{ok:true,session}` or `{ok:false,response}` (bare 404). |
| `requireAdmin()` | `session.ts:71` | Page boundary; fails only via `notFound()` |
| `getSession()` | `session.ts:50` | Returns `{email, iat, exp}` — the commit author identity |
| `getAdminConfig()` | `session.ts:39` | Fail-closed config reader |
| `secureCookies` | `redirect-uri.ts:29` | Reusable |
| `<Markdown>` | `src/components/Markdown.tsx` | **The live-preview pane must render through this exact component**, or preview ≠ published |

## S2 — `scripts/lib/content-rules.mjs` — reuse, never reimplement

Exports verified at `scripts/lib/content-rules.mjs`:

```
SLUG_RE :19      DATE_RE :20        PILLARS :109       COLLECTIONS :116
blocksToMarkdown :57                markdownToBlocks :91
escapeParagraph :39                 unescapeParagraph :48
derivesMentionsGartner :104
validateBlogPost :179  validateCaseStudy :215  validateWhitePaper :240
VALIDATORS :263        checkLedger :289
```

`checkLedger` already implements **L1–L4** and is covered by 30 passing tests. P3's pre-flight validation is a **caller** of this, not a second implementation. Source-plan task `:870` is explicit: `validate.ts` is a typed re-export, not a reimplementation.

## S3 — The ledger

`content/SLUGS.lock.json`: keys `version, blog, caseStudies, whitePapers, retired`; counts **5 / 14 / 5**, `retired: []`.

## S4 — What does not exist

| Path | State |
|---|---|
| `src/lib/studio/github.ts` | **DOES NOT EXIST** |
| `src/lib/studio/validate.ts` | **DOES NOT EXIST** |
| `src/app/studio/(gated)/<collection>/**` | **DOES NOT EXIST** — the dashboard is a placeholder |
| `docs/CONTENT-EDITING.md` | **DOES NOT EXIST** |
| Any GitHub API client | **DOES NOT EXIST** — no dependency, no wrapper |

## S5 — Record shapes the forms must produce

`src/lib/content/loadContent.ts`: `BlogRecord :97`, `CaseStudyRecord :156`, `WhitePaperRecord :191`, `FaqEntry :38`, `CollectionKey :40`.

Content file formats, from P1: blog = Markdown + front matter (`gray-matter`); case studies and white papers = plain JSON, slug from filename.

## S6 — The "was it ever published?" problem — NOT ANSWERABLE from current state

Source plan §6.6 requires Delete to be **refused for a published item** and **allowed for a never-published one**. But a content file records only its *current* `draft` value. An item published and then unpublished is byte-indistinguishable from one that was never published.

Options: query commit history through the API (expensive, and a rewritten history lies), or record the fact. **No existing field carries it** — `BlogRecord :97` has no such flag. Design must resolve this rather than hand-wave it.

## S7 — 301 destinations (rule L4 input)

From `next.config.ts` via its own `redirects()`: **5** blog + **13** case-study concrete destinations, already computed this way by `scripts/check-content.mjs`. P3's pre-flight must use the same source, not a regex.

## S8 — Testability constraints

- `node --test` cannot load `.ts`. Anything P3 wants covered must live in `.mjs` with **no `@/*` imports** — the rule P1 and P2 both follow.
- The owner has chosen **unit tests only, no real API calls** (`01-intent.md` A2). The GitHub client must therefore take an **injectable fetch**, exactly as `createJwksCache` takes `fetchJwks` (`src/lib/studio/google.mjs:131`).
- **§10.6 of the source plan states the write layer and ledger-mutation logic have NO automated coverage** and that E3/E11 are their only verification. That is the single largest quality gap in the whole project, and it is addressable: the ledger mutation and the commit-payload builder are both pure functions if written that way.

## S9 — Supersession

| Item | Callers | Note |
|---|---|---|
| `requireAdminRoute()` | **0** | P3 is its first caller. Currently unused *and untested* — P2's own security report flags it as unproven code that will guard the first write endpoint. |
| Placeholder dashboard `(gated)/page.tsx` | 1 route | Replaced by a real index |
| `scripts/check-content.mjs` redirect-destination logic | 1 | Same computation needed at request time. Extract or duplicate — design must choose. |
| `content/SLUGS.lock.json` | read by `loadContent.ts:51`, `check-content.mjs` | P3 becomes its first **writer** |

**Net-additive check:** P3 is mostly additive, but it has one genuine `REPLACE` (the placeholder dashboard) and one shared-logic decision (redirect destinations). Both get dispositions in the design.

## S10 — Shortcuts disclosed

- GitHub's Git Data API semantics are **external** and unverifiable from this repo; every claim comes from source plan §6.5.4 and stays `UNVERIFIED` until a real commit is attempted — which the owner has explicitly deferred.
- Caller counts are from `grep` over `src/` and `scripts/`, not a call graph.

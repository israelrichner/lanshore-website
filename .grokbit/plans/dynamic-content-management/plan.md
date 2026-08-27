# Plan — Dynamic content management, Package 1 (repo-native content source)

Slug: `dynamic-content-management` · Approach: migrate 24 items from inline `.ts` arrays to `content/**` files behind unchanged exports · Blast radius: **11 repo files + 24 new content files** · schema: no

**Source plan:** `docs/plans/dynamic-content-management.md` §P1 (`:827-843`). **Scope: P1 only** — P2/P3 need owner-supplied secrets (see `01-intent.md`).
**Base branch:** `feat/content-migration-p1` off `preview/faq-agentic-spm` (NOT `main` — see `02-survey.md` §S0).
**Golden baseline dir:** `$SCRATCH/golden` where `$SCRATCH` = `C:/Users/israe/AppData/Local/Temp/claude/C--Users-israe-Projects-lanshore-web/6a245150-5817-46da-8382-a45356e2fdf7/scratchpad`

> Keep the task block format exactly as below. The Implement phase parses it.

## Approval

- [x] **Approved to implement** — tick before T1's Write step.

**Basis:** owner instruction 2026-08-26, *"do 1 and 2, then implement the plan"*, given after being shown the P1-only scoping. The one decision that could not be inferred — the base branch (survey S0) — was put to the owner separately and answered `preview/faq-agentic-spm`.

**What approval does NOT cover:** P2 and P3. On completion of P1 the site is **not** yet editable by a non-developer — see `assumptions.md` A2. P1 builds the substrate only.

## Tasks

### T0 — Capture the golden baseline (UNRECOVERABLE IF SKIPPED)
- **intent:** Freeze the exact pre-migration HTML of every affected route so T11 can prove byte-for-byte parity
- **files:** none (writes only to the scratchpad, outside the repo)
- **cwd:** none
- **depends:** none
- **verify:** the golden dir holds **>= 30** `.html` captures AND non-empty `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`
- **removes:** none
- **baseline:** none (this task *is* the baseline)
- **rollback:** n/a — additive, outside the repo
- **state-after:** working
- **notes:** Routes: 5 `/blog/<slug>`, 14 `/case-studies/<slug>`, every `/industries/<slug>`, plus `/blog`, `/case-studies`, `/resources`, `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/llms-full.txt`. White papers have no detail route — they surface on `/resources`. Source plan `:831`. **Must run before any edit lands.**

### T1 — Add the three runtime dependencies and pin engines.node
- **intent:** Make `gray-matter`, `react-markdown`, `remark-gfm` available; pin the Node version the `.mjs` scripts assume
- **files:** `package.json`, `package-lock.json`
- **cwd:** none
- **depends:** T0
- **verify:** `npx tsc --noEmit` exits 0 AND a node resolve check for all three packages exits 0 AND `package.json` has a non-empty `engines.node`
- **removes:** none
- **baseline:** repo currently has 4 runtime deps and no `engines` field (survey S8)
- **rollback:** `git checkout package.json package-lock.json` then `npm ci`
- **state-after:** working
- **notes:** **Triggers the Loop I4 dependency gate** — all three must clear it before install. Source plan `:832` (review M1). Real departure from the repo's minimal-dependency norm; note it in the PR body.

### T2 — `scripts/lib/content-rules.mjs` — the single source of validation truth
- **intent:** One `.mjs` module implementing field validation + ledger rules L1–L4, imported by the migrator, the checker, and (in P3) the admin — never reimplemented
- **files:** `scripts/lib/content-rules.mjs`, `scripts/lib/content-rules.test.mjs`
- **cwd:** none
- **depends:** T1
- **verify:** `node --test scripts/lib/content-rules.test.mjs` exits 0 — self-contained assertions covering each field rule and L1–L4, both accept and reject
- **removes:** none
- **baseline:** no validation module exists (survey S8)
- **rollback:** `git rm -f scripts/lib/content-rules.mjs scripts/lib/content-rules.test.mjs`
- **state-after:** working
- **notes:** Plain `.mjs`, **no TypeScript, no `@/*` aliases** — a `.mjs` script cannot import a `.ts` module (source plan `:833`, `:870`). Must enforce the white-paper rule that `file` equals `/whitepapers/<slug>.pdf`, which `src/lib/whitePapers.ts:24-33` throws on today. `node --test` is built into Node 22 — no new package.

### T3 — `scripts/migrate-content.mjs` + generate the 24 content files
- **intent:** Convert the three inline arrays to `content/**` files with a proven-lossless round trip
- **files:** `scripts/migrate-content.mjs`, `content/blog/*.md` (5), `content/case-studies/*.json` (14), `content/white-papers/*.json` (5)
- **cwd:** none
- **depends:** T2
- **verify:** `node scripts/migrate-content.mjs --verify` exits 0 — re-parses every generated file and asserts deep-equality against the original in-memory arrays; a single mismatch exits non-zero. Then counts must be 5 / 14 / 5.
- **removes:** none (the `.ts` arrays are removed in T5, not here)
- **baseline:** 24 items live inline; block census `p` 160 / `h3` 30 / `h2` 28 / `li` 16 (survey S2)
- **rollback:** `git rm -rf content scripts/migrate-content.mjs`
- **state-after:** working (nothing reads `content/` yet)
- **notes:** **Implement the escaping table and the round-trip assertion BEFORE generating anything** (source plan `:834`, review M2). Escaping scope per survey S2: the ONLY hostile construct is a `p` block whose text starts with a digit-then-period-then-space; there are **10** such blocks — escape the period. The 5 `h3` blocks with the same prefix need NO escape. No underscore, asterisk, bracket, or leading `#`/`-`/`>` occurs anywhere in any block text. Seed `featured`/`summary` from `src/app/resources/page.tsx:24-62`.

### T4 — `src/lib/content/loadContent.ts` — the fs read layer
- **intent:** Read, parse, validate and draft-filter `content/**` at module scope
- **files:** `src/lib/content/loadContent.ts`
- **cwd:** none
- **depends:** T3
- **verify:** `npx tsc --noEmit` exits 0 AND `npm run build` exits 0
- **removes:** none
- **baseline:** no such module (survey S8)
- **rollback:** `git rm -rf src/lib/content`
- **state-after:** working
- **notes:** Slug derives from filename. **Unconditional `draft` filtering** (source plan §6.3). Throw on invalid — a bad file must fail the build, matching today's `whitePapers.ts` behavior. Derive `mentionsGartner` here (§6.8, case-insensitive) — T8 consumes it.

### T5 — Rewrite the three loaders on top of loadContent, preserving every export
- **intent:** Swap the data source without changing the API any of the 12 consumers use
- **files:** `src/lib/blog.ts`, `src/lib/caseStudies.ts`, `src/lib/whitePapers.ts`
- **cwd:** none
- **depends:** T4
- **verify:** `npm run build` exits 0 AND `npx tsc --noEmit` exits 0 with all 12 consumers unmodified AND `src/lib/blog.ts` is under 4 KB (the 1027-line array must be gone)
- **removes:** the inline `BLOG_POSTS` array (`src/lib/blog.ts:24-1023`), `CASE_STUDIES` array (`src/lib/caseStudies.ts:18-297`), `WHITE_PAPERS` array (`src/lib/whitePapers.ts:34-75`)
- **baseline:** blog.ts 1027 lines, caseStudies.ts 301, whitePapers.ts 88 (survey S1)
- **rollback:** `git checkout src/lib/blog.ts src/lib/caseStudies.ts src/lib/whitePapers.ts`
- **state-after:** working
- **notes:** **Preserve every exported name and type** — `BLOG_POSTS`, `getPost`, `BlogPost`, `BlogBlock`, `CASE_STUDIES`, `getCaseStudy`, `CaseStudy`, `WHITE_PAPERS`, `getWhitePaper`, `WhitePaper`. **Keep the white-paper path assertions** (`:24-33`, `:77-84`). Add optional per-study `dateModified` (falls back to `UPDATED.caseStudies`) and optional `hubspotValue` defaulting to slug. Source plan `:836`.

### T6 — outputFileTracingIncludes for /api/whitepaper
- **intent:** Make `content/white-papers/` reachable from inside the Vercel serverless function
- **files:** `next.config.ts`
- **cwd:** none
- **depends:** T5
- **verify:** `npm run build` exits 0 AND `next.config.ts` contains both `outputFileTracingIncludes` and `/api/whitepaper`
- **removes:** none
- **baseline:** `outputFileTracing` **absent** from `next.config.ts` (survey S4 — blocker B2 confirmed real)
- **rollback:** `git checkout next.config.ts`
- **state-after:** working
- **notes:** Source plan `:837`. **Leave every existing redirect untouched** — 5 `MIGRATED_POSTS` (`:72-78`) and 13 case-study destinations (`:7-69`). Local `next start` reads the real filesystem and passes regardless; this is only truly provable on a deployed preview (source plan §10.2), which is **out of scope for this session** — recorded in `assumptions.md` A3.

### T7 — `src/components/Markdown.tsx` and wire it into the blog detail page
- **intent:** Render Markdown bodies with the exact classes the block renderer produced
- **files:** `src/components/Markdown.tsx`, `src/app/blog/[slug]/page.tsx`
- **cwd:** none
- **depends:** T6
- **verify:** `npm run build` exits 0 AND `npm run lint` exits 0
- **removes:** `groupBlocks` and `linkify` from `src/app/blog/[slug]/page.tsx` (`:38-59`, `:61-78`) and their call sites (`:116-145`)
- **baseline:** class contract captured in survey S7
- **rollback:** `git checkout src/app/blog/[slug]/page.tsx` then `git rm -f src/components/Markdown.tsx`
- **state-after:** working
- **notes:** `react-markdown` + `remark-gfm`, explicit component map from survey S7, default `urlTransform` kept, **no `rehype-raw`** (source plan `:838`). `remark-gfm` autolinks bare URLs but **does not replicate the old linkify trailing-punctuation trimming** — T11's golden diff is what catches drift here.

### T8 — Replace the GARTNER_PATHS JSON.stringify heuristic
- **intent:** Keep the Gartner trademark footnote firing after `blocks[]` leaves the serialized object
- **files:** `src/components/Footer.tsx`
- **cwd:** none
- **depends:** T7
- **verify:** `npm run build` exits 0 AND `src/components/Footer.tsx` no longer contains `JSON.stringify` AND the `/blog/*` paths in the built footnote set match the T0 baseline
- **removes:** the `JSON.stringify` Gartner filter at `src/components/Footer.tsx:23-25`
- **baseline:** `GARTNER_PATHS` at `Footer.tsx:14`, heuristic at `:23`, consumed at `:140` (survey S0/S3)
- **rollback:** `git checkout src/components/Footer.tsx`
- **state-after:** working
- **notes:** Source plan `:839` (review M3). Swap to `p.mentionsGartner` from T4. **This is the task that is impossible on `main`** — see survey S0. The trademark obligation lives at `src/lib/site.ts:12-21`; getting this wrong silently drops a legal footnote.

### T9 — Rewire resources, the case-study date, and the three index lastmod values
- **intent:** Remove the duplicated blog list and derive index dates from content instead of hand-maintained constants
- **files:** `src/app/resources/page.tsx`, `src/app/case-studies/[slug]/page.tsx`, `src/app/sitemap.ts`, `src/lib/contentDates.ts`
- **cwd:** none
- **depends:** T8
- **verify:** `npm run build` exits 0 AND a recursive grep for `blogIndex` under `src/` returns nothing
- **removes:** the hardcoded `BLOG_POSTS` array in `src/app/resources/page.tsx:24-62`; the `blogIndex` key in `src/lib/contentDates.ts:26`
- **baseline:** `UPDATED.blogIndex` has exactly ONE reader, `sitemap.ts:27` (survey S5) — deletion is safe
- **rollback:** `git checkout src/app/resources/page.tsx src/app/case-studies/[slug]/page.tsx src/app/sitemap.ts src/lib/contentDates.ts`
- **state-after:** working
- **notes:** Source plan `:840`. Index `lastmod` lines are `sitemap.ts:25` (`/case-studies`), `:27` (`/blog`), `:28` (`/resources`) — derive each as the max `dateModified` over its collection. Source plan `:843` asserts these compute to the values already in the file, so **the sitemap must not change** — T11 proves it. `case-studies/[slug]/page.tsx:50` takes the optional per-study date. **Also confirm `CaseStudyGrid.tsx` and `WhitePaperGate.tsx` remain type-only importers** (task `:841`) — survey S3 says they are; this is a check, not an edit.

### T10 — content/SLUGS.lock.json + scripts/check-content.mjs + npm wiring
- **intent:** Make a slug deletion or rename fail the build instead of silently 404ing a live URL
- **files:** `content/SLUGS.lock.json`, `scripts/check-content.mjs`, `package.json`
- **cwd:** none
- **depends:** T9
- **verify:** `npm run check:content` exits 0 on the clean tree; a deliberate temporary slug rename makes it exit **non-zero** (proving the gate bites); restoring passes again
- **removes:** none
- **baseline:** no slug lock or content checker exists
- **rollback:** `git checkout package.json` then `git rm -f content/SLUGS.lock.json scripts/check-content.mjs`
- **state-after:** working
- **notes:** Source plan `:842` + §10.1. **Subset invariant over all content files, not set equality, and not over the draft-filtered arrays** — that was blocker B1. 24 slugs + empty `retired[]`. Wire `check:content` and `prebuild`. **P2 later chains `test:auth` onto `prebuild` — it must not overwrite this one** (review m2).

### T11 — Golden diff: prove byte-for-byte parity
- **intent:** Demonstrate the migration changed no rendered output
- **files:** none (comparison only)
- **cwd:** none
- **depends:** T10
- **verify:** `npm run build` exits 0, then a fresh capture of every T0 route diffs **clean** against the golden dir — or every difference is individually justified in writing in `implement/05-review.md`
- **removes:** none
- **baseline:** the golden dir from T0
- **rollback:** n/a — read-only
- **state-after:** working
- **notes:** Source plan `:843` — expect **zero** intentional diffs. Highest-risk drift: T7's trailing-punctuation behavior, T9's derived index dates, T8's Gartner path set. A diff here is a real regression, not noise.

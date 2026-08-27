# Test results — dynamic-content-management P1

**Mode:** verify · **Date:** 2026-08-27 · **Branch:** `feat/content-migration-p1` · Pass 1

## Loop T6 — reduced mode, stated before any result below

**There is no `test/baseline.md` and no characterization tests were ever generated.** `grokbit-test` was never run in baseline mode for this slug. This must colour how every regression claim here is read.

What *does* exist is a genuine pre-change behavioural capture, and its provenance is checkable:

| | |
|---|---|
| What | 60 files — all 56 sitemap routes rendered to HTML, plus `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt` |
| When | Task T0, on the untouched tree, build green, **before any code edit** |
| Proof of ordering | T0 recorded complete in commit `7f26b42`; the first code-touching commit is `49b744d` |
| Where | scratchpad `…/6a245150…/scratchpad/golden` |

**What this covers well:** every rendered route, byte for byte. For a data-source migration whose whole claim is "rendered output is unchanged", this is a stronger instrument than typical characterization tests.

**What it does not cover — and this matters:**

- **`/api/whitepaper` has NO pre-change capture.** It is a POST route and therefore absent from the sitemap the capture script walks. That is the single riskiest route in this change: its data source moved *and* it is the subject of review blocker B2. Regression detection for it is **zero**. It was instead exercised live in this run (results below), which establishes that it works now — but not that it behaves as it did before.
- Interactive behaviour, client-side state, and anything requiring a browser (see Step 3).

The capture is ephemeral — it lives in a scratchpad, not the repo. A future session cannot re-run this comparison.

## Step 1 — Regression

Replayed from a **clean** build (`rm -rf .next` → `npm run build` → `next start`), captured all 60 routes, compared against the pre-change capture.

**Result: 55 of 60 byte-identical. 0 REGRESSION. 0 UNKNOWN.**

Comparison normalises only Next's per-build churn — `/_next/static/**` asset hashes, CSS-module class suffixes, and the random build ID in the RSC payload. Nothing else. Page copy, JSON-LD, metadata and sitemap contents are compared byte for byte.

| Route group | Result |
|---|---|
| `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt` | identical with **no normalisation at all** |
| 51 non-blog HTML routes | identical |
| 5 blog detail pages | differ — classified below |

### Finding R1 — blog detail RSC payload: React keys and inter-block newlines

- **Classification:** `INTENDED`
- **Citation:** `plan.md` T7 — *"`react-markdown` + `remark-gfm`, explicit component map from survey S7"*, with `removes:` explicitly deleting `groupBlocks` and `linkify`. The same task note anticipated renderer drift and named the golden diff as the mechanism to catch it.
- **Artifact-name deviation, stated plainly:** the skill requires an `INTENDED` citation into `03-design.md`. **This plan has no `03-design.md`** — the planning run produced `01-intent.md`, `02-survey.md`, `plan.md` and `assumptions.md`. The citation above is a pre-existing, pre-implementation design statement in `plan.md`, not a post-hoc rationalisation, but it is not the artifact the skill names. Flagged rather than silently substituted.

**What differs:** React keys (`"0"` → `"h2-0"`), and newline text nodes preserved between block elements.

**Why it is not a regression — measured, not asserted.** Across **all 56 HTML captures**:

| Surface | Differences |
|---|---|
| Visible text (tags + scripts stripped) | **0** |
| JSON-LD (`BlogPosting`, `Article`, `ItemList`, `FAQPage`, `BreadcrumbList`) | **0** |
| `<title>` | **0** |
| `meta description` | **0** |
| `canonical` | **0** |
| `og:*` | **0** |
| `robots` meta | **0** |
| Every anchor `href` | **0** |
| All head tags (hashes normalised) | **0** |

React keys are reconciliation hints and are never emitted to the DOM; whitespace between block-level elements collapses in rendering.

### Project suite vs preflight

`implement/preflight.md` records **no pre-existing failures** and **no test suite**. `node --test scripts/lib/content-rules.test.mjs`: **30 pass, 0 fail**. No newly-red tests. No flakes observed.

## Step 2 — Done-criteria coverage

Criteria from `01-intent.md`. Every row is an executed command with an observed result.

| # | Criterion | Check run | Result |
|---|---|---|---|
| DC1 | Content sourced from `content/**`, not inline TS arrays | `blog.ts` size; grep for array literals | **PASS** — 1027 lines → 1696 bytes; all three literals gone |
| DC2 | Every exported loader name/type preserved | grep all 10 symbols; `npx tsc --noEmit` | **PASS** — 10/10 present, typecheck exit 0, all 12 consumers unmodified |
| DC3 | Public site renders byte-for-byte identically | clean build + 60-route diff | **PARTIAL** — 55/60 identical; 5 differ per R1. Every SEO/GEO surface identical (table above) |
| DC4 | Golden baseline captured before any edit | commit ordering `7f26b42` < `49b744d` | **PASS** |
| DC5 | Deps added, `engines.node` pinned | resolve check; `package.json` | **PASS** — 3 resolve, `>=20.9.0` |
| DC6 | Single source of validation truth | `npm run test:rules` | **PASS** — 30/30 |
| DC7 | Migration lossless | `migrate-content.mjs --verify` | **PASS** — exit 0, on-disk matches source arrays; 10 paragraphs escaped |
| DC8 | **Unconditional draft filtering** | set `draft:true` on `oilfield-invoicing-automation`, rebuild, probe, revert | **PASS** — detail 404, absent from sitemap and index, other 13 intact, `check:content` correctly *allowed* it (not a 301 destination) |
| DC9 | `check:content` fails the build on violations | 3 deliberate violations | **PASS** — rename → L1+L3+L4; unpublish a 301 destination → L4; bad pillar → field error; each reverted |
| DC10 | White-paper download works from `content/` | live POST to `/api/whitepaper` | **PASS** — valid → `200 {ok:true,url:"/whitepapers/death-of-commissions.pdf"}`; unknown → `400`; empty → `400`; all 5 PDFs `200 application/pdf` |
| DC11 | Redirects untouched | re-count after edit | **PASS** — 5 `MIGRATED_POSTS`, 13 case-study destinations |
| DC12 | Visual correctness of changed views | — | **UNVERIFIED — no headless browser** (Step 3) |
| DC13 | B2 fix works in a Vercel function at runtime | — | **UNVERIFIED — needs preview deploy** (see security/readiness) |

### DC10 side effect — disclosed

The valid-paper probe returned `200`, meaning it submitted through to the **live HubSpot portal**. A junk contact (`T` / `t@example.com`, `whitepaper_requested=death-of-commissions`) may now exist there and should be deleted. The `400` cases short-circuit before HubSpot. This was an avoidable outward-facing side effect of testing a route with real credentials present.

## Step 3 — Visual

**Not run.** No headless browser is available: no `playwright`/`puppeteer` in `node_modules`, no `chrome`/`chromium`/`msedge` on PATH. Per Loop T5's prerequisite path, the step was not attempted rather than partially faked.

**`UNVERIFIED — no headless browser`** for every view this change touched:

- `/blog/<slug>` (×5) — body now rendered by `react-markdown`; **highest visual risk in the change**
- `/resources` — blog card list rewired, one card uses `cardTitle`
- `/case-studies` and `/case-studies/<slug>` — data source changed
- Every page's footer — Gartner footnote logic changed

HTML-level evidence is strong (identical text, identical classes, identical anchors), but **no view was actually rendered in a browser at any width**. Layout, overlap, mobile behaviour and interactive reachability are unchecked.

## Step 5 — Maintenance sweep

Scoped to `dbfd6b1..HEAD` (the 11 commits in `implement/handoff.md`).

**`removes:` cross-check — all 8 confirmed gone:**

| Declared removal | State |
|---|---|
| T5 inline `BLOG_POSTS` array | gone |
| T5 inline `CASE_STUDIES` array | gone |
| T5 inline `WHITE_PAPERS` array | gone |
| T7 `groupBlocks` | gone |
| T7 `linkify` | gone |
| T8 executable `JSON.stringify` Gartner filter | gone (survives only inside an explanatory comment) |
| T9 hardcoded `BLOG_POSTS` in `/resources` | gone |
| T9 `UPDATED.blogIndex` | gone |

No case of "a replacement that did not replace".

**Other findings:**

- No orphaned files; working tree clean. Two temporary XSS probe scripts were created inside the repo to resolve `node_modules` and **both were deleted**; verified absent.
- All three added dependencies are imported and used.
- No `TODO`/`FIXME`/`HACK` added this session.
- **`BlogPost.blocks` is confirmed vestigial** — grep finds no consumer outside `blog.ts`/`loadContent.ts` itself. Deliberately retained (deviation D7): removing it would mean editing a file outside the declaring task's scope, and hard rule 3 forbids opportunistic deletion. Carried as an owner follow-up, not silently dropped.

## Step 7 — Baseline retirement

**Not applicable.** No baseline characterization tests exist to retire or regenerate (Loop T6). The R1 `INTENDED` finding has no test behind it — it was adjudicated against a byte capture, not an assertion. Nothing to retire.

The scratchpad capture is **ephemeral and will be lost**. If regression detection matters for P2/P3, `capture.mjs`/`compare.mjs` should be promoted into the repo and a real baseline committed. Recorded as a recommendation, not an action — that is a planning decision, not a test-phase one.

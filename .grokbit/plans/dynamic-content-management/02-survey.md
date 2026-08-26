# Survey — verified against the tree, 2026-08-26

**Base:** branch `feat/content-migration-p1`, cut from `preview/faq-agentic-spm` @ `dbfd6b1`.
**Method:** every claim below was re-derived from the working tree. Source-plan claims are marked CONFIRMED / CORRECTED / REFUTED.

## S0 — Base-branch defect in the source plan (CORRECTED)

Source plan `:831` says capture the golden baseline "on a clean `main`". **This is wrong.**

| Citation | On `main` | On `preview/faq-agentic-spm` |
|---|---|---|
| `src/components/Footer.tsx:23` — `GARTNER_PATHS` `JSON.stringify` heuristic (task `:839`) | `GARTNER_PATHS` **absent entirely**; line 23 is a LinkedIn SVG `<path d=...>` | Present; line 23 is exactly `...BLOG_POSTS.filter((p) => JSON.stringify(p).includes("Gartner")).map(` |

`main` is at `ca4df26` (2026-07-15), **15 commits behind** the preview branch, which touches three plan-scope files (`src/lib/blog.ts`, `src/app/resources/page.tsx`, `src/components/Footer.tsx`).

**Resolution:** the plan was surveyed against the preview branch. Base and baseline are `preview/faq-agentic-spm`. Owner confirmed 2026-08-26.

## S1 — Content modules (all CONFIRMED)

| Claim (source plan §3.1) | Verified |
|---|---|
| `BLOG_POSTS` at `src/lib/blog.ts:24` | CONFIRMED (`:24`) |
| `getPost` at `src/lib/blog.ts:1025` | CONFIRMED (`:1025`); file is 1027 lines |
| `BlogPost` shape `:5-22` | CONFIRMED — `BlogBlock` `:5`, `BlogPost` `:7-22` |
| 5 blog posts | CONFIRMED |
| `CASE_STUDIES` at `src/lib/caseStudies.ts:18` | CONFIRMED |
| `getCaseStudy` at `:299` | CONFIRMED; file is 301 lines |
| **14** case studies (v3 correction of v2's "15") | CONFIRMED — 14 |
| `WHITE_PAPERS` at `src/lib/whitePapers.ts:34` | CONFIRMED |
| `getWhitePaper` at `:86` | CONFIRMED; file is 88 lines |
| Path assertion throws at module load | CONFIRMED — `WHITEPAPER_FILE_RE` `:24`, `assertWhitePaperFile` `:26-33`, validation loop `:77-84` |
| **24** total items (5+14+5) | CONFIRMED |
| 5 PDFs, 297–696 KB | CONFIRMED — 296,550 / 336,883 / 457,628 / 464,889 / 695,662 bytes. **4 MB cap (P3) is sound.** |

`PILLARS` lives at `src/lib/pillars.ts:21`, not in `caseStudies.ts` (source plan implied a join, named no file — not a contradiction).

## S2 — The Markdown escaping claim (CONFIRMED — with the reasoning made explicit)

Source plan `:834` / review M2: "the ten `1. `–`5. ` paragraphs are the reason".

Raw count of blocks whose text starts `N. ` is **15**, which initially looked like a plan error. It is not:

| Block type | Count starting `N. ` | Needs escaping? |
|---|---|---|
| `p` | **10** | **YES** — a paragraph written as `1. Foo` is re-parsed by Markdown as an `<ol><li>`, changing rendered HTML |
| `h3` | 5 | NO — emits `### 1. Foo`, and heading content is not list-parsed |

**The plan's "ten paragraphs" is exactly correct.**

Full block-type census across all 5 posts: `p` 160, `h3` 30, `h2` 28, `li` 16 (234 blocks).

**Escaping scope is narrower than feared.** Zero occurrences in any block text of: leading `#`, leading `-`/`*`, leading `>`, or any `_`, `*`, or `[`. The only Markdown-hostile construct present is the leading ordered-list pattern on `p` blocks.

## S3 — Every consumer of the three loaders (12 importers, exhaustive)

```
src/app/api/whitepaper/route.ts:3      getWhitePaper          VALUE  (runs in a Vercel function — see S4)
src/app/blog/[slug]/page.tsx:8         BLOG_POSTS, getPost, type BlogBlock
src/app/blog/page.tsx:6                BLOG_POSTS
src/app/case-studies/[slug]/page.tsx:7 CASE_STUDIES, getCaseStudy
src/app/case-studies/page.tsx:5        CASE_STUDIES
src/app/industries/[slug]/page.tsx:7   getCaseStudy           <-- missed by source-plan v2 (review M3)
src/app/resources/page.tsx:6           WHITE_PAPERS
src/app/sitemap.ts:5,7                 CASE_STUDIES, BLOG_POSTS
src/components/CaseStudyGrid.tsx:5     type CaseStudy         TYPE-ONLY
src/components/Footer.tsx:8            BLOG_POSTS             <-- missed by source-plan v2 (review M3)
src/components/WhitePaperGate.tsx:5    type WhitePaper        TYPE-ONLY
```

CONFIRMED: the two consumers v3 added (`industries/[slug]`, `Footer`) are real, and the two type-only imports (`CaseStudyGrid`, `WhitePaperGate`) are genuinely type-only — task `:841` is a verification, not a change.

## S4 — `outputFileTracingIncludes` (CONFIRMED — blocker B2 is real)

`grep -n outputFileTracing next.config.ts` → **absent**. `src/app/api/whitepaper/route.ts:3` imports the registry at module scope and is a POST handler in a serverless function. Task `:837` is required and its failure mode (green build, 500 in production) is accurately described.

## S5 — Sitemap / dates (CONFIRMED)

- `src/lib/contentDates.ts` — `UPDATED` object `:15-35`; `caseStudies` `:23`, `blogIndex` `:26`, `resources` `:27`.
- The three index `lastmod` lines are `src/app/sitemap.ts:25` (`/case-studies`), `:27` (`/blog`), `:28` (`/resources`) — matches task `:840`.
- `UPDATED.blogIndex` has exactly **one** reader (`sitemap.ts:27`), so task `:840`'s "delete the now-unread `UPDATED.blogIndex`" is safe.
- Case studies stamped `UPDATED.caseStudies` at `sitemap.ts:46-49`; posts carry own date at `:55-58`.
- `UPDATED.caseStudies` also read at `src/app/case-studies/[slug]/page.tsx:50`.

## S6 — Redirects (CONFIRMED)

- `MIGRATED_POSTS` — 5 blog slugs, `next.config.ts:72-78`.
- Unique case-study destination slugs: **13** (vs 14 studies). Source plan's "one of the 14 has no legacy URL — expected, not a gap" is CONFIRMED.

## S7 — Renderer contract (for the `<Markdown>` component, task `:838`)

Classes that must be reproduced exactly (`src/app/blog/[slug]/page.tsx`):

| Element | Class |
|---|---|
| `ul` | `my-4 list-disc space-y-2 pl-6 text-muted` |
| `h2` | `mt-10 mb-3 text-2xl font-bold text-ink` |
| `h3` | `mt-8 mb-2 text-xl font-bold text-ink` |
| `p`  | `my-4 text-foreground` |
| `a` (from `linkify`, `:47-52`) | `break-all font-medium text-accent underline hover:text-accent-hover` + `target="_blank" rel="noopener noreferrer"` |

`linkify` (`:38-59`) auto-links bare URLs and strips trailing `.,);` — `remark-gfm`'s autolink literal covers the linking; **trailing-punctuation trimming must be verified against the golden baseline**, it is not automatic.

## S8 — Environment / tooling

- Node **v22.20.0**, npm **10.9.3**. `package.json` declares no `engines` — task `:832` pins it.
- Scripts: `dev`, `build`, `start`, `lint`. **No `test` script; no test runner; no `*.test.*` files anywhere.** Source plan §3.6 CONFIRMED.
- `node_modules/` installed (291 entries), `package-lock.json` present (2026-07-08).
- Dependencies are only `lucide-react`, `next` 16.2.10, `react`/`react-dom` 19.2.4. Adding 3 runtime deps is a real departure from the repo norm (task `:832` acknowledges it).
- `.gitignore` covers `node_modules`, `.env*`, `/.next/`, `/out/`.
- `content/` and `src/lib/content/` do not exist yet.

## S9 — Verify-command reality

**There is no test runner**, so no task can verify via unit tests. Available real verification:

| Command | Real? |
|---|---|
| `npm run build` | YES — catches type errors, module-load throws, static-gen failures |
| `npx tsc --noEmit` | YES — fast type gate |
| `npm run lint` | YES |
| `node scripts/*.mjs` ad-hoc assertions | YES |
| `npm test` | **NO — does not exist** |

Consequence: `npm run build` is the backstop for most tasks, and the **golden diff (T11)** is the only thing that can prove byte-for-byte parity. This is why T0 is unrecoverable-if-skipped.

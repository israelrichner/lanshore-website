# Handoff — dynamic-content-management P1 → grokbit-test

`hand_back_cycle: 0`

## What this is — and what it is NOT

P1 moves the site's 24 content items out of hand-authored TypeScript arrays and into repo files under `content/`, behind unchanged exported APIs, and adds the validation gate the later packages depend on.

**It does NOT make the site editable by a non-developer.** There is no editor UI, no sign-in, no publish button. That is P2 (the auth boundary) and P3 (the editor and GitHub write layer), both excluded because they need owner-supplied secrets an agent cannot create: a Google OAuth client, a GitHub fine-grained PAT, and a HubSpot property change.

This is the single most likely thing to be misread as "done". P1 is the substrate. The owner's original ask — *"update Blogs, Case Studies and White Papers without having to do git commits"* — is **not yet satisfied**.

## Tasks

**12 of 12 done. 0 blocked.**

## Files touched

**Added**
```
content/blog/*.md                     5
content/case-studies/*.json          14
content/white-papers/*.json           5
content/SLUGS.lock.json               1
scripts/lib/content-rules.mjs
scripts/lib/content-rules.test.mjs
scripts/migrate-content.mjs
scripts/check-content.mjs
src/lib/content/loadContent.ts
src/components/Markdown.tsx
```

**Modified**
```
package.json            deps, engines.node, check:content / test:rules / prebuild
src/lib/blog.ts         1027 lines -> 1696 bytes
src/lib/caseStudies.ts
src/lib/whitePapers.ts  path assertions deliberately kept
src/components/Footer.tsx
src/app/blog/[slug]/page.tsx
src/app/resources/page.tsx
src/app/sitemap.ts
src/app/case-studies/[slug]/page.tsx
src/lib/contentDates.ts UPDATED.blogIndex removed
next.config.ts          outputFileTracingIncludes only; redirects untouched
```

## Dependencies added

`gray-matter` 4.0.3, `react-markdown` 10.1.0, `remark-gfm` 4.0.1 — all MIT, all cleared through the dependency gate.

`npm audit` reports 6 pre-existing high-severity advisories (`next`, `nanoid`, `brace-expansion`, `postcss`, `sharp`). **None introduced here** — the flagged `js-yaml` range is hit by `4.3.0` via eslint, already in the lockfile; `gray-matter` pulls `3.15.2`, outside it. No `audit fix` was run: bumping `next` is outside this plan's scope and is a decision for the owner.

## Dirty-tree snapshot — ACTION REQUIRED

```
stash@{0}  On feat/content-migration-p1: pre-implement snapshot dynamic-content-management (grok/claude scaffolding only)
```

**Deliberately not popped here** (deviation D3). It holds ~48 `.grok/`, `.claude/`, `AGENTS.md` and `fixtures/` files that belong to `preview/faq-agentic-spm`, with zero overlap with this plan's scope. Popping them onto this branch would bury the migration diff in unrelated scaffolding.

**The stash is preserved, not dropped.** To restore it where it belongs:

```
git checkout preview/faq-agentic-spm
git stash pop
```

The selective stash was itself necessary: a blanket `git stash push -u` would have swept away `docs/plans/dynamic-content-management.md` and its review, both **untracked**.

## What a test pass should look at hard

1. **`outputFileTracingIncludes` (A3) — the one thing that cannot be proven here.** `src/app/api/whitepaper/route.ts` runs in a serverless function and reads `content/white-papers/` from its bundle. Local `next start` reads the real filesystem and passes **whether or not the config is correct**. This needs a **Vercel preview deployment** with a real gated download exercised against it. Until then, review blocker B2 is **not closed**.
2. **The 5 blog-page diffs.** Justified in `05-review.md`: React keys and inter-block newline text nodes from `react-markdown`. Visible text, JSON-LD, and every anchor are identical. Confirm the reasoning; do not accept it on my say-so.
3. **The `check:content` gate.** Verified to bite on a rename, an unpublish of a live 301 destination, and a bad field value. Worth trying to defeat it in a way I did not.
4. **The Markdown escaping table.** Exactly 10 paragraphs needed escaping. The migration asserts a lossless round trip, but the escaper throws on any *unhandled* hostile prefix — that guard is untested against content that does not exist yet.
5. **`markdownToBlocks` is a line-based parser.** Safe only because no block text in this corpus contains a newline (verified across all 234). New content authored through the future admin could break that assumption.

## Deviations

**0 counting, 9 recorded.** Full detail in `deviations.md`. The two most substantive are defects in the source plan, both caught before code was written:

- **D4 — ordering was unspecified.** No array is alphabetical and all five posts share one `dateModified`, so neither filename nor date order reproduces the editorial order that `ItemList` JSON-LD and the sitemap encode. `SLUGS.lock.json` now carries it.
- **D5 — `/resources` shows a shortened title** for one post. Deriving from `BLOG_POSTS.title` alone would have lengthened that card.

And one process finding worth keeping:

- **D8 — T5 passed every declared check and still shipped a regression.** Only the golden diff caught it, and only because it was run early rather than at T11 as scheduled.

## Follow-ups for the owner (not blockers)

- `BlogPost.blocks` is now vestigial — nothing reads it since T7. Left in deliberately (D7): removing it means editing `src/lib/blog.ts` from a task whose declared files exclude it. One-line cleanup, owner's call.
- P2 must **add** its `test:auth` step to `prebuild`, not replace `check:content` (review m2).
- HubSpot `whitepaper_requested` still needs to become free text (or have option values pre-created) before a new white paper can be added without portal work — P3, source plan `:877`.

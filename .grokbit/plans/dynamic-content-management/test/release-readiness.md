# Release readiness — dynamic-content-management P1

**Date:** 2026-08-27 · **Branch:** `feat/content-migration-p1` · Verify pass 1

---

# VERDICT: SHIP WITH CAVEATS

Nothing here is broken. Six things were **not checked**, and one of them — visual rendering — has no substitute evidence.

**Not `SHIP`,** because a browser never loaded a single page in this run, and the change alters how every blog post body is rendered.
**Not `DO NOT SHIP`,** because there are zero regressions, zero failed criteria, and zero CRITICAL or HIGH security findings.

---

## Build

| Check | Result |
|---|---|
| Clean production build (`rm -rf .next` → `npm run build`) | **exit 0** |
| `prebuild` → `check:content` chained | yes — `blog 5, caseStudies 14, whitePapers 5`; 5 + 13 redirect destinations guarded |
| `npx tsc --noEmit` | exit 0 |
| `npm run lint` | exit 0, **zero warnings** |
| `npm run test:rules` | 30 pass, 0 fail |
| Production start + health | `next start` → `/robots.txt` **200**, `/` **200**; process torn down, port released |

**Bundle:** client chunks **876 KB**. `react-markdown` / `remark-gfm` / `micromark` appear in **no client chunk** — `Markdown.tsx` is a server component, so the three new dependencies do not reach the browser. Server build 26 MB.

*Delta against a pre-change build is `UNVERIFIED` — no pre-change build artifact was retained. The client-chunk finding above is the substantive answer (no client-side growth from this change).*

## Deployment target

**No target config in the repo:** no `vercel.json`, no `.vercel/project.json`, no `netlify.toml`, no Dockerfile/compose, no k8s manifest, no `Procfile`/`render.yaml`/`fly.toml`. The project is deployed on Vercel per the source plan, but nothing in-repo declares it and **no `vercel` CLI is on PATH**.

| Check | Result |
|---|---|
| Remote env parity (names only) | **UNVERIFIED — `vercel` CLI not authenticated** |
| Rolling-deploy compatibility | **UNVERIFIED — no deployment target detected** |

**Local env parity (names only, no values):** 8 vars read by the built code; 7 declared in `.env.example`. `NEXT_PUBLIC_GA_TRACKING` is undeclared — **pre-existing**, arrived with the GA4 commit, not this change. **This change adds no new env vars**, so the prod-vs-dev env risk from *this work* is nil.

## Migrations

**None.** No database, no schema, no data migration. The one-shot content migration (`scripts/migrate-content.mjs`) already ran and its output is committed; it is idempotent and has a `--verify` mode that re-checks on-disk content against the source arrays.

**Reversibility:** full. `git revert` of the 11 commits restores the inline arrays; no external state was mutated. Content files are additive.

## Caveats

### C1 — No view was rendered in a browser *(the reason this is not `SHIP`)*

No headless browser is available. Every changed view is `UNVERIFIED` for layout, overlap, mobile width, and interactive reachability — including the 5 blog pages whose body rendering was **replaced wholesale** by `react-markdown`.

HTML-level evidence is strong (identical visible text, identical classes, identical anchors, identical JSON-LD), which makes a visual break unlikely — but "unlikely" is not "checked".

**To close:** `npx playwright install chromium`, then load `/blog/<slug>`, `/resources`, `/case-studies` at desktop and mobile widths.

### C2 — Review blocker B2 is *not* closed, but is stronger than reported at handoff

`implement/handoff.md` said the T6 fix proves "only that the config is present and syntactically valid". **That understated it.** This run inspected the build's own trace manifest:

`.next/server/app/api/whitepaper/route.js.nft.json` lists **all 25 content files individually** — `SLUGS.lock.json`, 5 blog, 14 case studies, 5 white papers — among 122 traced files. That is the exact artifact `@vercel/nft` produces and Vercel consumes to assemble the lambda.

So the config demonstrably takes effect at build time. What remains unproven is Vercel's runtime packaging and a real function reading those files in production.

**To close:** deploy a preview and exercise a gated white-paper download against it.

### C3 — Reduced mode: no baseline characterization tests

No `test/baseline.md` exists; `grokbit-test` was never run in baseline mode. Regression detection rested on a 60-route byte capture whose pre-change provenance is verifiable (`7f26b42` < `49b744d`). For rendered routes that is a strong instrument. It is also **ephemeral** — it lives in a scratchpad and a future session cannot reproduce it.

### C4 — `/api/whitepaper` had zero regression coverage

It is a POST route, absent from the sitemap the capture walks. It was tested **live** instead and works correctly (valid → 200 with the right same-origin path, unknown → 400, empty → 400, all 5 PDFs serve). But there is no before/after comparison for it — only a working-now result.

### C5 — DC3 is partial, by measurement

55 of 60 captures byte-identical. The 5 blog pages differ in React keys and inter-block newline text nodes, classified `INTENDED` (`results.md` R1). Every SEO/GEO surface measured across all 56 captures shows **zero** differences.

Noted for transparency: the skill wants `INTENDED` cited into `03-design.md`; this plan has no such file, so the citation is to `plan.md` T7 — a pre-implementation design statement, but not the named artifact.

### C6 — A test lead was submitted to the live HubSpot portal

Exercising `/api/whitepaper` with a valid slug returned 200, which means it submitted through to production HubSpot. A junk contact (`T` / `t@example.com`, `whitepaper_requested=death-of-commissions`) may exist and **should be deleted**. Avoidable; disclosed rather than buried.

## What this does NOT mean

**`SHIP` here does not mean the owner's request is delivered.** P1 moves content into files and adds a validation gate. There is still **no editor UI, no sign-in, no publish button**. Updating a blog post still requires a developer and a git commit.

The original ask needs P2 (auth boundary) and P3 (editor + GitHub write path), both blocked on owner-supplied secrets: a Google OAuth client, a GitHub fine-grained PAT, and a HubSpot property change.

## Recommended before merge

1. Install a headless browser and clear C1 — the only caveat with no substitute evidence.
2. Deploy a preview and exercise a white-paper download to close C2/B2.
3. Delete the test HubSpot contact (C6).
4. Restore the parked stash on its own branch: `git checkout preview/faq-agentic-spm && git stash pop`.
5. Decide whether `capture.mjs`/`compare.mjs` should be promoted into the repo so this comparison is repeatable for P2/P3 — a planning decision, deliberately not taken here.

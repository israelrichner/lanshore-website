# Assumptions — dynamic-content-management P1

Open items. Each names what closes it and who can close it.

## A1 — Base branch is `preview/faq-agentic-spm`, not `main` — CLOSED

The source plan's `:831` instruction to baseline on clean `main` is a defect: `GARTNER_PATHS` does not exist on `main`, so task `:839` is unexecutable there (survey S0).
**Closed by:** owner decision, 2026-08-26 — branch off `preview/faq-agentic-spm`.
**Residual:** if the preview branch is later rebased or abandoned, `feat/content-migration-p1` needs a rebase. Recoverable, not blocking.

## A2 — P2 and P3 are out of scope for this session — CLOSED

Both need owner-supplied secrets and external account setup that an agent cannot perform (Google OAuth client, GitHub fine-grained PAT, HubSpot property change).
**Closed by:** scope decision recorded in `01-intent.md`.
**Residual:** P1 ships a content migration with **no editor UI**. The site is not yet editable by a non-developer — that is P2+P3. P1 is the necessary substrate, not the feature the owner asked for. **This must be stated plainly in the handoff; it is the single most likely thing to be misread as "done".**

## A3 — `outputFileTracingIncludes` cannot be proven locally — OPEN

T6 fixes review blocker B2, but local `next start` reads the real filesystem and will pass **whether or not the tracing config is correct**. The failure mode it guards against (module-init throw inside a Vercel lambda) only reproduces on a real deployment.
**Closes when:** a Vercel preview deployment is made and the gated white-paper download is exercised against it (source plan §10.2, E6).
**Who:** owner, or whoever holds Vercel deploy rights.
**Until then:** T6's verify proves only that the config is *present and syntactically valid*, not that it *works*. Do not claim B2 is closed.

## A4 — `remark-gfm` autolink vs. the old `linkify` — CLOSED (T7)

`linkify` (`src/app/blog/[slug]/page.tsx:38-59`) strips trailing `.,);` from detected URLs before linking. `remark-gfm`'s autolink literal has its own trailing-punctuation rules which are **similar but not proven identical**.
**Closed by:** direct comparison of every external anchor (href + link text) on all five blog pages between the golden capture and post-T7 output — **identical**, including the "Retrieved from https://…" reference lines. Visible text and JSON-LD are also byte-identical on all five. No custom remark plugin needed.

## A5 — Derived index `lastmod` values are asserted, not yet verified — CLOSED (T9)

Source plan `:843` claims §6.7's derived index dates compute to the values already hardcoded in `contentDates.ts`. Survey confirmed the *inputs* exist but did not compute the *outputs*.
**Closed by:** `sitemap.xml` is **byte-identical** to the T0 golden capture after T9. All three derived values compute to exactly what was hardcoded — `/blog` 2026-07-11 (max post date), `/case-studies` 2026-07-08 (all 14 fall back), `/resources` 2026-07-15 (the manual floor wins over the blog max). The behaviour only starts diverging the day an editor actually publishes, which is the point of the change.

## A6 — No test runner exists — ACCEPTED RISK

The repo has no test framework (survey S8). T2 introduces `node --test` for the validation module only, using the Node builtin (no new package), mirroring the source plan's bounded exception at §10.4.
**Consequence:** every other task verifies through `npm run build`, `npx tsc --noEmit`, `npm run lint`, or an ad-hoc assertion. There is no unit-level safety net for the loaders or the renderer — **the golden diff (T11) is the only real regression detector in this plan.** If T0 is skipped or captured wrong, P1 ships unverifiable.

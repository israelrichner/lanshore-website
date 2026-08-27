# Baseline — studio-editor-write-path (P3)

**Mode:** baseline · **Captured:** 2026-08-27 · **Tree:** `feat/studio-editor-p3` @ `c9c3d63`, **before any P3 task landed**.

Records what the system does now. Not what it should do.

## Artifacts

| File | Covers | Replay |
|---|---|---|
| `test/baseline/public-field-leak.mjs` | T0 / T11 — which record fields reach public output | `npx next start` then run it |

**Validated against the unmodified tree: exit 0.**

## T0 / T11 — the field-leak surface (the reason B1 is a blocker)

Every field on a case-study record reaches the public RSC payload, **14 occurrences each** — one per study:

`slug · title · client · industry · pillar · outcome · challenge · whatWeDid · results · stack · legacyUrl`

`legacyUrl` and `whatWeDid` are in there despite never being rendered, which is the proof that the payload carries the *record*, not the *rendered output*.

Path: `loadCaseStudies` (`loadContent.ts:172-185`) strips only `draft` → `/case-studies` passes whole records to `<CaseStudyGrid>` (`page.tsx:56`), a `"use client"` component → every field is serialised.

**Admin-only fields today:** `draft` 0, `publishedOnce` 0.

**`draft` reads 0 only because no content file currently sets it — not because it is stripped from all three loaders.** That distinction is the whole of T0. After T0 both must still read 0 *even when the source files carry them*.

## T1 — redirect destinations

`check:content` reports **5 blog, 13 case-study** 301 destinations, derived by importing `next.config.ts` and calling `redirects()`. T1 must preserve those counts while removing the request path's dependency on that import.

## T6 — `requireAdminRoute()`

**0 callers** outside its own file. **0 tests.** P3 is its first caller, and P2's security report flags it as unproven code that will guard the first write endpoint.

## T7 — the dashboard

`src/app/studio/(gated)/page.tsx` renders the placeholder ("Nothing to edit yet") plus "Signed in as \<email\>".

## T11 — inherited baselines

- **P1 golden capture** — 56 routes + 4 text routes, in the session scratchpad. Ephemeral (`assumptions.md` A7 of P1).
- **P2 proxy baseline** — `.grokbit/plans/studio-auth-boundary/test/baseline/proxy-behaviour.mjs`, 16 rows, committed and regenerated post-P2. **Run it without admin env vars**; two rows are fail-closed values.

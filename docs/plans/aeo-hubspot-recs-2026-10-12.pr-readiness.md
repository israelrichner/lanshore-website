# PR readiness — aeo-hubspot-recs-2026-10-12

**Session:** 97439253-1235-4461-852b-1ebac9b4913e
**Date:** 2026-10-12
**Scope of this run:** the plan + review commit and the WP1 commit on branch `aeo-hubspot-2026-10-12`. This is a commit gate, not a PR to `main`: WP2 and the owner-gated publish step are not started, and nothing merges before Doug's sign-off (plan §9).

## Verdict: READY (for the plan and WP1 commits)

## Plan audit

| Plan item | In diff | Status |
|---|---|---|
| WP1.1 baseline regression + before-counts | owner review file (counts table) | DONE |
| WP1.2 proof-marker gate (`house-style.mjs`, `content-rules.mjs` incl. white paper, `check-house-style.mjs`, `solutions/index.ts` throw, `types.ts` comment) + unit tests | yes | DONE (hardened in this run, see code review) |
| WP1.3 CaptivateIQ / Performio live verification (hygiene) | `spmPlatforms.ts`, owner review (d) | DONE; Lead re-fetched d2/d3 |
| WP1.4 rec 3: `related` on `SpmPlatform` + render; captivateiq/performio FAQs; mid-market FAQ | yes | DONE |
| WP1.5 rec 1: `spm-consulting` extension; `global-compliance` related | yes | DONE (H1 unchanged) |
| WP1.6 rec 6: `quota-incentive-alignment.ts`, registered, `/solutions` DESCRIPTION | yes | DONE |
| WP1.7 rec 5: `sales-finance-misalignment.md` + SLUGS.lock | yes | DONE (no datePublished, per OQ4) |
| WP1.8 negative-injection proof | owner review (f) | DONE |
| WP1.9 owner review file at `docs/owner-review/` | yes | DONE |
| WP1.10 regression, link check, capability check, claims audit, verify, coverage | evidence below | DONE |
| WP2 (rec 2, rec 4 + rec 7, OQ9 case study, cross-links) | no | PENDING: next package, by design |
| §9 owner review + publish | no | PENDING: owner-gated |
| UNPLANNED: `AGENTS.md` test counts corrected | yes | Accepted (doc-only; noted in commit body) |
| UNPLANNED: `.claude/logs/subagents.log` | modified | Excluded from staging |

## Cold review

Exists at `docs/plans/aeo-hubspot-recs-2026-10-12.review.md` (pass 3, APPROVE), dated 2026-10-12 14:33:35, newer than the plan (14:33:15).

## Code review findings

`/code-review high`, 9 findings. Dispositions:

- **gap (fixed)**: `PROOF_MARKER_RE` missed hyphen/underscore separators. Now `/proof[\s\-_*]+point[\s\-_*]+needed/i`; tests added (positive variants and a hyphenated-prose negative).
- **gap (fixed)**: marker split by inline markup (`<strong>PROOF POINT</strong> NEEDED`) or wrapped across an llms line was missed. HTML scan re-tests the joined visible text (no double report); llms scan tests the whole file when no line matched. Tests added, including a negative for words in separate blocks.
- **gap (fixed)**: no test for nested Solution fields. Added a Solution-shaped fixture asserting `howWeDeliver[1].body` is reported and clears when removed. The throw wiring in `solutions/index.ts` itself is proven by negative injection 1 (owner review (f)); it is not unit-testable without TS module resolution for extensionless imports.
- **suggestion (non-blocking, accepted risk)**: `UPDATED.spm` restamps all 9 `/spm/<slug>` lastmods. Plan §6 already accepts this as the registry design; per-platform dates are out of scope.
- **suggestion (non-blocking, follow-up)**: `related` hrefs are not validated at load time. Today every href is verified by the one-off internal-link check (0 of 293 unresolved). Recommended follow-up: validate `related` against built routes in `solutions/index.ts`.
- **suggestion (non-blocking, follow-up)**: no load-time marker/em-dash check over `SPM_PLATFORMS`. The postbuild HTML backstop catches it (negative injection 3 failed the build on `/spm/captivateiq`, `/spm`, `/llms-full.txt`).
- **nit**: Related block duplicated from `solutions/[slug]/page.tsx`; candidate `<RelatedLinks>` extraction.
- **nit**: `publishedParts()` runs twice per page in `check-house-style.mjs`.
- **suggestion (non-blocking, by design)**: new guide has no `datePublished`. OQ4: set to the real go-live date in the §9 publish step, which is listed there.

## Security review findings

- None. `/security-review` sub-task over the working-tree diff: no finding at confidence 5 or above. Checked: JSON-LD `dangerouslySetInnerHTML` sink (still escaped via `toJsonLd()`), new `related` hrefs (hard-coded internal paths, React-escaped labels), Markdown renderer (no `rehype-raw`, no raw HTML in the new post), validator code (string-only, no exec/eval/dynamic import), module-load throw (build-time only), no secrets or PII.

## Verification

- **pass**: `npm run build` exit 0 after the code-review fixes. Prebuild green (check:content; test:rules 94/94; test:schema 54; test:auth 107; test:loaders 8; test:redirects 3; check:admin). Postbuild green: check:headings, check:schema-mirror (52 nodes), check:house-style (93 routes + llms files, no em dashes, no markers), check:dir-page.
- **pass**: `npm run lint` exit 0.
- **pass**: `verify` skill, production build served on a fresh `next start` (confirmed serving the new build: restored b5 clause present on `/spm/captivateiq`). Playwright over 10 routes at 1280 px and 375 px, 20/20 PASS: status 200, one h1, no heading jumps, no horizontal scroll, all JSON-LD parses, zero console errors / pageerror, Related line only on `/spm/captivateiq` and `/spm/performio`. Routes: `/solutions/spm-consulting`, `/solutions/global-compliance`, `/solutions/mid-market-implementation`, `/solutions/quota-incentive-alignment`, `/solutions`, `/resources/guides/sales-finance-misalignment`, `/spm/captivateiq`, `/spm/performio`, `/spm`, `/spm/varicent`.
- Note: a first verify attempt after the rebuild hit a stale server from the earlier run (port in use); it was discarded, the stale process stopped, and the run repeated on a fresh server.

## Required before merging

1. WP2 implemented and passing its own gate cycle.
2. Doug's sign-off in `docs/owner-review/aeo-hubspot-2026-10-12.md` (no placeholder decisions left, signed line recorded by the user).
3. §9 publish step: real `datePublished` / `dateModified`, `UPDATED.spm`, `hubspotId` placeholder replaced, rebase onto `main`, full regression + verify.

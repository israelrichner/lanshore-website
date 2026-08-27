# Deviations — studio-auth-boundary (P2)

Counting deviations (`counts: yes`) escalate at **3**: stop, hand back to `grokbit-plan`, rerun from Survey.

---

## D1 — Every commit carries `VERSION` + token ledger beyond its declared files

- **counts:** no
- **type:** incidental, mechanically required by the repo
- **found:** preflight
- **detail:** `.git/hooks/pre-commit` runs `scripts/prepare_commit_metrics.py --from-env --stage`, bumping `VERSION` and appending to `docs/metrics/token-ledger.md`. Mandated by `AGENTS.md`.
- **disposition:** Accepted as `INCIDENTAL` on every commit in this plan. Recorded once so the scope audit does not re-flag it twelve times. Same standing item as P1's D1.

## D2 — T4 annotated a T3 file to make its own typecheck pass

- **counts:** no
- **type:** incidental, mechanically required
- **found:** T4
- **detail:** `npx tsc --noEmit` failed with `TS2353: 'fetchJwks' does not exist in type '{ ttlSeconds?: number }'`. TypeScript infers a `.mjs` function's parameter type from its JSDoc and defaults; `createJwksCache({ fetchJwks, ttlSeconds = 3600 })` declared a default for one property and not the other, so only `ttlSeconds` was inferred.
- **disposition:** Added a proper `@param` block to `createJwksCache` in `google.mjs` (T3's file). No behaviour changed — T2 (21/21) and T3 (28/28) were both re-run green immediately after. The alternative, casting at the call site in `google.ts`, would have hidden a genuinely under-specified signature behind an `as`.

## D3 — T5 required an undeclared file: `src/lib/studio/redirect-uri.ts`

- **counts:** no
- **type:** undeclared file
- **found:** T5
- **detail:** T5's declared files are the three route handlers. All three need the same four values — the OAuth `redirect_uri`, the state-cookie name, its max-age, and whether cookies are `Secure`. The plan did not anticipate a shared helper for them.
- **disposition:** Created `src/lib/studio/redirect-uri.ts` rather than triplicating the constants. Duplication here is not a style question: three copies of a cookie **name** is a live auth bug the moment one of them is edited — login would set a cookie the callback never reads, and sign-in would fail with no error. The file also carries the reasoning for why `redirect_uri` is built from `NODE_ENV` + the `SITE_URL` constant and never from a request header.
- **why not counting:** the cap measures whether the *survey* misread the codebase. `02-survey.md` was correct about every entity; this is a decomposition detail the plan did not foresee, resolved additively inside the package's own directory, with no third-party surface touched. Recorded rather than absorbed silently, and surfaced to the owner.

## D4 — T6's structure is unimplementable as specified: the gate would 404 the sign-in page

- **counts:** **YES** (1 of 3)
- **type:** plan-specification contradiction found at implementation
- **found:** T6
- **detail:** `plan.md` T6 places `requireAdmin()` in `src/app/studio/layout.tsx` and `signed-out/page.tsx` beneath it. In App Router a layout wraps **every** descendant route, so that gate would also cover `/studio/signed-out` — and `requireAdmin()` fails via `notFound()`. The sign-in page would 404 for exactly the people who need it, leaving **no way into the admin at all**.

  This is review blocker **B3 in a different costume**. B3 was the *proxy* 404ing `/studio/signed-out`; the plan fixed that and then reintroduced the same failure at the *layout* level. `02-survey.md` S3 analysed layout nesting for Header/Footer but never followed it through to the gate-versus-signed-out interaction — a genuine survey gap, which is why this counts.
- **disposition:** The gate moved into a **route group**, `src/app/studio/(gated)/layout.tsx`. Route groups do not appear in the URL, so `/studio` is unchanged while `signed-out` sits outside the gate. `src/app/studio/layout.tsx` keeps the shell and the `noindex` metadata.

  Files differ from T6's declared set: `(gated)/layout.tsx` is new and `page.tsx` moved into the group.
- **verify:** T6's stated verify asserts `src/app/studio/layout.tsx` contains **both** `requireAdmin` and `index: false`. After the restructure that is false and **cannot** be made true without reintroducing the bug. The verify was **not** edited to match the build — hard rule 5. Instead the same assertion was run across the two files it now legitimately spans, and both halves pass: `requireAdmin` in `(gated)/layout.tsx`, `index: false` in `layout.tsx`. Build green, lint 0, both routes register.
- **owner action:** none required. Flagged because a task's verify no longer matches its plan text, and that discrepancy should be visible rather than quietly reconciled.

## D5 — the A1 allowlist is 6 paths, not the 5 the plan fixed

- **counts:** no
- **type:** internal inconsistency in the plan, corrected
- **found:** T10
- **detail:** `04-review.md` B1 fixed A1's allowlist at **exactly 5** entries and made the count itself an assertion. But T5 — in the same plan — creates `src/app/api/studio/auth/{login,callback,logout}/route.ts`, all of which reference the admin path. The source plan's original A1 (`:10.3`) had the same gap: it listed `src/app/studio/**` but never `src/app/api/studio/**`.

  Measured: the literal `/studio` appears in **15** files under `src/`, spanning 6 distinct locations.
- **disposition:** Allowlist implemented with **6** prefixes and the count assertion set to 6. The mechanism B1 wanted is intact and, if anything, tighter — a 7th match still fails, and the script tells the reader that bumping the number is not the fix.
- **why not counting:** the survey was not wrong about the codebase; the plan was internally inconsistent between its own B1 fix and its own T5. Correcting a count to match files the same plan mandates is not a contradiction of ground truth.

---

**Counting total: 1 of 3.**

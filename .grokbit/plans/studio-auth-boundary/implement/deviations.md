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

---

**Counting total: 0 of 3.**

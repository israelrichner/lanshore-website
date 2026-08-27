# Baseline — studio-auth-boundary (P2)

**Mode:** baseline · **Captured:** 2026-08-27 · **Tree:** `feat/content-migration-p1` @ `1eeeef0`, **before any P2 task landed**.

This is what the system does *now*. It records reality, not correctness.

## Why this exists

P1 shipped with **no baseline**, so its verify pass ran in reduced mode and could make no trustworthy regression claims — a limitation that had to be disclosed rather than a result. This run exists so P2's verify does not inherit that hole.

## Artifacts

| File | Covers | Replay |
|---|---|---|
| `test/baseline/proxy-behaviour.mjs` | T7 — WordPress 410 ×6, host canonicalization ×4, admin surface ×6 | `npx next start` then `node …/proxy-behaviour.mjs` |

**Validated against the unmodified tree: 16/16 rows match, exit 0.** A baseline that has not been run is a guess.

## T7 — `src/proxy.ts` (the highest-risk baseline)

P2's T7 makes `proxy()` **async**, which changes the return type for every request on the site — not just `/studio`. Both incumbents flow through the same function.

**Retired-WordPress 410 — MUST NOT CHANGE**

| Path | Status |
|---|---|
| `/wp-login.php`, `/xmlrpc.php` | **410** |
| `/wp-admin/x`, `/wp-content/y`, `/wp-includes/z`, `/wp-json/v2` | **410** |

**Host canonicalization — MUST NOT CHANGE**

| `Host` | `X-Robots-Tag` |
|---|---|
| `lanshore.com` | **absent** |
| `www.lanshore.com` | **absent** |
| `preview.vercel.app` | `noindex, nofollow` |
| `localhost:3000` | `noindex, nofollow` |

**Admin surface — expected to change in P2** (recorded so the change is deliberate, not discovered)

| Path | Now | After P2 |
|---|---|---|
| `/studio` | 404 (route absent) | 404 (proxy gate) — same observable, different cause |
| `/studio/signed-out` | 404 | **200** + `noindex` |
| `/studio/signed-out-and-then-something` | 404 | **must stay 404** — proves exact-match, not prefix |
| `/api/studio/auth/{login,callback,logout}` | 404 | live + `noindex` |

### Capture bug found and fixed — worth recording

The first version of this test used `fetch()`. **Node's `fetch` (undici) silently ignores a `Host` header override**, so every request actually carried `Host: localhost:3000` and the two canonical-host rows measured the wrong thing — reporting `noindex` where the truth is `absent`.

It surfaced only because the baseline was **run against the unmodified tree**, where two MUST-NOT-CHANGE rows failed. A baseline that is written and committed without being executed would have encoded the wrong expectation, and P2's verify would then have "confirmed" a canonical-host behaviour that never existed. The test now uses raw `node:http`.

## T8 — tracker presence — **PLAN DEFECT FOUND**

Observed: **zero** GA4 or HubSpot script tags in the server-rendered HTML of `/`, `/blog`, `/resources`, on the canonical host *and* on localhost.

Both components are `"use client"` and gate via `useSyncExternalStore` (`GoogleAnalytics.tsx:1-13`, `HubSpotLoader.tsx:1-14`), so the scripts are injected by React **after hydration** and never appear in served HTML.

**`plan.md` T8's verify is therefore unrunnable as written.** It says the HTML of `/` contains the tags and `/studio` does not — that comparison is `0 == 0` and would pass vacuously while proving nothing. Corrected below.

## T11 — `toJsonLd` — **PLAN DEFECT FOUND**

`src/lib/schema.ts` imports `./site` **without a file extension**, which bare Node ESM cannot resolve even under `--experimental-strip-types` (`ERR_MODULE_NOT_FOUND`).

So a `.mjs` test **cannot import `toJsonLd`** from `schema.ts`. `plan.md` T11's verify is unrunnable as written. Same root cause that made `src/lib/blog.ts` unimportable in P1 once it gained a relative import.

The function itself is present and correct at `src/lib/schema.ts:343-350`: escapes `<`, `>`, `&`, U+2028, U+2029.

**T16 is unaffected** — a `.mjs` test can import `react`, `react-dom/server`, `react-markdown` and `remark-gfm` directly. Proven in P1's verify phase (8 hostile inputs, all inert).

## T1 / T9 — configuration baselines

`.env.example`: 5 assignment lines, all HubSpot/GA. **None of the 8 admin vars present.**

`package.json`:

```
check:content = node --experimental-strip-types scripts/check-content.mjs
test:rules    = node --test scripts/lib/content-rules.test.mjs
prebuild      = npm run check:content        <- P2 must ADD to this, not replace
build         = next build
```

## T12 — P1 parity (assumption A7)

P1's golden capture **survives**: 60 files plus `capture.mjs` and `compare.mjs`, in the session scratchpad. Still ephemeral — if it is lost before T7 runs, re-capture from this branch **before** touching the proxy.

## Plan corrections applied

Two verify commands were unrunnable. Both are corrected in `plan.md` **before** implementation, on measured evidence.

This is not the prohibited "edit a verify to match what you built" — nothing has been built. It is the correction baseline mode exists to make, while it is still free.

| Task | Was | Now |
|---|---|---|
| **T8** | Compare tracker script tags in served HTML | Extract the gate to `src/lib/studio/tracker-gate.mjs` (pure, testable) and unit-test it; assert both components call it |
| **T11** | `.mjs` test imports `toJsonLd` from `schema.ts` | Extract the escaper to `src/lib/jsonld-escape.mjs`, have `schema.ts` use it, test the `.mjs`. T16 unchanged. |

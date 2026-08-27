# Progress — studio-auth-boundary (P2)

**All 12 tasks done. 0 blocked. 1 counting deviation of 3.**

| Task | State | Commit | Note |
|---|---|---|---|
| T1 — env names | **done** | `ab7f7c0` | 8 names, no values |
| T2 — session.mjs | **done** | `aad79f7` | 21 tests (T1–T10 + T13 logic) |
| T3 — google.mjs | **done** | `ca22e30` | 28 tests (T11, T11a, T12) |
| T4 — typed wrappers | **done** | `0681d92` | `requireAdmin()` → `notFound()` only |
| T5 — auth routes | **done** | `c3af966` | D3: one undeclared shared file |
| T6 — studio pages | **done** | `d38a0ba` | **D4 (counting)** — route group |
| T7 — proxy gate | **done** | `f24c536` | baseline replay clean |
| T8 — tracker gate | **done** | `452bdc6` | 7 tests; also fixed a nav-reactivity gap |
| T9 — prebuild chain | **done** | `20c232b` | adds, does not replace |
| T10 — check:admin | **done** | `a540dd6` | D5: allowlist is 6, not 5 |
| T11 — escaping tests | **done** | `e6de0ed` | 7 tests (T15, T16) |
| T12 — live verification | **done** | this commit | A4, T13, T14, parity |

## Verification summary

| Check | Result |
|---|---|
| `npm run build` | green, `prebuild` runs all three gates |
| `npx tsc --noEmit` | exit 0 |
| `npm run lint` | exit 0, zero warnings |
| `npm run test:auth` | **63 pass, 0 fail** |
| `npm run test:rules` | 30 pass (P1, untouched) |
| `npm run check:content` | OK |
| `npm run check:admin` | OK — proven to bite on a planted nav link |
| **Baseline replay (T7)** | **10/10 MUST-NOT-CHANGE rows pass**, 6 admin rows changed as predicted, 0 unexpected |
| **P1 parity (T12)** | 55/60 identical; the 5 differing are the *same* blog pages already justified in P1's R1 — **0 new differences from P2** |

## T12 live results

**A4 — `X-Robots-Tag: noindex, nofollow` served on all three:** `/studio`, `/studio/signed-out`, `/api/studio/auth/login`. Load-bearing, not belt-and-braces: it is the only control on `/api/studio/*` (survey S4).

**T13 composition half — the gate proven end to end:**

| Cookie | Result |
|---|---|
| none | **404** |
| forged (wrong secret) | **404** |
| valid, email NOT on allowlist | **404** ← proves per-call re-check revokes a live session |
| valid, allowlisted | **200**, renders "Signed in as editor@lanshore.com" |

**T14** — `/studio` returns 404 with a **zero-byte** body; no useful error surface.

**A2/A3 live** — `studio` appears 0 times in `sitemap.xml`, `llms.txt`, `llms-full.txt`; 0 HTML pages link to the admin; 0 occurrences in `robots.txt`.

**Exempt-path proof** — with config present, `/api/studio/auth/login` returns **307 to accounts.google.com**, confirming the proxy exempted it rather than 404ing it. `/studio/signed-out` → 200 while `/studio/signed-out-and-then-something` → 404, proving exact-match rather than prefix.

## Open assumptions

- **A1** — the 8 Vercel vars are still `UNVERIFIED` from here (no CLI). Everything above ran against locally injected test values, which proves the *code path*, not your configuration.
- **A2** — Google's real endpoints remain unexercised. 28 tests prove the verifier **rejects** bad tokens; only a live sign-in proves it **accepts** a genuine one.
- **A4** — Workspace/Internal consent screen still unanswered. Affects no task here.
- **A7** — P1's golden capture survived and was used. Still ephemeral.

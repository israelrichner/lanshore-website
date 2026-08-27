# Test results — studio-auth-boundary (P2)

**Mode:** verify · **Date:** 2026-08-27 · **Branch:** `feat/content-migration-p1` · Pass 1
**Scope:** 12 commits `ab7f7c0..ff844eb`

## Baseline status — NOT reduced mode

Unlike P1, a baseline exists and was captured **before** the first edit: `test/baseline.md` plus the runnable `test/baseline/proxy-behaviour.mjs`, committed `97ab444`, validated 16/16 against the unmodified tree. Step 1 therefore ran for real, and the regression claims below are load-bearing rather than caveated.

## Step 1 — Regression

Replayed from a **clean** build (`rm -rf .next`), server started with **no admin env** so conditions match the baseline capture exactly.

**16/16 rows accounted for. 0 REGRESSION. 0 UNKNOWN. 0 FLAKE.**

### MUST-NOT-CHANGE — all 10 pass unchanged

This is the result that matters most, because T7 made `proxy()` **async**, which changes the return type for every request to the site rather than just `/studio`.

| Behaviour | Rows | Result |
|---|---|---|
| Retired-WordPress 410 (`/wp-login.php`, `/xmlrpc.php`, `/wp-admin/*`, `/wp-content/*`, `/wp-includes/*`, `/wp-json/*`) | 6 | **all 410, unchanged** |
| Host canonicalization — canonical hosts get **no** header | 2 | unchanged |
| Host canonicalization — non-canonical get `noindex, nofollow` | 2 | unchanged |

### Changed rows — 6, all `INTENDED`, each cited

| # | Row | Before → After | Classification |
|---|---|---|---|
| R1 | `/studio` | 404 → 404 **+ noindex** | `INTENDED` — `03-design.md` § Layer model (proxy 404s `/studio`) and § Round 1 revisions B2 (admin never indexable). Same status, different cause: previously a missing route, now the gate. |
| R2 | `/studio/signed-out` | 404 → **200** + noindex | `INTENDED` — `03-design.md` § Layer model, exempt list. This row *is* blocker B3's fix: the sign-in page must be reachable without a session. |
| R3 | `/studio/signed-out-and-then-something` | 404 → 404 + noindex | `INTENDED` — `03-design.md` § Layer model: "exact-equality, never a prefix". Staying 404 is the assertion. |
| R4 | `/api/studio/auth/login` | 404 → 404 + noindex *(unconfigured)* | `INTENDED` — `03-design.md` § Fail-closed configuration. With config present it returns **307 to accounts.google.com** (verified separately), proving the proxy exempted it. |
| R5 | `/api/studio/auth/callback` | 404 → 404 + noindex | `INTENDED` — same citation as R4. |
| R6 | `/api/studio/auth/logout` | 404 → **405** + noindex | `INTENDED` — `03-design.md` § Round 1 revisions m1, "logout is POST-only". 405 on a GET is that decision working. |

**R4/R5 needed disambiguating, not assuming.** A 404 on an exempt path is exactly what blocker B3 looks like from outside. Re-run with admin config present: login returns **307 to Google**. The 404 is the route's own fail-closed behaviour, not the proxy — two very different things that look identical unconfigured.

### Project suite vs preflight

`implement/preflight.md` records **no pre-existing failures**.

| Suite | Result |
|---|---|
| `npm run test:auth` | **63 pass, 0 fail** (21 session + 28 google + 7 tracker-gate + 7 escaping) |
| `npm run test:rules` | 30 pass, 0 fail (P1, untouched) |
| `npm run check:content` | OK |
| `npm run check:admin` | OK |

No newly-red tests. No flakes.

## Step 2 — Done-criteria coverage

Every row is an executed command with an observed result.

### Access control

| Criterion | Check | Result |
|---|---|---|
| Allowlisted account reaches `/studio` | signed cookie + live request | **PASS** — 200, renders "Signed in as editor@lanshore.com" |
| Non-allowlisted refused | valid cookie, email off allowlist | **PASS** — 404 |
| …and lands somewhere that says so | `/studio/signed-out?error=denied` | **PASS** — renders "not permitted to sign in." |
| Removing an email revokes a **live** session | same valid cookie, allowlist changed | **PASS** — 404. The per-call re-check works; revocation is immediate, not deferred 8h. |
| Unset / empty allowlist ⇒ nobody | unit T5/T6, five empty forms | **PASS** |
| `ADMIN_ALLOWED_DOMAIN` ANDed, not ORed | live, allowlist deliberately containing a gmail address | **PASS** — on-list+in-domain 200; on-list+outside-domain 404; in-domain+not-on-list 404 |
| `email_verified: false` refused | unit T9 | **PASS** — and the string `"true"` does not count |
| Forged signature refused | live | **PASS** — 404 |
| Expired `exp` refused | live | **PASS** — 404 |

### Proxy gate

| Criterion | Result |
|---|---|
| `/studio` 404s without a session | **PASS** |
| Exactly 4 exempt paths, exact equality | **PASS** — `signed-out` 200 vs `signed-out-and-then-something` 404 |
| WordPress 410 still fires | **PASS** — 6/6 |
| Host canonicalization still fires | **PASS** — 4/4 |

### Invisibility

| Criterion | Result |
|---|---|
| `X-Robots-Tag` on `/studio`, `/studio/signed-out`, `/api/studio/auth/login` | **PASS** — all three `noindex, nofollow` |
| Admin absent from `sitemap.xml`, `llms.txt`, `llms-full.txt` | **PASS** — 0 occurrences each |
| Admin absent from `robots.txt` | **PASS** — 0 occurrences |
| No public page links to the admin | **PASS** — 0 of 56 captures |
| GA4 / HubSpot do not fire on `/studio` | **PARTIAL** — gate logic PASS (7 unit tests, both components verified to call it). Live DOM behaviour `UNVERIFIED — no headless browser`; the scripts are client-injected and absent from served HTML on every page. |

### Fail-closed

| Criterion | Result |
|---|---|
| Missing config ⇒ admin 404s, login refuses | **PASS** — login 404 unconfigured, 307 configured; `/studio/signed-out` stays 200 so the entry point survives a misconfigured deploy |

### Tests / build

| Criterion | Result |
|---|---|
| `test:auth` green | **PASS** — 63/63 |
| `prebuild` runs content gate **and** auth tests | **PASS** — `check:content && test:auth && check:admin`, content first |
| `npm run build` green | **PASS** |
| P1 content gate still passes | **PASS** |

### UNVERIFIED

| # | Criterion | Why |
|---|---|---|
| U1 | A real Google account completes sign-in | Requires live Google + a deployed URL. 28 tests prove the verifier **rejects** bad tokens against a locally generated key; nothing proves it **accepts** a genuine one (`assumptions.md` A2). |
| U2 | Visual correctness of `/studio`, `/studio/signed-out` | No headless browser (Step 3). |
| U3 | Trackers silent on `/studio` **in a real browser** | Same reason; only the gate function could be tested. |
| U4 | Vercel env-var names match | `vercel` CLI not authenticated (`assumptions.md` A1). |

## Step 3 — Visual

**Not run.** No `playwright`/`puppeteer` in `node_modules`, no `chrome`/`chromium`/`msedge` on PATH. Per Loop T5's prerequisite path the step was not attempted rather than partially faked.

`UNVERIFIED — no headless browser` for:

- `/studio/signed-out` — the sign-in page, **the only admin URL a signed-out person can load**. Its button is the entire entry path; if it does not render or is not clickable, nobody gets in.
- `/studio` — the gated dashboard, including the sign-out form.
- Both under the public `Header`/`Footer` (accepted residual A3), unchecked for layout collision at any width.

HTML-level evidence is good — both return 200, the dashboard renders the signed-in email, the denied message renders — but **no view was loaded in a browser at any width.**

## Step 5 — Maintenance sweep

Scoped to `97ab444..HEAD`.

**`removes:` cross-check — all clear:**

| Declared removal | State |
|---|---|
| T8 unconditional tracker firing on admin | removed — both components gated |
| T8 local `CANONICAL_HOSTS` duplicates | removed — one shared definition |
| T11 duplicate `toJsonLd` implementation | removed — `schema.ts` re-exports, does not reimplement |

**Findings:**

- **M1 — `requireAdminRoute()` is defined and never called.** `src/lib/studio/session.ts:85`. It is the route-handler form of the boundary, written for P3's write endpoints; P2's three auth routes are their own boundary and do not use it. **Not blocking**, but flagged rather than silently accepted: a future survey would otherwise cite it as live, exercised code. It is untested as well as unused.
- Working tree clean; 0 orphan/backup files.
- **No packages added** — only three npm *scripts*.
- No `TODO`/`FIXME`/`HACK` added.
- **INFO — admin config is read by dynamic key access** (`session.mjs:205`, `readAdminConfig(process.env)`), so `process.env.GOOGLE_OAUTH_CLIENT_ID` and the other three never appear literally in source. A static scan or a `vercel env ls` name-diff will not see them. Runtime behaviour is proven correct either way, but anyone doing env-parity tooling later needs to know.

## Baseline retirement (Step 7)

Ran because the verdict is `SHIP WITH CAVEATS`. All six `INTENDED` findings were **regenerated**, not retired — the paths still exist and still have asserted behaviour; only their expected values moved.

Values were taken from **Step 1's Regression table above**, not re-observed. Re-observing would quietly turn this step into a second, unaccountable regression check.

| Finding | Action | New assertion | Citation |
|---|---|---|---|
| R1 `/studio` | regenerated | 404 + `noindex, nofollow` | `03-design.md` § Layer model |
| R2 `/studio/signed-out` | regenerated | **200** + `noindex` | `03-design.md` § Layer model (exempt list) |
| R3 `/studio/signed-out-and-then-something` | regenerated | 404 + `noindex` | `03-design.md` § Layer model (exact-equality) |
| R4 `/api/studio/auth/login` | regenerated | 404 + `noindex` *(unconfigured)* | `03-design.md` § Fail-closed configuration |
| R5 `/api/studio/auth/callback` | regenerated | 404 + `noindex` *(unconfigured)* | `03-design.md` § Fail-closed configuration |
| R6 `/api/studio/auth/logout` | regenerated | **405** + `noindex` | `03-design.md` § Round 1 revisions m1 |

All 16 rows are now `MUST NOT CHANGE`. Re-run against the regenerated file: **16/16 ok, 0 changed, 0 regressions, exit 0.**

**Caveat written into the file itself:** R4 and R5 are *fail-closed* values. With admin env vars present, `/api/studio/auth/login` returns **307 to Google**, not 404. The file must therefore be run **without admin env**, and both rows say so inline — otherwise a future session sees a spurious diff and either "fixes" a working gate or dismisses a real one.

Without this step the next session's preflight would record six failing rows as pre-existing, and every future session would inherit a baseline that disagrees with the code it is meant to measure.

# Release readiness — studio-auth-boundary (P2)

**Date:** 2026-08-27 · **Branch:** `feat/content-migration-p1` · Verify pass 1

---

# VERDICT: SHIP WITH CAVEATS

**0 regressions. 0 failed done-criteria. 0 CRITICAL, HIGH or MEDIUM security findings.**

Not `SHIP`, for two reasons that are about *coverage*, not defects:

1. **Nobody has ever signed in.** Google's live endpoints are unexercised. 63 tests prove the verifier **rejects** bad tokens; nothing proves it **accepts** a genuine Google one.
2. **No browser has loaded the sign-in page** — the single view the entire feature depends on.

Not `DO NOT SHIP`: the baseline replay is clean, the gate is proven across nine access-control states, and the security scan found nothing above INFO.

---

## Build

| Check | Result |
|---|---|
| Clean production build (`rm -rf .next` → `npm run build`) | **exit 0** |
| `prebuild` chain | `check:content` → `test:auth` → `check:admin`, all green |
| `npx tsc --noEmit` | exit 0 |
| `npm run lint` | exit 0, zero warnings |
| `npm run test:auth` | **63 pass, 0 fail** |
| `npm run test:rules` (P1) | 30 pass, 0 fail |
| Production start + health | `/robots.txt` 200, `/` 200, `/studio/signed-out` 200; process torn down, port released |

**Client bundle: 876K — identical to P1's baseline.** No admin or session identifier appears in any client chunk. P2 ships nothing to the browser, which is the correct shape for an auth boundary.

## Regression

**The headline result.** T7 made `proxy()` async, changing the return type for **every request to the site**, not just `/studio`.

| | |
|---|---|
| MUST-NOT-CHANGE rows | **10/10 pass** — 6 WordPress 410s, 4 host-canonicalization |
| Changed rows | 6, all `INTENDED`, each cited into `03-design.md` |
| REGRESSION / UNKNOWN / FLAKE | **0 / 0 / 0** |
| P1 parity | 55/60 captures identical; the 5 differing are *exactly* the blog pages already justified in P1's R1 — **0 new differences from P2** |

Unlike P1, this ran against a real baseline captured before the first edit. The claim is load-bearing.

## Deployment target

**No target config in the repo** (no `vercel.json`, `.vercel/project.json`, `netlify.toml`, Dockerfile, k8s manifest, `Procfile`, `render.yaml`, `fly.toml`), and **no `vercel` CLI on PATH**.

| Check | Result |
|---|---|
| Remote env-var parity | **UNVERIFIED — `vercel` CLI not authenticated** |
| Rolling-deploy compatibility | **UNVERIFIED — no deployment target detected** |

**P2 adds 5 required env vars** (`GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `ADMIN_SESSION_SECRET`, `ADMIN_ALLOWED_EMAILS`, plus optional `ADMIN_ALLOWED_DOMAIN`), which makes this the first change in the project where env parity genuinely matters. Two compounding facts:

- The design **fails closed**, so a typo'd name produces a 404 indistinguishable from "the gate is working".
- The config is read by **dynamic key access**, so even an authenticated `vercel env ls` name-diff would not see these four (`security.md` INFO-2).

**Practical consequence: the first sign-in attempt is the only real test of your Vercel configuration.** If it 404s, suspect config before code.

## Migrations

**None.** No database, no schema, no data migration.

**Reversibility: full.** `git revert` of the 12 commits removes the admin entirely; no external state was mutated. The one non-additive change (`src/proxy.ts`) has its prior behaviour captured in a committed, runnable baseline.

## Caveats

### C1 — Nobody has signed in *(why this is not `SHIP`)*

Google's OAuth and JWKS endpoints have never been contacted. The 28 token tests run against a **locally generated RSA key** and prove rejection of: wrong `aud`, wrong `iss`, subtly-wrong `iss`, expired/missing/non-numeric `exp`, mismatched/missing `nonce`, a foreign signature, a tampered payload, `alg: none`, symmetric algs, other asymmetric algs, a disagreeing key `alg`, and a non-RSA key.

None of that proves a **real** Google token is accepted.

**To close:** deploy, open `/studio/signed-out`, sign in with an allowlisted account.

### C2 — No browser has rendered the sign-in page

No headless browser is available, so Step 3 did not run (Loop T5 prerequisite path — not attempted rather than faked).

`/studio/signed-out` is **the only admin URL a signed-out person can load**, and its button is the entire entry path. It returns 200 and the HTML contains the button and the correct denied-message text, but nothing has confirmed it renders, is clickable, or survives a mobile width — under the public `Header`/`Footer` it now sits inside (accepted residual A3).

**To close:** `npx playwright install chromium`, then load `/studio/signed-out` and `/studio` at desktop and mobile widths.

### C3 — Tracker suppression proven in logic, not in a live DOM

The gate is unit-tested (7 tests, both components verified to call it), but the trackers are client-injected and appear in no served HTML, so the browser-level behaviour is unverified. Same root cause as C2.

### C4 — `requireAdminRoute()` is unused, untested, and will guard the first write endpoint

Defined at `src/lib/studio/session.ts:85`; nothing calls it. P3 will put it in front of endpoints that commit to `main`. Treat it as unproven code at that point, not as a control inherited from a reviewed P2.

### C5 — Remote env parity unverified

See Deployment target above.

### C6 — P1's caveats are still open

Unchanged by this work: the Vercel preview check on the gated white-paper download (P1's C2 / review blocker B2), and P1's own visual gap.

## What this does NOT mean

**`SHIP` here does not deliver the owner's request.** P2 is the gate and nothing behind it — no editor UI, no publish button, no write path. Updating a blog post still requires a developer and a git commit.

That is the intended sequencing, not an oversight: a write endpoint must never exist without a reviewed gate in front of it. The feature arrives in P3.

## Recommended before merge

1. Deploy a preview and complete one real sign-in (closes C1 and validates your Vercel config in one action).
2. Install a headless browser and clear C2/C3 — the sign-in page is the highest-value unrendered view in the project.
3. Answer A4: if `lanshore.com` is a Google Workspace domain, set the consent screen to **Internal** now. Switching later may force re-consent.
4. Same trip: exercise the gated white-paper download to close P1's B2.
5. Restore the parked P1 stash on its own branch: `git checkout preview/faq-agentic-spm && git stash pop`.

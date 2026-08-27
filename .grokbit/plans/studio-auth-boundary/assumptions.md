# Assumptions — studio-auth-boundary (P2)

## A1 — The eight env vars are set in Vercel — UNVERIFIED

Owner-stated 2026-08-27. **Cannot be checked from this repo** — no `vercel` CLI is authenticated here, and env-var *names* are all that would be checkable anyway.

**Why this one bites harder than usual:** the design fails closed. A typo'd variable name produces a **404**, which is indistinguishable from "P2 isn't deployed yet" and from "the proxy is doing its job". There is no error message to read.

**Closes when:** first deploy, by signing in successfully with an allowlisted account. Until then, treat sign-in failure as a config problem first and a code problem second.

## A2 — Google's OAuth and JWKS behaviour — UNVERIFIED

External to this repo (`02-survey.md` S8). Every claim about Google's endpoints, token shape, and key rotation comes from the source plan §6.5.2, not from anything read on disk.

T11/T12 use a **locally generated RSA key**. They prove our verifier *rejects* malformed, wrongly-signed, wrongly-audienced and `alg`-confused tokens. They do **not** prove it *accepts* a genuine Google token. Only a real sign-in does that.

**Closes when:** an allowlisted account completes the flow against a deployed preview.

## A3 — Admin chrome deviates from source plan `:857` — CLOSED by owner decision

Source-plan task `:857` requires the studio layout to omit the public `Header`/`Footer`. `02-survey.md` S3 establishes this is unachievable without route groups.

**Owner chose (2026-08-27):** path-gate the two trackers, keep nesting. `/studio` still renders inside `Header`, `Footer`, `MobileContactBar` and the marketing JSON-LD.

**Residual risk, accepted:** cosmetic only. The substantive harm — GA4 and HubSpot recording editor activity — is removed by T8. The JSON-LD is inert on a `noindex` page.

## A4 — Is `lanshore.com` a Google Workspace domain? — OPEN

Source plan Open Question **H**, still unanswered. If it is, the OAuth consent screen should be **Internal**, which restricts sign-in at Google's own layer — a genuine second gate rather than a UI hint.

**Changes no task in this plan.** It is a console setting on an OAuth client that already exists. Worth confirming before P2 ships, because switching later may require re-consent.

**Note:** `ADMIN_ALLOWED_DOMAIN` and the `hd` parameter are **not** substitutes. Google does not enforce `hd`; the allowlist is the gate.

## A5 — `GITHUB_TOKEN` expiry owner and date — OPEN, and the clock is already running

Source plan Open Question **I**. P2 does not consume `GITHUB_*` — that is P3. But the token has already been created, so its expiry is already ticking.

The failure mode is the nasty kind: **publishing silently stops working**, a year from now, for someone who was not part of this conversation.

**Closes when:** a named person and a date are recorded in `docs/CONTENT-EDITING.md` (P3).

## A6 — The A1 five-path allowlist is a standing maintenance obligation

T10 asserts the admin path segment appears in exactly five enumerated files, and that the allowlist itself has exactly five entries.

That count assertion is deliberate: it converts "quietly widen the allowlist" into a visible diff. But to whoever first hits it legitimately, **it will look like a broken test**. The inline comment must say why it exists, or the fix will be to relax it — which silently disables the check that catches a stray nav link.

## A7 — P1's golden capture is ephemeral

T12 diffs P2's output against P1's 56-route golden capture. That capture lives in a **scratchpad directory**, not the repo, and may not survive to when P2 is implemented.

**If it is gone:** re-capture from `feat/content-migration-p1` **before** T7 changes the proxy. A parity baseline taken after the proxy edit proves nothing.

Promoting `capture.mjs`/`compare.mjs` into the repo would fix this permanently. Deliberately **not** done in this plan — it is a scope decision for the owner, not something to slip into an auth package.

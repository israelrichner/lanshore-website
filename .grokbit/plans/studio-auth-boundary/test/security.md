# Security — studio-auth-boundary (P2)

**Date:** 2026-08-27 · **Scope:** `97ab444..HEAD`, 33 files, +2252/−57

This is the package where a silent failure means **unauthorised write access to the live site**, so the scan is deliberately heavier than P1's.

## Verdict: no CRITICAL, no HIGH, no MEDIUM. Three INFO.

## CRITICAL / HIGH / MEDIUM

**None.**

## Checks performed

### Secrets — CLEAN

No credential material in the diff; no `.env`, `.pem` or `.key` committed. `.env.example` gained 8 names and **zero values** — asserted mechanically by T1's verify, with comment lines excluded so a documented example is not a false positive.

`ADMIN_SESSION_SECRET` is never logged, never returned in a response, and never reaches a client bundle (below).

### The gate is entirely server-side — CLEAN

No client component exists anywhere under `src/app/studio/` or `src/lib/studio/`. Authorization is never decided in the browser.

Confirmed at the bundle level: **no `studio_session`, `ADMIN_ALLOWED`, or `verifySession` identifier appears in any `.next/static/chunks/` file**, and the client bundle is **876K — byte-identical in size to P1's baseline**. P2 ships nothing to the browser.

### Session cookie — CLEAN

`httpOnly: true`, `secure` (off only when `NODE_ENV === "development"`, so real deployments always set it), `sameSite: "lax"`, `path: "/"`, `maxAge` 8h.

Signature verified with `crypto.subtle.verify` — constant-time by construction. Signature strings are never compared with `===`. The signature segment must be strict base64url before verification; `atob` is lenient, and a lenient decoder in front of a signature check invites malleability bugs.

No unsigned-implies-trusted path: `body`, `body.`, `body.null` and `body.undefined` are each rejected explicitly and tested.

### Open redirect / host-header injection — TESTED, CLEAN

The most plausible real vulnerability in an OAuth flow, so it was tested rather than reasoned about:

| Check | `Host: lanshore.com` | `Host: evil.example` |
|---|---|---|
| OAuth `redirect_uri` | `https://lanshore.com/api/studio/auth/callback` | **identical** |
| Post-callback redirect target | `http://localhost:3000/studio/signed-out?...` | **identical** |

`redirect_uri` is built from `NODE_ENV` plus the `SITE_URL` constant, never from a request header — a header-derived value is attacker-controllable and turns the callback into an open redirect that leaks the authorization code. Only the two pre-registered values are reachable.

Internal redirects use `request.nextUrl.origin`, which is request-derived in principle; verified **not** steerable by a spoofed `Host`. Both targets are same-origin relative paths regardless.

### CSRF — CLEAN

`state` is double-submitted against an `httpOnly` cookie set at login, `SameSite=Lax` (`Strict` would withhold it on the top-level redirect back from Google and break the callback outright), `Max-Age=600`, scoped to `Path=/api/studio/auth`, and **cleared on both the success and failure paths** so a failed attempt leaves no replay window.

Logout is **POST-only** — verified live, a GET returns 405. As a GET, a bare `<img src=".../auth/logout">` on any page would sign an editor out.

### `id_token` verification — CLEAN, and the alg trap is closed

The algorithm is taken from **our** expectation (RS256) and checked **before any key is selected**. Rejections are tested for `alg: none`, HS256/384/512 (the sign-with-the-public-key-as-HMAC-secret attack), and RS512/PS256/ES256 — accepting whatever the header names, even something reputable, is the same class of bug.

Also rejected: wrong `aud`, wrong `iss`, a subtly-wrong `iss` (`accounts.google.com.evil.example`), expired `exp`, non-numeric `exp`, mismatched or missing `nonce`, missing `email`, an `iat` far in the future, a signature from a different key, a tampered payload with a valid signature, a published key whose own `alg` disagrees, and a non-RSA key type.

JWKS rotation is bounded: an unknown `kid` refetches **exactly once**, then rejects — so a bogus `kid` cannot drive unlimited outbound requests.

### Authorization logic — CLEAN

Exact allowlist membership after normalisation, never `endsWith`/`includes` — `editor@lanshore.com.attacker.com`, `editor@lanshore.co` and `xeditor@lanshore.com` are each tested as rejections.

Empty allowlist authorizes **nobody**, tested in five forms (`undefined`, `""`, `"   "`, `","`, `" , , "`). `ADMIN_ALLOWED_DOMAIN` is ANDed and never grants access alone — verified live as well as in unit tests.

Re-checked on **every** call, so removing an email from the env var revokes a live session immediately.

### Information disclosure — CLEAN

`requireAdmin()` fails only via `notFound()`, so an unauthorised outcome is byte-identical to a missing page. Verified across five cookie states (none, forged, expired, off-allowlist, outside-domain) — all 404, all indistinguishable.

`/studio` returns 404 with a **zero-byte body**. `/studio/signed-out` maps its error reason through a **fixed table** rather than echoing the query string, so the one page an unauthenticated visitor can load is not a reflection sink.

### Dependencies

**None added.** `npm audit`'s 6 pre-existing high-severity advisories are unchanged from P1 and untouched by this work.

## INFO-1 — `requireAdminRoute()` is unused and therefore unexercised

`src/lib/studio/session.ts:85` defines the route-handler boundary, and nothing calls it. It is written for P3's write endpoints.

**Why it belongs in a security report rather than only in maintenance:** it will be the first line of defence on the first endpoint that can write to `main`, and it currently has **no test and no caller**. Whoever wires P3 should treat it as unproven code, not as a reviewed control inherited from P2.

## INFO-2 — admin config is read by dynamic key access

`readAdminConfig` reads `source[k]` (`session.mjs:205`), so `process.env.GOOGLE_OAUTH_CLIENT_ID` and the other three never appear literally in the source.

Runtime behaviour is proven correct (login 404s unconfigured, 307s configured). But a static scan — including the `vercel env ls` name-diff this phase would normally use for env parity — cannot see those four variables. Anyone building env-parity tooling later needs to know, or it will report a false all-clear.

## INFO-3 — the `secure` cookie flag keys off `NODE_ENV`

`secureCookies = process.env.NODE_ENV !== "development"`. Correct for both real deployments and local HTTP dev, but it means a non-production build served over plain HTTP would set `Secure` cookies that the browser then refuses to store — presenting as "sign-in silently does nothing". Worth knowing before someone debugs that from scratch.

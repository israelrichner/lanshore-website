# Design — studio-auth-boundary (P2)

The provider choice (Google, hand-rolled rather than `next-auth`) was settled upstream in the source plan's ADR **B** and is not reopened here. Two genuine forks remain, plus the layer question.

## Fork 1 — How is Google's `id_token` verified?

| | Approach | Trade-off |
|---|---|---|
| **A (chosen)** | Fetch Google's JWKS, cache by `kid`, verify RS256 locally with `crypto.subtle` | More code (~120 lines). No per-login network dependency beyond the token exchange itself. Verification is self-contained and testable offline against a locally generated RSA key — which is what makes T11/T12 possible at all. |
| B | POST the token to Google's `tokeninfo` endpoint and trust the response | Much less code. But it adds a second synchronous Google dependency on every sign-in, and it makes the security-critical step untestable without network access — T11/T12 would become integration tests that cannot run in `prebuild`. |

**Chosen: A.** The deciding factor is testability, not elegance. This is the one component where a silent failure grants write access to the live site, and the test matrix (T11, T12) is the main defence. A design that cannot be unit-tested offline forfeits that.

**The `alg` trap, stated explicitly:** the algorithm must be taken from *our* expectation (RS256), never from the token header. `alg: none` and any symmetric algorithm are rejected before a key is even selected. T12 pins this.

## Fork 2 — How is the session represented?

| | Approach | Trade-off |
|---|---|---|
| **A (chosen)** | Stateless signed cookie: `base64url(payload) + "." + base64url(HMAC-SHA256(payload, ADMIN_SESSION_SECRET))`, payload `{email, iat, exp}` | No store to run or back up. Revocation is coarse — rotating `ADMIN_SESSION_SECRET` signs *everyone* out. Mitigated below. |
| B | Opaque session id + server-side store | Precise per-user revocation, but P1's whole architecture is "no runtime data dependency". Adding a store to the admin reintroduces exactly the dependency the project spent P1 avoiding, for one role and a handful of users. |

**Chosen: A**, with the revocation gap closed a different way: `requireAdmin()` re-checks the email against `ADMIN_ALLOWED_EMAILS` on **every call**, not just at sign-in. So removing someone from the env var and redeploying revokes their live session immediately, even though their cookie is still cryptographically valid. That converts the "coarse revocation" weakness into an env-var edit, which is the same lever that grants access in the first place.

**Signature comparison uses `crypto.subtle.verify`**, which is constant-time by construction. Never `===` on signature strings.

## Layer model — where the check actually runs

Next's own guidance limits proxy/middleware to optimistic checks (source plan §6.5.3, citing `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md:29`).

| Layer | Does | Boundary? |
|---|---|---|
| `src/proxy.ts` | Cookie present + signature valid → continue; else **404** for `/studio/*` except the four exempt paths. Sets `X-Robots-Tag`. | **No** |
| Each admin page (server component) | `await requireAdmin()` before rendering | **Yes** |
| Each admin route handler | `await requireAdmin()` as the first statement, before reading the body | **Yes** |

**404, not 401 or a redirect.** An unauthenticated hit is indistinguishable from any missing page, so a scanner learns nothing. This is cloaking, not a control — worth ten lines only because it costs nothing.

**The exempt list is exact-equality, never a prefix.** `startsWith("/studio/signed-out")` would also exempt `/studio/signed-out-and-then-something`, and this check runs *before* the real gate. That was review blocker B3, where the original rule 404'd the sign-in page itself and left no way in at all.

## Admin chrome — deviation from source plan `:857`

Source-plan task `:857` requires the studio layout to render "not the public Header/Footer". `02-survey.md` S3 establishes this is unachievable without route groups, because `src/app/layout.tsx` is the only root layout and App Router nests rather than replaces.

Three options were costed (S3). **Owner chose: path-gate the trackers, keep nesting** (`01-intent.md` A3).

The real harm was never the visual chrome — it was `<HubSpotLoader/>` (`layout.tsx:75-76`) and `<GoogleAnalytics/>` (`:77-78`) recording editor activity into marketing and analytics. Both are `"use client"` with an existing `shouldLoadTracker()` gate built for exactly this kind of exclusion, so a path check is ~2 lines each.

**Accepted residual:** `/studio` still renders `Header`, `Footer`, `MobileContactBar`, and the marketing JSON-LD. Cosmetic, and the JSON-LD is inert on a `noindex` page.

**Explicitly rejected:** reading `headers()` in the root layout to branch on pathname. That makes the entire tree dynamic and destroys the static prerendering of all 56 routes — the property P1 exists to protect.

## Fail-closed configuration

If any of `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `ADMIN_SESSION_SECRET`, `ADMIN_ALLOWED_EMAILS` is missing, admin routes 404 and login refuses to start a flow.

This deliberately **does not** follow the repo's existing precedent. `getFormId` (`src/lib/hubspot.ts:24-36`) returns `undefined` and `src/app/api/whitepaper/route.ts:23-33` logs and 503s — right instinct, too lenient for a gate on writes. A half-configured deploy must be a closed door, not an open one.

**Empty string is not "unset-but-fine".** `ADMIN_ALLOWED_EMAILS=""` must reject everyone. T6 exists because this is the single most likely bug to ship.

## File layout

Following P1's established `.mjs` core + typed `.ts` re-export pattern (`02-survey.md` S5):

```
src/lib/studio/
  google.mjs      auth URL, code exchange, JWKS fetch + kid cache, full id_token verify
  google.ts       typed re-export
  session.mjs     cookie sign/verify (crypto.subtle), allowlist check, config guard
  session.ts      typed re-export + requireAdmin() (needs next/headers)
  session.test.mjs / google.test.mjs   T1-T13
src/app/api/studio/auth/
  login/route.ts  callback/route.ts  logout/route.ts
src/app/studio/
  layout.tsx      requireAdmin() gate + robots noindex metadata
  page.tsx        placeholder dashboard
  signed-out/page.tsx
```

`requireAdmin()` lives in the `.ts` wrapper because it needs `next/headers`, which cannot be imported from a bare `.mjs` run under `node --test`. The testable logic — signing, verification, allowlist matching — stays in `.mjs` and is called by it.

## Supersession dispositions

Every item from `02-survey.md` S7 gets exactly one.

| Item | Disposition | Reason |
|---|---|---|
| `src/proxy.ts` existing behaviour (WordPress 410, host canonicalization) | **COEXIST** | Both must survive untouched. P2 extends the function inline; the file must not gain a `config.matcher`, which would silently disable host canonicalization site-wide. Verified in both directions by its own task. |
| `getFormId` permissive env pattern | **COEXIST** | Superseded *for admin config only*, deliberately. The four HubSpot callers keep it — their lenient behaviour is correct for an optional marketing form and wrong for a write gate. Not a refactor target. |
| `src/app/robots.ts` | **LEAVE** | Check A3 requires the admin path stay **absent**. Touching this file is the failure mode, not the fix. |
| T16 (Markdown renders raw HTML as text) | **REPLACE** | Already established empirically in P1's test phase (8 hostile inputs, all inert — `dynamic-content-management/test/security.md`), but that evidence lives in a report, not a test. P2 replaces it with a committed regression test so a future `rehype-raw` addition fails the build. |
| `<HubSpotLoader/>` / `<GoogleAnalytics/>` unconditional firing | **REPLACE** | Gated on `/studio`. The existing host gate stays; the path check is added to it. |

**Net-additive check:** P2 is overwhelmingly additive, and that is a conclusion rather than an accident — it introduces a surface where nothing existed. The two non-additive items (`proxy.ts`, the trackers) are extensions with protected incumbents, and each carries a verify that proves the incumbent still works.

---

# Round 1 revisions (from `04-review.md`)

Six findings accepted, none disputed. These supersede anything above that conflicts.

## B1 — the A1 allowlist is fixed at five enumerated paths

The chrome decision puts `/studio` into two tracker files, which check A1 would otherwise flag. A1's allowlist is therefore exactly:

```
src/app/studio/**
src/lib/studio/**
src/proxy.ts
src/components/GoogleAnalytics.tsx     <- path-gate only
src/components/HubSpotLoader.tsx       <- path-gate only
```

**Enumerated by full path, never a glob**, and the A1 check asserts the allowlist has **exactly five entries**. A sixth match is a failure. Widening the list later is then a visible diff requiring a decision, which is the whole point of A1 — it must keep catching a stray nav link.

The two tracker entries carry an inline comment saying why they are permitted, or a maintainer will "tidy" the gate and silently restore admin tracking.

## B2 — `proxy()` becomes async, and that is site-wide

`src/proxy.ts:27` is currently synchronous. `crypto.subtle.verify` is not. Making `proxy` async changes the return type for **every request to the site**, including the retired-WordPress 410 and host-canonicalization paths.

A presence-only cookie check would keep it sync, but the source plan specifies "present **and signature valid**" at this layer, and presence-only lets a forged cookie reach the app tier. The async change is the honest cost and is accepted.

**Consequence for verification:** the proxy task must prove **both incumbents still work** — a `410` on `/wp-login.php` and `X-Robots-Tag: noindex, nofollow` on a non-canonical host — not merely that `/studio` 404s.

## M1 — one failure mode: `notFound()`

`requireAdmin()` fails **only** by calling `notFound()` in a page context, and by returning a bare bodyless 404 in a route handler. Never a throw, never a redirect, never a 401.

This matters because an allowlisted-then-removed user holds a *cryptographically valid* cookie: they pass the proxy and reach `requireAdmin()`. If that threw a 500 while a stranger got a clean 404, the difference would confirm to them that their cookie is still real. Every unauthorised outcome must be byte-identical to a missing page.

`notFound()` is already the repo idiom — `src/app/blog/[slug]/page.tsx:45`, `case-studies/[slug]/page.tsx:44`, `agentic-spm/[slug]/page.tsx:42`.

## M2 — JWKS rotation

Google rotates signing keys. Caching by `kid` with no refresh path means the first token signed with a new key fails, and **every sign-in breaks until the process restarts** — on serverless, intermittently and unpredictably.

Behaviour: on an unknown `kid`, refetch JWKS **once** and retry; if it still fails, reject. The cache carries a TTL. Tested as **T11a**.

## m1 — logout is POST-only

Logout is exempt from the proxy 404, so a bare `<img src=".../auth/logout">` from any origin would sign an editor out. Harmless but trivially avoidable.

## m2 — `state`/`nonce` cookie lifetime

`Max-Age=600` (10 minutes), `SameSite=Lax` (`Strict` breaks the callback), cleared on the callback path whether it succeeds or fails.

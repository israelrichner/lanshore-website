# Handoff — studio-auth-boundary (P2) → grokbit-test

`hand_back_cycle: 0` · `snapshot: none` (tree was clean at preflight)

## What this is

The authentication gate for `/studio`, and **nothing behind it**. Google OAuth, an email allowlist in env vars, a stateless signed session cookie, an optimistic proxy 404 over a `requireAdmin()` boundary.

There is deliberately **no editor UI and no write path**. That ordering is the whole safety argument: a write endpoint must never exist without a reviewed gate in front of it.

**The owner's original ask is still not delivered.** Updating a blog post still requires a developer. P3 is the editor and the GitHub write layer.

## Tasks

**12 of 12 done. 0 blocked.**

## Files

**Added**
```
src/lib/studio/session.mjs         session.test.mjs        (21 tests)
src/lib/studio/google.mjs          google.test.mjs         (28 tests)
src/lib/studio/tracker-gate.mjs    tracker-gate.test.mjs   (7 tests)
src/lib/studio/escaping.test.mjs                           (7 tests)
src/lib/studio/session.ts, google.ts, redirect-uri.ts
src/lib/jsonld-escape.mjs
src/app/api/studio/auth/{login,callback,logout}/route.ts
src/app/studio/layout.tsx, signed-out/page.tsx
src/app/studio/(gated)/layout.tsx, (gated)/page.tsx
scripts/check-admin-isolation.mjs
```

**Modified**
```
src/proxy.ts                    now async — site-wide change
src/components/GoogleAnalytics.tsx, HubSpotLoader.tsx
src/lib/schema.ts               toJsonLd re-exported, not reimplemented
package.json                    test:auth, check:admin, prebuild chain
.env.example                    8 names, no values
```

**Dependencies added: none.**

## What a test pass should look at hard

1. **`proxy()` is now async — that is site-wide, not `/studio`-local.** Every request flows through it. The baseline (`test/baseline/proxy-behaviour.mjs`, replay with a server running) covers the two incumbents and passed 10/10, but this is the change most capable of breaking the whole site rather than just the admin.

2. **A1's allowlist is a standing obligation.** `check:admin` asserts the admin path appears in exactly 6 enumerated locations and that the list has exactly 6 entries. To whoever first hits it legitimately it will look like a broken test. The script says why. Confirm the reasoning holds rather than trusting the comment.

3. **`requireAdmin()` must fail only via `notFound()`.** Any path that returns 401, redirects, or throws a 500 tells a removed editor that their cookie is still cryptographically valid. Verified for four cookie states; look for a fifth I missed.

4. **The exempt list is exact-match.** `/studio/signed-out` → 200, `/studio/signed-out-and-then-something` → 404. Try to find a path that slips through.

5. **Google's real behaviour is unexercised** (A2). 28 tests prove the verifier rejects malformed, wrongly-signed, wrongly-audienced and `alg`-confused tokens against a locally generated key. Nothing here proves it accepts a genuine Google token.

6. **`jsonld-escape.mjs` was silently broken twice while being written** — once with a single backslash (replacing `<` with `<`, a no-op that reads as correct), once with a raw U+2028 in a regex literal. Both are commented. Re-derive that the committed version actually escapes rather than trusting the comments.

## Deviations

**1 counting of 3.** Full detail in `deviations.md`.

- **D4 (counting)** — T6's structure was unimplementable: `requireAdmin()` in `src/app/studio/layout.tsx` would have gated `/studio/signed-out` too, 404ing the sign-in page and leaving **no way into the admin at all**. That is review blocker B3 recurring at the layout level after the plan fixed it at the proxy level. Resolved with a route group. **T6's stated verify no longer matches its plan text** — the verify was not edited; the same assertion was run across the two files it now spans.
- **D3** — T5 needed one undeclared file for constants all three routes share; triplicating a cookie *name* is a live auth bug.
- **D5** — the A1 allowlist is 6 paths, not the 5 the plan's own B1 fix specified; it forgot `src/app/api/studio/**`, which the same plan's T5 creates.
- **D1, D2** — standing incidentals (commit hook; a JSDoc annotation T4 needed in T3's file).

## Snapshot

`snapshot: none` — the tree was clean at preflight, so nothing to restore.

**Separately still outstanding:** `stash@{0}` from the P1 session holds `.grok/`/`.claude/`/`AGENTS.md`/`fixtures/` scaffolding belonging to `preview/faq-agentic-spm`. Not this session's snapshot, deliberately not popped here. Restore with `git checkout preview/faq-agentic-spm && git stash pop`.

## Still open for the owner

- **B2 / P1's C2** — the Vercel preview check on the gated white-paper download. Unchanged by P2, still open.
- **A4** — is `lanshore.com` a Workspace domain? If so set the consent screen to **Internal**. Worth settling before P2 ships; switching later may force re-consent.
- **A1** — first real sign-in is the only thing that validates your Vercel configuration. A typo'd variable name produces a 404 indistinguishable from "working as designed".

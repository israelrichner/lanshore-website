# Plan review — studio-auth-boundary (P2)

Append-only. Reviewer ran without subagents, so the design was re-read from disk and attacked deliberately rather than defended.

---

## Round 1 — against `03-design.md`

### BLOCKER B1 — the chosen chrome option breaks check A1 as written

Source-plan check **A1** asserts the admin path segment appears **nowhere** outside `src/app/studio/**`, `src/lib/studio/**`, and `src/proxy.ts`. It exists to catch "someone helpfully added a nav link".

The owner-chosen chrome option (`01-intent.md` A3) puts the literal `/studio` into `src/components/GoogleAnalytics.tsx` and `src/components/HubSpotLoader.tsx` — **both outside that allowlist**. Verified: neither file is in an allowed path.

So A1 fails on the very change that implements the decision. Two bad outcomes are available: someone widens A1 to a wildcard and it stops catching nav links, or someone "fixes" the tracker gate and silently restores admin tracking.

**Resolution:** A1's allowlist gains exactly those two files, **enumerated by full path, not by glob**, with an inline comment stating why each is there. Any *third* file matching is still a failure. The A1 task must assert the allowlist has exactly five entries, so widening it later is itself a visible diff.

### BLOCKER B2 — `proxy()` must become async, and that is a site-wide change

`src/proxy.ts:27` is `export function proxy(request: NextRequest)` — **synchronous**. Verifying the session HMAC requires `crypto.subtle.verify`, which is async.

Making `proxy` async changes the return type for **every request to the site**, not just `/studio`. The WordPress 410 and host-canonicalization paths both flow through it. Next supports async proxy, but this is not a local change and the design did not acknowledge it.

**Resolution:** the design must state it explicitly, and the proxy task's verify must prove **both** incumbent behaviours still work after the signature change — a 410 on `/wp-login.php` and `X-Robots-Tag` on a non-canonical host — not merely that `/studio` 404s.

**Cheaper alternative considered and rejected:** have the proxy check only cookie *presence* and leave signature verification to `requireAdmin()`. That keeps `proxy` sync. Rejected because the source plan explicitly specifies "cookie present **and signature valid**" at this layer, and presence-only means a forged cookie reaches the app tier before being rejected. The async change is the honest cost.

### MAJOR M1 — `requireAdmin()`'s failure mode is unspecified, and inconsistent failure leaks information

The design says `requireAdmin()` "throws/redirects otherwise" — three different behaviours in one phrase. It matters: an allowlisted-then-removed user holds a cryptographically **valid** cookie, so they pass the proxy and reach `requireAdmin()`. If that throws, they get a 500 error page while an unauthenticated stranger gets a clean 404 — which tells the removed user their cookie is still real.

The repo already has a consistent idiom: `notFound()` (`src/app/blog/[slug]/page.tsx:45`, `case-studies/[slug]/page.tsx:44`, `agentic-spm/[slug]/page.tsx:42`).

**Resolution:** `requireAdmin()` calls `notFound()` on every failure in a page context, so every unauthorised outcome is byte-identical to a missing page. Route handlers return a bare 404 with no body. Specify one behaviour, not three.

### MAJOR M2 — JWKS key rotation is not addressed

The design says "fetch JWKS, cache by `kid`". Google rotates signing keys. A cache keyed by `kid` with no refresh path means the first token signed with a new key fails verification, and **every sign-in breaks until the process restarts** — on a serverless platform, unpredictably and intermittently.

**Resolution:** on unknown `kid`, refetch JWKS **once** and retry; if it still fails, reject. Cache carries a TTL. This must be a stated behaviour with its own test, not left to the implementer.

### MINOR m1 — logout should not be a GET

Logout is exempt from the proxy 404, so any origin can trigger it — a bare `<img src="https://lanshore.com/api/studio/auth/logout">` signs an editor out. Harmless (it only clears their own cookie) but trivially avoidable.

**Resolution:** logout accepts **POST** only. Low cost.

### MINOR m2 — the `state`/`nonce` cookie needs an explicit lifetime

The design names `SameSite=Lax` (correct — `Strict` breaks the callback) but never bounds the cookie's life. A long-lived `state` cookie widens the replay window.

**Resolution:** short `Max-Age` (~10 min), cleared on callback whether it succeeds or fails.

---

## Round 1 — Architect response

All six accepted; none disputed.

- **B1** — `03-design.md` gains an "A1 allowlist" subsection fixing the five permitted paths and requiring the count to be asserted.
- **B2** — design now states the async change site-wide; the proxy task's verify covers both incumbents explicitly.
- **M1** — `notFound()` chosen as the single failure mode, matching the repo idiom.
- **M2** — refetch-once-on-unknown-`kid` plus TTL, with its own test (T11a).
- **m1** — logout is POST-only.
- **m2** — `state`/`nonce` cookie gets `Max-Age=600`, cleared on both paths.

---

## Round 2 — re-review after revision

- B1 — **resolved.** Five enumerated paths, count asserted, comment required.
- B2 — **resolved.** Async acknowledged; verify covers WordPress 410 and host canonicalization, not just `/studio`.
- M1 — **resolved.** Single failure mode, consistent with three existing call sites.
- M2 — **resolved.** Rotation path specified and tested.
- m1, m2 — **resolved.**

**Zero BLOCKER, zero MAJOR outstanding.** Loop 3 exits at round 2 of 3.

### Residual notes carried to `assumptions.md`

- Google's endpoint behaviour stays `UNVERIFIED` until a real deployment (`01-intent.md` A2). T11/T12 use a locally generated RSA key, which proves *our* verifier rejects bad tokens — not that it accepts Google's real ones.
- The A1 five-path allowlist is a maintenance obligation. If a future change legitimately needs `/studio` in a sixth file, the count assertion will fail and force a decision. That is the intent, but it will look like a broken test to whoever hits it, so the comment must say so.

---

## Round 3 — Reviewer pass over `plan.md` (does the task list faithfully carry out the design?)

Coverage check first: every design element maps to a task — Fork 1 → T3, Fork 2 → T2, layer model → T4/T7, chrome deviation → T8, fail-closed → T2/T5, and all five dispositions land (proxy→T7, `getFormId`→no task by design, robots→T10/A3, T16→T11, trackers→T8). B1→T10, B2→T7, M1→T4, M2→T3, m1/m2→T5. No orphans.

Three findings against the task list.

### MAJOR M3 — source-plan test T13 has no task, and cannot have one as specified

Source plan §10.4 **T13** requires testing that `requireAdmin()` fails with (a) no cookie, (b) a forged cookie, (c) a valid cookie whose email has since left the allowlist — that last one being the proof that per-call re-checking actually revokes live sessions.

`plan.md` has no task for it, and the omission is structural rather than an oversight: `requireAdmin()` lives in `session.ts` because it needs `next/headers`, and `node --test` cannot load `.ts` under approach (a). T13 is therefore **untestable as written** by the chosen architecture.

**Resolution — state the split rather than pretend coverage.** T13's substance is three assertions about the *logic*, and all three already sit in `.mjs` and are covered by T2. What T2 cannot prove is that `requireAdmin()` actually calls that logic. That residual belongs in T12's live checks.

T12 gains an explicit T13 row, and T2's notes must say it carries T13's logic half. Otherwise a reader comparing §10.4 against this plan sees a missing test and either re-adds it (and it fails to run) or assumes it was dropped.

### MAJOR M4 — T7 must import the `.mjs`, not the `.ts`, and nothing says so

T7 depends on T2 only, which is correct — but the reason is invisible, and an implementer will naturally reach for the typed `session.ts`.

That would be a live bug: `session.ts` imports `next/headers` for `requireAdmin()`. Pulling it into `src/proxy.ts` drags `next/headers` into the proxy runtime, where it does not belong and may not resolve.

**Resolution:** T7's notes state explicitly that it imports the **pure verify function from `session.mjs` directly**, never `session.ts`, and why. The dependency on T2-not-T4 then reads as deliberate rather than as an oversight someone should "fix".

### MINOR m3 — T1's no-values grep is brittle

T1 asserts no committed value via `grep -E '=[^[:space:]]'` over added lines. Empty assignments (`GOOGLE_OAUTH_CLIENT_ID=`) pass correctly, but `.env.example` already uses **commented examples with values** — `# NEXT_PUBLIC_HUBSPOT_TRACKING=force` (`.env.example:29`). Adding a comparable commented hint for the admin vars would fail a check that is otherwise correct.

**Resolution:** the grep excludes comment lines (`grep -v '^\+#'`) before testing for values. Real assignments are still caught; documentation examples are not false-positived.

---

## Round 3 — Architect response

All three accepted.

- **M3** — T12 gains an explicit T13 row (no cookie / forged cookie / removed-email); T2's notes claim T13's logic half. The split is stated in both places so the §10.4 mapping stays legible.
- **M4** — T7's notes now require importing `session.mjs` directly and explain the `next/headers` hazard.
- **m3** — T1's verify excludes comment lines.

**Zero BLOCKER, zero MAJOR outstanding across design and plan.** Loop 3 closed at round 2; Loop 4's review pass closed at round 3.

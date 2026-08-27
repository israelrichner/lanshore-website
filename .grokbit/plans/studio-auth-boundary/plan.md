# Plan — Studio auth boundary (Package 2)

Slug: `studio-auth-boundary` · Approach: hand-rolled Google OAuth + env allowlist, stateless signed cookie, optimistic proxy gate over a `requireAdmin()` boundary · Blast radius: **4 modified files, ~13 new files, 0 new dependencies** · schema: no

**Source plan:** `docs/plans/dynamic-content-management.md` §P2 (`:847-860`), §§6.5.1–6.5.3, 7.3, 10.3, 10.4.
**Base branch:** `feat/content-migration-p1` — P2 extends P1's `prebuild` chain (`02-survey.md` S6). NOT `preview`, NOT `main`.
**Non-goal reminder:** no editor UI, no GitHub write path. P2 is the gate, not the thing behind it.

> Keep the task block format exactly as below. The Implement phase parses it.

## Approval

- [ ] **Approved to implement**

## Tasks

### T1 — Document the eight admin env vars in `.env.example`
- **intent:** Record the names (never values) so a future deploy knows what must be set
- **files:** `.env.example`
- **cwd:** none
- **depends:** none
- **verify:** `node -e "const s=require('fs').readFileSync('.env.example','utf8'); const need=['GOOGLE_OAUTH_CLIENT_ID','GOOGLE_OAUTH_CLIENT_SECRET','ADMIN_ALLOWED_EMAILS','ADMIN_ALLOWED_DOMAIN','ADMIN_SESSION_SECRET','GITHUB_TOKEN','GITHUB_REPO','GITHUB_BRANCH']; const missing=need.filter(n=>!s.includes(n)); if(missing.length){console.error(missing);process.exit(1)}"` exits 0, AND `git diff .env.example | grep -E '^\+' | grep -v '^+#' | grep -E '=[^[:space:]]'` returns **nothing** (no value ever committed; comment lines excluded so a documented example like `# VAR=force` is not a false positive)
- **removes:** none
- **baseline:** `.env.example` currently documents 8 HubSpot/GA vars, none admin (`02-survey.md` S1)
- **rollback:** `git checkout .env.example`
- **state-after:** working
- **notes:** Names only, each with a one-line comment. `GITHUB_*` are documented here but **not consumed** until P3 — say so in the comment so nobody wires them early. `GITHUB_REPO` is `israelrichner/lanshore-website` (verified from `git remote`), **not** the `lanshore/lanshore-web` the source plan `:601` assumes.

### T2 — `src/lib/studio/session.mjs` + tests (T1–T10)
- **intent:** Cookie sign/verify, allowlist matching, and the fail-closed config guard — the highest-value security logic in P2
- **files:** `src/lib/studio/session.mjs`, `src/lib/studio/session.test.mjs`
- **cwd:** none
- **depends:** T1
- **verify:** `node --test src/lib/studio/session.test.mjs` exits 0, covering source-plan T1–T10: tampered payload, wrong-secret signature, expired `exp`, stripped/empty/null signature, allowlist unset ⇒ reject all, allowlist `""` ⇒ reject all, case/whitespace normalisation, near-miss rejection (`editor@lanshore.com.attacker.com`, `editor@lanshore.co`, `xeditor@lanshore.com`), `email_verified:false` rejected, `ADMIN_ALLOWED_DOMAIN` ANDed not ORed
- **removes:** none
- **baseline:** none — new module
- **rollback:** `git rm -f src/lib/studio/session.mjs src/lib/studio/session.test.mjs`
- **state-after:** working (nothing imports it yet)
- **notes:** Plain `.mjs`, **no `@/*` import** — Node's resolver never reads `tsconfig.json` (`02-survey.md` S5). Verify with `crypto.subtle.verify`, never `===` on signatures. **T6 (empty-string allowlist) is the single most likely bug to ship** — write it first. **This task also carries the logic half of source-plan T13** (no cookie / forged cookie / email removed from allowlist): all three are assertions about functions that live here. What it cannot prove is that `requireAdmin()` actually calls them — that residual is T12's (`04-review.md` M3).

### T3 — `src/lib/studio/google.mjs` + tests (T11, T11a, T12)
- **intent:** Auth-URL builder, code exchange, JWKS fetch with `kid` cache, and full `id_token` verification
- **files:** `src/lib/studio/google.mjs`, `src/lib/studio/google.test.mjs`
- **cwd:** none
- **depends:** T1
- **verify:** `node --test src/lib/studio/google.test.mjs` exits 0, covering T11 (wrong `aud`, wrong `iss`, past `exp`, mismatched `nonce` each rejected — table-driven against a **locally generated RSA key**, no network), T11a (unknown `kid` refetches JWKS once, retries, rejects if still unknown), T12 (`alg: none` and any symmetric `alg` rejected)
- **removes:** none
- **baseline:** none — new module
- **rollback:** `git rm -f src/lib/studio/google.mjs src/lib/studio/google.test.mjs`
- **state-after:** working
- **notes:** Build `redirect_uri` from the `SITE_URL` constant (`src/lib/site.ts:1`), **never from a request header**. Take the algorithm from our own expectation (RS256), never from the token header — reject before selecting a key. JWKS rotation per `03-design.md` M2. Tests must not hit the network; `01-intent.md` A2 records that this proves our verifier rejects bad tokens, not that it accepts Google's real ones.

### T4 — Typed `.ts` wrappers and `requireAdmin()`
- **intent:** Give TypeScript a typed surface over the `.mjs` core and add the real boundary function
- **files:** `src/lib/studio/session.ts`, `src/lib/studio/google.ts`
- **cwd:** none
- **depends:** T2, T3
- **verify:** `npx tsc --noEmit` exits 0 AND `npm run lint` exits 0 AND `node -e "const s=require('fs').readFileSync('src/lib/studio/session.ts','utf8'); if(!s.includes('notFound')) process.exit(1)"` exits 0
- **removes:** none
- **baseline:** none
- **rollback:** `git rm -f src/lib/studio/session.ts src/lib/studio/google.ts`
- **state-after:** working
- **notes:** Thin re-exports — **no second implementation** of any rule from T2/T3. `requireAdmin()` lives here because it needs `next/headers`. Per `03-design.md` M1 it fails **only** via `notFound()` in a page context and a bare bodyless 404 in a route handler — never a throw, redirect, or 401, so an unauthorised outcome is byte-identical to a missing page. It re-checks the allowlist on **every call**, which is what makes env-var removal revoke a live session.

### T5 — The three `/api/studio/auth/*` route handlers
- **intent:** Start, complete and end the OAuth flow
- **files:** `src/app/api/studio/auth/login/route.ts`, `src/app/api/studio/auth/callback/route.ts`, `src/app/api/studio/auth/logout/route.ts`
- **cwd:** none
- **depends:** T4
- **verify:** `npm run build` exits 0 AND `npx tsc --noEmit` exits 0 AND `node -e "const s=require('fs').readFileSync('src/app/api/studio/auth/logout/route.ts','utf8'); if(s.includes('export async function GET')) process.exit(1)"` exits 0 (logout is POST-only per `03-design.md` m1)
- **removes:** none
- **baseline:** none — new routes
- **rollback:** `git rm -rf src/app/api/studio`
- **state-after:** working
- **notes:** `state`/`nonce` cookie: `SameSite=Lax` (`Strict` breaks the callback), `Max-Age=600`, cleared on the callback path whether it succeeds **or** fails (`03-design.md` m2). Session cookie: `httpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, `Max-Age` 8h. Fail closed — if any of the four config vars is missing, login refuses to start a flow.

### T6 — `/studio` pages: layout, placeholder dashboard, signed-out
- **intent:** The gated surface and the one unauthenticated entry point
- **files:** `src/app/studio/layout.tsx`, `src/app/studio/page.tsx`, `src/app/studio/signed-out/page.tsx`
- **cwd:** none
- **depends:** T4
- **verify:** `npm run build` exits 0 AND `npm run lint` exits 0 AND `node -e "const s=require('fs').readFileSync('src/app/studio/layout.tsx','utf8'); if(!s.includes('requireAdmin')||!s.includes('index: false')) process.exit(1)"` exits 0
- **removes:** none
- **baseline:** none — new routes
- **rollback:** `git rm -rf src/app/studio`
- **state-after:** working
- **notes:** Layout calls `await requireAdmin()` and sets `robots: {index:false, follow:false}`. A **placeholder** dashboard is explicitly fine — building anything editorial here is P3 and out of scope. `signed-out/page.tsx` renders the "Sign in with Google" button and requires **no** session; it is the URL an editor bookmarks. Per `01-intent.md` A3 these pages still render inside the public `Header`/`Footer` — accepted, and T8 removes the part that actually matters.

### T7 — `src/proxy.ts`: async, `/studio` gate, exempt paths, `X-Robots-Tag`
- **intent:** Cheap optimistic 404 in front of the admin without disturbing two existing site-wide behaviours
- **files:** `src/proxy.ts`
- **cwd:** none
- **depends:** T2
- **verify:** `npm run build` exits 0, then with `npx next start` running: `/studio` → **404**; `/studio/anything` → **404**; `/studio/signed-out` → **200**; `/studio/signed-out-and-then-something` → **404**; `/api/studio/auth/login` → not 404; `/wp-login.php` → **410**; `/wp-admin/x` → **410**; a request with `Host: preview.vercel.app` → header `X-Robots-Tag: noindex, nofollow`. AND `node -e "const s=require('fs').readFileSync('src/proxy.ts','utf8'); if(s.includes('config.matcher')||/export const config/.test(s)) process.exit(1)"` exits 0
- **removes:** none
- **baseline:** **REQUIRED.** Current `proxy.ts:20-33` returns 410 for retired WordPress paths; `:35-39` sets `X-Robots-Tag` for non-canonical hosts. Capture both **before** editing.
- **rollback:** `git checkout src/proxy.ts`
- **state-after:** working
- **notes:** `proxy()` becomes **async** — that changes the return type for every request on the site, not just `/studio` (`03-design.md` B2). Both incumbents are in the verify for that reason. **Must not gain a `config.matcher`** — the comment at `:14-16` explains that a matcher would narrow the host check site-wide. **Import the pure verify function from `session.mjs` directly, never from `session.ts`.** The `.ts` wrapper imports `next/headers` for `requireAdmin()`, and pulling that into the proxy runtime is a live bug — this is why the task depends on T2 and not T4 (`04-review.md` M4). Exempt list compared by **exact equality**, never prefix: `/studio/signed-out`, `/api/studio/auth/login`, `/api/studio/auth/callback`, `/api/studio/auth/logout`.

### T8 — Path-gate GA4 and HubSpot off `/studio`
- **intent:** Stop admin sessions being recorded in analytics and marketing automation
- **files:** `src/components/GoogleAnalytics.tsx`, `src/components/HubSpotLoader.tsx`
- **cwd:** none
- **depends:** T6
- **verify:** `npm run build` exits 0, then with `npx next start` running: the HTML of `/` still contains the GA/HubSpot script tags, and the HTML of `/studio/signed-out` does **not**. AND `npm run lint` exits 0
- **removes:** the unconditional firing of both trackers on admin routes
- **baseline:** **REQUIRED.** Both currently load on every canonical-host page via `src/app/layout.tsx:75-78`; each has a `shouldLoadTracker()` host gate (`GoogleAnalytics.tsx:12`, `HubSpotLoader.tsx:13`). Capture which pages emit the script tags before editing.
- **rollback:** `git checkout src/components/GoogleAnalytics.tsx src/components/HubSpotLoader.tsx`
- **state-after:** working
- **notes:** Add the path check **inside the existing `shouldLoadTracker()`**, which already exists for exactly this kind of exclusion — do not restructure the components. Use `/studio` as a path prefix here (unlike the proxy's exact-match exempt list; the goals are opposite — this one should over-exclude). Each addition carries a comment explaining why, and why it is in A1's allowlist (T10).

### T9 — Wire `test:auth` into `prebuild` **without replacing** `check:content`
- **intent:** Make the auth tests a deploy gate
- **files:** `package.json`
- **cwd:** none
- **depends:** T2, T3
- **verify:** `npm run test:auth` exits 0 AND `node -e "const p=require('./package.json'); const pre=p.scripts.prebuild||''; if(!pre.includes('check:content')||!pre.includes('test:auth')) process.exit(1)"` exits 0 AND `npm run build` output shows **both** `check:content` and `test:auth` running
- **removes:** none
- **baseline:** `package.json` currently has `"prebuild": "npm run check:content"` (`02-survey.md` S6)
- **rollback:** `git checkout package.json`
- **state-after:** working
- **notes:** **Add, do not overwrite** — source-plan review m2. Chain as `npm run check:content && npm run test:auth`, content gate first. `test:auth` runs both `.test.mjs` files from T2 and T3.

### T10 — `scripts/check-admin-isolation.mjs` (checks A1–A3)
- **intent:** Mechanically assert the admin stays invisible, so a future nav link fails the build
- **files:** `scripts/check-admin-isolation.mjs`, `package.json`
- **cwd:** none
- **depends:** T6, T7, T8
- **verify:** `npm run check:admin` exits 0 on the clean tree; then adding a `/studio` link to `src/components/Header.tsx` makes it exit **non-zero**; reverting passes again. AND the script asserts its own allowlist has **exactly 5 entries**
- **removes:** none
- **baseline:** none — new check
- **rollback:** `git checkout package.json && git rm -f scripts/check-admin-isolation.mjs`
- **state-after:** working
- **notes:** **A1** — the admin path segment appears nowhere outside exactly these five paths: `src/app/studio/**`, `src/lib/studio/**`, `src/proxy.ts`, `src/components/GoogleAnalytics.tsx`, `src/components/HubSpotLoader.tsx`. Enumerated by full path, never a glob; the count assertion is what stops the list being quietly widened (`03-design.md` B1). **A2** — absent from `sitemap.ts`, `llms.txt`, `llms-full.txt` sources and from the built `sitemap.xml`. **A3** — absent from `robots.txt`; **this assertion is inverted from instinct and MUST carry an inline comment saying listing the path would publish it**, or a maintainer will "fix" it. Chain into `prebuild` after `test:auth`.

### T11 — Committed regression tests for content escaping (T15, T16)
- **intent:** Pin two properties that currently hold only by inspection, now that editor input is on the horizon
- **files:** `src/lib/studio/escaping.test.mjs`
- **cwd:** none
- **depends:** T9
- **verify:** `node --test src/lib/studio/escaping.test.mjs` exits 0 — T15 asserts `toJsonLd` escapes `</script>`, `<`, `>`, `&`, U+2028 and U+2029 so a title containing `</script><img onerror=…>` cannot break out of the JSON-LD sink; T16 asserts the Markdown pipeline renders raw HTML as **text**, not markup
- **removes:** the "verified by inspection only" status of both properties
- **baseline:** `toJsonLd` exists and is correct at `src/lib/schema.ts:343-350`. T16 was already established empirically in P1's test phase (8 hostile inputs, all inert — `dynamic-content-management/test/security.md`).
- **rollback:** `git rm -f src/lib/studio/escaping.test.mjs`
- **state-after:** working
- **notes:** Neither test exists to find a bug — both properties already hold. They exist so that a future "simplification" of `toJsonLd`, or a future `rehype-raw`, **fails the build** instead of silently opening an injection path. Say that in a comment, or someone will delete them as redundant.

### T12 — Live verification: A4, proxy incumbents, and P1 parity
- **intent:** Prove the gate works end to end and that P2 did not disturb the public site
- **files:** none (verification only)
- **cwd:** none
- **depends:** T10, T11
- **verify:** `npm run build` exits 0, then with `npx next start` running: **A4** — `/studio`, `/studio/signed-out` and `/api/studio/auth/login` each carry `X-Robots-Tag: noindex, nofollow`. **Incumbents** — `/wp-login.php` → 410; non-canonical `Host` → `X-Robots-Tag`. **T13 (composition half)** — `/studio` with no cookie → 404; with a forged cookie → 404; with a valid cookie whose email has been removed from `ADMIN_ALLOWED_EMAILS` → 404, proving the per-call re-check revokes a live session. **T14** — `curl` each `/api/studio/*` with no cookie → no write occurs and no useful error body is returned. **P1 parity** — re-capture all 56 public routes and diff against P1's golden set; **zero** new differences beyond the 5 blog pages already justified in `dynamic-content-management/test/results.md` R1
- **removes:** none
- **baseline:** **REQUIRED.** P1's golden capture (56 routes + 4 text routes). Note it is **ephemeral** — it lives in a scratchpad, so if it has been lost, re-capture from `feat/content-migration-p1` **before** starting T7.
- **rollback:** n/a — read-only
- **state-after:** working
- **notes:** A4 is load-bearing, not belt-and-braces: `02-survey.md` S4 confirms the nine per-bot rules at `src/app/robots.ts:22` carry `allow: "/"` with no `disallow`, so they override the generic `disallow: "/api/"` for Googlebot and the AI crawlers. `X-Robots-Tag` is therefore the **only** control keeping `/api/studio/*` out of those indexes.

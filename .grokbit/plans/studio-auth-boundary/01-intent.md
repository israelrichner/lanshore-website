# Intent — studio-auth-boundary (Package 2)

## Problem

P1 moved the site's content into repo files behind a validation gate, but nothing can edit it. P3 will add an editor and a GitHub write path that commits to `main`. Before that write path can exist, there must be a gate in front of it.

P2 builds **only the gate**: an unlinked `/studio` section, entered by Google sign-in, authorised against an email allowlist in env vars. It deliberately ships with nothing behind it. The source plan is emphatic about this ordering (`:825`, `:893`) — "ship P2 alone and let the admin sit there doing nothing for a week" — because it is the only sequencing where a write endpoint never exists without a reviewed gate in front of it.

This is the one part of the whole project where a silent failure means **unauthorised write access to the live site**.

## Done-criteria

A human can verify each of these by hand.

**Access control**

- [ ] An allowlisted Google account can sign in from `/studio/signed-out` and reach `/studio`.
- [ ] A Google account **not** on the allowlist is refused, and lands somewhere that says so rather than a blank 404.
- [ ] Removing an email from `ADMIN_ALLOWED_EMAILS` and redeploying revokes that person's **live** session immediately — not 8 hours later.
- [ ] `ADMIN_ALLOWED_EMAILS` unset **or empty string** ⇒ nobody is authorised. Never "allow all".
- [ ] With `ADMIN_ALLOWED_DOMAIN` set, an allowlisted email outside that domain is still refused (AND, not OR).
- [ ] `email_verified: false` is refused even when the address is on the allowlist.

**The proxy gate**

- [ ] `/studio` and any `/studio/<anything>` returns **404** without a valid session.
- [ ] Exactly four paths stay reachable without a session, compared by **exact equality**: `/studio/signed-out`, `/api/studio/auth/login`, `/api/studio/auth/callback`, `/api/studio/auth/logout`.
- [ ] `/studio/signed-out-and-then-something` still 404s (proves it is not a prefix match).
- [ ] The retired-WordPress 410 still fires (`/wp-login.php`, `/wp-admin/...`).
- [ ] Host canonicalization still fires: a non-canonical host still gets `X-Robots-Tag: noindex, nofollow`.

**Invisibility**

- [ ] `X-Robots-Tag: noindex, nofollow` served on `/studio`, `/studio/signed-out`, and `/api/studio/auth/login`.
- [ ] The admin path appears in **no** public page, `sitemap.xml`, `llms.txt`, or `llms-full.txt`.
- [ ] The admin path is **absent from `robots.txt`** — listing it would publish it.
- [ ] GA4 and HubSpot do **not** fire on `/studio`.

**Fail-closed**

- [ ] With any of `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `ADMIN_SESSION_SECRET`, `ADMIN_ALLOWED_EMAILS` missing, admin routes 404 and login refuses to start a flow.

**Tests**

- [ ] `npm run test:auth` green, covering T1–T16 (source plan §10.4).
- [ ] `prebuild` runs `check:content` **and** `test:auth` — P2 adds to that chain, it does not replace it.
- [ ] `npm run build` green; P1's content gate still passes.

## Non-goals

- **No editor UI.** A placeholder dashboard is explicitly fine. Forms, fields and previews are P3.
- **No GitHub write path.** No commit, no PAT use, no `GITHUB_*` consumption. P2 must not create the thing it is the gate for.
- **No content editing of any kind.**
- **Not a general auth system.** One provider, one role, no self-registration, no password reset, no invitations, no user table, no account linking.
- **The unlinked URL is not a security control.** It is noise reduction. The control is Google OAuth plus the allowlist, and the design assumes the path will eventually be discovered.
- **No change to public rendering.** P1's byte-identical output must stay byte-identical.

## Constraints

- **No new npm packages.** The auth core is plain `.mjs` with relative imports; `.ts` files are typed re-exports. `node --test` is a Node builtin. No `@/*` import may appear in any `.mjs` under `src/lib/studio/` or `scripts/` — Node's resolver never reads `tsconfig.json`.
- **`src/proxy.ts` must not gain a `config.matcher`** (`02-survey.md` S2) — it would silently disable site-wide host canonicalization.
- **`redirect_uri` is built from the `SITE_URL` constant, never from a request header.**
- **The proxy is not the boundary.** Next's own guidance limits it to optimistic checks; `requireAdmin()` in each server component and route handler is the real gate.
- Branch base: `feat/content-migration-p1` (P2 must extend P1's `prebuild` chain — `02-survey.md` S6).

## Assumptions

- **A1 — All 8 env vars are set in Vercel.** Owner-stated 2026-08-27. **UNVERIFIED** — no `vercel` CLI is authenticated here, so this cannot be checked from the repo. The fail-closed design means a typo produces a 404 indistinguishable from "not deployed", so first-deploy smoke testing matters more than usual.
- **A2 — Google's OAuth/JWKS behaviour** is external and unverifiable from this repo (`02-survey.md` S8). Every claim about Google's endpoints comes from the source plan §6.5.2 and stays **UNVERIFIED** until exercised against a real deployment.
- **A3 — Owner decision, 2026-08-27:** admin chrome is handled by path-gating the two trackers rather than a route-group refactor. `/studio` therefore still renders inside the public `Header`/`Footer`. This **partially contradicts source-plan task `:857`** and is a recorded, deliberate deviation.
- **A4 — Is `lanshore.com` a Google Workspace domain?** Unanswered (source plan Open Question H). If it is, the consent screen should be **Internal**, which restricts sign-in at Google's own layer — genuine defence in depth on top of the allowlist. Does not change any task below; affects setup only.
- **A5 — `GITHUB_TOKEN` expiry owner and date** (source plan Open Question I) is a P3 obligation, not P2's, but the token already exists — so the clock is already running.

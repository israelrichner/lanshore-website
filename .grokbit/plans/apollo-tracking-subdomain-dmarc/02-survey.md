# Survey — Apollo tracking subdomain + DMARC

Every claim below was confirmed by opening the cited file in this session **or** by a live DNS query from this host (2026-08-02). DNS facts are not in the repo; they are recorded with the command used.

## Entity resolution

| Entity | Status | Location |
|---|---|---|
| Apollo tracking config in repo | DOES NOT EXIST | searched: `apollo`, `tracking subdomain`, `go.lanshore` (only noise hits) |
| DMARC / SPF as code or IaC | DOES NOT EXIST | searched: `dmarc`, `spf1`, `vercel-dns` |
| HubSpot portal id (related domain claim) | EXISTS | `src/lib/hubspot-config.ts:5` — `HUBSPOT_PORTAL_ID = "6603479"` |
| Note that `email.lanshore.com` is broken for meetings | EXISTS | `.env:10-11` (comment: branded domain fails ERR_CONNECTION_CLOSED; meetings use hubspot.com host) |
| Site canonical host | EXISTS | `src/lib/site.ts:1` — `SITE_URL = "https://lanshore.com"` |
| Host canonicalization middleware | EXISTS | `src/proxy.ts:9` — `CANONICAL_HOSTS` = `lanshore.com`, `www.lanshore.com` |
| HubSpot expansion plan (sales tools out of site scope) | EXISTS | `docs/plans/hubspot-expansion.md:39` — “Sales tools (email tracking…) — CRM-side, no website work” |
| Vercel NS for `lanshore.com` | EXISTS (live DNS) | `Resolve-DnsName lanshore.com -Type NS` → `ns1.vercel-dns.com`, `ns2.vercel-dns.com` |
| SPF on apex | EXISTS (live DNS) | TXT `v=spf1 include:_spf.google.com ~all` |
| Google DKIM | EXISTS (live DNS) | `google._domainkey.lanshore.com` TXT starts `v=DKIM1; k=rsa; p=…` |
| DMARC (`_dmarc.lanshore.com` TXT) | DOES NOT EXIST (live DNS) | `Resolve-DnsName '_dmarc.lanshore.com' -Type TXT` returned apex SOA only (no TXT policy) |
| `email.lanshore.com` CNAME | EXISTS (live DNS) | CNAME → `6603479.group0.sites.hscoscdn-na2.net` (matches HubSpot portal 6603479) |
| Apollo CNAME on `go.lanshore.com` | DOES NOT EXIST (live DNS) | CNAME query returned SOA; **A** answers present (`64.29.17.65`, `216.198.79.65`) — Vercel edge-like, not an Apollo target |
| `track.lanshore.com` free of Apollo | A present, no Apollo CNAME (live DNS) | A → `64.29.17.1`, `216.198.79.65` |
| MX (Google Workspace) | EXISTS (live DNS) | MX → `aspmx.l.google.com` preference 10 |
| CAA records | UNVERIFIED this session | PowerShell `Resolve-DnsName` has no `CAA` enum; brief claims `sectigo.com`, `letsencrypt.org`, `pki.goog` |

## Reusable code

Nothing in this repo implements Apollo tracking or DMARC. Closest related material:

- HubSpot portal identity: `src/lib/hubspot-config.ts:5` — confirms portal `6603479` aligns with live `email.` CNAME target prefix.
- Operator docs for HubSpot (not Apollo): `docs/plans/hubspot-expansion.md` — explicitly keeps CRM-side email tracking out of website work (`docs/plans/hubspot-expansion.md:39`).

There is **no** in-repo DNS-as-code, Terraform, or Vercel DNS config file to reuse.

## Supersession

What this change replaces, duplicates, or makes dead.

| Item | Location | Callers | Why superseded |
|---|---|---|---|
| Missing DMARC (no policy) | live DNS `_dmarc.lanshore.com` | N/A (absence) | Adding monitor-only TXT fills the gap; nothing to delete |
| Pre-existing A answers on `go.lanshore.com` (if explicit Vercel records) | Vercel DNS console (not in repo) | unknown — dashboard only | CNAME for Apollo cannot coexist with conflicting A/AAAA on the same name; may need delete-then-add |
| Apollo open/click tracking off on sequences | Apollo UI only | 3 sequences (brief) | Enabling toggles supersedes “subdomain exists but tracking still off” state |
| Application code paths for email tracking | DOES NOT EXIST | 0 | Nothing in repo to supersede |

## Prior attempts

- No prior Apollo subdomain plan under `docs/plans/` or `.grokbit/plans/` (directory created this session; no handoff at `.grokbit/handoff.md`).
- HubSpot branded domain `email.lanshore.com` is a **different product surface** (landing pages / meetings branding). Live CNAME is healthy to HubSpot CDN; meetings deliberately avoid it per `.env:10-11`.

## Conventions

- **Site host:** canonical `lanshore.com` / `www` only — `src/proxy.ts:9`. Tracking subdomains are **not** site hosts and must not be added to app middleware.
- **Marketing email stack split:** HubSpot for website forms/landing (`hubspot-config.ts`, expansion plan); Google Workspace for mailbox (SPF + DKIM + MX live); Apollo for outbound sequences (external, not in repo).
- **Tests:** `package.json:5-9` — `dev` / `build` / `start` / `lint` only; **no unit test script**. Ops verification is DNS CLI + product UI, not `npm test`.
- **Shell/OS for verify:** Windows PowerShell (`Resolve-DnsName`), per this session’s successful queries.

## Absences

- No DNS-as-code / IaC for Vercel records in repo.
- No Apollo API integration or env vars.
- No automated post-change DNS check in CI.
- No DMARC report ingestion pipeline (email-only `rua` is the entire design).
- No project test suite for mail auth (`AGENTS.md` project test commands: unit/coverage/regression NONE).

## Danger zones

- **`email.lanshore.com`** — live HubSpot CDN CNAME; overwriting breaks HubSpot landing pages. Cite live DNS + portal id `6603479` (`src/lib/hubspot-config.ts:5`).
- **Apex SPF / Google DKIM / MX** — required for Google Workspace; plan must not edit them.
- **Vercel A answers on bare subdomains** — `go` / `track` / even `_dmarc` (via `nslookup`) can show Vercel A IPs without a real product CNAME; **do not treat A resolution alone as “already configured for Apollo.”** Verification requires matching Apollo’s CNAME target.
- **`.env` secrets** — file contains live HubSpot token; survey opened lines 1–14 for comments only; never commit or paste tokens into plan tasks.

## Grounding loop status

Loop 2 pass 1 complete. All intent entities resolved as EXISTS / DOES NOT EXIST / live DNS. CAA left `UNVERIFIED` (tooling limit), recorded for assumptions.

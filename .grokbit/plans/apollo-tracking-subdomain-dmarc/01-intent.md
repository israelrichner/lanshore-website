# Intent — Apollo tracking subdomain + DMARC

**scope:** operational (external DNS + Apollo settings; not application code)

## Problem

Lanshore is ramping cold outbound in Apollo after a high hard-bounce episode. Open/click tracking is incomplete without a dedicated tracking subdomain, and bulk receivers treat a missing DMARC policy as a negative reputation signal. DNS is hosted on Vercel, so Apollo’s automatic DNS provisioning will not work; records must be added manually. Separately, `email.lanshore.com` is already reserved for HubSpot landing pages and must not be reused for Apollo.

## Done criteria

Each item must be checkable by a human performing an observable action.

- [ ] Apollo shows tracking subdomain `go` (or agreed alternate) as **verified** for the Lanshore workspace, using a **manual** CNAME method (not automatic DNS).
- [ ] Public DNS for the chosen hostname returns a **CNAME** whose target matches the value Apollo displayed when the subdomain was created (not an A-only/Vercel parking answer).
- [ ] The verified subdomain is assigned as **default for all mailboxes** in Apollo (workspace currently has one mailbox per brief).
- [ ] Open tracking and click tracking are **enabled** on all three active outbound sequences (names recorded at implement time if not already listed).
- [ ] Public DNS for `_dmarc.lanshore.com` returns a **TXT** record: `v=DMARC1; p=none; rua=mailto:dougerb@lanshore.com` (or an owner-approved rua address).
- [ ] Existing HubSpot branded host `email.lanshore.com` still resolves as a CNAME to HubSpot’s CDN (no accidental overwrite).
- [ ] Existing Google mail auth still present: SPF TXT on apex includes `_spf.google.com`; Google DKIM selector `google._domainkey` still publishes a `v=DKIM1` key.

## Non-goals

- No application code changes in `lanshore-web` (Next.js site, HubSpot forms, redirects).
- No change to SPF or DKIM records (already healthy).
- No tightening of DMARC beyond `p=none` (no `quarantine` / `reject` in this change).
- No Apollo sequence content rewrites, list hygiene, bounce remediation, or mailbox warmup policy.
- No migration of DNS away from Vercel nameservers.
- No reuse or repurposing of `email.lanshore.com` (HubSpot).
- No CAA record edits (brief asserts Let’s Encrypt is already allowed; only verify if verification fails).
- No commit of secrets or Apollo API tokens into the repo.

## Constraints

- Stack / version limits: DNS edits only in **Vercel → Domains → lanshore.com → DNS Records**; Apollo subdomain create/verify only in Apollo UI.
- Must not break: HubSpot on `email.lanshore.com`, Google Workspace delivery (MX/SPF/DKIM), apex/www site on Vercel.
- Sequencing: create Apollo subdomain **first** (to obtain the unique CNAME target) → add Vercel CNAME → wait for propagation → verify in Apollo → enable sequence tracking → add DMARC (can be parallel with CNAME once in the same DNS console).
- Propagation: Apollo documents 2–24h; Vercel often minutes — re-check after ~15 minutes before escalating.

## Assumptions

- `UNVERIFIED` Subdomain name **`go`** is preferred over `track` (brief recommendation); both currently resolve to synthetic/Vercel A answers in public DNS and may need an existing record cleared in Vercel before CNAME can be added.
- `UNVERIFIED` DMARC aggregate reports should go to **`dougerb@lanshore.com`** as in the brief.
- `UNVERIFIED` Workspace has a single Apollo mailbox; “set as default for all mailboxes” is correct.
- `UNVERIFIED` Exactly three sequences need tracking toggled (per audit item #1); sequence names are known to the operator.
- `UNVERIFIED` Operator has admin access to Vercel team DNS for `lanshore.com` and Apollo team email settings.
- `UNVERIFIED` CAA already permits Let’s Encrypt (brief); live CAA query was not available from this host’s DNS client enum — only matters if Apollo TLS verification fails.

## Questions asked

None — answers that would change the plan are already specified in the brief (`go`, manual method, DMARC `p=none` + rua). Residual items listed as assumptions for the human gate.

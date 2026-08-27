# Plan — Apollo tracking subdomain + DMARC

Slug: `apollo-tracking-subdomain-dmarc` · Approach: Manual Vercel CNAME for Apollo `go` + DMARC `p=none` · Blast radius: **0 repo files**, 2 DNS records (CNAME + TXT), Apollo UI only · schema: no

> Keep the task block format exactly as below. The Grokbit extension and the
> Implement phase parse it.

**Nature of work:** operational runbook (Vercel dashboard + Apollo dashboard).  
**Implement tool:** human or agent with access to those consoles — not `grokbit-implement` code edits unless a later task records the runbook under `docs/` (out of scope here).

## Tasks

### T0 — Create Apollo tracking subdomain `go` (manual) and capture CNAME target
- **intent:** Obtain the account-unique CNAME target Apollo requires before any DNS edit
- **files:** none (Apollo UI only)
- **cwd:** none
- **depends:** none
- **verify:** In Apollo → Settings → Team email & sequences → Tracking Subdomains, subdomain `go` exists in pending/unverified state AND the operator has copied the full CNAME target hostname into the session notes (non-empty string, not a placeholder)
- **removes:** none
- **baseline:** none (no public Apollo CNAME on `go` today — survey)
- **rollback:** Delete the unfinished subdomain in Apollo if abandoning
- **state-after:** working (no DNS change yet)
- **notes:** Path per brief: Create Subdomain → enter `go` → **manual** method. Automatic DNS will not work with Vercel NS. Do **not** use `email` (HubSpot). Fallback name `track` only if `go` blocked in Vercel (Option B).

### T1 — Inspect and clear conflicting Vercel DNS for `go`
- **intent:** Ensure the name `go` can hold a single CNAME without leftover A/AAAA
- **files:** none (Vercel → Domains → lanshore.com → DNS Records)
- **cwd:** none
- **depends:** T0
- **verify:** In Vercel DNS UI, no A/AAAA/CNAME remains for name `go` that is not the intended Apollo CNAME (either empty or only the record about to be added). Optional local check before add: `powershell -NoProfile -Command "Resolve-DnsName go.lanshore.com -Type CNAME -ErrorAction SilentlyContinue"` does not show a non-Apollo product CNAME
- **removes:** any conflicting Vercel records for hostname `go` (dashboard-only; not in git)
- **baseline:** current public answers for `go.lanshore.com` (A to Vercel-like IPs observed 2026-08-02)
- **rollback:** Re-create deleted Vercel records from Vercel audit/history if they were intentional site hosts (unlikely for `go`)
- **state-after:** working
- **notes:** Survey warned Vercel-like A answers may appear even when no useful CNAME exists — trust the **Vercel record list**, not only public A lookups.

### T2 — Add Apollo CNAME in Vercel
- **intent:** Point `go.lanshore.com` at Apollo’s tracking endpoint
- **files:** none (Vercel DNS)
- **cwd:** none
- **depends:** T1
- **verify:**
  ```powershell
  powershell -NoProfile -Command "Resolve-DnsName go.lanshore.com -Type CNAME | Format-List Name,Type,NameHost"
  ```
  `NameHost` must equal the Apollo target from T0 (case-insensitive FQDN match). Retry after 15 minutes if needed.
- **removes:** none
- **baseline:** `go` had no Apollo CNAME (survey)
- **rollback:** Delete the CNAME record `go` in Vercel DNS
- **state-after:** working
- **notes:** Type CNAME, Name `go`, Value = Apollo target, TTL default. Do not touch `email`.

### T3 — Assign mailbox default and verify subdomain in Apollo
- **intent:** Apollo accepts DNS and binds tracking subdomain to the mailbox
- **files:** none (Apollo UI)
- **cwd:** none
- **depends:** T2
- **verify:** Apollo UI shows subdomain `go` as **verified** / active AND assigned as default for all mailboxes (single mailbox workspace)
- **removes:** none
- **baseline:** none
- **rollback:** Unassign / delete subdomain in Apollo; leave or remove Vercel CNAME per T2 rollback
- **state-after:** working
- **notes:** Apollo may say 2–24h; try first verify ~15m after T2 green. If TLS/CAA failure, investigate CAA (intake UNVERIFIED) before changing hostname.

### T4 — Add DMARC monitor-only TXT at Vercel
- **intent:** Publish DMARC `p=none` so bulk receivers see a policy and rua reports flow
- **files:** none (Vercel DNS)
- **cwd:** none
- **depends:** none (can run parallel with T0–T3 once in Vercel console; listed after DNS work for operator flow)
- **verify:**
  ```powershell
  powershell -NoProfile -Command "Resolve-DnsName '_dmarc.lanshore.com' -Type TXT | Format-List Name,Type,Strings"
  ```
  Strings must include `v=DMARC1` and `p=none` and `rua=mailto:dougerb@lanshore.com` (or gate-approved alternate)
- **removes:** none (fills prior absence)
- **baseline:** `_dmarc.lanshore.com` had no TXT policy (survey)
- **rollback:** Delete TXT record `_dmarc` in Vercel
- **state-after:** working
- **notes:** Type TXT, Name `_dmarc`, Value exactly: `v=DMARC1; p=none; rua=mailto:dougerb@lanshore.com`. Do not set `p=quarantine` in this plan.

### T5 — Enable open/click tracking on all three sequences
- **intent:** Complete audit item #1 — subdomain alone does not turn tracking on
- **files:** none (Apollo sequences UI)
- **cwd:** none
- **depends:** T3
- **verify:** For each of the three sequences, open + click tracking controls are ON (UI toggles or equivalent). Record sequence names in the completion note.
- **removes:** none
- **baseline:** tracking off or incomplete on those sequences (brief)
- **rollback:** Turn the same toggles OFF
- **state-after:** working
- **notes:** Second half of audit item #1 per brief.

### T6 — Safety re-check: HubSpot email host + Google mail auth unchanged
- **intent:** Prove non-goals held — no collateral DNS damage
- **files:** none
- **cwd:** none
- **depends:** T2, T4
- **verify:**
  ```powershell
  powershell -NoProfile -Command @"
  Resolve-DnsName email.lanshore.com -Type CNAME | Format-List Name,NameHost
  Resolve-DnsName lanshore.com -Type TXT | Format-List Strings
  Resolve-DnsName 'google._domainkey.lanshore.com' -Type TXT | Format-List Strings
  Resolve-DnsName lanshore.com -Type MX | Format-List NameExchange,Preference
  "@
  ```
  Expect: `email` NameHost contains `hscoscdn` / `6603479`; apex TXT still includes `include:_spf.google.com`; DKIM still `v=DKIM1`; MX still Google.
- **removes:** none
- **baseline:** survey live DNS snapshots for email/SPF/DKIM/MX
- **rollback:** restore any changed records from T2/T4 rollbacks + HubSpot CNAME target `6603479.group0.sites.hscoscdn-na2.net`
- **state-after:** working
- **notes:** Mandatory before calling the plan done.

## Verification matrix

| Done criterion | Proven by |
|---|---|
| Apollo subdomain `go` verified (manual) | T0 + T3 verify |
| Public DNS CNAME matches Apollo target | T2 verify |
| Default for all mailboxes | T3 verify |
| Open/click on all three sequences | T5 verify |
| DMARC TXT `p=none` + rua | T4 verify |
| `email.lanshore.com` HubSpot CNAME intact | T6 verify |
| SPF + Google DKIM intact | T6 verify |

## Disposition summary

Carried from `03-design.md`.

| Disposition | Count | Handled by |
|---|---|---|
| REPLACE | 3 | T1 (conflicting `go` records if any); T4 (DMARC absence→policy); T5 (tracking-off state) |
| DEPRECATE | 0 | — |
| COEXIST | 0 | — |
| LEAVE | 3 | T6 proves leave: HubSpot `email.`, SPF/DKIM/MX, application code |

Net lines in git: **+0 / -0** (ops only). Net-additive DNS: +1 CNAME, +1 TXT; possible −N conflicting `go` records.

## Open assumptions

Full ledger: `assumptions.md`.

- `UNVERIFIED` rua mailbox `dougerb@lanshore.com`
- `UNVERIFIED` CAA allows Let’s Encrypt (only matters if Apollo TLS verify fails)
- `UNVERIFIED` operator has Vercel + Apollo admin
- `UNVERIFIED` exactly three sequences (names at T5)

## Approval
- [ ] Human approved — <date>

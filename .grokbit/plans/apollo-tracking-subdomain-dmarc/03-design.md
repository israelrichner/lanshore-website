# Design — Apollo tracking subdomain + DMARC

## Options considered

### Option A — Manual Vercel DNS: `go` CNAME + monitor-only DMARC (brief’s path)
Approach: In Apollo, create tracking subdomain `go` with **manual** method; copy unique CNAME target; in Vercel DNS for `lanshore.com`, remove any conflicting A/AAAA/CNAME on `go`, add CNAME `go` → Apollo target; verify in Apollo; set default for all mailboxes; enable open/click tracking on the three sequences. In the same Vercel console, add TXT `_dmarc` = `v=DMARC1; p=none; rua=mailto:dougerb@lanshore.com`. Leave `email.` HubSpot CNAME, SPF, DKIM, MX untouched.
Trade-off (against the intent's constraints): Zero code risk; depends on human dashboard access and propagation wait; `p=none` improves signal to receivers without changing delivery policy yet.

### Option B — Use `track` instead of `go`, same manual path
Approach: Identical to A but hostname `track.lanshore.com`. Brief says both are free of HubSpot; live DNS shows both have Vercel-like A answers today, so neither is “cleaner” from public DNS alone.
Trade-off: Same operational cost. Slightly better only if Vercel already has a sticky config on `go` that cannot be removed; worse if team docs/muscle memory already say `go`.

### Option C — Apollo “automatic” DNS
Approach: Let Apollo provision DNS via a supported registrar integration.
Trade-off: **Fails constraints** — nameservers are Vercel (`ns1.vercel-dns.com` / `ns2.vercel-dns.com` per survey live DNS), not a registrar Apollo typically drives. Would waste time and risk partial failure. Rejected.

### Option D — IaC / commit DNS into repo
Approach: Add Terraform/Vercel API scripts to manage records from `lanshore-web`.
Trade-off: Violates non-goal (no app/repo change required); no existing DNS-as-code (survey absences); larger blast radius for a two-record ops fix.

## Decision
**Chosen: A** (manual `go` + DMARC `p=none`)

Rationale against constraints:
- Matches DNS hosting reality (Vercel NS).
- Avoids colliding with HubSpot on `email.` (survey: CNAME to `6603479.group0.sites.hscoscdn-na2.net`).
- CAA/Let’s Encrypt risk called out in brief; we do not need CAA edits unless verify fails.
- DMARC monitor-only satisfies “negative signal” fix without delivery policy change.
- No source changes — aligns with non-goals and HubSpot expansion doc positioning CRM email tracking outside the website (`docs/plans/hubspot-expansion.md:39`).

What the rejected options were better at:
- **B (`track`)** — useful fallback if `go` cannot be freed in Vercel; keep as rollback hostname choice.
- **C (automatic)** — less typing if DNS were at a supported registrar (it is not).
- **D (IaC)** — better long-term audit trail if DNS changes become frequent (they are not, yet).

## Shape of the change

```
Apollo UI                         Vercel DNS (lanshore.com)
─────────                         ─────────────────────────
Create subdomain "go"  ──copy──▶  Delete conflicting go A/AAAA if any
  (manual method)                 Add CNAME go → <apollo-unique-target>
Assign default mailbox            Add TXT _dmarc → v=DMARC1; p=none; rua=...
Verify (poll DNS)        ◀──────  propagation
Enable open/click on 3 sequences
```

No changes under `src/`, `package.json`, or HubSpot env. Tracking hosts must **not** be added to `src/proxy.ts` canonical hosts (`src/proxy.ts:9`) — they are not site origins.

Apollo CNAME target is **account-specific** and unknown until create step; plan tasks capture it as a runtime value, never hard-coded.

## Disposition of superseded code

| Item | Disposition | Reason | Obligation |
|---|---|---|---|
| Missing DMARC (absence) | REPLACE | absence replaced by monitor-only TXT | publish TXT; verify with `Resolve-DnsName` |
| Conflicting Vercel A (or other) on `go` if present in dashboard | REPLACE | CNAME owner of name must be unique | delete conflicting record(s) in Vercel before/when adding CNAME; confirm Apollo target only |
| Sequence tracking toggles currently off | REPLACE | subdomain alone does not enable tracking | flip open+click on all three sequences; screenshot or checklist |
| HubSpot `email.lanshore.com` | LEAVE | different product; must not break | verify still HubSpot CNAME after edits |
| SPF / Google DKIM / MX | LEAVE | healthy; out of scope | re-check still present after edits |
| Application code / HubSpot site integration | LEAVE | non-goal | no PR required |

## Unhappy paths

| Scenario | Behavior |
|---|---|
| Apollo verify fails after 1h | Re-check CNAME target typo; confirm no A/AAAA left on `go`; flush local resolver cache; wait up to 24h per Apollo; if TLS/CAA error, inspect CAA (tooling gap) and add Let’s Encrypt if truly missing |
| Vercel rejects CNAME because A exists | Delete A/AAAA for `go` in Vercel UI, re-add CNAME |
| `go` name already used by another product | Fall back to Option B (`track`) with same procedure; update Apollo subdomain create |
| Wrong CNAME target pasted | Delete bad CNAME; re-copy from Apollo; re-add; re-verify |
| DMARC TXT typos / split incorrectly | Single TXT string; no extra quotes in Vercel value field beyond product UI requirements; re-query until exact policy visible |
| HubSpot `email.` accidentally edited | Immediately restore CNAME to `6603479.group0.sites.hscoscdn-na2.net` |
| Sequence tracking left off | Done-criterion fails until toggles on — independent of DNS green |
| Propagation delay | Retry verify at 15m, 1h; do not thrash records |

## Migration

Schema change: no  
Reversible: yes — delete Apollo CNAME + DMARC TXT; disable sequence tracking toggles  
Existing rows: N/A  
Mixed-version window: DNS TTL (apex TXT SPF was 60s; new records often 60–300s on Vercel) — brief dual-stack window only if old A and new CNAME race (avoid by deleting A first)

## New dependencies

None (no npm packages, no repo modules).

# Assumptions — Apollo tracking subdomain + DMARC

The one rolled-up ledger of every open item from this plan. Read at the
approval gate, and again before any implement step that depends on one of these.

## From intake
Copied from `01-intent.md`'s `## Assumptions` — decided rather than asked.

- `UNVERIFIED` Prefer subdomain **`go`** over `track` (brief); both currently show Vercel-like A answers publicly.
- `UNVERIFIED` DMARC `rua=mailto:dougerb@lanshore.com` is the correct report address.
- `UNVERIFIED` Single Apollo mailbox → “default for all mailboxes” is correct.
- `UNVERIFIED` Exactly three sequences need open/click tracking; names known to operator.
- `UNVERIFIED` Operator has admin on Vercel team DNS for `lanshore.com` and Apollo team email settings.
- `UNVERIFIED` CAA already allows Let’s Encrypt / brief’s issuers — not re-proven this session (PowerShell DNS client has no CAA type).

## From grounding (Loop 2)
Entities the Systems Analyst could not resolve within 3 passes.

- `UNRESOLVED — Loop 2` CAA RRset for `lanshore.com` — searched: `Resolve-DnsName -Type CAA` unsupported on this host; not fatal unless Apollo SSL verification fails.

## From adversarial review (Loop 3)
Findings that survived 3 rounds between the Reviewer and the Architect.

- (none)

## From verifiability (Loop 4)
Anything that reached the plan without clearing the checklist or the plan-level
Reviewer pass.

- (none) — T0–T6 have runnable verifies (UI observation + PowerShell DNS).

## Resolution
- Approve this plan as an **ops runbook** (not a code implement).
- Confirm or override `go` vs `track` and DMARC rua at the gate if desired.
- If Apollo verify fails on TLS/CAA, resolve CAA with an external lookup (`dig CAA lanshore.com` or online checker) before inventing new subdomains.

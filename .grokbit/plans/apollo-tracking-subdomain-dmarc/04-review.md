# Review log — Apollo tracking subdomain + DMARC

Append-only. Never overwrite a previous round.

## Round 1
Reviewed: `01-intent.md`, `02-survey.md`, `03-design.md`

- `[MAJOR]` Live DNS shows A records for `go.lanshore.com` (and `track`) even without an Apollo CNAME — design mentions conflict but could understate that “free” in the brief is not the same as “no public answer.” Operators might skip the delete-A step. — evidence: survey live DNS entity table — resolves by: make clearing/confirming Vercel records for `go` an explicit first DNS task with a verify that CNAME (not A-only) is what public DNS returns after change.
- `[MAJOR]` Intent requires three sequences tracking-on, but design shape diagram under-emphasizes that DNS verify ≠ tracking enabled. — evidence: `01-intent.md` done criteria vs `03-design.md` flow — resolves by: dedicated task after Apollo verify, not a footnote.
- `[MINOR]` CAA left UNVERIFIED — acceptable given non-goal, but TLS failure path should stay in unhappy paths (already present).
- `[MINOR]` No in-repo code citations for Apollo (correct); ensure plan does not invent `src/` file touches.

### Architect response — Round 1
- `[MAJOR]` A-vs-CNAME → **REVISED**: Decomposition will split “inspect/clear `go` records” and “add Apollo CNAME” with verify proving **CNAME NameHost equals Apollo target**, not mere A resolution.
- `[MAJOR]` Sequence toggles → **REVISED**: Dedicated task T5 after verify.
- `[MINOR]` CAA → **ACCEPTED**: remains in assumptions; unhappy path already covers.
- `[MINOR]` No src touches → **ACCEPTED**: plan `files:` will be `none` / external consoles only.

## Round 2
Reviewed revised design intent for decomposition readiness (same three artifacts after Round 1 responses).

- No remaining BLOCKER or MAJOR. Design Option A still correct; disposition table complete for survey supersession items.

## Outcome
Rounds used: 2 of 3  
Outstanding at exit: none (CAA stays `UNVERIFIED` intake assumption, not a design blocker)

## Plan review (Loop 4)
Reviewed: `plan.md` (after Decompose)

- Checklist: each task has runnable Windows PowerShell or Apollo/Vercel UI observation verify; `baseline`/`removes`/`rollback` present; Verification matrix maps all done-criteria; Disposition summary matches design.
- `[MINOR]` T0 is documentation-only capture of Apollo CNAME target — verify is “value stored in notes,” not DNS; acceptable for ops secrets that are not secret but are account-specific.
- No BLOCKER.

### Architect response
- `[MINOR]` → **ACCEPTED** — T0 is a gate for human paste of Apollo target into subsequent task notes.

Outcome: clean

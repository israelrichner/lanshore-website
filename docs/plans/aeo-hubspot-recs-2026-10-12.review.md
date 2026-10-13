# Cold review: aeo-hubspot-recs-2026-10-12 (pass 5, Doug's rec 2 replacement, before the WP2 commit)

**Reviewer:** Claude Code (a fresh-context agent, read-only; the Lead saved its output)
**Date:** 2026-10-13
**Scope:** Doug's rec 2 replacement, comprising the post, 5 SVGs, 1 PNG and the owner rows in section (r2), plus the Lead's corrections, the plan section 7 owner-change entry and the section 10 Status rows. The rec 4 post, case study, `/spm/compare` and modernizing guide were spot-checked and are unchanged since pass 4.
**Verdict:** APPROVE WITH CONDITIONS. All conditions were resolved by the Lead as shown below, so the WP2 branch commit is unblocked once the user re-runs `/pre-pr`. The publish step is still owner-gated.

## Findings and Lead disposition (2026-10-13)

Each factual finding was re-checked against site source or the raw HTML of the firm's page before any change was made.

| # | Sev | Finding | Disposition |
|---|---|---|---|
| 1 | should-fix | The post said Lanshore makes "no 24/7 claim", but the homepage (`IntroAgenticSPM.tsx:16`) says agents run 24/7 | Confirmed. Table and "Ask about" now read "no support SLA or coverage hours published". Logged on d-r2-11 and in (f) |
| 2 | should-fix | Lanshore engagement order was reversed | Confirmed (`spm-consulting.ts:42,46`). The body puts the design review first, then requirements and data mapping; the table cell reads "right after the design review" |
| 3 | should-fix | OpenSymmetry's Performio cell was empty in the platform graphic | Confirmed (raw HTML of `/partners/spm-solutions/` lists all 11). Cell filled; full list noted on d-r2-11 |
| 4 | should-fix | Blue Horizons does publish partners (Varicent, Xactly, CaptivateIQ) | Confirmed (raw HTML, including the Xactly implementation-partner slug). Body, "Strongest on", "Ask about" and graphic updated; the slug word "certified" is not used. Logged on d-r2-3 |
| 5 | should-fix | FAQ 1 had IncentiveOps with no modeling evidence; FAQ 2 had Ackle with no mapping or reconciliation evidence | Confirmed. IncentiveOps removed from FAQ 1. FAQ 2 now states Ackle's published wording (CRM, ERP and HRIS integration, testing against real payout history). Logged on d-r2-8 and d-r2-2 |
| 6 | should-fix | Lanshore claims overstated: "where applicable" missing; the 74 percent and 400-to-100 claims merged; the fee link pointed at the wrong source | Fixed. Qualifier restored. Two sentences, each keeping its own scope, with no "same carrier" implication. Fee linked to `/solutions/spm-managed-services`. The conflicting live figure in `best-ai-agent-consulting-firms-for-revops.md:136` is flagged for Doug on b-r2-5 (out of scope) |
| 7 | gate | Review older than the plan; `/pre-pr` marker stale | This file was saved after the last plan edit. The user must re-run `/pre-pr` before the commit |
| 8 | nit | Large-SI reason contradicted the Deloitte evidence | Reworded as an editorial scope choice |
| 9 | nit | OpenSymmetry "AI in operations" cell | Now "Not published for operations (AI-enabled implementation approach)" |
| 10 | nit/should-fix | `dateModified` stale; depth-column label implied modeling for firms marked "Named" | `dateModified` set to 2026-10-13. Column renamed "Plan design or redesign" in the table and graphic. Lead's own over-claim ("the others describe plan work without a modeling step") reverted to Doug's "more briefly" |

Re-run after the fixes:
- full regression: 9 of 9 steps rc=0;
- postbuild: 94 routes, 53 FAQPage/HowTo nodes;
- ItemList: 10, matching the headings;
- FAQ: 8, matching the visible entries;
- links: 359, 0 unresolved;
- browser verification: 4 routes at 1280px and 375px, PASS; all 5 images load and fit.

## Checks passed (reviewer)

- **Owner file:** superseded rows marked correctly; b11 narrowed; all (r2) rows UNDECIDED; no sign-off line written by an agent.
- **Package diff:** Doug's package matches the logged Lead hunks; the SVGs were byte-identical before the pass 5 graphic fixes.
- **Plan and gate:** the section 7 owner-change entry and the Status rows are accurate; 0 checkbox lines; the gate selects only the plan.
- **Claims and house rules:** 0 banned tokens and 0 em dashes; only PepsiCo is named; alphabetical, unranked, no ratings.
- **Lanshore claims:** trace to site source.
- **Security:** the SVGs are static shapes and text (no script, handlers, `foreignObject`, href or `url()`); Markdown images use react-markdown's default `<img>` without `rehype-raw`; no new XSS path. Not setting image width and height is a minor CLS risk only.

---

## Carried record

- **Pass 4 (2026-10-12, APPROVE):** WP2 diff vs steps 1 to 9 had nothing missing. Conditions: fresh `/pre-pr`, and staging by explicit path. Recommendations R1 to R4 were applied (hedged "Not published" pricing, unsourced phrases, SAP naming, Cap bullet superseded).
- **Pass 3 (2026-10-12, APPROVE):** WP1 diff vs WP1 steps had nothing missing; F1–F3 dispositioned; `/spm` carried to WP2 verify (now covered).
- **Pass 2 (2026-10-12, APPROVE conditional on four amendments, all applied):** (1) every commit needs plan mtime
  within 24 h, review newer than plan, and a non-APPROVE review blocks the commit; (2) only the user-invoked
  `/pre-pr` writes the Check 4 marker; (3) rec 2 retitle is the one deliberate H1 change ("Best SPM Consulting and
  Service Partners Compared"); (4) spreadsheet case study removed from the CaptivateIQ/Performio `related` lists.
- **Non-gating items from pass 2:** partner-network strike must rewrite, not delete, `src/app/spm/page.tsx:97-99`
  and the `/spm/compare` FAQ; Incentivate described two ways; claims-audit exception path; rec 2 cap tie-break (now
  amended); WP1-only revert resolves `SLUGS.lock.json` by union.
- **Residual risk (accepted under OQ7):** rec 4 rule admits all candidates; it did (12 of 12, "Not listed" empty);
  Salesforce Spiff flagged to Doug in e38.
- **Pass 1 (NOT READY):** all findings resolved in revision 2.

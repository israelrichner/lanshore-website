# PR readiness — aeo-hubspot-recs-2026-10-12

**Session:** 97439253-1235-4461-852b-1ebac9b4913e
**Date:** 2026-10-13
**Scope of this run:** the WP2 commit on branch `aeo-hubspot-2026-10-12`, including Doug's rec 2 replacement. This gates a commit, not a PR to `main`. Nothing merges before Doug's sign-off and the §9 publish step. The 2026-10-12 run (WP1, READY) is superseded by this file and remains in git history.

## Verdict: READY (for the WP2 commit)

## Plan audit

| Item | Status | Evidence |
|---|---|---|
| WP2.1 baseline regression, counts re-captured | DONE | Owner file (f) WP2 log; counts table |
| WP2.2 rec 2 firm survey and retrieval | DONE, superseded by owner change | Doug's replacement (plan §7 "Owner change", 2026-10-13); survey in owner file (r2-e); live re-verification in (r2-d) and (f) |
| WP2.3 extend `best-spm-service-partners-compared.md` | DONE (Doug's version, Lead-corrected) | `content/blog/best-spm-service-partners-compared.md`: 10-firm itemList = numbered H2s; 8 FAQs mirrored; `/solutions/spm-consulting` link; `datePublished` unchanged at 2026-08-03; `dateModified` 2026-10-13 |
| WP2.3 graphics (owner change) | DONE | 5 SVGs and 1 PNG under `public/images/spm-*` |
| WP2.4 OQ9 case study | DONE | `managed-services-commission-management.json`: `results[0]` "sharply reduced"; `dateModified` 2026-10-12 |
| WP2.5 rec 4 vendor retrieval | DONE | Owner file (d) d33-d44 and (e2) |
| WP2.6 new `best-enterprise-spm-software-for-complex-incentives.md` + SLUGS.lock | DONE | New file; `SLUGS.lock.json` +1 slug; no `datePublished` (OQ4) |
| WP2.7 cross-links: `/spm/compare`, modernizing guide Phase 2, `UPDATED.spm` | DONE | `src/app/spm/compare/page.tsx` +1 paragraph and link; `modernizing-legacy-spm-systems.md` +1 sentence, `dateModified` 2026-10-12; `UPDATED.spm` already 2026-10-12 from WP1 (equals the WP2 edit date, so no change needed) |
| WP2.8 owner review rows | DONE | Owner file sections (b), (d), (e), (e2), (r2); superseded rows marked |
| WP2.9 verify | DONE | See Verification |
| §9 owner sign-off and publish | PENDING (owner-gated) | 116+ `UNDECIDED` cells; no sign-off line |
| UNPLANNED: `.claude/logs/subagents.log` | modified | Excluded from staging |

Plan audit verdict: READY. Nothing is missing for WP2. The only unplanned file is the log, which will not be staged.

## Cold review

Exists at `docs/plans/aeo-hubspot-recs-2026-10-12.review.md`: pass 5, APPROVE WITH CONDITIONS, all conditions resolved. Saved 2026-10-13 11:50:53, after the current plan version (11:42:25). The plan has not been edited since.

The four content fixes below came from this run's code review and were made after pass 5. They are narrow wording and source changes, verified by the Lead against live pages and a full re-run. They have not been re-reviewed cold.

## Code review findings

From a fresh code-reviewer agent over the WP2 diff (bug 0, gap 1, then suggestions and nits).

- **gap (fixed)**: rec 2 FAQ 1 lists OpenSymmetry under "plan design with modeling", but the post's table and body didn't show modeling.
  - **Checked live:** the OpenSymmetry plan design page (raw HTML, 692 KB) reads "Plan Assessment, Plan Design, Plan Modeling, and Rollout Communications".
  - **Fix:** the page is added to `sources`, and the table cell and body now name modeling.
- **suggestion (fixed, correctness)**: "only a few firms here describe the latter" (a governance model) conflicted with the table. It now reads "mostly publish offices or delivery models rather than a governance model".
- **suggestion (fixed, correctness)**: rec 4 said "Varicent and Xactly both describe a complete audit trail of changes"; only Varicent says "of changes". The sentence now quotes Xactly exactly. The SAP quote "without relying on IT" was confirmed against d42.
- **nit (fixed)**: FAQ 4 called IncentiveOps' monthly fee a "retainer". It now reads "retainer or monthly fee", in both front matter and body.
- **suggestions (non-blocking, open for Doug, logged in the owner file)**:
  - Markdown images have no intrinsic size and are small at 375px. The facts are repeated in the tables, so nothing is lost.
  - The platform-coverage graphic sits under the "Managed services" heading.
  - The `image:` front matter feeds JSON-LD only, not Open Graph. This is intended.
- **nits (non-blocking)**:
  - "A national telecom carrier" appears in two consecutive sentences.
  - CaptivateIQ's "matter of weeks" quote sits under "Watch out for".
  - The WP2 log lines from 2026-10-12 record that day's `dateModified`. The rec 2 replacement log records 2026-10-13.
- **Clean**:
  - itemLists match the headings, and both lists are alphabetical.
  - Every FAQ is mirrored in the body.
  - All 41 internal links in the posts resolve.
  - All image paths exist and the case study JSON is valid.
  - No em dashes, and no Sprint or T-Mobile.
  - `datePublished` is unchanged on both edited posts.

## Security review findings

The review ran because the diff touches `commission` (the case study path) and `comp` (`spm/compare`).

- **None.** A fresh security-auditor agent checked:
  - **SVGs:** only rect, text, circle, path and line elements. No script, on* handlers, href, foreignObject, DOCTYPE/ENTITY or url().
  - **PNG:** only IHDR, IDAT and IEND chunks, with no trailing data.
  - **Markdown:** no rehype-raw; the default URL filter is intact; the content has no raw HTML.
  - **JSON-LD:** strings go through `toJsonLd()` escaping.
  - **Data:** no secrets or PII.
  - **External links:** plain https, with no tracking or credential parameters.

## Verification

- **pass**: full regression run after the code-review fixes, `regress.sh prepr3`, all 9 steps rc=0.
  - **Content check:** check:content OK (blog 29, caseStudies 14, whitePapers 6).
  - **Unit tests:** test:rules 94/94, test:schema 54/54, test:loaders 8/8, test:auth 107/107, test:redirects 3/3.
  - **Admin, lint, build:** check:admin OK; lint exit 0; build exit 0.
  - **Postbuild:** check:headings (94 routes), check:schema-mirror (53 FAQPage/HowTo nodes), check:house-style (no em dashes or markers), check:dir-page.
- **pass**: internal-link check, 12 pages, 359 distinct hrefs, 0 unresolved.
- **pass**: `verify` skill with Playwright on a fresh `next start -p 3823`. The server was first confirmed to serve the new text ("plan modeling as a named step", "back it all up").
  - **Routes:** `/blog/best-spm-service-partners-compared`, `/blog/best-enterprise-spm-software-for-complex-incentives`, `/spm/compare` and `/case-studies/managed-services-commission-management`, each at 1280px and 375px.
  - **Result:** 8/8 PASS. Each page returned 200 with one h1, no heading jumps, no horizontal scroll and 0 console errors, and every JSON-LD block parses. All 5 rec 2 images load and fit their containers.
- **Note:** one verify attempt reached a stale server from earlier in this run that still held the port. It was discarded, the process was stopped, and the run was repeated on a fresh server.

## Required before merging

1. Commit WP2 (explicit paths; never `.claude/logs/subagents.log` or the verify marker).
2. Doug's decisions on every `UNDECIDED` row in `docs/owner-review/aeo-hubspot-2026-10-12.md`:
   - the (r2) rows, including the Lead corrections;
   - rec 4, the case study and the cross-link rows.

   The user then records `Signed off: Doug Erb, <date>`.
3. §9 publish step:
   - apply each EDIT and STRIKE;
   - set real `datePublished` and `dateModified`, and `UPDATED.spm`;
   - replace the `hubspotId` placeholder;
   - rebase onto `main`;
   - run the full regression, link check and verify;
   - complete the §8.0 gate sequence.

   Then merge, asking the user before pushing `main`.

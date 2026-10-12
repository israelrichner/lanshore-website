# Owner review: AEO HubSpot recommendations, 2026-10-12

Plan: `docs/plans/aeo-hubspot-recs-2026-10-12.md` (section 9 sets this file's format). Branch: `aeo-hubspot-2026-10-12`.

**How to review.** Every row in tables (a) to (e) has a `Decision` column that starts as the placeholder token (all caps, "undecided"). Replace it with one of:
- `APPROVE`
- `EDIT: <replacement text>`
- `STRIKE`

Sign-off is complete when the placeholder count from plan section 9 returns 0 and the file ends with the line `Signed off: Doug Erb, <YYYY-MM-DD>`. The user adds that line when relaying Doug's answers. Agents never write it.

**Pages to review (WP1).** Local `verify` was run because preview-deploy availability (A1) is still unconfirmed:
- `/solutions/quota-incentive-alignment` (new)
- `/resources/guides/sales-finance-misalignment` (new)
- `/solutions/spm-consulting` (extended)
- `/solutions/mid-market-implementation` (one FAQ added)
- `/solutions/global-compliance` (one related link added)
- `/spm/captivateiq` and `/spm/performio` (FAQs, a related line, and the CaptivateIQ AI-status wording)
- `/solutions` (index description)

WP2 appends its rows to this file.

---

## (a) New Lanshore claims

These are statements about what Lanshore does that were written fresh in WP1. None of them carries a number.

| # | Where | Claim (summary; the full text is in the file) | Decision |
|---|---|---|---|
| a1 | `src/lib/solutions/spm-consulting.ts`: `titleTag`, `metaDescription`, `firstSentence` | Positions SPM consulting as audit-ready and covering global incentive plans. The engagement scope now lists CRM and ERP integration, audit-ready analytics and governed rollout. New title: "Audit-Ready SPM Consulting: Complex, Global Plans \| Lanshore". The H1 is unchanged. | UNDECIDED |
| a2 | `spm-consulting.ts`, problem "Global plans whose controls cannot be evidenced country by country" | Describes the problem only. It makes no Lanshore claim. | UNDECIDED |
| a3 | `spm-consulting.ts`, step "CRM and ERP integration" | Lanshore connects CRM, ERP, HRIS and payroll, validates inbound loads before calculation, and reconciles payouts and accruals to finance each cycle. | UNDECIDED |
| a4 | `spm-consulting.ts`, step "Audit-ready analytics" | Lanshore builds traceability, reconciliation, approval evidence, exception reporting and accrual support into the platform and the monthly cycle. Consistent with the audit-ready guide's five evidence types. | UNDECIDED |
| a5 | `spm-consulting.ts`, step "Governed global rollout" (first three sentences) | Lanshore rolls out global plans in waves under one framework, with local parameters approved and versioned centrally. The PepsiCo sentence that follows is reused (b3). | UNDECIDED |
| a6 | `spm-consulting.ts`, FAQ "What makes incentive compensation analytics audit-ready?" | A definition, aligned with the guide `enterprise-spm-consulting-audit-ready-analytics`. | UNDECIDED |
| a7 | `src/lib/spmPlatforms.ts`, captivateiq FAQ "How does Lanshore move commissions from spreadsheets to CaptivateIQ?" | A five-step migration method on CaptivateIQ. The 10-to-14-week figure is reused (b4) and labeled as Lanshore's cross-platform figure. | UNDECIDED |
| a8 | `spmPlatforms.ts`, captivateiq FAQ "What does Lanshore integrate around CaptivateIQ?" | Lanshore integrates the CRM, HRIS, payroll and ERP around CaptivateIQ, with validation and reconciliation. The system list is reused (b5). | UNDECIDED |
| a9 | `spmPlatforms.ts`, performio `lanshoreAngle[3]` | "Migration from spreadsheet commissions onto Performio, with parallel runs that reconcile every payee before cutover" | UNDECIDED |
| a10 | `spmPlatforms.ts`, performio FAQ "Can Lanshore move our commissions from spreadsheets to Performio?" | Same method as a7, on Performio. The 10-to-14-week figure is reused (b4). | UNDECIDED |
| a11 | `spmPlatforms.ts`, performio FAQ "What does Lanshore integrate around Performio?" | Same as a8, on Performio. | UNDECIDED |
| a12 | `src/lib/solutions/mid-market-implementation.ts`, FAQ "Does Lanshore implement CaptivateIQ and Performio for teams leaving spreadsheets?" | Yes, with the same migration method. Lanshore resells neither platform. | UNDECIDED |
| a13 | `src/lib/solutions/quota-incentive-alignment.ts` (new page) | A new Lanshore offer: alignment assessment, reconciling quota methods, mapping plan measures to quota, crediting configured in the platform, and planning calendar plus change control. Visibility and dashboards are referred to `/solutions/revenue-teams`. | UNDECIDED |
| a14 | `quota-incentive-alignment.ts`, step "Configure crediting in the platform", last sentence | "Under Lanshore's Agentic SPM approach, agents can check each crediting run against quota assignment and route mismatches to a person to resolve." | UNDECIDED |
| a15 | `content/blog/sales-finance-misalignment.md`, "Where platforms and agents fit" | Agentic SPM agents can validate loads, compare results against the ledger, flag accrual variances and route exceptions, logging every action. The "a person approves" sentence is reused (b9). | UNDECIDED |
| a16 | `sales-finance-misalignment.md`, "How Lanshore helps", first paragraph | Lanshore implements and operates SPM platforms and resells none, so the work starts with design. Links to the quota-alignment and integration solutions. | UNDECIDED |
| a17 | `src/app/solutions/page.tsx`, `DESCRIPTION` (158 characters) | "Lanshore SPM solutions: consulting, integration, managed services, global compliance, mid-market implementation, quota and incentive alignment, and AI agents." | UNDECIDED |

## (b) Reused claims

Each row is an already-published Lanshore claim that WP1 copy repeats, with its origin.

| # | Claim as used | Used in | Origin (published today) | Decision |
|---|---|---|---|---|
| b1 | "15+ years of incentive compensation delivery" | `spm-consulting.ts` `firstSentence` (retained) | Same field before this change; also `xactly` `metaDescription` | UNDECIDED |
| b2 | Lanshore implements nine SPM platforms and resells none | `spm-consulting.ts` `firstSentence`; `quota-incentive-alignment.ts` `whoItIsFor`; `mid-market-implementation.ts` new FAQ ("resells neither platform"); guide "How Lanshore helps" | `spm-consulting.ts` step "Platform fit"; `mid-market-implementation.ts` step "Scope from the plan documents" | UNDECIDED |
| b3 | "For PepsiCo, Lanshore delivered a multi-country sales incentive rollout covering more than 20 countries and a dozen currencies on one plan framework with local variants." (verbatim) | `spm-consulting.ts` step "Governed global rollout" | `src/lib/solutions/global-compliance.ts`, step "Migrate from legacy systems" | UNDECIDED |
| b4 | "For a mid-market plan set (3 to 6 plans, up to about 1,000 payees), a Lanshore spreadsheet-to-platform migration typically runs 10 to 14 weeks from kickoff to cutover, including one parallel-run cycle." (verbatim), followed by "That range is Lanshore's figure across platforms, not a CaptivateIQ-specific one" (Performio in the second FAQ) | captivateiq FAQ 4; performio FAQ 3 | `content/blog/best-spm-platforms-for-spreadsheet-replacement.md`, "How Lanshore helps" paragraph | UNDECIDED |
| b4-note | **Tension for Doug:** `/solutions/mid-market-implementation` FAQ "How long does a mid-market SPM implementation take?" says Lanshore scopes the timeline "rather than quoting a standard duration". The spreadsheet post (and now the two platform FAQs) quote a typical 10 to 14 weeks. The new mid-market FAQ (a12) deliberately leaves the figure out so that page stays self-consistent. Decide whether the figure stands sitewide. | `/spm/captivateiq`, `/spm/performio`, spreadsheet post | as above | UNDECIDED |
| b5 | "Lanshore has integrated SPM platforms with Salesforce, HubSpot, Microsoft Dynamics, SAP, Oracle, Workday, NetSuite, and ADP, plus billing, order management, and data warehouse sources: more than 20 distinct source systems in all" (verbatim from the origin except "in all" for "across our engagement history", which the sentence already opens with; the "plus billing..." clause was restored by the Lead after cold review pass 3 so the 8 named systems are not read as totaling 20+) | captivateiq FAQ 5; performio FAQ 4 | `src/lib/solutions/enterprise-crm-erp-integration.ts`, step "Run, monitor, or hand over" | UNDECIDED |
| b6 | "For a Fortune 500 high-tech company, Lanshore replaced a manual transfer of commission data between financial systems and the CRM with an automated integration that validates every transfer, removing the dependency on the few people who knew the steps." (verbatim) | guide "How Lanshore helps" | `enterprise-crm-erp-integration.ts`, FAQ "Can Lanshore integrate our existing SPM platform without replacing it?" | UNDECIDED |
| b7 | Lanshore implements CaptivateIQ and Performio | mid-market FAQ (a12); platform FAQs | `spmPlatforms.ts` (both entries); `/about/partners` ("Implementation partnership" for CaptivateIQ, "Implementation and support partnership" for Performio). The new copy uses only "implements"; no partner tier or certification wording. | UNDECIDED |
| b8 | "Also supported through our partner network" (Oracle, beqom, Forma.ai, from `NEAR_MISS_VENDORS`) | **Not used in WP1 copy.** Logged as the plan requires so Doug can confirm or strike it sitewide; WP2's rec 4 post will reuse it. | `src/app/spm/compare/page.tsx:57,179`; `src/app/spm/page.tsx:98` | UNDECIDED |
| b9 | "A person still approves anything that affects pay." | guide "Where platforms and agents fit" | `enterprise-crm-erp-integration.ts` FAQ "How do AI agents fit into SPM integrations?" ("A person approves anything that affects pay.") | UNDECIDED |
| b10 | **Incentivate is described two ways on the live site** (inconsistency, not WP1 copy): `/spm` (`src/app/spm/page.tsx:97-99`) says "legacy estates on Iconixx and Incentivate" are supported through the partner network, while `SPM_PLATFORMS` has a full Incentivate implementation entry ("Lanshore implements Incentivate, runs comp operations on it"). WP2's rec 4 will use the `SPM_PLATFORMS` position (implements) unless Doug decides otherwise. | `/spm`, `/spm/incentivate` | as stated | UNDECIDED |

## (c) Proposed proof points (not written into copy)

Nothing below is on the site. Each row gives the exact proposed sentence and where it would go. Bracketed slots need owner-supplied facts. Where a row reuses an existing published claim, its origin is named. Those claims were kept out of the WP1 copy because they are not in the plan's reusable set or do not fit the page exactly.

| # | Insertion point | Proposed sentence | Notes | Decision |
|---|---|---|---|---|
| c1 | `quota-incentive-alignment.ts`, end of step "Configure crediting in the platform" | "For a [industry] company, Lanshore rebuilt crediting from the same territory master the quotas used, and crediting disputes fell from [X] to [Y] per quarter." | Needs a real engagement and figures. No published Lanshore claim covers quota and incentive alignment results. | UNDECIDED |
| c2 | `sales-finance-misalignment.md`, end of "Where platforms and agents fit" | "At one national telecom carrier, Lanshore reports that agent-run cycle steps cut monthly close time by 74 percent and exceptions worked by hand per cycle from about 400 to about 100." | Already published (`best-spm-service-partners-compared.md:175`). Held back because it measures the commission-cycle close, not the finance close, and the guide is about the gap between sales and finance. | UNDECIDED |
| c3 | `spm-consulting.ts`, end of step "Audit-ready analytics" | "For one insurance client, the month-end comp close went from twelve business days to five after the engagement, and the next external audit cycle had no findings on incentive compensation, down from two the prior year." | Already published in `content/blog/enterprise-spm-consulting-audit-ready-analytics.md:197` but not in the plan's section 3.6 reusable set, so it needs owner approval before use on a solution page. | UNDECIDED |
| c4 | `spmPlatforms.ts`, captivateiq or performio spreadsheet FAQ, final sentence | "For a [industry] company with [N] payees on [N] plans, Lanshore moved commissions from spreadsheets to [CaptivateIQ \| Performio] in [N] weeks, including one parallel-run cycle." | Needs an engagement that actually ran on that platform. The spreadsheet case study does not name its platform and must not be connected to either one (plan section 3.6). | UNDECIDED |
| c5 | `spm-consulting.ts`, problem "Global plans whose controls cannot be evidenced country by country" | "In one [N]-country program, Lanshore found [describe the evidence gap] before the external audit, and [result]." | Needs a real engagement. PepsiCo is the only named global program, and its published claim says nothing about audit evidence. | UNDECIDED |

## (d) Competitor and vendor claims

Retrieved 2026-10-12. Quotes are taken from the page text, read from the raw HTML with tags stripped (not from a fetch-tool summary).

| # | Vendor | Quote (verbatim) | URL | Page date | Used on site as | Decision |
|---|---|---|---|---|---|---|
| d1 | CaptivateIQ | "CaptivateIQ Agents are available now in limited beta, with broader access rolling out throughout the year." | https://www.captivateiq.com/blog/top-10-moments-of-captivate-2026 | 2026-05-26 | `spmPlatforms.ts` captivateiq `positioning` and `aiFeatures[0]`: "launched in limited beta in May 2026 with broader access rolling out through the year" | UNDECIDED |
| d2 | CaptivateIQ | "The Revenue Planning Agent is now generally available across Sales Planning." | https://www.captivateiq.com/blog/whats-new-september-2026 | 2026-09-09 | captivateiq `positioning` and `aiFeatures[0]`: "the Revenue Planning Agent became generally available in September 2026" (**new**) | UNDECIDED |
| d3 | CaptivateIQ | Section label "Coming Soon" above "CaptivateIQ MCP Server", with the text "The CaptivateIQ MCP Server gives AI platforms like Claude and ChatGPT secure, governed access to your live compensation and planning data." | https://www.captivateiq.com/ai-agents | not dated (retrieved 2026-10-12) | captivateiq `positioning`, `aiFeatures[1]` and FAQ 2: "lists an MCP server ... as coming soon" (**changed** from "announced; general availability planned for later in 2026"). Matches the existing "CaptivateIQ lists its MCP server as coming soon" in `enterprise-crm-erp-integration.ts` and `ai-agents-sales-operations.ts`, which were already accurate and are unchanged. | UNDECIDED |
| d4 | CaptivateIQ | "Native MCP support coming soon." | https://www.captivateiq.com/blog/whats-new-at-ciq-july-2026 | 2026-07-29 | Corroborates d3. The September 2026 post does not mention MCP. | UNDECIDED |
| d5 | Performio | "The Performio MCP Server introduces the first implementation of the open Model Context Protocol in the ICM industry, enabling users to interact with Performio directly through their trusted AI tools, like Claude Desktop or Salesforce Agentforce." | https://www.performio.co/news/performio-launches-ai-icm | 2025-10-23 | Supports the existing site claim "first MCP server in the ICM category" (unchanged). **Note for Doug:** this is Performio's own claim, and the site states it as fact without attribution. Consider "Performio describes its MCP server as the first in the ICM category". | UNDECIDED |
| d6 | Performio | Heading "First MCP Server", subtext "built specifically for sales compensation"; also "What you can do with the MCP Server: Trigger calculations from any MCP-enabled AI tool" | https://www.performio.co/capabilities/ai | not dated (retrieved 2026-10-12) | Confirms the MCP server is a current product (unchanged site wording). | UNDECIDED |
| d7 | Performio | "...today announced measurable customer results from its AI Implementation Agents, which are now compressing ICM configuration timelines from months to weeks." and "...extending AI Implementation Agent capabilities beyond internal consultant productivity to building live customer environments." | https://www.performio.co/news/performio-cuts-icm-implementation-timelines-from-months-to-weeks-with-ai-agents | 2026-06-18 | Supports the existing "AI Implementation Agents that accelerate configuration" (unchanged). **Nuance:** the agents are used by Performio's delivery teams during implementation and are not a customer-operated feature. The `/spm/performio` wording does not claim otherwise. | UNDECIDED |

## (e) Firm survey and vendor inclusion verdicts

WP2 appends these rows (rec 2 firm survey, rec 4 vendor verdicts). WP1 has none.

## (f) Verification log (WP1)

**Regression.**
- Baseline, before any edit: all 9 steps passed (rc=0 each). Counts: test:rules 70, test:schema 54, test:loaders 8, test:auth 107, test:redirects 3.
- Final: all 9 steps passed (rc=0 each). test:rules is now 91 (+21).
- Postbuild final: check:headings OK (93 routes); check:schema-mirror OK (93 routes, 52 FAQPage/HowTo nodes); check:house-style OK ("no em dashes and no proof-point markers in published output"); check:dir-page OK.

**Counts** (from the built HTML JSON-LD; the before values match the plan's section 5 values):

| Page | Measure | Before | After |
|---|---|---|---|
| `/spm/captivateiq` | FAQPage `mainEntity` | 3 | 5 |
| `/spm/performio` | FAQPage `mainEntity` | 2 | 4 |
| `/solutions/spm-consulting` | FAQPage `mainEntity` | 5 | 6 |
| `/solutions/mid-market-implementation` | FAQPage `mainEntity` | 5 | 6 |
| `/solutions/quota-incentive-alignment` | FAQPage `mainEntity` | (new) | 5 |
| `/resources/guides/sales-finance-misalignment` | FAQPage `mainEntity` | (new) | 5 |
| rec 2 post | FAQPage; ItemList | 4; 8 | 4; 8 (WP2) |
| site | `/sitemap.xml` `<url>` | 89 | 91 (WP1 adds 2; WP2 adds the third) |
| site | `/llms.txt` solution + guide lines | 18 | 20 |

**Negative injections** (each reverted right away; the final regression ran after all reverts):

1. Marker in a `SOLUTIONS` entry (`quota-incentive-alignment` `faq[2].answer`). `npm run build` failed at module load (rc=1):
   ```
   Error: solutions/quota-incentive-alignment: proof-point marker in faq[2].answer; remove it before publishing
   > Build error occurred
   Error: Failed to collect page data for /llms-full.txt
   ```
2. Marker in a published blog record (`sales-finance-misalignment` body). `npm run check:content` failed (rc=1):
   ```
   check:content FAILED — 1 problem(s)
     blog/sales-finance-misalignment: "body" contains a proof-point marker ("proof point needed"). A published record cannot ship a placeholder claim: supply the evidence, rewrite the sentence so it is true without it, or set draft: true.
   ```
3. Marker in `captivateiq.positioning`. Prebuild passed (check:content OK, all tests green), check:headings and check:schema-mirror passed, then check:house-style failed (build rc=1):
   ```
   check:house-style FAILED: 3 proof-point marker(s) in published output:
     /spm/captivateiq [text] "[PROOF POINT NEEDED: adoption figure] Cap..."
     /spm [text] "[PROOF POINT NEEDED: adoption figure] Cap..."
     /llms-full.txt line 113: [PROOF POINT NEEDED: adoption figure] CaptivateIQ combines the flexibility comp
   ```
4. All three reverted (`.injbak` restores, none left on disk). Full regression green afterwards (see Regression above).

**Internal-link check** (one-off scratch script, not committed). Result: PASS, 10 pages, 293 distinct internal hrefs, 0 unresolved, exit 0.
- Pages checked: the 3 WP1 targets, the 5 extended pages, `/spm/compare`, `/solutions/global-compliance` and the modernizing guide.
- Rule refinement: the app-dir metadata routes `/favicon.ico` and `/apple-icon.png`, which build to `.body` files like the llms routes, are treated as built routes. Without that, the first run listed exactly those two on every page.
- Each link the plan's section 2 requires was also confirmed present on its page.

**Rec 6 capability check** (`node --experimental-strip-types`, scratch script). Result: PASS, 6 platforms checked, 0 failing, exit 0.
- varicent: "Territory and quota planning with what-if modeling"
- xactly: "Territory and quota planning"
- captivateiq: "Territory and quota planning (CaptivateIQ Planning)"
- sap-incentive-management: "Territory and quota management within the SAP portfolio"
- anaplan: "Territory and quota planning connected to corporate planning"
- akeron: "Territory and quota planning"

**Claims audit.**
- Scope: lines added against `main` in `content`, `src/lib` and `src/app`, plus new untracked files in those paths. 373 lines.
- Must-be-zero tokens: **0 hits.**
  - The first pass hit twice in my own text, and both were reworded rather than excepted: "guarantees and draws" in the guide became "recoverable and non-recoverable draws", and a `types.ts` code comment that quoted the marker phrase now names `PROOF_MARKER_RE`.
  - No exceptions are needed.
- Logged tokens: `PepsiCo` 1 (b3, verbatim). `Grammarly`, `Micro Focus`, `PwC`, `partner network` and `partnership`: 0.

Number lines (each added line with a digit, `%` or "percent"):

| # | File | Content | Origin |
|---|---|---|---|
| 1 | `src/app/spm/[slug]/page.tsx` | `platform.related.length > 0` | code, not a claim |
| 2 | same | `className="mt-4 ..."` | code, not a claim |
| 3 | same | `i > 0 && " · "` | code, not a claim |
| 4 | `src/lib/solutions/index.ts` | comment naming the plan file (date in the name) | code comment |
| 5 | `spm-consulting.ts` `firstSentence` | "nine SPM platforms", "15+ years" | b2, b1 |
| 6 | `spm-consulting.ts` step "Governed global rollout" | "more than 20 countries and a dozen currencies" | b3 |
| 7 | `spm-consulting.ts` `related` | label "Global Incentive Governance in 2026" | existing guide title |
| 8 | `src/lib/solutions/types.ts` | comment naming this file (date in the name) | code comment |
| 9 | `spmPlatforms.ts` captivateiq `positioning` | "May 2026", "September 2026" | d1, d2 |
| 10 | `spmPlatforms.ts` captivateiq `aiFeatures[0]` | "May 2026", "September 2026" | d1, d2 |
| 11 | `spmPlatforms.ts` captivateiq FAQ 2 | the digit is in "n8n" (tool name) | not a number claim |
| 12 | `spmPlatforms.ts` captivateiq FAQ 4 | "3 to 6 plans", "about 1,000 payees", "10 to 14 weeks" | b4 |
| 13 | `spmPlatforms.ts` captivateiq FAQ 5 | "more than 20 distinct source systems" | b5 |
| 14 | `spmPlatforms.ts` performio FAQ 3 | "3 to 6 plans", "about 1,000 payees", "10 to 14 weeks" | b4 |
| 15 | `spmPlatforms.ts` performio FAQ 4 | "more than 20 distinct source systems" | b5 |
| 16-21 | `sales-finance-misalignment.md` | ordered-list numerals "1." to "6." in "A sequence to fix it" | list numerals, not claims |
| 22 | `sales-finance-misalignment.md` | "Fortune 500 high-tech company" | b6 |
| 23 | `quota-incentive-alignment.ts` | comment naming the plan (date in the name) | code comment |
| 24 | `quota-incentive-alignment.ts` | `hubspotId: "UNASSIGNED-2026-10-12"` | OQ8 placeholder, replaced at publish |
| 25 | `quota-incentive-alignment.ts` `related` | label "7 Sales Process Gaps That Undermine Quota Attainment" | existing post title |

Numbers audit: 25 lines reviewed, all traced, Lead (Claude Code), 2026-10-12. Reused claims b1-b6 checked verbatim against `main` (`global-compliance.ts`, `best-spm-platforms-for-spreadsheet-replacement.md`, `enterprise-crm-erp-integration.ts`, `crm-financial-systems-commission-link.json`); d2 and d3 re-fetched live from captivateiq.com on 2026-10-12 and confirmed.

**Coverage.** Command: `node --test --experimental-test-coverage scripts/lib/house-style.test.mjs scripts/lib/content-rules.test.mjs`. Rung: changed-file proxy.
- `house-style.mjs`: 100.00% lines, 97.83% branches. The whole file was touched by the refactor.
- `content-rules.mjs`: 88.19% lines for the whole file. Every changed line (`validateNoProofMarkers` and its three call sites) is covered. The uncovered lines are pre-existing Markdown helpers that these two suites do not exercise.

**UI verification** (`verify` skill: a production build served by `next start` and driven by Playwright 1.61).
- Routes:
  - `/solutions/quota-incentive-alignment`
  - `/resources/guides/sales-finance-misalignment`
  - `/solutions/spm-consulting`
  - `/solutions/mid-market-implementation`
  - `/solutions/global-compliance`
  - `/solutions`
  - `/spm/captivateiq`
  - `/spm/performio`
  - `/spm/compare`
  - `/blog/best-spm-service-partners-compared`
- Each route at 1280px and 375px:
  - status 200;
  - exactly one h1;
  - largest heading step 1;
  - no horizontal page scroll at 375px (scrollWidth equals clientWidth, 375). The guide's symptom table scrolls inside its own container (table 576px wide, wrapper 341px, `overflow-x: auto`);
  - zero console errors or warnings and zero `pageerror`.
- The Related line renders on `/spm/captivateiq` and `/spm/performio` only. The seven other platform pages have zero Related DOM.
- Result: PASS, 0 failures.

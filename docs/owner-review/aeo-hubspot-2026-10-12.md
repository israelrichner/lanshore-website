# Owner review: AEO HubSpot recommendations, 2026-10-12

Plan: `docs/plans/aeo-hubspot-recs-2026-10-12.md` (section 9 sets this file's format). Branch: `aeo-hubspot-2026-10-12`.

**How to review.** Every row in tables (a) to (e) has a `Decision` column that starts as the placeholder token (all caps, "undecided"). Replace it with one of:
- `APPROVE`
- `EDIT: <replacement text>`
- `STRIKE`

Sign-off is complete when the placeholder count from plan section 9 returns 0 and the file ends with the line `Signed off: Doug Erb, <YYYY-MM-DD>`. The user adds that line when relaying Doug's answers. Agents never write it.

**Decisions recorded 2026-10-13.** On the user's instruction ("Mark everything as approved"), the Lead set all 116 open decision cells to `APPROVE`. Rows with Lead corrections are approved as corrected, which is the wording now in the posts. The 58 rows marked SUPERSEDED (replaced by Doug's rec 2 draft) are unchanged. The user added the sign-off line on 2026-10-13. Table (c) approvals were then applied as the user chose: c1 and c5 as method statements without results, c2 to c4 not inserted (see each row).

**Pages to review (WP1).** Local `verify` was run because preview-deploy availability (A1) is still unconfirmed:
- `/solutions/quota-incentive-alignment` (new)
- `/resources/guides/sales-finance-misalignment` (new)
- `/solutions/spm-consulting` (extended)
- `/solutions/mid-market-implementation` (one FAQ added)
- `/solutions/global-compliance` (one related link added)
- `/spm/captivateiq` and `/spm/performio` (FAQs, a related line, and the CaptivateIQ AI-status wording)
- `/solutions` (index description)

**Pages to review (WP2).** Local `verify` was run for the same reason:
- `/blog/best-enterprise-spm-software-for-complex-incentives` (new; rec 4, absorbs rec 7; no `datePublished` until publish)
- `/blog/best-spm-service-partners-compared` (rec 2; **replaced by Doug's draft on 2026-10-13**, see section (r2); title "Best SPM Consulting and Service Partners Compared", slug and `datePublished` unchanged; five new graphics under `/images/`)
- `/case-studies/managed-services-commission-management` (OQ9 wording)
- `/spm/compare` (one sentence and link after the table)
- `/resources/guides/modernizing-legacy-spm-systems` (one sentence and link in Phase 2)

WP2 rows are marked "(WP2)" in each table below.

---

## (a) New Lanshore claims

These are statements about what Lanshore does that were written fresh in WP1. None of them carries a number.

| # | Where | Claim (summary; the full text is in the file) | Decision |
|---|---|---|---|
| a1 | `src/lib/solutions/spm-consulting.ts`: `titleTag`, `metaDescription`, `firstSentence` | Positions SPM consulting as audit-ready and covering global incentive plans. The engagement scope now lists CRM and ERP integration, audit-ready analytics and governed rollout. New title: "Audit-Ready SPM Consulting: Complex, Global Plans \| Lanshore". The H1 is unchanged. | APPROVE |
| a2 | `spm-consulting.ts`, problem "Global plans whose controls cannot be evidenced country by country" | Describes the problem only. It makes no Lanshore claim. (c5 method sentence appended 2026-10-13; see row c5.) | APPROVE |
| a3 | `spm-consulting.ts`, step "CRM and ERP integration" | Lanshore connects CRM, ERP, HRIS and payroll, validates inbound loads before calculation, and reconciles payouts and accruals to finance each cycle. | APPROVE |
| a4 | `spm-consulting.ts`, step "Audit-ready analytics" | Lanshore builds traceability, reconciliation, approval evidence, exception reporting and accrual support into the platform and the monthly cycle. Consistent with the audit-ready guide's five evidence types. | APPROVE |
| a5 | `spm-consulting.ts`, step "Governed global rollout" (first three sentences) | Lanshore rolls out global plans in waves under one framework, with local parameters approved and versioned centrally. The PepsiCo sentence that follows is reused (b3). | APPROVE |
| a6 | `spm-consulting.ts`, FAQ "What makes incentive compensation analytics audit-ready?" | A definition, aligned with the guide `enterprise-spm-consulting-audit-ready-analytics`. | APPROVE |
| a7 | `src/lib/spmPlatforms.ts`, captivateiq FAQ "How does Lanshore move commissions from spreadsheets to CaptivateIQ?" | A five-step migration method on CaptivateIQ. The 10-to-14-week figure is reused (b4) and labeled as Lanshore's cross-platform figure. | APPROVE |
| a8 | `spmPlatforms.ts`, captivateiq FAQ "What does Lanshore integrate around CaptivateIQ?" | Lanshore integrates the CRM, HRIS, payroll and ERP around CaptivateIQ, with validation and reconciliation. The system list is reused (b5). | APPROVE |
| a9 | `spmPlatforms.ts`, performio `lanshoreAngle[3]` | "Migration from spreadsheet commissions onto Performio, with parallel runs that reconcile every payee before cutover" | APPROVE |
| a10 | `spmPlatforms.ts`, performio FAQ "Can Lanshore move our commissions from spreadsheets to Performio?" | Same method as a7, on Performio. The 10-to-14-week figure is reused (b4). | APPROVE |
| a11 | `spmPlatforms.ts`, performio FAQ "What does Lanshore integrate around Performio?" | Same as a8, on Performio. | APPROVE |
| a12 | `src/lib/solutions/mid-market-implementation.ts`, FAQ "Does Lanshore implement CaptivateIQ and Performio for teams leaving spreadsheets?" | Yes, with the same migration method. Lanshore resells neither platform. | APPROVE |
| a13 | `src/lib/solutions/quota-incentive-alignment.ts` (new page) | A new Lanshore offer: alignment assessment, reconciling quota methods, mapping plan measures to quota, crediting configured in the platform, and planning calendar plus change control. Visibility and dashboards are referred to `/solutions/revenue-teams`. | APPROVE |
| a14 | `quota-incentive-alignment.ts`, step "Configure crediting in the platform", last sentence | "Under Lanshore's Agentic SPM approach, agents can check each crediting run against quota assignment and route mismatches to a person to resolve." | APPROVE |
| a15 | `content/blog/sales-finance-misalignment.md`, "Where platforms and agents fit" | Agentic SPM agents can validate loads, compare results against the ledger, flag accrual variances and route exceptions, logging every action. The "a person approves" sentence is reused (b9). | APPROVE |
| a16 | `sales-finance-misalignment.md`, "How Lanshore helps", first paragraph | Lanshore implements and operates SPM platforms and resells none, so the work starts with design. Links to the quota-alignment and integration solutions. | APPROVE |
| a17 | `src/app/solutions/page.tsx`, `DESCRIPTION` (158 characters) | "Lanshore SPM solutions: consulting, integration, managed services, global compliance, mid-market implementation, quota and incentive alignment, and AI agents." | APPROVE |
| a18 | (WP2) `content/blog/best-spm-service-partners-compared.md`, Lanshore entry, "**Consulting scope.**" paragraph (first two sentences) | Summarizes Lanshore's published consulting scope: plan design review with design changes proposed and costed before configuration, then requirements, platform fit, build, CRM and ERP integration, audit-ready analytics, testing with parallel runs and hypercare, and global rollout in waves under one framework. Every element is taken from `src/lib/solutions/spm-consulting.ts` (`howWeDeliver`), so it is a summary of live copy rather than a new offer. The PepsiCo sentence that follows is reused (b3). | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| a19 | (WP2) Same post: Lanshore row of both tables, "Core focus" ("SPM consulting and operations plus AI agents") and "Best for" ("One partner for consulting, operations, and agents"); "Consulting scope at a glance" Lanshore row | Widened from the managed-services wording to include consulting, matching a18. | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| a20 | (WP2) `content/blog/best-enterprise-spm-software-for-complex-incentives.md`, "How Lanshore helps" | "Lanshore is platform-agnostic: it evaluates vendors against your hardest plan components and data, implements the chosen platform, and can run comp operations afterwards as a managed service." Adapted from the spreadsheet-replacement post's "How Lanshore helps" ("against your plans and data"), with "hardest plan components" from `spm-consulting.ts` step "Platform fit". | APPROVE |
| a21 | (WP2) Rec 4 post, "How we compared" and disclosure | States the candidate pool (the 12 platforms Lanshore implements or supports), calls that scope a limitation, and says "Lanshore is not listed as a vendor here, because it does not sell SPM software." The last clause restates b2. | APPROVE |
| a22 | (WP2) `src/app/spm/compare/page.tsx`, new sentence after the partner-network line | "Choosing for complex enterprise incentive plans? Our comparison of enterprise SPM software for complex incentives sets out what each vendor publishes about pricing, rollout time, and fit, and covers replacing a legacy system." A navigation sentence with no claim. The same applies to the modernizing guide's new Phase 2 sentence. | APPROVE |

## (b) Reused claims

Each row is an already-published Lanshore claim that WP1 copy repeats, with its origin.

| # | Claim as used | Used in | Origin (published today) | Decision |
|---|---|---|---|---|
| b1 | "15+ years of incentive compensation delivery" | `spm-consulting.ts` `firstSentence` (retained) | Same field before this change; also `xactly` `metaDescription` | APPROVE |
| b2 | Lanshore implements nine SPM platforms and resells none | `spm-consulting.ts` `firstSentence`; `quota-incentive-alignment.ts` `whoItIsFor`; `mid-market-implementation.ts` new FAQ ("resells neither platform"); guide "How Lanshore helps" | `spm-consulting.ts` step "Platform fit"; `mid-market-implementation.ts` step "Scope from the plan documents" | APPROVE |
| b3 | "For PepsiCo, Lanshore delivered a multi-country sales incentive rollout covering more than 20 countries and a dozen currencies on one plan framework with local variants." (verbatim) | `spm-consulting.ts` step "Governed global rollout" | `src/lib/solutions/global-compliance.ts`, step "Migrate from legacy systems" | APPROVE |
| b4 | "For a mid-market plan set (3 to 6 plans, up to about 1,000 payees), a Lanshore spreadsheet-to-platform migration typically runs 10 to 14 weeks from kickoff to cutover, including one parallel-run cycle." (verbatim), followed by "That range is Lanshore's figure across platforms, not a CaptivateIQ-specific one" (Performio in the second FAQ) | captivateiq FAQ 4; performio FAQ 3 | `content/blog/best-spm-platforms-for-spreadsheet-replacement.md`, "How Lanshore helps" paragraph | APPROVE |
| b4-note | **Tension for Doug:** `/solutions/mid-market-implementation` FAQ "How long does a mid-market SPM implementation take?" says Lanshore scopes the timeline "rather than quoting a standard duration". The spreadsheet post (and now the two platform FAQs) quote a typical 10 to 14 weeks. The new mid-market FAQ (a12) deliberately leaves the figure out so that page stays self-consistent. Decide whether the figure stands sitewide. | `/spm/captivateiq`, `/spm/performio`, spreadsheet post | as above | APPROVE |
| b5 | "Lanshore has integrated SPM platforms with Salesforce, HubSpot, Microsoft Dynamics, SAP, Oracle, Workday, NetSuite, and ADP, plus billing, order management, and data warehouse sources: more than 20 distinct source systems in all" (verbatim from the origin except "in all" for "across our engagement history", which the sentence already opens with; the "plus billing..." clause was restored by the Lead after cold review pass 3 so the 8 named systems are not read as totaling 20+) | captivateiq FAQ 5; performio FAQ 4 | `src/lib/solutions/enterprise-crm-erp-integration.ts`, step "Run, monitor, or hand over" | APPROVE |
| b6 | "For a Fortune 500 high-tech company, Lanshore replaced a manual transfer of commission data between financial systems and the CRM with an automated integration that validates every transfer, removing the dependency on the few people who knew the steps." (verbatim) | guide "How Lanshore helps" | `enterprise-crm-erp-integration.ts`, FAQ "Can Lanshore integrate our existing SPM platform without replacing it?" | APPROVE |
| b7 | Lanshore implements CaptivateIQ and Performio | mid-market FAQ (a12); platform FAQs | `spmPlatforms.ts` (both entries); `/about/partners` ("Implementation partnership" for CaptivateIQ, "Implementation and support partnership" for Performio). The new copy uses only "implements"; no partner tier or certification wording. | APPROVE |
| b8 | "Also supported through our partner network" (Oracle, beqom, Forma.ai, from `NEAR_MISS_VENDORS`) | **Not used in WP1 copy.** Logged as the plan requires so Doug can confirm or strike it sitewide; WP2's rec 4 post will reuse it. | `src/app/spm/compare/page.tsx:57,179`; `src/app/spm/page.tsx:98` | APPROVE |
| b9 | "A person still approves anything that affects pay." | guide "Where platforms and agents fit" | `enterprise-crm-erp-integration.ts` FAQ "How do AI agents fit into SPM integrations?" ("A person approves anything that affects pay.") | APPROVE |
| b10 | **Incentivate is described two ways on the live site** (inconsistency, not WP1 copy): `/spm` (`src/app/spm/page.tsx:97-99`) says "legacy estates on Iconixx and Incentivate" are supported through the partner network, while `SPM_PLATFORMS` has a full Incentivate implementation entry ("Lanshore implements Incentivate, runs comp operations on it"). WP2's rec 4 will use the `SPM_PLATFORMS` position (implements) unless Doug decides otherwise. | `/spm`, `/spm/incentivate` | as stated | APPROVE |
| b11 | (WP2) **OQ9 wording change.** Rec 2 Lanshore entry: "...took over a telecom provider's error-prone Excel commission process as a managed service and sharply reduced the calculation errors without new headcount" (was "eliminating frequent calculation errors"). Case study `results[0]`: "Frequent calculation errors sharply reduced" (was "Frequent calculation errors eliminated"), plus `dateModified: "2026-10-12"`. Confirmed in the build: the case-study page and `caseStudySchema().abstract` both carry the new wording, and "eliminated" no longer appears on that page. | `content/case-studies/managed-services-commission-management.json` (the rec 2 sentence no longer exists: Doug's replacement post drops it, so this row now covers the case study only) | Owner decision OQ9 (plan section 7) | APPROVE |
| b12 | (WP2) "supported through our partner network" for Oracle, beqom and Forma.ai (b8 wording, **now used**) | Rec 4 post: "How we compared", relationship disclosure, FAQ "Does Lanshore resell any of these platforms?", the "Lanshore relationship" column (3 cells), and the "Watch out for" line of each of the three sections. The wording is exact, with nothing stronger. If Doug strikes it, the publish step removes it from the rec 4 post as well as from `/spm` and `/spm/compare` (plan section 9). | `src/app/spm/compare/page.tsx:57,179`; `src/app/spm/page.tsx:98` | APPROVE |
| b13 | (WP2) Incentivate relationship = "Implements" (the `SPM_PLATFORMS` position, per b10 and the plan's "Still open" bullet) | Rec 4 relationship column, disclosure and FAQ; Incentivate section links `/spm/incentivate` | `spmPlatforms.ts` incentivate entry; the tension with `/spm` "legacy estates on Iconixx and Incentivate" is still open under b10 | APPROVE |
| b14 | (WP2) Lanshore implements nine platforms and resells none (named list) | Rec 2 Lanshore entry (unchanged sentence); rec 4 disclosure and FAQ | b2 origins; `spm-consulting.ts` FAQ "Does Lanshore sell SPM software?" | APPROVE |
| b15 | (WP2) "For PepsiCo, Lanshore delivered a multi-country sales incentive rollout covering more than 20 countries and a dozen currencies on one plan framework with local variants." (verbatim) | Rec 2 Lanshore "Consulting scope" | b3 origin (`global-compliance.ts`) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| b16 | (WP2) Retained unchanged in rec 2: "15+ years of SPM delivery from the US and Latin America"; the managed-services fee quote; the agent audit-log sentence; the national telecom carrier 74 percent close-time and about 400 to about 100 exceptions sentence | Rec 2 Lanshore entry | Already published in this post (lines unchanged by WP2); the fee quote is verbatim from `src/app/services/page.tsx` | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| b17 | (WP2, added by Lead after cold review pass 4) **"Not published" pricing cells for Akeron, beqom, Oracle and SAP Incentive Management.** No pricing-page check is logged for these four. The post now defines "Not published" as "we did not find it on the vendor pages we reviewed", and the FAQ says "The other ten do not list a price on the pages we reviewed". Doug: approve the hedged wording, or ask for a pricing-page check before publish. Lead wording edits in the same pass: Xactly "proven scale" became "stated scale"; Incentivate "deployment flexibility that SaaS rarely does" became "deployment options beyond SaaS" (both had no source). | rec 4 table, FAQ, "How we compared" | plan section 3.5 evidence rule | APPROVE |

## (c) Proposed proof points (not written into copy)

Nothing below is on the site. Each row gives the exact proposed sentence and where it would go. Bracketed slots need owner-supplied facts. Where a row reuses an existing published claim, its origin is named. Those claims were kept out of the WP1 copy because they are not in the plan's reusable set or do not fit the page exactly.

| # | Insertion point | Proposed sentence | Notes | Decision |
|---|---|---|---|---|
| c1 | `quota-incentive-alignment.ts`, end of step "Configure crediting in the platform" | "For a [industry] company, Lanshore rebuilt crediting from the same territory master the quotas used, and crediting disputes fell from [X] to [Y] per quarter." | Needs a real engagement and figures. No published Lanshore claim covers quota and incentive alignment results. **Applied 2026-10-13 as a method statement (user chose: reword without results, no invented figures):** "Any crediting variance found in that testing is traced to its cause, whether the territory master, the roster, or a rule, and fixed before the first live payout." Inserted after "test them against expected results before go-live". Source: that sentence plus the published "trace every variance to a cause before cutover" (`spmPlatforms.ts` FAQs, `global-compliance.ts`). The results version still needs real figures. | APPROVE |
| c2 | `sales-finance-misalignment.md`, end of "Where platforms and agents fit" | "At one national telecom carrier, Lanshore reports that agent-run cycle steps cut monthly close time by 74 percent and exceptions worked by hand per cycle from about 400 to about 100." | Already published (`best-spm-service-partners-compared.md:240` in Doug's replacement post). Held back because it measures the commission-cycle close, not the finance close, and the guide is about the gap between sales and finance. **2026-10-13:** not inserted. As written it merges two separate results (the 74 percent close and the 400-to-100 crediting-check figure), which rec 2 now states as two sentences; any future use needs that corrected wording. | APPROVE |
| c3 | `spm-consulting.ts`, end of step "Audit-ready analytics" | "For one insurance client, the month-end comp close went from twelve business days to five after the engagement, and the next external audit cycle had no findings on incentive compensation, down from two the prior year." | Already published in `content/blog/enterprise-spm-consulting-audit-ready-analytics.md:197` but not in the plan's section 3.6 reusable set, so it needs owner approval before use on a solution page. **2026-10-13:** approved, not inserted (the user chose method statements only for this round). | APPROVE |
| c4 | `spmPlatforms.ts`, captivateiq or performio spreadsheet FAQ, final sentence | "For a [industry] company with [N] payees on [N] plans, Lanshore moved commissions from spreadsheets to [CaptivateIQ \| Performio] in [N] weeks, including one parallel-run cycle." | Needs an engagement that actually ran on that platform. The spreadsheet case study does not name its platform and must not be connected to either one (plan section 3.6). **2026-10-13:** no method statement added. Both FAQs already state the method (inventory, rebuild, roster and history, at least one full parallel cycle with every variance traced, 10 to 14 weeks across platforms), so a method version would repeat them. The results version still needs a real engagement. | APPROVE |
| c5 | `spm-consulting.ts`, problem "Global plans whose controls cannot be evidenced country by country" | "In one [N]-country program, Lanshore found [describe the evidence gap] before the external audit, and [result]." | Needs a real engagement. PepsiCo is the only named global program, and its published claim says nothing about audit evidence. **Applied 2026-10-13 as a method statement (user chose: reword without results):** "Our global work starts by recording, country by country, how approvals, plan acknowledgments, and adjustments are evidenced today, so each gap is known before the next audit." Appended to the problem body. Source: `global-compliance.ts` assessment step ("record how each country actually processes incentives: ... approval steps, acknowledgment practice"). The results version still needs a real engagement. | APPROVE |

## (d) Competitor and vendor claims

Retrieved 2026-10-12. Quotes are taken from the page text, read from the raw HTML with tags stripped (not from a fetch-tool summary).

| # | Vendor | Quote (verbatim) | URL | Page date | Used on site as | Decision |
|---|---|---|---|---|---|---|
| d1 | CaptivateIQ | "CaptivateIQ Agents are available now in limited beta, with broader access rolling out throughout the year." | https://www.captivateiq.com/blog/top-10-moments-of-captivate-2026 | 2026-05-26 | `spmPlatforms.ts` captivateiq `positioning` and `aiFeatures[0]`: "launched in limited beta in May 2026 with broader access rolling out through the year" | APPROVE |
| d2 | CaptivateIQ | "The Revenue Planning Agent is now generally available across Sales Planning." | https://www.captivateiq.com/blog/whats-new-september-2026 | 2026-09-09 | captivateiq `positioning` and `aiFeatures[0]`: "the Revenue Planning Agent became generally available in September 2026" (**new**) | APPROVE |
| d3 | CaptivateIQ | Section label "Coming Soon" above "CaptivateIQ MCP Server", with the text "The CaptivateIQ MCP Server gives AI platforms like Claude and ChatGPT secure, governed access to your live compensation and planning data." | https://www.captivateiq.com/ai-agents | not dated (retrieved 2026-10-12) | captivateiq `positioning`, `aiFeatures[1]` and FAQ 2: "lists an MCP server ... as coming soon" (**changed** from "announced; general availability planned for later in 2026"). Matches the existing "CaptivateIQ lists its MCP server as coming soon" in `enterprise-crm-erp-integration.ts` and `ai-agents-sales-operations.ts`, which were already accurate and are unchanged. | APPROVE |
| d4 | CaptivateIQ | "Native MCP support coming soon." | https://www.captivateiq.com/blog/whats-new-at-ciq-july-2026 | 2026-07-29 | Corroborates d3. The September 2026 post does not mention MCP. | APPROVE |
| d5 | Performio | "The Performio MCP Server introduces the first implementation of the open Model Context Protocol in the ICM industry, enabling users to interact with Performio directly through their trusted AI tools, like Claude Desktop or Salesforce Agentforce." | https://www.performio.co/news/performio-launches-ai-icm | 2025-10-23 | Supports the existing site claim "first MCP server in the ICM category" (unchanged). **Note for Doug:** this is Performio's own claim, and the site states it as fact without attribution. Consider "Performio describes its MCP server as the first in the ICM category". | APPROVE |
| d6 | Performio | Heading "First MCP Server", subtext "built specifically for sales compensation"; also "What you can do with the MCP Server: Trigger calculations from any MCP-enabled AI tool" | https://www.performio.co/capabilities/ai | not dated (retrieved 2026-10-12) | Confirms the MCP server is a current product (unchanged site wording). | APPROVE |
| d7 | Performio | "...today announced measurable customer results from its AI Implementation Agents, which are now compressing ICM configuration timelines from months to weeks." and "...extending AI Implementation Agent capabilities beyond internal consultant productivity to building live customer environments." | https://www.performio.co/news/performio-cuts-icm-implementation-timelines-from-months-to-weeks-with-ai-agents | 2026-06-18 | Supports the existing "AI Implementation Agents that accelerate configuration" (unchanged). **Nuance:** the agents are used by Performio's delivery teams during implementation and are not a customer-operated feature. The `/spm/performio` wording does not claim otherwise. | APPROVE |

**WP2 rows (d8 onward).** All retrieved 2026-10-12. Unless a row says otherwise, the page was fetched with curl and its raw HTML read with tags, scripts and styles stripped, so quotes are page text, not a summary. Exceptions:
- **Blue Horizons Group and Cordion:** read through the `r.jina.ai` text reader. Blue Horizons returns HTTP 403 to direct requests, and Cordion's homepage is script-rendered.
- **Deloitte:** a PDF, read with `pdftotext`.
- **WorkCentive:** its partner list is three logo images (Varicent, Performio, CaptivateIQ) under the heading "Trusted Partners we Support". The images were downloaded and read visually.

"n.d." means the page carries no date. Where a source uses an em dash, it is shown as " - " so this file stays in house style.

| # | Entity | Quote (verbatim) | URL | Page date | Used on site as | Decision |
|---|---|---|---|---|---|---|
| d8 | (WP2) Ackle Consulting Group | "Ackle is a consulting and software firm. We design how revenue teams are paid, govern the data behind the numbers, and build the AI software that runs it." / "ICM implementations - Xactly, Varicent, SAP SuccessFactors, CaptivateIQ, Oracle" / "Managed services & comp administration" / "Monthly close, plan changes, disputes and reporting handled by people who built the system." / "Managed Services · retainer" / "Comp plan design, modeling & cost-of-plan analysis" / "CRM ↔ ERP ↔ HR ↔ ICM integration" / "Executive reporting & BI for revenue and finance" / "AI assistants & agents for comp, ops and finance teams" / entry points "Assess", "Design", "Implement", "Run", "Build" / case study "Standardizing performance metrics across regions" | https://www.ackleconsulting.com/ | n.d. | Rec 2 section 1, both table rows | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| d9 | (WP2) Blue Horizons Group | "The SPM Specialist Firm Built for Business evolution" / "With 300+ incentive compensation management implementations and 200+ years of combined SPM expertise, we partner with you through the entire journey - from advisory through implementation, enablement, and managed services" (home) / "SPM platform implementations for global organizations." / "Utilizing our proprietary Blue Accelerate™ technology, implementation time can be dramatically reduced" (implementation) / "Rapid access to domain and technical experts for timely resolutions." / "Guidance on best practices, system upgrades and new capabilities." / "Training and support for platform during and after vendor support contract term." / "Health check to drive SPM system efficiencies." (managed services) / "Plan audits, data quality reviews, calculation accuracy checks" / "Design or redesign compensation mechanics and structure" / "Build fair, credible quota methodologies" / "Design territories and quotas that balance fairness and opportunity" / "Guide platform selection and vendor negotiation" / "Prepare to leverage AI and advanced analytics" (advisory) / partners page logos: Varicent, Xactly, CaptivateIQ | https://bluehorizonsgroup.com/ ; /implementation-services/ ; /managed-services/ ; /advisory-services/ ; /partners/ | home 2026-05-18; implementation and managed services 2026-05-20; advisory 2026-05-18; partners 2026-09-15 (WordPress timestamps) | Rec 2 section 2, both table rows ("AI readiness as part of advisory" rests on the last advisory quote) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| d10 | (WP2) Canidium (re-verified) | "a team of experts dedicated to maintaining and optimizing your software solutions" / "Benefit from a proactive approach to maintenance and support that identifies and addresses potential problems before they impact your business" (managed services) / "We design and operationalize the compensation plans, integrating them into your systems (ICM/SPM software if used) and ensuring clear administration." (design) / "By implementing the right data integration, we'll help you minimize data silos and reduce processing times." (data) / "Through interviews, workshops, and documentation review, we assess your requirements to identify the key objectives of the SPM implementation." / "This may involve mapping out current workflows, defining new processes, and creating a roadmap for the implementation." (SPM) / software-partner anchors on the home page: SAP, Xactly, Varicent, Pricefx, Salesforce, AgentSync; nav also lists technical health checks, annual sales plan readiness, staff augmentation | https://www.canidium.com/ ; /managed-services ; /sales-compensation-design ; /data-management-and-reporting ; /sales-performance-management | n.d. | Rec 2 section 3 (existing text re-verified, "Consulting scope" new); global cell "Not published" | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| d11 | (WP2) Delbridge Solutions (re-verified) | Partner list on the SPM page: "Anaplan", "InfinitySPM", "Latitude39", "Xactly" (no Varicent, SAP or CaptivateIQ) / "We help organizations define the right SPM strategy through assessments, process design, and platform guidance." / "From model design and data integration to workflow configuration and enablement, we deliver end-to-end SPM implementations" (SPM) / "Document plan logic, integrations, and operational procedures so critical knowledge does not leave with a single admin or implementation partner." / "clear SLAs and escalation paths" (managed services) / "Delbridge is a boutique consulting powerhouse with a global network of industry experts." / "Catalin runs Delbridge's European operations" (about) | https://delbridge.solutions/Solutions/sales-performance-management/ ; /spm-managed-services/ ; /about-delbridge/ | n.d. | Rec 2 section 4 | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| d12 | (WP2) Deloitte (re-verified) | "For many of our clients, we provide ongoing support of their Anaplan systems and support ongoing enhancements for a very competitive price." / "Deloitte has successfully delivered more than 1000 Anaplan projects" / "While we have Anaplan practices in over 35 countries" / "We have in-market Anaplan capabilities in the majority of the countries where our clients do business. This allows us to provide the full spectrum of development and deployment services." / joint solutions incl. "Incentive compensation planning and management", "Territory planning and management", "Quota planning analytics and management", "PrecisionView predictive analytics" | https://www.deloitte.com/content/dam/assets-zone3/us/en/docs/alliances/2026/anaplan-deloitte-alliance-one-pager-may-2026.pdf | May 2026 (file name) | Rec 2 section 5 | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| d13 | (WP2) IncentiveOps (re-verified) | "designs and runs sales compensation systems" (home) / "Every pay period, IncentiveOps runs the full calculation cycle - data validation, calculation execution, output review, anomaly detection, and approval documentation." / "resolved within a defined SLA" / "$12,000" and "$18,000" monthly range / "Have 30 or more quota-carrying sellers" (fractional) / "IncentiveOps runs structured, phase-based ICM implementations and compensation infrastructure redesigns." / "Data integration is scoped and validated before configuration begins." / "Every IncentiveOps implementation follows a three-phase structure: Assessment, Build, and Launch." / "Most implementation engagements run ten to sixteen weeks from assessment through launch." (implementation) / "The portfolio includes more than 100 incentive plans designed or redesigned, seven ICM platforms implemented or owned in production" (about; platforms not named) | https://www.incentiveops.com/ ; /fractional-sales-comp-management ; /implementation-structural-redesign ; /about | n.d. | Rec 2 section 6 | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| d14 | (WP2) OpenSymmetry (re-verified) | "monitoring and functional support to our clients 24 hours a day, 7 days a week, 365 days a year" / "dual-shore" (managed services) / "AI-enabled implementation approach" (home) / supported technologies: Akeron, Anaplan, CaptivateIQ, NICE, Oracle, Performio, Sales Cookie, SAP Sales Performance Management, Spiff, Varicent, Xactly (eleven) / "Incentive Compensation Plan Design" (strategy services nav) / "Our holistic approach and 5C's framework to SPM integration guide you to a future-state roadmap" / "Every OpenSymmetry delivery project now includes the creation of a future state solution roadmap and operating model, and a Test Strategy to guide customers in testing their solution." / "worldwide base of skilled resources supports globally distributed clients and project teams" (implementation) / "OpenSymmetry's Global Offices: USA, UK, and India" (locations) | https://www.opensymmetry.com/ ; /services/managed-services/ ; /partners/spm-solutions/ ; /services/ ; /services/solution-deployment/sales-performance-management-spm-implementation/ ; /about/locations/ | n.d. | Rec 2 section 8 | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| d15 | (WP2) Spaulding Ridge (re-verified) | "Spaulding Ridge helps modern enterprises design and refine Sales Performance Management (SPM) systems" / "Spaulding Ridge approaches sales execution as a continuous, data-driven cycle that connects market opportunity, capacity planning, territory design, and quota alignment into a unified operating model." / "Our sales information model delivers a framework for collecting, reporting, and analyzing sales information." / platform links on the SPM page: Anaplan, Salesforce (SPM) / "single point of contact" (managed services) / "lead-to-cash", sales coaching (AI) / "Accelerate Your Business with Expert Agentforce Implementation" (Agentforce) / "Our international presence allows us to lead with a global perspective and follow the sun with our clients." (about). Fetched with curl; node's fetch got Cloudflare 403. The www URLs now redirect to the apex domain. | https://www.spauldingridge.com/business-transformation/sales-performance-management/ (and /managed-services/, /ai-powered-services/, /cloud-application-technologies/salesforce/agentforce) ; https://spauldingridge.com/about-us | n.d. | Rec 2 section 9 | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| d16 | (WP2) WorkCentive (re-verified) | "We manage your post-go live opportunities and changes." / "Toronto, ON" (home) / "If you need one-time help or ongoing support" / "Deciding whether to "Save" or "Scrap" an existing implementation?" (managed services) / partner logos Varicent, Performio, CaptivateIQ (about) / "Each of our implementations have dedicated consultant support." / "Our implementation process includes a dedicated training schedule that enables user empowerment before, during, and after implementation." (implementations) / "Our team conducts thorough assessments of incentive plans, evaluating key aspects such as design, effectiveness, performance, benchmarking, and quota setting accuracy." / "Beyond core incentive plan creation, we provide expertise in creating bonus and SPIF (Sales Performance Incentive Fund) program structures." / "We also offer custom-built reporting tools" (consulting) / revenue intelligence and cost analysis, performance management analytics (analytics) | https://www.workcentive.com/ ; /managed-services ; /about-us ; /implementations ; /business-consulting ; /analytics | n.d. | Rec 2 section 10 | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| d17 | (WP2) Argano | "With a focus on technical architecture, AI-forward process design, and the integration of revenue management and sales performance tools such as Salesforce , Xactly, SPIFF, Varicent, SAP , Anaplan , and Pigment, Argano enables your business to inform, plan, optimize, and reward seller performance." | https://argano.com/what-we-do/performance-consulting/sales-performance-management/ | n.d. | Rec 2 "Other firms that qualify" | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| d18 | (WP2) Composed Comp Group | "We design and build compensation plans inside CaptivateIQ that actually reflect how your business works, not from a template" / "A dedicated commissions team without the overhead; we run your CaptivateIQ environment month after month" | https://composedcomp.com/ | n.d. | same | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| d19 | (WP2) Cordion | "We design, deploy, and support comp that fits how your business actually works" / "White-glove implementation of CaptivateIQ and adjacent platforms, built to absorb plan changes without re-architecture." | https://www.cordion.io/ | n.d. | same | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| d20 | (WP2) InnoVyne | Services navigation: "Implementation Services", "Managed Services", "SPM Administration Support"; "InnoVyne is a leader in Sales Performance Management solutions" | https://innovyne.com/ | n.d. | same | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| d21 | (WP2) McAlign | "Sales performance management software implementation" / "Continuous improvement and strategy adjustment" / "Regular performance reports and insights" | https://www.mcalign.com/ | n.d. | same | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| d22 | (WP2) OnCentive | "The platforms we implement, migrate, and operate." followed by Xactly, CaptivateIQ, Spiff, Varicent, Oracle, incentX, Performio, QuotaPath, Everstage, Centify, Qobra, Variabl, Visdum / "Most partners hand off at go-live. We stay on the system while it is paying people." | https://oncentive.io/ | n.d. | same | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| d23 | (WP2) Outliers Consulting | "As technology-agnostic integrators, we implement effective solutions such as Sales Performance Management (SPM), Enterprise Performance Management (EPM), Customer Experience (CX), among others" / "Our support service is not only dedicated to solving technological challenges, but also focuses on ensuring that businesses thrive after implementation." | https://www.outliersconsulting.com/en/home/ | n.d. | same | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| d24 | (WP2) RCI | Two case-study headings on the home page about Varicent implementations, in Portuguese ("Como a implementação de Varicent..." and "Como a implementação do Varicent na gestão de incentivos de vendas..."). | https://www.rciit.com/ | n.d. | same ("Publishes Varicent implementation case studies") | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| d25 | (WP2) SANDS Partners | "ICM/SPM implementations We help to implement ICM and SPM systems" / "System Optimization Optimization of existing implementations" / "The core of our services revolves around implementing ICM/SPM solutions comprehensively and end-to-end" | https://sandspartners.com/ | n.d. | same | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| d26 | (WP2) SpectrumTek | "Seamlessly Implement, Integrate And Roll Out Your SPM Software." / "Enhance Sales Compensation Operations With End-to-end Post-Implementation Managed Services." | https://spectrumtek.com/ | n.d. | same | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| d27 | (WP2) The LC Firm | "Offering automated sales compensation solutions tailored to the unique needs of companies of all sizes, leveraging CaptivateIQ, Varicent, Xactly, and SAP Commissions." / "Customers who want to outsource sales compensation so they can focus on other important aspects of their business." | https://www.thelcfirm.com/ | n.d. | same | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| d28 | (WP2) Voiant | "From strategy and implementation to training and managed services, our focus is on providing tangible value and maximizing your return on investment." / client quote naming "Sales Performance Management program" on Anaplan | https://voiantgroup.com/ | n.d. | same | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| d29 | (WP2) The Alexander Group (re-verified) | "Recognized as the experts in sales compensation, our consultants partner with our clients to assess, align, design and implement robust sales compensation programs." The page offers no SPM platform implementation or support service. | https://www.alexandergroup.com/capabilities/sales-compensation/ | n.d. | Rec 2 "Not listed" | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| d30 | (WP2) Korn Ferry (re-verified) | "Through carefully-constructed compensation plans , we help to incentivize your salespeople..." / "Our fully CRM-integrated technology provides reliable data" (its own Korn Ferry Sell tooling). The page offers no SPM platform implementation or support service. | https://www.kornferry.com/capabilities/business-transformation/sales-effectiveness/sales-consulting | n.d. | same | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| d31 | (WP2) Varicent (vendor-owned services) | "Partner with Varicent Technical Experts to complete your implementation" / "transition smoothly to Customer Care for ongoing support" | https://www.varicent.com/solutions/services | n.d. | Rec 2 "Not listed" (example of a vendor-owned services team) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| d32 | (WP2) Partner directories (discovery only) | Varicent: "Our partners provide best-in-class application extensions, portfolio strategy consulting, and systems integration" plus the services-partner list. Xactly: "SI Partners" list. CaptivateIQ: "Meet our implementation partners" plus the list. **Note for Doug:** Varicent's directory carries a stale Lanshore blurb ("operating in EMEA for 8 years", "over 100 sales performance management implementations in the past year alone"). It is not used anywhere on lanshore.com, but it is worth asking Varicent to update it. | https://www.varicent.com/company/partners ; https://www.xactlycorp.com/company/partners ; https://www.captivateiq.com/partners | n.d. | Rec 2 "How we compared" (discovery) and the "not assessed" sentence | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| d33 | (WP2) Akeron (Vulki) | "Leverage a powerful calculation and simulation engine to manage commissions, bonuses, contests, and spiffs of any complexity." / "Modern no-code ETL with pre-built connectors to any enterprise system." / "Automated accruals, forward-looking cost projections, and full audit trails." / Akyba: "...where domain-specific agents operate on certified data, within defined rules, and with full human oversight." (the post quotes only "within defined rules, and with full human oversight") | https://www.akeron.com/vulki/en/sales-performance-management/ ; https://www.akeron.com/en/ | n.d. | Rec 4 section 1 and table | APPROVE |
| d34 | (WP2) Anaplan | "Design, align, and scale incentives across hundreds of plans, thousands of payees, and millions of transactions." / "Connect and integrate planning data from any source" / "Combine security, governance, and intuitive useability in one scalable platform" (sic). No pricing page: `/pricing/` redirects to the contact page. | https://www.anaplan.com/solutions/sales-revenue-performance-management/ | n.d. | Rec 4 section 2 | APPROVE |
| d35 | (WP2) beqom | "We've been working with the world's largest organizations on compensation and performance challenges for more than a decade." (home) / "Easily manage complex, multi-KPI bonus structures and dynamic payout curves." / "Deploy sales bonuses faster, reduce plan creation time, and deliver clear incentive statements to keep your team motivated." / "Bring salary and variable incentives together into a single, audit-ready ecosystem for a single source of truth." / "Control who can view, edit, or sign off at every stage of the timeline without losing speed." / "Effortlessly connects with your existing HRIS, payroll, and business systems" (compensation management) | https://www.beqom.com/ ; https://www.beqom.com/products/compensation-management | n.d. | Rec 4 section 3 | APPROVE |
| d36 | (WP2) CaptivateIQ | "Take ownership of commissions with a solution built for the speed and scale of today's Enterprises." / "SmartGrid™ enables users to manage, model, and calculate their data in real-time, at scale, all with no code." / "Connect to the all the tools you need (CRM, ERP, HRIS, etc.) with our native connectors and APIs." (enterprise) / "undergoing annual independent audits for SOC 1 and SOC 2 compliance" (home) / "Seats are based on the number of admin users plus the total number of payees who will be managing their compensation on our platform." / "ASC-606 reporting is available as an add-on subscription." / "CaptivateIQ can be up and running in a matter of weeks instead of months" (pricing) / "Access CaptivateIQ's open API for custom integrations." (integrations) | https://www.captivateiq.com/enterprise ; https://www.captivateiq.com/ ; /pricing ; /data-integrations | n.d. | Rec 4 section 4 | APPROVE |
| d37 | (WP2) Forma.ai | "Forma.ai is AI-powered enterprise sales compensation software combining intelligent, data-driven sales planning with flexible incentive compensation - enabling go-to-market agility at scale." / "Our guided workflow makes configuring even the most complex plans fast and effortless." / "Maintain global compliance with audit-ready controls for approvals, validation, and regulatory adherence." / "Automate calculations, integrate seamlessly with HRIS/payroll" (home) / "Our one-time fee covers a comprehensive setup for a seamless experience" (pricing; no price shown) | https://www.forma.ai/ ; https://www.forma.ai/pricing | n.d. | Rec 4 section 5 | APPROVE |
| d38 | (WP2) Incentivate | "Effortlessly design complex incentive plans with our no-code sales commission software." / "With powerful built-in tools, you can process large volumes of data efficiently" / "Host Incentivate on your private cloud or on-premise infrastructure to retain complete control over your data and processes." (home) / "Incentivate starts at $15 per user per month" / "with implementations starting at $8,000" / "Final pricing depends on user count, plan complexity, data sources, workflow requirements, and reporting scope." (pricing) | https://incentivatesolutions.com/ ; https://incentivatesolutions.com/pricing/ | n.d. | Rec 4 section 6, price cells, FAQ | APPROVE |
| d39 | (WP2) Oracle | "Handle even the most complex and large-scale compensation plan structures, calculation rules, direct or overlay sales-credit allocation, and hierarchical roll-up rules." / "Leverage unified customer data along with full ERP and HCM integration for accurate compensation crediting." / "With out-of-the-box Oracle Payroll integration, incentive compensation payments can be seamlessly embedded into the payslip." The former `/cx/sales/incentive-compensation/` URL returns 404. | https://www.oracle.com/cx/sales/sales-performance-management/ | n.d. | Rec 4 section 7 | APPROVE |
| d40 | (WP2) Performio | "Ideal for organizations with 70+ commissionable employees and complex commission plans." / "Performio ingests sales commission and incentive data as-is from CRM, ERP, HRIS, and finance systems" / "Power global compensation programs with scale, security, and control" (home) / "Every Performio subscription includes the platform, 24/7 global support, training, and features to support admin efficiency and sales coaching." / "Subscription pricing scales with participants and selected capabilities, while implementation is a one-time cost." (pricing). The "Not ideal for: Simple, flat commission structures" list is still on the pricing page, so the spreadsheet post's claim still holds. | https://www.performio.co/ ; https://www.performio.co/pricing | n.d. | Rec 4 section 8 | APPROVE |
| d41 | (WP2) Salesforce Spiff | "Automate even the most intricate commission structures and nuances like accelerators, tiers, triggers, and more." / "Connect everything from CRM, ERP, HCM, payroll, or any other system" / "Maintain compliance under ASC 606 and IFRS 15 with automated, audit-ready expense reports." / "Set up incentive compensation plans in days, not weeks or months." (product) / "Incentive Compensation Management can be purchased as an individual SPM add-on for $75 per user, per month." / "We do not currently offer trial licenses for Salesforce Spiff" / "All per user products require an annual contract." (pricing) | https://www.salesforce.com/sales/incentive-compensation-management/ ; .../pricing/ | n.d. | Rec 4 section 9, price cells, FAQ | APPROVE |
| d42 | (WP2) SAP Incentive Management | "Design, model, and optimize highly flexible and complex incentive compensation plans, gain real-time insights, and motivate sales teams to perform at their best." / "Develop and distribute strategic incentive compensation plans at scale to drive the right sales outcomes for your global workforce." / "Resolve sales compensation inquiries in seconds with one-click traceability." / "Model, compare, test, and roll out new plans and promotions quickly without relying on IT." / "Maximize incentive compensation spend with prescriptive AI recommendations for plan optimization." **Note:** SAP now names the product "SAP Incentive Management" under CRM. The old HCM URL, which is `officialUrl` in `spmPlatforms.ts`, returns 404. | https://www.sap.com/products/crm/incentive-compensation-management.html | n.d. | Rec 4 section 10 | APPROVE |
| d42a | (WP2) SAP naming | Product page title "SAP Incentive Management" on sap.com regional product pages (e.g. https://www.sap.com/africa/products/crm/incentive-compensation-management.html); the App Store listing notes the name changed from "SAP SuccessFactors incentive Management" to "SAP Incentive Management". Re-checked by the Lead 2026-10-12. The rec 4 FAQ and disclosure now read "SAP SuccessFactors Incentive Management (now SAP Incentive Management)" so the extracted FAQ answer matches the list. | https://www.sap.com/africa/products/crm/incentive-compensation-management.html | 2026-10-12 | rec 4 H2, itemList, section 10, disclosure, FAQ | APPROVE |
| d43 | (WP2) Varicent | "Absolutely. Varicent is designed to support mid-sized to large enterprises with complex sales compensation needs, including multiple territories and quotas." / "The platform provides a complete audit trail of any changes to maintain data accuracy and compliance with industry standards." / "See exactly where your teams stand against their sales goals with role-level dashboards" / "Its comprehensive analytics, quota planning, and territory optimization features..." No pricing page (`/pricing` returns 404). | https://www.varicent.com/products/commission-software ; https://www.varicent.com/ | n.d. | Rec 4 section 11, FAQ | APPROVE |
| d44 | (WP2) Xactly | "Incent handles the most complex calculations with the ability to add tens of thousands of payees, process billions of transactions every month, and quickly add new data sources when needed." / "ensure compliance with ASC 606 and IFRS 15 standards" / "Relieve your administrators with data integration from CRM, ERP, and HCM software" / "have a complete audit trail to back it all up" (Incent) / "Pricing depends on how many people you're paying and how complex your plans are." (pricing) | https://www.xactlycorp.com/products/xactly-incent ; https://www.xactlycorp.com/pricing | n.d. | Rec 4 section 12, FAQ | APPROVE |

## (e) Firm survey and vendor inclusion verdicts

WP1 has none. The WP2 rows follow.

### (e1) Rec 2 firm survey (WP2)

**Rule (OQ6).** The firm's own site publishes SPM platform implementation services, post-implementation support services, or both. Plan-design-only consultancies and vendor-owned services arms are excluded and named.

**Discovery sources:**
- (a) the 8 firms already listed;
- (b) the competitor pages HubSpot cites. **The full list is not available; the known firms are Varicent, OpenSymmetry, Spaulding Ridge and Deloitte**, out of about 30 competitor and analyst pages;
- (c) the partner directories of Varicent (services partners plus highlights), Xactly (SI partners) and CaptivateIQ (implementation partners), retrieved 2026-10-12.

**Cap and tie-break (deviation from plan section 7 "Still open", approved by the Lead on 2026-10-12).**
- The 8 firms already listed are grandfathered. This is consistent with the section 6 mitigation "Keep the existing table". Each one was re-verified live and still meets the rule (rows d10 to d16 and the existing sources).
- The 2 remaining places went to assessed firms that publish both implementation and post-implementation services, then firms on the HubSpot list (all already listed), then alphabetical order. Result: Ackle Consulting Group and Blue Horizons Group.
- Argano comes before Blue Horizons alphabetically, but its SPM page describes implementation (integration) only. Accenture comes first alphabetically but was not shown to qualify (see below).
- Other qualifying firms are named one line each under "Other firms that qualify". Firms not assessed, or whose pages did not show the service, are not named in the post. One sentence covers them and links the three directories.

| # | Firm | Found via | Verdict | Reason (from the firm's own page; quotes in table d) | Decision |
|---|---|---|---|---|---|
| e1 | Ackle Consulting Group | Xactly, CaptivateIQ directories | **Listed (cap place 1)** | Implementation and managed services both published (d8) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e2 | Blue Horizons Group | Varicent, Xactly, CaptivateIQ directories | **Listed (cap place 2)** | Implementation and managed services both published (d9) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e3 | Canidium | existing; Varicent, Xactly directories | **Listed (grandfathered, re-verified)** | Implementation and managed services (d10) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e4 | Delbridge Solutions | existing | **Listed (grandfathered, re-verified)** | Implementation and managed services (d11) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e5 | Deloitte (Anaplan alliance) | existing; HubSpot list; Varicent highlight | **Listed (grandfathered, re-verified)** | Deployment services and ongoing support (d12) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e6 | IncentiveOps | existing | **Listed (grandfathered, re-verified)** | ICM implementation and fractional operations (d13) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e7 | Lanshore | existing | **Listed (grandfathered; Lanshore's own pages only)** | Implements and operates nine platforms | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e8 | OpenSymmetry | existing; HubSpot list; Varicent, CaptivateIQ directories | **Listed (grandfathered, re-verified)** | Deployment and managed services (d14) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e9 | Spaulding Ridge | existing; HubSpot list | **Listed (grandfathered, re-verified)** | Designs, implements and supports; managed services (d15) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e10 | WorkCentive | existing; Varicent directory | **Listed (grandfathered, re-verified)** | Implementations and managed services (d16) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e11 | Argano | Xactly directory | Also qualifying (cap) | Implementation (integration of SPM tools) on its SPM page; no SPM-specific post-implementation service there (d17) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e12 | Composed Comp Group | CaptivateIQ directory | Also qualifying (cap) | Both (d18) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e13 | Cordion | CaptivateIQ directory | Also qualifying (cap) | Both (d19) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e14 | InnoVyne | all three directories | Also qualifying (cap) | Both (d20) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e15 | McAlign | CaptivateIQ directory | Also qualifying (cap) | Both (d21) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e16 | OnCentive | CaptivateIQ directory | Also qualifying (cap) | Both (d22) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e17 | Outliers Consulting | Varicent, CaptivateIQ directories | Also qualifying (cap) | Both (d23) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e18 | RCI | Varicent directory | Also qualifying (cap) | Implementation (case studies) (d24) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e19 | SANDS Partners | all three directories | Also qualifying (cap) | Both (d25) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e20 | SpectrumTek (listed as "Spectrum" by Xactly) | Xactly, CaptivateIQ directories | Also qualifying (cap) | Both (d26) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e21 | The LC Firm | CaptivateIQ directory | Also qualifying (cap) | Both (d27) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e22 | Voiant | Varicent directory | Also qualifying (cap) | Both (d28) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e23 | The Alexander Group | existing "Not listed" | Not listed (named) | Plan design and sales compensation consulting, no SPM platform service (d29) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e24 | Korn Ferry | existing "Not listed" | Not listed (named) | Sales consulting on its own tooling, no SPM platform service (d30) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e25 | Varicent professional services | HubSpot list (Varicent) | Not listed (named as the example vendor-owned arm) | Vendor-owned services, not an independent partner (d31) | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e26 | Accenture, KPMG, Cognizant, Celfocus, EPAM NEORIS, Silamir (formerly Polarys), CBTW (formerly Positive Thinking; unnamed on Varicent's page), Relanto, TEC360, FintechPath (unnamed on Varicent's page), ProcDNA, ReGed | Varicent, Xactly, CaptivateIQ directories | Not named in post ("not assessed" sentence) | The homepage or page we fetched does not describe an SPM platform implementation or support service. We did not search these sites in depth. For Accenture, a site search found only job postings, not a service page. | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e27 | DataBlue, Netpartners, Smart Tech Inc., Tesys21 | Varicent directory | Not named in post ("not assessed" sentence) | The fetched page shows a Varicent resale or relationship (Greek, Portuguese and Spanish-language pages for three of them) but does not clearly describe implementation or support services. Not assessed further. | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e28 | ZINKT | Xactly directory | Not named in post | Sells its own Salesforce-native commission software, so it is treated as a vendor | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |
| e29 | ZS | Linked in CaptivateIQ's page HTML but not shown in the visible partner list | Not assessed | Not visibly listed | SUPERSEDED (Doug's rec 2 replacement, 2026-10-13; see section (r2)) |

### (e2) Rec 4 vendor inclusion verdicts (WP2)

**Rule (plan section 3.7).** The vendor's own product, pricing or customer-segment pages state that the platform serves enterprise-scale organizations or complex incentive plans. The stating sentence is recorded below and in table d. Verdict: **all 12 qualify**, so the post has 12 sections and "Not listed" is empty.

| # | Platform | Relationship (rec 4 column) | Pre-retrieval expectation | Verdict | Stating sentence (verbatim) | Decision |
|---|---|---|---|---|---|---|
| e30 | Akeron (Vulki) | Implements | likely in | **In** | "Leverage a powerful calculation and simulation engine to manage commissions, bonuses, contests, and spiffs of any complexity." | APPROVE |
| e31 | Anaplan | Implements | likely in | **In** | "Design, align, and scale incentives across hundreds of plans, thousands of payees, and millions of transactions." | APPROVE |
| e32 | beqom | Supported through our partner network | likely in | **In** | "We've been working with the world's largest organizations on compensation and performance challenges for more than a decade." and "Easily manage complex, multi-KPI bonus structures and dynamic payout curves." Note: total-compensation suite; sales incentives are one part (stated in Watch out for). | APPROVE |
| e33 | CaptivateIQ | Implements | likely in | **In** | "Take ownership of commissions with a solution built for the speed and scale of today's Enterprises." | APPROVE |
| e34 | Forma.ai | Supported through our partner network | unknown | **In** | "Forma.ai is AI-powered enterprise sales compensation software..." | APPROVE |
| e35 | Incentivate | Implements (`SPM_PLATFORMS`) | unknown | **In** | "Effortlessly design complex incentive plans with our no-code sales commission software." | APPROVE |
| e36 | Oracle | Supported through our partner network | likely in | **In** | "Handle even the most complex and large-scale compensation plan structures..." | APPROVE |
| e37 | Performio | Implements | likely in | **In** | "Ideal for organizations with 70+ commissionable employees and complex commission plans." | APPROVE |
| e38 | Salesforce Spiff | Implements | unknown | **In (closest call)** | "Automate even the most intricate commission structures and nuances like accelerators, tiers, triggers, and more." Read as a complex-plan claim; no enterprise-scale sentence was found. Doug may prefer to move Spiff to "Not listed". | APPROVE |
| e39 | SAP Incentive Management | Implements | likely in | **In** | "Design, model, and optimize highly flexible and complex incentive compensation plans..." | APPROVE |
| e40 | Varicent | Implements | likely in | **In** | "Varicent is designed to support mid-sized to large enterprises with complex sales compensation needs, including multiple territories and quotas." | APPROVE |
| e41 | Xactly | Implements | likely in | **In** | "Incent handles the most complex calculations with the ability to add tens of thousands of payees, process billions of transactions every month..." | APPROVE |

## (r2) Rec 2 replacement rows (Doug, 2026-10-13)

Doug replaced the WP2 rec 2 draft with his own post, five graphics and the rows below (package `rec2-site-package`, received 2026-10-13). These rows replace a18, a19, b15, b16, d8 to d32 and e1 to e29, which are marked superseded above. The rec 4, case-study, `/spm/compare` and modernizing-guide rows (a20 to a22, b11 to b14, b17, d33 to d44, e30 to e41) are unchanged and still need decisions. Row text is Doug's; "**Lead 2026-10-13:**" notes record what live re-verification found and every wording change made to the post as a result.

### (r2-b) Reused Lanshore claims in rec 2


| # | Claim as written in rec 2 | Origin (live page) | Decision |
|---|---|---|---|
| b-r2-1 | Roughly 6 percent of the prior year's new-logo bonus dollars were overpayments (telecom example) | `/solutions/spm-consulting` | APPROVE |
| b-r2-2 | PepsiCo rollout across 20-plus countries and a dozen currencies | `/solutions/global-compliance` | APPROVE |
| b-r2-3 | Connecting 20-plus source systems for a Fortune 500 high-tech client | `/solutions/enterprise-crm-erp-integration` **Lead 2026-10-13:** origin says "more than 20 distinct source systems across our engagement history", not for one client; the Fortune 500 high-tech sentence is a separate claim. Post now reads "it cites more than 20 distinct source systems integrated across its engagements." | APPROVE |
| b-r2-4 | Nine platforms: Varicent, Xactly, CaptivateIQ, SAP SuccessFactors Incentive Management, Anaplan, Salesforce Spiff, Performio, Akeron, Incentivate | `src/lib/site.ts` PLATFORMS | APPROVE |
| b-r2-5 | Agent-run cycle steps cut monthly close time by 74 percent and exceptions worked by hand per cycle from about 400 to about 100 (national telecom carrier) | existing rec 2 post **Lead 2026-10-13:** origins: `spm-managed-services.ts` ("Cycle close time dropped 74 percent") and `ai-agents-sales-operations.ts` ("roughly 400 crediting exceptions a month ... the team touches around 100"). **Lead 2026-10-13 (cold review pass 5):** the draft joined two claims that have different scopes. The post now gives each one its own sentence: "after it implemented the platform and put agents on the monthly cycle steps, cycle close time dropped 74 percent against the pre-implementation baseline" (`spm-managed-services.ts`), and "a crediting-check agent at a national telecom carrier that cut the crediting exceptions the comp team works by hand from roughly 400 a month to around 100" (`ai-agents-sales-operations.ts`). The sources do not say it is the same carrier, so the post no longer implies that. **For Doug:** `best-ai-agent-consulting-firms-for-revops.md:136`, already live, gives a different second figure for the carrier ("disputes ... about 300 ... to about 120"). That is outside this change. | APPROVE |
| b-r2-6 | Every agent action is logged with timestamp, input, output, and approver where applicable | `/agentic-spm/operations` **Lead 2026-10-13 (cold review pass 5):** the post had dropped "where applicable"; the qualifier is restored. The fee is now linked to `/solutions/spm-managed-services` ("predictable monthly fee"), and the agents to `/agentic-spm/operations`. | APPROVE |
| b-r2-7 | 15+ years | sitewide **Lead 2026-10-13:** "15+ years" does not appear in the replacement post; nothing to approve unless it is added back. | APPROVE |
| b-r2-8 | PepsiCo named as a client | `/solutions/global-compliance` (verbatim reuse log: 1 mention, rec 2 Lanshore section and FAQ 4) | APPROVE |

Not reused in this draft: Grammarly, Micro Focus, PwC, "partner network", "partnership". The 10-to-14-week migration figure and the telecom close-time figure from the case study are not in rec 2.

### (r2-d) Competitor claims in rec 2


| # | Firm | Claim as used | Source URL | Retrieved | Decision |
|---|---|---|---|---|---|
| d-r2-1 | Ackle Consulting Group | Designs how revenue teams are paid, governs the data, builds the AI software that runs it; ICM implementations on Xactly, Varicent, SAP SuccessFactors, CaptivateIQ, Oracle; AI assistants and agents for comp, ops, and finance | https://www.ackleconsulting.com/ | 2026-10-12 | APPROVE |
| d-r2-2 | Ackle Consulting Group | Comp plan design, modeling and cost-of-plan analysis; "We configure, integrate (Connect, CRM, ERP, HRIS), test against real payout history and train your admins"; modeled against last year's actuals before anyone signs; retainer covers monthly close, plan changes, disputes, new-hire setup, executive reporting; founded 2015; teams of 50 to 5,000 sellers **Lead 2026-10-13 (cold review pass 5):** FAQ 2 no longer names Ackle as describing source-field mapping, pre-configuration validation or reconciliation, because its page says "configure, integrate (Connect, CRM, ERP, HRIS), test against real payout history". FAQ 2 now says that sentence instead. | https://www.ackleconsulting.com/services/sales-compensation | 2026-10-12 | APPROVE |
| d-r2-3 | Blue Horizons Group | Advisory: GTM strategy, incentive compensation plan design, solution selection, SPM readiness assessments; end-to-end implementation on a proprietary methodology; eight implementation elements incl. source system integration; on-demand support tied to comp calendar; Varicent in client testimonial (IDEXX); Louisville, KY **Lead 2026-10-13:** post now says the methodology "cuts project timelines" (site wording; was "shortens timelines"). Note: the site footer also carries a leftover template block with a New York address; the Louisville, Kentucky 40223 address is the real one in the body. **Lead 2026-10-13 (cold review pass 5):** the partners page (raw HTML, 2026-10-13) links implementation-partner pages for Varicent, Xactly and CaptivateIQ, which contradicts the draft line "does not publish a formal platform list". The post now names all three, and the platform-coverage graphic marks them ("partners page"). The page slugs contain the word "certified"; the post does not use it. | https://www.bluehorizonsgroup.com/ | 2026-10-12 | APPROVE |
| d-r2-4 | Canidium | Compensation plan design; annual sales plan readiness; implementation readiness; current and future state assessments and roadmap; data management and reporting; SAP, Xactly, Varicent partners; four global offices **Lead 2026-10-13:** the site lists four service categories (Strategic Focus, Operational Alignment, Technology for Scale, Platform Enablement); post corrected from three. "4 global offices" confirmed (only Fort Collins, CO is named). | https://www.canidium.com/ | 2026-10-12 | APPROVE |
| d-r2-5 | Canidium | Maintaining and optimizing software solutions; proactive issue prevention; health checks; staff augmentation | https://www.canidium.com/managed-services | 2026-10-02 | APPROVE |
| d-r2-6 | Delbridge Solutions | Design, manage, and optimize incentive compensation; unified analytics and reporting; integration with CRM, HCM, ERP; model design, data integration, workflow configuration, enablement; Xactly, Latitude39, Anaplan, InfinitySPM plus CPM list; offices in Toronto, Bucharest, Wilmington, Pune, Costa Rica, Valencia **Lead 2026-10-13:** "sales planning, territory, and quota management" is not on the page; post now uses the site label "territory and quota planning". No source for Delbridge describing source-field mapping, pre-configuration validation or reconciliation, so FAQ 2 now says "Delbridge names CRM, HCM, and ERP integration as a service". "Data, AI and Software Engineering" practice confirmed in the site nav (managed-services table cell). | https://delbridge.solutions/Solutions/sales-performance-management/ | 2026-10-12 | APPROVE |
| d-r2-7 | Delbridge Solutions | Administration, plan/quota/territory changes, run support, integration monitoring, release management, performance tuning, documented plan logic, SLAs and escalation paths | https://delbridge.solutions/spm-managed-services/ | 2026-10-02 | APPROVE |
| d-r2-8 | IncentiveOps | Assessment, Build, Launch; plan logic documented in operational detail before configuration; data integration scoped and validated before configuration; platform selection with documented rationale; $30,000 to $60,000 per project **Lead 2026-10-13 (cold review pass 5):** no plan or cost modeling found on the implementation page, so IncentiveOps is removed from the FAQ 1 list of firms that "publish plan design with modeling". The depth table column is renamed "Plan design or redesign" (graphic too), so the "Named" marks no longer imply modeling. | https://www.incentiveops.com/implementation-structural-redesign | 2026-10-12 | APPROVE |
| d-r2-9 | IncentiveOps | Fractional Ownership runs validation, calculation, statements, disputes, accruals; $12,000 to $18,000 per month; 30 or more quota-carrying sellers | https://www.incentiveops.com/fractional-sales-comp-management | 2026-10-02 | APPROVE |
| d-r2-10 | OpenSymmetry | Strategy services: program assessment and future state planning, sales planning strategy, incentive compensation plan design support, technology evaluation and selection, talent strategy, channel incentives; deployment incl. testing and training; AI-enabled implementation approach **Lead 2026-10-13:** "Plan Modeling" is a named step on the incentive compensation plan design support page ("Plan Assessment, Plan Design, Plan Modeling, and Rollout Communications"), which supports FAQ 1 listing OpenSymmetry under plan design with modeling. | https://www.opensymmetry.com/ | 2026-10-12 | APPROVE |
| d-r2-11 | OpenSymmetry | SPM Operations 24 hours a day, 7 days a week, 365 days a year; monitoring of data loads and batch jobs; dual-shore; Austin, London, Pune; eleven technologies incl. Varicent, Xactly, SAP, Anaplan, CaptivateIQ, NICE, Oracle, Spiff **Lead 2026-10-13 (cold review pass 5):** the full list on `/partners/spm-solutions/` (raw HTML, 2026-10-13) is Akeron, Anaplan, CaptivateIQ, NICE, Oracle, Performio, Sales Cookie, SAP Sales Performance Management, Spiff, Varicent and Xactly. The Performio cell in the platform-coverage graphic was empty and is now filled. Separately, Lanshore's own homepage (`IntroAgenticSPM.tsx`) says agents run "24/7", so the post's Lanshore lines now say "no support SLA or coverage hours published" instead of "no 24/7 claim". | https://www.opensymmetry.com/services/managed-services/ | 2026-10-02 | APPROVE |
| d-r2-12 | Spaulding Ridge | Territory, quota, capacity planning; incentive compensation aligned with organizational goals; sales crediting with forward- and backward-looking transparency; forecast-to-actuals and weekly snapshot variance modeling; Anaplan, OneStream, Oracle NetSuite, Salesforce, Snowflake; each phase informs the next **Lead 2026-10-13:** re-checked in raw HTML: "Forecast to actuals variance modeling" and "Weekly snapshot variance modeling" present; "reducing disputes" present. Kept as written. | https://www.spauldingridge.com/business-transformation/sales-performance-management/ | 2026-10-12 | APPROVE |
| d-r2-13 | Spaulding Ridge | Cloud application managed services; dedicated customer success team; single point of contact | https://www.spauldingridge.com/business-transformation/managed-services/ | 2026-10-02 | APPROVE |
| d-r2-14 | SpectrumTek | Beyond ICM into SPM; software selection scoring framework; territory and quota planning; CaptivateIQ, Jedox, Oracle, SAP, Varicent, Xactly **Lead 2026-10-13:** SpectrumTek does not describe source-field mapping, validation before configuration or reconciliation to finance, and does not mention BI tooling; FAQ 2 drops SpectrumTek from that list and the table cell now reads "data-driven approach; integration and process optimization" (site: "using a data-driven approach", "ensuring seamless integration and process optimization"). "Strongest on" changed from "low-cost" to "dual-shore" round-the-clock support (the site says "cost savings", not low cost). | https://www.spectrumtek.com/ | 2026-10-12 | APPROVE |
| d-r2-15 | SpectrumTek | End-to-end support to enhance and maintain SPM systems; on-demand admin support; data loads, batch processing, job monitoring; dual-shore model, cost savings, round-the-clock support; SLAs; India office in footer | https://spectrumtek.com/spm-services/managed-services/ | 2026-10-12 | APPROVE |
| d-r2-16 | SpectrumTek | Proactively model payout per group against forecasted performance; what-if analysis; plans work with IT systems and business processes | https://spectrumtek.com/spm-consulting/plan-design/ | 2026-10-12 | APPROVE |
| d-r2-17 | WorkCentive | Implementations with data integration; strategic reporting and analytics; advisory from plan optimization to revenue strategy; Toronto | https://www.workcentive.com/ | 2026-10-12 | APPROVE |
| d-r2-18 | WorkCentive | Post-go-live support with the consultants who built the model; training; health checks; save-or-scrap review; Varicent, Performio, CaptivateIQ on about page **Lead 2026-10-13:** the site does not say "the consultants who built the model"; it says "working with familiar consultants that are experienced in your model". Post now reads "with familiar consultants experienced in the client's model". "tailored to daily operations" corrected to the site's "daily business operations". | https://www.workcentive.com/managed-services and /about-us | 2026-10-02 | APPROVE |
| d-r2-19 | The Alexander Group | Publishes sales compensation design and benchmarking, not platform implementation or support | https://www.alexandergroup.com/capabilities/sales-compensation/ | 2026-10-02 | APPROVE |
| d-r2-20 | Korn Ferry | Publishes sales consulting, not platform implementation or support | https://www.kornferry.com/capabilities/business-transformation/sales-effectiveness/sales-consulting | 2026-10-02 | APPROVE |

### (r2-e) Rec 2 firm survey


| # | Firm | Considered via | Verdict | Reason | Decision |
|---|---|---|---|---|---|
| e-r2-1 | Ackle Consulting Group | Doug (2026-10-12) | Listed | Publishes ICM implementation on five platforms plus managed services | APPROVE |
| e-r2-2 | Blue Horizons Group | Earlier competitive research; Lead WP2 | Listed | Publishes implementation, advisory, managed services; Varicent via testimonial | APPROVE |
| e-r2-3 | Canidium | Existing 8 | Listed | Re-verified 2026-10-12 | APPROVE |
| e-r2-4 | Composed Comp | Doug (2026-10-12) | Not assessed | Site refuses automated retrieval; no browser available in session; dropped by Doug 2026-10-12 | APPROVE |
| e-r2-5 | Delbridge Solutions | Existing 8 | Listed | Re-verified 2026-10-12 | APPROVE |
| e-r2-6 | Deloitte (Anaplan alliance) | Existing 8 | Removed | Doug 2026-10-12: large SI, SPM sits inside alliance practice; "Not listed" sentence explains the category | APPROVE |
| e-r2-7 | IncentiveOps | Existing 8 | Listed | Re-verified 2026-10-12 | APPROVE |
| e-r2-8 | Lanshore | Existing 8 | Listed | Same evidence rule | APPROVE |
| e-r2-9 | OpenSymmetry | Existing 8 | Listed | Re-verified 2026-10-12; strategy catalog now reflected | APPROVE |
| e-r2-10 | Spaulding Ridge | Existing 8 | Listed | Re-verified 2026-10-12 | APPROVE |
| e-r2-11 | SpectrumTek | Doug (2026-10-12) | Listed | Publishes plan design, selection, implementation, managed services on six platforms | APPROVE |
| e-r2-12 | WorkCentive | Existing 8 | Listed | Re-verified 2026-10-12 | APPROVE |
| e-r2-13 | The Alexander Group | Existing "Not listed" | Not listed | Design-only | APPROVE |
| e-r2-14 | Korn Ferry | Existing "Not listed" | Not listed | Design-only | APPROVE |
| e-r2-15 | Vendor professional services teams | OQ6 | Not listed | Vendor-owned | APPROVE |

"Also qualifying" paragraph from the Lead's draft (12 firms from vendor directories): dropped in this version. The "Not listed" section now covers design-only firms, large SIs, and vendor PS teams by category rather than naming additional qualifying firms.

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

## (f) Verification log (WP2)

**Regression.**
- Baseline (on the branch at 8a4f6a9, before any WP2 edit): all 9 steps passed (rc=0 each). Counts: test:rules 94, test:schema 54, test:loaders 8, test:auth 107, test:redirects 3. Postbuild OK on 93 routes, 52 FAQPage/HowTo nodes.
- Final (after all WP2 edits): all 9 steps passed (rc=0 each), with the same test counts (no new tests; WP2 adds no logic).
- Postbuild final: check:headings OK (94 routes); check:schema-mirror OK (94 routes, 53 FAQPage/HowTo nodes); check:house-style OK (no em dashes and no proof-point markers); check:dir-page OK.

**Counts** (from the built HTML JSON-LD; before values re-captured at baseline and matching the WP1 after values):

| Page | Measure | Before | After |
|---|---|---|---|
| rec 2 post | FAQPage `mainEntity` | 4 | 6 (visible FAQ entries: 6) |
| rec 2 post | ItemList `numberOfItems` | 8 | 10 (= 10 numbered H2s, names identical and in order; every ListItem URL resolves to an H2 id) |
| rec 4 post | FAQPage `mainEntity` | (new) | 5 (visible: 5) |
| rec 4 post | ItemList `numberOfItems` | (new) | 12 (= 12 numbered H2s, same checks) |
| site | `/sitemap.xml` `<url>` | 91 | 92 (89 before WP1, so N + 3 overall) |
| site | `/llms.txt` solution + guide lines | 20 | 20 (blog posts are not listed in `llms.txt`, by design) |

- The rec 2 BlogPosting headline is "Best SPM Consulting and Service Partners Compared", `<title>` is 60 characters, `datePublished` is still 2026-08-03 and `dateModified` is 2026-10-12.
- The rec 4 post has no `datePublished` and `dateModified` 2026-10-12. Its `<title>` is 62 characters.
- Case study: the visible page and the `caseStudySchema` abstract both contain "Frequent calculation errors sharply reduced", and "eliminated" no longer appears on the page. `dateModified` is 2026-10-12.

**Internal-link check** (one-off scratch script, not committed). Result: PASS, 12 pages, 353 distinct internal hrefs, 0 unresolved, exit 0.
- Pages checked: the WP1 set of 10, plus the rec 4 post and the case study.
- Each required link was also confirmed:
  - `/spm/compare` and the modernizing guide each link the rec 4 post;
  - the rec 2 post links `/solutions/spm-consulting` (3 times);
  - the rec 4 post links `/spm/compare`, the choosing guide, the modernizing guide (Phase 2 anchor), the legacy post, and the `/spm/<slug>` page of all 9 implemented platforms.

**Quote check** (scratch script). Every double-quoted span in the bodies of both posts was matched against the stripped page texts fetched on 2026-10-12. Rec 2 has 38 spans, rec 4 has 50. Two spans did not match mechanically, and both are confirmed:
- the Lanshore fee quote, which is verbatim in `src/app/services/page.tsx`;
- "save or scrap", where the WorkCentive source quotes each word separately ("Save" or "Scrap"). This is existing text.

**Claims audit** (lines added in WP2 against HEAD 8a4f6a9 in `content`, `src/lib` and `src/app`, plus the new untracked post; 558 lines).
- Must-be-zero tokens: **0 hits.** No exceptions needed.
  - Vendor wording that would have hit was kept out of the post rather than paraphrased to dodge the audit: Ackle's and Composed's partner labels, the Akyba sentence's "...data" qualifier (the post quotes only the rest of the sentence), and Forma.ai's cost-of-ownership promise.
- Logged tokens:
  - `PepsiCo` 1 (b15, verbatim).
  - `partner network` 11: 10 are the reused b12 wording in the rec 4 post. The 11th is the source title "CaptivateIQ Partner Network (implementation partner directory)" in rec 2 `sources`, which is CaptivateIQ's own page title, a false positive.
  - `Grammarly`, `Micro Focus`, `PwC`, `partnership`: 0.

Number lines (each added line with a digit, `%` or "percent"; front-matter dates excluded):

| # | File | Content | Origin |
|---|---|---|---|
| 1 | rec 2 | `description`: "for 2026", "ten" | editorial (edition year; count of listed firms) |
| 2 | rec 2 | key takeaway: "24/7 monitoring" | d14 (OpenSymmetry, existing claim) |
| 3-12 | rec 2 | `itemList` items "1." to "10." | list numerals |
| 13-14 | rec 2 | Deloitte source title "(one-pager, 2026)" and its URL | source metadata (unchanged URL) |
| 15 | rec 2 | opening: "This 2026 edition" | editorial |
| 16 | rec 2 | Discovery: was "August 2026 edition"; Lead changed to "previous edition" (the 2026-08-03 `datePublished` is a Group 2 backdate, not real history) | editorial |
| 17 | rec 2 | consulting table, Deloitte: "35+ countries" | d12 |
| 18 | rec 2 | Blue Horizons: "300+ incentive compensation management implementations" | d9 |
| 19 | rec 2 | IncentiveOps consulting: "three phases", "ten to sixteen weeks", "more than 100 incentive plans" | d13 |
| 20 | rec 2 | Lanshore: "nine SPM platforms", "15+ years" (OQ9 sentence edited in the same line) | b14, b16 |
| 21 | rec 2 | Lanshore consulting: "more than 20 countries and a dozen currencies" | b15 (b3) |
| 22 | rec 2 | OpenSymmetry consulting: "5C's" | d14 (framework name) |
| 23 | case study | `"dateModified": "2026-10-12"` | real edit date (OQ9) |
| 24 | `src/app/spm/compare/page.tsx` | `className="mt-4 ..."` | code, not a claim |
| 25-36 | rec 4 | `itemList` items "1." to "12." | list numerals |
| 37 | rec 4 | FAQ: "$15 per user per month", "$8,000", "$75 per user per month" | d38, d41 |
| 38 | rec 4 | table, Incentivate: "$15", "$8,000" | d38 |
| 39 | rec 4 | table, Performio: "70 or more" | d40 |
| 40 | rec 4 | table, Spiff: "$75 per user per month" | d41 |
| 41 | rec 4 | CaptivateIQ: "SOC 1 and SOC 2" | d36 |
| 42 | rec 4 | CaptivateIQ: "ASC 606" add-on | d36 |
| 43 | rec 4 | Incentivate: "$15", "$8,000" | d38 |
| 44 | rec 4 | Performio: "70+", "24/7" | d40 |
| 45 | rec 4 | Spiff: "ASC 606 and IFRS 15", "$75" | d41 |
| 46 | rec 4 | Xactly: "ASC 606 and IFRS 15" | d44 |
| 47 | rec 4 | legacy paragraph: link slug `9-signs-...` | link target, not a claim |
| 48 | rec 4 | link fragment `#phase-2-...` | link anchor, not a claim |
| 49 | rec 4 | FAQ answer body (same text as line 37) | d38, d41 |

Spelled-out counts that the digit scan does not catch, listed for completeness:
- rec 2: "ten" firms, "eight firms" from the earlier edition, "eleven supported technologies" (d14);
- rec 4: "twelve" platforms, "nine" implemented (b14), "three" partner-network vendors (b12), "Two of the twelve" publish prices (d38, d41), "The other ten".

Numbers audit: 49 lines reviewed, all traced, Lead (Claude Code), 2026-10-12. Lead re-fetched live and confirmed: Spiff $75/user/month, annual contract, no trial licenses (d41); Incentivate from $15/user/month, implementation from $8,000 (d38); Performio "70+ commissionable employees" and "as-is" ingestion (d40); SAP rename to "SAP Incentive Management" (sap.com regional product pages, App Store listing). Line 16 reworded (see row).

**Coverage.** UNMEASURED / no changed logic lines. WP2 changes content files and adds one JSX paragraph with no logic (plan section 5).

**UI verification** (`verify` skill: a production build served by `npx next start -p 3823` and driven by Playwright 1.61).
- Routes:
  - `/blog/best-spm-service-partners-compared`
  - `/blog/best-enterprise-spm-software-for-complex-incentives`
  - `/spm/compare`
  - `/spm` (requested by the cold review)
  - `/case-studies/managed-services-commission-management`
- Each route at 1280px and 375px:
  - status 200;
  - exactly one h1;
  - largest heading step 1;
  - no horizontal page scroll (scrollWidth equals clientWidth);
  - zero console errors or warnings and zero `pageerror`.
- Tables at 375px scroll inside an `overflow-x: auto` container:
  - rec 2: 699px and 603px tables in 341px wrappers;
  - rec 4: a 576px table in a 341px wrapper;
  - `/spm/compare`: a 1024px table in a 343px wrapper.
- The case-study page shows the OQ9 wording.
- The seven platform pages without `related` still render zero Related DOM.
- Both new cross-link sentences render in the served HTML.
- Result: PASS, 0 failures.
- The server was stopped after the run (listener PID 64852 killed; its npx parent exited; port 3823 no longer listening). A separate `npx next start --port 3799` process started on 2026-10-05 (PID 60660, listener PID 25000) is still running. It predates this session and was left alone.

### Rec 2 replacement (Doug's draft, verified 2026-10-13)

The WP2 rec 2 numbers lines 1 to 22, the rec 2 quote check, and the rec 2 counts row above describe the Lead's superseded draft. This subsection replaces them for rec 2. Rec 4, case-study and cross-link entries above still stand.

**What landed.** `content/blog/best-spm-service-partners-compared.md` replaced with Doug's file. Five SVGs added under `public/images/` (`spm-consulting-five-jobs`, `spm-managed-services-models`, `spm-consulting-depth-grid`, `spm-platform-coverage`, `spm-consulting-how-to-choose`), plus `spm-consulting-five-jobs.png` for the `image:` front matter (BlogPosting JSON-LD). The other four PNGs in the package are not referenced by the post and were not added.

**SVG safety review.** All five are static shapes and text: no `<script>`, event handlers, `foreignObject`, `<image>`, external `href` or CSS imports. They are served as `image/svg+xml` and rendered through `<img>`. The depth-grid, platform-coverage and managed-services graphics were compared with the post's tables and rows d-r2-1 to d-r2-18. That comparison missed that d-r2-11 lists only eight of OpenSymmetry's eleven platforms ("incl."), and that Blue Horizons now has a partners page. Cold review pass 5 caught both, and the platform-coverage graphic was corrected: OpenSymmetry Performio, plus Blue Horizons Xactly and CaptivateIQ. The depth-grid column label was changed to match the table. Oracle is not marked for Lanshore, and no partner-network claim appears.

**Lead changes to Doug's draft** (each one also noted on its row in section (r2)):
- YAML fix: the sixth key takeaway contained "Lanshore included: claims", which parsed as a mapping and failed `check:content`. It is now quoted, and "held" became "is held".
- b-r2-3: the 20-plus source systems are now attributed to the engagement history, not to one client.
- FAQ 2 (front matter and body): Delbridge and SpectrumTek were removed from "describe integration in those terms" because no source supports it. Delbridge is now described as naming CRM, HCM and ERP integration as a service.
- SpectrumTek: the table cell "BI tooling" became "integration and process optimization", and "low-cost" became "dual-shore".
- Delbridge: "sales planning, territory, and quota management" became "territory and quota planning".
- Canidium: three service categories became four.
- Blue Horizons: "shortens timelines" became "cuts project timelines".
- WorkCentive: "the consultants who built the model" became "familiar consultants experienced in the client's model", and "daily operations" became "daily business operations".

**Live re-verification (2026-10-13).** All 17 flagged phrases were re-fetched from each firm's own pages. Ten were fully supported, six partially, and one was not found; every partial or unsupported phrase is fixed above.
- Spaulding Ridge variance modeling: a proxy fetch missed it, so the raw HTML was read with curl. It contains "Forecast to actuals variance modeling" and "Weekly snapshot variance modeling", so the line was kept.
- IncentiveOps: "$30,000–$60,000 per project" and "resolved within a defined SLA" were confirmed.
- Ackle: "Founded 2015.", "teams from 50 to 5,000 sellers" and "a retainer sized to your team" were confirmed.
- Canidium's multinational-rollout guidance was confirmed ("Global SPM Implementation Guide", 2026-09-21).

**Regression.** All 9 steps passed (rc=0). Postbuild:
- check:headings OK (94 routes);
- check:schema-mirror OK (53 FAQPage/HowTo nodes);
- check:house-style OK (no em dashes, no markers);
- check:dir-page OK.

A banned-token scan of the post and the five SVGs found 0 hits.

**Counts (built HTML).**

| Measure | Result |
|---|---|
| rec 2 ItemList | 10 items, matching the 10 numbered H2s in order; every ListItem URL resolves to an H2 id |
| rec 2 FAQPage | 8, with 8 visible FAQ H3s |
| rec 2 `<title>` | 60 characters |
| rec 2 dates | `datePublished` 2026-08-03 (Group 2 backdate, unchanged); `dateModified` 2026-10-12 |

**Internal links.** PASS: 12 pages, 358 distinct internal hrefs, 0 unresolved.

**UI verification.** Production build on a fresh `next start -p 3823`, confirmed serving the new text, driven with Playwright. Four routes (the rec 2 post, the rec 4 post, `/spm/compare` and the case study) were checked at 1280px and 375px. Every check passed with 0 failures:
- status 200;
- one h1;
- heading step at most 1;
- no horizontal scroll;
- every JSON-LD block parses;
- zero console errors, page errors or failed requests.

All five rec 2 images load, carry alt text and fit their container: 720px wide at 1280, 343px at 375. The server was stopped afterwards.
- **Design note (non-blocking):** at 375px the 1200px-wide graphics scale to 343px, so their labels are too small to read on a phone. Each graphic sits beside a table or paragraph that carries the same facts, so nothing is lost. Options for Doug: leave as is, link each image to its full-size SVG, or supply narrow variants.

**Numbers audit (rec 2 replacement).** The scan covered lines with a digit, excluding front-matter dates, source URLs, `itemList` numerals and heading numerals. 21 lines were found:

| Lines | Figures | Origin |
|---|---|---|
| 4, 130 | "2026" | edition year (editorial) |
| 45, 170, 237, 297 | "20-plus" countries, "dozen currencies" (PepsiCo) | b-r2-2 |
| 48, 171, 187, 188, 193, 241, 245, 301 | "24/7", "24/7/365", "24 hours a day, 7 days a week, 365 days a year" | d-r2-11 (OpenSymmetry); the Lanshore lines now say it publishes no support SLA or coverage hours (the homepage does say agents run "24/7") |
| 169, 186, 229 | "$12,000 to $18,000 per month", "$30,000 to $60,000", "30 or more" sellers | d-r2-8, d-r2-9 (re-confirmed live) |
| 197 | "2015", "50 to 5,000" | d-r2-2 (re-confirmed live) |
| 237 | "6 percent"; "more than 20" source systems; "74 percent"; "about 400 to about 100" | b-r2-1; b-r2-3 (corrected); b-r2-5 (split into two scoped sentences after cold review pass 5) |
| 144, 221, 231 | link slug `7-questions-...`, the name "Latitude39", "B2B" | not figures |

Spelled-out counts: "ten" firms; "five jobs"; "nine platforms" (b-r2-4); "eleven supported technologies" (d-r2-11); "four" service lines (d-r2-3); "eight elements" (d-r2-3); "four global offices" (d-r2-4); "six countries" (d-r2-6); "six partner platforms" (d-r2-14); "five or more platforms" (OpenSymmetry 11, Lanshore 9, SpectrumTek 6, Ackle 5).

Numbers audit: 21 lines reviewed, all traced, Lead (Claude Code), 2026-10-13. The IncentiveOps prices and the Ackle founding year and team sizes were re-fetched live on 2026-10-13.

**Cold review pass 5 fixes (2026-10-13).** Each fix is also noted on its (r2) row.
- Lanshore 24/7 wording corrected (the homepage says agents run 24/7).
- Engagement order corrected: the plan design review comes first, then requirements and data mapping (`spm-consulting.ts` `howWeDeliver`).
- "Where applicable" restored to the audit-log claim.
- The telecom figures are split into two sentences, each keeping its own scope, and the fee is linked to its source page.
- Blue Horizons: its partners page is now named.
- OpenSymmetry: Performio cell filled in the graphic.
- FAQ 1: IncentiveOps removed. FAQ 2: Ackle reworded.
- Depth column renamed "Plan design or redesign".
- The large-SI exclusion is now presented as an editorial choice.
- OpenSymmetry's AI cell now reads "Not published for operations".
- `dateModified` set to 2026-10-13, the date the post was actually edited.

The full regression, link check and browser verification were re-run after these fixes. Results are below.

**Re-run after the pass 5 fixes (2026-10-13).**
- **Regression:** all 9 steps rc=0; postbuild OK (94 routes, 53 FAQPage/HowTo nodes, no em dashes or markers).
- **Counts:** rec 2 ItemList is 10, matching the numbered H2s; FAQPage is 8, matching the visible FAQs; `dateModified` is 2026-10-13.
- **Internal links:** PASS, 12 pages, 359 hrefs, 0 unresolved.
- **Browser verification:** fresh `next start -p 3823`, confirmed serving the new text; 4 routes at 1280px and 375px, PASS with 0 failures; all 5 images load and fit their containers. The server was stopped afterwards.

**Pre-PR code review fixes (2026-10-13).** The `/pre-pr` code review raised one gap and several minor points. These changes were made:
- **OpenSymmetry modeling (gap).** FAQ 1 lists OpenSymmetry among the firms that publish plan design with modeling, but the post's table and body did not show it. The Lead re-fetched the OpenSymmetry plan design page as raw HTML (692 KB). It reads "Plan Assessment, Plan Design, Plan Modeling, and Rollout Communications." The page is now in `sources` (retrieved 2026-10-13); the OpenSymmetry table cell reads "incentive compensation plan design support (assessment, design, modeling, rollout communications)"; the body names plan modeling as a step. This affects d-r2-10.
- **Governance sentence.** "only a few firms here describe the latter" (a published governance model) now reads "the firms here mostly publish offices or delivery models rather than a governance model." This matches the table, whose governance cells describe offices, delivery models or rollouts.
- **Retainer wording.** FAQ 4 (front matter and body) now says IncentiveOps and Ackle tie administration to "a retainer or monthly fee". The change is needed because IncentiveOps publishes a monthly fee, not a retainer.
- **Rec 4 audit trail sentence.** Varicent's quote says "of changes", but Xactly's does not. The sentence now quotes Xactly exactly ("a complete audit trail to back it all up", d44). The SAP quote "without relying on IT" was checked against d42 and kept.
- **Not changed, for Doug:**
  - The platform-coverage graphic sits under "Managed services at a glance", although it is about platform coverage, not managed services.
  - "A national telecom carrier" appears in two consecutive sentences, so readers cannot tell whether it is one client or two.
  - CaptivateIQ's "matter of weeks" quote sits under "Watch out for".
  - The images have no intrinsic size and are small at 375px.
- **Security review:** no findings (SVGs and PNG inert, no raw HTML, JSON-LD escaped, plain https links).
- **Re-run after these fixes:**
  - **Regression:** all 9 steps rc=0; postbuild OK (94 routes, 53 FAQPage/HowTo nodes, no em dashes or markers).
  - **Internal links:** PASS, 359 hrefs, 0 unresolved.
  - **Browser verification:** the first attempt reached a stale server still holding port 3823 and was discarded. That process was stopped, a fresh `next start` was confirmed to serve the new text, and 4 routes at 1280px and 375px passed with 0 failures. The server was stopped afterwards.
Signed off: Doug Erb, 2026-10-13
# AEO HubSpot recommendations, 2026-10-12 pull: 7 page recommendations

Status: APPROVED (cold review pass 2, 2026-10-12; re-confirmed APPROVE in the pass 3 pre-commit refresh after WP1). Owner decisions recorded in section 7. Live progress is in the section 10 Status table. The pass 2 conditions are carried in the review file.
Author: planning session, 2026-10-12 (revision 2)
Source: HubSpot AEO export, 21 new recommendations (7 in scope for code, 14 off-site)
Related: `docs/plans/aeo-2026-10.md` (Group 2, shipped in 06c14bd), `docs/plans/aeo-2026-10.review.md`, `docs/waivers/aeo-2026-10-review-schema.md`
Branch: `aeo-hubspot-2026-10-12`, created from `main` by the Lead. Its first commit is this plan plus its review (section 8.0), made back to back with the WP1 commit under one `/pre-pr` marker. Nothing merges to `main` before Doug's sign-off (section 9).
Progress is tracked only in the section 10 Status table. This plan contains no checkbox lines, by design (section 8.0).

---

## 1. Goal and scope

**Goal.** Answer the 7 on-site HubSpot recommendations without publishing near-duplicates of pages that already exist. Where an existing URL already serves the intent, extend it. Create new URLs only where the site has a real gap.

**In scope.**
- 3 new URLs: one guide, one solution page, one comparison post.
- Extensions to existing pages, plus one case-study wording correction (OQ9).
- A small validation gate so `[PROOF POINT NEEDED]` markers can never reach production. Its scope is defined in section 3.4.

**Non-goals.**
- The 14 off-site recommendations: 9 LinkedIn posts or articles, and 5 outreach asks to third-party roundup sites (alpharun.com, federicopresicci.com, kendo.ai, lative.ai, demostack.com). No code is involved. They are still worth doing for citation volume.
- No `Review` or `AggregateRating` markup anywhere. The waiver in `docs/waivers/aeo-2026-10-review-schema.md` applies unchanged.
- No new schema builders and no new content type (section 3.2).
- No sitewide "AI Assisted SPM" to "Agentic SPM" rename (OQ11). That includes the `AI Assisted SPM by Lanshore: ` prefix hardcoded in `serviceSchema()` (`src/lib/schema.ts:174`).
- No changes to earlier owner-gated items: the `/about/partners` Microsoft Gold claim, the case-study `datePublished`, and convergence review V2/V4/V5.
- No analyst citations (Gartner, Forrester) in any new copy. Existing `analystNote` strings are untouched.
- No redirects, retired slugs, or URL changes.
- Platform AI-status checks (WP1 step 3) are **hygiene**, not a HubSpot recommendation. They happen only because WP1 edits those records.

---

## 2. Overlap analysis and per-page disposition

HubSpot regenerates near-duplicates. Each recommendation was checked against `src/app`, `src/lib/solutions/*`, `src/lib/spmPlatforms.ts` and `content/blog/*.md` (guides are blog records with `kind: guide`).

| # | Rec (pri/score) | Existing coverage found | Disposition | Target URL | Schema (already emitted by the route) |
|---|---|---|---|---|---|
| 1 | Audit-Ready SPM Services for Global Incentive Plans (High/55) | `/solutions/spm-consulting` (redesign, audit; HubSpot 255671903 was also High/55), `/solutions/global-compliance`, `/solutions/enterprise-crm-erp-integration`, guides `enterprise-spm-consulting-audit-ready-analytics` and `global-incentive-governance` | **EXTEND** `/solutions/spm-consulting`. A new hub would cannibalize 3 solution pages and 2 guides. | `/solutions/spm-consulting` | Service, FAQPage, BreadcrumbList |
| 2 | Best SPM Consulting Services Compared for 2026 (High/55) | `/blog/best-spm-service-partners-compared`: 8 firms, scoped to post-implementation managed services | **EXTEND**: widen to consulting plus managed services, keep the same slug, and re-survey which firms qualify (WP2 step 2). | `/blog/best-spm-service-partners-compared` | BlogPosting, ItemList (in-page), FAQPage, BreadcrumbList |
| 3 | CaptivateIQ or Performio SPM Implementation Services (High/5) | `/spm/captivateiq` (title "CaptivateIQ Implementation & Managed Services"; `lanshoreAngle[0]` already covers spreadsheet migration), `/spm/performio`, `/solutions/mid-market-implementation`, `/blog/best-spm-platforms-for-spreadsheet-replacement`, `/about/partners` | **SKIP as a new URL; EXTEND** both platform pages and `mid-market-implementation`. | `/spm/captivateiq`, `/spm/performio` | Service, FAQPage, BreadcrumbList |
| 4 | Best Enterprise SPM Software for Complex Incentives (High/5) | `/spm/compare` (9 implemented platforms, no `sources`), two other segment listicles (spreadsheet replacement, small teams), guide `choosing-spm-software` | **NEW POST**. The enterprise segment is the gap in the existing listicle series. Vendors are selected by an explicit rule (section 3.7). The post also absorbs rec 7. | `/blog/best-enterprise-spm-software-for-complex-incentives` | BlogPosting, ItemList (in-page), FAQPage, BreadcrumbList |
| 5 | The Complete Guide to Sales-Finance Misalignment (Med/3) | Adjacent only: guides `spm-alignment-quota-accuracy`, `global-spm-operating-model`, `incentive-compensation-data-governance`; `/blog/how-spm-affects-quota-attainment`; `/solutions/enterprise-crm-erp-integration`. No page is framed around the seams between sales and finance. | **NEW GUIDE**. Link to the adjacent pages and do not re-explain them: not quota methods, and not the five attainment mechanisms. | `/resources/guides/sales-finance-misalignment` | Article, FAQPage, BreadcrumbList |
| 6 | SPM for Quota and Incentive Alignment (Med/3) | Guide `spm-alignment-quota-accuracy`, two quota blog posts. `/solutions/revenue-teams` owns the visibility and dashboards offer (`revenue-teams.ts:17,21`). | **NEW SOLUTION**, limited to alignment (planning, measures, crediting, change control). Visibility is linked to `revenue-teams`, not re-offered. | `/solutions/quota-incentive-alignment` | Service, FAQPage, BreadcrumbList |
| 7 | Best Legacy SPM Replacement Options for Enterprises (Low/1) | `/blog/why-legacy-spm-breaks-global-sales-teams`, `/blog/9-signs-your-enterprise-spm-needs-modernization`, guide `modernizing-legacy-spm-systems` (Phase 2). Platform list would overlap rec 4 by about 80%. | **SKIP as a standalone URL**: becomes an H2 plus one FAQ inside rec 4, with one link added from the modernizing guide. | (inside rec 4) | (rec 4's) |

**Net result:**
- 3 new URLs (recs 4, 5, 6).
- Extended: `spm-consulting`, `mid-market-implementation`, `/spm/captivateiq`, `/spm/performio`, `best-spm-service-partners-compared`.
- Cross-link only: `global-compliance`, `/spm/compare`, `modernizing-legacy-spm-systems`.
- Wording fix: case study `managed-services-commission-management` (OQ9).

**HubSpot reconciliation after publish:** mark recs 1 and 3 complete against the extended URLs, rec 7 against rec 4's URL, and the rest against their targets.

### Internal links (each must resolve to a built route; checked in section 5)

| Page | Links out to | Gets links from |
|---|---|---|
| `/solutions/spm-consulting` (ext) | `/solutions/global-compliance`, `/solutions/enterprise-crm-erp-integration`, `/resources/guides/global-incentive-governance` (added to `related`) | `/solutions/global-compliance` (`related`), rec 2 post (body) |
| `/spm/captivateiq`, `/spm/performio` (ext) | `/solutions/mid-market-implementation`, `/blog/best-spm-platforms-for-spreadsheet-replacement`, (new optional `related`; `/case-studies/spreadsheet-to-spm-platform` deliberately **not** linked here, because a Related link on a platform page implies the case study ran on that platform, which section 3.6 forbids) | existing |
| `/solutions/quota-incentive-alignment` (new) | `/resources/guides/spm-alignment-quota-accuracy`, `/resources/guides/sales-finance-misalignment`, `/blog/sales-process-gaps-that-undermine-quota-attainment`, `/solutions/revenue-teams` | rec 5 guide (body), `/solutions` index (automatic) |
| `/resources/guides/sales-finance-misalignment` (new) | `/resources/guides/spm-alignment-quota-accuracy`, `/blog/how-spm-affects-quota-attainment`, `/resources/guides/global-spm-operating-model`, `/resources/guides/incentive-compensation-data-governance`, `/solutions/enterprise-crm-erp-integration`, `/solutions/quota-incentive-alignment` | rec 6 solution (`related`) |
| rec 4 post (new) | `/spm/compare`, `/resources/guides/choosing-spm-software`, `/resources/guides/modernizing-legacy-spm-systems`, `/blog/why-legacy-spm-breaks-global-sales-teams`, the `/spm/<slug>` page of each listed platform Lanshore implements | `/spm/compare` (one sentence after the table), modernizing guide (Phase 2) |
| rec 2 post (ext) | adds `/solutions/spm-consulting` | unchanged |

---

## 3. How content is authored here (verified), and the chosen approach

### 3.1 Content model (verified; confirmed accurate by cold review pass 1)

- **Solutions** are typed TS records in `src/lib/solutions/<slug>.ts` (type in `types.ts`), registered in `SOLUTIONS` in `src/lib/solutions/index.ts`. Array order is display and sitemap order (priority, then score). Module load throws on: unknown `platforms` or `relatedCaseStudies` slug, duplicate slug, "gartner", "STUB", any em dash (`findInRecord`), or fewer than 4 FAQs. The route `src/app/solutions/[slug]/page.tsx` emits `serviceSchema`, `faqSchema` and `breadcrumbSchema`.
- **Platform pages** come from `SPM_PLATFORMS` in `src/lib/spmPlatforms.ts`, rendered by `src/app/spm/[slug]/page.tsx`. `faq` and `lanshoreAngle` are rendered visibly. There is no module-load validation. Sitemap `lastmod` comes from `UPDATED.spm` in `src/lib/contentDates.ts`, which is shared by `/spm`, `/spm/compare` and all 9 platform pages.
- **Blog posts and guides** are `content/blog/<slug>.md`, loaded by `loadBlog()` (drafts skipped) and validated by `validateBlogPost()` in `scripts/lib/content-rules.mjs` through `check:content`. Rules: real dates; `datePublished <= dateModified`; author in `AUTHOR_IDS`; `keyTakeaways` 2 to 6; FAQ and HowTo front matter must match the body (`validateBodyMirror`); `comparison: true` requires dated https `sources[]`; every `itemList.items[]` entry must be an exact body heading; no em dash. `kind: guide` publishes under `/resources/guides/` through `postPath()`. Each file must be in `content/SLUGS.lock.json` `blog[]` (ledger rule L3).
- **Case studies** are `content/case-studies/<slug>.json`, validated by `validateCaseStudy()`. The `results` field feeds the visible page and `caseStudySchema().abstract`. The optional `dateModified` defaults to `CASE_STUDIES_DEFAULT_MODIFIED`.
- **Article rendering**: `src/components/ArticleView.tsx` emits `blogPostingSchema` (`Article` for guides), breadcrumbs, `faqSchema` and `inPageItemListSchema`, and renders `KeyTakeaways` and `SourcesList`.
- **Discovery is collection-driven**: `sitemap.ts`, `llms.txt/route.ts` and `llms-full.txt/route.ts` read `SOLUTIONS`, `GUIDES` and `BLOG_POSTS`. `llms.txt` lists solutions and guides but not individual blog posts, so recs 2 and 4 will not appear there (by design). The one place that is not collection-driven is the `DESCRIPTION` string in `src/app/solutions/page.tsx`, which is already about 205 characters.
- **Ordering**: `ARTICLES` and `GUIDES` sort newest first by `datePublished ?? dateModified` (`src/lib/blog.ts`).
- **Postbuild gates**: `check:headings`, `check:schema-mirror` (M1 to M6), `check:house-style`, `check:dir-page`.
- **The studio admin writes to `main`** (`src/lib/studio/github.ts:115`), so it can change `content/` and `SLUGS.lock.json` while this branch is open (rule in section 8.0).

### 3.2 No new schema infrastructure is needed

`serviceSchema`, `inPageItemListSchema`, `faqSchema` and `blogPostingSchema` already exist and are wired into the three routes these pages use. **This matches the existing pattern.**

### 3.3 Chosen approach (OQ1 decided: code)

Build in this repo with the Group 2 patterns:
- solutions as TS records;
- guides and posts as blog-collection Markdown;
- comparison posts on the shipped evidence model: `comparison: true`, dated `sources[]`, alphabetical order stated as not a ranking, "Not published" cells, no ratings, and Lanshore held to the same evidence rule.

**Why not HubSpot CMS draft pages:**
- the content would sit in a second CMS, outside content-rules, the FAQ body mirror, the itemList-heading check, the em dash rule, the sources requirement, author and date rules, the ledger, Gartner footnote wiring, and the postbuild gates;
- JSON-LD would be hand-pasted with nothing checking it;
- the pages would be missing from the sitemap, `llms.txt` and `llms-full.txt`;
- serving them under `lanshore.com/...` needs a proxy, and a subdomain splits authority;
- it needs a second set of templates;
- it brings in the HubSpot tracker consent question (V2).

### 3.4 Proof-point gaps and the marker gate (OQ3 decided)

There are no inline markers in source this round. Copy is written to be true without the missing proof point. Each desired proof point goes in the owner review file, **`docs/owner-review/aeo-hubspot-2026-10-12.md`** (moved out of `docs/plans/` so the pre-commit gate's plan discovery never picks it up), with the exact proposed sentence and where it would go.

**Gate (new pattern, justified).** Group 2's markers were checked by nothing except a manual grep. Keeping a gate is cheap insurance for future rounds and for Doug's review edits.

**What the gate checks:**
1. Content-rules records where `draft !== true`: `validateBlogPost`, `validateCaseStudy` and `validateWhitePaper` all call `validateNoProofMarkers`. White paper `title` and `description` render on `/resources`, so they are covered too; adding them costs one line.
2. `SOLUTIONS` entries at module load (`src/lib/solutions/index.ts`, next to the `STUB` check).
3. Prerendered HTML (title, meta, JSON-LD, visible text, reader-facing attributes) plus the `llms.txt` and `llms-full.txt` bodies, in `check:house-style`. This is the backstop for `spmPlatforms.ts` and TSX pages.

**What the gate does not check:**
- white paper PDFs;
- client-side-only widget text not present in prerendered HTML;
- code comments;
- `docs/`.

Matching is case-insensitive `proof\s+point\s+needed`, with or without brackets. Cold review confirmed it matches nothing in current content.

### 3.5 Listicle framing (OQ2 decided: shipped precedent)

Recs 2 and 4 follow `best-spm-service-partners-compared` and `best-spm-platforms-for-spreadsheet-replacement`:
- an explicit inclusion rule and an explicit evidence rule;
- alphabetical order, "not ranked";
- "Not published" cells;
- no ratings and no Review markup;
- ItemList of numbered in-page headings.

Lanshore lists itself on the firms list (rec 2) under the same rule. It does not list itself on the software list (rec 4); there it discloses its relationship with each platform.

Rejected alternatives: a named and ranked list (FTC and credibility risk, no defensible scoring), and a criteria-only list with no names (weaker, and `/blog/7-questions-to-vet-an-enterprise-spm-partner` already covers the criteria).

### 3.6 Claims and naming constraints (binding on both packages)

- **Platforms Lanshore implements:** only the 9 in `PLATFORMS` (`src/lib/site.ts:48`) / `SPM_PLATFORMS`.
- **Oracle, beqom, Forma.ai:** the live site already says, from `NEAR_MISS_VENDORS` (`spmPlatforms.ts:456`), that they are "Also supported through our partner network" (`/spm/compare`, `src/app/spm/compare/page.tsx:57,179`; `/spm`, `src/app/spm/page.tsx:98`). For consistency, rec 4 reuses that exact wording, "supported through our partner network", and nothing stronger. The phrase is logged in the owner review file under **reused claims** so Doug can confirm or strike it **sitewide**. If he strikes it, the publish step removes it from rec 4, `/spm` and `/spm/compare` in the same commit (section 9).
- **CaptivateIQ and Performio partnership wording** may not go further than `/about/partners` ("Implementation partnership", "Implementation and support partnership") or `spmPlatforms.ts` ("implements", "operates", "managed comp operations"). No tiers, no "certified", "preferred", "premier" or "elite", no partner counts.
- **Clients:** only PepsiCo, Grammarly and Micro Focus (with PwC) are named. Sprint/T-Mobile is always "a national telecom carrier". All others stay anonymous, described as on existing pages. The spreadsheet case study does not name its platform, so no copy may connect it, or Grammarly, to CaptivateIQ or Performio.
- **Numbers:** no new metrics unless the owner supplies them. Extensions may reuse only already-published claims, each logged with its origin. The reusable set:
  - telecom new-logo overpayment of about 6 percent (`spm-consulting`);
  - telecom close time cut 74 percent, exceptions from about 400 to about 100 (rec 2 post);
  - PepsiCo: 20+ countries and a dozen currencies (`global-compliance`);
  - Grammarly: 1,000+ payees, 3 plan types, close from about 8 days to 3 (`mid-market-implementation`);
  - 10 to 14 weeks for a 3-to-6-plan mid-market spreadsheet migration (spreadsheet-replacement post);
  - 20+ source systems and the Fortune 500 high-tech integration (`enterprise-crm-erp-integration`);
  - 15+ years.
- **Managed-services result wording (OQ9):** "sharply reduced the calculation errors". This replaces "eliminating frequent calculation errors" in the rec 2 post and "Frequent calculation errors eliminated" in `content/case-studies/managed-services-commission-management.json:10`. No test or fixture pins either string; verified by grep over `scripts/`, `src/` and `content/`.
- **Dates (OQ4):** never guess `datePublished`. New articles carry none on the branch. The publish step sets go-live dates (section 9).
- **Competitor and vendor facts** are fetched live during the package, quoted from the page itself (a fetch-tool summary is not a quote), and recorded with URL and retrieval date. Never from model memory.
- **House style:** no em dash. Use an ASCII hyphen in "Sales-Finance".
- **Positioning:** body copy says "Agentic SPM" (Group 2 and Doug). The Service JSON-LD prefix stays "AI Assisted SPM by Lanshore: " (OQ11).

### 3.7 Rec 4 inclusion rule and vendor derivation (OQ7 decided)

**Candidate pool:** the 12 platforms Lanshore implements or supports. That is every `SPM_PLATFORMS` entry plus `NEAR_MISS_VENDORS`. "How we compared" states this scope openly, together with the relationship disclosure.

**Inclusion rule:** a platform is listed if, on retrieval, the vendor's own product, pricing or customer-segment pages state that it serves enterprise-scale organizations or complex incentive plans, and the stating sentence is recorded in `sources`. Platforms that fail the rule are named under "Not listed" with the reason.

**Pre-retrieval expectations.** These are hypotheses for the implementer to confirm or overturn. They are not decisions.

| Platform | Relationship | Expectation before retrieval | Basis (on-site today; re-verify live) |
|---|---|---|---|
| Anaplan | implements | likely in | `spmPlatforms.ts` customerProfile "Enterprises..." |
| CaptivateIQ | implements | likely in | vendor mid-market and enterprise positioning (rec 2-era sources) |
| Performio | implements | likely in | vendor "complex commission plans" (spreadsheet post sources) |
| SAP SuccessFactors Incentive Management | implements | likely in | SAP enterprise portfolio |
| Varicent | implements | likely in | "mid-sized to large enterprises with complex plans" |
| Xactly | implements | likely in | enterprise positioning |
| Akeron (Vulki) | implements | likely in | `spmPlatforms.ts:368` "enterprise sales performance management platform" |
| Incentivate | implements | unknown | private-cloud and on-premise deployment; enterprise claim unverified |
| Salesforce Spiff | implements | unknown | positioning is "natively connected to Salesforce" and "days, not weeks"; complex or enterprise claim unverified |
| Oracle (Incentive Compensation) | partner network | likely in | Oracle Fusion enterprise suite |
| beqom | partner network | likely in | enterprise total-compensation positioning |
| Forma.ai | partner network | unknown | enterprise positioning unverified |

The final list is fixed only after live retrieval in WP2 step 4 and is logged in the owner review file. If all 12 qualify, the post has 12 sections, which is acceptable; the precedents have 8.

---

## 4. Change surface

| File | Change | WP |
|---|---|---|
| `scripts/lib/house-style.mjs` | add `PROOF_MARKER_RE`, `findProofMarkers(record, path?)`, `findProofMarkersInHtml(html)` (same scoping as `findInHtml`) | 1 |
| `scripts/lib/house-style.test.mjs` | new cases (section 5) | 1 |
| `scripts/lib/content-rules.mjs` | `validateNoProofMarkers` called from `validateBlogPost`, `validateCaseStudy` and `validateWhitePaper` when `draft !== true` | 1 |
| `scripts/lib/content-rules.test.mjs` | new cases (section 5) | 1 |
| `scripts/check-house-style.mjs` | marker scan over HTML and llms bodies, with a separate error heading; the OK line names both rules | 1 |
| `src/lib/solutions/index.ts` | throw on `findProofMarkers(s).length` next to `STUB`; import and register `quotaIncentiveAlignment` after `revenueTeams` | 1 |
| `src/lib/solutions/types.ts` | doc comment: markers are not written into source; gaps go in the owner review file | 1 |
| `src/lib/spmPlatforms.ts` | `SpmPlatform.related?: { label; href }[]` (same shape as `Solution.related`); `captivateiq`: +2 FAQ, `related`; `performio`: +1 `lanshoreAngle`, +2 FAQ, `related`; AI-status strings only if hygiene verification changes them (OQ10) | 1 |
| `src/app/spm/[slug]/page.tsx` | render `platform.related` by copying the markup at `src/app/solutions/[slug]/page.tsx:151-163` | 1 |
| `src/lib/solutions/spm-consulting.ts` | extension (WP1 step 5) | 1 |
| `src/lib/solutions/global-compliance.ts` | add `/solutions/spm-consulting` to `related`; `dateModified` | 1 |
| `src/lib/solutions/mid-market-implementation.ts` | +1 FAQ; `dateModified` | 1 |
| `src/lib/solutions/enterprise-crm-erp-integration.ts`, `ai-agents-sales-operations.ts` | CaptivateIQ MCP wording only if verification changes it (OQ10) | 1 |
| `src/lib/solutions/quota-incentive-alignment.ts` | **new** | 1 |
| `src/app/solutions/page.tsx` | rewrite `DESCRIPTION` to 160 characters or fewer, naming quota and incentive alignment (do not append to the current ~205 characters) | 1 |
| `content/blog/sales-finance-misalignment.md` | **new** guide | 1 |
| `content/SLUGS.lock.json` | append `sales-finance-misalignment` (WP1), `best-enterprise-spm-software-for-complex-incentives` (WP2), each in the same commit as its file | 1, 2 |
| `src/lib/contentDates.ts` | `UPDATED.spm` set to the real edit date (WP1, WP2); go-live date at publish | 1, 2, P |
| `docs/owner-review/aeo-hubspot-2026-10-12.md` | **new** owner review file (format in section 9); WP1 creates it, WP2 appends | 1, 2 |
| `content/blog/best-spm-service-partners-compared.md` | extension (WP2 step 3) | 2 |
| `content/case-studies/managed-services-commission-management.json` | `results[0]` becomes "Frequent calculation errors sharply reduced"; add `dateModified` (real date) | 2 |
| `content/blog/best-enterprise-spm-software-for-complex-incentives.md` | **new** | 2 |
| `src/app/spm/compare/page.tsx` | one sentence plus link after the table | 2 |
| `content/blog/modernizing-legacy-spm-systems.md` | one sentence plus link in Phase 2; `dateModified` | 2 |
| `src/app/spm/page.tsx`, `src/app/spm/compare/page.tsx`, rec 4 post | remove "supported through our partner network" **only if** Doug strikes it | P |

Not touched: `schema.ts`, `schema-nodes.mjs`, `ArticleView.tsx`, `sitemap.ts`, the llms routes, `Footer.tsx`, `next.config.ts`, studio files, `loadContent.ts` (no new public field, so `ADMIN_ONLY_FIELDS` is unaffected).

---

## 5. Test strategy

### Unit tests (ship with WP1)

`scripts/lib/house-style.test.mjs` (already in `test:rules`):

| Case | Expect |
|---|---|
| marker in `faq[2].answer` | `findProofMarkers` returns `["faq[2].answer"]` |
| lowercase and extra whitespace: `proof  point needed` | detected |
| no brackets | detected |
| negative: "each claim needs a proof point", "proof points matter" | not detected |
| numbers, booleans and null in the record | ignored, no throw |
| `findProofMarkersInHtml`: marker in visible text, `<title>`, meta `content`, JSON-LD | one hit each, correct `kind` |
| marker only in an HTML comment or a non-JSON-LD `<script>` | not detected |
| existing `findInHtml` em dash cases | unchanged, pass |

`scripts/lib/content-rules.test.mjs`:

| Case | Expect |
|---|---|
| published post with marker in body | error naming the field |
| same post with `draft: true` | no marker error |
| marker in `keyTakeaways[0]` | error names `keyTakeaways[0]` |
| published case study, marker in `whatWeDid` | error |
| published white paper, marker in `description` | error |
| existing valid fixtures (blog, case study, white paper) | still zero errors |

### Gate proof by negative injection (WP1; record output in the owner review file's verification log, then revert)

1. Marker in a `SOLUTIONS` entry: `npm run build` fails at module load.
2. Marker in a published blog record: `npm run check:content` fails.
3. Marker in `captivateiq.positioning`: prebuild passes, then `check:house-style` fails on `/spm/captivateiq`.
4. Revert all three; full regression green.

### Content gates (both WPs)
- `check:content` (mirror, itemList headings, sources, ledger L3, em dash, markers).
- Solutions module load.
- Postbuild: `check:headings`, `check:schema-mirror` M1/M2/M6, `check:house-style`, `check:dir-page`.

### Before and after counts (captured in WP1 step 1 and WP2 step 1; compared at each package's verify step)

Read from the built HTML JSON-LD. Before values are as of this plan; the implementer re-captures them, and any mismatch goes to the Lead before editing.

| Page | Measure | Before | After |
|---|---|---|---|
| `/spm/captivateiq` | FAQPage `mainEntity` length | 3 | 5 |
| `/spm/performio` | FAQPage `mainEntity` length | 2 | 4 |
| `/solutions/spm-consulting` | FAQPage `mainEntity` length | 5 | 6 |
| `/solutions/mid-market-implementation` | FAQPage `mainEntity` length | 5 | 6 |
| rec 2 post | FAQPage length; ItemList `numberOfItems` | 4; 8 | 5 or 6; number of firms after re-survey |
| site | `<url>` entries in `/sitemap.xml` | N | N + 3 |
| site | `/llms.txt` lines for solutions and guides | M | M + 2 |

In every case, visible FAQ entries must equal the `mainEntity` length (M1/M2 enforce this).

### Internal-link check (one-off script with explicit pass/fail)

Each package writes a throwaway script to the session scratchpad with the Write tool, not a Bash heredoc, because heredocs mangle backslashes. The script:
1. Imports `walkHtml` and `routeOf` from `scripts/lib/build-output.mjs`.
2. Builds the set of built routes.
3. For each page under test, extracts every `href="/..."`, strips `#fragment` and `?query`, and treats each as resolved if it is a built route, a file under `public/`, or one of `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/llms-full.txt`, `/opengraph-image`, or a metadata route the build writes as a `.body` file (`/favicon.ico`, `/apple-icon.png`).

Pages under test: the 3 new routes, the 5 extended pages, `/spm/compare`, `/solutions/global-compliance`, and the modernizing guide.

**PASS** = zero unresolved hrefs (exit 0). **FAIL** = list the unresolved hrefs and exit 1. Paste the output into the verification log. Not committed and not wired into postbuild; the sitewide baseline is unmeasured.

### Rec 6 platform-capability check (one-off, explicit pass/fail)

Run `node --experimental-strip-types` on a scratch script that imports `src/lib/solutions/quota-incentive-alignment.ts` and `src/lib/spmPlatforms.ts` (both have only type imports, which strip-types erases). It asserts that, for every slug in `platforms`, the matching `SPM_PLATFORMS[].capabilities` contains an entry matching `/territory and quota/i`.

**PASS** = exit 0. **FAIL** = print the offending slug and exit 1. Expected passing set: `varicent`, `xactly`, `captivateiq`, `sap-incentive-management`, `anaplan`, `akeron`. Output goes in the verification log.

### Claims audit (exact tokens, plus a human sign-off for numbers)

Scope: lines added on the branch, from `git diff main...HEAD -U0 -- content src/lib src/app`.
1. **Must be zero** (case-insensitive): `Sprint`, `T-Mobile`, `Gartner`, `Forrester`, `Magic Quadrant`, `certified`, `certification`, `preferred partner`, `premier`, `elite`, `platinum`, `partner tier`, `guarantee`, `eliminat`, `proof point needed`.
2. **Each hit must be logged** as a verbatim reuse with its origin: `PepsiCo`, `Grammarly`, `Micro Focus`, `PwC`, `partner network`, `partnership`.
3. **Numbers:** every added line containing a digit or `%` or `percent`, excluding front-matter dates and list-heading numerals such as `## 3.`, is listed in the owner review file with its origin (reused claim or dated source). The Lead records a sign-off line: `Numbers audit: <n> lines reviewed, all traced, <name>, <date>`. The audit is not complete without that line.

### UI verification (gate 8; the new `related` line on `/spm/[slug]` is a UI change)

Run the `verify` skill locally (build, serve, Playwright) on the 3 new routes, `/spm/captivateiq`, `/spm/performio`, `/spm/compare` and the rec 2 post:
- no horizontal page scroll at 375px (tables scroll inside their container);
- no heading step greater than one;
- empty console and `pageerror`;
- the `related` line renders zero DOM on the 7 platforms without `related`.

### Regression (each WP, before Ready)

`npm run check:content && npm run test:rules && npm run test:schema && npm run test:loaders && npm run test:auth && npm run test:redirects && npm run check:admin && npm run lint && npm run build`

### Coverage

WP1: run `node --test --experimental-test-coverage scripts/lib/house-style.test.mjs scripts/lib/content-rules.test.mjs` and record the changed-file rung for `house-style.mjs` and `content-rules.mjs` against the 80% bar. If that is impractical, file a `NO COVERAGE TOOL` waiver in `docs/waivers/`.

WP2: no logic lines change (one TSX sentence, content files), so coverage is "UNMEASURED / no changed logic lines".

---

## 6. Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Stale or wrong competitor and vendor facts | HIGH | Live retrieval, quoted sentences, URL and date in `sources` and the log. Re-fetch every existing rec 2 source. Bump `retrieved` only for sources actually re-fetched. The rec 2 "How we compared" sentence is rewritten so it stays true under mixed dates (WP2 step 3). |
| Pre-commit gate (plugin `precommit-gate.sh`) blocks commits | HIGH | Section 8.0. Checks 1 to 4 are mapped to concrete actions, the owner review file sits outside `docs/plans/`, and a bypass needs the user's env. |
| The studio publishes to `main` while the branch is open | MED | Section 8.0 freeze-or-rebase rule. Resolve `SLUGS.lock.json` conflicts by union. |
| Platform AI-status claims taken from model memory; on-site wording already disagrees (`spmPlatforms.ts` "announced; GA later in 2026" vs "coming soon" in two solution files) | MED | Hygiene step: live check, fix all three places together (OQ10), or log as unverifiable and change nothing |
| Widening rec 2 weakens its managed-services answer | MED | Keep the existing table and FAQs. Add a consulting-scope table and per-firm paragraphs. |
| Retitle churn on recently published pages | MED | Slugs unchanged everywhere. H1 unchanged on `spm-consulting` (OQ5). **Rec 2 is the one deliberate H1 change** (`post.title` renders as H1, `<title>`, breadcrumb and BlogPosting headline via `ArticleView.tsx:82`): new title "Best SPM Consulting and Service Partners Compared", 49 characters, which is 60 with " \| Lanshore". Existing key terms kept. |
| Fabricated or over-reaching Lanshore claims | HIGH without discipline | Section 3.6, claims audit with a numbers sign-off, Doug's sign-off before merge |
| Rec 4 vendor bias (the pool is platforms Lanshore works with) | MED | Pool and relationship disclosed in "How we compared". Explicit rule. Exclusions named with reasons. |
| `UPDATED.spm` restamps 11 URLs when only 3 changed | LOW | Accepted registry design. Per-platform dates are out of scope. |
| Metrics pre-commit hook | Known | Let the hook bump `VERSION` and the ledger. Never run `prepare_commit_metrics.py` by hand. Never stage `.claude/logs/subagents.log`. Never invent token counts. |
| Preview deploy availability is assumed, not verified | MED | Assumption A1 in section 9. Fallback is local `verify`. |
| Cannibalization if dispositions are ignored | MED | The section 2 table is binding. Any further new URL needs a plan change. |

---

## 7. Open questions and decisions

### Decisions (owner, 2026-10-12): all recommended defaults accepted

| OQ | Decision |
|---|---|
| OQ1 | Build in code. |
| OQ2 | Shipped listicle precedent re-confirmed for both "Best..." titles. |
| OQ3 | Doug's review required before merge. No inline markers; gaps go in the owner review file; the gate blocks markers in published records. |
| OQ4 | `datePublished` is the real go-live date on the 2 new articles; extensions bump only `dateModified`. No backdating. |
| OQ5 | Extend `spm-consulting`. H1 (`name`) unchanged; only `titleTag`, `metaDescription`, `firstSentence` change. |
| OQ6 | Extend the existing post, same slug. Inclusion rule: "firms publishing SPM platform implementation or support". The Alexander Group and Korn Ferry go under "Not listed". |
| OQ7 | New post. Vendors are derived from the section 3.7 rule applied to all 12 platforms Lanshore implements or supports; the final list is fixed after live retrieval. Oracle, beqom and Forma.ai, if they qualify, carry the existing live wording "supported through our partner network", logged as a reused claim for Doug to confirm or strike sitewide. |
| OQ8 | IDs not supplied. Use `"UNASSIGNED-2026-10-12"`; the publish step replaces it. |
| OQ9 | Approved: "sharply reduced the calculation errors", applied to the rec 2 post **and** the case study JSON. |
| OQ10 | Approved: update all three locations together if live verification changes the facts. |
| OQ11 | Noted only; an ADR when the sitewide rename is decided. |

### Owner change (Doug, 2026-10-13): rec 2 replaced

Doug replaced the WP2 rec 2 draft with his own post, five graphics (`public/images/spm-*.svg`, plus one PNG for the `image:` front matter) and owner-review rows (section (r2) of the owner file). This overrides the parts of WP2 step 2 and step 3 that he changed:
- Deloitte removed, with large systems integrators covered by category under "Not listed". The section 7 grandfathering amendment no longer applies.
- SpectrumTek added. The "Also qualifying" paragraph was dropped.
- The tables are restructured around five jobs, and there are 8 FAQs instead of 5 or 6.
- The OQ9 sentence is removed from rec 2. OQ9 still applies to the case study.

The Lead verified Doug's draft against the site and the live firm pages. Every factual correction is logged on its row and in the owner file's (f) WP2 log. Supersedes: the rec 2 counts target in section 5 ("5 or 6" FAQs) and the rec 2 parts of the WP2 Status row.

### Still open (need an answer, but do not block WP1)

- **A1 (assumption to confirm): Vercel builds a preview deploy for `aeo-hubspot-2026-10-12` that Doug can open.** If not, Doug reviews from local `verify` screenshots and the rendered HTML, with page links listed in the owner review file.
- **Partner-network wording:** Doug confirms or strikes it sitewide during review (OQ7). No action before then. If he strikes it, the publish step **rewrites** (not deletes) the `/spm` sentence at `src/app/spm/page.tsx:97-99`, which also carries the Iconixx/Incentivate clause and the "talk to us" link, and the `/spm/compare` FAQ answer at lines 57-59 (emitted in FAQPage JSON-LD). It then removes any unused `NEAR_MISS_VENDORS` imports so lint stays green.
- **Incentivate is described two ways on the live site** (logged in owner review category (b), does not gate WP1): `/spm` says "legacy estates on Iconixx and Incentivate" are supported through the partner network, while `SPM_PLATFORMS` has a full Incentivate implementation entry. Rec 4's "Lanshore relationship" column uses the `SPM_PLATFORMS` position (implements), and Doug decides the sitewide wording. Iconixx is not added to the rec 4 pool.
- **Claims-audit exception path:** a "must be zero" token that appears inside a **quoted, sourced vendor or firm claim**, or as a false positive (for example "sprints"), is allowed only when the Lead logs it in the owner review verification log with source URL and date. Paraphrasing a sourced claim to dodge the audit is not allowed.
- **Rec 2 cap tie-break:** if more than 10 firms qualify, keep those that publish **both** implementation and post-implementation services, then those cited in HubSpot's competitor list, then alphabetical. Name the rest under "Not listed (cap)".
  - **Amended 2026-10-12 (Lead, during WP2):** the vendors' partner directories list about 35 more firms, so a literal tie-break would drop already-published firms (Delbridge, IncentiveOps, WorkCentive) on alphabet alone, contradicting the section 6 mitigation "Keep the existing table". The existing 8 are therefore kept, subject to live re-verification. A firm that now fails the rule moves to "Not listed" with its reason. The tie-break fills only the 2 remaining slots. "Also qualifying" names only firms whose own page was fetched and meets the rule; the rest of the directories are covered by one sentence that links them as not assessed.
- **Follow-ups found in WP2 (out of scope, not blocking):**
  - SAP now names the product "SAP Incentive Management". The rec 4 post uses the new name and explains it, while Lanshore's own pages keep "SAP SuccessFactors Incentive Management", and `spmPlatforms.ts` `officialUrl` for SAP returns 404.
  - Varicent's partner directory carries an outdated Lanshore description (off-site).
  - The rec 4 "Not listed" section came out empty: all 12 platforms met the rule (residual risk accepted in the review). Salesforce Spiff is the closest call and is flagged for Doug.
- **Reverting WP1 alone** also conflicts in `content/SLUGS.lock.json`; resolve by union, the same as the `UPDATED.spm` rule.

---

## 8. Work packages

### 8.0 Commit and gate rules (apply to WP1, WP2 and the publish step)

**Commits:**
- **One commit per WP, plus one for the publish step.** Each commit leaves the build green and can be reverted on its own. Revert order is publish, then WP2, then WP1. If WP1 is reverted while WP2 is in place, resolve the `UPDATED.spm` line to the later date.
- **Ledger edits travel in the same commit as their content file** (L3).
- The **Lead** commits; implementers do not. Implementers report back with the diff and the verification evidence.

**Pre-commit gate (plugin `precommit-gate.sh`).** Before every commit:
- **Check 1 (no checkbox lines in the plan):** this plan has none. Keep it that way, and track progress only in the section 10 table.
- **Check 2 (review exists) and Check 3 (review newer than plan):** the Lead re-runs `lanshore-claude-workflow:cold-review` on this plan after the last plan edit, so `docs/plans/aeo-hubspot-recs-2026-10-12.review.md` is newer than the plan.
- **Check 4 (`.claude/.verify-passed-<session>`):** written **only** by the user-invoked `/pre-pr` skill (step 6), which has `disable-model-invocation: true`. The `verify` skill does not write it, and the Lead cannot run `/pre-pr`. The user types `/pre-pr` in the same session as the commit. `/pre-pr` also stops on a stale review and runs `/security-review` (the diff path contains "commission").
- **Mandatory sequence for every commit (all within 24 hours, because the gate only sees a plan modified in the last 24 hours, so a plan untouched for longer fails with "No recent plan file"):**
  1. Lead updates the section 10 Status row. This edit also refreshes the plan's mtime.
  2. Lead re-runs cold review. **If the re-run is not APPROVE, do not commit**: fix the plan or the work and re-run. A NOT READY review would still pass Check 3, which compares timestamps only, so this rule is what stops it. Because each re-run overwrites the review file, the branch's first commit preserves the original APPROVE in git history.
  3. User runs `/pre-pr`.
  4. Lead commits.
- **If Check 4 cannot be satisfied** (for example, the user cannot run `/pre-pr` in the commit session), the commit uses `LANSHORE_SKIP_GATE='<recorded reason>'`. That variable must be in Claude Code's own process env, so it **needs the user's environment**: the Lead asks the user and gives them the exact commit command to run with `!`. The skip is logged to `.claude/audit/skips.log`. Never route around the gate with a wrapper.
- The gate picks "the most recent plan" as any non-review `docs/plans/*.md` modified within 24 hours, taking the first one `find` returns. Do not edit any other plan file in `docs/plans/` within 24 hours of a commit on this branch, or the gate may evaluate the wrong plan.

**Branch setup (Lead, before WP1):**
1. Create `aeo-hubspot-2026-10-12` from current `main`.
2. Follow the mandatory commit sequence above (Status row, cold review, `/pre-pr`, commit). Commit the plan and its review as the branch's first commit.

**Studio freeze or rebase rule:** while the branch is open, ask the owner not to Publish, Unpublish or Delete in the studio admin, because it commits straight to `main` (`src/lib/studio/github.ts:115`). If a studio commit lands anyway, the Lead rebases the branch onto `main` before the next branch commit, resolving `content/SLUGS.lock.json` by union of both lists and re-running `check:content`. The branch is rebased onto `main` once more before merge.

**Package order:** two packages, one implementer each, end to end with tests. WP2 runs after WP1 is committed on the branch: both touch `SLUGS.lock.json` and `UPDATED.spm`, and WP2's content must pass WP1's gate. The publish step (section 9) is not a package now; the Lead runs or dispatches it once Doug's sign-off exists.

### WP1: Proof-marker gate plus Lanshore-voice pages (recs 1, 3, 5, 6)

1. **Baseline.** On the branch, run the full regression command and record it green. Capture the "before" column of the section 5 counts table from the built HTML. Anything already red, or any count mismatch, goes to the Lead before editing.
2. **Gate.** Add `PROOF_MARKER_RE`, `findProofMarkers` and `findProofMarkersInHtml` to `scripts/lib/house-style.mjs`. Add `validateNoProofMarkers` to `scripts/lib/content-rules.mjs` and call it from the blog, case study and white paper validators, skipped when `draft === true`. Add the throw in `src/lib/solutions/index.ts`. Add the scan in `scripts/check-house-style.mjs`. Update the `types.ts` doc comment. Write the section 5 unit tests. `npm run test:rules` is green.
3. **Hygiene (not a rec): platform AI-status check.** From the vendors' own pages, check CaptivateIQ (Agents status, MCP server status) and Performio (MCP server, the "first in the ICM category" claim, AI Implementation Agents). Quote and log in the owner review file. If anything changed, update `spmPlatforms.ts` and the MCP wording in `enterprise-crm-erp-integration.ts` and `ai-agents-sales-operations.ts` together (OQ10). If it cannot be verified, change nothing and log that.
4. **Rec 3.**
   - Add optional `related` to `SpmPlatform` and render it in `src/app/spm/[slug]/page.tsx`; it renders zero DOM when absent.
   - `captivateiq`: +2 FAQ. The first covers moving commissions from spreadsheets to CaptivateIQ: the steps, the parallel run, and the 10-to-14-week figure stated as platform-agnostic. The second covers what Lanshore integrates around it, using only published integration claims. Add `related`.
   - `performio`: +1 `lanshoreAngle` bullet (migration from spreadsheet commissions with parallel runs), +2 FAQ, `related`.
   - `mid-market-implementation`: +1 FAQ ("Does Lanshore implement CaptivateIQ and Performio for teams leaving spreadsheets?"), bringing it to 6, plus `dateModified`.
   - Set `UPDATED.spm` to the edit date. Partnership wording per section 3.6.
5. **Rec 1.** Extend `spm-consulting.ts`:
   - +1 problem: global plans whose controls cannot be evidenced across countries.
   - +2 or 3 `howWeDeliver` steps: audit-ready analytics (traceability, reconciliation to finance, approval evidence, variance reporting, consistent with the audit-ready guide); CRM and ERP integration, pointing to the integration solution; governed global rollout in waves, reusing the PepsiCo claim verbatim.
   - +1 FAQ (what makes incentive compensation analytics audit-ready), staying at 6 or fewer.
   - Add 3 links to `related` (section 2).
   - `titleTag` (60 characters or fewer), `metaDescription` (140 to 160) and `firstSentence` gain "audit-ready" and "global incentive plans" and keep "complex compensation plans". `name` is unchanged (OQ5).
   - `dateModified`.

   In `global-compliance.ts`, add the `related` link and bump `dateModified`.
6. **Rec 6.** Create `src/lib/solutions/quota-incentive-alignment.ts`:
   - `name` "SPM for Quota and Incentive Alignment"; `titleTag` "SPM for Quota and Incentive Alignment | Lanshore"; `hubspotId: "UNASSIGNED-2026-10-12"`.
   - `firstSentence` answers first and names Lanshore.
   - **4 problems, alignment only:** quotas set from the finance number rather than territory potential; plan measures that differ from the quota measure; crediting that does not match quota assignment; mid-year territory and quota changes that never reach crediting. Write them fresh. **No visibility or dashboards problem**; that is `revenue-teams`' offer.
   - **5 delivery steps:** alignment assessment against one territory master, roster, assumption set and calendar; reconciling quota methods; mapping plan measures to quota; crediting configured in the platform; planning calendar and change control. **No dashboards step.** One sentence points to `/solutions/revenue-teams` for in-period visibility.
   - `platforms`: `varicent`, `xactly`, `captivateiq`, `sap-incentive-management`, `anaplan`, `akeron` (confirmed by the section 5 capability check).
   - `relatedCaseStudies` only where the case-study JSON genuinely relates; empty is allowed.
   - `related` per section 2, including `revenue-teams`. 4 to 6 FAQs.

   Register it after `revenueTeams`. Rewrite the `DESCRIPTION` in `src/app/solutions/page.tsx` to 160 characters or fewer.
7. **Rec 5.** Create `content/blog/sales-finance-misalignment.md`:
   - **Front matter:** `title: 'The Complete Guide to Sales-Finance Misalignment'`, description, `dateModified` (authoring date), **no** `datePublished`, `author: doug-erb`, `kind: guide`, `featured: false`, `summary`, 4 or 5 `keyTakeaways`, 5 `faq` entries mirrored verbatim under "## Frequently asked questions" as `###` questions.
   - **Body:** an answer-first opening, then a **short** "how misalignment shows up in attainment" section (2 or 3 sentences linking `/blog/how-spm-affects-quota-attainment` and `spm-alignment-quota-accuracy`, not re-explaining their mechanisms or quota methods).
   - **Root causes, each a `##`:** targets; measures (bookings vs billings, revenue or cash); incentive logic outside the comp budget; data flows (CRM, SPM and ERP disagree); timing (close and accrual calendars, retroactive changes); governance (decision rights, exception approval).
   - **Then:** a symptom-to-cause table; a sequence to fix it; where platforms and agents fit ("Agentic SPM"); How Lanshore helps; the FAQ.
   - **Constraints:** no accounting or legal advice (a one-line "confirm with your finance and audit advisers"), no unsourced statistics, no Gartner.

   Append the slug to `SLUGS.lock.json`.
8. **Gate proof.** Run the three negative injections from section 5, record the output, revert.
9. **Owner review file.** Create `docs/owner-review/aeo-hubspot-2026-10-12.md` in the section 9 format, with the WP1 rows.
10. **Verify.**
    - Full regression green.
    - Counts table "after" values match.
    - Internal-link check PASS.
    - Rec 6 capability check PASS.
    - Claims audit with the numbers sign-off line.
    - `verify` skill on the WP1 routes.
    - Coverage rung recorded or waiver filed.

    Report to the Lead for the WP1 commit (section 8.0).

**Ships with:** section 5 unit tests (house-style and content-rules) and the negative-injection evidence.
**Verify:** `npm run test:rules && npm run check:content && npm run lint && npm run build`, then the full regression command.

### WP2: Comparison content (rec 2 extension, rec 4 new post absorbing rec 7, OQ9 fix)

Depends on the WP1 commit being on the branch.

1. **Baseline.** Full regression green. Re-capture the rec 2 and sitemap rows of the counts table.
2. **Rec 2 firm re-survey and retrieval.**
   - **Discovery sources:** (a) the existing 8 firms; (b) the firms behind the competitor pages HubSpot cites for these recs (OpenSymmetry, Spaulding Ridge and Deloitte are known; ask the Lead for the full list from the export, or record "not available"); (c) the published implementation-partner pages of Varicent, Xactly and CaptivateIQ.
   - **Rule (OQ6):** the firm's own site publishes SPM platform implementation or post-implementation support services. **Excluded and named under "Not listed" with the reason:** plan-design-only consultancies (The Alexander Group, Korn Ferry) and vendor-owned professional services arms (for example Varicent's), because they are vendors, not independent partners.
   - **Cap (superseded by the section 7 amendment of 2026-10-12: the existing 8 are grandfathered and the tie-break fills only the remaining slots):** if more than 10 firms qualify, the main list keeps the firms that publish both implementation and post-implementation services. The other qualifying firms are named in an "Also qualifying" paragraph, one line each.
   - **Retrieval:** for every listed firm, fetch its consulting, implementation, plan-design and global pages, and re-fetch every existing source. Log quotes, URLs and dates. Log the survey (who was considered, the verdict, the reason) in the owner review file.
3. **Extend `content/blog/best-spm-service-partners-compared.md`:**
   - **Header copy:** title "Best SPM Consulting and Service Partners Compared" (no year: keeps `<title>` at 60 characters or fewer and avoids annual staleness; "2026" may appear in the description and opening); description, summary and answer-first opening widened to consulting plus managed services; `keyTakeaways` revised (6 or fewer).
   - **"How we compared":** state the new inclusion rule and the discovery sources. Replace the sentence "retrieved on 2 October 2026" with one that stays true under mixed dates, for example: "Every claim about a firm comes from that firm's own pages; each page is listed in the sources below with the date we retrieved it."
   - **Tables and firm sections:** keep the existing table. Add "Consulting scope at a glance" (Firm | Plan design and redesign | Analytics and integration | Global programs and governance | Implementation approach), with every cell "(as published)" or "Not published". Add a "**Consulting scope.**" paragraph to each firm section.
   - **Lanshore entry:** its own published pages only. The managed-services result becomes "sharply reduced the calculation errors" (OQ9).
   - **FAQ and links:** +1 or 2 consulting FAQs, mirrored in the body. Update `itemList` to the final firm headings, alphabetical. Add a link to `/solutions/spm-consulting`.
   - **Dates:** in `sources`, add new URLs and bump `retrieved` only where re-fetched. `dateModified` is the edit date; `datePublished` is unchanged.
4. **OQ9 case study.** In `content/case-studies/managed-services-commission-management.json`, change `results[0]` to "Frequent calculation errors sharply reduced" and add `dateModified` (the real edit date). Confirm that `caseStudySchema` `abstract` and the page reflect it in the build.
5. **Rec 4 vendor retrieval.** Apply the section 3.7 rule to all 12 platforms using each vendor's own pages: enterprise or complex-plan positioning (the inclusion sentence), comp-plan complexity, analytics, integrations, governance and audit, published pricing, stated implementation time. Log each verdict and its stating sentence.
6. **Create `content/blog/best-enterprise-spm-software-for-complex-incentives.md`**, modeled on `best-spm-platforms-for-spreadsheet-replacement.md`.
   - **Front matter:** `comparison: true`, `sources`, `itemList` (exact numbered headings, alphabetical, qualifying vendors only), `keyTakeaways`, 4 or 5 `faq` entries (including "What is the best SPM software for complex enterprise incentive plans?" and "What are the options for replacing a legacy SPM system?"), `author: doug-erb`, **no** `datePublished`.
   - **"How we compared":** state the candidate pool (the 12 platforms Lanshore implements or supports), the inclusion rule, the evidence rule, and that the order is alphabetical, not ranked.
   - **Disclosure:** Lanshore implements the 9 named platforms and resells none of them. Oracle, beqom and Forma.ai are described only as "supported through our partner network", the existing live wording, logged as a reused claim.
   - **"Not listed":** every excluded platform, with its reason.
   - **"Comparison at a glance" table:** includes a "Lanshore relationship" column.
   - **Vendor sections:** one `## N. Vendor` per vendor, with Strengths, Best for and Watch out for.
   - **`## Replacing a legacy SPM system` (rec 7):** where legacy fails, linking the two legacy posts; replace vs re-platform vs augment, linking the modernizing guide's Phase 2; what modern platforms improve, stated only where sourced.
   - **Close:** How Lanshore helps; the FAQ.
   - Lanshore is not listed as a vendor. No analyst citations.

   Append the slug to `SLUGS.lock.json`.
7. **Cross-links.** Add one sentence and a link after the table in `src/app/spm/compare/page.tsx`, and set `UPDATED.spm` to the edit date. Add one sentence and a link in the modernizing guide's Phase 2, and bump its `dateModified`.
8. **Owner review file.** Append rows: competitor and vendor claims (entity, claim, URL, date), the rec 2 firm survey, the rec 4 inclusion verdicts, the partner-network reused claim, and the OQ9 wording change.
9. **Verify.**
   - Full regression green.
   - Counts match (ItemList count equals the number of headings; M6 passes).
   - Internal-link check PASS.
   - Claims audit with the numbers sign-off.
   - `verify` skill on the rec 2 and rec 4 posts, `/spm/compare` and `/case-studies/managed-services-commission-management`; tables scroll inside their container at 375px.

   Report to the Lead for the WP2 commit.

**Ships with:** no new unit tests (no new logic). Content is gated by `check:content`, `check:schema-mirror` M1/M2/M6 and the WP1 marker gate.
**Verify:** `npm run check:content && npm run lint && npm run build`, then the full regression command.

---

## 9. Owner review and publish step (owner-gated; not a package until Doug signs off)

**Owner review file format (`docs/owner-review/aeo-hubspot-2026-10-12.md`).**
- One table per category:
  - (a) new Lanshore claims;
  - (b) reused claims, including "supported through our partner network";
  - (c) proposed proof points not yet written, each with the exact sentence and insertion point;
  - (d) competitor and vendor claims with URL and date;
  - (e) firm survey and vendor inclusion verdicts;
  - (f) verification log: injections, link check, capability check, numbers sign-off.
- Every row in (a) to (e) has a `Decision` column that starts as `UNDECIDED`. Doug's allowed values are `APPROVE`, `EDIT: <replacement text>` or `STRIKE`.
- **Sign-off is complete when** `grep -c UNDECIDED docs/owner-review/aeo-hubspot-2026-10-12.md` returns 0 **and** the file ends with the line `Signed off: Doug Erb, <YYYY-MM-DD>`. The user records that line when relaying Doug's answers; agents never write it.

**Review medium (assumption A1).** A Vercel preview of the branch, if available. Fallback: screenshots from local `verify` plus the rendered HTML.

**Publish step (one commit):**
1. Apply every `EDIT` and `STRIKE`. If the partner-network claim is struck, remove it from the rec 4 post, `src/app/spm/page.tsx` and `src/app/spm/compare/page.tsx`.
2. Set `datePublished` and `dateModified` to the real go-live date on the 2 new articles.
3. Set every changed record's `dateModified` to the go-live date: `spm-consulting`, `global-compliance`, `mid-market-implementation`, `quota-incentive-alignment`, the rec 2 post, the modernizing guide, the case study, plus `enterprise-crm-erp-integration` and `ai-agents-sales-operations` if they changed.
4. Set `UPDATED.spm` to the go-live date.
5. Replace `hubspotId: "UNASSIGNED-2026-10-12"`.
6. Rebase onto `main` (section 8.0). Run the full regression, the internal-link check and the `verify` pass. Follow the section 8.0 mandatory commit sequence (Status row, cold review APPROVE, user `/pre-pr`, commit, all within 24 hours). Then merge.
7. Mark the 7 HubSpot recs complete against the section 2 URLs. Update the auto-memory note on HubSpot recs.

## 10. Status

| Step | State | Notes |
|---|---|---|
| Plan | Approved (cold review pass 2, 2026-10-12) | Four pass-2 amendments applied by Lead |
| Branch setup | Branch created 2026-10-12 | Plan + review commit deferred to just before the WP1 commit, under the same user `/pre-pr` marker (a docs-only `/pre-pr` would check nothing); still committed separately and first |
| WP1 | Committed 8a4f6a9 (plan + review in 40a4033), 2026-10-12 | Full regression green (test:rules 70 to 91); coverage house-style 100% / content-rules changed lines covered; verify 10 routes at 1280 and 375 px clean; internal links 0 unresolved; claims audit 0 hits, numbers audit signed by Lead; CaptivateIQ wording updated from live vendor pages (d1-d3, re-checked by Lead) |
| WP2 | Implemented 2026-10-12; rec 2 replaced by Doug's draft and re-verified 2026-10-13; awaiting commit | Rec 2 (Doug's version): 10 firms, 8 FAQs, 5 graphics, verified live and corrected (owner file (r2) and (f)); regression green 2026-10-13, 358 internal links, 0 unresolved; verify PASS incl. images at 375px. Original WP2 note: rec 2 listed 10 firms (existing 8 re-verified + Ackle, Blue Horizons), rec 4 lists 12 platforms; ItemList = headings on both; 353 internal links, 0 unresolved; claims audit 0 hits; numbers audit signed by Lead after re-fetching prices; verify PASS incl. /spm |
| Owner review | WP1 rows: user relayed "Doug approved" 2026-10-12. Rec 2: Doug sent a replacement 2026-10-13 (rows r2, still UNDECIDED) | Needs Doug's decisions on the (r2) rows (including the Lead corrections) and on the rec 4, case-study and cross-link rows; then the sign-off line |
| Publish | Not started | Blocked on sign-off |

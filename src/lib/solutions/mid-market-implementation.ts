import type { Solution } from "./types";

const solution: Solution = {
  slug: "mid-market-implementation",
  hubspotId: "255749504",
  name: "Mid-Market SPM Implementation Services",
  titleTag: "Mid-Market SPM Implementation Services | Lanshore",
  metaDescription:
    "Mid-market SPM implementation and migration from Lanshore: right-sized Varicent and Xactly builds, data migration, parallel runs, and adoption support.",
  firstSentence:
    "Lanshore delivers mid-market SPM implementation services for revenue teams moving off spreadsheets onto a platform such as Varicent or Xactly, or migrating from one platform to another. Each engagement is sized to your plans and your team: scoping built from the plans you actually pay, data migration with history, parallel runs that prove payouts match before cutover, and adoption work so admins and reps trust the new statements.",
  whoItIsFor:
    "Mid-market companies that pay variable compensation to a sales team but do not have a large comp operations function. Often the work is shared by one or two administrators, a RevOps lead, and a finance partner. Typical starting points are an Excel model that has outgrown the person who built it, a first platform deployment that nobody on staff fully understands, or a contract renewal that makes a move between Xactly and Varicent worth evaluating. It also fits teams whose plans change every year and cannot afford an outside project for every change.",
  problems: [
    {
      title: "Spreadsheets that have outgrown the plan",
      body: "Excel works until the plan adds tiers, splits, clawbacks, and mid-year territory changes. Then errors creep into payouts and reps start keeping their own spreadsheets to check yours. In one mid-market engagement, variable pay ran entirely in Excel and errors were eroding rep trust. Lanshore implemented a platform sized to the plans, migrated the spreadsheet logic, and ran change management; Excel-based administration was retired and rep trust in statements was rebuilt.",
    },
    {
      title: "An enterprise-sized build for a mid-market team",
      body: "A configuration designed for a large comp operations team is a liability for a team of two. Overbuilt hierarchies, custom scripts, and undocumented workarounds mean every plan change needs an outside consultant. For one procurement technology provider, every plan change required third-party services. Lanshore restructured the configuration for maintainability and set up a flexible support model, so plan changes now ship in days instead of procurement cycles, at lower cost per change.",
    },
    {
      title: "Migrations that put payouts and history at risk",
      body: "Plan rules rarely map one to one between platforms such as Xactly and Varicent. Details such as rounding order, tier boundaries, crediting overrides, and draw recovery can be handled differently from one platform to the next, and statement history is still needed for clawbacks, disputes, and audit. The real risk in a platform move is not the configuration. It is a first live cycle that pays people differently from the old system, with nobody able to explain why.",
    },
    {
      title: "No one to run the cycle after go-live",
      body: "Implementation teams leave at go-live, and mid-market comp teams are thin. If the one administrator who understands the platform is out during close, the cycle slips. One telecom services provider ran commissions in a manual Excel process with frequent errors and no in-house resources to fix it. Lanshore took over commission operations as a managed service, sharply reduced the calculation errors, and established structured reporting without new headcount.",
    },
  ],
  howWeDeliver: [
    {
      title: "Scope from the plan documents",
      body: "We inventory every plan component, crediting rule, data source, and manual adjustment you make today, then decide what the platform should calculate and what should stay outside it. Scope is driven by your plan count, payee count, and data sources, not a template. If the platform is not chosen yet, we run a platform-agnostic assessment first. Lanshore implements nine SPM platforms and resells none of them.",
    },
    {
      title: "Build a configuration your team can maintain",
      body: "We configure plans, crediting hierarchies, and the feeds from your CRM, HR system, and ERP, keeping the build as simple as the plans allow so your administrator can make routine changes without us. Every rule is documented against the plan clause it implements. On Varicent or Xactly, that means using native features where they exist instead of custom logic that only the original builder can follow.",
    },
    {
      title: "Migrate logic and history",
      body: "For a spreadsheet start, we rebuild the workbook logic in the platform and reconcile it to historical payouts. For a platform move, agents translate plan rules where the structure carries over, and consultants who know both systems rebuild what has no equivalent. Statement history and the audit trail move with the plans. Our SPM Operations demo walks through an Xactly-to-Varicent migration of this kind on fictitious data.",
    },
    {
      title: "Prove it with parallel runs",
      body: "Before cutover, the old process and the new platform calculate the same periods side by side. Every payee is reconciled, and every variance is traced to a cause, such as a rounding order or a tier boundary, and a decision on which system is right. Cutover happens when the remaining differences are explained and signed off. When Grammarly moved off spreadsheets, with more than 1,000 payees on 3 plan types, one parallel-run cycle was reconciled to the spreadsheet results before cutover. It surfaced a handful of crediting-date differences, all traced to the old spreadsheet, and Grammarly cut over on schedule.",
    },
    {
      title: "Drive adoption, then hand over or operate",
      body: "We train administrators to run the cycle and make plan changes, and walk managers and reps through the new statements before the first live payout. After go-live you choose: your team runs the platform with documentation and support from us, or Lanshore runs the cycle as a managed service, with agents doing the repetitive work and our consultants handling the judgment calls. Grammarly moved comp administration to Lanshore managed operations after go-live. Monthly close went from about eight business days on spreadsheets to three on the platform, and statement corrections after release fell to near zero within the first two quarters.",
    },
  ],
  platforms: ["varicent", "xactly", "captivateiq", "performio"],
  relatedCaseStudies: [
    "spreadsheet-to-spm-platform",
    "flexible-spm-for-changing-business",
    "managed-services-commission-management",
  ],
  related: [
    { label: "How to Choose Sales Performance Management Software", href: "/resources/guides/choosing-spm-software" },
    { label: "Modernizing Legacy SPM Systems in 2026", href: "/resources/guides/modernizing-legacy-spm-systems" },
    { label: "SPM Operations demo: Xactly-to-Varicent migration", href: "/agentic-spm/operations/demo" },
  ],
  faq: [
    {
      question: "Does Lanshore migrate companies from Xactly to Varicent?",
      answer:
        "Yes. Migrations onto Varicent from Xactly, SAP Commissions, and spreadsheets are a core Lanshore service, and Lanshore also migrates teams onto Xactly or from Xactly to another platform when requirements change. Each migration includes plan rule translation, history migration, and parallel runs before cutover.",
    },
    {
      question: "What is a parallel run in an SPM implementation?",
      answer:
        "A parallel run calculates the same pay periods in the old process and the new platform at the same time and compares the results payee by payee. Every difference is traced to a cause and resolved before cutover, so the first live statements match what people expect or the change is explained in advance.",
    },
    {
      question: "How long does a mid-market SPM implementation take?",
      answer:
        "It depends on how many plans and payees you have, how many data sources feed the calculation, and whether statement history has to migrate. Lanshore scopes the timeline after an assessment of your plans and systems rather than quoting a standard duration, because a two-plan spreadsheet migration and a multi-plan platform move are very different projects.",
    },
    {
      question: "Do we need a dedicated comp operations team to run an SPM platform?",
      answer:
        "No, but someone must own the monthly cycle. Mid-market teams usually choose between training an existing administrator with Lanshore support behind them, or having Lanshore run comp operations as a managed service with agents handling the repetitive steps and a person approving what matters.",
    },
    {
      question: "Can Lanshore help us choose between Varicent and Xactly?",
      answer:
        "Yes. Lanshore is platform-agnostic and resells none of the platforms it implements. A platform assessment compares candidates against your plan complexity, data sources, team size, and budget, and ends in a recommendation and a rollout plan either way.",
    },
  ],
  dateModified: "2026-10-02",
};

export default solution;

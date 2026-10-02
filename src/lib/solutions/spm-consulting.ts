import type { Solution } from "./types";

const solution: Solution = {
  slug: "spm-consulting",
  hubspotId: "255671903",
  name: "SPM Consulting for Complex Compensation Plans",
  titleTag: "SPM Consulting for Complex Comp Plans | Lanshore",
  metaDescription:
    "SPM consulting for complex compensation plans: plan design review, requirements, platform fit, build, testing, and hypercare by Lanshore on nine SPM platforms.",
  firstSentence:
    "SPM consulting for complex compensation plans turns a plan document that strains out-of-the-box configuration into calculation logic that pays correctly and survives an audit. Lanshore does this end to end: plan design review, requirements, platform fit, build, testing, and hypercare, on any of nine SPM platforms, backed by 15+ years of incentive compensation delivery.",
  whoItIsFor:
    "Sales compensation, RevOps, and finance leaders at enterprises whose plans have outgrown standard templates: multi-level crediting with overlay roles, team splits, accelerators that interact with caps, clawbacks and draws, retroactive quota changes, or several plan populations running at once. It fits teams selecting a first SPM platform, teams whose current implementation produces numbers nobody trusts, and teams facing a re-platform. It assumes you need someone accountable for the calculations, not a slide deck about them.",
  problems: [
    {
      title: "The plan document and the configuration disagree",
      body: "Many calculation errors start as ambiguity in the plan document: a crediting rule two readers interpret differently, an undefined effective date, an edge case nobody wrote down. Configuration then encodes one interpretation silently. Disputes follow, and every fix becomes a manual override. Good consulting resolves those ambiguities in writing, with comp, sales, and finance signing off, before anyone builds anything.",
    },
    {
      title: "Out-of-the-box configuration stops short",
      body: "SPM platforms handle standard quota-and-rate plans well. Complexity shows up in crediting hierarchies, overlay and team splits, mid-period territory moves, multi-year deals, and payout caps that interact with accelerators. When a platform's native objects cannot express a rule, teams bolt on spreadsheets. The better answer is deliberate design: configure what the platform does natively and build the rest as a documented, tested extension.",
    },
    {
      title: "Numbers that cannot survive an audit",
      body: "Finance and audit need to trace any payout back to its source transactions, the plan rule applied, and every adjustment made along the way. Implementations built under deadline pressure often lose that trail: overrides with no approver, manual uploads with no reconciliation, logic changed mid-year with no version history. Rebuilding auditability later costs far more than designing it in from the start.",
    },
    {
      title: "A platform chosen on a demo",
      body: "Vendor demos show clean data and simple plans. Real fit is decided by your hardest plan component, your transaction volumes, your CRM and ERP landscape, and who will administer the system after launch. Selecting on feature lists rather than on those constraints is a common reason implementations stall, accumulate workarounds, or get replaced sooner than planned.",
    },
    {
      title: "Go-live without a safety net",
      body: "Cutting over the month the build finishes, without a parallel run against the existing process, makes the first live payroll the real test. Discrepancies then surface as rep complaints instead of test defects, often after the team that built the system has moved on. Trust in statements, once lost in the first cycles, is slow to rebuild.",
    },
  ],
  howWeDeliver: [
    {
      title: "Plan design review",
      body: "We read every plan document, SPIF, and policy memo in force, then map each component to its data source and calculation rule. Ambiguities, conflicting clauses, and rules that create unintended incentives come back to you as a written list with recommendations. Where the design itself should change, we propose options and model their cost before anything is configured. [PROOF POINT NEEDED: anonymized example of a plan-document ambiguity found in a Lanshore design review and its payout impact]",
    },
    {
      title: "Requirements and data mapping",
      body: "We document crediting rules, hierarchies, effective dating, adjustments, approvals, and reporting needs as testable requirements, and map the source fields in your CRM, ERP, HRIS, and spreadsheets that feed them. Data gaps are named here, not discovered during testing. The output is a requirements set your finance and audit teams can review line by line.",
    },
    {
      title: "Platform fit",
      body: "Lanshore is platform agnostic and resells none of the SPM platforms it implements. If you are choosing, we evaluate vendors against your hardest plan components, data volumes, and administration model, ending in a scored recommendation and rollout roadmap. If you already own a platform, we decide what it should handle natively and what belongs in a documented extension, such as a custom app or integration.",
    },
    {
      title: "Build",
      body: "Our consultants configure calculations, crediting, hierarchies, integrations, statements, and reports, with audit trails and approval steps designed in rather than added later. Plan logic is built from the agreed requirements, so every rule traces back to a signed-off decision. Everything we deliver is documented and owned by you, with no black boxes and no dependency by design.",
    },
    {
      title: "Testing and parallel runs",
      body: "We test each rule against expected results, including edge cases such as mid-period transfers, splits, clawbacks, and retroactive changes. Then we run full periods in parallel with your existing process and reconcile every variance to a root cause. Cutover happens when the variances are explained, not when the calendar says so. [PROOF POINT NEEDED: parallel-run reconciliation result from a recent Lanshore implementation, such as variances found and resolved before cutover]",
    },
    {
      title: "Hypercare and handover",
      body: "The first live cycles are supported by the team that built the system: we monitor calculations, triage disputes, and fix defects while your administrators take over. You can then run the platform yourselves, or move to Lanshore managed services, where we run the monthly cycle with AI agents doing the repetitive work under human review.",
    },
  ],
  platforms: [
    "varicent",
    "xactly",
    "captivateiq",
    "sap-incentive-management",
    "anaplan",
    "salesforce-spiff",
    "performio",
    "akeron",
    "incentivate",
  ],
  relatedCaseStudies: [
    "commission-architecture-redesign",
    "spm-build-on-existing-systems",
    "spreadsheet-to-spm-platform",
    "flexible-spm-for-changing-business",
  ],
  related: [
    {
      label: "Enterprise SPM Consulting for Audit-Ready Analytics",
      href: "/resources/guides/enterprise-spm-consulting-audit-ready-analytics",
    },
    {
      label: "7 questions to vet an enterprise SPM partner",
      href: "/blog/7-questions-to-vet-an-enterprise-spm-partner",
    },
    {
      label: "Enterprise SPM Managed Services for Complex Incentives",
      href: "/solutions/spm-managed-services",
    },
  ],
  faq: [
    {
      question: "What does an SPM consultant do?",
      answer:
        "An SPM consultant turns a compensation plan into a working, auditable system. That covers reviewing the plan design, documenting requirements, choosing or fitting a platform, configuring calculations and integrations, testing against expected results, and supporting the first live cycles. At Lanshore the same team can then run the system after go-live as a managed service.",
    },
    {
      question: "When is a compensation plan too complex for out-of-the-box configuration?",
      answer:
        "When a rule cannot be expressed in the platform's native objects without workarounds. Typical signals are multi-level crediting with overlays, team splits, mid-period territory or quota changes applied retroactively, multi-year deals, clawbacks and draws, and caps that interact with accelerators. These need deliberate design and testing rather than template configuration.",
    },
    {
      question: "Does Lanshore sell SPM software?",
      answer:
        "No. Lanshore is a services firm. It implements and operates Varicent, Xactly, CaptivateIQ, SAP SuccessFactors Incentive Management, Anaplan, Salesforce Spiff, Performio, Akeron, and Incentivate, and resells none of them, so platform recommendations are based on fit with your plans, data, and team.",
    },
    {
      question: "Can Lanshore fix an existing implementation instead of replacing it?",
      answer:
        "Yes. Lanshore takes on health checks and rescue engagements for platforms already in production. It has redesigned a broken commission process from the plan document down, removing a manual override layer, and has extended an existing SPM setup with audit-ready calculation logic and transparent reporting without replacing it. Re-platforming is recommended only when the current platform cannot meet the requirements.",
    },
    {
      question: "How long does an SPM consulting engagement take?",
      answer:
        "It depends on the number of plans, the complexity of crediting, data readiness, and whether a platform is already in place. Lanshore scopes each engagement after reviewing your plans and source data, and phases the work so that a parallel run against your existing process happens before cutover.",
    },
  ],
  dateModified: "2026-10-02",
};

export default solution;

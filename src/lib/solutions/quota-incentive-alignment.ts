import type { Solution } from "./types";

/* Scope (plan aeo-hubspot-recs-2026-10-12, rec 6): alignment only, meaning
   planning, measures, crediting and change control. In-period visibility and
   dashboards are the revenue-teams offer and are linked, not re-offered. */
const solution: Solution = {
  slug: "quota-incentive-alignment",
  hubspotId: "UNASSIGNED-2026-10-12",
  name: "SPM for Quota and Incentive Alignment",
  titleTag: "SPM for Quota and Incentive Alignment | Lanshore",
  metaDescription:
    "Lanshore aligns quotas and incentive plans: one territory master and calendar, plan measures mapped to quota, crediting that matches assignment, change control.",
  firstSentence:
    "SPM for quota and incentive alignment makes the quota a seller carries and the plan that pays them measure the same thing, on the same accounts, over the same dates. Lanshore delivers it by putting territory, quota, crediting, and plan design on one territory master, roster, assumption set, and calendar, then configuring the SPM platform so a change in one reaches the others before anyone is paid on it.",
  whoItIsFor:
    "Sales compensation, sales operations, RevOps, and finance leaders whose quotas and incentive plans are built by different teams at different times: territories and quotas in a planning model, plan measures in a comp design document, crediting in the SPM platform. It fits companies where attainment and payouts keep surprising people, where quota relief requests pile up mid-year, or where a territory realignment leaves crediting behind. It assumes an SPM platform is in place or being selected; Lanshore implements nine of them and resells none.",
  problems: [
    {
      title: "Quotas set from the finance number, not the territory",
      body: "When the annual target is divided down the hierarchy by headcount or last year's share, each quota inherits the company number but not the opportunity in the territory it lands on. Two sellers with the same quota can face very different markets. Attainment then scatters for reasons unrelated to effort, the plan pays for territory luck, and quota relief requests start before the first quarter closes.",
    },
    {
      title: "Plan measures that differ from the quota measure",
      body: "A quota is often set in bookings or annual contract value while the plan pays on billings, revenue, margin, or a product mix. The seller is then judged against one number and paid on another, and the two drift apart as deals close with different terms. Nobody notices in the design meeting; everybody notices at the first statement that shows strong attainment and a modest payout, or the reverse.",
    },
    {
      title: "Crediting that does not match quota assignment",
      body: "Quota is assigned to territories and roles, but crediting follows the rules configured in the SPM platform: account ownership, splits, overlays, and hierarchy rollups. When those rules credit a deal to someone whose quota does not include it, or fail to credit a seller whose quota does, attainment and payouts stop describing the same work. The gap usually shows up as disputes rather than as a design defect.",
    },
    {
      title: "Mid-year changes that never reach crediting",
      body: "Territories are realigned, accounts move, sellers change roles, and quotas are adjusted during the year. Each change is approved in a planning meeting, but if it reaches the platform late, or not at all, crediting keeps following the old assignment. The correction lands later as a retroactive adjustment, and the seller who moved territories spends a quarter reconciling their own statements.",
    },
  ],
  howWeDeliver: [
    {
      title: "Alignment assessment against one foundation",
      body: "We trace how quotas, plan measures, and crediting are produced today and test them against a single territory master, roster, assumption set, and calendar. Every place where two components read different accounts, people, numbers, or dates is listed with its effect on attainment and pay. The output is a ranked list of misalignments and the decisions needed to close each one.",
    },
    {
      title: "Reconcile quota methods",
      body: "Top-down allocation, bottom-up input, and account-potential models each answer a different question. We run them side by side for the territories you name, investigate where they disagree most, and agree a documented method with sales and finance, so the sum of quotas stays tied to the plan and each quota reflects the territory it covers.",
    },
    {
      title: "Map plan measures to quota",
      body: "For each role, we line up the measure the quota is set in with the measures the plan pays on, and decide in writing where they must match and where a deliberate difference is justified. Each difference is stated in the plan document, so sellers know in advance how attainment translates to pay.",
    },
    {
      title: "Configure crediting in the platform",
      body: "We configure crediting rules, splits, overlays, and hierarchy rollups in your SPM platform from the same territory master and roster the quotas use, and test them against expected results before go-live. A deal is then credited to the people whose quota includes it, and attainment and payout calculations read the same transactions. Under Lanshore's Agentic SPM approach, agents can check each crediting run against quota assignment and route mismatches to a person to resolve.",
    },
    {
      title: "Planning calendar and change control",
      body: "We set one planning calendar with explicit handoffs between territory design, quota setting, plan design, and platform configuration, and a change process for mid-year moves: who approves a territory or quota change, its effective date, and when it must reach crediting. Every change is versioned, so a payout can be traced to the assignment in force on the transaction date. For in-period visibility of attainment and earnings, see our revenue teams solution.",
    },
  ],
  platforms: ["varicent", "xactly", "captivateiq", "sap-incentive-management", "anaplan", "akeron"],
  relatedCaseStudies: [],
  related: [
    {
      label: "The Complete Guide to SPM Alignment for Quota Accuracy",
      href: "/resources/guides/spm-alignment-quota-accuracy",
    },
    {
      label: "The Complete Guide to Sales-Finance Misalignment",
      href: "/resources/guides/sales-finance-misalignment",
    },
    {
      label: "7 Sales Process Gaps That Undermine Quota Attainment",
      href: "/blog/sales-process-gaps-that-undermine-quota-attainment",
    },
    { label: "Sales Performance Management for Revenue Teams", href: "/solutions/revenue-teams" },
  ],
  faq: [
    {
      question: "What does quota and incentive alignment mean?",
      answer:
        "It means the quota a seller carries and the incentive plan that pays them are built from the same territory, roster, and assumptions, measure the same results, and change on the same dates. When they are aligned, attainment and payout describe the same performance, so a seller at quota is paid as the plan intended.",
    },
    {
      question: "Why do quotas and comp plans drift out of alignment?",
      answer:
        "Because different teams build them at different times. Quotas are often divided down from the finance target, plan measures are chosen in a separate design process, crediting rules live in the SPM platform, and mid-year territory or quota changes are approved in meetings that the platform hears about late. Each gap is small; together they make attainment and pay disagree.",
    },
    {
      question: "Should the comp plan pay on the same measure as the quota?",
      answer:
        "Usually, yes, or the seller is judged on one number and paid on another. A deliberate difference can be justified, for example paying on margin to protect pricing while quota is set in bookings, but it should be stated in the plan document so sellers know in advance how attainment translates to pay.",
    },
    {
      question: "How does an SPM platform keep quotas and crediting aligned?",
      answer:
        "By crediting from the same territory master and roster the quotas were set on, and by applying territory and quota changes with effective dates and a version history. Several platforms Lanshore implements, including Varicent, Xactly, CaptivateIQ, SAP SuccessFactors Incentive Management, Anaplan, and Akeron, include territory and quota planning alongside incentive compensation.",
    },
    {
      question: "Does Lanshore build sales dashboards as part of this work?",
      answer:
        "Not as part of alignment. This work fixes how quotas, plan measures, and crediting are produced and changed. In-period visibility of attainment and earnings for sales leaders and reps is a separate Lanshore offer, sales performance management for revenue teams, and it is most useful once the numbers underneath are aligned.",
    },
  ],
  dateModified: "2026-10-12",
};

export default solution;

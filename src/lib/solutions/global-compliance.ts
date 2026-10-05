import type { Solution } from "./types";

const solution: Solution = {
  slug: "global-compliance",
  hubspotId: "255749502",
  name: "Global Sales Performance Management for Compliance",
  titleTag: "Global SPM for Incentive Compliance | Lanshore",
  metaDescription:
    "Global sales performance management for compliance: one incentive plan framework with governed local variations for currency, payroll, acknowledgment, and data.",
  firstSentence:
    "Global sales performance management for compliance means running one incentive plan framework across countries, governed centrally, with controlled local variations for currency, payroll, plan acknowledgment, language, and data residency. Lanshore designs and implements that framework on enterprise SPM platforms, including migrations off legacy systems and spreadsheet estates, and works alongside your legal and payroll advisers on local requirements.",
  whoItIsFor:
    "Global and regional compensation, finance, HR, and RevOps leaders who pay sellers in several countries and still manage plans country by country: separate spreadsheets, a legacy ICM system each region has customized differently, or local payroll teams applying their own adjustments. It fits companies standardizing after acquisitions, replacing a system nearing end of support, or preparing for an audit that asks how incentive pay is governed across legal entities.",
  problems: [
    {
      title: "Every country runs its own version of the plan",
      body: "When each region adapts the global plan locally, the company ends up with many variants that nobody can compare. Rates, crediting, and caps drift, policy exceptions are approved informally, and headquarters cannot say what a role is paid in each market or why. Fragmentation also hides inconsistent treatment of similar roles, which is exactly what an audit or a legal review will ask about.",
    },
    {
      title: "Currency handling is inconsistent",
      body: "Quotas, credits, and payouts may each be denominated in a different currency. Without a defined rule for which exchange rate applies, as of which date, and who owns the rate table, the same deal can produce different payouts depending on when it is processed. Finance then cannot reconcile commission expense across entities, and reps in different countries lose confidence in the numbers.",
    },
    {
      title: "Local requirements are handled from memory",
      body: "Countries differ in how plan terms must be communicated and acknowledged, which pay elements payroll can process and when, how incentives interact with other statutory pay, and where employee data may be stored. When these requirements live in local administrators' heads rather than in the system, compliance depends on individuals and is hard to evidence when someone asks.",
    },
    {
      title: "Legacy systems cannot carry the governance",
      body: "Older ICM deployments and spreadsheet estates rarely record who approved a plan variant, which version an employee acknowledged, or why a payout was adjusted. Audit and legal review then rely on email archives. Replacing the legacy system is the moment to design those controls in, rather than migrating the same gaps onto a new platform.",
    },
  ],
  howWeDeliver: [
    {
      title: "Inventory plans and local practice",
      body: "We collect every plan, variant, and local policy in force, and record how each country actually processes incentives: currencies, payroll calendars and cutoffs, approval steps, acknowledgment practice, and where data is held. The inventory separates legitimate local requirements from drift that should be standardized.",
    },
    {
      title: "Design one global framework",
      body: "We define the global plan components, crediting rules, and governance that every country inherits, plus a controlled set of local parameters such as currency, rates, payout timing, and plan document language. Local variation is allowed only through those parameters, so every deviation from the global standard is visible, approved, and versioned.",
    },
    {
      title: "Capture local requirements with your advisers",
      body: "Lanshore does not give legal advice. We give your legal, HR, and payroll advisers in each country a structured list of the requirement categories the program must accommodate, and record their answers as configuration and controls. We recommend local legal review of plan documents, acknowledgment processes, and data handling before launch in each jurisdiction.",
    },
    {
      title: "Choose and configure the platform",
      body: "Fit for a global program depends on multi-currency handling, localization, data residency options, and acknowledgment workflows. Vulki by Akeron offers digital plan distribution with acknowledgment tracking; Incentivate supports private-cloud and on-premise deployment where multi-tenant hosting is ruled out. Lanshore is platform agnostic, resells none of the SPM platforms it implements, and evaluates each option against your documented requirements.",
    },
    {
      title: "Migrate from legacy systems",
      body: "We migrate plan logic, history, and open balances from legacy ICM or spreadsheets, then run parallel periods by country and reconcile every variance before cutover. Countries can go live in waves, so lessons from the first markets shape the rest. For PepsiCo, Lanshore delivered a multi-country sales incentive rollout covering more than 20 countries and a dozen currencies on one plan framework with local variants. We have run multi-country programs for other global consumer goods, pharma, and technology companies as well.",
    },
    {
      title: "Govern centrally after go-live",
      body: "A central team owns the framework, approves local variations, and reviews exceptions across countries, with an audit trail of plan versions, acknowledgments, approvals, and adjustments. Lanshore can run these operations as a managed service with US and Latin America delivery teams, or hand over a documented operating model to your own team.",
    },
  ],
  platforms: ["varicent", "sap-incentive-management", "xactly", "akeron", "incentivate"],
  relatedCaseStudies: [],
  related: [
    {
      label: "Global Incentive Governance in 2026",
      href: "/resources/guides/global-incentive-governance",
    },
    {
      label: "The Complete Guide to Global Sales Performance Models",
      href: "/resources/guides/global-spm-operating-model",
    },
    {
      label: "Modernizing Legacy SPM Systems in 2026",
      href: "/resources/guides/modernizing-legacy-spm-systems",
    },
  ],
  faq: [
    {
      question: "What local requirements does a global incentive program need to accommodate?",
      answer:
        "The categories are consistent even though the rules differ by country: currency and exchange rates, payroll calendars and the pay elements payroll can process, how plan terms are communicated and acknowledged, plan document language, data privacy and where employee data may be stored, and how incentives interact with other statutory pay. Each country's specifics should be confirmed by local legal and payroll advisers.",
    },
    {
      question: "Can one compensation plan work across every country?",
      answer:
        "One framework can; one identical plan usually cannot. The practical model is global components, crediting rules, and governance that every country inherits, with a controlled set of local parameters such as currency, rates, payout timing, and plan language. Every local variation is approved and versioned centrally.",
    },
    {
      question: "How should exchange rates be handled in a global commission plan?",
      answer:
        "Define it in the plan: which rate source applies, whether rates are fixed for the plan year or updated each period, which transaction date determines the rate, and who maintains the rate table. Then configure the SPM platform to apply that rule consistently and keep a history, so finance can reconcile commission expense across entities.",
    },
    {
      question: "Does Lanshore provide legal advice on incentive compliance?",
      answer:
        "No. Lanshore designs and implements the SPM framework, controls, and audit trail. Local legal requirements should be confirmed by qualified advisers in each jurisdiction; Lanshore structures the questions for them and turns their answers into configuration and controls.",
    },
    {
      question: "Why replace a legacy SPM system for a global program?",
      answer:
        "Legacy systems and spreadsheet estates rarely record who approved a plan variant, which version an employee acknowledged, or why a payout changed, so compliance is hard to evidence. A replacement project is the chance to design central governance and local parameters in, rather than migrating the same gaps onto a new platform.",
    },
  ],
  dateModified: "2026-10-02",
};

export default solution;

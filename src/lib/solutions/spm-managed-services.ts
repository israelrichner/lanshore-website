import type { Solution } from "./types";

const solution: Solution = {
  slug: "spm-managed-services",
  hubspotId: "255140699",
  name: "Enterprise SPM Managed Services for Complex Incentives",
  titleTag: "Enterprise SPM Managed Services | Lanshore",
  metaDescription:
    "Enterprise SPM managed services: Lanshore runs your monthly comp cycle, plan changes, disputes, and admin, with AI agents on repetitive work under human review.",
  firstSentence:
    "Enterprise SPM managed services means an outside team runs your incentive compensation operations after go-live: the monthly calculation cycle, plan changes, disputes, platform administration, and enhancements. Lanshore provides this for a predictable monthly fee on nine SPM platforms, with AI agents doing the repetitive work and Lanshore's team handling the judgment calls.",
  whoItIsFor:
    "Global enterprises running complex incentive programs, often with several plan populations, currencies, and payroll calendars, whose comp operations depend on a small in-house team or a single platform administrator. It fits organizations that have just gone live without staff to run the platform, those whose cycle close keeps slipping, and those that lost the administrator who understood the configuration. Your team keeps plan ownership, approvals, and policy; Lanshore runs the operations.",
  problems: [
    {
      title: "The cycle consumes the team",
      body: "Every period the same sequence repeats: load and validate data, run calculations, investigate exceptions, process adjustments, collect approvals, publish statements, and send payroll files. In complex programs this work fills the comp team's calendar, leaving little time for plan analysis or improvement, and a single absence during close week puts the payroll date at risk.",
    },
    {
      title: "Key-person risk",
      body: "Configuration knowledge tends to concentrate in one or two administrators. When one of them leaves, undocumented jobs, workarounds, and fixes leave too, and the next cycle becomes an investigation. Hiring a replacement with the right platform experience takes time the payroll calendar does not allow, and the new hire still has to learn your specific configuration.",
    },
    {
      title: "Plan changes wait in a queue",
      body: "Mid-year SPIFs, territory realignments, new roles, and acquisitions all require configuration changes, testing, and communication. If every change depends on a new statement of work with an outside firm or on an already stretched administrator, the business moves faster than the comp system, and interim payments end up running through spreadsheets outside the platform's controls.",
    },
    {
      title: "Disputes erode trust",
      body: "When reps cannot see how a payout was calculated, they open disputes, and each one sends an analyst through source data, plan logic, and adjustment history. Slow or inconsistent answers teach reps to keep their own shadow calculations, which multiplies the workload and the friction between compensation operations and sales leadership.",
    },
    {
      title: "Staffing in-house is harder than it looks",
      body: "Running SPM well takes platform administration, data engineering, plan analysis, and finance controls. One hire rarely covers all four, and a full team is hard to keep fully occupied outside close week. In-house is the right model for some organizations; for others, a managed service that scales with the cycle is the more predictable option.",
    },
  ],
  howWeDeliver: [
    {
      title: "Transition and documentation",
      body: "We start by documenting what exists: plans, configuration, integrations, scheduled jobs, controls, and the cycle calendar. Undocumented workarounds are either written down or retired. We work alongside your team through live cycles before taking over, so the handover happens with a run book rather than on trust, and nothing depends on one person's memory.",
    },
    {
      title: "Run the monthly cycle",
      body: "Each period we load and validate source data, run calculations, work the exception queue, process approved adjustments, publish statements, and deliver payroll and finance files on your calendar. AI agents from the SPM Operations pillar of Agentic SPM by Lanshore execute the repetitive steps; Lanshore's team reviews the results, and a person approves anything that reaches payroll.",
    },
    {
      title: "Plan changes and enhancements",
      body: "New plans, SPIFs, territory changes, and enhancement requests are configured, tested against expected results, and released through change control, with the configuration documentation updated each time. Because the same team runs the cycle and makes the change, there is no handoff between a support desk and a separate project team, and no new procurement cycle for each change.",
    },
    {
      title: "Disputes and inquiries",
      body: "Rep inquiries and disputes are logged, traced to the data and plan rule behind the payout, answered, and closed with a record of the resolution. Recurring causes are fed back as data or configuration fixes. Where it fits, a dispute and inquiry agent built under the Custom Apps pillar answers routine statement questions from plan logic and data.",
    },
    {
      title: "Controls and audit trail",
      body: "Every agent action is logged with timestamp, input, output, and approver where applicable, exportable for SOX or internal audit review. Separation between who configures, who runs, and who approves is agreed with your finance team at the start and kept in place.",
    },
    {
      title: "Reporting and continuous improvement",
      body: "Each cycle closes with a status report: what ran, exceptions and their causes, adjustments, disputes opened and closed, and open risks. The aim over time is fewer exceptions and fewer disputes, achieved by fixing upstream data and plan ambiguity instead of processing the same corrections every month. For a national telecom carrier, Lanshore implemented the SPM platform and then put agents on the monthly cycle steps: data load validation, exception triage, and statement pre-release checks. Cycle close time dropped 74 percent against the pre-implementation baseline.",
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
    "managed-services-commission-management",
    "flexible-spm-for-changing-business",
    "commission-architecture-redesign",
  ],
  related: [
    { label: "SPM Operations: AI agents for comp administration", href: "/agentic-spm/operations" },
    {
      label: "How to Prevent Incentive Compensation Disputes",
      href: "/resources/guides/preventing-incentive-compensation-disputes",
    },
    {
      label: "AI Agents for Commission Governance in 2026",
      href: "/resources/guides/ai-agents-commission-governance",
    },
  ],
  faq: [
    {
      question: "What is included in SPM managed services?",
      answer:
        "Typically the monthly calculation cycle (data loads, validation, calculation runs, exceptions, adjustments, statements, and payroll files), platform administration, plan changes and enhancements, dispute handling, and cycle reporting. Lanshore delivers these for a predictable monthly fee, with AI agents doing the repetitive work under human review.",
    },
    {
      question: "Should we run SPM operations in-house or use a managed service?",
      answer:
        "In-house suits organizations that can hire and retain platform administration, data, and plan analysis skills and keep them busy all month. A managed service suits those with a small team, a single point of failure, or a cycle that keeps slipping. Many split the work: your team owns plan design and approvals, and the provider runs operations.",
    },
    {
      question: "Do AI agents make payout decisions?",
      answer:
        "No. Agents run repetitive execution such as data loads, calculation runs, validations, and exception routing. Your team keeps plan design, approvals, and exceptions that need judgment, and a person approves anything that affects pay. Every agent action is logged for audit.",
    },
    {
      question: "Can Lanshore take over from another implementation partner?",
      answer:
        "Yes. Lanshore is platform agnostic and supports nine SPM platforms. For a procurement technology provider that had to engage third-party providers for every plan change, Lanshore restructured the SPM configuration for maintainability and set up a flexible support model, so plan changes ship in days rather than procurement cycles.",
    },
    {
      question: "Can managed services start before we have an SPM platform?",
      answer:
        "Yes. Lanshore took over commission operations for a telecom services provider whose commissions ran on a manual Excel process, adding structured calculation runs, error controls, and standardized reporting. Calculation errors dropped sharply and comp operations were covered without new headcount.",
    },
  ],
  dateModified: "2026-10-02",
};

export default solution;

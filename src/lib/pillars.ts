import type { FaqItem } from "./schema";

export type Pillar = {
  slug: string;
  path: string;
  name: string;
  pillarNumber: number;
  titleTag: string;
  metaDescription: string;
  firstSentence: string;
  h1: string;
  sub: string;
  painCards: string[];
  solutionStatement: string;
  capabilityCards: { title: string; description: string }[];
  personaTable: { role: string; solves: string }[];
  faq: FaqItem[];
  demoHref?: string;
};

export const PILLARS: Pillar[] = [
  {
    slug: "executive-dashboards",
    path: "/agentic-spm/executive-dashboards",
    name: "Executive Dashboards",
    pillarNumber: 1,
    titleTag: "AI Executive Dashboards for Sales Comp | AI Assisted SPM by Lanshore",
    metaDescription:
      "Executive Dashboards from AI Assisted SPM by Lanshore: ask your comp data a question in plain language and get a current, sourced answer across platform, CRM, and spreadsheets.",
    firstSentence:
      "Executive Dashboards are the visibility pillar of AI Assisted SPM by Lanshore: AI-assisted dashboards that answer leadership questions directly from your comp, CRM, and planning data.",
    h1: "Executive dashboards",
    sub: "Ask your comp data a question. Get an answer, not a ticket.",
    demoHref: "/agentic-spm/executive-dashboards/demo",
    painCards: [
      "Comp data lives in three places (your SPM platform, your CRM, and someone's spreadsheet), and none of them agree.",
      "Every leadership question becomes an analyst request with a three-day turnaround.",
      "Quota and territory decisions get made on last month's numbers.",
    ],
    solutionStatement:
      "We unify your comp data and put an AI layer on top of it, so a CRO can ask “which territories are pacing under 70% of quota?” and get a current, sourced answer in seconds.",
    capabilityCards: [
      {
        title: "Natural-language answers",
        description: "Plain-English questions against live comp data.",
      },
      {
        title: "Cross-platform unification",
        description: "SPM platform + CRM + spreadsheets in one model.",
      },
      {
        title: "Anomaly flags",
        description:
          "Attainment spikes, calculation drift, and outlier payouts surfaced automatically.",
      },
      {
        title: "Scheduled briefs",
        description: "Monday-morning summaries to leadership, no analyst required.",
      },
    ],
    personaTable: [
      {
        role: "CRO",
        solves: "Attainment vs. comp spend in real time, without waiting on ops",
      },
      {
        role: "VP of Sales",
        solves: "Rep and territory outliers spotted mid-quarter, not at review",
      },
      { role: "CFO", solves: "Accrual numbers they can trust before close" },
      {
        role: "RevOps lead",
        solves: "Fewer ad-hoc report requests; more time on plan design",
      },
    ],
    faq: [
      {
        question: "What is an AI-assisted executive dashboard?",
        answer:
          "It's a dashboard where an AI layer sits between leadership and the underlying comp data, so questions can be asked in plain language and answered from live, unified data instead of pre-built reports.",
      },
      {
        question: "Which data sources can it connect to?",
        answer:
          "Your SPM platform (Varicent, Xactly, CaptivateIQ, SAP SuccessFactors Incentive Management, Anaplan, Salesforce Spiff, Performio, Akeron, or Incentivate), your CRM (HubSpot, Salesforce, Zoho), and structured spreadsheets or data warehouse tables.",
      },
      {
        question: "How long until we see the first dashboard?",
        answer:
          "Most engagements deliver a working executive dashboard against real data in four to six weeks.",
      },
      {
        question: "Is our comp data used to train AI models?",
        answer:
          "No. Your data stays in your environment; the AI layer queries it, it doesn't train on it.",
      },
    ],
  },
  {
    slug: "operations",
    path: "/agentic-spm/operations",
    name: "SPM Operations",
    pillarNumber: 2,
    titleTag: "AI Agents for Sales Comp Operations | AI Assisted SPM by Lanshore",
    metaDescription:
      "SPM Operations from AI Assisted SPM by Lanshore: AI agents that run calculations, validations, and exceptions inside Varicent, Xactly, CaptivateIQ, SAP, Anaplan, Salesforce Spiff, Performio, Akeron, or Incentivate, with a full audit trail.",
    firstSentence:
      "SPM Operations is the execution pillar of AI Assisted SPM by Lanshore: AI agents that run recurring comp administration (calculations, validations, and exceptions) inside the platform you already own.",
    h1: "SPM operations",
    sub: "Your comp cycle, run by agents. Reviewed by humans. Closed on time.",
    demoHref: "/agentic-spm/operations/demo",
    painCards: [
      "Monthly comp cycles eat two weeks of admin time, every month.",
      "One mis-mapped field means rework, disputes, and reps who stop trusting their statements.",
      "Your platform admin left, and the tribal knowledge left with them.",
    ],
    solutionStatement:
      "We build agents that execute the recurring cycle (data loads, calculation runs, validations, exception queues) with a full audit trail and a human approving what matters.",
    capabilityCards: [
      {
        title: "Agent-run cycles",
        description:
          "Scheduled loads, calc runs, and reconciliation across all nine SPM platforms we support.",
      },
      {
        title: "Exception handling",
        description:
          "Errors routed to a queue with suggested fixes, not buried in logs.",
      },
      {
        title: "Validation and audit",
        description:
          "Every agent action logged and reviewable; controls stay intact.",
      },
      {
        title: "Continuity",
        description:
          "Documented, repeatable operations that survive admin turnover.",
      },
    ],
    personaTable: [
      {
        role: "Comp administrator",
        solves: "The repetitive 80% of the cycle runs itself",
      },
      { role: "RevOps lead", solves: "Close the cycle days earlier, with fewer disputes" },
      {
        role: "Finance controller",
        solves: "Audit trail on every calculation and adjustment",
      },
      { role: "IT owner", solves: "Fewer one-off scripts and undocumented jobs" },
    ],
    faq: [
      {
        question: "Which SPM platforms does Lanshore's operations team support?",
        answer:
          "Varicent, Xactly, CaptivateIQ, SAP SuccessFactors Incentive Management, Anaplan, Salesforce Spiff, Performio, Akeron, and Incentivate, for both implementation and agent-run ongoing operations.",
      },
      {
        question: "Do agents replace our comp admin team?",
        answer:
          "No. Agents take the repetitive execution; your team keeps plan design, approvals, and exceptions that need judgment.",
      },
      {
        question: "How is this different from RPA?",
        answer:
          "RPA replays fixed clicks and breaks when screens change. Agents work toward an outcome, handle variation, and escalate when they're unsure. We've built both, so we use each where it fits.",
      },
      {
        question: "What does the audit trail look like?",
        answer:
          "Every agent action is logged with timestamp, input, output, and approver where applicable, exportable for SOX or internal audit review.",
      },
    ],
  },
  {
    slug: "custom-apps",
    path: "/agentic-spm/custom-apps",
    name: "Custom Apps",
    pillarNumber: 3,
    titleTag: "Custom Agentic Apps for SPM | AI Assisted SPM by Lanshore",
    metaDescription:
      "Custom Apps from AI Assisted SPM by Lanshore (dispute bots, approval workflows, integrations, and calculators) are purpose-built agentic applications that cover what your SPM platform can't.",
    firstSentence:
      "Custom Apps is the build pillar of AI Assisted SPM by Lanshore: purpose-built agentic applications that cover what your SPM platform can't do out of the box.",
    h1: "Custom apps",
    sub: "When the platform stops short, we build the rest.",
    demoHref: "/agentic-spm/custom-apps/demo",
    painCards: [
      "Your comp plan needs something the platform roadmap won't deliver for two years.",
      "The gap is currently filled by a spreadsheet only one person understands.",
      "Rep inquiries and disputes flow through email with no tracking.",
    ],
    solutionStatement:
      "We design and ship agentic applications around your specific motion (dispute bots, approval workflows, integrations, calculators) that plug into your platform instead of fighting it.",
    capabilityCards: [
      {
        title: "Dispute and inquiry bots",
        description:
          "Reps ask about their statement; the agent answers from plan logic and data.",
      },
      {
        title: "Approval workflows",
        description: "Plan changes, SPIFs, and exceptions routed with full history.",
      },
      {
        title: "Integrations",
        description:
          "Comp data moving between SPM, CRM, HRIS, and finance systems.",
      },
      {
        title: "Purpose-built calculators",
        description:
          "Draw schedules, clawbacks, and edge cases the platform can't model.",
      },
    ],
    personaTable: [
      {
        role: "Comp designer",
        solves: "Plans designed for the business, not for platform limits",
      },
      {
        role: "Ops leader",
        solves: "Shadow spreadsheets retired; process moves into a real app",
      },
      {
        role: "IT",
        solves:
          "Built on supported patterns (Power Automate, UiPath, custom agents), documented and handed over",
      },
      { role: "Reps", solves: "Statement questions answered in minutes, not weeks" },
    ],
    faq: [
      {
        question: "What kinds of custom apps does Lanshore build?",
        answer:
          "Dispute and inquiry bots, approval workflows, cross-system integrations, and calculators for plan mechanics your platform can't model, all built to work alongside your existing SPM platform.",
      },
      {
        question: "Who owns the app after delivery?",
        answer:
          "You do. We deliver documented code and configuration, train your team, and offer managed support if you want it.",
      },
      {
        question: "What's a typical timeline?",
        answer:
          "Scoped per build; most custom apps ship in eight to twelve weeks from kickoff.",
      },
      {
        question: "What technology are these built on?",
        answer:
          "Depending on fit: Microsoft Power Automate, UiPath, and custom agentic frameworks using commercial AI models under your accounts.",
      },
    ],
  },
];

export function getPillar(slug: string): Pillar | undefined {
  return PILLARS.find((p) => p.slug === slug);
}

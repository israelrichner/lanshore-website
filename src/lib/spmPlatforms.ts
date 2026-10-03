import type { FaqItem } from "./schema";

export type SpmPlatform = {
  slug: string;
  name: string;
  vendor: string;
  formerNames?: string[];
  officialUrl: string;
  titleTag: string;
  metaDescription: string;
  /* Direct, quotable answer paragraph — opens the page for answer-engine extraction. */
  firstSentence: string;
  positioning: string;
  capabilities: string[];
  customerProfile: string;
  aiFeatures: string[];
  /* Only analyst claims verified against public sources as of 2026-07.
     Gartner MQ for SPM 2026 placements may only be printed for Varicent,
     Xactly, and CaptivateIQ (Leaders) plus "recognized in" for Performio. */
  analystNote?: string;
  /* Lead-in rendered before GARTNER_2019.claims.short on the platform page.
     May ONLY be set for Xactly and SAP — the vendors the 2019 Gartner note
     (G00380338) listed Lanshore against. Do not extend to other platforms:
     stretching the claim beyond what Gartner printed is misattribution. */
  gartnerPartnerLeadIn?: string;
  lanshoreAngle: string[];
  faq: FaqItem[];
};

export const SPM_PLATFORMS: SpmPlatform[] = [
  {
    slug: "varicent",
    name: "Varicent",
    vendor: "Varicent",
    formerNames: ["IBM Cognos Incentive Compensation Management"],
    officialUrl: "https://www.varicent.com",
    titleTag: "Varicent Implementation & Managed Services | Lanshore",
    metaDescription:
      "Lanshore implements, operates, and extends Varicent, the SPM leader for enterprise incentive compensation, with agentic AI augmentation, migrations, and managed services.",
    firstSentence:
      "Varicent is an enterprise sales performance management platform covering incentive compensation, territory and quota planning, and revenue intelligence; Lanshore implements, operates, and extends Varicent for enterprise comp teams.",
    positioning:
      "Varicent is one of the most complete enterprise SPM suites on the market, spanning incentive compensation management, territory and quota planning, and sales planning. Originally IBM Cognos ICM, it has evolved into an AI-native platform with purpose-built assistants across plan design, analysis, and research.",
    capabilities: [
      "Incentive compensation management at enterprise data volumes",
      "Territory and quota planning with what-if modeling",
      "Sales planning and capacity modeling",
      "Revenue intelligence and pipeline analytics",
      "Flexible calculation engine for complex plan mechanics",
    ],
    customerProfile:
      "Mid-market to large enterprises with complex, high-volume comp plans, especially organizations that outgrew spreadsheet-based comp or lighter-weight tools.",
    aiFeatures: [
      "Sales Planning Assistant for territory and quota scenarios",
      "Designer Assistant for plan build and change",
      "Research Assistant for natural-language analysis of comp data",
    ],
    analystNote:
      "Named a Leader in The Forrester Wave™: Incentive Compensation Management, Q1 2025, and a Leader in the 2026 Gartner® Magic Quadrant™ for Sales Performance Management (its eighth consecutive Leader placement).",
    lanshoreAngle: [
      "Full-lifecycle Varicent implementation: plan design, calculation build, data integration, and go-live",
      "Managed comp operations: Lanshore agents run your Varicent calculation cycles, validations, and exception queues (see the SPM Operations demo, which includes an Xactly-to-Varicent migration mode)",
      "Migrations onto Varicent from Xactly, SAP Commissions, and spreadsheet estates",
      "Agentic augmentation: dashboards and custom apps layered on Varicent data",
    ],
    faq: [
      {
        question: "Does Lanshore implement Varicent?",
        answer:
          "Yes. Lanshore delivers full-lifecycle Varicent implementations (plan design, calculation build, integrations, testing, and go-live) plus ongoing managed operations after launch.",
      },
      {
        question: "Can Lanshore migrate us from Xactly or SAP Commissions to Varicent?",
        answer:
          "Yes. Platform migrations are a core Lanshore service; our operations demo includes an agent-assisted Xactly-to-Varicent migration workflow that mirrors the real engagement pattern.",
      },
      {
        question: "How does AI Assisted SPM work with Varicent's own AI assistants?",
        answer:
          "They're complementary. Varicent's assistants work inside Varicent; Lanshore's agents work across your whole stack (Varicent plus CRM, ERP, and spreadsheets) and around your specific comp plan.",
      },
    ],
  },
  {
    slug: "xactly",
    name: "Xactly",
    vendor: "Xactly Corp",
    officialUrl: "https://www.xactlycorp.com",
    titleTag: "Xactly Incent Implementation & Managed Services | Lanshore",
    metaDescription:
      "Lanshore implements and operates Xactly Incent, augments it with AI agents, and manages Xactly migrations (15+ years of incentive compensation delivery).",
    firstSentence:
      "Xactly is a cloud incentive compensation and sales performance management platform built around its flagship Incent product; Lanshore implements Xactly, runs comp operations on it, and augments it with AI agents.",
    positioning:
      "Xactly pioneered cloud ICM and remains one of the most widely deployed platforms for incentive compensation, forecasting, and sales planning. Its Intelligence Studio and agent roadmap bring AI directly into the comp workflow.",
    capabilities: [
      "Incentive compensation management (Incent)",
      "Sales forecasting and pipeline analytics",
      "Territory and quota planning",
      "Commission expense accounting (ASC 606)",
      "Benchmarking on two decades of pay-and-performance data",
    ],
    customerProfile:
      "Mid-market and enterprise revenue organizations that want a proven cloud ICM with strong finance-side capabilities like commission expense accounting.",
    aiFeatures: [
      "\"Fleet of Agents\" vision for comp task automation",
      "Intelligence Studio (2026) for AI-assisted insights across Incent data",
    ],
    analystNote:
      "Named a Leader in the 2026 Gartner® Magic Quadrant™ for Sales Performance Management.",
    gartnerPartnerLeadIn:
      "Lanshore has delivered Xactly implementations and managed operations for enterprise clients.",
    lanshoreAngle: [
      "Xactly Incent implementation, plan builds, and integration with CRM and ERP",
      "Managed comp operations: monthly cycles, validations, and exception handling run by Lanshore agents with human review",
      "Health checks and rescue engagements for underperforming Incent deployments",
      "Migrations in either direction: onto Xactly, or from Xactly to another platform when requirements change",
    ],
    faq: [
      {
        question: "Does Lanshore support Xactly Incent operations, not just implementation?",
        answer:
          "Yes. Lanshore runs ongoing Xactly comp operations (data loads, calculation runs, validation, and exception queues) as a managed service with a full audit trail.",
      },
      {
        question: "We're evaluating leaving Xactly. Can Lanshore help?",
        answer:
          "Yes. Lanshore is platform-agnostic: we run structured platform assessments and, when a move is right, execute migrations, including an agent-assisted Xactly-to-Varicent pattern you can see in our operations demo.",
      },
      {
        question: "Can Lanshore's AI agents work with Xactly?",
        answer:
          "Yes. AI Assisted SPM layers on top of Xactly: agents monitor calculation runs, flag anomalies before payout, and answer executive questions from unified Xactly, CRM, and spreadsheet data.",
      },
    ],
  },
  {
    slug: "captivateiq",
    name: "CaptivateIQ",
    vendor: "CaptivateIQ",
    officialUrl: "https://www.captivateiq.com",
    titleTag: "CaptivateIQ Implementation & Managed Services | Lanshore",
    metaDescription:
      "Lanshore implements CaptivateIQ, operates comp cycles on it, and extends it with agentic AI, including MCP-based integrations with your AI stack.",
    firstSentence:
      "CaptivateIQ is a modern incentive compensation management platform known for its spreadsheet-like modeling flexibility; Lanshore implements CaptivateIQ, operates comp on it, and connects it to your AI stack.",
    positioning:
      "CaptivateIQ combines the flexibility comp teams love in spreadsheets with the control and scale of an enterprise platform. It has moved aggressively into agentic AI, shipping CaptivateIQ Agents and an MCP server that make comp data programmatically available to AI assistants.",
    capabilities: [
      "Incentive compensation modeling with spreadsheet-like logic",
      "Commission processing and statements reps actually read",
      "Territory and quota planning (CaptivateIQ Planning)",
      "Real-time payout visibility and inquiry management",
    ],
    customerProfile:
      "High-growth and enterprise teams that iterate on comp plans frequently and want modeling flexibility without a services-heavy change cycle.",
    aiFeatures: [
      "CaptivateIQ Agents for comp workflows (2026)",
      "MCP server exposing comp data to AI assistants (2026)",
    ],
    analystNote:
      "Named a Leader in both The Forrester Wave™: Incentive Compensation Management, Q1 2025, and the 2026 Gartner® Magic Quadrant™ for Sales Performance Management.",
    lanshoreAngle: [
      "CaptivateIQ implementation and plan migration from spreadsheets or legacy ICM",
      "Managed comp operations on CaptivateIQ with agent-run validations",
      "MCP-native integrations: Lanshore builds agentic workflows that talk to CaptivateIQ's MCP server from Claude Code, n8n, or your own stack",
    ],
    faq: [
      {
        question: "Does Lanshore implement CaptivateIQ?",
        answer:
          "Yes: implementation, plan modeling, integrations, and ongoing managed comp operations on CaptivateIQ.",
      },
      {
        question: "Can Lanshore connect CaptivateIQ to our AI tools?",
        answer:
          "Yes. CaptivateIQ ships an MCP server, and Lanshore builds agentic workflows on top of it, from Claude Code and n8n to fully custom agents under your accounts.",
      },
      {
        question: "Is CaptivateIQ a good fit for enterprise comp plans?",
        answer:
          "Often, yes. It's a Leader in both major analyst evaluations. Fit depends on plan complexity, data volumes, and team model; Lanshore runs platform assessments to answer this for your specific plans.",
      },
    ],
  },
  {
    slug: "sap-incentive-management",
    name: "SAP SuccessFactors Incentive Management",
    vendor: "SAP",
    formerNames: ["SAP Commissions", "CallidusCloud"],
    officialUrl: "https://www.sap.com/products/hcm/incentive-management.html",
    titleTag: "SAP Incentive Management (SAP Commissions) Services | Lanshore",
    metaDescription:
      "Lanshore supports SAP SuccessFactors Incentive Management (formerly SAP Commissions/CallidusCloud): implementations, managed operations, and migration planning before legacy support ends.",
    firstSentence:
      "SAP SuccessFactors Incentive Management (formerly SAP Commissions and CallidusCloud) is SAP's enterprise incentive compensation platform; Lanshore implements it, operates it, and plans migrations for teams on legacy SAP comp stacks.",
    positioning:
      "SAP's incentive management platform is the enterprise incumbent, deeply embedded in SAP-centric IT estates and capable of extreme calculation scale. With legacy-stack support winding down beyond 2026, many SAP comp customers face a modernization decision: upgrade within the SAP SuccessFactors line or migrate to another platform.",
    capabilities: [
      "High-volume commission calculation at enterprise scale",
      "Deep integration with SAP ERP, SuccessFactors, and S/4HANA estates",
      "Dispute and inquiry workflows",
      "Territory and quota management within the SAP portfolio",
    ],
    customerProfile:
      "Large enterprises (often SAP-first IT organizations) with high transaction volumes and complex, audited comp processes.",
    aiFeatures: ["Joule copilot integration across the SAP SuccessFactors portfolio"],
    gartnerPartnerLeadIn:
      "Lanshore's SAP incentive compensation practice dates back to the CallidusCloud era.",
    lanshoreAngle: [
      "Legacy deadline planning: support for legacy SAP Commissions stacks ends beyond 2026; Lanshore assesses upgrade-vs-migrate and executes either path",
      "Implementation and plan builds on SAP SuccessFactors Incentive Management",
      "Managed operations for SAP comp environments, including agent-run validations",
      "Migrations from SAP Commissions to Varicent, Xactly, or CaptivateIQ when that's the right answer",
    ],
    faq: [
      {
        question: "What happened to SAP Commissions?",
        answer:
          "SAP Commissions (originally CallidusCloud) is now SAP SuccessFactors Incentive Management. Legacy-stack support is winding down beyond 2026, which is driving a wave of upgrade and migration projects.",
      },
      {
        question: "Should we upgrade within SAP or migrate to another SPM platform?",
        answer:
          "It depends on your IT estate, plan complexity, and roadmap. Lanshore is platform-agnostic and runs structured assessments that compare staying on SAP against moving to Varicent, Xactly, CaptivateIQ, or others, with a costed migration plan either way.",
      },
      {
        question: "Can Lanshore run our SAP comp operations in the meantime?",
        answer:
          "Yes. Lanshore provides managed comp operations on SAP incentive platforms, keeping cycles running cleanly while you plan the modernization step.",
      },
    ],
  },
  {
    slug: "anaplan",
    name: "Anaplan",
    vendor: "Anaplan",
    officialUrl: "https://www.anaplan.com",
    titleTag: "Anaplan SPM & Incentive Compensation Services | Lanshore",
    metaDescription:
      "Lanshore delivers Anaplan for sales performance management: territory and quota planning, capacity modeling, and incentive compensation connected to enterprise planning.",
    firstSentence:
      "Anaplan is a connected-planning platform whose SPM applications cover territory planning, quota setting, capacity modeling, and incentive compensation; Lanshore implements and operates Anaplan SPM alongside dedicated ICM platforms.",
    positioning:
      "Anaplan approaches SPM from the planning side: territories, quotas, capacity, and comp modeled in one connected environment with finance and supply-chain planning. For organizations that treat sales planning as part of enterprise planning, Anaplan is often the natural SPM home.",
    capabilities: [
      "Territory and quota planning connected to corporate planning",
      "Sales capacity and headcount modeling",
      "Incentive compensation management",
      "Scenario modeling across revenue and finance in one platform",
    ],
    customerProfile:
      "Enterprises that want sales planning, quota setting, and comp connected to broader financial planning rather than run in a standalone ICM tool.",
    aiFeatures: ["CoPlanner agents for AI-assisted planning workflows"],
    analystNote:
      "Named a Leader in IDC MarketScape assessments for sales performance management.",
    lanshoreAngle: [
      "Anaplan SPM model building: territory, quota, capacity, and ICM models",
      "Hybrid architectures: Anaplan for planning connected to Varicent, Xactly, or CaptivateIQ for calculation-heavy ICM",
      "Agentic augmentation: Lanshore agents that read Anaplan plans and reconcile them against actuals in your comp platform",
    ],
    faq: [
      {
        question: "Is Anaplan an ICM platform or a planning platform?",
        answer:
          "Both, from the planning side: Anaplan models territories, quotas, capacity, and incentive comp in one connected environment. For extreme calculation volumes, it's often paired with a dedicated ICM engine, an architecture Lanshore designs and runs.",
      },
      {
        question: "Can Lanshore connect Anaplan to our comp platform?",
        answer:
          "Yes. A common Lanshore pattern is Anaplan for planning with Varicent, Xactly, or CaptivateIQ for commission calculation, kept in sync by integration agents.",
      },
    ],
  },
  {
    slug: "salesforce-spiff",
    name: "Salesforce Spiff",
    vendor: "Salesforce",
    formerNames: ["Spiff"],
    officialUrl: "https://www.salesforce.com/sales/incentive-compensation-management/",
    titleTag: "Salesforce Spiff (ICM) Implementation Services | Lanshore",
    metaDescription:
      "Lanshore implements Salesforce Spiff (incentive compensation management native to Sales Cloud) and augments it with agents across your revenue stack.",
    firstSentence:
      "Salesforce Spiff is the incentive compensation management product inside Sales Cloud, based on Salesforce's February 2024 acquisition of Spiff; Lanshore implements Spiff and extends it with agentic workflows across the Salesforce estate.",
    positioning:
      "Spiff brings commission calculation, statements, and rep-facing transparency directly into Salesforce, making it the default consideration for Sales Cloud-first organizations. Its roadmap ties into Agentforce, Salesforce's agent platform.",
    capabilities: [
      "Commission calculation and statements native to Salesforce",
      "Real-time commission visibility for reps inside CRM",
      "Plan modeling with a spreadsheet-familiar builder",
      "Agentforce roadmap for AI-assisted comp workflows",
    ],
    customerProfile:
      "Salesforce-first revenue organizations that want comp visible where sellers already work, with CRM-native data flow.",
    aiFeatures: ["Agentforce integration roadmap for comp agents inside Salesforce"],
    lanshoreAngle: [
      "Spiff implementation for Sales Cloud organizations",
      "Comp data architecture across Salesforce, ERP, and finance systems",
      "Agentic augmentation with Agentforce or external agents, whichever fits your stack",
    ],
    faq: [
      {
        question: "Is Spiff only for Salesforce customers?",
        answer:
          "Spiff is now a Salesforce product and is strongest inside Sales Cloud. If you're not Salesforce-first, Lanshore will typically evaluate it alongside platform-neutral options like Varicent, CaptivateIQ, or Performio.",
      },
      {
        question: "Can Lanshore implement Spiff and our comp process end to end?",
        answer:
          "Yes: plan design, Spiff configuration, integration with ERP and finance, and managed operations after go-live.",
      },
    ],
  },
  {
    slug: "performio",
    name: "Performio",
    vendor: "Performio",
    officialUrl: "https://www.performio.co",
    titleTag: "Performio Implementation & Managed Services | Lanshore",
    metaDescription:
      "Lanshore implements and operates Performio, the ICM platform with the category's first MCP server, and builds agentic workflows on top of it.",
    firstSentence:
      "Performio is an incentive compensation management platform focused on fast, dependable comp operations for mid-market and enterprise teams; Lanshore implements Performio and builds agentic workflows against its MCP server.",
    positioning:
      "Performio pairs a strong calculation engine with pragmatic, ops-friendly workflows, and has been early to agentic AI, shipping the first MCP server in the ICM category and AI implementation agents that speed up deployment.",
    capabilities: [
      "Incentive compensation calculation and statements",
      "Plan management with reusable plan components",
      "Comp analytics and dispute workflows",
      "Data transformation tooling for messy source data",
    ],
    customerProfile:
      "Mid-market and enterprise comp teams that want dependable ICM operations without a heavyweight implementation footprint.",
    aiFeatures: [
      "First MCP server in the ICM category: comp data available to AI assistants",
      "AI Implementation Agents that accelerate configuration",
    ],
    analystNote:
      "Named a Strong Performer in The Forrester Wave™: Incentive Compensation Management, Q1 2025, and recognized in the 2026 Gartner® Magic Quadrant™ for Sales Performance Management.",
    lanshoreAngle: [
      "Performio implementation and plan builds",
      "Managed comp operations on Performio",
      "MCP-native agentic integrations: Lanshore connects Performio's MCP server to Claude Code, n8n, and custom agents",
    ],
    faq: [
      {
        question: "What makes Performio notable for AI-driven comp teams?",
        answer:
          "Performio shipped the first MCP server in the ICM category, which means AI assistants and agents can query comp data through a standard protocol, a pattern Lanshore builds on directly.",
      },
      {
        question: "Does Lanshore offer managed services on Performio?",
        answer:
          "Yes. Lanshore runs comp cycles, validations, and exception queues on Performio as a managed service with human review on what matters.",
      },
    ],
  },
  {
    slug: "akeron",
    name: "Akeron",
    vendor: "Akeron",
    officialUrl: "https://www.akeron.com",
    titleTag: "Vulki by Akeron Implementation & Services | Lanshore",
    metaDescription:
      "Lanshore implements Vulki by Akeron (enterprise SPM with incentive compensation for sales and non-sales roles) and builds on its Akyba AI agent center.",
    firstSentence:
      "Akeron is the company behind Vulki, an enterprise sales performance management platform covering incentive compensation for sales and non-sales roles, territory and quota planning, and the Akyba AI agent center; Lanshore implements Vulki as an Akeron partner.",
    positioning:
      "Vulki by Akeron combines no-code incentive compensation (commissions, bonuses, and MBOs for any employee population, not just sales) with territory and quota planning, and embeds Akyba, a governed agent center whose specialized AI agents act on certified comp data inside the platform.",
    capabilities: [
      "Incentive compensation for sales: commissions, bonuses, simulations, approvals, and dispute management",
      "Variable compensation and MBOs for non-sales roles: marketing, operations, finance, and professional services",
      "Territory and quota planning",
      "No-code plan configuration with digital plan distribution and acknowledgment tracking",
      "Embedded analytics and natural-language reporting on Microsoft Power BI",
    ],
    customerProfile:
      "Enterprise organizations (consumer goods, insurance, telecom, banking, retail, travel) that pay variable compensation across sales and non-sales populations and want business users, not IT, configuring plans.",
    aiFeatures: [
      "Akyba agent center: specialized AI agents for plan proposals, dispute triage, performance analysis, and user coaching, acting on governed platform data",
      "LLM-agnostic by design: bring your own model (GPT, Claude, Gemini) with policy and cost control",
    ],
    analystNote:
      "Named a Representative Vendor in the 2025 Gartner® Market Guide for Sales Performance Management for the fourth consecutive year, and an Exemplary Provider in the 2025 ISG Buyers Guides™ for Sales Performance Management, Incentive Compensation Management, and Revenue Performance Management.",
    lanshoreAngle: [
      "Vulki implementation as an Akeron partner: plan design, configuration, data integration, and go-live",
      "Comp operations support and plan administration after launch",
      "Agentic augmentation alongside Akyba for workflows that span CRM, ERP, and the rest of your stack",
    ],
    faq: [
      {
        question: "What is Vulki by Akeron?",
        answer:
          "Vulki is Akeron's sales performance management platform. It handles incentive compensation for sales and non-sales roles, territory and quota planning, and includes Akyba, an agent center whose specialized AI agents work on governed data inside the platform.",
      },
      {
        question: "Does Lanshore implement Akeron?",
        answer:
          "Yes. Lanshore is an Akeron implementation partner, delivering Vulki rollouts, plan builds, data integration, and ongoing comp operations support.",
      },
    ],
  },
  {
    slug: "incentivate",
    name: "Incentivate",
    vendor: "Incentivate Solutions",
    officialUrl: "https://incentivatesolutions.com",
    titleTag: "Incentivate Implementation & Managed Services | Lanshore",
    metaDescription:
      "Lanshore implements and operates Incentivate (no-code incentive compensation with the Agent Dhara AI assistant) and builds agentic workflows on top of it.",
    firstSentence:
      "Incentivate is a sales commission and incentive compensation platform built around no-code plan configuration and its Agent Dhara AI assistant; Lanshore implements Incentivate, runs comp operations on it, and extends it with agents.",
    positioning:
      "Incentivate pairs a no-code, drag-and-drop plan builder with a calculation engine aimed at complex commission logic (lookup tables, matrices, multipliers, and qualifiers) and offers deployment flexibility that ICM SaaS rarely does, including private cloud and on-premise. It is also early to agentic AI, with Agent Dhara answering plan and payout questions in plain English.",
    capabilities: [
      "No-code plan configuration with a drag-and-drop builder",
      "Commission calculation across lookup tables, rate matrices, multipliers, and qualifiers",
      "Dispute and query management with payroll approval workflows",
      "SQL-based data pipelines for transforming messy source data",
      "Audit trails, embedded validations, and plan health dashboards",
      "Flexible deployment: SaaS, private cloud, or on-premise",
    ],
    customerProfile:
      "Enterprises with large rep populations and intricate plan mechanics (pharmaceuticals and medical devices, insurance, financial services, manufacturing, and distribution), especially those with data-residency or on-premise requirements.",
    aiFeatures: [
      "Agent Dhara: an agentic assistant that answers comp questions in plain English, investigates disputes, and traces plan changes",
      "Natural-language report generation over commission data",
    ],
    lanshoreAngle: [
      "Incentivate implementation: plan configuration, data pipelines, integrations, and go-live",
      "Managed comp operations on Incentivate: calculation cycles, validations, and exception queues run by Lanshore agents with human review",
      "Agentic augmentation alongside Agent Dhara for workflows that reach across CRM, ERP, and finance systems",
    ],
    faq: [
      {
        question: "Does Lanshore implement Incentivate?",
        answer:
          "Yes: plan configuration, data integration, testing, and go-live, followed by managed comp operations if you want Lanshore running the cycles.",
      },
      {
        question: "What is Agent Dhara?",
        answer:
          "Agent Dhara is Incentivate's agentic AI assistant. It answers commission questions in plain English, investigates disputes, and traces plan changes inside the platform. Lanshore builds agents around it that span the rest of your stack.",
      },
      {
        question: "Can Incentivate run on-premise?",
        answer:
          "Yes. Incentivate supports SaaS, private cloud, and on-premise deployment, which makes it worth evaluating when data residency or IT policy rules out multi-tenant ICM.",
      },
    ],
  },
];

/* Vendors we support but don't maintain dedicated pages for. */
export const NEAR_MISS_VENDORS = ["Oracle", "beqom", "Forma.ai"];

export function getSpmPlatform(slug: string): SpmPlatform | undefined {
  return SPM_PLATFORMS.find((p) => p.slug === slug);
}

import type { Solution } from "./types";

const solution: Solution = {
  slug: "ai-commission-automation",
  hubspotId: "255671911",
  name: "AI Sales Commission Automation",
  titleTag: "AI Sales Commission Automation | Lanshore",
  metaDescription:
    "AI sales commission automation by Lanshore: agents check calculations before statements release, explain payouts, and resolve disputes, with humans approving.",
  firstSentence:
    "AI sales commission automation uses agents to check, explain, and defend the commissions your SPM platform calculates: validating each run before statements release, answering rep questions from plan logic and data, and triaging disputes with an audit trail. Lanshore builds and runs these agents on top of Varicent, Xactly, CaptivateIQ, and the other platforms it implements, and a person approves every change to a payout.",
  whoItIsFor:
    "Comp administrators, comp operations leaders, finance controllers, and RevOps teams whose SPM platform already calculates commissions but whose cycle still depends on manual validation, rep questions arriving by email, and disputes tracked in a spreadsheet. It fits teams that must show an auditor how each payout was checked and each adjustment approved, and teams that want AI in the commission process without handing the calculation itself to a language model.",
  problems: [
    {
      title: "Errors found after statements release",
      body: "A deal credited in two periods, a clawback larger than the month's earnings that produces a negative payout, a new hire with no crediting rule: if nothing catches these before statements go out, reps find them, and each one becomes a dispute and a correction in the next cycle. Validation that runs only when someone has time is not validation.",
    },
    {
      title: "Reps who cannot read their statements",
      body: "A statement that shows amounts without showing why invites questions. Reps ask why a payout dropped, whether a split was credited, or when a draw is recovered, and those questions travel by email with no tracking. Comp administrators spend the close week answering the same questions, and reps who wait too long for an answer stop trusting the plan.",
    },
    {
      title: "Disputes without a trail",
      body: "When disputes are decided in email threads, nobody can show later which deal record, plan clause, and calculation run a decision rested on. The same issue gets disputed again next quarter, root causes never reach plan design, and an auditor's question about a specific adjustment means reconstructing it from inboxes.",
    },
    {
      title: "Checks that live in one person's head",
      body: "Many comp teams have an experienced administrator who knows which reports to eyeball before release. When that person leaves or is out during close, the checks leave too. In one engagement, a commission process had been broken for over a year and was running on manual overrides. Lanshore rebuilt the crediting and calculation logic, removed the override layer, and re-established a controlled monthly cycle.",
    },
    {
      title: "Asking a language model to be the calculator",
      body: "A language model is the wrong engine for computing pay: it is not deterministic, and commission math has to produce the same answer every run and be explainable line by line. The calculation belongs in the SPM platform. Agents earn their place around it, by checking the run, explaining the result, and handling the exceptions, without ever overwriting what the engine produced.",
    },
  ],
  howWeDeliver: [
    {
      title: "Codify the checks your most experienced admin runs",
      body: "We write down the validations an experienced administrator performs before release and turn them into explicit rules: statement totals reconcile to the calculation run, no payee exceeds plan caps, the crediting hierarchy matches the HR roster, and large month-over-month attainment swings are flagged for explanation. Each rule cites the plan clause or control it enforces.",
    },
    {
      title: "Validate every run before statements release",
      body: "After each calculation run, an agent executes the checks and routes every exception to a queue with a suggested fix and the plan clause behind it. A comp administrator approves or rejects each fix, and statements stay on hold until the exceptions are signed off. Our SPM Operations demo shows this cycle on fictitious data. At a national telecom carrier, pre-release validation catches missing quota, zero-rate assignments, duplicate credits, and attainment swings outside a tolerance band. In the first quarter it held back about 2 percent of statements per cycle for correction before release, and disputes after release fell by roughly 60 percent.",
    },
    {
      title: "Explain payouts to reps",
      body: "An inquiry bot answers statement questions from the plan document and live comp data, with clause references. Each statement line can be traced to the deal record, the plan clause, and the calculation run that produced it. Questions the bot cannot resolve escalate to the comp administrator with the context attached, so nobody starts from scratch. Our Custom Apps demo shows this with a fictitious bank.",
    },
    {
      title: "Triage and resolve disputes with a person deciding",
      body: "When a rep files a dispute, the agent opens it with the deal record, supporting documents, and the relevant plan clause attached, checks it against plan logic, and drafts a recommendation. The comp administrator makes the decision. Approved adjustments are posted through the platform's normal adjustment process for the next run, and the decision, its reason, and its approver are logged. At Grammarly, a dispute explanation agent answers rep questions against the plan and the calculation trace. Average time to close a dispute went from about five business days of admin research and email to under one day, with most answered the same day.",
    },
    {
      title: "Keep the audit trail and close the loop",
      body: "Every agent action is logged with timestamp, input, output, and approver where one applies, and the log is exportable for SOX or internal audit review. Dispute volumes and root causes are reported back to plan design, so a clause that keeps generating disputes gets rewritten rather than defended every quarter.",
    },
    {
      title: "Hand over or have Lanshore run it",
      body: "Most custom apps ship in eight to twelve weeks from kickoff and are delivered as documented code and configuration that you own, with training for your team. If you prefer, Lanshore runs the validation and dispute workflow as part of a managed comp operations service, with agents doing the repetitive work and Lanshore consultants handling the judgment calls.",
    },
  ],
  platforms: ["varicent", "xactly", "captivateiq", "performio", "incentivate"],
  relatedCaseStudies: ["commission-architecture-redesign", "managed-services-commission-management"],
  related: [
    { label: "How to Prevent Incentive Compensation Disputes", href: "/resources/guides/preventing-incentive-compensation-disputes" },
    { label: "AI Agents for Commission Governance in 2026", href: "/resources/guides/ai-agents-commission-governance" },
    { label: "Custom Apps live demo: statement viewer and dispute bot", href: "/agentic-spm/custom-apps/demo" },
  ],
  faq: [
    {
      question: "Can AI calculate sales commissions?",
      answer:
        "It should not be the calculator. Commission math needs a deterministic engine that produces the same answer every run and can be explained line by line, which is what SPM platforms such as Varicent, Xactly, and CaptivateIQ provide. AI agents add value around that engine: validating each run, explaining payouts, and handling exceptions and disputes, with a person approving any change.",
    },
    {
      question: "How does an AI agent help resolve a commission dispute?",
      answer:
        "The agent opens the dispute with the deal record, supporting documents, and the relevant plan clause attached, checks the claim against plan logic and the calculation run, and drafts a recommendation. A comp administrator decides. Approved adjustments go through the platform's normal adjustment process, and the decision and approver are logged.",
    },
    {
      question: "Who approves changes an AI commission agent proposes?",
      answer:
        "A named person, usually the comp administrator, with finance approval where your controls require it. Agents can validate, explain, flag, and draft, but no payout, credit, or adjustment changes until a person approves it, and every approval is recorded in the audit trail.",
    },
    {
      question: "What does the audit trail record?",
      answer:
        "Every agent action, with timestamp, input, output, and approver where one applies. The log is exportable for SOX or internal audit review, so an auditor can see how a payout was checked and why an adjustment was made.",
    },
    {
      question: "Does AI commission automation work with our existing SPM platform?",
      answer:
        "Yes. Lanshore's agents work alongside the platform you already own, including Varicent, Xactly, CaptivateIQ, SAP SuccessFactors Incentive Management, Anaplan, Salesforce Spiff, Performio, Akeron, and Incentivate. Some platforms also ship their own AI assistants; Lanshore's agents complement them by working across your CRM, ERP, and spreadsheets as well.",
    },
    {
      question: "Which AI models do the agents use, and under whose accounts?",
      answer:
        "Lanshore builds custom agents on commercial AI models under your accounts, chosen to fit your stack, so how those providers may use your data is set by the terms of your own AI accounts, which your team should review. For Lanshore's Executive Dashboards, your data stays in your environment and the AI layer queries it rather than training on it.",
    },
  ],
  dateModified: "2026-10-02",
};

export default solution;

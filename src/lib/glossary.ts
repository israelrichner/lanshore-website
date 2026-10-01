export type GlossaryTerm = {
  term: string;
  definition: string;
  linkTo?: string;
};

/* Anchor for a term, so each definition has its own addressable URL
   (/resources/glossary#accelerator) that a search or answer engine can cite
   and deep-link to, instead of only the page as a whole. */
export function glossarySlug(term: string) {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/* "AI Assisted SPM" is intentionally first; the rest are alphabetical. */
export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "AI Assisted SPM",
    definition:
      "AI Assisted SPM is a term coined by Lanshore for sales performance management operated by AI agents: software that completes multi-step comp tasks (calculations, validations, exception handling, and reporting) autonomously, on top of the SPM platform a company already runs. It covers three areas: executive dashboards, comp operations, and custom applications.",
    linkTo: "/",
  },
  {
    term: "Accelerator",
    definition:
      "A comp plan mechanic that increases the commission rate once a rep passes a threshold, usually 100% of quota. Accelerators reward overperformance; a plan might pay 10% up to quota and 15% beyond it.",
  },
  {
    term: "Accrual",
    definition:
      "The commission expense a company records for work performed but not yet paid out. Finance teams book comp accruals each period so the cost of incentives lands in the right quarter, even when the actual payout happens later.",
  },
  {
    term: "Agentic AI",
    definition:
      "AI systems that pursue a goal through multiple steps (planning, using tools, checking results, and adjusting) rather than answering a single prompt. In comp operations, agentic AI can run a data load, validate the output, and escalate exceptions without a human driving each step.",
  },
  {
    term: "AI agent",
    definition:
      "A single instance of agentic AI assigned to a job: for example, an agent that runs the monthly calculation cycle or answers reps' statement questions. Agents act autonomously within defined limits and log every action for review.",
  },
  {
    term: "Audit trail",
    definition:
      "The complete, timestamped record of every action taken in a comp process: who or what did it, with what inputs and outputs, and who approved it. Required for SOX and internal audit review of incentive compensation.",
  },
  {
    term: "Chargeback",
    definition:
      "The reversal of a commission when the underlying sale unwinds: a canceled order, a returned product, or a churned customer. Chargebacks are netted against future payouts and are a major source of statement disputes.",
  },
  {
    term: "Clawback",
    definition:
      "A provision that lets a company recover commission already paid, typically when a deal cancels or a customer churns inside a defined window. Clawbacks differ from chargebacks in that the money has already left the building.",
  },
  {
    term: "Comp cycle",
    definition:
      "The recurring end-to-end process of paying variable compensation: loading data, running calculations, validating results, resolving exceptions, and releasing statements and payments. Most companies run it monthly; the cycle's length and error rate are the standard measures of comp operations health.",
  },
  {
    term: "Commission statement",
    definition:
      "The document a rep receives each cycle showing their credited deals, rates, adjustments, and payout. Statements reps can't reconcile against their own deal list are the leading cause of comp disputes.",
  },
  {
    term: "Crediting",
    definition:
      "The rules that decide which people get credit for a sale (direct rep, overlay specialist, manager, channel partner) and how much. Crediting logic is usually the most complex part of an SPM implementation, especially with multi-tier or team-selling motions.",
  },
  {
    term: "Dispute (comp dispute)",
    definition:
      "A rep's formal challenge to a commission statement: a missing deal, a wrong rate, an unexpected chargeback. Dispute volume is a direct signal of comp process quality, and resolving disputes fast is one of the highest-leverage uses of agents in comp operations.",
  },
  {
    term: "Draw",
    definition:
      "A guaranteed payment against future commissions, common for new hires who haven't built pipeline yet. A recoverable draw is repaid from later earnings; a non-recoverable draw is not. Draw schedules are a frequent gap in platform capability.",
  },
  {
    term: "Exception handling",
    definition:
      "The process of catching and resolving records that don't fit the rules: an unmapped territory, a deal with no owner, a negative payout. In agent-run operations, exceptions route to a review queue with suggested fixes instead of failing silently in logs.",
  },
  {
    term: "Incentive compensation management (ICM)",
    definition:
      "The administration of variable pay: plan setup, crediting, calculation, and payout. ICM is the operational core of sales performance management; the terms are often used interchangeably, though SPM also covers territories, quotas, and planning.",
  },
  {
    term: "On-target earnings (OTE)",
    definition:
      "A rep's expected total pay at 100% quota attainment: base salary plus variable compensation at plan. OTE is the headline number in sales offer letters and the anchor for comp plan design.",
  },
  {
    term: "Payout curve",
    definition:
      "The relationship between attainment and payout in a comp plan: where it starts paying, how fast it rises, and where accelerators or caps kick in. The shape of the curve is what actually drives selling behavior.",
  },
  {
    term: "Plan document",
    definition:
      "The formal document defining a rep's comp plan: measures, rates, quotas, crediting rules, and terms like clawback windows. It's the legal source of truth: when the platform and the plan document disagree, the document wins, which is why implementations start there.",
  },
  {
    term: "Quota",
    definition:
      "The sales target assigned to a rep, team, or territory for a period. Quotas convert company revenue goals into individual accountability, and quota-setting quality drives both attainment fairness and comp cost predictability.",
  },
  {
    term: "Quota attainment",
    definition:
      "A rep's actual results as a percentage of quota. Attainment is the core SPM metric: it feeds payout calculations, forecasting, plan health checks, and territory decisions. Attainment distributions that cluster oddly usually signal a quota or crediting problem.",
  },
  {
    term: "RPA (robotic process automation)",
    definition:
      "Software that replays fixed sequences of clicks and keystrokes to automate repetitive tasks. RPA is effective for stable, rule-based processes but breaks when screens or data change, the gap that agentic AI closes by working toward outcomes instead of replaying steps.",
  },
  {
    term: "Sales performance management (SPM)",
    definition:
      "The discipline and software category covering how companies plan, manage, and pay their sales organization: territory design, quota setting, incentive compensation, and performance analytics. Major SPM platforms include Varicent, Xactly, CaptivateIQ, SAP SuccessFactors Incentive Management, Anaplan, Salesforce Spiff, Performio, Akeron, and Incentivate.",
  },
  {
    term: "SPIF",
    definition:
      "A short-term sales incentive (Sales Performance Incentive Fund) layered on top of the regular comp plan to push a specific product, segment, or time window. SPIFs are effective but operationally messy: they're launched fast, tracked separately, and reconciled late.",
  },
  {
    term: "Territory management",
    definition:
      "Defining and maintaining the account, geographic, or segment boundaries each rep sells into. Territory rules feed crediting directly, so territory churn (reps moving, accounts reassigning) is a leading cause of comp errors.",
  },
  {
    term: "True-up",
    definition:
      "A correcting payment that reconciles what a rep was paid against what they should have been paid, once final data arrives. True-ups are normal in consumption-based and long-cycle comp, but frequent large true-ups signal a data or process problem.",
  },
  {
    term: "Variable compensation",
    definition:
      "The portion of pay tied to performance (commissions, bonuses, SPIFs) as opposed to base salary. For sales roles it commonly represents 40–50% of on-target earnings, which is why comp accuracy has a direct effect on rep trust and retention.",
  },
];

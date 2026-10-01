/* Demo dataset for the Executive Dashboards live demo.
   Meridian Trust Bank is a fictitious ~$14B regional financial institution;
   all figures are illustrative. Numbers are internally consistent:
   district spend sums to the QTD total, monthly accruals sum to spend. */

export const DEMO_COMPANY = "Meridian Trust Bank";
export const DEMO_AS_OF = "Q2 2026 · data as of May 31, refreshed 22 minutes ago";

export type Kpi = {
  label: string;
  value: string;
  delta?: string;
  note?: string;
  /* Optional monthly series rendered as a sparkline in the KPI tile. */
  trend?: number[];
  /* "warn" renders the delta as a warning instead of an accent. */
  tone?: "warn";
};

export type QA = { question: string; answer: string; sources: string };

export const PERSONA_IDS = ["cro", "vp-sales", "cfo", "revops"] as const;

export type PersonaId = (typeof PERSONA_IDS)[number];

export function isPersonaId(value: string | null | undefined): value is PersonaId {
  return PERSONA_IDS.includes(value as PersonaId);
}

export const DISTRICTS = [
  { name: "Northeast", attainment: 94, spend: 1.31, pacing: 102, reps: 48, costOfRevenue: 8.4 },
  { name: "Central", attainment: 89, spend: 1.12, pacing: 97, reps: 44, costOfRevenue: 8.7 },
  { name: "Southeast", attainment: 83, spend: 0.98, pacing: 91, reps: 41, costOfRevenue: 9.2 },
  { name: "Gulf Coast", attainment: 68, spend: 0.87, pacing: 74, reps: 37, costOfRevenue: 10.1 },
];

export type MonthlyPoint = {
  month: string;
  attainment: number;
  spend: number;
  projected: boolean;
};

/* Attainment % and comp spend ($M) by month; June is a projection.
   Jan–Mar are Q1 actuals averaging 84.2% — the "+3.2 pts vs. Q1" baseline.
   The April dip is the realignment's crediting gaps, fixed through May. */
export const MONTHLY: MonthlyPoint[] = [
  { month: "Jan", attainment: 82.6, spend: 1.87, projected: false },
  { month: "Feb", attainment: 84.4, spend: 1.94, projected: false },
  { month: "Mar", attainment: 85.6, spend: 2.01, projected: false },
  { month: "Apr", attainment: 84.1, spend: 2.06, projected: false },
  { month: "May", attainment: 90.5, spend: 2.22, projected: false },
  { month: "Jun", attainment: 96.0, spend: 2.31, projected: true },
];

/* Per-district monthly series. Spend sums to the blended MONTHLY figures:
   Jan 1.87, Feb 1.94, Mar 2.01, Apr 2.06, May 2.22, Jun 2.31.
   Gulf Coast declines into April — the story the CRO agent insight flags. */
export const MONTHLY_BY_DISTRICT: Record<string, MonthlyPoint[]> = {
  Northeast: [
    { month: "Jan", attainment: 86.4, spend: 0.57, projected: false },
    { month: "Feb", attainment: 88.6, spend: 0.59, projected: false },
    { month: "Mar", attainment: 89.5, spend: 0.61, projected: false },
    { month: "Apr", attainment: 90.2, spend: 0.63, projected: false },
    { month: "May", attainment: 97.4, spend: 0.68, projected: false },
    { month: "Jun", attainment: 102.5, spend: 0.71, projected: true },
  ],
  Central: [
    { month: "Jan", attainment: 83.2, spend: 0.49, projected: false },
    { month: "Feb", attainment: 85.1, spend: 0.51, projected: false },
    { month: "Mar", attainment: 85.8, spend: 0.52, projected: false },
    { month: "Apr", attainment: 85.6, spend: 0.54, projected: false },
    { month: "May", attainment: 92.1, spend: 0.58, projected: false },
    { month: "Jun", attainment: 97.8, spend: 0.6, projected: true },
  ],
  Southeast: [
    { month: "Jan", attainment: 80.1, spend: 0.43, projected: false },
    { month: "Feb", attainment: 82.3, spend: 0.44, projected: false },
    { month: "Mar", attainment: 81.6, spend: 0.46, projected: false },
    { month: "Apr", attainment: 80.3, spend: 0.47, projected: false },
    { month: "May", attainment: 85.9, spend: 0.51, projected: false },
    { month: "Jun", attainment: 91.4, spend: 0.53, projected: true },
  ],
  "Gulf Coast": [
    { month: "Jan", attainment: 78.9, spend: 0.38, projected: false },
    { month: "Feb", attainment: 76.2, spend: 0.4, projected: false },
    { month: "Mar", attainment: 71.8, spend: 0.42, projected: false },
    { month: "Apr", attainment: 65.9, spend: 0.42, projected: false },
    { month: "May", attainment: 70.2, spend: 0.45, projected: false },
    { month: "Jun", attainment: 78.6, spend: 0.47, projected: true },
  ],
};

export type AgentInsight = {
  id: string;
  district: string;
  title: string;
  finding: string;
  action: string;
};

/* Agent-flagged anomalies surfaced on the CRO view. */
export const CRO_INSIGHTS: AgentInsight[] = [
  {
    id: "gulf-spend-anomaly",
    district: "Gulf Coast",
    title: "Comp-spend anomaly: Gulf Coast",
    finding:
      "Accelerator payouts rose 18% month-over-month while district attainment pacing sits at 74%. The spike concentrates in two treasury payees whose crediting splits predate the April realignment.",
    action:
      "Review crediting splits on the two flagged treasury deals before June statements release; an estimated $22K of June spend is at stake.",
  },
  {
    id: "ne-accelerator-exposure",
    district: "Northeast",
    title: "Accelerator exposure: Northeast",
    finding:
      "If Northeast finishes above 102% attainment, accelerator tiers add an estimated $42K over the June projection, 71% of it from three commercial lending payees.",
    action:
      "Hold $42K of accrual headroom for Northeast in the June close. No plan change recommended; exposure is within design intent.",
  },
];

/* Rep attainment distribution (170 payees). */
export const DISTRIBUTION = [
  { bin: "<50%", count: 6, flagged: true },
  { bin: "50–70%", count: 19, flagged: true },
  { bin: "70–90%", count: 54, flagged: false },
  { bin: "90–110%", count: 61, flagged: false },
  { bin: "110–130%", count: 22, flagged: false },
  { bin: ">130%", count: 8, flagged: true },
];

export type BucketRep = {
  name: string;
  role: string;
  district: string;
  attainment: number;
  note?: string;
};

/* Representative payees per histogram bucket (sampled from the 170). */
export const BUCKET_REPS: Record<string, BucketRep[]> = {
  "<50%": [
    { name: "Marcus Chen", role: "Treasury Sales Officer", district: "Gulf Coast", attainment: 41, note: "Crediting gap: corrected est. 78%" },
    { name: "L. Fontaine", role: "Relationship Manager", district: "Gulf Coast", attainment: 47 },
    { name: "D. Kowalski", role: "Relationship Manager", district: "Southeast", attainment: 44 },
  ],
  "50–70%": [
    { name: "Tom Okafor", role: "Relationship Manager", district: "Southeast", attainment: 55, note: "Pipeline coverage 1.1x, flagged" },
    { name: "R. Ibarra", role: "Treasury Sales Officer", district: "Gulf Coast", attainment: 62 },
    { name: "C. Maddox", role: "Relationship Manager", district: "Central", attainment: 66 },
  ],
  "70–90%": [
    { name: "S. Whitaker", role: "Relationship Manager", district: "Central", attainment: 84 },
    { name: "J. Pham", role: "Wealth Advisor", district: "Northeast", attainment: 79 },
    { name: "M. Delacroix", role: "Relationship Manager", district: "Southeast", attainment: 88 },
  ],
  "90–110%": [
    { name: "A. Delgado", role: "Relationship Manager", district: "Northeast", attainment: 108 },
    { name: "K. Brandt", role: "Treasury Sales Officer", district: "Central", attainment: 96 },
    { name: "H. Osei-Bonsu", role: "Relationship Manager", district: "Southeast", attainment: 102 },
  ],
  "110–130%": [
    { name: "Priya Raman", role: "Wealth Advisor", district: "Central", attainment: 122, note: "Top decile, crediting verified" },
    { name: "T. Nguyen", role: "Treasury Sales Officer", district: "Northeast", attainment: 117 },
    { name: "E. Marsh", role: "Relationship Manager", district: "Northeast", attainment: 112 },
  ],
  ">130%": [
    { name: "Dana Whitfield", role: "Relationship Manager", district: "Northeast", attainment: 168, note: "Payout spike: split under review" },
    { name: "J. Salazar", role: "Wealth Advisor", district: "Northeast", attainment: 141 },
    { name: "B. Ferreira", role: "Treasury Sales Officer", district: "Central", attainment: 134 },
  ],
};

export const OUTLIERS = [
  {
    rep: "Dana Whitfield",
    role: "Relationship Manager",
    district: "Northeast",
    attainment: 168,
    flag: "Payout spike",
    detail:
      "A single commercial lending deal carries 62% of her quarter credit. Crediting split with the treasury officer on the deal hasn't been applied. Flagged before the statement released.",
    agentWhy:
      "I compared her credited deals against the crediting hierarchy. Deal #91188 ($1.4M funded) should split 70/30 with T. Nguyen under the treasury referral rule (plan §3.4), but the split was never applied after the deal record merged in Salesforce. With the split applied, her attainment is 131%: still top decile, no longer an anomaly. I've staged the correction for approval.",
  },
  {
    rep: "Marcus Chen",
    role: "Treasury Sales Officer",
    district: "Gulf Coast",
    attainment: 41,
    flag: "Territory gap",
    detail:
      "Three of his assigned accounts moved to Southeast in April's realignment but crediting rules weren't updated. Agent estimates corrected attainment at 78%.",
    agentWhy:
      "His funded volume didn't drop; his crediting did. Three accounts (Halvorsen Foods, Pier & Main, Gulfstream Logistics) moved to Southeast in the April realignment, but the crediting rule still routes their volume to the old territory owner. Replaying the quarter with corrected rules puts him at 78%, in line with his trailing six-month average of 81%.",
  },
  {
    rep: "Tom Okafor",
    role: "Relationship Manager",
    district: "Southeast",
    attainment: 55,
    flag: "Pipeline coverage",
    detail:
      "Pacing 55% with pipeline coverage at 1.1x, lowest in the district. Surfaced mid-quarter, not at review.",
    agentWhy:
      "This one is a real performance gap, not a data artifact. His crediting checks out clean. Coverage is 1.1x against a district norm of 2.3x, and 60% of his open pipeline sits in two stalled deals untouched for 30+ days. Recommend a coaching conversation now. At current velocity he finishes the quarter near 61%.",
  },
  {
    rep: "Priya Raman",
    role: "Wealth Advisor",
    district: "Central",
    attainment: 122,
    flag: "Clean",
    detail:
      "Top decile, no anomalies. Crediting verified against the referral hierarchy on all 14 booked deals.",
    agentWhy:
      "I verified all 14 booked deals against the referral hierarchy and the funding dates in core banking. Every credit is legitimate and well distributed (largest deal is 16% of her quarter). Her mix skews toward advisory fees, which carry no accelerator, so there's no payout-spike risk either.",
  },
];

export type AccrualDriver = { label: string; amountK: number };

export const ACCRUALS: {
  month: string;
  booked: number;
  calculated: number;
  variance: string;
  status: string;
  drivers: AccrualDriver[];
}[] = [
  {
    month: "April",
    booked: 2.05,
    calculated: 2.06,
    variance: "+0.6%",
    status: "Reconciled",
    drivers: [
      { label: "New-hire proration: 2 April starts", amountK: 6 },
      { label: "FX adjustment: LatAm referral book", amountK: 4 },
    ],
  },
  {
    month: "May",
    booked: 2.19,
    calculated: 2.22,
    variance: "+1.4%",
    status: "Reconciled",
    drivers: [
      { label: "Accelerator timing: deals funded May 28–31", amountK: 18 },
      { label: "Duplicate-credit reversal, deal #88213", amountK: 8 },
      { label: "Draw recovery schedule shift", amountK: 4 },
    ],
  },
  {
    month: "June (proj.)",
    booked: 2.25,
    calculated: 2.31,
    variance: "+2.7%",
    status: "Open: true-up est. $58K",
    drivers: [
      { label: "Accelerator exposure: Northeast", amountK: 42 },
      { label: "Realignment crediting corrections: Gulf Coast", amountK: 11 },
      { label: "New-hire proration: June class", amountK: 5 },
    ],
  },
];

/* CFO what-if: drag quarter-end attainment and June recomputes; April and
   May are actuals and don't move. At the 96% baseline this reproduces the
   June ACCRUALS row exactly ($58K true-up, $6.59M liability). Accelerators
   are piecewise: Northeast (runs ~6.5 pts hot) crosses 100% district
   attainment near a 93% blended finish; Central (~2 pts hot) near 98%. */
export const CFO_BASELINE_ATT = 96;
export const CFO_ATT_RANGE = { min: 92, max: 104 };
/* 1% of the $6.49M booked quarter. */
export const CFO_TOLERANCE_K = 65;

export type CfoWhatIf = {
  drivers: AccrualDriver[];
  trueUpK: number;
  juneCalculated: number; // $M
  juneVariance: string;
  juneStatus: string;
  liability: string;
  breach: boolean;
};

export function cfoWhatIf(att: number): CfoWhatIf {
  const northeastK = Math.max(0, Math.round((att - 92) * 10.5));
  const centralK = Math.max(0, Math.round((att - 98) * 22));
  const drivers: AccrualDriver[] = [];
  if (northeastK > 0) {
    drivers.push({
      label: `Accelerator exposure: Northeast at ${(att + 6.5).toFixed(1)}%`,
      amountK: northeastK,
    });
  }
  if (centralK > 0) {
    drivers.push({
      label: `Accelerator exposure: Central at ${(att + 2).toFixed(1)}%`,
      amountK: centralK,
    });
  }
  drivers.push(
    { label: "Realignment crediting corrections: Gulf Coast", amountK: 11 },
    { label: "New-hire proration: June class", amountK: 5 }
  );

  const trueUpK = drivers.reduce((sum, d) => sum + d.amountK, 0);
  const juneCalculated = Math.round((2.25 + trueUpK / 1000) * 100) / 100;
  /* $6.49M booked + $40K April/May variance already reconciled. */
  const liability = 6.53 + trueUpK / 1000;
  return {
    drivers,
    trueUpK,
    juneCalculated,
    juneVariance: `+${(((juneCalculated - 2.25) / 2.25) * 100).toFixed(1)}%`,
    juneStatus: `Open: true-up est. $${trueUpK}K`,
    liability: `$${liability.toFixed(2)}M`,
    breach: trueUpK > CFO_TOLERANCE_K,
  };
}

export const AUDIT_TRAIL = [
  {
    timestamp: "May 31, 23:42",
    action: "Monthly calculation run #148 completed: 170 statements generated",
    actor: "Agent (auto)",
  },
  {
    timestamp: "Jun 1, 08:15",
    action: "Exception: duplicate credit on deal #88213 routed to queue with suggested fix",
    actor: "Approved by S. Patel",
  },
  {
    timestamp: "Jun 1, 08:20",
    action: "Accrual export to Workday Financials: $2.22M May liability",
    actor: "Approved by J. Moreno",
  },
  {
    timestamp: "Jun 1, 09:02",
    action: "Crediting hierarchy sync: 3 Gulf Coast account moves applied",
    actor: "Agent (auto)",
  },
  {
    timestamp: "Jun 1, 09:30",
    action: "June projection refreshed: accelerator exposure recomputed at 96% attainment",
    actor: "Agent (auto)",
  },
  {
    timestamp: "Jun 1, 10:12",
    action: "True-up journal entry drafted for review: $58K June estimate",
    actor: "Pending: J. Moreno",
  },
];

export const REQUEST_LOG = [
  {
    asked: "CFO, Jun 1",
    question: "May accrual vs. booked: where's the variance?",
    time: "answered in 8s",
  },
  {
    asked: "CRO, May 29",
    question: "Which territories are pacing under 70% of quota?",
    time: "answered in 6s",
  },
  {
    asked: "VP Sales, May 28",
    question: "Show reps whose attainment moved >20 pts this month",
    time: "answered in 11s",
  },
  {
    asked: "District mgr, May 27",
    question: "What's Gulf Coast's corrected attainment after the realignment?",
    time: "answered in 9s",
  },
];

export type ExceptionItem = {
  id: number;
  title: string;
  source: string;
  ageHours: number;
  suggestion: string;
};

/* RevOps exception queue. SLA: fixes reviewed within 24 hours. */
export const EXCEPTION_QUEUE: ExceptionItem[] = [
  {
    id: 1,
    title: "Duplicate credit: deal #88213, commercial lending split",
    source: "May calc run #148",
    ageHours: 2,
    suggestion:
      "Reverse the duplicate $2,140 credit and keep the primary split per the funding date. Notify both payees before June statements release.",
  },
  {
    id: 2,
    title: "Missing crediting rule: new hire M. Osei",
    source: "HR roster sync",
    ageHours: 9,
    suggestion:
      "Apply the Gulf Coast default hierarchy until the territory assignment posts, and backdate credit to the May 12 start date.",
  },
  {
    id: 3,
    title: "Statement dispute: R. Alvarez, missing referral SPIF",
    source: "Dispute bot escalation",
    ageHours: 27,
    suggestion:
      "The referral logged in CRM on May 19 but funded June 2, so the SPIF pays next cycle per plan §3.4. Send the payee the clause reference and payment timeline.",
  },
  {
    id: 4,
    title: "Negative payout: clawback exceeds T. Nguyen's June earnings",
    source: "June preview run",
    ageHours: 4,
    suggestion:
      "Carry the $310 balance into July per plan §4.2 rather than issuing a negative check.",
  },
  {
    id: 5,
    title: "Attainment jump >25 pts: K. Osei-Bonsu",
    source: "Validation warning",
    ageHours: 54,
    suggestion:
      "The movement traces entirely to April realignment corrections. Recommend dismissing; no plan action needed.",
  },
];

export const PERSONAS: {
  id: PersonaId;
  label: string;
  tagline: string;
  kpis: Kpi[];
  qa: QA[];
}[] = [
  {
    id: "cro",
    label: "CRO",
    tagline: "Attainment vs. comp spend in real time, without waiting on ops.",
    kpis: [
      {
        label: "Blended attainment (QTD)",
        value: "87.4%",
        delta: "+3.2 pts vs. Q1",
        trend: [82.6, 84.4, 85.6, 84.1, 90.5, 96.0],
      },
      {
        label: "Comp spend (QTD)",
        value: "$4.28M",
        note: "vs. $4.31M plan",
        trend: [1.87, 1.94, 2.01, 2.06, 2.22, 2.31],
      },
      { label: "Comp cost of revenue", value: "8.9%", delta: "−0.4 pts vs. Q1" },
      { label: "Projected quarter-end", value: "96%", note: "attainment at current pace" },
    ],
    qa: [
      {
        question: "Which districts are pacing under 70% of quota?",
        answer:
          "No full district is under 70%, but Gulf Coast is pacing at 74% and two of its territories are below the line: Houston Metro at 63% and Coastal at 58%. The realignment gap fix applied June 1 should lift Gulf Coast roughly 6 points by month-end.",
        sources: "Varicent ICM · Salesforce · comp data model, refreshed 22 min ago",
      },
      {
        question: "Are we overspending on comp relative to attainment?",
        answer:
          "No. Comp spend is tracking 0.7% under plan while blended attainment runs 87.4%; comp cost of revenue is 8.9%, down from 9.3% last quarter. The accelerator exposure if attainment finishes at 96% is already reflected in the June projection.",
        sources: "Varicent ICM · Workday Financials · plan model v2.4",
      },
    ],
  },
  {
    id: "vp-sales",
    label: "VP of Sales",
    tagline: "Rep and territory outliers spotted mid-quarter, not at review.",
    kpis: [
      { label: "Payees on plan", value: "170", note: "4 districts, 12 territories" },
      { label: "Outliers flagged", value: "3", note: "2 crediting, 1 coverage" },
      { label: "Reps under 70%", value: "25", delta: "−6 after realignment fix" },
      { label: "Median attainment", value: "93%", delta: "+4 pts vs. April" },
    ],
    qa: [
      {
        question: "Who are my biggest outliers this month and why?",
        answer:
          "Dana Whitfield (168%): one deal is 62% of her credit and a missing crediting split inflates it. Marcus Chen (41%): three accounts moved districts without a crediting update; corrected attainment is ~78%. Both were flagged before statements released, so neither becomes a dispute.",
        sources: "Varicent ICM · Salesforce · crediting hierarchy, synced Jun 1",
      },
      {
        question: "Which territories need attention before quarter close?",
        answer:
          "Houston Metro (63% pacing) and Coastal (58%) in Gulf Coast. Coastal's gap is real: pipeline coverage is 1.2x. Houston Metro improves to ~71% once June crediting corrections post.",
        sources: "Varicent ICM · Salesforce pipeline · territory model",
      },
    ],
  },
  {
    id: "cfo",
    label: "CFO",
    tagline: "Accrual numbers they can trust before close.",
    kpis: [
      { label: "May accrual variance", value: "+1.4%", note: "booked vs. calculated" },
      { label: "Q2 liability (proj.)", value: "$6.59M", note: "at 96% attainment" },
      { label: "True-up exposure", value: "$58K", delta: "within 1% tolerance" },
      { label: "Close readiness", value: "Day 1", note: "was day 6 pre-agent" },
    ],
    qa: [
      {
        question: "What's our comp accrual exposure if attainment finishes at 96%?",
        answer:
          "Full-quarter liability at 96% attainment is $6.59M against $6.49M booked: a $58K true-up plus $42K accelerator exposure concentrated in Northeast. Every input is traceable to calc run #148 and the June projection model.",
        sources: "Varicent ICM calc run #148 · Workday Financials · audit log",
      },
      {
        question: "Can I get the audit trail for the May calculation?",
        answer:
          "Yes: 170 statements from run #148, every action logged with timestamp, input, output, and approver. One exception (duplicate credit, deal #88213) was routed, fixed, and approved by S. Patel. Export is SOX-formatted.",
        sources: "Agent audit log · Varicent ICM · export to internal audit",
      },
    ],
  },
  {
    id: "revops",
    label: "RevOps lead",
    tagline: "Fewer ad-hoc report requests; more time on plan design.",
    kpis: [
      { label: "Requests answered by agent", value: "118", note: "this quarter" },
      { label: "Median answer time", value: "9s", note: "was 3 days via ticket" },
      { label: "Analyst hours saved", value: "41/mo", delta: "redirected to plan design" },
      { label: "Open exceptions", value: "5", note: "all with suggested fixes" },
    ],
    qa: [
      {
        question: "How many statement disputes came from the May calc run?",
        answer:
          "Nine, down from 31 in February. Seven traced to the duplicate-credit exception on commercial lending splits and were resolved from the exception queue in a median 3.1 hours. Two remain open with the comp admin.",
        sources: "Dispute bot log · Varicent ICM · exception queue",
      },
      {
        question: "What did leadership ask the dashboard this week?",
        answer:
          "Twelve questions: attainment pacing (5), accrual variance (3), realignment impact (2), and accelerator exposure (2). All answered from live data with sources; zero came to your team as tickets.",
        sources: "Agent request log, May 26 – Jun 1",
      },
    ],
  },
];

export type Industry = {
  slug: string;
  name: string;
  titleTag: string;
  metaDescription: string;
  firstSentence: string;
  complexity: string;
  problems: string[];
  caseStudySlug: string;
};

export const INDUSTRIES: Industry[] = [
  {
    slug: "healthcare",
    name: "Healthcare",
    titleTag: "AI Assisted SPM for Healthcare | Lanshore",
    metaDescription:
      "AI Assisted SPM by Lanshore helps healthcare sales organizations manage multi-tier distributor and GPO comp structures with AI agents and compliant incentive design.",
    firstSentence:
      "AI Assisted SPM by Lanshore helps healthcare sales organizations run incentive compensation that survives the industry's structural complexity.",
    complexity:
      "Healthcare comp rarely follows a straight line from sale to credit. Multi-tier distributor and GPO structures mean the rep who influenced the deal isn't the one on the invoice, and crediting has to trace through contract hierarchies to find them. On top of that, compliance constraints shape what an incentive plan is even allowed to reward, and every exception needs a defensible audit trail.",
    problems: [
      "Crediting through distributor and GPO tiers that platforms handle poorly out of the box",
      "Compliance constraints on incentive design that demand documented, auditable comp logic",
      "Chargebacks and contract-price adjustments that arrive weeks after the original credit",
    ],
    caseStudySlug: "rpa-healthcare-provider",
  },
  {
    slug: "telecom",
    name: "Telecom",
    titleTag: "AI Assisted SPM for Telecom | Lanshore",
    metaDescription:
      "AI Assisted SPM by Lanshore helps telecom sales organizations run high-volume comp across channel and direct teams, with chargebacks and clawbacks handled at scale.",
    firstSentence:
      "AI Assisted SPM by Lanshore helps telecom sales organizations run compensation at a volume most industries never see.",
    complexity:
      "Telecom comp is a scale problem. High rep counts across retail, direct, and dealer channels mean thousands of statements per cycle, with channel and direct comp plans coexisting on the same products. Then churn arrives: chargebacks and clawbacks at volume, applied against payouts that already went out the door. Manual processes break under this load: one bad cycle creates a dispute backlog that takes months to clear.",
    problems: [
      "Channel and direct comp plans running side by side on the same product catalog",
      "Chargebacks and clawbacks at volume, applied accurately across thousands of reps",
      "Statement disputes that scale with rep count unless handled by an agent, not an inbox",
    ],
    caseStudySlug: "managed-services-commission-management",
  },
  {
    slug: "technology-digital",
    name: "Technology & Digital",
    titleTag: "AI Assisted SPM for Technology & Digital | Lanshore",
    metaDescription:
      "AI Assisted SPM by Lanshore helps technology sales organizations handle consumption-based comp, mid-year plan changes, and fast territory churn without breaking the comp cycle.",
    firstSentence:
      "AI Assisted SPM by Lanshore helps technology and digital sales organizations keep comp accurate while the business changes underneath it.",
    complexity:
      "Technology comp changes faster than most platforms can be reconfigured. Consumption and usage-based comp means credits accrue continuously rather than at contract signature, so calculations depend on billing data that finance closes on its own schedule. Mid-year plan changes are routine, not exceptional. And fast territory churn means crediting rules that were right in January are wrong by March.",
    problems: [
      "Consumption and usage-based comp calculated from billing data, not bookings",
      "Mid-year plan changes implemented without breaking in-flight calculations",
      "Territory churn that outpaces the platform's crediting configuration",
    ],
    caseStudySlug: "commission-architecture-redesign",
  },
  {
    slug: "retail",
    name: "Retail",
    titleTag: "AI Assisted SPM for Retail | Lanshore",
    metaDescription:
      "AI Assisted SPM by Lanshore helps retail organizations run store-level incentives at scale, seasonal SPIFs, and franchise versus corporate plan splits.",
    firstSentence:
      "AI Assisted SPM by Lanshore helps retail organizations run store-level incentives at a scale where small errors become big payroll problems.",
    complexity:
      "Retail incentives multiply across locations. Store-level incentives at scale mean thousands of associates on plans that change with the season: SPIF-heavy calendars around holidays, clearance pushes, and new-product launches. Franchise versus corporate plan splits add a second dimension: the same role can be paid on different logic depending on who owns the store, and both sides need statements they trust.",
    problems: [
      "Store-level incentive calculation across thousands of associates and locations",
      "Seasonal SPIFs launched, tracked, and trued-up on retail's calendar, not IT's",
      "Franchise vs. corporate plan splits administered on one consistent data model",
    ],
    caseStudySlug: "rpa-retail-order-processing",
  },
  {
    slug: "oil-gas",
    name: "Oil & Gas",
    titleTag: "AI Assisted SPM for Oil & Gas | Lanshore",
    metaDescription:
      "AI Assisted SPM by Lanshore helps oil and gas sales organizations manage long-cycle deals, milestone-based payouts, and joint-venture crediting.",
    firstSentence:
      "AI Assisted SPM by Lanshore helps oil and gas organizations pay incentives on deals that take years, not quarters.",
    complexity:
      "Oil and gas comp runs on a different clock. Long-cycle deals mean a rep's work in one fiscal year pays out across several, so plans need milestone-based payouts tied to project stages rather than a booking date. Joint-venture crediting splits a single deal across partner entities with different ownership percentages, and the split logic lives in contracts, not in the comp platform.",
    problems: [
      "Milestone-based payouts tracked across multi-year project timelines",
      "Joint-venture crediting split correctly across partner entities",
      "Draws and true-ups that bridge long gaps between milestone events",
    ],
    caseStudySlug: "oilfield-invoicing-automation",
  },
  {
    slug: "financial-services",
    name: "Financial Services",
    titleTag: "AI Assisted SPM for Financial Services | Lanshore",
    metaDescription:
      "AI Assisted SPM by Lanshore helps financial services organizations run incentive comp under regulatory oversight, with audit-ready trails and complex crediting hierarchies.",
    firstSentence:
      "AI Assisted SPM by Lanshore helps financial services organizations run incentive compensation that stands up to a regulator.",
    complexity:
      "In financial services, incentive comp is a regulated activity. Regulatory oversight of incentive design means plans are reviewed for the behavior they reward, not just the cost. Audit requirements demand that every calculation, adjustment, and exception be reconstructable months later. And complex crediting hierarchies (branch, banker, referral partner, product specialist) mean one account can generate credit for five people under five different rules.",
    problems: [
      "Incentive plans designed and documented to satisfy regulatory review",
      "Audit trails on every calculation and adjustment, exportable on demand",
      "Multi-level crediting hierarchies maintained accurately as org structures change",
    ],
    caseStudySlug: "rpa-banking-sba-loans",
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}

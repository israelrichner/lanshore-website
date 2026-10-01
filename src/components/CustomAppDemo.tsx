"use client";

import { Fragment, useState } from "react";

/* "Meridian Comp Hub" — a fictitious custom comp app of the kind the Custom Apps
   pillar delivers: statement viewer, dispute bot, approval workflows, and a
   payout calculator modeling named plan designs. All data illustrative. */

const panel = "rounded-lg bg-chart-panel p-5";
const panelTitle = "mb-4 text-xs font-semibold uppercase tracking-wider text-white/50";

type Tab = "statement" | "bot" | "approvals" | "calculator";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "statement", label: "My Statement", icon: "▤" },
  { id: "bot", label: "Dispute Bot", icon: "✉" },
  { id: "approvals", label: "Approvals", icon: "✓" },
  { id: "calculator", label: "Payout Calculator", icon: "∑" },
];

/* ---------- My Statement ---------- */

/* Quota ($2.4M) is crossed mid-June, so the statement splits June volume at
   the crossing: $290K to quota at base rate, $190K above at the accelerator.
   Every rate × base must equal its amount — CalculatorView runs the same plan. */
const STATEMENT_LINES = [
  {
    item: "Base commission: $290K to quota @ 0.85%",
    amount: 2465,
    trace: {
      deal: "4 facilities funded in June before the quota crossing; largest: Brightline Capital (60% split with T. Nguyen)",
      clause: "Plan §2.1: base rate, 0.85% to 100% of quota",
      run: "Calc run #149 · Jun 30, 02:47",
    },
  },
  {
    item: "Accelerator: $190K above quota @ 1.25%",
    amount: 2375,
    trace: {
      deal: "Quota ($2.4M) crossed Jun 9 with the Meridian Grain facility; $190K funded above it",
      clause: "Plan §2.3: 1.25% accelerator above 100%, uncapped to 200%",
      run: "Calc run #149 · Jun 30, 02:47",
    },
  },
  {
    item: "Treasury referral SPIF: 3 referrals @ $150",
    amount: 450,
    trace: {
      deal: "Referrals accepted: Brightline Capital, Gulfstream Logistics, Pier & Main",
      clause: "Plan §3.4: $150 per accepted treasury referral",
      run: "Calc run #149 · referral log synced Jun 28",
    },
  },
  {
    item: "Clawback: Hartwell Logistics early paydown",
    amount: -1840,
    trace: {
      deal: "Hartwell Logistics facility: funded Mar 4, borrower paydown May 22 (day 79 of the 90-day window)",
      clause: "Plan §5.1: clawback inside 90 days of funding",
      run: "Calc run #149 · validation check #221",
    },
  },
  {
    item: "Draw recovery: month 4 of 6",
    amount: -500,
    trace: {
      deal: "Recovery month 4 of 6 · $1,000 balance remains after this deduction",
      clause: "Plan §4.2: draw recovery, negative carryforward",
      run: "Recovery schedule R-2211",
    },
  },
];

function StatementView() {
  const [openLine, setOpenLine] = useState<string | null>(null);
  const net = STATEMENT_LINES.reduce((sum, line) => sum + line.amount, 0);

  function toggleLine(item: string) {
    setOpenLine(openLine === item ? null : item);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
      <div className={panel}>
        <h3 className={panelTitle}>June 2026 statement · A. Delgado, Relationship Manager</h3>
        <table className="w-full text-left text-sm">
          <tbody className="text-white/85">
            {STATEMENT_LINES.map((line) => (
              <Fragment key={line.item}>
                <tr
                  onClick={() => toggleLine(line.item)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleLine(line.item);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-expanded={openLine === line.item}
                  className="cursor-pointer border-t border-white/10 hover:bg-white/5"
                >
                  <td className="py-2.5 pr-4">
                    <span aria-hidden className="mr-1.5 inline-block text-[10px] text-gold-light">
                      {openLine === line.item ? "▾" : "▸"}
                    </span>
                    {line.item}
                  </td>
                  <td
                    className={`py-2.5 text-right font-semibold tabular-nums ${
                      line.amount < 0 ? "text-red-300" : "text-white"
                    }`}
                  >
                    {line.amount < 0 ? "−" : ""}${Math.abs(line.amount).toLocaleString("en-US")}
                  </td>
                </tr>
                {openLine === line.item && (
                  <tr className="bg-ink-soft/10">
                    <td colSpan={2} className="px-2 pb-3 pt-1">
                      <div className="grid gap-2.5 text-xs sm:grid-cols-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                            Deal record
                          </p>
                          <p className="mt-0.5 text-white/80">{line.trace.deal}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                            Plan clause
                          </p>
                          <p className="mt-0.5 text-white/80">{line.trace.clause}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                            Calc run
                          </p>
                          <p className="mt-0.5 text-white/80">{line.trace.run}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            <tr className="border-t-2 border-gold">
              <td className="py-3 font-bold text-white">Net payout</td>
              <td className="py-3 text-right text-lg font-bold text-gold-light">
                ${net.toLocaleString("en-US")}
              </td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2 text-[11px] text-white/45">
          Click any line to trace it to the deal, the plan clause, and the calc run that
          produced it.
        </p>
      </div>
      <div className="space-y-4">
        <div className={panel}>
          <p className="text-xs text-white/50">Quota attainment (QTD)</p>
          <p className="mt-1 text-3xl font-bold text-gold-light">108%</p>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gold" style={{ width: "100%" }} />
          </div>
          <p className="mt-1.5 text-[11px] text-white/50">$2.59M of $2.4M funded volume</p>
        </div>
        <div className={panel}>
          <p className="text-xs text-white/50">Draw balance remaining</p>
          <p className="mt-1 text-3xl font-bold text-white">$1,000</p>
          <p className="text-[11px] text-white/50">2 recovery months left</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Dispute Bot ---------- */

type BotItem = { question: string; answer: string; followUps?: BotItem[] };

const BOT_SCRIPT: BotItem[] = [
  {
    question: "Why is my June payout lower than May?",
    answer:
      "Your June statement includes a $1,840 clawback on the Hartwell Logistics facility. It closed in March and was paid down early on May 22, inside the 90-day clawback window (plan §5.1). Your base commission is actually up 6% month-over-month. Without the clawback, June would have been $4,790.",
    followUps: [
      {
        question: "Can I dispute the Hartwell clawback?",
        answer:
          "You can, but the data says it will likely be denied: the facility closed March 4 and paid down May 22, day 79 of the 90-day window in plan §5.1, with no carve-out for borrower-initiated paydowns. If you still want to file, I'll open a dispute with the deal record, the payoff notice, and the clause reference attached, so the comp admin sees full context.",
        followUps: [
          {
            question: "File the dispute anyway",
            answer:
              "Done. Dispute #D-2214 is open with the Hartwell deal record, the May 22 payoff notice, and plan §5.1 attached. The comp admin has everything they need; average decision time is under 48 hours, and I'll notify you here either way.",
          },
        ],
      },
    ],
  },
  {
    question: "Am I getting credit for the Brightline deal?",
    answer:
      "Yes. Brightline Capital is split 60/40 with T. Nguyen under the treasury referral rule (plan §3.4). Your 60% ($412K of funded volume) posts with the June calc run and appears on this statement in your base commission line. The split was verified against the crediting hierarchy on Jun 1.",
  },
  {
    question: "How does my accelerator work?",
    answer:
      "Once your funded volume passes 100% of quota ($2.4M), every dollar above it pays 1.25% instead of 0.85%. You're at $2.59M, so $190K is earning the accelerated rate, worth $2,375 this quarter so far. There's no cap until 200% of quota.",
  },
  {
    question: "When is my draw fully recovered?",
    answer:
      "You're in month 4 of a 6-month recovery at $500/month, so $1,000 remains; July and August are the last deductions. From September your statement shows no draw line, which at your current pace puts your net payout around $3,450/month. If a month's earnings ever fall below the recovery amount, the balance carries forward instead of going negative (plan §4.2).",
  },
];

function collectAvailable(items: BotItem[], asked: string[]): BotItem[] {
  const out: BotItem[] = [];
  for (const item of items) {
    if (!asked.includes(item.question)) {
      out.push(item);
    } else if (item.followUps) {
      out.push(...collectAvailable(item.followUps, asked));
    }
  }
  return out;
}

function BotView() {
  const [conversation, setConversation] = useState<
    { role: "user" | "bot"; text: string }[]
  >([
    {
      role: "bot",
      text: "Hi Ana, I can answer questions about your statement from your plan document and live comp data. Ask me anything, or tap a question below.",
    },
  ]);
  const [asked, setAsked] = useState<string[]>([]);

  function ask(item: BotItem) {
    setConversation((prev) => [
      ...prev,
      { role: "user", text: item.question },
      { role: "bot", text: item.answer },
    ]);
    setAsked((prev) => [...prev, item.question]);
  }

  const remaining = collectAvailable(BOT_SCRIPT, asked);

  return (
    <div className={panel}>
      <h3 className={panelTitle}>Statement dispute & inquiry bot</h3>
      <div className="space-y-3">
        {conversation.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-lg px-4 py-2.5 text-sm ${
                msg.role === "user"
                  ? "bg-gold font-semibold text-ink-deep"
                  : "bg-ink-soft/20 text-white/90"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      {remaining.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {remaining.map((item) => (
            <button
              key={item.question}
              onClick={() => ask(item)}
              className="rounded-full border border-gold px-3 py-1.5 text-xs font-semibold text-gold-light hover:bg-gold hover:text-ink-deep"
            >
              {item.question}
            </button>
          ))}
        </div>
      )}
      <p className="mt-4 text-[11px] text-white/45">
        Answers come from plan logic and live data, with clause references. Unresolved
        questions escalate to the comp admin with full context attached.
      </p>
    </div>
  );
}

/* ---------- Approvals ---------- */

const WORKFLOWS = [
  {
    title: "Q3 Treasury SPIF: Gulf Coast push",
    requested: "RevOps · Jun 12",
    steps: [
      { step: "Submitted with cost model ($38K est.)", status: "done", who: "R. Vance, RevOps" },
      { step: "Comp admin review", status: "done", who: "S. Patel · Jun 12" },
      { step: "Finance approval", status: "done", who: "J. Moreno · Jun 13" },
      { step: "Plan amendment posted to all Gulf Coast payees", status: "done", who: "Agent · Jun 15" },
    ],
  },
  {
    title: "Quota relief: Windward account bankruptcy",
    requested: "District mgr · Jun 18",
    steps: [
      { step: "Submitted with impact analysis (2 payees)", status: "done", who: "K. Brandt · Jun 18" },
      { step: "Comp admin review", status: "done", who: "S. Patel · Jun 19" },
      { step: "Finance approval", status: "active", who: "pending · J. Moreno" },
      { step: "Quota adjustment applied", status: "pending", who: "Agent, on approval" },
    ],
  },
];

function ApprovalsView() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {WORKFLOWS.map((wf) => (
        <div key={wf.title} className={panel}>
          <h3 className="text-sm font-bold text-white">{wf.title}</h3>
          <p className="mb-4 text-xs text-white/50">Requested by {wf.requested}</p>
          <div className="space-y-0">
            {wf.steps.map((step, i) => (
              <div key={step.step} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      step.status === "done"
                        ? "bg-ink-soft text-white"
                        : step.status === "active"
                          ? "animate-pulse bg-gold text-ink-deep"
                          : "bg-white/10 text-white/40"
                    }`}
                  >
                    {step.status === "done" ? "✓" : i + 1}
                  </span>
                  {i < wf.steps.length - 1 && <span className="h-6 w-px bg-white/15" />}
                </div>
                <div className="pb-4">
                  <p
                    className={`text-sm ${
                      step.status === "pending" ? "text-white/40" : "text-white/90"
                    }`}
                  >
                    {step.step}
                  </p>
                  <p className="text-[11px] text-white/45">{step.who}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Payout Calculator ---------- */

type Plan = {
  id: string;
  name: string;
  quotaM: number; // $M funded volume
  baseRate: number;
  accelRate: number;
  spif: number; // $ per referral
  capM?: number; // creditable volume cap, $M
  defaultVolumeM: number;
  blurb: string;
};

const PLANS: Plan[] = [
  {
    id: "commercial-rm",
    name: "Commercial RM",
    quotaM: 2.4,
    baseRate: 0.0085,
    accelRate: 0.0125,
    spif: 150,
    defaultVolumeM: 2.59,
    blurb: "0.85% base to quota, 1.25% accelerator above it, uncapped to 200%.",
  },
  {
    id: "treasury-sales",
    name: "Treasury Sales",
    quotaM: 1.8,
    baseRate: 0.007,
    accelRate: 0.016,
    spif: 200,
    defaultVolumeM: 1.62,
    blurb: "Leaner 0.70% base with a steep 1.60% accelerator, built for referral velocity.",
  },
  {
    id: "wealth-advisor",
    name: "Wealth Advisor",
    quotaM: 2.0,
    baseRate: 0.0095,
    accelRate: 0.011,
    spif: 100,
    capM: 3.0,
    defaultVolumeM: 2.1,
    blurb: "Richer 0.95% base, gentler 1.10% accelerator, credit capped at 150% of quota.",
  },
];

function calc(volumeM: number, referrals: number, plan: Plan) {
  const creditable = Math.min(volumeM, plan.capM ?? Infinity);
  const base = Math.min(creditable, plan.quotaM) * 1_000_000 * plan.baseRate;
  const accel = Math.max(0, creditable - plan.quotaM) * 1_000_000 * plan.accelRate;
  const spif = referrals * plan.spif;
  return { base, accel, spif, total: base + accel + spif };
}

function PayoutCurve({ volumeM, plan }: { volumeM: number; plan: Plan }) {
  const w = 440;
  const h = 170;
  const maxVol = plan.quotaM * 2;
  const maxPay = calc(maxVol, 0, plan).total;
  const x = (v: number) => 30 + (v / maxVol) * (w - 50);
  const y = (p: number) => h - 26 - (p / maxPay) * (h - 50);

  const step = maxVol / 48;
  const vols: number[] = [];
  for (let v = 0; v <= maxVol + step / 2; v += step) {
    vols.push(Math.min(v, maxVol));
  }
  const pts = vols.map((v) => `${x(v)},${y(calc(v, 0, plan).total)}`);
  const accelPts = vols
    .filter((v) => v >= plan.quotaM)
    .map((v) => `${x(v)},${y(calc(v, 0, plan).total)}`);
  const current = calc(volumeM, 0, plan).total;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Payout curve with your position marked">
      {/* quota line */}
      <line
        x1={x(plan.quotaM)}
        y1="14"
        x2={x(plan.quotaM)}
        y2={h - 26}
        className="stroke-white/20"
        strokeDasharray="4 4"
      />
      <text x={x(plan.quotaM)} y="10" textAnchor="middle" fontSize="10" className="fill-white/60">
        100% quota
      </text>
      {/* credit cap line */}
      {plan.capM !== undefined && plan.capM < maxVol && (
        <>
          <line
            x1={x(plan.capM)}
            y1="14"
            x2={x(plan.capM)}
            y2={h - 26}
            className="stroke-white/20"
            strokeDasharray="2 4"
          />
          <text x={x(plan.capM)} y="10" textAnchor="middle" fontSize="10" className="fill-white/60">
            credit cap
          </text>
        </>
      )}
      {/* curve */}
      <polyline points={pts.join(" ")} fill="none" stroke="var(--chart-blue)" strokeWidth="3" />
      {/* accelerator zone emphasis */}
      <polyline points={accelPts.join(" ")} fill="none" stroke="var(--chart-gold)" strokeWidth="3" />
      {/* marker */}
      <circle
        cx={x(Math.min(volumeM, maxVol))}
        cy={y(current)}
        r="7"
        fill="var(--gold-light)"
        stroke="var(--chart-surface)"
        strokeWidth="2"
      />
      <text
        x={Math.min(x(Math.min(volumeM, maxVol)), w - 90)}
        y={Math.max(y(current) - 14, 22)}
        fontSize="12"
        fontWeight="700"
        fill="var(--gold-light)"
      >
        ${Math.round(current).toLocaleString("en-US")}
      </text>
      {/* axis labels */}
      <text x="30" y={h - 8} fontSize="10" className="fill-white/60">$0</text>
      <text x={x(maxVol) - 30} y={h - 8} fontSize="10" className="fill-white/60">
        ${maxVol.toFixed(1)}M
      </text>
    </svg>
  );
}

function CalculatorView() {
  const [planId, setPlanId] = useState(PLANS[0].id);
  const [volumeM, setVolumeM] = useState(PLANS[0].defaultVolumeM);
  const [referrals, setReferrals] = useState(3);

  const plan = PLANS.find((p) => p.id === planId)!;
  const maxVol = plan.quotaM * 2;
  const result = calc(volumeM, referrals, plan);
  const attainment = Math.round((volumeM / plan.quotaM) * 100);

  function selectPlan(next: Plan) {
    setPlanId(next.id);
    setVolumeM(next.defaultVolumeM);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className={panel}>
        <h3 className={panelTitle}>Model your quarter · pick a plan design</h3>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a plan design">
          {PLANS.map((p) => (
            <button
              key={p.id}
              onClick={() => selectPlan(p)}
              aria-pressed={planId === p.id}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                planId === p.id
                  ? "bg-gold text-ink-deep"
                  : "bg-white/5 text-white/60 hover:text-white"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-white/45">{plan.blurb}</p>
        <label className="mt-5 block">
          <div className="flex justify-between text-sm">
            <span className="text-white/80">Funded volume</span>
            <span className="font-bold text-white">
              ${volumeM.toFixed(2)}M · {attainment}% of quota
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={maxVol}
            step="0.01"
            value={volumeM}
            onChange={(e) => setVolumeM(parseFloat(e.target.value))}
            className="mt-2 w-full accent-gold"
            aria-label="Funded volume in millions"
          />
        </label>
        <label className="mt-5 block">
          <div className="flex justify-between text-sm">
            <span className="text-white/80">Treasury referrals</span>
            <span className="font-bold text-white">{referrals}</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={referrals}
            onChange={(e) => setReferrals(parseInt(e.target.value))}
            className="mt-2 w-full accent-gold"
            aria-label="Number of treasury referrals"
          />
        </label>
        <div className="mt-6 space-y-2 border-t border-white/10 pt-4 text-sm">
          <div className="flex justify-between text-white/80">
            <span>Base: up to quota @ {(plan.baseRate * 100).toFixed(2)}%</span>
            <span className="font-semibold text-white">
              ${Math.round(result.base).toLocaleString("en-US")}
            </span>
          </div>
          <div className="flex justify-between text-white/80">
            <span>Accelerator: above quota @ {(plan.accelRate * 100).toFixed(2)}%</span>
            <span className="font-semibold text-gold-light">
              ${Math.round(result.accel).toLocaleString("en-US")}
            </span>
          </div>
          <div className="flex justify-between text-white/80">
            <span>Referral SPIF @ ${plan.spif}</span>
            <span className="font-semibold text-white">
              ${result.spif.toLocaleString("en-US")}
            </span>
          </div>
          <div className="flex justify-between border-t border-gold pt-2 text-base font-bold">
            <span className="text-white">Projected payout</span>
            <span className="text-gold-light">
              ${Math.round(result.total).toLocaleString("en-US")}
            </span>
          </div>
        </div>
      </div>
      <div className={panel}>
        <h3 className={panelTitle}>Payout curve · {plan.name} · gold = accelerator zone</h3>
        <PayoutCurve volumeM={volumeM} plan={plan} />
        <p className="mt-3 text-[11px] text-white/45">
          Switch plans and drag the sliders: the math is each plan document&rsquo;s math,
          not a spreadsheet approximation. Purpose-built calculators like this cover draws,
          clawbacks, and edge cases the platform can&rsquo;t model.
        </p>
      </div>
    </div>
  );
}

/* ---------- Shell ---------- */

export default function CustomAppDemo() {
  const [tab, setTab] = useState<Tab>("statement");

  const views: Record<Tab, React.ReactNode> = {
    statement: <StatementView />,
    bot: <BotView />,
    approvals: <ApprovalsView />,
    calculator: <CalculatorView />,
  };

  return (
    <div className="overflow-hidden rounded-xl bg-chart-surface shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-5 py-4">
        <div>
          <p className="font-bold text-white">
            Meridian Comp Hub{" "}
            <span className="font-normal text-white/50">· a custom app built by Lanshore</span>
          </p>
          <p className="text-xs text-white/50">Signed in as A. Delgado, Relationship Manager · June 2026</p>
        </div>
        <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink-deep">
          Live demo · fictitious data
        </span>
      </div>

      <div className="grid lg:grid-cols-[190px_1fr]">
        {/* Sidebar nav */}
        <nav
          className="flex flex-wrap gap-1 border-b border-white/10 p-3 lg:flex-col lg:border-b-0 lg:border-r"
          aria-label="App sections"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-semibold ${
                tab === t.id
                  ? "bg-gold text-ink-deep"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span aria-hidden>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-5">{views[tab]}</div>
      </div>
    </div>
  );
}

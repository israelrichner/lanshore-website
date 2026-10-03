"use client";

import { useEffect, useState } from "react";
import { Play, RotateCcw } from "lucide-react";

/* Fictitious data: Meridian Trust Bank's June comp cycle and its
   Xactly Incent → Varicent ICM migration. All figures illustrative. */

const panel = "rounded-lg bg-chart-panel p-5";
const panelTitle = "mb-4 text-xs font-semibold uppercase tracking-wider text-white/50";
const inset = "rounded-md bg-ink-soft/20";

/* ---------- Mode 1: agent-run comp cycle ---------- */

type StageStatus = "done" | "active" | "pending";

const CYCLE_STAGES: { name: string; status: StageStatus; detail: string }[] = [
  { name: "Data loads", status: "done", detail: "4 sources · 02:00" },
  { name: "Calculation", status: "done", detail: "run #149 · 02:47" },
  { name: "Validation", status: "done", detail: "96 / 98 checks" },
  { name: "Exceptions", status: "active", detail: "3 open" },
  { name: "Approvals", status: "pending", detail: "awaiting review" },
  { name: "Statements", status: "pending", detail: "release Jun 3" },
];

const CYCLE_KPIS = [
  { label: "Close progress", value: "Day 2", note: "target: day 3 close" },
  { label: "Statements staged", value: "170", note: "all 170 payees" },
  { label: "Open exceptions", value: "3", delta: "agent fixes suggested on all 3" },
  { label: "Admin hours this cycle", value: "6.5", delta: "was 68 before agents" },
];

/* Log lines streamed per stage when the cycle is replayed. */
const STAGE_LOGS: { time: string; entry: string }[][] = [
  [
    { time: "02:00", entry: "Loaded Salesforce closed-won, core banking funded volume, HR roster, FX rates" },
    { time: "02:14", entry: "Roster delta: 2 new hires added to Commercial RM plan, 1 termination processed" },
  ],
  [{ time: "02:47", entry: "Calculation run #149 complete; 170 statements staged" }],
  [{ time: "03:05", entry: "98 validation checks run; 2 warnings raised, both explained by realignment" }],
  [{ time: "03:06", entry: "3 exceptions routed to queue, each with a suggested fix attached" }],
  [{ time: "03:07", entry: "Approval packet sent to S. Patel; accrual preview posted to Workday sandbox" }],
  [{ time: "03:09", entry: "Statements queued for Jun 3 release, pending exception sign-off" }],
];

const RUN_LOG = STAGE_LOGS.flat().slice(0, 5);

const INITIAL_EXCEPTIONS = [
  {
    id: 1,
    issue: "Duplicate credit: deal #91442 appears in both April and May feeds",
    fix: "Reverse April credit ($2,140); keep May per funding date",
    fixed: false,
  },
  {
    id: 2,
    issue: "Negative payout: clawback exceeds J. Reyes's June earnings",
    fix: "Carry $412 balance to July per plan §4.2 rather than negative check",
    fixed: false,
  },
  {
    id: 3,
    issue: "Unmapped territory: new hire M. Osei has no crediting rule",
    fix: "Apply Gulf Coast default hierarchy pending territory assignment",
    fixed: false,
  },
];

const VALIDATIONS = [
  { check: "Statement totals reconcile to calc run", result: "pass" },
  { check: "No payee over 200% of quarterly cap", result: "pass" },
  { check: "Crediting hierarchy matches HR roster", result: "pass" },
  { check: "Attainment moved >25 pts month-over-month", result: "warn: 2 payees, both explained by realignment" },
];

type RunState = "idle" | "running" | "done";

function CycleView() {
  const [exceptions, setExceptions] = useState(INITIAL_EXCEPTIONS);
  const [runState, setRunState] = useState<RunState>("idle");
  const [progress, setProgress] = useState(0); // stages completed in the replay
  const [streamLog, setStreamLog] = useState<{ time: string; entry: string }[]>([]);
  const [stageFilter, setStageFilter] = useState<number | null>(null);

  useEffect(() => {
    if (runState !== "running") return;
    let completed = 0;
    const timer = setInterval(() => {
      completed += 1;
      setProgress(completed);
      setStreamLog(STAGE_LOGS.slice(0, completed).flat());
      if (completed >= CYCLE_STAGES.length) {
        clearInterval(timer);
        setRunState("done");
      }
    }, 1100);
    return () => clearInterval(timer);
  }, [runState]);

  function startRun() {
    setProgress(0);
    setStreamLog([]);
    setRunState("running");
  }

  function stageStatus(index: number): StageStatus {
    if (runState === "idle") return CYCLE_STAGES[index].status;
    if (runState === "done") return "done";
    return index < progress ? "done" : index === progress ? "active" : "pending";
  }

  const logRows =
    stageFilter !== null
      ? STAGE_LOGS[stageFilter]
      : runState === "idle"
        ? RUN_LOG
        : streamLog;

  return (
    <div className="space-y-4">
      {/* Pipeline stepper */}
      <div className={panel}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className={panelTitle}>June cycle · agent-run pipeline · click a stage for its log</h3>
          <button
            onClick={startRun}
            disabled={runState === "running"}
            className={`mb-4 flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-bold ${
              runState === "running"
                ? "cursor-default bg-white/10 text-white/50"
                : "bg-gold text-ink-deep hover:bg-gold-hover"
            }`}
          >
            {runState === "running" ? (
              <>Cycle running…</>
            ) : runState === "done" ? (
              <>
                <RotateCcw size={13} aria-hidden /> Run it again
              </>
            ) : (
              <>
                <Play size={13} aria-hidden /> Run the cycle
              </>
            )}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
          {CYCLE_STAGES.map((stage, i) => {
            const status = stageStatus(i);
            return (
              <div key={stage.name} className="relative">
                <button
                  onClick={() => setStageFilter(stageFilter === i ? null : i)}
                  aria-pressed={stageFilter === i}
                  aria-label={`${stage.name}: show this stage's log`}
                  className={`w-full rounded-md border p-3 text-center transition-colors ${
                    status === "done"
                      ? "border-ink-soft bg-ink-soft/20"
                      : status === "active"
                        ? "animate-pulse border-gold bg-gold/10"
                        : "border-white/10 bg-white/5"
                  } ${stageFilter === i ? "ring-1 ring-gold" : "hover:border-gold/50"}`}
                >
                  <p
                    className={`text-xs font-bold ${
                      status === "active" ? "text-gold-light" : "text-white"
                    }`}
                  >
                    {status === "done" ? "✓ " : ""}
                    {stage.name}
                  </p>
                  <p className="mt-1 text-[10px] text-white/50">{stage.detail}</p>
                </button>
                {i < CYCLE_STAGES.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 text-gold lg:block"
                  >
                    →
                  </span>
                )}
              </div>
            );
          })}
        </div>
        {runState === "done" && (
          <p className="mt-3 text-xs font-semibold text-emerald-300">
            ✓ Cycle complete in minutes of agent time; humans reviewed 3 exceptions and one approval packet.
          </p>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CYCLE_KPIS.map((kpi) => (
          <div key={kpi.label} className={panel}>
            <p className="text-xs text-white/50">{kpi.label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{kpi.value}</p>
            {"delta" in kpi && kpi.delta && (
              <p className="text-xs font-semibold text-gold-light">{kpi.delta}</p>
            )}
            {"note" in kpi && kpi.note && <p className="text-xs text-white/50">{kpi.note}</p>}
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Exception queue — interactive */}
        <div className={panel}>
          <h3 className={panelTitle}>Exception queue · you approve, agents execute</h3>
          <div className="space-y-3">
            {exceptions.map((ex) => (
              <div key={ex.id} className={`${inset} p-3`}>
                <p className="text-sm font-semibold text-white">{ex.issue}</p>
                <p className="mt-1 text-xs text-white/70">
                  <span className="font-semibold text-gold-light">Suggested fix:</span> {ex.fix}
                </p>
                {ex.fixed ? (
                  <p className="mt-2 text-xs font-bold text-emerald-300">
                    ✓ Fix applied, logged to audit trail
                  </p>
                ) : (
                  <button
                    onClick={() =>
                      setExceptions((prev) =>
                        prev.map((p) => (p.id === ex.id ? { ...p, fixed: true } : p))
                      )
                    }
                    className="mt-2 rounded bg-gold px-3 py-1 text-xs font-bold text-ink-deep hover:bg-gold-hover"
                  >
                    Apply suggested fix
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Run log + validations */}
        <div className="space-y-4">
          <div className={panel}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className={panelTitle}>
                Agent run log{runState === "running" && stageFilter === null ? " · streaming" : ""}
                {stageFilter !== null ? ` · ${CYCLE_STAGES[stageFilter].name}` : ""}
              </h3>
              {stageFilter !== null && (
                <button
                  onClick={() => setStageFilter(null)}
                  className="mb-4 text-xs font-semibold text-white/50 hover:text-white"
                >
                  Show full log ✕
                </button>
              )}
            </div>
            <div className="space-y-2" aria-live="polite">
              {logRows.map((row) => (
                <div key={`${row.time}-${row.entry}`} className="flex gap-3 text-sm">
                  <span className="shrink-0 font-mono text-xs text-gold-light">{row.time}</span>
                  <span className="text-white/80">{row.entry}</span>
                </div>
              ))}
              {runState === "running" && stageFilter === null && (
                <div className="flex gap-3 text-sm">
                  <span className="shrink-0 animate-pulse font-mono text-xs text-gold-light">▋</span>
                  <span className="animate-pulse text-white/50">
                    {progress < CYCLE_STAGES.length ? `${CYCLE_STAGES[progress].name} in progress…` : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className={panel}>
            <h3 className={panelTitle}>Validation checks</h3>
            <div className="space-y-2">
              {VALIDATIONS.map((v) => (
                <div key={v.check} className="flex items-start justify-between gap-3 text-sm">
                  <span className="text-white/80">{v.check}</span>
                  <span
                    className={`shrink-0 text-xs font-bold ${
                      v.result === "pass" ? "text-emerald-300" : "text-gold-light"
                    }`}
                  >
                    {v.result === "pass" ? "✓ pass" : "⚠ " + v.result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Mode 2: vendor migration ---------- */

const MIGRATION_PHASES = [
  { name: "Discovery & plan inventory", status: "done", detail: "149 components cataloged" },
  { name: "Rule translation", status: "done", detail: "142 auto · 7 rebuilt" },
  { name: "Data migration", status: "done", detail: "36 months of history" },
  { name: "Parallel run", status: "active", detail: "cycle 2 of 3 · 99.2% match" },
  { name: "Cutover", status: "pending", detail: "target Aug 1" },
] as const;

const MIGRATION_KPIS = [
  { label: "Plan components translated", value: "142/149", note: "7 rebuilt by consultants" },
  { label: "Parallel run match rate", value: "99.2%", delta: "+1.1 pts vs. cycle 1" },
  { label: "History migrated", value: "36 mo", note: "statements + audit trail" },
  { label: "Payees affected", value: "170", note: "zero missed payrolls to date" },
];

const PARALLEL_RUN = [
  {
    group: "Commercial RM",
    legacy: 612400,
    target: 612400,
    status: "Matched",
    detail:
      "52 payees matched to the penny. Tiered rates, draw recovery, and accelerator logic all reproduce exactly; statement checksums equal in both systems.",
  },
  {
    group: "Treasury Sales",
    legacy: 148220,
    target: 148220,
    status: "Matched",
    detail:
      "24 payees matched, including 14 referral splits verified line-by-line against the crediting hierarchy.",
  },
  {
    group: "Wealth Advisors",
    legacy: 201880,
    target: 203140,
    status: "Investigating",
    detail:
      "The agent isolated the $1,260 delta to the 2.00–2.25% tier boundary: the legacy engine rounds the rate before applying it, the new one after. 11 of 26 payees affected, $9–$186 each. The new system is right.",
  },
  {
    group: "Retail / Branch",
    legacy: 96310,
    target: 96310,
    status: "Matched",
    detail: "68 payees matched. Flat-rate branch plans translated 1:1 with no manual rebuild.",
  },
];

const RULE_TRANSLATION = [
  { rule: "Tiered commission rate table (6 tiers)", how: "Auto-translated by agent" },
  { rule: "Draw recovery logic", how: "Auto-translated by agent" },
  { rule: "Accelerator above 100% of quota", how: "Auto-translated by agent" },
  { rule: "JV / referral crediting override", how: "Rebuilt by consultant (no legacy equivalent)" },
  { rule: "Territory crediting hierarchy", how: "Auto-translated · 3 exceptions resolved" },
];

function money(n: number) {
  return "$" + n.toLocaleString("en-US");
}

function MigrationView() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const max = Math.max(...PARALLEL_RUN.map((r) => Math.max(r.legacy, r.target)));

  return (
    <div className="space-y-4">
      {/* From → to banner */}
      <div className={panel}>
        <div className="flex flex-wrap items-center justify-center gap-4 py-2 text-center">
          <div className="rounded-lg border border-white/15 bg-white/5 px-6 py-4">
            <p className="text-xs uppercase tracking-wider text-white/50">Migrating from</p>
            <p className="text-lg font-bold text-white">Xactly Incent</p>
          </div>
          <div className="text-3xl text-gold" aria-hidden>
            ⟶
          </div>
          <div className="rounded-lg border border-gold bg-gold/10 px-6 py-4">
            <p className="text-xs uppercase tracking-wider text-white/50">Migrating to</p>
            <p className="text-lg font-bold text-gold-light">Varicent ICM</p>
          </div>
        </div>
        {/* Phase tracker */}
        <div className="mt-4 grid gap-3 sm:grid-cols-5">
          {MIGRATION_PHASES.map((phase) => (
            <div
              key={phase.name}
              className={`rounded-md border p-3 ${
                phase.status === "done"
                  ? "border-ink-soft bg-ink-soft/20"
                  : phase.status === "active"
                    ? "animate-pulse border-gold bg-gold/10"
                    : "border-white/10 bg-white/5"
              }`}
            >
              <p
                className={`text-xs font-bold ${
                  phase.status === "active" ? "text-gold-light" : "text-white"
                }`}
              >
                {phase.status === "done" ? "✓ " : ""}
                {phase.name}
              </p>
              <p className="mt-1 text-[10px] text-white/50">{phase.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {MIGRATION_KPIS.map((kpi) => (
          <div key={kpi.label} className={panel}>
            <p className="text-xs text-white/50">{kpi.label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{kpi.value}</p>
            {"delta" in kpi && kpi.delta && (
              <p className="text-xs font-semibold text-gold-light">{kpi.delta}</p>
            )}
            {"note" in kpi && kpi.note && <p className="text-xs text-white/50">{kpi.note}</p>}
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Parallel run comparison */}
        <div className={panel}>
          <h3 className={panelTitle}>Parallel run · May payouts, both systems · click a group</h3>
          <div className="space-y-3">
            {PARALLEL_RUN.map((row) => (
              <button
                key={row.group}
                onClick={() => setOpenGroup(openGroup === row.group ? null : row.group)}
                aria-expanded={openGroup === row.group}
                className={`block w-full rounded-md p-1.5 text-left transition-colors ${
                  openGroup === row.group ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <div className="mb-1 flex justify-between gap-2 text-xs">
                  <span className="font-semibold text-white">
                    <span aria-hidden className="mr-1 text-[10px] text-gold-light">
                      {openGroup === row.group ? "▾" : "▸"}
                    </span>
                    {row.group}
                  </span>
                  <span
                    className={`font-bold ${
                      row.status === "Matched" ? "text-emerald-300" : "text-gold-light"
                    }`}
                  >
                    {row.status === "Matched"
                      ? "✓ matched"
                      : `Δ ${money(row.target - row.legacy)} · investigating`}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 rounded bg-chart-blue"
                      style={{ width: `${(row.legacy / max) * 78}%` }}
                    />
                    <span className="text-[10px] text-white/50">{money(row.legacy)} legacy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 rounded bg-chart-gold"
                      style={{ width: `${(row.target / max) * 78}%` }}
                    />
                    <span className="text-[10px] text-white/50">{money(row.target)} new</span>
                  </div>
                </div>
                {openGroup === row.group && (
                  <p className={`${inset} mt-2 p-2.5 text-xs text-white/80`}>{row.detail}</p>
                )}
              </button>
            ))}
          </div>
          <p className={`${inset} mt-4 p-3 text-xs text-white/70`}>
            <span className="font-semibold text-gold-light">The $1,260 Wealth Advisors delta?</span>{" "}
            A rounding bug in the legacy rate table, live for 14 months. The new system is
            right: the parallel run caught what nobody knew was broken.
          </p>
        </div>

        {/* Rule translation */}
        <div className={panel}>
          <h3 className={panelTitle}>Rule translation · legacy config → new platform</h3>
          <div className="space-y-2.5">
            {RULE_TRANSLATION.map((row) => (
              <div key={row.rule} className={`${inset} p-3`}>
                <p className="text-sm font-semibold text-white">{row.rule}</p>
                <p
                  className={`mt-0.5 text-xs ${
                    row.how.startsWith("Auto") ? "text-emerald-300" : "text-gold-light"
                  }`}
                >
                  {row.how}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-white/45">
            Agents translate the mechanical 95%; consultants who know both platforms rebuild
            what has no equivalent, and every payee is paid correctly throughout.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Shell ---------- */

export default function OperationsDemo() {
  const [mode, setMode] = useState<"cycle" | "migration">("cycle");

  return (
    <div className="overflow-hidden rounded-xl bg-chart-surface shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-5 py-4">
        <div>
          <p className="font-bold text-white">Meridian Trust Bank · Comp Operations</p>
          <p className="text-xs text-white/50">June 2026 cycle · Xactly → Varicent migration in flight</p>
        </div>
        <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink-deep">
          Live demo · fictitious data
        </span>
      </div>

      <div className="flex gap-1 border-b border-white/10 px-5 pt-3" role="tablist" aria-label="Choose a scenario">
        <button
          role="tab"
          aria-selected={mode === "cycle"}
          onClick={() => setMode("cycle")}
          className={`rounded-t-md px-4 py-2 text-sm font-semibold ${
            mode === "cycle" ? "bg-chart-panel text-gold-light" : "text-white/60 hover:text-white"
          }`}
        >
          Agent-run comp cycle
        </button>
        <button
          role="tab"
          aria-selected={mode === "migration"}
          onClick={() => setMode("migration")}
          className={`rounded-t-md px-4 py-2 text-sm font-semibold ${
            mode === "migration" ? "bg-chart-panel text-gold-light" : "text-white/60 hover:text-white"
          }`}
        >
          Vendor migration
        </button>
      </div>

      <div className="p-5">{mode === "cycle" ? <CycleView /> : <MigrationView />}</div>
    </div>
  );
}

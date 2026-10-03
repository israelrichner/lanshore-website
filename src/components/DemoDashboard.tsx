"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import {
  ACCRUALS,
  AUDIT_TRAIL,
  BUCKET_REPS,
  CFO_ATT_RANGE,
  CFO_BASELINE_ATT,
  cfoWhatIf,
  CRO_INSIGHTS,
  DEMO_AS_OF,
  DEMO_COMPANY,
  DISTRIBUTION,
  DISTRICTS,
  EXCEPTION_QUEUE,
  MONTHLY,
  MONTHLY_BY_DISTRICT,
  OUTLIERS,
  PERSONAS,
  REQUEST_LOG,
  isPersonaId,
  type Kpi,
  type MonthlyPoint,
  type PersonaId,
  type QA,
} from "@/lib/demoData";

/* Shared dark-panel styling for the dashboard shell. */
const panel = "rounded-lg bg-chart-panel p-5";
const panelTitle = "mb-4 text-xs font-semibold uppercase tracking-wider text-white/50";
const inset = "rounded-md bg-ink-soft/20";
const tooltipBox =
  "pointer-events-none absolute z-10 w-max rounded-md border border-white/15 bg-ink-deep px-3 py-2 shadow-lg";
const filterPill = (active: boolean) =>
  `rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
    active ? "bg-gold text-ink-deep" : "bg-white/5 text-white/60 hover:text-white"
  }`;

type ViewProps = { kpis: Kpi[] };

function Sparkline({ points }: { points: number[] }) {
  const w = 72;
  const h = 22;
  const min = Math.min(...points);
  const range = Math.max(...points) - min || 1;
  const x = (i: number) => 4 + (i / (points.length - 1)) * (w - 8);
  const y = (v: number) => h - 4 - ((v - min) / range) * (h - 8);
  const last = points.length - 1;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-[22px] w-[72px] shrink-0" aria-hidden>
      <polyline
        points={points.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
        fill="none"
        stroke="var(--chart-blue)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      <circle cx={x(last)} cy={y(points[last])} r="2.5" fill="var(--gold-light)" />
    </svg>
  );
}

function KpiRow({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <div key={kpi.label} className={panel}>
          <p className="text-xs text-white/50">{kpi.label}</p>
          <div className="mt-1 flex items-end justify-between gap-2">
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
            {kpi.trend && <Sparkline points={kpi.trend} />}
          </div>
          {kpi.delta && (
            <p
              className={`text-xs font-semibold ${
                kpi.tone === "warn" ? "text-red-300" : "text-gold-light"
              }`}
            >
              {kpi.tone === "warn" ? "⚠ " : ""}
              {kpi.delta}
            </p>
          )}
          {kpi.note && <p className="text-xs text-white/50">{kpi.note}</p>}
        </div>
      ))}
    </div>
  );
}

/* Bar with a 4px rounded data-end and a square baseline. */
function barPath(cx: number, top: number, base: number, width: number) {
  const r = Math.min(4, Math.max(0, (base - top) / 2));
  const left = cx - width / 2;
  return [
    `M ${left} ${base}`,
    `V ${top + r}`,
    `Q ${left} ${top} ${left + r} ${top}`,
    `H ${left + width - r}`,
    `Q ${left + width} ${top} ${left + width} ${top + r}`,
    `V ${base}`,
    "Z",
  ].join(" ");
}

/* Attainment (line) and comp spend (bars) as two aligned small multiples on
   one shared x-axis — one scale per plot, never two scales on one plot.
   Hover or focus any month for a crosshair and a tooltip across both. */
function TrendPanel({ data, heading }: { data: MonthlyPoint[]; heading: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);

  const w = 460;
  const h = 250;
  const attTop = 22;
  const attBottom = 118;
  const barTop = 154;
  const barBase = 232;
  const slot = w / data.length;
  const x = (i: number) => slot * i + slot / 2;

  const attMin = 60;
  const attMax = 110;
  const attY = (v: number) =>
    attBottom - ((v - attMin) / (attMax - attMin)) * (attBottom - attTop);
  const maxSpend = Math.max(...data.map((m) => m.spend)) * 1.15;
  const barY = (v: number) => barBase - (v / maxSpend) * (barBase - barTop);
  const spendTick = maxSpend > 2 ? 2 : maxSpend > 1 ? 1 : 0.5;
  const barW = 22;

  const lastActual = data.reduce((acc, m, i) => (m.projected ? acc : i), 0);
  const solidPts = data
    .slice(0, lastActual + 1)
    .map((m, i) => `${x(i)},${attY(m.attainment)}`)
    .join(" ");
  const dashedPts = data
    .map((m, i) => ({ m, i }))
    .filter(({ i }) => i >= lastActual)
    .map(({ m, i }) => `${x(i)},${attY(m.attainment)}`)
    .join(" ");
  const last = data[data.length - 1];

  return (
    <div className={panel}>
      <div className="flex items-start justify-between gap-2">
        <h3 className={panelTitle}>{heading}</h3>
        <button className={filterPill(showTable)} onClick={() => setShowTable(!showTable)}>
          {showTable ? "Chart view" : "Table view"}
        </button>
      </div>

      {showTable ? (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-white/50">
              <th className="pb-2 font-semibold">Month</th>
              <th className="pb-2 font-semibold">Attainment</th>
              <th className="pb-2 font-semibold">Comp spend</th>
            </tr>
          </thead>
          <tbody className="text-white/85">
            {data.map((m) => (
              <tr key={m.month} className="border-t border-white/10">
                <td className="py-2 font-semibold text-white">
                  {m.month}
                  {m.projected && <span className="text-white/50"> (proj.)</span>}
                </td>
                <td className="py-2 tabular-nums">{m.attainment.toFixed(1)}%</td>
                <td className="py-2 tabular-nums">${m.spend.toFixed(2)}M</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="relative">
          {hover !== null && (
            <div
              className={`${tooltipBox} top-2`}
              style={{
                left: `${Math.min(Math.max((x(hover) / w) * 100, 15), 85)}%`,
                transform: "translateX(-50%)",
              }}
            >
              <p className="text-[11px] font-semibold text-white/60">
                {data[hover].month}
                {data[hover].projected ? " · projected" : ""}
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm">
                <span aria-hidden className="inline-block h-0.5 w-3 rounded bg-chart-gold" />
                <span className="font-bold text-white">
                  {data[hover].attainment.toFixed(1)}%
                </span>
                <span className="text-xs text-white/60">attainment</span>
              </p>
              <p className="mt-0.5 flex items-center gap-2 text-sm">
                <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-sm bg-chart-blue" />
                <span className="font-bold text-white">${data[hover].spend.toFixed(2)}M</span>
                <span className="text-xs text-white/60">comp spend</span>
              </p>
            </div>
          )}

          <svg
            viewBox={`0 0 ${w} ${h}`}
            className="w-full"
            role="img"
            aria-label="Attainment percent and comp spend by month, two aligned charts"
            onPointerLeave={() => setHover(null)}
          >
            {/* attainment band */}
            <text x="4" y={attTop - 8} fontSize="9" className="fill-white/40" style={{ letterSpacing: "0.08em" }}>
              ATTAINMENT %
            </text>
            {[70, 90].map((tick) => (
              <g key={tick}>
                <line x1="0" x2={w} y1={attY(tick)} y2={attY(tick)} className="stroke-white/10" strokeWidth="1" />
                <text x="4" y={attY(tick) - 3} fontSize="9" className="fill-white/40">
                  {tick}%
                </text>
              </g>
            ))}
            {/* spend band */}
            <text x="4" y={barTop - 8} fontSize="9" className="fill-white/40" style={{ letterSpacing: "0.08em" }}>
              COMP SPEND ($M)
            </text>
            <line x1="0" x2={w} y1={barY(spendTick)} y2={barY(spendTick)} className="stroke-white/10" strokeWidth="1" />
            <text x="4" y={barY(spendTick) - 3} fontSize="9" className="fill-white/40">
              ${spendTick}M
            </text>
            <line x1="0" x2={w} y1={barBase} y2={barBase} className="stroke-white/15" strokeWidth="1" />

            {/* crosshair */}
            {hover !== null && (
              <line
                x1={x(hover)}
                x2={x(hover)}
                y1={attTop - 4}
                y2={barBase}
                className="stroke-white/25"
                strokeWidth="1"
              />
            )}

            {/* spend bars */}
            {data.map((m, i) => (
              <g key={m.month}>
                <path
                  d={barPath(x(i), barY(m.spend), barBase, barW)}
                  fill="var(--chart-blue)"
                  opacity={m.projected ? 0.45 : 1}
                />
                {hover === i && (
                  <path d={barPath(x(i), barY(m.spend), barBase, barW)} fill="white" opacity="0.12" />
                )}
              </g>
            ))}

            {/* attainment line: solid actuals, dashed projection */}
            <polyline
              points={solidPts}
              fill="none"
              stroke="var(--chart-gold)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {dashedPts.split(" ").length > 1 && (
              <polyline
                points={dashedPts}
                fill="none"
                stroke="var(--chart-gold)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="5 5"
              />
            )}
            {data.map((m, i) => (
              <circle
                key={m.month}
                cx={x(i)}
                cy={attY(m.attainment)}
                r={hover === i ? 6 : 4.5}
                fill="var(--chart-gold)"
                stroke="var(--chart-panel)"
                strokeWidth="2"
              />
            ))}
            {/* direct label on the endpoint only — the tooltip carries the rest */}
            <text
              x={Math.min(x(data.length - 1) + 24, w - 4)}
              y={Math.max(attY(last.attainment) - 12, 16)}
              textAnchor="end"
              fontSize="11"
              fontWeight="700"
              fill="var(--gold-light)"
            >
              {last.attainment.toFixed(1)}%{last.projected ? " (proj.)" : ""}
            </text>

            {/* month labels */}
            {data.map((m, i) => (
              <text key={m.month} x={x(i)} y={h - 4} textAnchor="middle" fontSize="11" className="fill-white/60">
                {m.month}
              </text>
            ))}

            {/* full-height hit targets, keyboard-reachable */}
            {data.map((m, i) => (
              <rect
                key={m.month}
                x={slot * i}
                y="0"
                width={slot}
                height={h}
                fill="transparent"
                tabIndex={0}
                aria-label={`${m.month}: attainment ${m.attainment.toFixed(1)} percent, comp spend $${m.spend.toFixed(2)} million${m.projected ? ", projected" : ""}`}
                onPointerEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
              />
            ))}
          </svg>
        </div>
      )}
    </div>
  );
}

/* ---------- CRO ---------- */

function CroView({ kpis }: ViewProps) {
  const [district, setDistrict] = useState<string>("all");
  const [openInsight, setOpenInsight] = useState<string | null>(null);
  const [reviewed, setReviewed] = useState<string[]>([]);

  const monthly = district === "all" ? MONTHLY : MONTHLY_BY_DISTRICT[district];
  const selected = DISTRICTS.find((d) => d.name === district);
  const activeKpis: Kpi[] = selected
    ? [
        {
          label: `Attainment (QTD) · ${selected.name}`,
          value: `${selected.attainment}%`,
          note: `${selected.reps} payees on plan`,
          trend: monthly.map((m) => m.attainment),
        },
        {
          label: "Comp spend (QTD)",
          value: `$${selected.spend.toFixed(2)}M`,
          note: "of $4.28M company-wide",
          trend: monthly.map((m) => m.spend),
        },
        {
          label: "Comp cost of revenue",
          value: `${selected.costOfRevenue.toFixed(1)}%`,
          note: "vs. 8.9% blended",
        },
        {
          label: "Projected quarter-end",
          value: `${monthly[monthly.length - 1].attainment.toFixed(0)}%`,
          note: "attainment at current pace",
        },
      ]
    : kpis;
  const insights =
    district === "all" ? CRO_INSIGHTS : CRO_INSIGHTS.filter((i) => i.district === district);

  return (
    <div className="space-y-4">
      {/* District filter — recomputes KPIs and the chart */}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by district">
        <span className="text-xs font-semibold uppercase tracking-wider text-white/50">View:</span>
        <button className={filterPill(district === "all")} onClick={() => setDistrict("all")}>
          All districts
        </button>
        {DISTRICTS.map((d) => (
          <button key={d.name} className={filterPill(district === d.name)} onClick={() => setDistrict(d.name)}>
            {d.name}
          </button>
        ))}
      </div>

      <KpiRow kpis={activeKpis} />

      <div className="grid gap-4 lg:grid-cols-2">
        <TrendPanel
          data={monthly}
          heading={`Attainment & comp spend, Jan–Jun${district === "all" ? "" : ` · ${district}`}`}
        />
        <div className={panel}>
          <h3 className={panelTitle}>Districts (QTD) · click a row to filter</h3>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-white/50">
                <th className="pb-2 font-semibold">District</th>
                <th className="pb-2 font-semibold">Attainment</th>
                <th className="pb-2 font-semibold">Spend</th>
                <th className="pb-2 font-semibold">Pacing</th>
              </tr>
            </thead>
            <tbody className="text-white/85">
              {DISTRICTS.map((d) => (
                <tr
                  key={d.name}
                  onClick={() => setDistrict(district === d.name ? "all" : d.name)}
                  className={`cursor-pointer border-t border-white/10 ${
                    district === d.name ? "bg-ink-soft/20" : "hover:bg-white/5"
                  }`}
                >
                  <td className="py-2.5 font-semibold text-white">{d.name}</td>
                  <td className="py-2.5 tabular-nums">{d.attainment}%</td>
                  <td className="py-2.5 tabular-nums">${d.spend.toFixed(2)}M</td>
                  <td className={`py-2.5 font-semibold tabular-nums ${d.pacing < 80 ? "text-gold-light" : ""}`}>
                    {d.pacing}%{d.pacing < 80 ? " ⚑" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Agent insights */}
      <div className="grid gap-4 lg:grid-cols-2">
        {insights.map((insight) => {
          const isReviewed = reviewed.includes(insight.id);
          return (
            <div key={insight.id} className={`${panel} border border-gold/30`}>
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-2 text-sm font-bold text-gold-light">
                  <Sparkles size={15} aria-hidden /> Agent insight · {insight.title}
                </p>
                {isReviewed && (
                  <span className="rounded-full bg-emerald-300/15 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
                    ✓ Reviewed
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-white/85">{insight.finding}</p>
              {openInsight === insight.id ? (
                <div className={`${inset} mt-3 p-3`}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                    Recommended action
                  </p>
                  <p className="mt-1 text-sm text-white/85">{insight.action}</p>
                  {!isReviewed && (
                    <button
                      onClick={() => setReviewed((prev) => [...prev, insight.id])}
                      className="mt-3 rounded bg-gold px-3 py-1 text-xs font-bold text-ink-deep hover:bg-gold-hover"
                    >
                      Mark reviewed
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setOpenInsight(insight.id)}
                  className="mt-3 text-xs font-semibold text-gold-light hover:text-gold"
                >
                  Show recommended action →
                </button>
              )}
            </div>
          );
        })}
        {insights.length === 0 && (
          <div className={panel}>
            <p className="flex items-center gap-2 text-sm text-white/70">
              <Sparkles size={15} aria-hidden className="text-gold-light" />
              No anomalies flagged for {district} this cycle.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- VP of Sales ---------- */

function DistributionChart({
  selectedBin,
  onSelect,
}: {
  selectedBin: string | null;
  onSelect: (bin: string) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...DISTRIBUTION.map((d) => d.count));
  const total = DISTRIBUTION.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="relative">
      {hover !== null && (
        <div
          className={`${tooltipBox} top-0 max-w-[230px]`}
          style={{
            left: `${Math.min(Math.max(((hover + 0.5) / DISTRIBUTION.length) * 100, 20), 80)}%`,
            transform: "translate(-50%, -104%)",
          }}
        >
          <p className="text-[11px] font-semibold text-white/60">
            {DISTRIBUTION[hover].bin} attainment
          </p>
          <p className="mt-0.5 text-sm">
            <span className="font-bold text-white">{DISTRIBUTION[hover].count} payees</span>{" "}
            <span className="text-xs text-white/60">
              · {Math.round((DISTRIBUTION[hover].count / total) * 100)}% of the force
            </span>
          </p>
          {DISTRIBUTION[hover].flagged && (
            <p className="mt-0.5 text-[11px] font-semibold text-gold-light">
              Agent watch zone: outlier screening runs here
            </p>
          )}
        </div>
      )}
      <div
        className="flex items-end gap-3"
        role="group"
        aria-label="Rep attainment distribution: click a bucket to drill in"
      >
        {DISTRIBUTION.map((d, i) => (
          <button
            key={d.bin}
            onClick={() => onSelect(d.bin)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            aria-pressed={selectedBin === d.bin}
            aria-label={`${d.bin} attainment: ${d.count} payees${d.flagged ? ", agent watch zone" : ""}`}
            className={`flex flex-1 flex-col items-center gap-1 rounded-md pt-1 transition-colors ${
              selectedBin === d.bin ? "bg-white/10" : "hover:bg-white/5"
            }`}
          >
            <span className="text-xs font-semibold text-white/80">{d.count}</span>
            <div
              className={`w-full rounded-t ${d.flagged ? "bg-chart-gold" : "bg-chart-blue"} ${
                selectedBin !== null && selectedBin !== d.bin ? "opacity-40" : ""
              } ${hover === i ? "brightness-125" : ""}`}
              style={{ height: `${(d.count / max) * 110 + 6}px` }}
            />
            <span className="text-[10px] text-white/50">{d.bin}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function VpView({ kpis }: ViewProps) {
  const [selectedBin, setSelectedBin] = useState<string | null>(null);
  const [whyOpen, setWhyOpen] = useState<string[]>([]);
  const [agenda, setAgenda] = useState<string[]>([]);

  const bucket = selectedBin ? DISTRIBUTION.find((d) => d.bin === selectedBin) : null;
  const bucketReps = selectedBin ? BUCKET_REPS[selectedBin] : null;

  function toggleAgenda(rep: string) {
    setAgenda((prev) => (prev.includes(rep) ? prev.filter((r) => r !== rep) : [...prev, rep]));
  }

  return (
    <div className="space-y-4">
      <KpiRow kpis={kpis} />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className={panel}>
          <h3 className={panelTitle}>Rep attainment distribution (170 payees) · click a bucket</h3>
          <DistributionChart
            selectedBin={selectedBin}
            onSelect={(bin) => setSelectedBin(selectedBin === bin ? null : bin)}
          />
          <p className="mt-3 text-[11px] text-white/45">
            Gold bins are outlier zones the agent watches: under-pacing and payout spikes.
          </p>
          {bucket && bucketReps && (
            <div className={`${inset} mt-4 p-3`}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  {bucket.bin} attainment · {bucket.count} payees
                </p>
                <button
                  onClick={() => setSelectedBin(null)}
                  className="text-xs font-semibold text-white/50 hover:text-white"
                >
                  Clear ✕
                </button>
              </div>
              <div className="mt-2 space-y-2">
                {bucketReps.map((rep) => (
                  <div key={rep.name} className="flex items-baseline justify-between gap-2 border-t border-white/10 pt-2 text-sm">
                    <div>
                      <span className="font-semibold text-white">{rep.name}</span>
                      <span className="text-white/60"> · {rep.role}, {rep.district}</span>
                      {rep.note && <p className="text-[11px] text-gold-light">{rep.note}</p>}
                    </div>
                    <span className="shrink-0 font-semibold text-white/85">{rep.attainment}%</span>
                  </div>
                ))}
              </div>
              {bucket.count > bucketReps.length && (
                <p className="mt-2 text-[11px] text-white/45">
                  Showing {bucketReps.length} of {bucket.count}; full list one click away on an engagement.
                </p>
              )}
            </div>
          )}
        </div>
        <div className={panel}>
          <h3 className={panelTitle}>Flagged this month</h3>
          {agenda.length > 0 && (
            <div className={`${inset} mb-3 p-3`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-light">
                Your 1:1 agenda · {agenda.length}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {agenda.map((rep) => (
                  <span
                    key={rep}
                    className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold text-white/85"
                  >
                    {rep}
                    <button
                      onClick={() => toggleAgenda(rep)}
                      aria-label={`Remove ${rep} from agenda`}
                      className="text-white/40 hover:text-white"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-white/45">
                On an engagement this exports to your calendar with the agent&rsquo;s brief attached.
              </p>
            </div>
          )}
          <div className="space-y-3">
            {OUTLIERS.map((o) => (
              <div key={o.rep} className={`${inset} p-3`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-white">
                    {o.rep} · {o.district}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      o.flag === "Clean" ? "bg-ink-soft text-white" : "bg-gold text-ink-deep"
                    }`}
                  >
                    {o.attainment}% · {o.flag}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-white/70">{o.detail}</p>
                {whyOpen.includes(o.rep) && (
                  <div className="mt-2 rounded border-l-2 border-gold bg-chart-panel/60 p-2.5">
                    <p className="flex items-center gap-1.5 text-[11px] font-bold text-gold-light">
                      <Sparkles size={12} aria-hidden /> Agent explanation
                    </p>
                    <p className="mt-1 text-xs text-white/80">{o.agentWhy}</p>
                  </div>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  {!whyOpen.includes(o.rep) && (
                    <button
                      onClick={() => setWhyOpen((prev) => [...prev, o.rep])}
                      className="text-xs font-semibold text-gold-light hover:text-gold"
                    >
                      Ask the agent why →
                    </button>
                  )}
                  {o.flag !== "Clean" &&
                    (agenda.includes(o.rep) ? (
                      <p className="text-xs font-bold text-emerald-300">
                        ✓ On your 1:1 agenda
                        <button
                          onClick={() => toggleAgenda(o.rep)}
                          className="ml-2 font-semibold text-white/40 hover:text-white"
                        >
                          Remove
                        </button>
                      </p>
                    ) : (
                      <button
                        onClick={() => toggleAgenda(o.rep)}
                        className="rounded border border-white/25 px-2.5 py-0.5 text-xs font-bold text-white/80 hover:border-gold/60 hover:text-gold-light"
                      >
                        + Add to 1:1 agenda
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- CFO ---------- */

function CfoView({ kpis }: ViewProps) {
  const [att, setAtt] = useState<number>(CFO_BASELINE_ATT);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [auditFilter, setAuditFilter] = useState<"all" | "agent" | "human">("all");

  const scenario = cfoWhatIf(att);
  const isBaseline = att === CFO_BASELINE_ATT;

  const rows = ACCRUALS.map((row) =>
    row.month.startsWith("June")
      ? {
          ...row,
          calculated: scenario.juneCalculated,
          variance: scenario.juneVariance,
          status: scenario.juneStatus,
          drivers: scenario.drivers,
        }
      : row
  );
  const max = Math.max(2.6, ...rows.map((r) => Math.max(r.booked, r.calculated)));
  const drill = selectedMonth ? rows.find((r) => r.month === selectedMonth) : null;
  const drillTotal = drill ? drill.drivers.reduce((sum, d) => sum + d.amountK, 0) : 0;

  const activeKpis = kpis.map((k) =>
    k.label === "Q2 liability (proj.)"
      ? { ...k, value: scenario.liability, note: `at ${att}% attainment` }
      : k.label === "True-up exposure"
        ? {
            ...k,
            value: `$${scenario.trueUpK}K`,
            delta: scenario.breach ? "exceeds 1% tolerance: review" : "within 1% tolerance",
            tone: scenario.breach ? ("warn" as const) : undefined,
          }
        : k
  );

  const auditRows = AUDIT_TRAIL.filter((row) =>
    auditFilter === "all"
      ? true
      : auditFilter === "agent"
        ? row.actor.startsWith("Agent")
        : !row.actor.startsWith("Agent")
  );

  return (
    <div className="space-y-4">
      {/* What-if slider — June, liability, and true-up recompute live */}
      <div className={`${panel} border transition-colors ${isBaseline ? "border-white/10" : "border-gold/60"}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-sm font-semibold text-white/85">
            <Sparkles size={15} aria-hidden className="text-gold-light" />
            What-if: quarter-end attainment finishes at
            <span className="text-lg font-bold text-gold-light tabular-nums">{att}%</span>
          </p>
          {!isBaseline && (
            <button
              onClick={() => setAtt(CFO_BASELINE_ATT)}
              className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/60 hover:text-white"
            >
              ↺ Reset to current pace ({CFO_BASELINE_ATT}%)
            </button>
          )}
        </div>
        <input
          type="range"
          min={CFO_ATT_RANGE.min}
          max={CFO_ATT_RANGE.max}
          step={0.5}
          value={att}
          onChange={(e) => setAtt(parseFloat(e.target.value))}
          className="mt-3 w-full accent-gold"
          aria-label="Quarter-end attainment assumption, percent"
        />
        <div className="mt-1 flex justify-between text-[10px] text-white/40">
          <span>{CFO_ATT_RANGE.min}%</span>
          <span>current pace · {CFO_BASELINE_ATT}%</span>
          <span>{CFO_ATT_RANGE.max}%</span>
        </div>
        <p className="mt-2 text-xs text-white/70" aria-live="polite">
          June accrual recomputes to{" "}
          <span className="font-semibold text-white">${scenario.juneCalculated.toFixed(2)}M</span> · true-up{" "}
          <span className={`font-semibold ${scenario.breach ? "text-red-300" : "text-emerald-300"}`}>
            ${scenario.trueUpK}K ({scenario.breach ? "exceeds" : "within"} the 1% tolerance)
          </span>
          . April and May are actuals and don&rsquo;t move.
        </p>
      </div>

      <KpiRow kpis={activeKpis} />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className={panel}>
          <h3 className={panelTitle}>Booked vs. calculated accrual · click a month to drill in</h3>
          <div className="space-y-4" aria-label="Booked versus calculated accrual by month">
            {rows.map((row) => (
              <button
                key={row.month}
                onClick={() => setSelectedMonth(selectedMonth === row.month ? null : row.month)}
                aria-pressed={selectedMonth === row.month}
                className={`block w-full rounded-md p-1.5 text-left transition-colors ${
                  selectedMonth === row.month ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <div className="mb-1 flex justify-between gap-2 text-xs text-white/70">
                  <span>
                    {row.month}
                    {row.month.startsWith("June") && !isBaseline && (
                      <span className="ml-1.5 rounded-full bg-gold px-1.5 py-0.5 text-[10px] font-bold text-ink-deep">
                        what-if {att}%
                      </span>
                    )}
                  </span>
                  <span className="font-semibold text-gold-light">{row.variance}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 rounded bg-chart-blue transition-all duration-300"
                      style={{ width: `${(row.booked / max) * 80}%` }}
                    />
                    <span className="shrink-0 text-[10px] tabular-nums text-white/50">
                      ${row.booked.toFixed(2)}M
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 rounded bg-chart-gold transition-all duration-300"
                      style={{ width: `${(row.calculated / max) * 80}%` }}
                    />
                    <span className="shrink-0 text-[10px] tabular-nums text-white/50">
                      ${row.calculated.toFixed(2)}M
                    </span>
                  </div>
                </div>
              </button>
            ))}
            <div className="flex gap-5 text-[11px] text-white/60">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded bg-chart-blue" /> Booked accrual
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded bg-chart-gold" /> Agent-calculated liability
              </span>
            </div>
          </div>
          {drill && (
            <div className={`${inset} mt-4 p-3`}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  {drill.month} variance drivers · ${drillTotal}K total
                </p>
                <button
                  onClick={() => setSelectedMonth(null)}
                  className="text-xs font-semibold text-white/50 hover:text-white"
                >
                  Clear ✕
                </button>
              </div>
              <div className="mt-2 space-y-1.5">
                {drill.drivers.map((d) => (
                  <div key={d.label} className="flex items-baseline justify-between gap-2 border-t border-white/10 pt-1.5 text-sm">
                    <span className="text-white/85">{d.label}</span>
                    <span className="shrink-0 font-semibold tabular-nums text-gold-light">${d.amountK}K</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-white/45">
                Status: {drill.status} · every driver traceable to a calc run and deal record.
              </p>
            </div>
          )}
        </div>
        <div className={panel}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className={panelTitle}>Audit trail (latest)</h3>
            <div className="mb-4 flex gap-1.5" role="group" aria-label="Filter audit trail by actor">
              <button className={filterPill(auditFilter === "all")} onClick={() => setAuditFilter("all")}>
                All
              </button>
              <button className={filterPill(auditFilter === "agent")} onClick={() => setAuditFilter("agent")}>
                Agent
              </button>
              <button className={filterPill(auditFilter === "human")} onClick={() => setAuditFilter("human")}>
                Human
              </button>
            </div>
          </div>
          <div className="space-y-2.5">
            {auditRows.map((row) => (
              <div key={row.action} className="border-l-2 border-gold pl-3">
                <p className="text-xs text-white/50">{row.timestamp}</p>
                <p className="text-sm text-white/85">{row.action}</p>
                <p className="text-[11px] font-semibold text-gold-light">{row.actor}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- RevOps ---------- */

type QueueStatus = "open" | "approved" | "routed" | "dismissed";
type QueueFilter = "all" | "sla" | "done";

function AgeBadge({ hours }: { hours: number }) {
  const cls =
    hours < 8
      ? "bg-emerald-300/15 text-emerald-300"
      : hours <= 24
        ? "bg-gold/15 text-gold-light"
        : "bg-red-300/15 text-red-300";
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${cls}`}>
      {hours}h{hours > 24 ? " · SLA breach" : ""}
    </span>
  );
}

function RevOpsView({ kpis }: ViewProps) {
  const [items, setItems] = useState(
    EXCEPTION_QUEUE.map((item) => ({ ...item, status: "open" as QueueStatus }))
  );
  const [suggestionOpen, setSuggestionOpen] = useState<number[]>([]);
  const [filter, setFilter] = useState<QueueFilter>("all");

  const openCount = items.filter((i) => i.status === "open").length;
  const doneCount = items.length - openCount;
  const slaCount = items.filter((i) => i.status === "open" && i.ageHours > 24).length;
  const activeKpis = kpis.map((k) =>
    k.label === "Open exceptions"
      ? { ...k, value: String(openCount), note: openCount === 0 ? "queue clear" : "all with suggested fixes" }
      : k
  );

  const visible = items.filter((i) =>
    filter === "all"
      ? true
      : filter === "sla"
        ? i.status === "open" && i.ageHours > 24
        : i.status !== "open"
  );

  function triage(id: number, status: QueueStatus) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  }

  return (
    <div className="space-y-4">
      <KpiRow kpis={activeKpis} />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className={panel}>
          <h3 className={panelTitle}>Leadership questions answered by the agent</h3>
          <div className="space-y-2.5">
            {REQUEST_LOG.map((row) => (
              <div key={row.question} className={`${inset} p-3`}>
                <p className="text-sm text-white/85">&ldquo;{row.question}&rdquo;</p>
                <p className="mt-1 text-[11px] text-white/45">
                  {row.asked} · <span className="font-semibold text-gold-light">{row.time}</span>
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-white/45">
            Median resolution time on exceptions is 3.1 hours; it was 2.4 days before agents.
            Statement disputes for the May run: 9, down from 31 in February.
          </p>
        </div>
        <div className={panel}>
          <h3 className={panelTitle}>Exception queue · SLA: review within 24h</h3>
          <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Filter the exception queue">
            <button className={filterPill(filter === "all")} onClick={() => setFilter("all")}>
              All ({items.length})
            </button>
            <button className={filterPill(filter === "sla")} onClick={() => setFilter("sla")}>
              SLA risk ({slaCount})
            </button>
            <button className={filterPill(filter === "done")} onClick={() => setFilter("done")}>
              Triaged ({doneCount})
            </button>
          </div>
          <div className="mb-3">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gold transition-all duration-300"
                style={{ width: `${(doneCount / items.length) * 100}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] text-white/45">
              {doneCount} of {items.length} triaged
              {openCount === 0 ? ". Queue clear: the repetitive 80% runs itself while your team designs plans." : ""}
            </p>
          </div>
          <div className="space-y-3">
            {visible.map((item) => (
              <div key={item.id} className={`${inset} p-3 ${item.status !== "open" ? "opacity-80" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <AgeBadge hours={item.ageHours} />
                </div>
                <p className="mt-0.5 text-[11px] text-white/45">Source: {item.source}</p>
                {suggestionOpen.includes(item.id) ? (
                  <p className="mt-2 text-xs text-white/80">
                    <span className="font-semibold text-gold-light">Agent suggests:</span>{" "}
                    {item.suggestion}
                  </p>
                ) : (
                  <button
                    onClick={() => setSuggestionOpen((prev) => [...prev, item.id])}
                    className="mt-2 text-xs font-semibold text-gold-light hover:text-gold"
                  >
                    View agent suggestion →
                  </button>
                )}
                {item.status === "open" ? (
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    <button
                      onClick={() => triage(item.id, "approved")}
                      className="rounded bg-gold px-3 py-1 text-xs font-bold text-ink-deep hover:bg-gold-hover"
                    >
                      Approve fix
                    </button>
                    <button
                      onClick={() => triage(item.id, "routed")}
                      className="rounded border border-white/25 px-3 py-1 text-xs font-bold text-white/80 hover:border-white/60 hover:text-white"
                    >
                      Route to comp admin
                    </button>
                    <button
                      onClick={() => triage(item.id, "dismissed")}
                      className="rounded px-3 py-1 text-xs font-bold text-white/50 hover:text-white"
                    >
                      Dismiss
                    </button>
                  </div>
                ) : (
                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                    {item.status === "approved" ? (
                      <p className="text-xs font-bold text-emerald-300">
                        ✓ Fix applied, logged to audit trail
                      </p>
                    ) : item.status === "routed" ? (
                      <p className="text-xs font-bold text-gold-light">
                        → Routed to comp admin with full context attached
                      </p>
                    ) : (
                      <p className="text-xs font-bold text-white/60">
                        Dismissed: decision logged, no plan action needed
                      </p>
                    )}
                    <button
                      onClick={() => triage(item.id, "open")}
                      className="text-xs font-semibold text-white/40 hover:text-white"
                    >
                      Undo
                    </button>
                  </div>
                )}
              </div>
            ))}
            {visible.length === 0 && (
              <p className="text-sm text-white/70">
                {filter === "sla"
                  ? "Nothing open is breaching SLA; the two overdue items have been triaged."
                  : filter === "done"
                    ? "Nothing triaged yet. Approve, route, or dismiss an exception to see it here."
                    : "Queue clear: the repetitive 80% runs itself; your team designs plans."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Shared Q&A + shell ---------- */

type AskedQA = { qa: QA; shown: string; done: boolean };

function AskTheData({ qa }: { qa: QA[] }) {
  const [asked, setAsked] = useState<AskedQA[]>([]);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  /* Stream the active answer a couple of words per tick. */
  useEffect(() => {
    const idx = asked.findIndex((a) => !a.done);
    if (idx < 0) return;
    const words = asked[idx].qa.answer.split(" ");
    const shownCount = asked[idx].shown === "" ? 0 : asked[idx].shown.split(" ").length;
    const timer = setTimeout(() => {
      setAsked((prev) =>
        prev.map((a, i) =>
          i === idx
            ? {
                ...a,
                shown: words.slice(0, shownCount + 2).join(" "),
                done: shownCount + 2 >= words.length,
              }
            : a
        )
      );
    }, 40);
    return () => clearTimeout(timer);
  }, [asked]);

  function ask(item: QA) {
    setAsked((prev) => [
      ...prev,
      { qa: item, shown: reducedMotion.current ? item.answer : "", done: reducedMotion.current },
    ]);
  }

  const remaining = qa.filter((item) => !asked.some((a) => a.qa.question === item.question));
  const streaming = asked.some((a) => !a.done);

  return (
    <div className={panel}>
      <div className="flex items-center justify-between gap-2">
        <h3 className={panelTitle}>Ask your comp data</h3>
        {asked.length > 0 && !streaming && (
          <button
            onClick={() => setAsked([])}
            className="mb-4 text-xs font-semibold text-white/50 hover:text-white"
          >
            ↺ Start over
          </button>
        )}
      </div>
      <div className="space-y-3" aria-live="polite">
        {asked.length === 0 && (
          <p className="text-sm text-white/60">
            Executives ask in plain English; the agent answers from live comp data, with sources.
            Tap a question to see it.
          </p>
        )}
        {asked.map((a) => (
          <div key={a.qa.question} className="space-y-2">
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-ink-deep">
                {a.qa.question}
              </div>
            </div>
            <div className="flex justify-start">
              <div className={`${inset} max-w-[85%] px-4 py-2.5`}>
                <p className="text-sm text-white/90">
                  {a.shown}
                  {!a.done && (
                    <span aria-hidden className="ml-0.5 inline-block animate-pulse text-gold-light">
                      ▍
                    </span>
                  )}
                </p>
                {a.done && <p className="mt-2 text-[11px] text-white/45">Sources: {a.qa.sources}</p>}
              </div>
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
              disabled={streaming}
              className={`rounded-full border border-gold px-3 py-1.5 text-xs font-semibold text-gold-light ${
                streaming ? "opacity-40" : "hover:bg-gold hover:text-ink-deep"
              }`}
            >
              {item.question}
            </button>
          ))}
        </div>
      )}
      {remaining.length === 0 && !streaming && (
        <p className="mt-4 text-[11px] text-white/45">
          That&rsquo;s the scripted set. On an engagement this is a live agent over your comp
          data, and any question is fair game.
        </p>
      )}
    </div>
  );
}

const VIEWS: Record<PersonaId, (props: ViewProps) => React.ReactNode> = {
  cro: CroView,
  "vp-sales": VpView,
  cfo: CfoView,
  revops: RevOpsView,
};

export default function DemoDashboard() {
  const searchParams = useSearchParams();
  const paramPersona = searchParams.get("persona");
  const [active, setActive] = useState<PersonaId>(
    isPersonaId(paramPersona) ? paramPersona : "cro"
  );
  const persona = PERSONAS.find((p) => p.id === active)!;
  const View = VIEWS[active];

  return (
    <div className="overflow-hidden rounded-xl bg-chart-surface shadow-2xl">
      {/* Dashboard chrome */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-5 py-4">
        <div>
          <p className="font-bold text-white">{DEMO_COMPANY}</p>
          <p className="text-xs text-white/50">{DEMO_AS_OF}</p>
        </div>
        <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink-deep">
          Live demo · fictitious data
        </span>
      </div>

      {/* Persona tabs */}
      <div className="flex flex-wrap gap-1 border-b border-white/10 px-5 pt-3" role="tablist" aria-label="Choose a persona">
        {PERSONAS.map((p) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={active === p.id}
            onClick={() => setActive(p.id)}
            className={`rounded-t-md px-4 py-2 text-sm font-semibold ${
              active === p.id
                ? "bg-chart-panel text-gold-light"
                : "text-white/60 hover:text-white"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="space-y-4 p-5">
        <p className="text-sm text-white/70">{persona.tagline}</p>

        {/* Persona-specific panels (each renders its own KPI row) */}
        <View kpis={persona.kpis} />

        {/* Natural-language Q&A — keyed so a persona switch starts a fresh thread */}
        <AskTheData key={active} qa={persona.qa} />
      </div>
    </div>
  );
}

import { useMemo } from "react";
import { Gauge, Play, RotateCcw, AlertTriangle } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";
import { BIZ_ASSUMPTIONS, DEFAULT_DECISIONS, PRESETS, initialState, runQuarter, type BizDecisions, type BizState, type BusinessType, type QuarterResult } from "../lib/sim/business";
import { Button, Card, Disclaimer, PageHeader, Select, Slider, Stat, Tag } from "../components/ui";
import { Assumptions } from "../components/visuals/Simulators";
import { useChartTheme } from "../components/visuals/chartKit";
import { usePersistentState } from "../state/storage";
import { formatCurrency } from "../lib/finance";
import { TOPIC_THEME, cx } from "../lib/theme";
import type { TopicId } from "../content/types";

interface SimSave {
  type: BusinessType;
  state: BizState;
  history: QuarterResult[];
  decisions: BizDecisions;
}

const MAX_Q = 8;

function freshSave(type: BusinessType): SimSave {
  return { type, state: initialState(PRESETS[type]), history: [], decisions: DEFAULT_DECISIONS };
}

const FN_KEY: Record<string, TopicId> = { Operations: "operations", Marketing: "marketing", Finance: "finance", "Human resources": "hr" };

export default function SimulationCentre() {
  const [save, setSave] = usePersistentState<SimSave>("sim:business", freshSave("manufacturing"));
  const ch = useChartTheme();
  const preset = PRESETS[save.type];
  const d = save.decisions;
  const set = <K extends keyof BizDecisions>(k: K) => (v: BizDecisions[K]) => setSave((s) => ({ ...s, decisions: { ...s.decisions, [k]: v } }));
  const last = save.history[save.history.length - 1];
  const prevQ = save.history[save.history.length - 2];

  const run = () => {
    if (save.history.length >= MAX_Q) return;
    const { result, next } = runQuarter(preset, save.state, save.decisions);
    setSave((s) => ({ ...s, state: next, history: [...s.history, result], decisions: { ...s.decisions, borrowing: 0, investment: "none" } }));
  };

  const chartData = useMemo(() => save.history.map((h) => ({ q: `Q${h.quarter}`, Revenue: h.revenue, Expenses: h.expenses, Profit: h.profit, Cash: h.cashBalance, "Customer satisfaction": h.customerSat, "Employee satisfaction": h.employeeSat, "Production performance": h.production })), [save.history]);
  const delta = (k: keyof QuarterResult) => (last && prevQ ? (last[k] as number) - (prevQ[k] as number) : null);
  const fmtDelta = (x: number | null, money = true) => (x === null ? undefined : `${x >= 0 ? "▲" : "▼"} ${money ? formatCurrency(Math.abs(x)) : Math.abs(x)} vs previous quarter`);

  return (
    <div className="space-y-6">
      <PageHeader icon={<Gauge className="h-6 w-6" />} title="Business Simulation Centre" subtitle="Run a fictional business for up to eight quarters. Make operations, marketing, finance and HR decisions and see how they affect each other — interdependence in action." />
      <Disclaimer>All businesses and results are fictional and produced by a transparent, deterministic teaching model. They are not predictions of real business outcomes.</Disclaimer>

      <Card className="p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-md flex-1">
            <Select
              label="Business type (changing it restarts the simulation)"
              value={save.type}
              onChange={(t) => setSave(freshSave(t))}
              options={(Object.keys(PRESETS) as BusinessType[]).map((k) => ({ value: k, label: PRESETS[k].name }))}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={run} disabled={save.history.length >= MAX_Q}>
              <Play className="h-4 w-4" /> Run quarter {save.history.length + 1}
            </Button>
            <Button variant="secondary" onClick={() => setSave(freshSave(save.type))}>
              <RotateCcw className="h-4 w-4" /> Restart
            </Button>
          </div>
        </div>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">{preset.description}</p>
        <p className="mt-1 text-xs text-stone-500">
          Quarter {save.history.length}/{MAX_Q} · Starting cash {formatCurrency(preset.startingCash)} · Base price {formatCurrency(preset.basePrice)} per {preset.unitLabel.replace(/s$/, "")} · {preset.staff} staff at adequate staffing
        </p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className={cx("p-5", TOPIC_THEME.operations.border)}>
          <p className={cx("font-semibold", TOPIC_THEME.operations.text)}>Operations</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Select label="Inventory" value={d.inventory} onChange={set("inventory")} options={[{ value: "jit", label: "Just-in-time (JIT)" }, { value: "balanced", label: "Balanced buffer stock" }, { value: "high", label: "High safety stock" }]} />
            <Select label="Suppliers" value={d.suppliers} onChange={set("suppliers")} options={[{ value: "local", label: "Local suppliers" }, { value: "global", label: "Low-cost global suppliers" }, { value: "partnership", label: "Long-term partnerships" }]} />
            <Select label="Production method" value={d.production} onChange={set("production")} options={[{ value: "labour", label: "Labour-intensive" }, { value: "automated", label: "Automated (technology)" }]} />
            <Select label="Quality" value={d.quality} onChange={set("quality")} options={[{ value: "control", label: "Quality control (inspection)" }, { value: "assurance", label: "Quality assurance" }, { value: "improvement", label: "Quality improvement (TQM)" }]} />
          </div>
          {!preset.inventoryRelevant && <p className="mt-2 text-xs text-stone-500">This service business holds little inventory, so inventory choices have minimal effect.</p>}
        </Card>
        <Card className={cx("p-5", TOPIC_THEME.marketing.border)}>
          <p className={cx("font-semibold", TOPIC_THEME.marketing.text)}>Marketing</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Slider label="Price vs base price" value={d.priceChange} min={-20} max={20} step={5} onChange={set("priceChange")} format={(v) => `${v > 0 ? "+" : ""}${v}% (${formatCurrency(preset.basePrice * (1 + v / 100))})`} />
            </div>
            <Select label="Promotion" value={String(d.promotion) as "0" | "1" | "2" | "3"} onChange={(v) => set("promotion")(Number(v) as 0 | 1 | 2 | 3)} options={[{ value: "0", label: "None" }, { value: "1", label: "Low" }, { value: "2", label: "Medium" }, { value: "3", label: "High" }]} />
            <Select label="Target market" value={d.target} onChange={set("target")} options={[{ value: "mass", label: "Mass market" }, { value: "niche", label: "Niche market" }]} />
            <Select label="Distribution" value={d.distribution} onChange={set("distribution")} options={[{ value: "intensive", label: "Intensive" }, { value: "selective", label: "Selective" }, { value: "online", label: "Online direct" }]} />
          </div>
        </Card>
        <Card className={cx("p-5", TOPIC_THEME.finance.border)}>
          <p className={cx("font-semibold", TOPIC_THEME.finance.text)}>Finance</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Select label="Borrowing this quarter (one-off)" value={String(d.borrowing) as "0" | "50000" | "150000"} onChange={(v) => set("borrowing")(Number(v) as 0 | 50_000 | 150_000)} options={[{ value: "0", label: "No new borrowing" }, { value: "50000", label: "Borrow $50,000" }, { value: "150000", label: "Borrow $150,000" }]} />
            <Select label="Investment this quarter (one-off)" value={d.investment} onChange={set("investment")} options={[{ value: "none", label: "None" }, { value: "equipment", label: "Equipment (capacity +6%)" }, { value: "systems", label: "Systems (variable costs −3%)" }]} />
            <Select label="Cash management" value={d.cash} onChange={set("cash")} options={[{ value: "standard", label: "Standard 30-day terms" }, { value: "discounts", label: "Take supplier early-payment discounts" }, { value: "factoring", label: "Factor receivables" }, { value: "tight-credit", label: "Tighter credit control" }]} />
            <Select label="Expense management" value={d.expenses} onChange={set("expenses")} options={[{ value: "none", label: "No cuts" }, { value: "moderate", label: "Moderate expense minimisation" }, { value: "aggressive", label: "Aggressive cost-cutting" }]} />
          </div>
        </Card>
        <Card className={cx("p-5", TOPIC_THEME.hr.border)}>
          <p className={cx("font-semibold", TOPIC_THEME.hr.text)}>Human resources</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Select label="Staffing" value={d.staffing} onChange={set("staffing")} options={[{ value: "lean", label: "Lean (−15%)" }, { value: "adequate", label: "Adequate" }, { value: "generous", label: "Generous (+15%)" }]} />
            <Select label="Training" value={d.training} onChange={set("training")} options={[{ value: "none", label: "None" }, { value: "basic", label: "Basic" }, { value: "extensive", label: "Extensive" }]} />
            <Select label="Rewards" value={d.rewards} onChange={set("rewards")} options={[{ value: "minimum", label: "Award minimum" }, { value: "above-award", label: "Above award" }, { value: "performance", label: "Performance pay" }]} />
            <Select label="Leadership" value={d.leadership} onChange={set("leadership")} options={[{ value: "autocratic", label: "Autocratic" }, { value: "democratic", label: "Democratic" }, { value: "situational", label: "Situational" }]} />
          </div>
        </Card>
      </div>

      {!last ? (
        <Card className="p-8 text-center">
          <p className="font-semibold">Set your decisions, then run the first quarter.</p>
          <p className="text-sm text-stone-500">Results, charts, explanations and risks will appear here.</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label={`Revenue (Q${last.quarter})`} value={formatCurrency(last.revenue)} sub={fmtDelta(delta("revenue"))} />
            <Stat label="Expenses" value={formatCurrency(last.expenses)} sub={fmtDelta(delta("expenses"))} />
            <Stat label="Profit" value={formatCurrency(last.profit)} tone={last.profit >= 0 ? "good" : "bad"} sub={fmtDelta(delta("profit"))} />
            <Stat label="Cash balance" value={formatCurrency(last.cashBalance)} tone={last.cashBalance >= 0 ? "neutral" : "bad"} sub={`Loan balance ${formatCurrency(last.loanBalance)}`} />
            <Stat label="Customer satisfaction" value={`${last.customerSat}/100`} sub={fmtDelta(delta("customerSat"), false)} />
            <Stat label="Production performance" value={`${last.production}/100`} sub={`Sold ${last.unitsSold.toLocaleString("en-AU")} of ${last.capacity.toLocaleString("en-AU")} capacity · quality ${last.qualityIndex}`} />
            <Stat label="Employee satisfaction" value={`${last.employeeSat}/100`} sub={fmtDelta(delta("employeeSat"), false)} />
            <Stat label="Business risks" value={last.risks.length} tone={last.risks.length > 2 ? "bad" : "neutral"} sub="identified this quarter" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-5">
              <p className="text-sm font-semibold">Revenue, expenses and profit</p>
              <div className="mt-2 h-60">
                <ResponsiveContainer>
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10 }}>
                    <CartesianGrid {...ch.gridProps} />
                    <XAxis dataKey="q" {...ch.axisProps} />
                    <YAxis {...ch.axisProps} tickFormatter={(x) => `$${Math.round(x / 1000)}k`} />
                    <ReferenceLine y={0} stroke={ch.axis} />
                    <Tooltip {...ch.tooltipProps} formatter={(x: number) => formatCurrency(x)} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line dataKey="Revenue" stroke={ch.series[2]} strokeWidth={2} dot={{ r: 4 }} />
                    <Line dataKey="Expenses" stroke={ch.series[0]} strokeWidth={2} dot={{ r: 4 }} />
                    <Line dataKey="Profit" stroke={ch.series[1]} strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="p-5">
              <p className="text-sm font-semibold">Cash balance</p>
              <div className="mt-2 h-60">
                <ResponsiveContainer>
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10 }}>
                    <CartesianGrid {...ch.gridProps} />
                    <XAxis dataKey="q" {...ch.axisProps} />
                    <YAxis {...ch.axisProps} tickFormatter={(x) => `$${Math.round(x / 1000)}k`} />
                    <ReferenceLine y={0} stroke="#dc2626" strokeDasharray="4 4" />
                    <Tooltip {...ch.tooltipProps} formatter={(x: number) => formatCurrency(x)} />
                    <Line dataKey="Cash" name="Cash balance" stroke={ch.series[2]} strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="p-5 lg:col-span-2">
              <p className="text-sm font-semibold">Customer satisfaction, employee satisfaction and production performance (0–100)</p>
              <div className="mt-2 h-56">
                <ResponsiveContainer>
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10 }}>
                    <CartesianGrid {...ch.gridProps} />
                    <XAxis dataKey="q" {...ch.axisProps} />
                    <YAxis {...ch.axisProps} domain={[0, 100]} />
                    <Tooltip {...ch.tooltipProps} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line dataKey="Customer satisfaction" stroke={ch.series[3]} strokeWidth={2} dot={{ r: 4 }} />
                    <Line dataKey="Employee satisfaction" stroke={ch.series[1]} strokeWidth={2} dot={{ r: 4 }} />
                    <Line dataKey="Production performance" stroke={ch.series[0]} strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <Card className="p-5">
              <p className="text-sm font-semibold">Why these results? (Quarter {last.quarter})</p>
              <div className="mt-3 space-y-3">
                {last.explanations.map((e) => (
                  <div key={e.fn} className={cx("rounded-xl border p-3 text-sm", TOPIC_THEME[FN_KEY[e.fn]].border, TOPIC_THEME[FN_KEY[e.fn]].bgSoft)}>
                    <p className={cx("font-semibold", TOPIC_THEME[FN_KEY[e.fn]].textStrong)}>{e.fn}</p>
                    <p className="text-stone-700 dark:text-stone-300">{e.text}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <p className="flex items-center gap-1.5 text-sm font-semibold">
                <AlertTriangle className="h-4 w-4 text-amber-600" /> Business risks
              </p>
              {last.risks.length === 0 ? <p className="mt-2 text-sm text-stone-500">No major risks identified this quarter.</p> : (
                <ul className="mt-2 space-y-1.5 text-sm">
                  {last.risks.map((r) => (
                    <li key={r} className="rounded-lg bg-amber-50 px-2 py-1.5 dark:bg-amber-950/30">{r}</li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-sm font-semibold">Expense breakdown</p>
              <table className="mt-1 w-full text-xs tabular-nums">
                <tbody>
                  {[
                    ["Variable costs", last.variableCosts],
                    ["Wages", last.wages],
                    ["Promotion", last.promotionCost],
                    ["Training", last.trainingCost],
                    ["Fixed costs", last.fixedCosts],
                    ["Interest", last.interest],
                    ["Other (inventory, distribution, fees)", last.otherCosts],
                  ].map(([k, v]) => (
                    <tr key={k as string}><td>{k}</td><td className="text-right">{formatCurrency(v as number)}</td></tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          <Card className="p-5">
            <p className="text-sm font-semibold">Quarter history</p>
            <div className="scroll-thin mt-2 overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm tabular-nums">
                <thead>
                  <tr className="text-left text-xs text-stone-500">
                    {["Quarter", "Price", "Units sold", "Revenue", "Expenses", "Profit", "Cash flow", "Cash", "Cust. sat.", "Emp. sat."].map((h) => <th key={h} className="py-1 pr-3 font-semibold">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {save.history.map((h) => (
                    <tr key={h.quarter} className="border-t border-stone-100 dark:border-stone-800">
                      <td className="py-1.5 pr-3">Q{h.quarter}</td>
                      <td className="pr-3">{formatCurrency(h.price, 2)}</td>
                      <td className="pr-3">{h.unitsSold.toLocaleString("en-AU")}</td>
                      <td className="pr-3">{formatCurrency(h.revenue)}</td>
                      <td className="pr-3">{formatCurrency(h.expenses)}</td>
                      <td className={cx("pr-3", h.profit < 0 && "text-red-600")}>{formatCurrency(h.profit)}</td>
                      <td className={cx("pr-3", h.cashFlow < 0 && "text-red-600")}>{formatCurrency(h.cashFlow)}</td>
                      <td className={cx("pr-3", h.cashBalance < 0 && "text-red-600")}>{formatCurrency(h.cashBalance)}</td>
                      <td className="pr-3">{h.customerSat}</td>
                      <td className="pr-3">{h.employeeSat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {save.history.length >= MAX_Q && <p className="mt-2 text-sm"><Tag tone="good">Simulation complete</Tag> Reflect: which decisions improved profit but hurt cash, or helped one function at another's expense?</p>}
          </Card>
        </>
      )}

      <Card className="p-5">
        <p className="mb-2 text-sm font-semibold">Try these experiments</p>
        <ul className="mt-2 grid gap-1.5 text-sm sm:grid-cols-2">
          <li>• Switch to JIT with low-cost global suppliers — what happens to sales and risk?</li>
          <li>• Factor receivables — compare profit with cash flow.</li>
          <li>• Cut expenses aggressively for two quarters — watch quality and employee satisfaction.</li>
          <li>• Borrow and invest in equipment — does extra capacity pay for the interest?</li>
          <li>• Raise price 15% for a niche market with quality improvement.</li>
          <li>• Lean staffing with autocratic leadership and minimum rewards — check the risks.</li>
        </ul>
      </Card>
      <Assumptions items={BIZ_ASSUMPTIONS} />
    </div>
  );
}

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Check, RotateCcw, Plus, Trash2, TrendingDown, TrendingUp, Minus, AlertTriangle } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button, Callout, Checkbox, NumberField, Slider, Tag } from "../ui";
import { FlowDiagram } from "../content/FlowDiagram";
import { useChartTheme } from "./chartKit";
import { cx } from "../../lib/theme";
import { usePersistentState } from "../../state/storage";
import {
  buildStatements,
  formatCurrency,
  formatRatio,
  interpretRatio,
  round,
  summariseCashFlow,
  type CashFlowLine,
  type RatioId,
  type StatementInputs,
  collectionPeriod,
} from "../../lib/finance";
import type { FlowSpec } from "../../content/types";

// ---------------------------------------------------------------------------
// Financial objectives
// ---------------------------------------------------------------------------

const OBJ = [
  { id: "profitability", name: "Profitability", meaning: "Maximising profit.", measure: "Gross profit ratio, net profit ratio, return on equity", conflicts: ["liquidity", "growth"], note: "Holding cash for liquidity earns little; investing for growth can reduce short-term profit." },
  { id: "growth", name: "Growth", meaning: "Increasing the size of the business over the long term.", measure: "Increases in sales, assets, market share, profit (percentage change)", conflicts: ["liquidity", "solvency", "profitability"], note: "Expansion uses cash and is often funded by debt, reducing liquidity and raising gearing." },
  { id: "efficiency", name: "Efficiency", meaning: "Minimising costs and managing assets to achieve maximum profit with the lowest level of assets.", measure: "Expense ratio, accounts receivable turnover ratio", conflicts: ["growth"], note: "Aggressive cost-cutting can undermine long-term growth (e.g. cutting R&D or training)." },
  { id: "liquidity", name: "Liquidity", meaning: "Meeting short-term financial commitments as they fall due.", measure: "Current ratio", conflicts: ["profitability", "growth"], note: "Idle cash improves liquidity but reduces returns." },
  { id: "solvency", name: "Solvency", meaning: "Meeting financial commitments in the long term.", measure: "Debt to equity (gearing) ratio", conflicts: ["growth"], note: "Borrowing to grow raises gearing and long-term risk." },
];
const OBJ_POS: Record<string, { x: number; y: number }> = {
  profitability: { x: 250, y: 40 },
  growth: { x: 440, y: 160 },
  efficiency: { x: 370, y: 320 },
  liquidity: { x: 130, y: 320 },
  solvency: { x: 60, y: 160 },
};

export function FinObjectives() {
  const [sel, setSel] = useState("liquidity");
  const o = OBJ.find((x) => x.id === sel)!;
  const ch = useChartTheme();
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      <svg viewBox="0 0 500 370" className="w-full" role="group" aria-label="Five financial objectives and their conflicts">
        {o.conflicts.map((c) => (
          <line key={c} x1={OBJ_POS[sel].x} y1={OBJ_POS[sel].y} x2={OBJ_POS[c].x} y2={OBJ_POS[c].y} stroke="#dc2626" strokeWidth={2.5} strokeDasharray="7 5" />
        ))}
        {OBJ.map((x) => {
          const p = OBJ_POS[x.id];
          const active = x.id === sel;
          return (
            <g key={x.id} onClick={() => setSel(x.id)} style={{ cursor: "pointer" }}>
              <circle cx={p.x} cy={p.y} r={active ? 50 : 44} fill={active ? "#059669" : ch.isDark ? "#10261d" : "#ecfdf5"} stroke="#059669" strokeWidth={2} />
              <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill={active ? "#fff" : ch.isDark ? "#a7f3d0" : "#065f46"}>
                {x.name}
              </text>
            </g>
          );
        })}
      </svg>
      <div>
        <div className="flex flex-wrap gap-1.5">
          {OBJ.map((x) => (
            <button key={x.id} type="button" onClick={() => setSel(x.id)} aria-pressed={sel === x.id} className={cx("rounded-lg border px-2.5 py-1 text-xs font-medium", sel === x.id ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40" : "border-stone-200 dark:border-stone-700")}>
              {x.name}
            </button>
          ))}
        </div>
        <motion.div key={sel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-2 rounded-2xl border border-stone-200 p-4 text-sm dark:border-stone-800">
          <p className="font-display text-lg font-semibold">{o.name}</p>
          <p>{o.meaning}</p>
          <p>
            <span className="font-semibold">Measured by: </span>
            {o.measure}
          </p>
          <p>
            <span className="font-semibold text-red-700 dark:text-red-400">Conflicts with: </span>
            {o.conflicts.map((c) => OBJ.find((x) => x.id === c)!.name).join(", ")}
          </p>
          <p className="text-stone-600 dark:text-stone-400">{o.note}</p>
        </motion.div>
        <p className="mt-2 text-xs text-stone-500">Red dashed lines show common conflicts. Short-term objectives (≤ 12 months) support long-term objectives.</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal vs external sources tree
// ---------------------------------------------------------------------------

interface SourceInfo {
  name: string;
  path: string[];
  term: "Short-term" | "Long-term" | "N/A";
  type: "Internal" | "Debt" | "Equity";
  cost: string;
  control: string;
  use: string;
}

const SOURCES: SourceInfo[] = [
  { name: "Retained profits", path: ["Internal"], term: "N/A", type: "Internal", cost: "No interest; owners forgo dividends", control: "No change", use: "Expansion, new equipment, buffers" },
  { name: "Overdraft", path: ["External", "Debt", "Short-term"], term: "Short-term", type: "Debt", cost: "Relatively high interest on amount overdrawn", control: "No change", use: "Temporary cash shortfalls" },
  { name: "Commercial bills", path: ["External", "Debt", "Short-term"], term: "Short-term", type: "Debt", cost: "Interest; often secured", control: "No change", use: "Larger short-term needs (30–180 days)" },
  { name: "Factoring", path: ["External", "Debt", "Short-term"], term: "Short-term", type: "Debt", cost: "Discount/fee on receivables sold", control: "No change", use: "Improve cash flow from receivables" },
  { name: "Mortgage", path: ["External", "Debt", "Long-term"], term: "Long-term", type: "Debt", cost: "Interest; secured by property", control: "No change (property is security)", use: "Buying land and buildings" },
  { name: "Debentures", path: ["External", "Debt", "Long-term"], term: "Long-term", type: "Debt", cost: "Fixed interest; secured", control: "No change", use: "Large-scale funding from investors" },
  { name: "Unsecured notes", path: ["External", "Debt", "Long-term"], term: "Long-term", type: "Debt", cost: "Higher interest (no security)", control: "No change", use: "Funding where assets are already pledged" },
  { name: "Leasing", path: ["External", "Debt", "Long-term"], term: "Long-term", type: "Debt", cost: "Lease payments; total may exceed purchase price", control: "No change; asset not owned", use: "Vehicles, equipment, technology" },
  { name: "New issue (e.g. IPO)", path: ["External", "Equity", "Ordinary shares"], term: "Long-term", type: "Equity", cost: "Issue costs; dividends expected", control: "Diluted — new owners", use: "Large-scale growth; listing on the ASX" },
  { name: "Rights issue", path: ["External", "Equity", "Ordinary shares"], term: "Long-term", type: "Equity", cost: "Usually issued at a discount", control: "Maintained if existing holders take up rights", use: "Raising capital from existing shareholders" },
  { name: "Placement", path: ["External", "Equity", "Ordinary shares"], term: "Long-term", type: "Equity", cost: "Discount to institutions; low issue cost", control: "Diluted for those not offered shares", use: "Fast capital raising" },
  { name: "Share purchase plan", path: ["External", "Equity", "Ordinary shares"], term: "Long-term", type: "Equity", cost: "Usually at a discount; no brokerage", control: "Lets retail holders limit dilution", use: "Often alongside a placement" },
  { name: "Private equity", path: ["External", "Equity"], term: "Long-term", type: "Equity", cost: "Investors expect high returns", control: "Significant control given to investors", use: "Expansion or restructuring of unlisted firms" },
];

export function InternalExternal() {
  const [sel, setSel] = useState("Overdraft");
  const s = SOURCES.find((x) => x.name === sel)!;
  const group = (pred: (x: SourceInfo) => boolean) => SOURCES.filter(pred);
  const Chip = ({ x }: { x: SourceInfo }) => (
    <button type="button" onClick={() => setSel(x.name)} aria-pressed={sel === x.name} className={cx("rounded-lg border px-2 py-1 text-left text-xs font-medium transition-colors", sel === x.name ? "border-emerald-600 bg-emerald-600 text-white" : "border-stone-200 bg-white hover:border-emerald-400 dark:border-stone-700 dark:bg-night-3")}>
      {x.name}
    </button>
  );
  return (
    <div>
      <div className="grid gap-3 md:grid-cols-[180px_1fr]">
        <div className="rounded-2xl border-2 border-emerald-500 p-3 text-center font-semibold">Sources of finance</div>
        <div className="grid gap-3 md:grid-cols-[1fr_3fr]">
          <div className="rounded-2xl border border-stone-200 p-3 dark:border-stone-800">
            <p className="text-xs font-semibold tracking-wider text-stone-500 uppercase">Internal</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {group((x) => x.type === "Internal").map((x) => (
                <Chip key={x.name} x={x} />
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-stone-200 p-3 dark:border-stone-800">
            <p className="text-xs font-semibold tracking-wider text-stone-500 uppercase">External</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-stone-50 p-2 dark:bg-night-3">
                <p className="text-sm font-semibold">Debt</p>
                <p className="mt-1 text-[11px] text-stone-500">Short-term</p>
                <div className="mt-1 flex flex-wrap gap-1">{group((x) => x.type === "Debt" && x.term === "Short-term").map((x) => <Chip key={x.name} x={x} />)}</div>
                <p className="mt-2 text-[11px] text-stone-500">Long-term</p>
                <div className="mt-1 flex flex-wrap gap-1">{group((x) => x.type === "Debt" && x.term === "Long-term").map((x) => <Chip key={x.name} x={x} />)}</div>
              </div>
              <div className="rounded-xl bg-stone-50 p-2 dark:bg-night-3">
                <p className="text-sm font-semibold">Equity</p>
                <p className="mt-1 text-[11px] text-stone-500">Ordinary shares</p>
                <div className="mt-1 flex flex-wrap gap-1">{group((x) => x.path.includes("Ordinary shares")).map((x) => <Chip key={x.name} x={x} />)}</div>
                <p className="mt-2 text-[11px] text-stone-500">Other</p>
                <div className="mt-1 flex flex-wrap gap-1">{group((x) => x.type === "Equity" && !x.path.includes("Ordinary shares")).map((x) => <Chip key={x.name} x={x} />)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <motion.div key={sel} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-sm dark:border-emerald-900 dark:bg-emerald-950/25" aria-live="polite">
        <p className="flex flex-wrap items-center gap-2 font-semibold">
          {s.name} <Tag>{s.type}</Tag> <Tag>{s.term}</Tag>
        </p>
        <p className="mt-1 text-xs text-stone-500">{["Sources", ...s.path].join(" → ")}</p>
        <dl className="mt-2 grid gap-2 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold text-stone-500">Cost</dt>
            <dd>{s.cost}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-stone-500">Effect on control</dt>
            <dd>{s.control}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-stone-500">Suitable purpose</dt>
            <dd>{s.use}</dd>
          </div>
        </dl>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Debt vs equity decision tree
// ---------------------------------------------------------------------------

const QS = [
  { id: "term", q: "Are the funds needed for longer than 12 months (e.g. buildings, major equipment, expansion)?" },
  { id: "cash", q: "Does the business have stable cash flows to meet regular interest and repayments?" },
  { id: "gearing", q: "Is the business's current debt to equity ratio low (below about 1 : 1)?" },
  { id: "control", q: "Are the owners willing to share ownership and control with new investors?" },
];

export function DebtEquityTree() {
  const [ans, setAns] = useState<Record<string, boolean>>({});
  const step = QS.findIndex((q) => ans[q.id] === undefined);
  const done = step === -1;
  let rec = "";
  let why = "";
  if (done) {
    if (!ans.term) {
      rec = "Short-term debt finance (overdraft, commercial bill, factoring) — or retained profits";
      why = "Match short-term needs with short-term finance. Equity is unsuitable for temporary needs.";
    } else if (ans.cash && ans.gearing) {
      rec = "Long-term debt finance (mortgage, debentures, term loan, leasing)";
      why = "Low gearing and stable cash flows mean the business can safely service debt; owners keep control and interest is tax deductible.";
    } else if (ans.control) {
      rec = "Equity finance (new issue, rights issue, placement, share purchase plan, private equity)";
      why = "Unstable cash flows or high gearing make more debt risky; owners accept dilution to avoid repayments and reduce financial risk.";
    } else if (ans.cash) {
      rec = "Leasing or a modest long-term loan, plus retained profits — monitor gearing closely";
      why = "The owners want to keep control, but gearing is already high: limit new debt, conserve cash and build equity through retained profits.";
    } else {
      rec = "Reconsider or scale back the project; use retained profits and leasing";
      why = "Without stable cash flows or willingness to share control, both debt and equity are difficult — reduce the funding need first.";
    }
  }
  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
      <ol className="space-y-2">
        {QS.map((q, i) => {
          const a = ans[q.id];
          const current = i === step;
          const reachable = i <= (done ? QS.length : step);
          return (
            <li key={q.id} className={cx("rounded-xl border p-3", current ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30" : "border-stone-200 dark:border-stone-800", !reachable && "opacity-40")}>
              <p className="text-sm font-medium">
                {i + 1}. {q.q}
              </p>
              {reachable && (
                <div className="mt-2 flex gap-2">
                  {[true, false].map((v) => (
                    <button
                      key={String(v)}
                      type="button"
                      disabled={!reachable}
                      onClick={() => {
                        const next: Record<string, boolean> = {};
                        QS.slice(0, i).forEach((p) => (next[p.id] = ans[p.id]));
                        next[q.id] = v;
                        setAns(next);
                      }}
                      aria-pressed={a === v}
                      className={cx("rounded-lg border px-3 py-1 text-sm font-semibold", a === v ? "border-emerald-600 bg-emerald-600 text-white" : "border-stone-300 dark:border-stone-700")}
                    >
                      {v ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <div>
        {done ? (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border-2 border-emerald-500 p-4">
            <p className="text-xs font-semibold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">Suggested direction</p>
            <p className="mt-1 font-display text-lg font-semibold">{rec}</p>
            <p className="mt-2 text-sm text-stone-700 dark:text-stone-300">{why}</p>
          </motion.div>
        ) : (
          <div className="rounded-2xl border border-dashed border-stone-300 p-4 text-sm text-stone-500 dark:border-stone-700">Answer the questions to see a recommendation.</div>
        )}
        <Button variant="ghost" size="sm" className="mt-2" onClick={() => setAns({})}>
          <RotateCcw className="h-4 w-4" /> Start again
        </Button>
        <p className="mt-2 text-xs text-stone-500">A teaching guide only: real decisions also consider interest rates, the economic outlook, cost of issue and lender requirements.</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Statements relationship
// ---------------------------------------------------------------------------

const REL: FlowSpec = {
  id: "fin-rel",
  title: "How the statements connect",
  nodes: [
    { id: "is", label: "Income statement", detail: "Revenue − expenses = profit for a PERIOD. Measures profitability and efficiency.", col: 0, row: 0, tone: "input" },
    { id: "np", label: "Net profit", detail: "Net profit increases owners' equity (retained profits) unless it is paid out as dividends or drawings.", col: 1, row: 0, tone: "process" },
    { id: "bs", label: "Balance sheet", detail: "Assets = liabilities + owners' equity at a POINT in time. Shows liquidity (current ratio) and solvency (debt to equity).", col: 2, row: 0, tone: "output" },
    { id: "cfs", label: "Cash flow statement", detail: "Cash in and out over a period from operating, investing and financing activities.", col: 0, row: 1, tone: "input" },
    { id: "cash", label: "Closing cash balance", detail: "The closing cash in the cash flow statement equals the cash (current asset) in the balance sheet.", col: 1, row: 1, tone: "process" },
    { id: "diff", label: "Profit ≠ cash", detail: "Credit sales, inventory purchases, loan repayments and asset purchases create differences between profit and cash flow.", col: 2, row: 1, tone: "accent" },
  ],
  edges: [
    { from: "is", to: "np" },
    { from: "np", to: "bs", label: "retained profits → equity" },
    { from: "cfs", to: "cash" },
    { from: "cash", to: "bs", label: "cash (current asset)" },
    { from: "is", to: "cfs", label: "operating activities", dashed: true },
    { from: "cash", to: "diff", dashed: true },
  ],
};

export function FinRelationship() {
  return <FlowDiagram flow={REL} />;
}

// ---------------------------------------------------------------------------
// Income statement breakdown (waterfall)
// ---------------------------------------------------------------------------

export function IncomeStatementVisual() {
  const ch = useChartTheme();
  const [v, setV] = usePersistentState("fin:income", { sales: 900_000, cogs: 540_000, selling: 120_000, admin: 95_000, finance: 25_000 });
  const gp = v.sales - v.cogs;
  const exp = v.selling + v.admin + v.finance;
  const np = gp - exp;
  const steps = [
    { name: "Sales", base: 0, value: v.sales, kind: "total" },
    { name: "COGS", base: gp, value: v.cogs, kind: "minus" },
    { name: "Gross profit", base: 0, value: gp, kind: "total" },
    { name: "Selling", base: gp - v.selling, value: v.selling, kind: "minus" },
    { name: "Admin", base: gp - v.selling - v.admin, value: v.admin, kind: "minus" },
    { name: "Finance", base: np, value: v.finance, kind: "minus" },
    { name: "Net profit", base: Math.min(0, np), value: Math.abs(np), kind: np >= 0 ? "total" : "loss" },
  ];
  const set = (k: keyof typeof v) => (x: number) => setV((s) => ({ ...s, [k]: Math.max(0, x) }));
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
      <div className="space-y-3">
        <NumberField label="Sales revenue" prefix="$" value={v.sales} step={10000} onChange={set("sales")} />
        <NumberField label="Cost of goods sold" prefix="$" value={v.cogs} step={10000} onChange={set("cogs")} />
        <NumberField label="Selling expenses" prefix="$" value={v.selling} step={5000} onChange={set("selling")} />
        <NumberField label="Administrative expenses" prefix="$" value={v.admin} step={5000} onChange={set("admin")} />
        <NumberField label="Financial expenses (interest)" prefix="$" value={v.finance} step={5000} onChange={set("finance")} />
      </div>
      <div>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={steps} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid {...ch.gridProps} />
              <XAxis dataKey="name" {...ch.axisProps} interval={0} fontSize={11} />
              <YAxis {...ch.axisProps} tickFormatter={(x) => `$${Math.round(x / 1000)}k`} />
              <Tooltip {...ch.tooltipProps} formatter={(val: number, n: string) => (n === "base" ? [null, null] : [formatCurrency(val), "Amount"])} />
              <Bar dataKey="base" stackId="a" fill="transparent" />
              <Bar dataKey="value" stackId="a" radius={[4, 4, 0, 0]}>
                {steps.map((s) => (
                  <Cell key={s.name} fill={s.kind === "total" ? ch.series[2] : s.kind === "loss" ? "#dc2626" : ch.series[0]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <table className="mt-2 w-full text-sm">
          <tbody className="tabular-nums">
            <tr><td>Sales</td><td className="text-right">{formatCurrency(v.sales)}</td></tr>
            <tr><td>less Cost of goods sold</td><td className="text-right">({formatCurrency(v.cogs)})</td></tr>
            <tr className="border-t border-stone-300 font-semibold dark:border-stone-700"><td>Gross profit</td><td className="text-right">{formatCurrency(gp)}</td></tr>
            <tr><td>less Expenses (selling, admin, finance)</td><td className="text-right">({formatCurrency(exp)})</td></tr>
            <tr className="border-t-2 border-stone-400 font-semibold dark:border-stone-600"><td>Net profit</td><td className={cx("text-right", np < 0 && "text-red-600")}>{formatCurrency(np)}</td></tr>
          </tbody>
        </table>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
          GP ratio {formatRatio(v.sales ? gp / v.sales : null, "percent", 1)} · NP ratio {formatRatio(v.sales ? np / v.sales : null, "percent", 1)} · Expense ratio {formatRatio(v.sales ? exp / v.sales : null, "percent", 1)}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Balance sheet structure
// ---------------------------------------------------------------------------

export function BalanceSheetVisual() {
  const ch = useChartTheme();
  const [v, setV] = usePersistentState("fin:balance", { cash: 40_000, receivables: 90_000, inventory: 110_000, nca: 560_000, cl: 150_000, ncl: 250_000 });
  const ca = v.cash + v.receivables + v.inventory;
  const assets = ca + v.nca;
  const liabilities = v.cl + v.ncl;
  const equity = assets - liabilities;
  const set = (k: keyof typeof v) => (x: number) => setV((s) => ({ ...s, [k]: Math.max(0, x) }));
  const data = [
    { side: "Assets", "Current assets": ca, "Non-current assets": v.nca },
    { side: "Liabilities + equity", "Current liabilities": v.cl, "Non-current liabilities": v.ncl, "Owners' equity": Math.max(0, equity) },
  ];
  const gap = ch.isDark ? "#1c1916" : "#fff";
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="Cash" prefix="$" value={v.cash} step={5000} onChange={set("cash")} />
        <NumberField label="Accounts receivable" prefix="$" value={v.receivables} step={5000} onChange={set("receivables")} />
        <NumberField label="Inventory" prefix="$" value={v.inventory} step={5000} onChange={set("inventory")} />
        <NumberField label="Non-current assets" prefix="$" value={v.nca} step={10000} onChange={set("nca")} />
        <NumberField label="Current liabilities" prefix="$" value={v.cl} step={5000} onChange={set("cl")} />
        <NumberField label="Non-current liabilities" prefix="$" value={v.ncl} step={10000} onChange={set("ncl")} />
        <div className="col-span-2 rounded-xl bg-emerald-50 p-3 text-sm dark:bg-emerald-950/30">
          Owners' equity is the residual: assets − liabilities = <span className="font-semibold">{formatCurrency(equity)}</span>. That is why the balance sheet always balances.
        </div>
      </div>
      <div>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid {...ch.gridProps} />
              <XAxis dataKey="side" {...ch.axisProps} />
              <YAxis {...ch.axisProps} tickFormatter={(x) => `$${Math.round(x / 1000)}k`} />
              <Tooltip {...ch.tooltipProps} formatter={(x: number) => formatCurrency(x)} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Current assets" stackId="a" fill={ch.series[2]} stroke={gap} strokeWidth={2} />
              <Bar dataKey="Non-current assets" stackId="a" fill={ch.series[1]} stroke={gap} strokeWidth={2} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Current liabilities" stackId="a" fill={ch.series[0]} stroke={gap} strokeWidth={2} />
              <Bar dataKey="Non-current liabilities" stackId="a" fill={ch.series[3]} stroke={gap} strokeWidth={2} />
              <Bar dataKey="Owners' equity" stackId="a" fill={ch.isDark ? "#a8a29e" : "#57534e"} stroke={gap} strokeWidth={2} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-sm font-semibold tabular-nums">
          Assets {formatCurrency(assets)} = Liabilities {formatCurrency(liabilities)} + Owners' equity {formatCurrency(equity)}
        </p>
        {equity < 0 && <p className="mt-1 text-center text-sm text-red-600">Negative equity: liabilities exceed assets — the business is insolvent on paper.</p>}
        <p className="mt-1 text-center text-xs text-stone-500">Current ratio {formatRatio(v.cl ? ca / v.cl : null, "ratio")} · Debt to equity {equity > 0 ? formatRatio(liabilities / equity, "ratio") : "n/a"}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cash flow statement
// ---------------------------------------------------------------------------

const CF_DEFAULT: CashFlowLine[] = [
  { id: "r", label: "Receipts from customers", activity: "operating", amount: 820_000 },
  { id: "s", label: "Payments to suppliers", activity: "operating", amount: -510_000 },
  { id: "w", label: "Payments to employees", activity: "operating", amount: -230_000 },
  { id: "i", label: "Interest paid", activity: "operating", amount: -18_000 },
  { id: "e", label: "Purchase of equipment", activity: "investing", amount: -120_000 },
  { id: "a", label: "Sale of old vehicle", activity: "investing", amount: 15_000 },
  { id: "l", label: "Proceeds from bank loan", activity: "financing", amount: 80_000 },
  { id: "d", label: "Dividends / drawings paid", activity: "financing", amount: -40_000 },
];

export function CashFlowVisual() {
  const ch = useChartTheme();
  const [lines, setLines] = usePersistentState<CashFlowLine[]>("fin:cashflow", CF_DEFAULT);
  const [opening, setOpening] = usePersistentState<number>("fin:cashflow-open", 35_000);
  const s = summariseCashFlow(lines, opening);
  const update = (i: number, patch: Partial<CashFlowLine>) => setLines((l) => l.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const acts: CashFlowLine["activity"][] = ["operating", "investing", "financing"];
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        {acts.map((a) => (
          <div key={a} className="rounded-xl border border-stone-200 p-3 dark:border-stone-800">
            <p className="mb-2 text-sm font-semibold capitalize">{a} activities</p>
            <div className="space-y-2">
              {lines.map((l, i) =>
                l.activity !== a ? null : (
                  <div key={l.id} className="grid grid-cols-[1fr_110px_26px] items-center gap-1">
                    <input aria-label="Line description" value={l.label} onChange={(e) => update(i, { label: e.target.value })} className="min-w-0 rounded-lg border border-stone-300 bg-white px-2 py-1 text-xs dark:border-stone-700 dark:bg-night-3" />
                    <input aria-label={`Amount for ${l.label}`} type="number" step={5000} value={l.amount} onChange={(e) => update(i, { amount: Number(e.target.value) || 0 })} className={cx("rounded-lg border border-stone-300 bg-white px-2 py-1 text-right text-xs tabular-nums dark:border-stone-700 dark:bg-night-3", l.amount < 0 && "text-red-600")} />
                    <button type="button" onClick={() => setLines((x) => x.filter((_, j) => j !== i))} aria-label={`Remove ${l.label}`} className="text-stone-400 hover:text-red-600">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ),
              )}
              <button type="button" onClick={() => setLines((x) => [...x, { id: `${a}-${Date.now()}`, label: "New item", activity: a, amount: 0 }])} className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <Plus className="h-3.5 w-3.5" /> Add line
              </button>
              <p className="border-t border-stone-200 pt-1 text-right text-sm font-semibold tabular-nums dark:border-stone-800">Net: {formatCurrency(s[a])}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-stone-500">Enter inflows as positive and outflows as negative numbers.</p>
      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-2">
          <NumberField label="Opening cash balance" prefix="$" value={opening} step={5000} onChange={setOpening} />
          <table className="w-full text-sm tabular-nums">
            <tbody>
              <tr><td>Net cash from operating activities</td><td className="text-right">{formatCurrency(s.operating)}</td></tr>
              <tr><td>Net cash from investing activities</td><td className="text-right">{formatCurrency(s.investing)}</td></tr>
              <tr><td>Net cash from financing activities</td><td className="text-right">{formatCurrency(s.financing)}</td></tr>
              <tr className="border-t border-stone-300 font-semibold dark:border-stone-700"><td>Net increase/(decrease) in cash</td><td className="text-right">{formatCurrency(s.netChange)}</td></tr>
              <tr><td>Opening cash</td><td className="text-right">{formatCurrency(s.openingCash)}</td></tr>
              <tr className="border-t-2 border-stone-400 font-semibold dark:border-stone-600"><td>Closing cash</td><td className={cx("text-right", s.closingCash < 0 && "text-red-600")}>{formatCurrency(s.closingCash)}</td></tr>
            </tbody>
          </table>
        </div>
        <div>
          <div className="h-52">
            <ResponsiveContainer>
              <BarChart data={[{ name: "Operating", v: s.operating }, { name: "Investing", v: s.investing }, { name: "Financing", v: s.financing }, { name: "Closing cash", v: s.closingCash }]} margin={{ top: 10, right: 10, left: 10 }}>
                <CartesianGrid {...ch.gridProps} />
                <XAxis dataKey="name" {...ch.axisProps} />
                <YAxis {...ch.axisProps} tickFormatter={(x) => `$${Math.round(x / 1000)}k`} />
                <ReferenceLine y={0} stroke={ch.axis} />
                <Tooltip {...ch.tooltipProps} formatter={(x: number) => [formatCurrency(x), "Net cash flow"]} />
                <Bar dataKey="v" name="Net cash flow" radius={[4, 4, 0, 0]} maxBarSize={60}>
                  {[s.operating, s.investing, s.financing, s.closingCash].map((x, i) => (
                    <Cell key={i} fill={x < 0 ? "#dc2626" : i === 3 ? ch.series[1] : ch.series[2]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-1 text-sm text-stone-700 dark:text-stone-300">
            {s.operating < 0 && <li className="text-red-700 dark:text-red-400">• Negative operating cash flow: day-to-day trading is not generating cash — a serious liquidity warning.</li>}
            {s.operating >= 0 && <li>• Positive operating cash flow: trading generates cash to fund investment and repay finance.</li>}
            {s.investing < 0 && <li>• Negative investing cash flow usually means the business is buying non-current assets (investing for growth).</li>}
            {s.financing > 0 && <li>• Positive financing cash flow: new borrowing or equity raised — check gearing.</li>}
            {s.closingCash < 0 && <li className="text-red-700 dark:text-red-400">• Closing cash is negative: the business needs an overdraft or other short-term finance.</li>}
          </ul>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={() => { setLines(CF_DEFAULT); setOpening(35_000); }}>
        <RotateCcw className="h-4 w-4" /> Reset example
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ratio dashboard (two years + industry)
// ---------------------------------------------------------------------------

const DASH_DATA = {
  "2025": { sales: 1_800_000, cogs: 1_080_000, expenses: 520_000, ca: 420_000, cl: 240_000, tl: 520_000, te: 780_000, ar: 160_000 },
  "2026": { sales: 2_050_000, cogs: 1_290_000, expenses: 640_000, ca: 460_000, cl: 380_000, tl: 860_000, te: 820_000, ar: 290_000 },
};
const INDUSTRY: Record<RatioId, number> = { current: 1.6, debtToEquity: 0.8, grossProfit: 0.38, netProfit: 0.1, roe: 0.18, expense: 0.28, arTurnover: 9 };
const RATIO_META: { id: RatioId; name: string; fmt: "ratio" | "percent" | "times"; higherBetter: boolean | null; group: string }[] = [
  { id: "current", name: "Current ratio", fmt: "ratio", higherBetter: null, group: "Liquidity" },
  { id: "debtToEquity", name: "Debt to equity", fmt: "ratio", higherBetter: false, group: "Solvency" },
  { id: "grossProfit", name: "Gross profit ratio", fmt: "percent", higherBetter: true, group: "Profitability" },
  { id: "netProfit", name: "Net profit ratio", fmt: "percent", higherBetter: true, group: "Profitability" },
  { id: "roe", name: "Return on equity", fmt: "percent", higherBetter: true, group: "Profitability" },
  { id: "expense", name: "Expense ratio", fmt: "percent", higherBetter: false, group: "Efficiency" },
  { id: "arTurnover", name: "AR turnover", fmt: "times", higherBetter: true, group: "Efficiency" },
];

function ratiosFor(d: (typeof DASH_DATA)["2025"]) {
  return buildStatements({ sales: d.sales, cogs: d.cogs, operatingExpenses: d.expenses, currentAssets: d.ca, receivables: d.ar, currentLiabilities: d.cl, totalLiabilities: d.tl, ownersEquity: d.te }).ratios;
}

export function RatioDashboard() {
  const ch = useChartTheme();
  const [sel, setSel] = useState<RatioId>("current");
  const r25 = ratiosFor(DASH_DATA["2025"]);
  const r26 = ratiosFor(DASH_DATA["2026"]);
  const meta = RATIO_META.find((m) => m.id === sel)!;
  const scaleV = (v: number | null) => (v === null ? 0 : meta.fmt === "percent" ? round(v * 100, 1) : round(v, 2));
  const chartData = [
    { name: "2025", value: scaleV(r25[sel]) },
    { name: "2026", value: scaleV(r26[sel]) },
    { name: "Industry avg", value: scaleV(INDUSTRY[sel]) },
  ];
  return (
    <div>
      <p className="text-sm text-stone-600 dark:text-stone-400">Fictional business: <span className="font-semibold">Harbourside Homewares Pty Ltd</span>. Select a ratio card to compare over time and against the industry average.</p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {RATIO_META.map((m) => {
          const a = r25[m.id];
          const b = r26[m.id];
          const up = a !== null && b !== null && b > a;
          const down = a !== null && b !== null && b < a;
          const good = m.higherBetter === null ? null : (m.higherBetter ? up : down);
          return (
            <button key={m.id} type="button" onClick={() => setSel(m.id)} aria-pressed={sel === m.id} className={cx("rounded-xl border p-2.5 text-left transition-colors", sel === m.id ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" : "border-stone-200 hover:border-stone-300 dark:border-stone-800")}>
              <p className="text-[10px] font-semibold tracking-wide text-stone-500 uppercase">{m.group}</p>
              <p className="text-xs font-medium">{m.name}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">{formatRatio(b, m.fmt, m.fmt === "percent" ? 1 : 2)}</p>
              <p className={cx("flex items-center gap-1 text-[11px]", good === null ? "text-stone-500" : good ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                {up ? <TrendingUp className="h-3 w-3" /> : down ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />} from {formatRatio(a, m.fmt, m.fmt === "percent" ? 1 : 2)}
              </p>
            </button>
          );
        })}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="h-56">
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0 }}>
              <CartesianGrid {...ch.gridProps} />
              <XAxis dataKey="name" {...ch.axisProps} />
              <YAxis {...ch.axisProps} tickFormatter={(x) => (meta.fmt === "percent" ? `${x}%` : `${x}`)} />
              <Tooltip {...ch.tooltipProps} formatter={(x: number) => [meta.fmt === "percent" ? `${x}%` : meta.fmt === "times" ? `${x} times` : `${x} : 1`, meta.name]} />
              <Bar dataKey="value" name={meta.name} radius={[4, 4, 0, 0]} maxBarSize={56}>
                {chartData.map((d, i) => (
                  <Cell key={d.name} fill={i === 2 ? (ch.isDark ? "#78716c" : "#a8a29e") : ch.series[2]} fillOpacity={i === 0 ? 0.6 : 1} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">{meta.name}: {interpretRatio(sel, r26[sel]).headline}</p>
          <p className="text-stone-700 dark:text-stone-300">{interpretRatio(sel, r26[sel]).meaning}</p>
          <ul className="space-y-1 text-stone-700 dark:text-stone-300">
            {interpretRatio(sel, r26[sel]).implications.map((x) => (
              <li key={x}>• {x}</li>
            ))}
          </ul>
          {sel === "arTurnover" && <p className="text-xs text-stone-500">Collection period: 2025 ≈ {Math.round(collectionPeriod(r25.arTurnover) ?? 0)} days → 2026 ≈ {Math.round(collectionPeriod(r26.arTurnover) ?? 0)} days.</p>}
        </div>
      </div>
      <Callout tone="exam" title="Overall analysis of Harbourside (2025 → 2026)">
        Sales grew 13.9%, but liquidity weakened (current ratio 1.75 → 1.21 : 1), gearing rose above the industry average (0.67 → 1.05 : 1), margins fell (GP 40% → 37.1%; NP 11.1% → 5.9%) and customers took much longer to pay. Growth is being financed by debt and slow-paying customers — a classic conflict between growth and liquidity. Strategies: credit control and factoring, expense minimisation, and reducing reliance on short-term debt.
      </Callout>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Profitability analysis graph
// ---------------------------------------------------------------------------

const PROFIT_YEARS = [
  { year: "2022", sales: 1_200_000, gp: 492_000, np: 120_000, equity: 600_000 },
  { year: "2023", sales: 1_380_000, gp: 552_000, np: 145_000, equity: 680_000 },
  { year: "2024", sales: 1_560_000, gp: 608_000, np: 140_000, equity: 760_000 },
  { year: "2025", sales: 1_800_000, gp: 720_000, np: 200_000, equity: 780_000 },
  { year: "2026", sales: 2_050_000, gp: 760_000, np: 120_000, equity: 820_000 },
];

export function ProfitabilityGraph() {
  const ch = useChartTheme();
  const [show, setShow] = useState({ gp: true, np: true, roe: true });
  const data = PROFIT_YEARS.map((y) => ({ year: y.year, "Gross profit ratio": round((y.gp / y.sales) * 100, 1), "Net profit ratio": round((y.np / y.sales) * 100, 1), "Return on equity": round((y.np / y.equity) * 100, 1) }));
  return (
    <div>
      <div className="flex flex-wrap gap-4">
        <Checkbox checked={show.gp} onChange={(v) => setShow((s) => ({ ...s, gp: v }))} label="Gross profit ratio" />
        <Checkbox checked={show.np} onChange={(v) => setShow((s) => ({ ...s, np: v }))} label="Net profit ratio" />
        <Checkbox checked={show.roe} onChange={(v) => setShow((s) => ({ ...s, roe: v }))} label="Return on equity" />
      </div>
      <div className="mt-3 h-64">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0 }}>
            <CartesianGrid {...ch.gridProps} />
            <XAxis dataKey="year" {...ch.axisProps} />
            <YAxis {...ch.axisProps} tickFormatter={(x) => `${x}%`} />
            <Tooltip {...ch.tooltipProps} formatter={(x: number) => `${x}%`} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {show.gp && <Line dataKey="Gross profit ratio" stroke={ch.series[0]} strokeWidth={2} dot={{ r: 4 }} />}
            {show.np && <Line dataKey="Net profit ratio" stroke={ch.series[1]} strokeWidth={2} dot={{ r: 4 }} />}
            {show.roe && <Line dataKey="Return on equity" stroke={ch.series[2]} strokeWidth={2} dot={{ r: 4 }} />}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-stone-700 dark:text-stone-300">
        Gross margin stayed near 37–41%, but the net profit ratio fell sharply in 2026 (to {data[4]["Net profit ratio"]}%), so the problem lies in <span className="font-semibold">expenses</span>, not cost of goods sold. ROE fell with it. Compare the gap between the GP and NP lines: a widening gap signals rising expenses.
      </p>
      <p className="mt-1 text-xs text-stone-500">Fictional five-year data for Harbourside Homewares.</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Working capital management
// ---------------------------------------------------------------------------

const WC_CYCLE: FlowSpec = {
  id: "wc-cycle",
  title: "Working capital cycle",
  nodes: [
    { id: "cash", label: "Cash", detail: "Control: keep enough cash for commitments; invest any surplus. Cash budgets forecast shortfalls.", col: 0, row: 0, tone: "output" },
    { id: "inv", label: "Inventory", detail: "Control: avoid excess stock (JIT, accurate forecasting) — stock ties up cash and incurs holding costs.", col: 1, row: 0, tone: "input" },
    { id: "sales", label: "Credit sales", detail: "Sales on credit create accounts receivable rather than immediate cash.", col: 2, row: 0, tone: "process" },
    { id: "ar", label: "Accounts receivable", detail: "Control: credit checks, prompt invoicing, discounts for early payment, follow-up, factoring.", col: 2, row: 1, tone: "decision" },
    { id: "ap", label: "Payables, loans & overdraft", detail: "Control: use trade credit fully but pay on time; match loan terms; use the overdraft only as a buffer. Leasing and sale and leaseback release cash.", col: 0, row: 1, tone: "accent" },
  ],
  edges: [
    { from: "cash", to: "inv", label: "buy stock" },
    { from: "inv", to: "sales", label: "sell" },
    { from: "sales", to: "ar" },
    { from: "ar", to: "ap", label: "collect cash", dashed: false },
    { from: "ap", to: "cash", label: "finance & pay", dashed: true },
  ],
};

const SYMPTOMS = [
  { id: "slow-ar", label: "Customers are paying slowly", strategies: ["Offer discounts for early payment", "Tighten credit policy and follow up overdue accounts", "Factor receivables for immediate cash"] },
  { id: "excess-inv", label: "Too much inventory", strategies: ["Reduce order quantities; move toward JIT", "Clear slow-moving stock (discounts)", "Improve demand forecasting with Marketing"] },
  { id: "overdraft", label: "Overdraft at its limit", strategies: ["Prepare a cash flow budget to anticipate shortfalls", "Convert part of the overdraft to a term loan (match terms)", "Delay non-essential spending"] },
  { id: "lumpy", label: "Large bills all due in the same month", strategies: ["Distribution of payments — spread payments across the year", "Negotiate instalment terms with suppliers"] },
  { id: "tied-up", label: "Cash tied up in buildings or equipment", strategies: ["Sale and leaseback of property", "Lease future equipment instead of buying"] },
];

export function WorkingCapitalFlow() {
  const [sym, setSym] = useState(SYMPTOMS[0].id);
  const s = SYMPTOMS.find((x) => x.id === sym)!;
  return (
    <div className="space-y-4">
      <FlowDiagram flow={WC_CYCLE} />
      <div className="rounded-2xl border border-stone-200 p-4 dark:border-stone-800">
        <p className="text-sm font-semibold">Diagnose a working capital problem</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SYMPTOMS.map((x) => (
            <button key={x.id} type="button" onClick={() => setSym(x.id)} aria-pressed={sym === x.id} className={cx("rounded-lg border px-2.5 py-1 text-xs font-medium", sym === x.id ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40" : "border-stone-200 dark:border-stone-700")}>
              {x.label}
            </button>
          ))}
        </div>
        <ul className="mt-3 space-y-1.5">
          {s.strategies.map((x) => (
            <li key={x} className="flex items-center gap-2 text-sm">
              <ArrowRight className="h-4 w-4 text-emerald-600" />
              {x}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Revenue, expenses and profit
// ---------------------------------------------------------------------------

export function RevExpChart() {
  const ch = useChartTheme();
  const [p, setP] = useState(50);
  const [vc, setVc] = useState(28);
  const [fc, setFc] = useState(180_000);
  const [q, setQ] = useState(12_000);
  const maxQ = 20_000;
  const data = Array.from({ length: 21 }, (_, i) => {
    const units = (i * maxQ) / 20;
    return { units, Revenue: units * p, "Total costs": fc + units * vc };
  });
  const revenue = q * p;
  const total = fc + q * vc;
  const profit = revenue - total;
  const be = p > vc ? fc / (p - vc) : null;
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
      <div className="space-y-3">
        <Slider label="Selling price per unit" value={p} min={20} max={90} onChange={setP} format={(v) => `$${v}`} />
        <Slider label="Variable cost per unit" value={vc} min={5} max={60} onChange={setVc} format={(v) => `$${v}`} />
        <Slider label="Fixed costs (per year)" value={fc} min={50_000} max={400_000} step={10_000} onChange={setFc} format={(v) => formatCurrency(v)} />
        <Slider label="Units sold" value={q} min={0} max={maxQ} step={500} onChange={setQ} format={(v) => v.toLocaleString("en-AU")} />
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="rounded-xl bg-stone-50 p-2 dark:bg-night-3"><p className="text-xs text-stone-500">Revenue</p><p className="font-semibold tabular-nums">{formatCurrency(revenue)}</p></div>
          <div className="rounded-xl bg-stone-50 p-2 dark:bg-night-3"><p className="text-xs text-stone-500">Total costs</p><p className="font-semibold tabular-nums">{formatCurrency(total)}</p></div>
          <div className={cx("rounded-xl p-2", profit >= 0 ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-red-50 dark:bg-red-950/30")}><p className="text-xs text-stone-500">Profit</p><p className="font-semibold tabular-nums">{formatCurrency(profit)}</p></div>
        </div>
      </div>
      <div>
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid {...ch.gridProps} />
              <XAxis dataKey="units" type="number" domain={[0, maxQ]} {...ch.axisProps} tickFormatter={(x) => `${x / 1000}k`} label={{ value: "Units sold", position: "insideBottom", offset: -4, fill: ch.axis, fontSize: 12 }} />
              <YAxis {...ch.axisProps} tickFormatter={(x) => `$${Math.round(x / 1000)}k`} />
              <Tooltip {...ch.tooltipProps} formatter={(x: number) => formatCurrency(x)} labelFormatter={(l) => `${Number(l).toLocaleString("en-AU")} units`} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <ReferenceLine x={q} stroke={ch.bronze} strokeDasharray="4 4" />
              <Line dataKey="Revenue" stroke={ch.series[2]} strokeWidth={2} dot={false} />
              <Line dataKey="Total costs" stroke={ch.series[0]} strokeWidth={2} dot={false} />
              {be !== null && be <= maxQ && <ReferenceDot x={be} y={be * p} r={5} fill={ch.text} stroke="none" label={{ value: "Profit = 0", position: "top", fill: ch.text, fontSize: 11 }} />}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-stone-700 dark:text-stone-300">
          Profit management levers: raise revenue (price × volume — marketing objectives) or cut costs (fixed costs, variable costs, cost centres, expense minimisation). {be !== null ? `Profit becomes positive above about ${Math.ceil(be).toLocaleString("en-AU")} units.` : "Price is below variable cost — every unit sold loses money."}
        </p>
        <p className="mt-1 text-xs text-stone-500">The crossover point (break-even) is a supplementary concept that helps visualise cost controls; it is not a named HSC syllabus calculation.</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exchange rates
// ---------------------------------------------------------------------------

export function ExchangeVisual() {
  const ch = useChartTheme();
  const [rate, setRate] = useState(0.65);
  const [hedge, setHedge] = useState(false);
  const forward = 0.65;
  const effective = hedge ? forward : rate;
  const importAud = 100_000 / effective;
  const exportUsdPrice = 100_000 * rate;
  const exportRevAud = 100_000 / effective;
  const data = [0.55, 0.6, 0.65, 0.7, 0.75, 0.8].map((r) => ({ rate: `US$${r.toFixed(2)}`, "Importer's AUD cost": Math.round(100_000 / (hedge ? forward : r)) }));
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-3">
        <Slider label="Exchange rate: US$ per A$1" value={rate} min={0.55} max={0.8} step={0.01} onChange={setRate} format={(v) => `US$${v.toFixed(2)}`} />
        <Checkbox checked={hedge} onChange={setHedge} label={`Hedge with a forward exchange contract locked at US$${forward.toFixed(2)}`} />
        <div className="space-y-2 text-sm">
          <div className="rounded-xl bg-stone-50 p-3 dark:bg-night-3">
            <p className="font-semibold">Importer: buys US$100,000 of stock</p>
            <p>AUD cost: <span className="font-semibold tabular-nums">{formatCurrency(importAud)}</span></p>
          </div>
          <div className="rounded-xl bg-stone-50 p-3 dark:bg-night-3">
            <p className="font-semibold">Exporter: sells A$100,000 of goods (priced in AUD)</p>
            <p>Price to US buyers: <span className="font-semibold tabular-nums">US${Math.round(exportUsdPrice).toLocaleString("en-AU")}</span> — {rate < 0.65 ? "cheaper, more competitive" : rate > 0.65 ? "dearer, less competitive" : "unchanged"}</p>
          </div>
          <div className="rounded-xl bg-stone-50 p-3 dark:bg-night-3">
            <p className="font-semibold">Exporter: receives US$100,000 of revenue</p>
            <p>AUD value: <span className="font-semibold tabular-nums">{formatCurrency(exportRevAud)}</span></p>
          </div>
        </div>
      </div>
      <div>
        <div className="h-56">
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10 }}>
              <CartesianGrid {...ch.gridProps} />
              <XAxis dataKey="rate" {...ch.axisProps} />
              <YAxis {...ch.axisProps} tickFormatter={(x) => `$${Math.round(x / 1000)}k`} domain={[0, 200_000]} />
              <Tooltip {...ch.tooltipProps} formatter={(x: number) => formatCurrency(x)} />
              <Bar dataKey="Importer's AUD cost" fill={ch.series[2]} radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <ul className="space-y-1 text-sm text-stone-700 dark:text-stone-300">
          <li>• <span className="font-semibold">AUD depreciates</span> (falls): imports cost more in AUD; exports become cheaper overseas; foreign revenue is worth more in AUD.</li>
          <li>• <span className="font-semibold">AUD appreciates</span> (rises): imports cheaper; exports less competitive; foreign revenue worth less in AUD.</li>
          <li>• <span className="font-semibold">Hedging</span> with a forward contract (a derivative) fixes the rate — removing risk, but also forgoing gains from favourable movements.</li>
        </ul>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Financial statement & performance simulator
// ---------------------------------------------------------------------------

export const SIM_BASE: StatementInputs = {
  sales: 1_500_000,
  cogs: 900_000,
  operatingExpenses: 420_000,
  currentAssets: 380_000,
  receivables: 150_000,
  currentLiabilities: 220_000,
  totalLiabilities: 600_000,
  ownersEquity: 900_000,
};

const CHANGE_EXPLAIN: Record<RatioId, (up: boolean) => string> = {
  current: (up) => (up ? "Liquidity improved: more current assets per $1 of current liabilities." : "Liquidity weakened: fewer current assets to cover short-term debts."),
  debtToEquity: (up) => (up ? "Gearing rose: the business relies more on debt — higher financial risk (solvency)." : "Gearing fell: lower reliance on debt — stronger solvency."),
  grossProfit: (up) => (up ? "Gross margin improved: COGS fell relative to sales (better purchasing, pricing or efficiency)." : "Gross margin fell: COGS rose faster than sales, or prices were cut."),
  netProfit: (up) => (up ? "Net margin improved — profitability is stronger after all expenses." : "Net margin fell — check whether COGS or expenses are the cause."),
  roe: (up) => (up ? "Owners earn a higher return on their investment." : "Owners earn a lower return on their investment."),
  expense: (up) => (up ? "Efficiency worsened: expenses absorb more of each sales dollar." : "Efficiency improved: expenses absorb less of each sales dollar."),
  arTurnover: (up) => (up ? "Efficiency improved: customers are paying faster, which also helps cash flow." : "Customers are paying more slowly, tying up cash."),
};

export function FinanceSimulator() {
  const [v, setV] = usePersistentState<StatementInputs>("sim:fin", SIM_BASE);
  const s = useMemo(() => buildStatements(v), [v]);
  const base = useMemo(() => buildStatements(SIM_BASE), []);
  const valid = s.issues.length === 0;
  const set = (k: keyof StatementInputs) => (x: number) => setV((p) => ({ ...p, [k]: x }));
  const err = (k: keyof StatementInputs) => s.issues.find((i) => i.field === k)?.message;

  return (
    <div className="space-y-5">
      <p className="text-sm text-stone-600 dark:text-stone-400">Fictional business: <span className="font-semibold">Ridgeway Outdoor Supplies</span>. Change any figure — the statements and ratios update together. Total assets are calculated from the accounting equation, so the balance sheet always balances; impossible combinations are flagged and the ratios are paused until fixed.</p>
      <div className="grid gap-5 xl:grid-cols-[1fr_1.5fr]">
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Sales" prefix="$" step={10000} value={v.sales} onChange={set("sales")} error={err("sales")} />
          <NumberField label="Cost of goods sold" prefix="$" step={10000} value={v.cogs} onChange={set("cogs")} error={err("cogs")} />
          <NumberField label="Operating expenses" prefix="$" step={10000} value={v.operatingExpenses} onChange={set("operatingExpenses")} error={err("operatingExpenses")} />
          <NumberField label="Receivables (part of CA)" prefix="$" step={5000} value={v.receivables} onChange={set("receivables")} error={err("receivables")} />
          <NumberField label="Current assets" prefix="$" step={10000} value={v.currentAssets} onChange={set("currentAssets")} error={err("currentAssets")} />
          <NumberField label="Current liabilities" prefix="$" step={10000} value={v.currentLiabilities} onChange={set("currentLiabilities")} error={err("currentLiabilities")} />
          <NumberField label="Total liabilities" prefix="$" step={10000} value={v.totalLiabilities} onChange={set("totalLiabilities")} error={err("totalLiabilities")} />
          <NumberField label="Owners' equity" prefix="$" step={10000} value={v.ownersEquity} onChange={set("ownersEquity")} error={err("ownersEquity")} />
          <div className="col-span-2 flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => setV(SIM_BASE)}>
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setV((p) => ({ ...p, receivables: Math.round(p.receivables * 0.6), currentAssets: p.currentAssets }))}>Scenario: collect receivables faster</Button>
            <Button size="sm" variant="ghost" onClick={() => setV((p) => ({ ...p, totalLiabilities: p.totalLiabilities + 300_000 }))}>Scenario: borrow $300k long-term</Button>
            <Button size="sm" variant="ghost" onClick={() => setV((p) => ({ ...p, operatingExpenses: Math.round(p.operatingExpenses * 0.9) }))}>Scenario: cut expenses 10%</Button>
          </div>
        </div>
        <div className="space-y-4">
          {!valid && (
            <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200" role="alert">
              <p className="flex items-center gap-1.5 font-semibold"><AlertTriangle className="h-4 w-4" /> These figures are not internally consistent</p>
              <ul className="mt-1 space-y-0.5">
                {s.issues.map((i) => (
                  <li key={i.message}>• {i.message}</li>
                ))}
              </ul>
            </div>
          )}
          <div className={cx("grid gap-4 md:grid-cols-2", !valid && "pointer-events-none opacity-40")} aria-hidden={!valid}>
            <div className="rounded-xl border border-stone-200 p-3 dark:border-stone-800">
              <p className="text-sm font-semibold">Income statement</p>
              <table className="mt-1 w-full text-sm tabular-nums">
                <tbody>
                  <tr><td>Sales</td><td className="text-right">{formatCurrency(s.income.sales)}</td></tr>
                  <tr><td>less COGS</td><td className="text-right">({formatCurrency(s.income.cogs)})</td></tr>
                  <tr className="border-t border-stone-300 font-semibold dark:border-stone-700"><td>Gross profit</td><td className="text-right">{formatCurrency(s.income.grossProfit)}</td></tr>
                  <tr><td>less Expenses</td><td className="text-right">({formatCurrency(s.income.operatingExpenses)})</td></tr>
                  <tr className="border-t-2 border-stone-400 font-semibold dark:border-stone-600"><td>Net profit</td><td className={cx("text-right", s.income.netProfit < 0 && "text-red-600")}>{formatCurrency(s.income.netProfit)}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="rounded-xl border border-stone-200 p-3 dark:border-stone-800">
              <p className="flex items-center justify-between text-sm font-semibold">
                Balance sheet {s.balance.balances && <span className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400"><Check className="h-3.5 w-3.5" /> balances</span>}
              </p>
              <table className="mt-1 w-full text-sm tabular-nums">
                <tbody>
                  <tr><td>Current assets</td><td className="text-right">{formatCurrency(s.balance.currentAssets)}</td></tr>
                  <tr className="text-xs text-stone-500"><td className="pl-3">incl. receivables</td><td className="text-right">{formatCurrency(s.balance.receivables)}</td></tr>
                  <tr><td>Non-current assets</td><td className="text-right">{formatCurrency(s.balance.nonCurrentAssets)}</td></tr>
                  <tr className="border-t border-stone-300 font-semibold dark:border-stone-700"><td>Total assets</td><td className="text-right">{formatCurrency(s.balance.totalAssets)}</td></tr>
                  <tr><td>Current liabilities</td><td className="text-right">{formatCurrency(s.balance.currentLiabilities)}</td></tr>
                  <tr><td>Non-current liabilities</td><td className="text-right">{formatCurrency(s.balance.nonCurrentLiabilities)}</td></tr>
                  <tr><td>Owners' equity</td><td className="text-right">{formatCurrency(s.balance.ownersEquity)}</td></tr>
                  <tr className="border-t border-stone-300 font-semibold dark:border-stone-700"><td>Liabilities + equity</td><td className="text-right">{formatCurrency(s.balance.liabilitiesPlusEquity)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className={cx("grid grid-cols-2 gap-2 sm:grid-cols-4", !valid && "pointer-events-none opacity-40")}>
            {RATIO_META.map((m) => {
              const now = s.ratios[m.id];
              const was = base.ratios[m.id];
              const changed = now !== null && was !== null && Math.abs(now - was) > 1e-6;
              const rating = interpretRatio(m.id, now).rating;
              return (
                <div key={m.id} className="rounded-xl border border-stone-200 p-2.5 dark:border-stone-800">
                  <p className="text-[10px] font-semibold tracking-wide text-stone-500 uppercase">{m.group}</p>
                  <p className="text-xs">{m.name}</p>
                  <p className="text-lg font-semibold tabular-nums">{formatRatio(now, m.fmt, m.fmt === "percent" ? 1 : 2)}</p>
                  {rating === "concern" && <Tag tone="bad">Concern</Tag>}
                  {changed && <p className="text-[11px] text-stone-500">was {formatRatio(was, m.fmt, m.fmt === "percent" ? 1 : 2)}</p>}
                </div>
              );
            })}
            <div className="rounded-xl border border-stone-200 p-2.5 dark:border-stone-800">
              <p className="text-[10px] font-semibold tracking-wide text-stone-500 uppercase">Liquidity</p>
              <p className="text-xs">Working capital</p>
              <p className="text-lg font-semibold tabular-nums">{formatCurrency(s.workingCapital)}</p>
            </div>
          </div>
          {valid && (
            <div className="rounded-xl bg-emerald-50/70 p-3 text-sm dark:bg-emerald-950/25">
              <p className="font-semibold">What changed compared with the starting figures?</p>
              <ul className="mt-1 space-y-1">
                {RATIO_META.filter((m) => {
                  const a = base.ratios[m.id];
                  const b = s.ratios[m.id];
                  return a !== null && b !== null && Math.abs(a - b) > 1e-6;
                }).map((m) => (
                  <li key={m.id}>• <span className="font-semibold">{m.name}:</span> {CHANGE_EXPLAIN[m.id]((s.ratios[m.id] ?? 0) > (base.ratios[m.id] ?? 0))}</li>
                ))}
                {RATIO_META.every((m) => base.ratios[m.id] === s.ratios[m.id]) && <li>• No change yet — try a scenario button or edit a figure.</li>}
              </ul>
            </div>
          )}
        </div>
      </div>
      <p className="text-xs text-stone-500">Simplifications: net profit = gross profit − operating expenses (tax ignored); expense ratio uses operating expenses; owners' equity is the closing balance. Figures are fictional.</p>
    </div>
  );
}

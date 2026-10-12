import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Plus, RotateCcw, X } from "lucide-react";
import { Area, CartesianGrid, ComposedChart, Legend, Line, LineChart, ReferenceArea, ReferenceDot, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis, Cell } from "recharts";
import { Button, Callout, NumberField, Segmented, Slider, Tag, Checkbox } from "../ui";
import { useChartTheme } from "./chartKit";
import { cx } from "../../lib/theme";
import { usePersistentState } from "../../state/storage";
import { formatCurrency } from "../../lib/finance";

// ---------------------------------------------------------------------------
// SWOT builder
// ---------------------------------------------------------------------------

type Quad = "S" | "W" | "O" | "T";
const QUADS: { id: Quad; label: string; kind: string; tone: string }[] = [
  { id: "S", label: "Strengths", kind: "Internal · helpful", tone: "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30" },
  { id: "W", label: "Weaknesses", kind: "Internal · harmful", tone: "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/25" },
  { id: "O", label: "Opportunities", kind: "External · helpful", tone: "border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30" },
  { id: "T", label: "Threats", kind: "External · harmful", tone: "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30" },
];

const SORT_FACTORS: { text: string; answer: Quad; why: string }[] = [
  { text: "Loyal online community of 40,000 followers", answer: "S", why: "An internal resource the business controls that helps it." },
  { text: "Products made from 100% recycled materials", answer: "S", why: "An internal product feature that differentiates the brand." },
  { text: "Higher production cost per pair than large rivals", answer: "W", why: "Internal and harmful — a cost disadvantage." },
  { text: "Only one warehouse, causing slow interstate delivery", answer: "W", why: "Internal operations limitation." },
  { text: "Growing consumer demand for sustainable fashion", answer: "O", why: "External market trend that favours the business." },
  { text: "Government grants for sustainable manufacturers", answer: "O", why: "External government factor the business can use." },
  { text: "A large international brand launches a cheaper recycled sneaker", answer: "T", why: "External competitor action that could harm sales." },
  { text: "Rising interest rates reducing discretionary spending", answer: "T", why: "External economic factor affecting customer choice." },
];

export function SwotBuilder() {
  const [mode, setMode] = useState<"sort" | "build">("sort");
  const [placed, setPlaced] = useState<Record<number, Quad>>({});
  const [checked, setChecked] = useState(false);
  const [own, setOwn] = usePersistentState<Record<Quad, string[]>>("swot:own", { S: [], W: [], O: [], T: [] });
  const [draft, setDraft] = useState<Record<Quad, string>>({ S: "", W: "", O: "", T: "" });
  const [business, setBusiness] = usePersistentState<string>("swot:business", "");

  const score = Object.entries(placed).filter(([i, q]) => SORT_FACTORS[Number(i)].answer === q).length;

  const add = (q: Quad) => {
    const v = draft[q].trim();
    if (!v) return;
    setOwn((o) => ({ ...o, [q]: [...o[q], v] }));
    setDraft((d) => ({ ...d, [q]: "" }));
  };

  const prompts: string[] = [];
  if (own.S[0] && own.O[0]) prompts.push(`SO (use strengths to exploit opportunities): How can "${own.S[0]}" help the business take advantage of "${own.O[0]}"?`);
  if (own.W[0] && own.O[0]) prompts.push(`WO (overcome weaknesses using opportunities): Could "${own.O[0]}" help fix "${own.W[0]}"?`);
  if (own.S[0] && own.T[0]) prompts.push(`ST (use strengths to reduce threats): How can "${own.S[0]}" protect against "${own.T[0]}"?`);
  if (own.W[0] && own.T[0]) prompts.push(`WT (minimise weaknesses and avoid threats): What defensive strategy reduces "${own.W[0]}" so "${own.T[0]}" does less damage?`);

  return (
    <div>
      <Segmented label="SWOT mode" value={mode} onChange={setMode} size="sm" options={[{ value: "sort", label: "Sort the factors (GreenStep scenario)" }, { value: "build", label: "Build your own SWOT" }]} />
      {mode === "sort" ? (
        <div className="mt-4">
          <p className="text-sm text-stone-600 dark:text-stone-400">GreenStep is a fictional Australian sneaker brand. Assign each factor to the correct quadrant, then check your answers.</p>
          <ul className="mt-3 space-y-2">
            {SORT_FACTORS.map((f, i) => {
              const p = placed[i];
              const correct = checked && p === f.answer;
              const wrong = checked && p && p !== f.answer;
              return (
                <li key={f.text} className={cx("rounded-xl border p-2.5", correct ? "border-emerald-400" : wrong ? "border-red-400" : "border-stone-200 dark:border-stone-800")}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm">{f.text}</span>
                    <div className="flex gap-1" role="radiogroup" aria-label={`Quadrant for: ${f.text}`}>
                      {QUADS.map((q) => (
                        <button
                          key={q.id}
                          type="button"
                          role="radio"
                          aria-checked={p === q.id}
                          onClick={() => {
                            setPlaced((x) => ({ ...x, [i]: q.id }));
                            setChecked(false);
                          }}
                          className={cx("h-8 w-8 rounded-lg border text-sm font-bold", p === q.id ? "border-bronze-600 bg-bronze-600 text-white" : "border-stone-300 text-stone-600 hover:border-stone-500 dark:border-stone-700 dark:text-stone-300")}
                          title={q.label}
                        >
                          {q.id}
                        </button>
                      ))}
                    </div>
                  </div>
                  {checked && p && (
                    <p className={cx("mt-1 text-xs", correct ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400")}>
                      {correct ? "Correct — " : `Not quite — this is a ${QUADS.find((q) => q.id === f.answer)!.label.slice(0, -1).toLowerCase()}. `}
                      {f.why}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="mt-3 flex items-center gap-3">
            <Button onClick={() => setChecked(true)} disabled={Object.keys(placed).length === 0}>
              Check answers
            </Button>
            <Button variant="ghost" onClick={() => { setPlaced({}); setChecked(false); }}>
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
            {checked && (
              <span className="text-sm font-semibold">
                {score}/{SORT_FACTORS.length} correct
              </span>
            )}
          </div>
          <p className="mt-3 text-xs text-stone-500">Remember: S and W are INTERNAL (within the business's control); O and T are EXTERNAL.</p>
        </div>
      ) : (
        <div className="mt-4">
          <label className="block max-w-md text-sm">
            <span className="mb-1 block text-xs font-semibold text-stone-600 dark:text-stone-400">Business being analysed</span>
            <input value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="e.g. a local café or a case study business" className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-night-3" />
          </label>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {QUADS.map((q) => (
              <div key={q.id} className={cx("rounded-2xl border-2 p-3", q.tone)}>
                <p className="font-semibold">{q.label}</p>
                <p className="text-[11px] text-stone-500">{q.kind}</p>
                <ul className="mt-2 space-y-1">
                  {own[q.id].map((item, i) => (
                    <li key={i} className="flex items-start justify-between gap-2 rounded-lg bg-white/80 px-2 py-1 text-sm dark:bg-night-2">
                      {item}
                      <button type="button" onClick={() => setOwn((o) => ({ ...o, [q.id]: o[q.id].filter((_, j) => j !== i) }))} aria-label={`Remove ${item}`} className="text-stone-400 hover:text-red-600">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex gap-1">
                  <input
                    value={draft[q.id]}
                    onChange={(e) => setDraft((d) => ({ ...d, [q.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && add(q.id)}
                    placeholder={`Add a ${q.label.slice(0, -1).toLowerCase()}…`}
                    aria-label={`Add to ${q.label}`}
                    className="min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-2 py-1 text-sm dark:border-stone-700 dark:bg-night-3"
                  />
                  <button type="button" onClick={() => add(q.id)} className="rounded-lg bg-stone-800 px-2 text-white dark:bg-stone-200 dark:text-night" aria-label={`Add to ${q.label}`}>
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {prompts.length > 0 ? (
            <Callout tone="exam" title="Strategy prompts (TOWS matching)">
              <ul className="space-y-1">
                {prompts.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
            </Callout>
          ) : (
            <p className="mt-3 text-sm text-stone-500">Add at least one item to two quadrants to generate strategy prompts.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Product life cycle
// ---------------------------------------------------------------------------

const PLC_STAGES = [
  {
    id: "intro",
    label: "Introduction",
    range: [0, 3],
    traits: ["Low sales, slow growth", "High costs per unit; usually losses", "Few or no competitors", "Aim: build awareness and trial"],
    mix: { Product: "Basic version; establish brand", Price: "Skimming or penetration", Promotion: "Informative — build awareness; heavy spending", Place: "Selective/limited distribution" },
  },
  {
    id: "growth",
    label: "Growth",
    range: [3, 7],
    traits: ["Rapid sales growth", "Profits begin and rise", "Competitors enter", "Aim: maximise market share"],
    mix: { Product: "Improve features, add variations", Price: "Maintain or lower slightly to compete", Promotion: "Persuasive — build preference", Place: "Expand distribution (more intensive)" },
  },
  {
    id: "maturity",
    label: "Maturity",
    range: [7, 12],
    traits: ["Sales peak and level off", "Profits peak then start to fall", "Intense competition; market saturated", "Aim: defend share, extend the cycle"],
    mix: { Product: "Differentiate; extension strategies (new uses, new markets, repackaging)", Price: "Competitive pricing; price points", Promotion: "Reminder advertising; sales promotions", Place: "Intensive distribution" },
  },
  {
    id: "decline",
    label: "Decline",
    range: [12, 16],
    traits: ["Sales and profits fall", "Competitors exit", "Aim: reduce costs, harvest or withdraw"],
    mix: { Product: "Reduce range; consider withdrawal", Price: "Cut prices to clear stock", Promotion: "Minimal", Place: "Selective — drop unprofitable outlets" },
  },
];

function plcSales(t: number) {
  return 100 / (1 + Math.exp(-(t - 5.5) / 1.2)) * Math.exp(-(Math.max(0, t - 10) ** 2) / 18);
}

export function PlcChart() {
  const ch = useChartTheme();
  const [stage, setStage] = useState("intro");
  const [extend, setExtend] = useState(false);
  const data = useMemo(
    () =>
      Array.from({ length: 33 }, (_, i) => {
        const t = i / 2;
        const sales = plcSales(t);
        const ext = t > 10 ? sales + 35 * (1 - Math.exp(-(t - 10) / 1.5)) * Math.exp(-(Math.max(0, t - 13) ** 2) / 10) : sales;
        const profit = sales * 0.55 - 18 + (t > 6 ? 6 : t);
        return { t, Sales: Math.round(sales), Profit: Math.round(Math.max(-25, profit)), ...(extend ? { "Sales with extension strategy": Math.round(ext) } : {}) };
      }),
    [extend],
  );
  const s = PLC_STAGES.find((x) => x.id === stage)!;
  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <div className="h-72">
          <ResponsiveContainer>
            <ComposedChart data={data} margin={{ top: 10, right: 16, left: -10, bottom: 10 }}>
              <CartesianGrid {...ch.gridProps} />
              {PLC_STAGES.map((p) => (
                <ReferenceArea key={p.id} x1={p.range[0]} x2={p.range[1]} fill={p.id === stage ? ch.bronze : "transparent"} fillOpacity={p.id === stage ? 0.12 : 0} label={{ value: p.label, position: "insideTop", fill: ch.axis, fontSize: 11 }} />
              ))}
              <XAxis dataKey="t" type="number" domain={[0, 16]} {...ch.axisProps} tick={false} label={{ value: "Time →", position: "insideBottomRight", fill: ch.axis, fontSize: 12 }} />
              <YAxis {...ch.axisProps} tick={false} label={{ value: "Sales / profit ($)", angle: -90, position: "insideLeft", fill: ch.axis, fontSize: 12, dx: 20 }} />
              <ReferenceLine y={0} stroke={ch.axis} />
              <Tooltip {...ch.tooltipProps} labelFormatter={() => ""} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="Sales" stroke={ch.series[0]} fill={ch.series[0]} fillOpacity={0.12} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Profit" stroke={ch.series[2]} strokeWidth={2} dot={false} />
              {extend && <Line type="monotone" dataKey="Sales with extension strategy" stroke={ch.series[3]} strokeWidth={2} strokeDasharray="6 4" dot={false} />}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Segmented label="PLC stage" size="sm" value={stage} onChange={setStage} options={PLC_STAGES.map((p) => ({ value: p.id, label: p.label }))} />
          <Checkbox checked={extend} onChange={setExtend} label="Show an extension strategy" />
        </div>
        <p className="mt-1 text-xs text-stone-500">Stylised curve for teaching — real products vary in the length and shape of each stage.</p>
      </div>
      <motion.div key={stage} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-stone-200 p-4 dark:border-stone-800">
        <p className="font-display text-lg font-semibold">{s.label}</p>
        <ul className="mt-2 space-y-1 text-sm text-stone-700 dark:text-stone-300">
          {s.traits.map((t) => (
            <li key={t}>• {t}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs font-semibold text-stone-500 uppercase">Typical marketing mix</p>
        <dl className="mt-1 space-y-1 text-sm">
          {Object.entries(s.mix).map(([k, v]) => (
            <div key={k}>
              <dt className="inline font-semibold">{k}: </dt>
              <dd className="inline text-stone-700 dark:text-stone-300">{v}</dd>
            </div>
          ))}
        </dl>
        {extend && <p className="mt-3 rounded-lg bg-violet-50 p-2 text-xs text-violet-900 dark:bg-violet-950/40 dark:text-violet-100">Extension strategies (e.g. new markets, new uses, updated packaging — like Coca-Cola's 'Share a Coke') can delay decline.</p>}
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Marketing objectives dashboard
// ---------------------------------------------------------------------------

interface Obj {
  id: string;
  name: string;
  unit: "%" | "$" | "score";
  target: number;
  actual: number;
}

export function ObjectivesDashboard() {
  const [objs, setObjs] = usePersistentState<Obj[]>("mkt:objectives", [
    { id: "share", name: "Market share", unit: "%", target: 15, actual: 13.2 },
    { id: "sales", name: "Sales revenue", unit: "$", target: 2_400_000, actual: 2_520_000 },
    { id: "csat", name: "Customer satisfaction (survey score / 10)", unit: "score", target: 8.5, actual: 7.6 },
    { id: "aware", name: "Brand awareness in target market", unit: "%", target: 40, actual: 31 },
  ]);
  const fmt = (o: Obj, v: number) => (o.unit === "$" ? formatCurrency(v) : o.unit === "%" ? `${v}%` : `${v}`);
  const update = (i: number, patch: Partial<Obj>) => setObjs((x) => x.map((o, j) => (j === i ? { ...o, ...patch } : o)));
  const actions: Record<string, string> = {
    share: "Consider penetration pricing, wider (more intensive) distribution or stronger differentiation against competitors.",
    sales: "Review the promotion mix and pricing; analyse which products and regions are under-performing (sales analysis).",
    csat: "Investigate service processes and people (training); use relationship marketing and act on feedback.",
    aware: "Increase reach through advertising or e-marketing; use opinion leaders; check the message suits the target market.",
  };
  return (
    <div className="space-y-3">
      {objs.map((o, i) => {
        const pct = o.target ? (o.actual / o.target) * 100 : 0;
        const status = pct >= 100 ? "Achieved" : pct >= 90 ? "Close" : "Behind";
        return (
          <div key={o.id} className="rounded-xl border border-stone-200 p-3 dark:border-stone-800">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{o.name}</p>
              <Tag tone={status === "Achieved" ? "good" : status === "Close" ? "warn" : "bad"}>
                {status} · {Math.round(pct)}% of target
              </Tag>
            </div>
            <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_1fr_2fr]">
              <NumberField label="Target" value={o.target} step={o.unit === "$" ? 10000 : 0.1} onChange={(v) => update(i, { target: v })} prefix={o.unit === "$" ? "$" : undefined} suffix={o.unit === "%" ? "%" : undefined} />
              <NumberField label="Actual" value={o.actual} step={o.unit === "$" ? 10000 : 0.1} onChange={(v) => update(i, { actual: v })} prefix={o.unit === "$" ? "$" : undefined} suffix={o.unit === "%" ? "%" : undefined} />
              <div>
                <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
                  <div className={cx("h-full rounded-full transition-all", status === "Achieved" ? "bg-emerald-500" : status === "Close" ? "bg-amber-500" : "bg-red-500")} style={{ width: `${Math.min(100, pct)}%` }} />
                </div>
                <p className="mt-1 text-xs text-stone-500">
                  Variance: {o.actual - o.target >= 0 ? "+" : "−"}
                  {fmt(o, Math.abs(Math.round((o.actual - o.target) * 100) / 100))}
                </p>
              </div>
            </div>
            {status !== "Achieved" && <p className="mt-2 text-sm text-stone-700 dark:text-stone-300">Revise: {actions[o.id]}</p>}
          </div>
        );
      })}
      <p className="text-xs text-stone-500">Comparing actual with planned results — and revising the strategy — is the 'monitoring and controlling' stage of the marketing process. Figures are fictional; edit them to explore.</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Segmentation
// ---------------------------------------------------------------------------

const SEG_BASES: Record<string, { label: string; segments: { name: string; share: number; note: string }[] }> = {
  demographic: {
    label: "Demographic",
    segments: [
      { name: "Students 16–24", share: 22, note: "Price-sensitive; respond to social media and student discounts." },
      { name: "Young professionals 25–39", share: 34, note: "Value convenience and quality; mobile ordering." },
      { name: "Families 35–54", share: 28, note: "Value-for-money bundles; weekend visits." },
      { name: "Retirees 65+", share: 16, note: "Value service and comfort; loyalty programs." },
    ],
  },
  geographic: {
    label: "Geographic",
    segments: [
      { name: "CBD workers", share: 38, note: "High volume, weekday peaks; speed matters (visibility, variation)." },
      { name: "Suburban centres", share: 34, note: "Families and weekend trade; parking and space." },
      { name: "Regional towns", share: 18, note: "Fewer competitors; community relationships." },
      { name: "Tourist areas", share: 10, note: "Seasonal demand; premium pricing possible." },
    ],
  },
  psychographic: {
    label: "Psychographic",
    segments: [
      { name: "Health-conscious", share: 26, note: "Plant-based milks, low sugar; wellness messaging." },
      { name: "Eco-conscious", share: 19, note: "Reusable cups, ethical sourcing (CSR)." },
      { name: "Coffee connoisseurs", share: 15, note: "Specialty beans; premium prices accepted." },
      { name: "Convenience-seekers", share: 40, note: "Fast service, drive-through, apps." },
    ],
  },
  behavioural: {
    label: "Behavioural",
    segments: [
      { name: "Daily regulars", share: 30, note: "High usage rate — loyalty programs (relationship marketing)." },
      { name: "Weekly visitors", share: 35, note: "Respond to promotions to increase frequency." },
      { name: "Occasional / special occasion", share: 25, note: "Influenced by atmosphere and physical evidence." },
      { name: "First-time triers", share: 10, note: "Need trial incentives and good first impressions." },
    ],
  },
};

export function Segmentation() {
  const [base, setBase] = useState("demographic");
  const [sel, setSel] = useState(0);
  const segs = SEG_BASES[base].segments;
  const ch = useChartTheme();
  return (
    <div>
      <p className="text-sm text-stone-600 dark:text-stone-400">Total market: coffee buyers in an Australian city (illustrative shares).</p>
      <div className="mt-2">
        <Segmented label="Segmentation base" size="sm" value={base} onChange={(b) => { setBase(b); setSel(0); }} options={Object.entries(SEG_BASES).map(([k, v]) => ({ value: k, label: v.label }))} />
      </div>
      <div className="mt-4 flex h-24 overflow-hidden rounded-2xl" role="group" aria-label="Market segments">
        {segs.map((s, i) => (
          <motion.button
            layout
            key={base + s.name}
            type="button"
            onClick={() => setSel(i)}
            aria-pressed={sel === i}
            style={{ width: `${s.share}%`, background: ch.series[i % 4] }}
            className={cx("flex flex-col items-center justify-center border-r-2 border-white px-1 text-center text-white last:border-r-0 dark:border-night-2", sel === i ? "brightness-110" : "opacity-80 hover:opacity-100")}
          >
            <span className="text-xs leading-tight font-semibold">{s.name}</span>
            <span className="text-[11px]">{s.share}%</span>
          </motion.button>
        ))}
      </div>
      <div className="mt-3 rounded-xl bg-stone-50 p-3 text-sm dark:bg-night-3" aria-live="polite">
        <p className="font-semibold">{segs[sel].name}</p>
        <p className="text-stone-700 dark:text-stone-300">{segs[sel].note}</p>
      </div>
      <p className="mt-2 text-xs text-stone-500">Segmentation → choose a target segment → differentiate the product → position it.</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Positioning (perceptual) map
// ---------------------------------------------------------------------------

const BRANDS = [
  { name: "Summit (premium)", price: 9, quality: 9, mix: "Premium materials, exclusive retailers, skimming price, lifestyle advertising.", z: 1 },
  { name: "Everyday Value", price: 2, quality: 4, mix: "Penetration price, intensive distribution in supermarkets, sales promotions.", z: 1 },
  { name: "EcoLeaf", price: 6.5, quality: 7, mix: "Recycled materials, selective eco retailers, influencer marketing, mid-high price.", z: 1 },
  { name: "BudgetMax", price: 1.5, quality: 2, mix: "Lowest price, discount outlets, minimal promotion.", z: 1 },
  { name: "Mid-market Co.", price: 5, quality: 5, mix: "Competition-based pricing; risks being 'stuck in the middle' without clear differentiation.", z: 1 },
];

export function PositioningMap() {
  const ch = useChartTheme();
  const [sel, setSel] = useState(BRANDS[0].name);
  const b = BRANDS.find((x) => x.name === sel)!;
  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="h-80">
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid {...ch.gridProps} vertical />
            <XAxis type="number" dataKey="price" domain={[0, 10]} {...ch.axisProps} tick={false} label={{ value: "Price →", position: "insideBottom", offset: -5, fill: ch.axis, fontSize: 12 }} />
            <YAxis type="number" dataKey="quality" domain={[0, 10]} {...ch.axisProps} tick={false} label={{ value: "Perceived quality →", angle: -90, position: "insideLeft", fill: ch.axis, fontSize: 12, dx: 15, dy: 50 }} />
            <ZAxis dataKey="z" range={[220, 220]} />
            <ReferenceLine x={5} stroke={ch.muted} />
            <ReferenceLine y={5} stroke={ch.muted} />
            <Tooltip {...ch.tooltipProps} formatter={(_v, _n, p) => [p.payload.name, "Brand"]} />
            <Scatter data={BRANDS} onClick={(d: { name?: string }) => d.name && setSel(d.name)}>
              {BRANDS.map((x) => (
                <Cell key={x.name} fill={x.name === sel ? ch.bronze : ch.series[1]} stroke={ch.isDark ? "#1c1916" : "#fff"} strokeWidth={2} cursor="pointer" />
              ))}
            </Scatter>
            {BRANDS.map((x) => (
              <ReferenceDot key={x.name} x={x.price} y={x.quality} r={0} label={{ value: x.name, position: "top", offset: 14, fill: ch.text, fontSize: 11 }} />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div>
        <div className="flex flex-wrap gap-1.5">
          {BRANDS.map((x) => (
            <button key={x.name} type="button" onClick={() => setSel(x.name)} aria-pressed={sel === x.name} className={cx("rounded-lg border px-2 py-1 text-xs", sel === x.name ? "border-bronze-500 bg-bronze-50 dark:bg-bronze-900/40" : "border-stone-200 dark:border-stone-700")}>
              {x.name}
            </button>
          ))}
        </div>
        <div className="mt-3 rounded-xl bg-stone-50 p-3 text-sm dark:bg-night-3">
          <p className="font-semibold">{b.name}</p>
          <p className="text-stone-700 dark:text-stone-300">{b.mix}</p>
        </div>
        <p className="mt-2 text-xs text-stone-500">Fictional drink-bottle brands. A perceptual map shows how customers see brands relative to each other; gaps can reveal positioning opportunities.</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Marketing mix explorer (7 Ps)
// ---------------------------------------------------------------------------

const PS: { id: string; name: string; question: string; decisions: string[]; premium: string; value: string }[] = [
  { id: "product", name: "Product", question: "What are we selling?", decisions: ["Goods and/or services", "Branding", "Packaging", "Features and quality", "Warranty"], premium: "High-quality materials, strong brand, elegant packaging", value: "Functional design, private label, simple packaging" },
  { id: "price", name: "Price", question: "What will customers pay?", decisions: ["Pricing method: cost, market, competition", "Strategy: skimming, penetration, loss leader, price points", "Price–quality interaction"], premium: "Skimming / premium price signals quality", value: "Penetration or competition-based low price" },
  { id: "promotion", name: "Promotion", question: "How will we communicate?", decisions: ["Advertising", "Personal selling and relationship marketing", "Sales promotions", "Publicity and public relations", "Opinion leaders and word of mouth"], premium: "Lifestyle advertising, influencers, personal selling", value: "Sales promotions, catalogues, price-focused ads" },
  { id: "place", name: "Place", question: "How will customers get it?", decisions: ["Distribution channels", "Intensive / selective / exclusive", "Transport, warehousing, inventory"], premium: "Exclusive or selective outlets", value: "Intensive distribution — everywhere" },
  { id: "people", name: "People", question: "Who delivers the service?", decisions: ["Recruitment and training of staff", "Staff presentation and attitude", "Customer interaction"], premium: "Highly trained, knowledgeable staff", value: "Efficient, friendly self-service support" },
  { id: "processes", name: "Processes", question: "How is the service delivered?", decisions: ["Ordering and payment systems", "Waiting times", "Returns and complaints handling"], premium: "Personalised, concierge-style service", value: "Fast, standardised, self-service processes" },
  { id: "evidence", name: "Physical evidence", question: "What tangible cues show quality?", decisions: ["Premises and décor", "Uniforms", "Website and app", "Brochures, receipts"], premium: "Elegant stores, high-end website", value: "Clean, simple, functional stores" },
];

export function MarketingMix() {
  const [sel, setSel] = useState("product");
  const [pos, setPos] = useState<"premium" | "value">("premium");
  const p = PS.find((x) => x.id === sel)!;
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
        {PS.map((x, i) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setSel(x.id)}
            aria-pressed={sel === x.id}
            className={cx("rounded-2xl border-2 p-3 text-left transition-colors", sel === x.id ? "border-violet-500 bg-violet-50 dark:bg-violet-950/40" : "border-stone-200 hover:border-violet-300 dark:border-stone-800")}
          >
            <span className="text-[11px] font-semibold text-stone-400">{i < 4 ? "4 Ps" : "Extended (services)"}</span>
            <span className="block font-display text-lg font-semibold">{x.name}</span>
            <span className="block text-xs text-stone-500">{x.question}</span>
          </button>
        ))}
      </div>
      <motion.div key={sel + pos} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-stone-200 p-4 dark:border-stone-800">
        <p className="font-display text-xl font-semibold">{p.name}</p>
        <p className="mt-2 text-xs font-semibold text-stone-500 uppercase">Key decisions</p>
        <ul className="mt-1 space-y-1 text-sm">
          {p.decisions.map((d) => (
            <li key={d}>• {d}</li>
          ))}
        </ul>
        <div className="mt-4">
          <Segmented label="Positioning" size="sm" value={pos} onChange={setPos} options={[{ value: "premium", label: "Premium positioning" }, { value: "value", label: "Value positioning" }]} />
        </div>
        <p className="mt-3 rounded-xl bg-violet-50 p-3 text-sm text-violet-950 dark:bg-violet-950/40 dark:text-violet-100">
          <span className="font-semibold">{p.name} for a {pos} position: </span>
          {pos === "premium" ? p.premium : p.value}
        </p>
        <p className="mt-3 text-xs text-stone-500">Consistency matters: every P must support the same position. A premium product sold at penetration prices in discount outlets sends mixed signals.</p>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pricing strategies comparison
// ---------------------------------------------------------------------------

export function PricingStrategies() {
  const ch = useChartTheme();
  const [show, setShow] = useState<Record<string, boolean>>({ Skimming: true, Penetration: true, "Competition-based": true, "Loss leader": false });
  const data = Array.from({ length: 13 }, (_, m) => ({
    month: m,
    Skimming: Math.round(120 * Math.exp(-m / 6) + 55),
    Penetration: Math.round(m < 6 ? 55 : 55 + (m - 6) * 3.5),
    "Competition-based": 80 + (m % 4 === 0 ? -3 : 0),
    "Loss leader": 40,
  }));
  const keys = Object.keys(show);
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {keys.map((k) => (
          <Checkbox key={k} checked={show[k]} onChange={(v) => setShow((s) => ({ ...s, [k]: v }))} label={k} />
        ))}
      </div>
      <div className="mt-3 h-64">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 10 }}>
            <CartesianGrid {...ch.gridProps} />
            <XAxis dataKey="month" {...ch.axisProps} label={{ value: "Months after launch", position: "insideBottom", offset: -4, fill: ch.axis, fontSize: 12 }} />
            <YAxis {...ch.axisProps} tickFormatter={(v) => `$${v}`} />
            <ReferenceLine y={60} stroke={ch.muted} strokeDasharray="4 4" label={{ value: "Unit cost $60", fill: ch.axis, fontSize: 11, position: "insideTopRight" }} />
            <Tooltip {...ch.tooltipProps} formatter={(v: number) => `$${v}`} labelFormatter={(l) => `Month ${l}`} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {keys.map((k, i) => show[k] && <Line key={k} type="monotone" dataKey={k} stroke={ch.series[i]} strokeWidth={2} dot={false} />)}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <p><span className="font-semibold">Skimming:</span> starts high to target early adopters and recover R&D, then falls as competitors enter.</p>
        <p><span className="font-semibold">Penetration:</span> starts low (below cost here) to win share, then rises once customers are established.</p>
        <p><span className="font-semibold">Competition-based:</span> tracks rivals' prices; differentiation must come from other Ps.</p>
        <p><span className="font-semibold">Loss leader:</span> priced below cost to attract customers who buy other, profitable items.</p>
      </div>
      <p className="mt-2 text-xs text-stone-500">Illustrative price paths for a fictional product.</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Promotion mix
// ---------------------------------------------------------------------------

const PROMO = [
  { name: "Advertising", reach: 5, cost: 2, control: 5, cred: 2, note: "Paid, non-personal. Wide reach; message fully controlled; easily ignored." },
  { name: "Personal selling", reach: 1, cost: 5, control: 4, cred: 3, note: "Two-way and persuasive; best for complex or expensive products; costly per customer." },
  { name: "Relationship marketing", reach: 2, cost: 3, control: 4, cred: 4, note: "Builds loyalty and repeat purchase (loyalty programs, personalised offers)." },
  { name: "Sales promotions", reach: 4, cost: 3, control: 4, cred: 2, note: "Short-term incentives boost sales quickly; overuse cheapens the brand." },
  { name: "Publicity", reach: 4, cost: 1, control: 1, cred: 5, note: "Unpaid media coverage — credible but uncontrollable (can be negative)." },
  { name: "Public relations", reach: 3, cost: 2, control: 3, cred: 4, note: "Builds long-term reputation; sponsorship, media releases, crisis management." },
  { name: "Opinion leaders / influencers", reach: 4, cost: 3, control: 3, cred: 4, note: "Two-step flow of communication; must disclose paid endorsements." },
  { name: "Word of mouth", reach: 3, cost: 1, control: 1, cred: 5, note: "Most credible and free; amplified by online reviews; uncontrollable." },
];

export function PromotionMix() {
  const [sel, setSel] = useState(0);
  const p = PROMO[sel];
  const dots = (n: number) => (
    <span className="inline-flex gap-0.5" aria-label={`${n} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={cx("h-2 w-2 rounded-full", i <= n ? "bg-violet-600 dark:bg-violet-400" : "bg-stone-200 dark:bg-stone-700")} />
      ))}
    </span>
  );
  return (
    <div>
      <div className="scroll-thin overflow-x-auto">
        <table className="w-full min-w-[540px] text-sm">
          <thead>
            <tr className="text-left text-xs text-stone-500">
              <th className="py-1.5 font-semibold">Method</th>
              <th className="py-1.5 font-semibold">Reach</th>
              <th className="py-1.5 font-semibold">Cost per contact</th>
              <th className="py-1.5 font-semibold">Control of message</th>
              <th className="py-1.5 font-semibold">Credibility</th>
            </tr>
          </thead>
          <tbody>
            {PROMO.map((x, i) => (
              <tr key={x.name} onClick={() => setSel(i)} className={cx("cursor-pointer border-t border-stone-100 dark:border-stone-800", sel === i && "bg-violet-50 dark:bg-violet-950/30")}>
                <td className="py-2 pr-2">
                  <button type="button" onClick={() => setSel(i)} className="text-left font-medium" aria-pressed={sel === i}>
                    {x.name}
                  </button>
                </td>
                <td>{dots(x.reach)}</td>
                <td>{dots(x.cost)}</td>
                <td>{dots(x.control)}</td>
                <td>{dots(x.cred)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 rounded-xl bg-stone-50 p-3 text-sm dark:bg-night-3" aria-live="polite">
        <p className="font-semibold">{p.name}</p>
        <p className="text-stone-700 dark:text-stone-300">{p.note}</p>
      </div>
      <p className="mt-2 text-xs text-stone-500">Relative ratings (1–5) are a teaching guide, not measured data. Businesses combine methods into a promotion mix suited to the target market and budget.</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Distribution channels
// ---------------------------------------------------------------------------

const CHANNELS = [
  { id: "direct", label: "Direct", chain: ["Producer", "Consumer"], note: "Online store, farm gate, factory outlet. Highest margin and control; limited reach." },
  { id: "retail", label: "Via retailer", chain: ["Producer", "Retailer", "Consumer"], note: "Common for large retailers buying direct (e.g. supermarkets). Wider reach; retailer takes a margin." },
  { id: "wholesale", label: "Via wholesaler", chain: ["Producer", "Wholesaler", "Retailer", "Consumer"], note: "Reaches many small retailers; lowest producer margin and control." },
  { id: "agent", label: "Via agent", chain: ["Producer", "Agent", "Wholesaler/Retailer", "Consumer"], note: "Agents arrange sales (often in export markets) for commission without owning the goods." },
];

export function DistributionChannels() {
  const [ch, setCh] = useState("retail");
  const [intensity, setIntensity] = useState<"intensive" | "selective" | "exclusive">("selective");
  const c = CHANNELS.find((x) => x.id === ch)!;
  const coverage = { intensive: 0.9, selective: 0.4, exclusive: 0.1 }[intensity];
  const dots = Array.from({ length: 60 }, (_, i) => ((i * 37) % 60) / 60 < coverage);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <Segmented label="Channel" size="sm" value={ch} onChange={setCh} options={CHANNELS.map((x) => ({ value: x.id, label: x.label }))} />
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {c.chain.map((n, i) => (
            <span key={n + i} className="flex items-center gap-2">
              <motion.span initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.08 }} className="rounded-xl border-2 border-violet-400 bg-violet-50 px-3 py-2 text-sm font-semibold dark:bg-violet-950/40">
                {n}
              </motion.span>
              {i < c.chain.length - 1 && <span className="text-stone-400">→</span>}
            </span>
          ))}
        </div>
        <p className="mt-3 text-sm text-stone-700 dark:text-stone-300">{c.note}</p>
        <p className="mt-2 text-xs text-stone-500">Each intermediary adds reach and services (storage, selling, delivery) but takes a share of the final price.</p>
      </div>
      <div>
        <Segmented label="Intensity of distribution" size="sm" value={intensity} onChange={setIntensity} options={[{ value: "intensive", label: "Intensive" }, { value: "selective", label: "Selective" }, { value: "exclusive", label: "Exclusive" }]} />
        <div className="mt-3 grid grid-cols-12 gap-1.5 rounded-xl border border-stone-200 p-3 dark:border-stone-800" aria-label={`About ${Math.round(coverage * 100)}% of possible outlets stock the product`} role="img">
          {dots.map((on, i) => (
            <span key={i} className={cx("aspect-square rounded-full transition-colors", on ? "bg-violet-600 dark:bg-violet-400" : "bg-stone-200 dark:bg-stone-700")} />
          ))}
        </div>
        <p className="mt-2 text-sm">
          {intensity === "intensive" && "As many outlets as possible — convenience goods (soft drinks, snacks)."}
          {intensity === "selective" && "A limited number of chosen outlets — shopping goods (appliances, clothing brands)."}
          {intensity === "exclusive" && "One or very few outlets per area — prestige goods (luxury cars, designer fashion)."}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Global standardisation vs customisation
// ---------------------------------------------------------------------------

export function GlobalSlider() {
  const ch = useChartTheme();
  const [c, setC] = useState(40);
  const data = Array.from({ length: 21 }, (_, i) => {
    const x = i * 5;
    return { x, "Cost per unit (index)": Math.round(60 + 0.006 * x * x), "Local appeal (index)": Math.round(40 + 55 * (1 - Math.exp(-x / 30))) };
  });
  const cost = Math.round(60 + 0.006 * c * c);
  const appeal = Math.round(40 + 55 * (1 - Math.exp(-c / 30)));
  return (
    <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
      <div>
        <div className="h-60">
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 10, right: 16, left: -10, bottom: 10 }}>
              <CartesianGrid {...ch.gridProps} />
              <XAxis dataKey="x" type="number" domain={[0, 100]} {...ch.axisProps} tickFormatter={(v) => (v === 0 ? "Standardised" : v === 100 ? "Customised" : "")} ticks={[0, 100]} />
              <YAxis {...ch.axisProps} domain={[30, 130]} />
              <ReferenceLine x={c} stroke={ch.bronze} strokeWidth={2} />
              <Tooltip {...ch.tooltipProps} labelFormatter={(l) => `Customisation ${l}%`} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line dataKey="Cost per unit (index)" stroke={ch.series[0]} strokeWidth={2} dot={false} />
              <Line dataKey="Local appeal (index)" stroke={ch.series[1]} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <Slider label="Degree of customisation" value={c} min={0} max={100} step={5} onChange={setC} format={(v) => `${v}%`} />
      </div>
      <div className="space-y-2 text-sm">
        <p>
          Cost per unit index: <span className="font-semibold">{cost}</span> · Local appeal index: <span className="font-semibold">{appeal}</span>
        </p>
        {c <= 25 && <Callout tone="info" title="Mostly standardised">Same product, brand and promotion everywhere: economies of scale and a consistent global brand — but risk of ignoring local tastes, laws and culture.</Callout>}
        {c > 25 && c < 70 && <Callout tone="exam" title="'Think global, act local'">Standardise the brand and core product; customise selected elements (menu items, promotion, pricing). This balance is used by many global businesses.</Callout>}
        {c >= 70 && <Callout tone="warning" title="Highly customised">Strong local appeal, but higher costs and the risk of a fragmented global brand.</Callout>}
        <p className="text-xs text-stone-500">Curves are illustrative. Case studies: McDonald's (balance), Bunnings UK (under-customised).</p>
      </div>
    </div>
  );
}


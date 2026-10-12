import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowDown, Plus, Trash2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button, Callout, NumberField, Segmented, Slider, Tag, Checkbox } from "../ui";
import { FlowDiagram } from "../content/FlowDiagram";
import { ComparisonView } from "../content/Blocks";
import { useChartTheme } from "./chartKit";
import { cx } from "../../lib/theme";
import { valueInventory, annualHoldingCost, type Batch } from "../../lib/inventory";
import { formatCurrency } from "../../lib/finance";
import type { FlowSpec } from "../../content/types";

// ---------------------------------------------------------------------------
// Inputs → Transformation → Outputs explorer
// ---------------------------------------------------------------------------

interface ItoProfile {
  id: string;
  name: string;
  kind: "Manufacturing" | "Service" | "Mixed";
  transformed: { materials: string; information: string; customers: string };
  transforming: { hr: string; facilities: string };
  process: string[];
  fourV: { volume: string; variety: string; variation: string; visibility: string };
  outputs: { product: string; service: string; warranty: string };
}

const ITO: ItoProfile[] = [
  {
    id: "car",
    name: "Car assembly plant",
    kind: "Manufacturing",
    transformed: { materials: "Steel, components, paint, electronics", information: "Production schedules, orders, quality data", customers: "Not usually present in production" },
    transforming: { hr: "Assembly workers, engineers, quality staff", facilities: "Robotic assembly line, paint shop, factory" },
    process: ["Stamping and welding body panels", "Painting", "Assembly on a product (line) layout", "Inspection and testing", "Dispatch to dealers"],
    fourV: { volume: "High", variety: "Low–moderate (set models and options)", variation: "Moderate (planned production)", visibility: "Low" },
    outputs: { product: "Finished vehicles (tangible, storable)", service: "Dealer support, servicing networks", warranty: "New-car warranty covering defects for a set period" },
  },
  {
    id: "cafe",
    name: "Café",
    kind: "Mixed",
    transformed: { materials: "Coffee beans, milk, food ingredients", information: "Orders, sales data", customers: "Customers are present and served" },
    transforming: { hr: "Baristas, kitchen staff, wait staff", facilities: "Espresso machines, kitchen, seating, POS system" },
    process: ["Take order", "Prepare food and coffee to order", "Serve customer", "Clear and clean"],
    fourV: { volume: "Moderate", variety: "Moderate (menu with customisation)", variation: "High (morning and lunch peaks)", visibility: "High" },
    outputs: { product: "Food and drinks (goods)", service: "Table service, atmosphere, speed", warranty: "Consumer guarantees — remake or refund if not of acceptable quality" },
  },
  {
    id: "hospital",
    name: "Hospital",
    kind: "Service",
    transformed: { materials: "Medicines, medical supplies", information: "Patient records, test results", customers: "Patients — the main transformed resource" },
    transforming: { hr: "Doctors, nurses, allied health, administration", facilities: "Wards, operating theatres, diagnostic equipment" },
    process: ["Admission and triage", "Diagnosis", "Treatment (process layout: departments)", "Recovery and discharge"],
    fourV: { volume: "Moderate", variety: "Very high (every patient differs)", variation: "High (emergencies unpredictable)", visibility: "High" },
    outputs: { product: "Medication and equipment provided", service: "Treated patients — improved health", warranty: "Not applicable as a warranty; quality governed by clinical standards" },
  },
  {
    id: "airline",
    name: "Airline",
    kind: "Service",
    transformed: { materials: "Fuel, catering", information: "Bookings, flight plans, maintenance data", customers: "Passengers moved between locations" },
    transforming: { hr: "Pilots, cabin crew, engineers, ground staff", facilities: "Aircraft, airports, lounges, booking systems" },
    process: ["Booking and check-in", "Boarding", "Flight", "Arrival and baggage collection"],
    fourV: { volume: "High", variety: "Low–moderate (routes and classes)", variation: "High (holiday peaks)", visibility: "High" },
    outputs: { product: "In-flight food and amenities", service: "Completed flight; on-time performance; customer service", warranty: "Consumer guarantees apply to services (e.g. remedies when a service is not provided)" },
  },
  {
    id: "online",
    name: "Online retailer",
    kind: "Service",
    transformed: { materials: "Inventory purchased from suppliers", information: "Orders, payments, customer data", customers: "Interact online only" },
    transforming: { hr: "Warehouse pickers, IT staff, customer service", facilities: "Website, automated warehouse, delivery network" },
    process: ["Order received online", "Pick and pack in warehouse", "Dispatch via logistics provider", "Delivery and returns"],
    fourV: { volume: "High", variety: "High (large product range)", variation: "High (sales events)", visibility: "Low (back-office), high on the website" },
    outputs: { product: "Delivered goods", service: "Fast delivery, tracking, easy returns", warranty: "Manufacturer warranties plus consumer guarantees" },
  },
];

export function ItoExplorer() {
  const [bizId, setBizId] = useState(ITO[0].id);
  const [stage, setStage] = useState<"inputs" | "transform" | "outputs">("inputs");
  const b = ITO.find((x) => x.id === bizId)!;
  const stages = [
    { id: "inputs" as const, label: "Inputs", tone: "border-orange-300 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/40" },
    { id: "transform" as const, label: "Transformation", tone: "border-violet-300 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/40" },
    { id: "outputs" as const, label: "Outputs", tone: "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40" },
  ];
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <Segmented label="Business" value={bizId} onChange={setBizId} options={ITO.map((x) => ({ value: x.id, label: x.name }))} size="sm" />
        <Tag tone={b.kind === "Manufacturing" ? "warn" : b.kind === "Service" ? "good" : "neutral"}>{b.kind}</Tag>
      </div>
      <div className="mt-4 flex flex-col items-stretch gap-2 md:flex-row md:items-center">
        {stages.map((s, i) => (
          <div key={s.id} className="flex flex-1 flex-col items-center gap-2 md:flex-row">
            <button
              type="button"
              onClick={() => setStage(s.id)}
              aria-pressed={stage === s.id}
              className={cx("w-full flex-1 rounded-2xl border-2 p-4 text-left transition-all", s.tone, stage === s.id ? "ring-2 ring-bronze-500 ring-offset-2 ring-offset-white dark:ring-offset-night-2" : "opacity-80 hover:opacity-100")}
            >
              <p className="text-xs font-semibold tracking-wider text-stone-500 uppercase">Stage {i + 1}</p>
              <p className="font-display text-lg font-semibold text-stone-900 dark:text-stone-50">{s.label}</p>
              <p className="mt-1 line-clamp-2 text-xs text-stone-600 dark:text-stone-400">
                {s.id === "inputs" ? b.transformed.materials : s.id === "transform" ? b.process.join(" → ") : b.outputs.service}
              </p>
            </button>
            {i < 2 && (
              <>
                <ArrowRight className="hidden h-5 w-5 shrink-0 text-stone-400 md:block" />
                <ArrowDown className="h-5 w-5 shrink-0 text-stone-400 md:hidden" />
              </>
            )}
          </div>
        ))}
      </div>
      <motion.div key={bizId + stage} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border border-stone-200 p-4 dark:border-stone-800" aria-live="polite">
        {stage === "inputs" && (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-semibold text-stone-900 dark:text-stone-100">Transformed resources (changed by the process)</p>
              <dl className="space-y-2 text-sm">
                {(["materials", "information", "customers"] as const).map((k) => (
                  <div key={k} className="rounded-lg bg-stone-50 px-3 py-2 dark:bg-night-3">
                    <dt className="text-xs font-semibold text-stone-500 capitalize">{k}</dt>
                    <dd className="text-stone-800 dark:text-stone-200">{b.transformed[k]}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-stone-900 dark:text-stone-100">Transforming resources (do the transforming)</p>
              <dl className="space-y-2 text-sm">
                <div className="rounded-lg bg-stone-50 px-3 py-2 dark:bg-night-3">
                  <dt className="text-xs font-semibold text-stone-500">Human resources</dt>
                  <dd className="text-stone-800 dark:text-stone-200">{b.transforming.hr}</dd>
                </div>
                <div className="rounded-lg bg-stone-50 px-3 py-2 dark:bg-night-3">
                  <dt className="text-xs font-semibold text-stone-500">Facilities</dt>
                  <dd className="text-stone-800 dark:text-stone-200">{b.transforming.facilities}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}
        {stage === "transform" && (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-semibold text-stone-900 dark:text-stone-100">Sequence of activities</p>
              <ol className="space-y-1.5">
                {b.process.map((p, i) => (
                  <li key={p} className="flex items-center gap-2 text-sm">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet-600 text-xs font-bold text-white">{i + 1}</span>
                    {p}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-stone-900 dark:text-stone-100">Volume, variety, variation, visibility</p>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                {(Object.keys(b.fourV) as (keyof ItoProfile["fourV"])[]).map((k) => (
                  <div key={k} className="rounded-lg bg-stone-50 px-3 py-2 dark:bg-night-3">
                    <dt className="text-xs font-semibold text-stone-500 capitalize">{k}</dt>
                    <dd className="text-stone-800 dark:text-stone-200">{b.fourV[k]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}
        {stage === "outputs" && (
          <dl className="grid gap-2 text-sm md:grid-cols-3">
            <div className="rounded-lg bg-stone-50 px-3 py-2 dark:bg-night-3">
              <dt className="text-xs font-semibold text-stone-500">Goods / services produced</dt>
              <dd className="text-stone-800 dark:text-stone-200">{b.outputs.product}</dd>
            </div>
            <div className="rounded-lg bg-stone-50 px-3 py-2 dark:bg-night-3">
              <dt className="text-xs font-semibold text-stone-500">Customer service</dt>
              <dd className="text-stone-800 dark:text-stone-200">{b.outputs.service}</dd>
            </div>
            <div className="rounded-lg bg-stone-50 px-3 py-2 dark:bg-night-3">
              <dt className="text-xs font-semibold text-stone-500">Warranties</dt>
              <dd className="text-stone-800 dark:text-stone-200">{b.outputs.warranty}</dd>
            </div>
          </dl>
        )}
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Four Vs
// ---------------------------------------------------------------------------

const FOURV_EXAMPLES = [
  { name: "Soft drink bottling plant", v: [5, 1, 2, 1] },
  { name: "Fast-food restaurant", v: [5, 2, 4, 4] },
  { name: "Architect's practice", v: [1, 5, 2, 4] },
  { name: "Hospital emergency department", v: [3, 5, 5, 5] },
  { name: "Custom furniture maker", v: [1, 5, 2, 2] },
  { name: "Supermarket", v: [5, 4, 3, 4] },
];

export function FourVs() {
  const [v, setV] = useState([3, 3, 3, 3]);
  const set = (i: number) => (x: number) => setV((p) => p.map((y, j) => (j === i ? x : y)));
  const cost = 100 - (v[0] - 1) * 10 + (v[1] - 1) * 8 + (v[2] - 1) * 6 + (v[3] - 1) * 7;
  const nearest = [...FOURV_EXAMPLES].sort((a, b) => dist(a.v, v) - dist(b.v, v))[0];
  const labels = ["Volume", "Variety", "Variation in demand", "Visibility"];
  const level = (x: number) => ["Very low", "Low", "Moderate", "High", "Very high"][x - 1];
  const implications: string[] = [];
  if (v[0] >= 4) implications.push("High volume → standardisation, specialised equipment and economies of scale.");
  if (v[0] <= 2) implications.push("Low volume → general-purpose equipment, higher unit costs.");
  if (v[1] >= 4) implications.push("High variety → flexible processes and multi-skilled staff; harder to standardise.");
  if (v[2] >= 4) implications.push("High variation → capacity planning challenge: casual staff, booking systems, pricing to shift demand.");
  if (v[3] >= 4) implications.push("High visibility → staff need customer-contact skills; waiting time and presentation matter.");
  if (v[3] <= 2) implications.push("Low visibility → back-office efficiency can be prioritised over presentation.");
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        {labels.map((l, i) => (
          <Slider key={l} label={l} value={v[i]} min={1} max={5} onChange={set(i)} format={level} />
        ))}
        <Callout tone="info" title="Closest real-world example">
          {nearest.name}
        </Callout>
      </div>
      <div>
        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">Relative unit cost (illustrative index)</p>
        <div className="mt-2 flex h-40 items-end gap-3 rounded-xl border border-stone-200 p-3 dark:border-stone-800">
          <div className="flex h-full flex-1 flex-col justify-end">
            <motion.div className="rounded-t-md bg-bronze-500" animate={{ height: `${Math.min(100, (cost / 190) * 100)}%` }} transition={{ type: "spring", stiffness: 120, damping: 18 }} />
          </div>
          <div className="w-28 text-sm">
            <p className="text-3xl font-semibold tabular-nums text-stone-900 dark:text-stone-50">{cost}</p>
            <p className="text-xs text-stone-500">Baseline 100 = moderate on all four</p>
          </div>
        </div>
        <ul className="mt-3 space-y-1.5 text-sm text-stone-700 dark:text-stone-300">
          {implications.length ? implications.map((x) => <li key={x}>• {x}</li>) : <li>• Moderate on all four: a balance of efficiency and flexibility.</li>}
        </ul>
        <p className="mt-3 text-xs text-stone-500">Rule of thumb: high volume and low variety, variation and visibility → lowest unit costs.</p>
      </div>
    </div>
  );
}

function dist(a: number[], b: number[]) {
  return a.reduce((t, x, i) => t + (x - b[i]) ** 2, 0);
}

// ---------------------------------------------------------------------------
// Performance objectives radar
// ---------------------------------------------------------------------------

const PROFILES: { id: string; name: string; scores: number[]; note: string }[] = [
  { id: "cost", name: "Cost leader (e.g. discount supermarket)", scores: [3, 3, 4, 2, 1, 5], note: "Prioritises cost and dependability; limits variety and customisation." },
  { id: "premium", name: "Premium differentiator (e.g. luxury car maker)", scores: [5, 2, 4, 3, 4, 2], note: "Prioritises quality and customisation; accepts higher cost." },
  { id: "fast", name: "Fast fashion (e.g. Zara)", scores: [3, 5, 4, 5, 2, 3], note: "Prioritises speed and flexibility to respond to trends." },
  { id: "custom", name: "Bespoke service (e.g. wedding planner)", scores: [5, 2, 4, 4, 5, 1], note: "Customisation and quality are everything; cost is secondary." },
];
const OBJECTIVES = ["Quality", "Speed", "Dependability", "Flexibility", "Customisation", "Cost"];

export function PerformanceObjectives() {
  const ch = useChartTheme();
  const [a, setA] = useState("cost");
  const [b, setB] = useState("premium");
  const pa = PROFILES.find((p) => p.id === a)!;
  const pb = PROFILES.find((p) => p.id === b)!;
  const data = OBJECTIVES.map((o, i) => ({ objective: o, [pa.name]: pa.scores[i], [pb.name]: pb.scores[i] }));
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-4">
        <div>
          <p className="mb-1 text-xs font-semibold text-stone-600 dark:text-stone-400">Profile A</p>
          <Segmented size="sm" label="Profile A" value={a} onChange={setA} options={PROFILES.map((p) => ({ value: p.id, label: p.name.split(" (")[0] }))} />
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold text-stone-600 dark:text-stone-400">Profile B</p>
          <Segmented size="sm" label="Profile B" value={b} onChange={setB} options={PROFILES.map((p) => ({ value: p.id, label: p.name.split(" (")[0] }))} />
        </div>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold" style={{ color: ch.series[0] }}>■</span> <span className="font-semibold">{pa.name}:</span> {pa.note}
          </p>
          <p>
            <span className="font-semibold" style={{ color: ch.series[1] }}>■</span> <span className="font-semibold">{pb.name}:</span> {pb.note}
          </p>
        </div>
        <Callout tone="exam" title="Trade-offs">
          Improving one objective often worsens another — e.g. more customisation usually raises cost and reduces speed. Strategy determines which objectives come first. (Priority scores 1–5 are illustrative.)
        </Callout>
      </div>
      <div className="h-80">
        <ResponsiveContainer>
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke={ch.grid} />
            <PolarAngleAxis dataKey="objective" tick={{ fill: ch.text, fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 5]} tickCount={6} tick={{ fill: ch.axis, fontSize: 10 }} axisLine={false} />
            <Radar name={pa.name} dataKey={pa.name} stroke={ch.series[0]} fill={ch.series[0]} fillOpacity={0.18} strokeWidth={2} />
            {b !== a && <Radar name={pb.name} dataKey={pb.name} stroke={ch.series[1]} fill={ch.series[1]} fillOpacity={0.14} strokeWidth={2} />}
            <Tooltip {...ch.tooltipProps} />
            <Legend wrapperStyle={{ fontSize: 12, color: ch.text }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Supply chain flow
// ---------------------------------------------------------------------------

const SUPPLY_CHAIN: FlowSpec = {
  id: "supply-chain",
  title: "Supply chain",
  nodes: [
    { id: "raw", label: "Raw material suppliers", detail: "Global sourcing: buying inputs from the best-value suppliers worldwide. Risks: exchange rates, lead times, ethical standards.", col: 0, row: 0, tone: "input" },
    { id: "comp", label: "Component manufacturers", detail: "Tier-1 suppliers turn raw materials into parts. Supplier relationships (partnerships, shared forecasts) improve dependability.", col: 1, row: 0, tone: "input" },
    { id: "inbound", label: "Inbound logistics", detail: "Transport and receiving of inputs. JIT requires frequent, reliable deliveries.", col: 2, row: 0, tone: "process" },
    { id: "make", label: "Production (operations)", detail: "The transformation process. Inventory of raw materials and work-in-progress is managed here.", col: 3, row: 0, tone: "process" },
    { id: "dc", label: "Warehouse / distribution centre", detail: "Logistics: storage and sorting of finished goods; automation improves speed and accuracy.", col: 3, row: 1, tone: "process" },
    { id: "retail", label: "Retailers & online store", detail: "E-commerce: online ordering, real-time stock visibility and direct delivery to customers.", col: 2, row: 1, tone: "output" },
    { id: "customer", label: "Customer", detail: "The end of the chain. Sales data flows back up the chain to trigger replenishment (information flow).", col: 1, row: 1, tone: "output" },
    { id: "data", label: "Information flow (e-commerce data)", detail: "Electronic data sharing (orders, forecasts, sales) coordinates the whole chain and reduces the 'bullwhip' effect of over-ordering.", col: 0, row: 1, tone: "accent" },
  ],
  edges: [
    { from: "raw", to: "comp" },
    { from: "comp", to: "inbound" },
    { from: "inbound", to: "make" },
    { from: "make", to: "dc" },
    { from: "dc", to: "retail" },
    { from: "retail", to: "customer" },
    { from: "customer", to: "data", label: "sales data", dashed: true },
    { from: "data", to: "raw", label: "orders & forecasts", dashed: true },
  ],
};

export function SupplyChainFlow() {
  return <FlowDiagram flow={SUPPLY_CHAIN} />;
}

// ---------------------------------------------------------------------------
// Inventory lab: FIFO vs LIFO vs JIT
// ---------------------------------------------------------------------------

export function InventoryLab() {
  const ch = useChartTheme();
  const [tab, setTab] = useState<"valuation" | "jit" | "compare">("valuation");
  const [batches, setBatches] = useState<Batch[]>([
    { label: "Opening stock", units: 100, unitCost: 10 },
    { label: "Purchase 1", units: 100, unitCost: 12 },
    { label: "Purchase 2", units: 100, unitCost: 15 },
  ]);
  const [sold, setSold] = useState(180);
  const fifo = useMemo(() => valueInventory(batches, sold, "FIFO"), [batches, sold]);
  const lifo = useMemo(() => valueInventory(batches, sold, "LIFO"), [batches, sold]);
  const [days, setDays] = useState({ jic: 45, jit: 4 });
  const [rate, setRate] = useState(25);
  const [disruption, setDisruption] = useState(false);
  const demand = 36500;
  const unitCost = 20;
  const jicCost = annualHoldingCost({ annualDemand: demand, daysOfStock: days.jic, unitCost, holdingRate: rate / 100 });
  const jitCost = annualHoldingCost({ annualDemand: demand, daysOfStock: days.jit, unitCost, holdingRate: rate / 100 });
  const disruptionDays = 7;

  const update = (i: number, patch: Partial<Batch>) => setBatches((b) => b.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  return (
    <div>
      <Segmented
        label="Inventory lab view"
        value={tab}
        onChange={setTab}
        size="sm"
        options={[
          { value: "valuation", label: "FIFO vs LIFO calculator" },
          { value: "jit", label: "JIT vs just-in-case" },
          { value: "compare", label: "Side-by-side comparison" },
        ]}
      />
      {tab === "valuation" && (
        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-semibold">Stock purchased (oldest first)</p>
            <div className="space-y-2">
              {batches.map((b, i) => (
                <div key={i} className="grid grid-cols-[1fr_90px_100px_32px] items-end gap-2">
                  <label className="text-xs">
                    <span className="mb-1 block font-semibold text-stone-500">Batch</span>
                    <input value={b.label} onChange={(e) => update(i, { label: e.target.value })} className="w-full rounded-lg border border-stone-300 bg-white px-2 py-1.5 text-sm dark:border-stone-700 dark:bg-night-3" />
                  </label>
                  <NumberField label="Units" value={b.units} min={0} onChange={(v) => update(i, { units: Math.max(0, v) })} />
                  <NumberField label="Cost/unit" prefix="$" value={b.unitCost} min={0} step={0.5} onChange={(v) => update(i, { unitCost: Math.max(0, v) })} />
                  <button type="button" onClick={() => setBatches((x) => x.filter((_, j) => j !== i))} disabled={batches.length <= 1} className="mb-1 rounded-lg p-1.5 text-stone-400 hover:text-red-600 disabled:opacity-30" aria-label={`Remove ${b.label}`}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <Button variant="secondary" size="sm" className="mt-2" onClick={() => setBatches((b) => [...b, { label: `Purchase ${b.length}`, units: 50, unitCost: (b[b.length - 1]?.unitCost ?? 10) + 1 }])}>
              <Plus className="h-4 w-4" /> Add purchase
            </Button>
            <div className="mt-4 max-w-xs">
              <NumberField label="Units sold in the period" value={sold} min={0} onChange={(v) => setSold(Math.max(0, v))} />
            </div>
            {fifo.shortfall > 0 && <p className="mt-2 text-sm text-red-600">Only {fifo.unitsSold} units are available — {fifo.shortfall} units cannot be supplied (a stock-out).</p>}
          </div>
          <div>
            <div className="grid grid-cols-2 gap-3">
              {[fifo, lifo].map((r) => (
                <div key={r.method} className="rounded-xl border border-stone-200 p-3 dark:border-stone-800">
                  <p className="font-semibold">{r.method}</p>
                  <p className="mt-1 text-xs text-stone-500">{r.method === "FIFO" ? "Oldest units issued first" : "Newest units issued first"}</p>
                  <p className="mt-2 text-sm">
                    COGS: <span className="font-semibold tabular-nums">{formatCurrency(r.cogs)}</span>
                  </p>
                  <p className="text-sm">
                    Closing stock: <span className="font-semibold tabular-nums">{formatCurrency(r.closingValue)}</span> ({r.closingUnits} units)
                  </p>
                  <p className="mt-2 text-xs text-stone-500">Issued: {r.issued.map((l) => `${l.units} × $${l.unitCost}`).join(" + ") || "none"}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 h-52">
              <ResponsiveContainer>
                <BarChart data={[{ name: "FIFO", COGS: fifo.cogs, "Closing stock": fifo.closingValue }, { name: "LIFO", COGS: lifo.cogs, "Closing stock": lifo.closingValue }]} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid {...ch.gridProps} horizontal={false} vertical />
                  <XAxis type="number" {...ch.axisProps} tickFormatter={(v) => `$${v}`} />
                  <YAxis type="category" dataKey="name" {...ch.axisProps} width={44} />
                  <Tooltip {...ch.tooltipProps} formatter={(v: number) => formatCurrency(v)} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="COGS" stackId="a" fill={ch.series[0]} stroke={ch.isDark ? "#1c1916" : "#fff"} strokeWidth={2} />
                  <Bar dataKey="Closing stock" stackId="a" fill={ch.series[1]} radius={[0, 4, 4, 0]} stroke={ch.isDark ? "#1c1916" : "#fff"} strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-stone-700 dark:text-stone-300">
              {fifo.cogs < lifo.cogs
                ? "Prices are rising, so FIFO gives a lower cost of goods sold (higher reported profit) and values closing stock at recent, higher prices."
                : fifo.cogs > lifo.cogs
                  ? "Prices are falling, so FIFO gives a higher cost of goods sold (lower reported profit)."
                  : "Costs are equal under both methods because unit costs are the same."}{" "}
              In both cases COGS + closing stock = total cost of goods available ({formatCurrency(fifo.cogs + fifo.closingValue)}).
            </p>
            <p className="mt-2 text-xs text-stone-500">Note: LIFO is in the syllabus but is not permitted for financial reporting under Australian Accounting Standard AASB 102 Inventories.</p>
          </div>
        </div>
      )}
      {tab === "jit" && (
        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-sm text-stone-600 dark:text-stone-400">A fictional manufacturer uses 100 units a day (36,500 a year) at $20 each.</p>
            <Slider label="Just-in-case: average days of stock held" value={days.jic} min={10} max={90} onChange={(x) => setDays((d) => ({ ...d, jic: x }))} format={(x) => `${x} days`} />
            <Slider label="JIT: average days of stock held" value={days.jit} min={1} max={10} onChange={(x) => setDays((d) => ({ ...d, jit: x }))} format={(x) => `${x} days`} />
            <Slider label="Annual holding cost rate (storage, insurance, obsolescence, capital)" value={rate} min={10} max={40} onChange={setRate} format={(x) => `${x}%`} />
            <Checkbox checked={disruption} onChange={setDisruption} label={`Simulate a ${disruptionDays}-day supplier disruption`} />
          </div>
          <div>
            <div className="h-52">
              <ResponsiveContainer>
                <BarChart data={[{ name: "Just-in-case", cost: Math.round(jicCost) }, { name: "JIT", cost: Math.round(jitCost) }]} margin={{ left: 10, right: 10 }}>
                  <CartesianGrid {...ch.gridProps} />
                  <XAxis dataKey="name" {...ch.axisProps} />
                  <YAxis {...ch.axisProps} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip {...ch.tooltipProps} formatter={(v: number) => [formatCurrency(v), "Annual holding cost"]} />
                  <Bar dataKey="cost" name="Annual holding cost" fill={ch.series[0]} radius={[4, 4, 0, 0]} maxBarSize={70} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm">
              JIT saves <span className="font-semibold">{formatCurrency(jicCost - jitCost)}</span> a year in holding costs and frees{" "}
              <span className="font-semibold">{formatCurrency((days.jic - days.jit) * 100 * unitCost)}</span> of working capital.
            </p>
            {disruption && (
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className={cx("rounded-xl p-3", days.jic >= disruptionDays ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-red-50 dark:bg-red-950/30")}>
                  <p className="font-semibold">Just-in-case</p>
                  <p>{days.jic >= disruptionDays ? "Buffer stock covers the disruption — production continues." : `Stock runs out after ${days.jic} days.`}</p>
                </div>
                <div className={cx("rounded-xl p-3", days.jit >= disruptionDays ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-red-50 dark:bg-red-950/30")}>
                  <p className="font-semibold">JIT</p>
                  <p>{days.jit >= disruptionDays ? "Covered." : `Production stops after ${days.jit} day${days.jit === 1 ? "" : "s"} — about ${(disruptionDays - days.jit) * 100} units of output lost.`}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {tab === "compare" && (
        <div className="mt-4">
          <ComparisonView
            topic="operations"
            table={{
              id: "inv-compare",
              title: "FIFO vs LIFO vs JIT",
              caption: "FIFO and LIFO describe which stock is used (and how it is valued); JIT is a strategy for how much stock to hold.",
              columns: ["", "FIFO", "LIFO", "JIT"],
              rows: [
                { label: "Meaning", cells: ["Oldest stock used/sold first", "Newest stock used/sold first", "Inputs arrive just as needed; minimal stock"] },
                { label: "Best suited to", cells: ["Perishable, fashion or dated goods", "Non-perishable bulk stock (e.g. sand, gravel)", "Stable demand, reliable suppliers"] },
                { label: "Effect when prices rise", cells: ["Lower COGS, higher profit; closing stock at recent prices", "Higher COGS, lower profit; closing stock at old prices", "Little stock held, so less exposure to price changes in inventory"] },
                { label: "Main advantage", cells: ["Reduces spoilage and obsolescence", "Matches recent costs to revenue", "Lower holding costs; frees cash; exposes waste"] },
                { label: "Main risk", cells: ["Reported profit may overstate when costs rise", "Old stock may deteriorate; not allowed under AASB 102", "Supply disruption halts production"] },
              ],
            }}
          />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quality management approaches
// ---------------------------------------------------------------------------

const Q_STAGES = ["Inputs & suppliers", "Production process", "Finished output", "Customer"];

export function QualityVisual() {
  const [mode, setMode] = useState<"control" | "assurance" | "improvement">("control");
  const info = {
    control: {
      title: "Quality control — detection",
      active: [2],
      text: "Inspection and testing of outputs against standards to find and remove defects before they reach customers. Waste has already occurred (scrap, rework).",
      tools: ["Inspection", "Testing samples", "Statistical process control charts"],
      cost: 70,
    },
    assurance: {
      title: "Quality assurance — prevention",
      active: [0, 1, 2],
      text: "A system that builds quality standards into every stage of the process — supplier standards, documented procedures, training — often certified externally (e.g. ISO 9001).",
      tools: ["Documented procedures", "Supplier standards", "External certification (ISO 9001)"],
      cost: 40,
    },
    improvement: {
      title: "Quality improvement — continuous",
      active: [0, 1, 2, 3],
      text: "An ongoing commitment by all employees to keep improving processes (e.g. total quality management, kaizen, benchmarking). Customer feedback drives the next improvement.",
      tools: ["Total quality management (TQM)", "Continuous improvement (kaizen)", "Benchmarking against best practice"],
      cost: 25,
    },
  }[mode];
  return (
    <div>
      <Segmented
        label="Quality approach"
        value={mode}
        onChange={setMode}
        size="sm"
        options={[
          { value: "control", label: "Control" },
          { value: "assurance", label: "Assurance" },
          { value: "improvement", label: "Improvement" },
        ]}
      />
      <div className="relative mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
        {Q_STAGES.map((s, i) => {
          const on = info.active.includes(i);
          return (
            <motion.div key={s} animate={{ opacity: on ? 1 : 0.45, y: on ? 0 : 4 }} className={cx("rounded-xl border-2 p-3 text-center text-sm font-semibold", on ? "border-bronze-500 bg-bronze-50 text-bronze-950 dark:bg-bronze-950/50 dark:text-bronze-100" : "border-stone-200 text-stone-500 dark:border-stone-800")}>
              {s}
              {on && <p className="mt-1 text-[11px] font-normal">{mode === "control" ? "Inspect here" : mode === "assurance" ? "Standards applied" : "Improve continuously"}</p>}
            </motion.div>
          );
        })}
      </div>
      {mode === "improvement" && <p className="mt-2 text-center text-xs text-stone-500">↺ Customer feedback loops back to improve inputs and processes</p>}
      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_200px]">
        <div>
          <p className="font-semibold text-stone-900 dark:text-stone-100">{info.title}</p>
          <p className="mt-1 text-sm text-stone-700 dark:text-stone-300">{info.text}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {info.tools.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-stone-500">Typical cost of poor quality (illustrative)</p>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
            <motion.div className="h-full rounded-full bg-red-500" animate={{ width: `${info.cost}%` }} />
          </div>
          <p className="mt-1 text-xs text-stone-500">Prevention usually costs less than detection and rework.</p>
        </div>
      </div>
    </div>
  );
}

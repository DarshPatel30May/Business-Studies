import { useMemo, useState, type ReactNode } from "react";
import { ChevronDown, AlertTriangle, CheckCircle2, MinusCircle, XCircle, Scale } from "lucide-react";
import { Disclaimer, Select, Slider, Tag } from "../ui";
import { cx } from "../../lib/theme";
import { usePersistentState } from "../../state/storage";
import { OPS_ASSUMPTIONS, OPS_OPTIONS, simulateOperations, type OpsDecisions } from "../../lib/sim/operations";
import { MKT_ASSUMPTIONS, simulateMarketing, type MktDecisions } from "../../lib/sim/marketing";
import { HR_ASSUMPTIONS, HR_OPTIONS, simulateHr, type HrDecisions } from "../../lib/sim/hr";
import { formatCurrency } from "../../lib/finance";

export function Assumptions({ items }: { items: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-stone-200 dark:border-stone-800">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold">
        Model assumptions (transparent and deterministic)
        <ChevronDown className={cx("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <ul className="space-y-1 px-4 pb-3 text-xs text-stone-600 dark:text-stone-400">
          {items.map((a) => (
            <li key={a}>• {a}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Metric({ label, value, base, display, better, max }: { label: string; value: number; base: number; display: string; better: "higher" | "lower"; max: number }) {
  const diff = value - base;
  const good = better === "higher" ? diff > 0 : diff < 0;
  const neutral = Math.abs(diff) < 1e-9;
  return (
    <div className="rounded-xl border border-stone-200 p-3 dark:border-stone-800">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-xs font-medium text-stone-500">{label}</p>
        {!neutral && <Tag tone={good ? "good" : "bad"}>{diff > 0 ? "▲" : "▼"} vs baseline</Tag>}
      </div>
      <p className="mt-1 text-xl font-semibold tabular-nums text-stone-900 dark:text-stone-50">{display}</p>
      <div className="relative mt-2 h-2 rounded-full bg-stone-200 dark:bg-stone-800">
        <div className={cx("absolute inset-y-0 left-0 rounded-full transition-all duration-500", neutral ? "bg-stone-400" : good ? "bg-emerald-500" : "bg-red-500")} style={{ width: `${Math.max(2, Math.min(100, (value / max) * 100))}%` }} />
        <div className="absolute -top-1 h-4 w-0.5 bg-stone-700 dark:bg-stone-300" style={{ left: `${Math.min(100, (base / max) * 100)}%` }} title="Baseline" />
      </div>
    </div>
  );
}

function SimLayout({ decisions, results, notes, risks, assumptions, disclaimer }: { decisions: ReactNode; results: ReactNode; notes: ReactNode; risks?: string[]; assumptions: string[]; disclaimer: string }) {
  return (
    <div className="space-y-4">
      <Disclaimer>{disclaimer}</Disclaimer>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div className="space-y-3">{decisions}</div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">{results}</div>
          {risks && risks.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 dark:border-amber-900 dark:bg-amber-950/30">
              <p className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-amber-900 dark:text-amber-200">
                <AlertTriangle className="h-4 w-4" /> Risks to manage
              </p>
              <ul className="space-y-1 text-sm text-amber-950 dark:text-amber-100">
                {risks.map((r) => (
                  <li key={r}>• {r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {notes}
      <Assumptions items={assumptions} />
    </div>
  );
}

// ---------------------------------------------------------------------------

const OPS_DEFAULT: OpsDecisions = { inventory: "buffer", technology: "established", quality: "control", supplier: "single-local", outsourcing: "in-house" };

export function OpsSimulator() {
  const [d, setD] = usePersistentState<OpsDecisions>("sim:ops", OPS_DEFAULT);
  const r = useMemo(() => simulateOperations(d), [d]);
  const base = useMemo(() => simulateOperations(OPS_DEFAULT), []);
  const set = <K extends keyof OpsDecisions>(k: K) => (v: OpsDecisions[K]) => setD((x) => ({ ...x, [k]: v }));
  return (
    <SimLayout
      disclaimer="Fictional business and illustrative values only. The model shows the direction of trade-offs taught in the syllabus — it does not predict any real business's performance."
      decisions={
        <>
          <p className="text-sm font-semibold">Your decisions — Coastline Furniture Co. (fictional)</p>
          <Select label="Inventory strategy" value={d.inventory} onChange={set("inventory")} options={OPS_OPTIONS.inventory} />
          <Select label="Technology" value={d.technology} onChange={set("technology")} options={OPS_OPTIONS.technology} />
          <Select label="Quality management approach" value={d.quality} onChange={set("quality")} options={OPS_OPTIONS.quality} />
          <Select label="Supplier strategy" value={d.supplier} onChange={set("supplier")} options={OPS_OPTIONS.supplier} />
          <Select label="Outsourcing decision" value={d.outsourcing} onChange={set("outsourcing")} options={OPS_OPTIONS.outsourcing} />
          <button type="button" className="text-xs font-semibold text-bronze-700 underline dark:text-bronze-400" onClick={() => setD(OPS_DEFAULT)}>
            Reset to baseline
          </button>
        </>
      }
      results={
        <>
          <Metric label="Operating costs ($'000/yr)" value={r.operatingCost} base={base.operatingCost} display={`$${r.operatingCost.toLocaleString("en-AU")}k`} better="lower" max={5000} />
          <Metric label="Product quality index" value={r.quality} base={base.quality} display={`${r.quality}/100`} better="higher" max={100} />
          <Metric label="Delivery reliability (on time, in full)" value={r.reliability} base={base.reliability} display={`${r.reliability.toFixed(1)}%`} better="higher" max={100} />
          <Metric label="Inventory holdings (days of stock)" value={r.inventoryDays} base={base.inventoryDays} display={`${r.inventoryDays} days`} better="lower" max={80} />
          <div className="col-span-2">
            <Metric label="Customer satisfaction index" value={r.satisfaction} base={base.satisfaction} display={`${r.satisfaction}/100`} better="higher" max={100} />
          </div>
        </>
      }
      risks={r.risks}
      notes={
        <div className="grid gap-2 md:grid-cols-2">
          {r.notes.map((n) => (
            <div key={n.decision} className="rounded-xl bg-stone-50 p-3 text-sm dark:bg-night-3">
              <p className="font-semibold text-stone-900 dark:text-stone-100">{n.decision}</p>
              <p className="text-stone-700 dark:text-stone-300">{n.effect}</p>
              <p className="mt-1 text-xs text-stone-500">Syllabus link: {n.concept}</p>
            </div>
          ))}
        </div>
      }
      assumptions={OPS_ASSUMPTIONS}
    />
  );
}

// ---------------------------------------------------------------------------

const MKT_DEFAULT: MktDecisions = { target: "mass", positioning: "value", pricing: "competition", promotion: "advertising", distribution: "intensive", budget: 200_000 };

export function MktSimulator() {
  const [d, setD] = usePersistentState<MktDecisions>("sim:mkt", MKT_DEFAULT);
  const r = useMemo(() => simulateMarketing(d), [d]);
  const base = useMemo(() => simulateMarketing(MKT_DEFAULT), []);
  const set = <K extends keyof MktDecisions>(k: K) => (v: MktDecisions[K]) => setD((x) => ({ ...x, [k]: v }));
  const icon = (v: string) => (v === "effective" ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : v === "mixed" ? <MinusCircle className="h-4 w-4 text-amber-600" /> : <XCircle className="h-4 w-4 text-red-600" />);
  return (
    <SimLayout
      disclaimer="Fictional product and illustrative values only. Results show how a consistent marketing mix tends to perform better — they are not reliable market predictions."
      decisions={
        <>
          <p className="text-sm font-semibold">Launch decisions — 'Tidal' drink bottle (fictional)</p>
          <Select label="Target market" value={d.target} onChange={set("target")} options={[{ value: "mass", label: "Mass market (all adults)" }, { value: "niche-premium", label: "Niche — premium outdoor enthusiasts" }, { value: "niche-eco", label: "Niche — eco-conscious young adults" }]} />
          <Select label="Product positioning" value={d.positioning} onChange={set("positioning")} options={[{ value: "premium", label: "Premium quality and design" }, { value: "value", label: "Value for money" }, { value: "eco", label: "Sustainable / eco-friendly" }]} />
          <Select label="Pricing strategy" value={d.pricing} onChange={set("pricing")} options={[{ value: "skimming", label: "Price skimming" }, { value: "penetration", label: "Penetration pricing" }, { value: "competition", label: "Competition-based pricing" }, { value: "cost-plus", label: "Cost-based (cost-plus) pricing" }]} />
          <Select label="Promotional approach" value={d.promotion} onChange={set("promotion")} options={[{ value: "advertising", label: "Mass media advertising" }, { value: "social", label: "Social media and influencers (opinion leaders)" }, { value: "personal", label: "Personal selling at specialist stores/events" }, { value: "sales-promo", label: "Sales promotions (discounts, bundles)" }]} />
          <Select label="Distribution strategy" value={d.distribution} onChange={set("distribution")} options={[{ value: "intensive", label: "Intensive (supermarkets, petrol stations)" }, { value: "selective", label: "Selective (chosen outdoor/homewares stores)" }, { value: "exclusive", label: "Exclusive (one premium retailer per city)" }, { value: "online", label: "Online direct (e-commerce)" }]} />
          <Slider label="Promotional budget" value={d.budget} min={20_000} max={800_000} step={10_000} onChange={set("budget")} format={(v) => formatCurrency(v)} />
          <button type="button" className="text-xs font-semibold text-bronze-700 underline dark:text-bronze-400" onClick={() => setD(MKT_DEFAULT)}>
            Reset to baseline
          </button>
        </>
      }
      results={
        <>
          <Metric label="Units sold" value={r.unitsSold} base={base.unitsSold} display={r.unitsSold.toLocaleString("en-AU")} better="higher" max={Math.max(r.unitsSold, base.unitsSold) * 1.3 || 1} />
          <Metric label={`Revenue (price $${r.price})`} value={r.revenue} base={base.revenue} display={formatCurrency(r.revenue)} better="higher" max={Math.max(r.revenue, base.revenue) * 1.3 || 1} />
          <Metric label="Customer reach (people)" value={r.reach} base={base.reach} display={r.reach.toLocaleString("en-AU")} better="higher" max={Math.max(r.reach, base.reach) * 1.3 || 1} />
          <Metric label="Brand awareness in target market" value={r.awareness} base={base.awareness} display={`${r.awareness}%`} better="higher" max={100} />
          <Metric label="Market share (segment)" value={r.marketShare} base={base.marketShare} display={`${r.marketShare}%`} better="higher" max={Math.max(15, r.marketShare * 1.3)} />
          <Metric label="Profit (after marketing & channel costs)" value={r.profit} base={base.profit} display={formatCurrency(r.profit)} better="higher" max={Math.max(Math.abs(r.profit), Math.abs(base.profit)) * 1.3 || 1} />
          <div className="col-span-2 rounded-xl bg-bronze-50 p-3 text-sm dark:bg-bronze-950/40">
            <p className="flex items-center gap-1.5 font-semibold">
              <Scale className="h-4 w-4" /> Marketing mix consistency: {r.consistency}/100
            </p>
            <p className="text-stone-700 dark:text-stone-300">Higher consistency means price, positioning, promotion and distribution all fit the target market.</p>
          </div>
        </>
      }
      notes={
        <div className="grid gap-2 md:grid-cols-2">
          {r.explanations.map((e) => (
            <div key={e.area} className="rounded-xl bg-stone-50 p-3 text-sm dark:bg-night-3">
              <p className="flex items-center gap-1.5 font-semibold text-stone-900 dark:text-stone-100">
                {icon(e.verdict)} {e.area} — <span className="capitalize">{e.verdict}</span>
              </p>
              <p className="mt-0.5 text-stone-700 dark:text-stone-300">{e.text}</p>
            </div>
          ))}
        </div>
      }
      assumptions={MKT_ASSUMPTIONS}
    />
  );
}

// ---------------------------------------------------------------------------

const HR_DEFAULT: HrDecisions = { recruitment: "mixed", training: "minimal", leadership: "autocratic", rewards: "award", performance: "administrative", disputes: "grievance" };

export function HrSimulator() {
  const [d, setD] = usePersistentState<HrDecisions>("sim:hr", HR_DEFAULT);
  const r = useMemo(() => simulateHr(d), [d]);
  const base = useMemo(() => simulateHr(HR_DEFAULT), []);
  const set = <K extends keyof HrDecisions>(k: K) => (v: HrDecisions[K]) => setD((x) => ({ ...x, [k]: v }));
  return (
    <SimLayout
      disclaimer="Fictional workplace and illustrative values only. Outcomes are not guarantees — real results depend on context, implementation and people."
      decisions={
        <>
          <p className="text-sm font-semibold">HR decisions — Harbour Lights Hotel (fictional, 150 staff)</p>
          <Select label="Recruitment method" value={d.recruitment} onChange={set("recruitment")} options={HR_OPTIONS.recruitment} />
          <Select label="Training investment" value={d.training} onChange={set("training")} options={HR_OPTIONS.training} />
          <Select label="Leadership approach" value={d.leadership} onChange={set("leadership")} options={HR_OPTIONS.leadership} />
          <Select label="Reward strategy" value={d.rewards} onChange={set("rewards")} options={HR_OPTIONS.rewards} />
          <Select label="Performance management" value={d.performance} onChange={set("performance")} options={HR_OPTIONS.performance} />
          <Select label="Dispute resolution approach" value={d.disputes} onChange={set("disputes")} options={HR_OPTIONS.disputes} />
          <button type="button" className="text-xs font-semibold text-bronze-700 underline dark:text-bronze-400" onClick={() => setD(HR_DEFAULT)}>
            Reset to baseline
          </button>
        </>
      }
      results={
        <>
          <Metric label="Staff turnover (per year)" value={r.turnover} base={base.turnover} display={`${r.turnover}%`} better="lower" max={60} />
          <Metric label="Employee satisfaction" value={r.satisfaction} base={base.satisfaction} display={`${r.satisfaction}/100`} better="higher" max={100} />
          <Metric label="Productivity index" value={r.productivity} base={base.productivity} display={`${r.productivity}`} better="higher" max={140} />
          <Metric label="Absenteeism" value={r.absenteeism} base={base.absenteeism} display={`${r.absenteeism}%`} better="lower" max={12} />
          <Metric label="Annual people costs" value={r.costs} base={base.costs} display={formatCurrency(r.costs)} better="lower" max={Math.max(r.costs, base.costs) * 1.15} />
          <Metric label="Workplace relations" value={r.relations} base={base.relations} display={`${r.relations}/100`} better="higher" max={100} />
        </>
      }
      notes={
        <div className="space-y-3">
          <div className="grid gap-2 md:grid-cols-2">
            {r.notes.map((n) => (
              <div key={n.decision} className="rounded-xl bg-stone-50 p-3 text-sm dark:bg-night-3">
                <p className="font-semibold text-stone-900 dark:text-stone-100">{n.decision}</p>
                <p className="text-stone-700 dark:text-stone-300">{n.text}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-sm dark:border-blue-900 dark:bg-blue-950/30">
            <p className="mb-1 font-semibold text-blue-900 dark:text-blue-200">Legal obligations that apply whatever you choose</p>
            <ul className="space-y-1 text-blue-950 dark:text-blue-100">
              {r.legal.map((l) => (
                <li key={l}>• {l}</li>
              ))}
            </ul>
          </div>
        </div>
      }
      assumptions={HR_ASSUMPTIONS}
    />
  );
}

import { useState } from "react";
import { motion } from "motion/react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";
import { Callout, NumberField, Segmented, Slider, Tag } from "../ui";
import { FlowDiagram } from "../content/FlowDiagram";
import { useChartTheme } from "./chartKit";
import { cx } from "../../lib/theme";
import { usePersistentState } from "../../state/storage";
import { absenteeismRate, turnoverCost, turnoverRate } from "../../lib/sim/hr";
import { formatCurrency, round } from "../../lib/finance";
import type { FlowSpec } from "../../content/types";

// ---------------------------------------------------------------------------
// Stakeholder map
// ---------------------------------------------------------------------------

const STAKE = [
  { id: "employers", name: "Employers", x: 300, y: 70, interest: "Productivity, flexibility, cost control, compliance.", influence: "Make HR decisions; must meet legal obligations (pay, safety, non-discrimination)." },
  { id: "employees", name: "Employees", x: 300, y: 290, interest: "Fair pay, safe conditions, job security, development, work–life balance.", influence: "Supply labour and skills; bargain individually or collectively." },
  { id: "unions", name: "Unions", x: 520, y: 290, interest: "Better wages and conditions for members; job security.", influence: "Collective bargaining for enterprise agreements; represent members in disputes; may organise protected industrial action." },
  { id: "assoc", name: "Employer associations", x: 520, y: 70, interest: "Business-friendly workplace laws and conditions.", influence: "Advise employers; lobby government; represent employers at the Fair Work Commission (e.g. Annual Wage Review)." },
  { id: "gov", name: "Government organisations", x: 80, y: 70, interest: "Fair, safe and productive workplaces; economic growth.", influence: "Fair Work Commission (awards, wages, agreements, disputes), Fair Work Ombudsman (compliance), SafeWork NSW (WHS), anti-discrimination bodies." },
  { id: "society", name: "Society", x: 80, y: 290, interest: "Ethical treatment of workers; strong communities.", influence: "Expectations shape laws and reputations; customers may avoid businesses that mistreat staff." },
];

export function StakeholderMap() {
  const [sel, setSel] = useState("unions");
  const s = STAKE.find((x) => x.id === sel)!;
  const ch = useChartTheme();
  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
      <svg viewBox="0 0 600 360" className="w-full" role="group" aria-label="HR stakeholder relationship map">
        {STAKE.filter((x) => x.id !== "employers" && x.id !== "employees").map((x) => (
          <line key={x.id + "c"} x1={x.x} y1={x.y} x2={300} y2={180} stroke={ch.isDark ? "#57534e" : "#d6d3d1"} strokeWidth={2} />
        ))}
        <line x1={300} y1={70} x2={300} y2={290} stroke={ch.isDark ? "#57534e" : "#d6d3d1"} strokeWidth={2} />
        <circle cx={300} cy={180} r={44} fill={ch.isDark ? "#122036" : "#eff6ff"} stroke="#2563eb" strokeWidth={2} />
        <text x={300} y={176} textAnchor="middle" fontSize={12} fontWeight={700} fill={ch.isDark ? "#bfdbfe" : "#1e3a8a"}>Employment</text>
        <text x={300} y={192} textAnchor="middle" fontSize={12} fontWeight={700} fill={ch.isDark ? "#bfdbfe" : "#1e3a8a"}>relationship</text>
        {STAKE.map((x) => {
          const active = x.id === sel;
          return (
            <g key={x.id} onClick={() => setSel(x.id)} style={{ cursor: "pointer" }}>
              <rect x={x.x - 72} y={x.y - 24} width={144} height={48} rx={14} fill={active ? "#2563eb" : ch.isDark ? "#1c1916" : "#fff"} stroke="#2563eb" strokeWidth={2} />
              <text x={x.x} y={x.y + 5} textAnchor="middle" fontSize={x.name.length > 14 ? 11 : 13} fontWeight={700} fill={active ? "#fff" : ch.isDark ? "#e7e5e4" : "#1c1917"}>
                {x.name}
              </text>
            </g>
          );
        })}
      </svg>
      <div>
        <div className="flex flex-wrap gap-1.5">
          {STAKE.map((x) => (
            <button key={x.id} type="button" onClick={() => setSel(x.id)} aria-pressed={sel === x.id} className={cx("rounded-lg border px-2.5 py-1 text-xs font-medium", sel === x.id ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40" : "border-stone-200 dark:border-stone-700")}>
              {x.name}
            </button>
          ))}
        </div>
        <motion.div key={sel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-2 rounded-2xl border border-stone-200 p-4 text-sm dark:border-stone-800">
          <p className="font-display text-lg font-semibold">{s.name}</p>
          <p><span className="font-semibold">Interests: </span>{s.interest}</p>
          <p><span className="font-semibold">Role / influence: </span>{s.influence}</p>
        </motion.div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Workplace regulation overview (layers)
// ---------------------------------------------------------------------------

const LAYERS = [
  { id: "contract", name: "Employment contract (common law)", w: 52, detail: "Every employee has a contract (written or verbal). Common law implies duties: employer — pay wages, safe workplace, reimburse expenses; employee — obey lawful and reasonable directions, act in good faith, use care and skill. Individual contracts can provide more than the minimums below." },
  { id: "ea", name: "Enterprise agreement", w: 64, detail: "Collectively bargained for a workplace; approved by the Fair Work Commission; must pass the better off overall test (BOOT) against the award. Replaces the award for covered employees while in operation." },
  { id: "award", name: "Modern award", w: 78, detail: "Industry/occupation minimums: pay rates, penalty rates, overtime, allowances, rostering, consultation and dispute-resolution terms. Reviewed annually by the FWC." },
  { id: "nes", name: "National Employment Standards (NES)", w: 90, detail: "Legislated minimum entitlements in the Fair Work Act 2009 that cannot be removed: maximum hours, leave entitlements, flexible work requests, notice and redundancy pay, public holidays and more." },
  { id: "other", name: "WHS · workers compensation · anti-discrimination · EEO", w: 100, detail: "Separate laws apply to every workplace: Work Health and Safety Act 2011 (NSW); workers compensation legislation; Anti-Discrimination Act 1977 (NSW) and federal discrimination Acts; Workplace Gender Equality Act 2012 (Cth) reporting for employers with 100+ staff." },
];

export function RegulationOverview() {
  const [sel, setSel] = useState("nes");
  const l = LAYERS.find((x) => x.id === sel)!;
  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
      <div className="flex flex-col items-center gap-1.5">
        {LAYERS.map((x, i) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setSel(x.id)}
            aria-pressed={sel === x.id}
            style={{ width: `${x.w}%` }}
            className={cx("rounded-xl px-3 py-2.5 text-center text-sm font-semibold transition-colors", sel === x.id ? "bg-blue-600 text-white" : i === LAYERS.length - 1 ? "bg-stone-200 text-stone-800 dark:bg-stone-700 dark:text-stone-100" : "bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-950/60 dark:text-blue-100")}
          >
            {x.name}
          </button>
        ))}
        <p className="mt-1 text-xs text-stone-500">Each layer sits on the safety net below it — terms above can add to, but not undercut, the minimums.</p>
      </div>
      <motion.div key={sel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-stone-200 p-4 text-sm dark:border-stone-800">
        <p className="font-display text-lg font-semibold">{l.name}</p>
        <p className="mt-2 leading-relaxed text-stone-700 dark:text-stone-300">{l.detail}</p>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HR lifecycle
// ---------------------------------------------------------------------------

const CYCLE = [
  { id: "acq", name: "Acquisition", color: "#2563eb", activities: ["Workforce planning — forecast needs and gaps", "Job analysis → job description and specification", "Recruitment — attract applicants (internal/external)", "Selection — screening, interviews, testing, reference checks", "Employment arrangements — contract, award or agreement"], legal: "Anti-discrimination and EEO apply to job ads and selection; offer NES-compliant terms.", strategy: "Recruitment strategy (internal/external, general/specific skills)" },
  { id: "dev", name: "Development", color: "#7c3aed", activities: ["Induction — culture, policies, WHS", "Training for current skills", "Development for future skills", "Mentoring, coaching, career planning"], legal: "WHS induction and training are part of the duty of care.", strategy: "Training and development (current or future skills); performance management (developmental)" },
  { id: "main", name: "Maintenance", color: "#059669", activities: ["Rewards — monetary and non-monetary", "Working conditions and flexibility", "Wellbeing and safety", "Communication and employee relations", "Performance management and recognition"], legal: "Pay at least award/agreement rates; NES leave; respond to flexible work requests; maintain safe systems of work.", strategy: "Rewards, leadership style, job design, dispute resolution" },
  { id: "sep", name: "Separation", color: "#b45309", activities: ["Voluntary: resignation, retirement, voluntary redundancy", "Involuntary: dismissal, redundancy, retrenchment", "Exit interviews and handover", "Outplacement support (ethical extra)"], legal: "NES notice periods and redundancy pay; fair process to avoid unfair dismissal claims; consultation obligations for major change.", strategy: "Redundancy planning; exit interviews inform HR effectiveness" },
];

export function HrLifecycle() {
  const [sel, setSel] = useState("acq");
  const c = CYCLE.find((x) => x.id === sel)!;
  const R = 110;
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
      <svg viewBox="0 0 320 320" className="mx-auto w-full max-w-sm" role="group" aria-label="HR lifecycle: acquisition, development, maintenance, separation">
        {CYCLE.map((s, i) => {
          const a0 = (i * Math.PI) / 2 - Math.PI / 2 + 0.06;
          const a1 = ((i + 1) * Math.PI) / 2 - Math.PI / 2 - 0.06;
          const big = 1;
          const p = (a: number, r: number) => [160 + r * Math.cos(a), 160 + r * Math.sin(a)];
          const [x0, y0] = p(a0, R + 30);
          const [x1, y1] = p(a1, R + 30);
          const [x2, y2] = p(a1, R - 30);
          const [x3, y3] = p(a0, R - 30);
          const mid = (a0 + a1) / 2;
          const [tx, ty] = p(mid, R);
          const active = s.id === sel;
          return (
            <g key={s.id} onClick={() => setSel(s.id)} style={{ cursor: "pointer" }} opacity={active ? 1 : 0.55}>
              <path d={`M ${x0} ${y0} A ${R + 30} ${R + 30} 0 0 ${big} ${x1} ${y1} L ${x2} ${y2} A ${R - 30} ${R - 30} 0 0 0 ${x3} ${y3} Z`} fill={s.color} />
              <text x={tx} y={ty + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff">
                {s.name}
              </text>
            </g>
          );
        })}
        <text x={160} y={156} textAnchor="middle" fontSize={12} className="fill-stone-500">The employment</text>
        <text x={160} y={172} textAnchor="middle" fontSize={12} className="fill-stone-500">cycle</text>
      </svg>
      <div>
        <Segmented label="Lifecycle stage" size="sm" value={sel} onChange={setSel} options={CYCLE.map((x) => ({ value: x.id, label: x.name }))} />
        <motion.div key={sel} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="mt-3 rounded-2xl border border-stone-200 p-4 text-sm dark:border-stone-800">
          <p className="font-display text-lg font-semibold" style={{ color: c.color }}>{c.name}</p>
          <ul className="mt-2 space-y-1">
            {c.activities.map((a) => (
              <li key={a}>• {a}</li>
            ))}
          </ul>
          <p className="mt-3"><span className="font-semibold">Related strategies: </span>{c.strategy}</p>
          <p className="mt-2 rounded-lg bg-blue-50 p-2 text-blue-950 dark:bg-blue-950/40 dark:text-blue-100"><span className="font-semibold">Legal obligations: </span>{c.legal}</p>
        </motion.div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Leadership comparison
// ---------------------------------------------------------------------------

const LEAD = [
  { name: "Autocratic", speed: 5, involve: 1, motivation: 2, best: "Emergencies, inexperienced staff, strict compliance tasks", risk: "Low morale, resentment, disputes" },
  { name: "Democratic", speed: 2, involve: 5, motivation: 5, best: "Change programs, planning, skilled teams", risk: "Slow decisions; consensus may be hard" },
  { name: "Laissez-faire", speed: 3, involve: 4, motivation: 3, best: "Highly skilled, self-motivated experts (e.g. research teams)", risk: "Lack of direction and coordination" },
  { name: "Situational", speed: 4, involve: 4, motivation: 4, best: "Most contemporary workplaces — style adapted to task and team readiness", risk: "Requires skilled, flexible managers" },
];

export function LeadershipCompare() {
  const ch = useChartTheme();
  const data = LEAD.map((l) => ({ name: l.name, "Decision speed": l.speed, "Employee involvement": l.involve, "Typical motivation": l.motivation }));
  return (
    <div>
      <div className="h-64">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10 }}>
            <CartesianGrid {...ch.gridProps} />
            <XAxis dataKey="name" {...ch.axisProps} />
            <YAxis {...ch.axisProps} domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
            <Tooltip {...ch.tooltipProps} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Decision speed" fill={ch.series[0]} radius={[4, 4, 0, 0]} stroke={ch.isDark ? "#1c1916" : "#fff"} strokeWidth={2} />
            <Bar dataKey="Employee involvement" fill={ch.series[1]} radius={[4, 4, 0, 0]} stroke={ch.isDark ? "#1c1916" : "#fff"} strokeWidth={2} />
            <Bar dataKey="Typical motivation" fill={ch.series[2]} radius={[4, 4, 0, 0]} stroke={ch.isDark ? "#1c1916" : "#fff"} strokeWidth={2} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {LEAD.map((l) => (
          <div key={l.name} className="rounded-xl bg-stone-50 p-3 text-sm dark:bg-night-3">
            <p className="font-semibold">{l.name}</p>
            <p><span className="text-emerald-700 dark:text-emerald-400">Best when: </span>{l.best}</p>
            <p><span className="text-red-700 dark:text-red-400">Risk: </span>{l.risk}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-stone-500">Relative 1–5 ratings are a teaching guide, not measured data.</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal vs external recruitment weigher
// ---------------------------------------------------------------------------

const FACTORS = [
  { id: "urgent", label: "The vacancy must be filled quickly", weight: { internal: 2, external: 0 } },
  { id: "newideas", label: "The business needs new ideas or a culture change", weight: { internal: 0, external: 2 } },
  { id: "skills", label: "Specific skills are not available among current staff", weight: { internal: 0, external: 3 } },
  { id: "morale", label: "Staff morale and career paths are a priority", weight: { internal: 2, external: 0 } },
  { id: "budget", label: "The recruitment budget is tight", weight: { internal: 2, external: 0 } },
  { id: "diversity", label: "Increasing workforce diversity is a goal", weight: { internal: 0, external: 2 } },
];

export function RecruitmentWeigher() {
  const [on, setOn] = useState<Record<string, boolean>>({ urgent: true, skills: true });
  const internal = FACTORS.reduce((t, f) => t + (on[f.id] ? f.weight.internal : 0), 0);
  const external = FACTORS.reduce((t, f) => t + (on[f.id] ? f.weight.external : 0), 0);
  const total = Math.max(1, internal + external);
  const verdict = internal === external ? "A mix of both — e.g. advertise internally and externally at the same time." : internal > external ? "Internal recruitment fits better: cheaper, faster and motivating." : "External recruitment fits better: wider pool, new skills and ideas.";
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="space-y-2">
        <p className="text-sm font-semibold">Which factors apply to this vacancy?</p>
        {FACTORS.map((f) => (
          <label key={f.id} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!on[f.id]} onChange={(e) => setOn((o) => ({ ...o, [f.id]: e.target.checked }))} className="h-4 w-4 accent-blue-600" />
            {f.label}
          </label>
        ))}
      </div>
      <div>
        <div className="flex h-10 overflow-hidden rounded-xl text-sm font-semibold text-white">
          <motion.div animate={{ width: `${(internal / total) * 100}%` }} className="flex items-center justify-center bg-blue-600">{internal > 0 && "Internal"}</motion.div>
          <motion.div animate={{ width: `${(external / total) * 100}%` }} className="flex items-center justify-center bg-amber-700">{external > 0 && "External"}</motion.div>
        </div>
        <p className="mt-3 text-sm font-semibold">{verdict}</p>
        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-950/30"><p className="font-semibold">Internal</p><p>+ Motivates, cheaper, faster, known performance</p><p>− Limited pool, fewer new ideas, creates another vacancy</p></div>
          <div className="rounded-xl bg-amber-50 p-3 dark:bg-amber-950/30"><p className="font-semibold">External</p><p>+ Wider pool, new skills and ideas, diversity</p><p>− Costly, slower, longer induction, may demotivate staff</p></div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Training, performance management and dispute flows
// ---------------------------------------------------------------------------

const TRAINING: FlowSpec = {
  id: "training-flow",
  title: "Training and development cycle",
  nodes: [
    { id: "needs", label: "1. Identify needs", detail: "Training needs analysis: compare required skills (business objectives, new technology) with current skills — skills gaps.", col: 0, row: 0, tone: "input" },
    { id: "type", label: "2. Current or future skills?", detail: "Current skills: improve performance in present roles. Future skills: prepare for new roles, technology and leadership (succession planning).", col: 1, row: 0, tone: "decision" },
    { id: "design", label: "3. Design program", detail: "Choose methods: on-the-job (coaching, job rotation), off-the-job (courses, qualifications), e-learning; set objectives and budget.", col: 2, row: 0, tone: "process" },
    { id: "deliver", label: "4. Deliver", detail: "Run the training; schedule to minimise disruption to operations.", col: 2, row: 1, tone: "process" },
    { id: "eval", label: "5. Evaluate", detail: "Did skills and performance improve? Measure productivity, errors, customer feedback, retention — and the return on the training investment.", col: 1, row: 1, tone: "output" },
  ],
  edges: [
    { from: "needs", to: "type" },
    { from: "type", to: "design" },
    { from: "design", to: "deliver" },
    { from: "deliver", to: "eval" },
    { from: "eval", to: "needs", label: "new gaps", dashed: true },
  ],
};

const PERFORMANCE: FlowSpec = {
  id: "performance-flow",
  title: "Performance management process",
  nodes: [
    { id: "goals", label: "Set goals & standards", detail: "Agree measurable goals linked to business objectives (e.g. sales targets, service KPIs).", col: 0, row: 0, tone: "input" },
    { id: "monitor", label: "Monitor & give feedback", detail: "Ongoing observation, data and regular feedback conversations — not just once a year.", col: 1, row: 0, tone: "process" },
    { id: "appraise", label: "Appraise performance", detail: "Formal review comparing performance with standards (self-assessment, manager review, 360-degree feedback).", col: 2, row: 0, tone: "decision" },
    { id: "dev", label: "Developmental outcome", detail: "Coaching, training plans, career development — improving skills and motivation.", col: 3, row: 0, tone: "output" },
    { id: "admin", label: "Administrative outcome", detail: "Decisions about pay rises, bonuses (performance pay), promotion, transfer or dismissal; formal records.", col: 3, row: 1, tone: "accent" },
  ],
  edges: [
    { from: "goals", to: "monitor" },
    { from: "monitor", to: "appraise" },
    { from: "appraise", to: "dev", label: "developmental" },
    { from: "appraise", to: "admin", label: "administrative" },
    { from: "dev", to: "goals", label: "new goals", dashed: true },
  ],
};

const DISPUTES: FlowSpec = {
  id: "dispute-flow",
  title: "Workplace dispute resolution",
  nodes: [
    { id: "issue", label: "Dispute arises", detail: "Causes: pay and conditions, job security (redundancy, outsourcing), rosters, safety, management decisions, discrimination.", col: 0, row: 0, tone: "input" },
    { id: "neg", label: "Negotiation", detail: "The parties discuss and reach agreement themselves — fastest, cheapest, preserves relationships.", col: 1, row: 0, tone: "process" },
    { id: "griev", label: "Grievance procedure", detail: "Documented steps in the award or agreement: supervisor → senior management → external body.", col: 2, row: 0, tone: "process" },
    { id: "med", label: "Mediation / conciliation", detail: "A neutral third party (often the Fair Work Commission) helps the parties reach their own agreement.", col: 3, row: 0, tone: "decision" },
    { id: "trib", label: "Tribunal (Fair Work Commission)", detail: "May arbitrate (make a binding decision) in some cases; deals with unfair dismissal; can suspend or terminate industrial action.", col: 3, row: 1, tone: "accent" },
    { id: "court", label: "Courts", detail: "Federal Court / Federal Circuit and Family Court enforce workplace law and impose penalties (e.g. underpayment, adverse action). Binding but slow, costly and public.", col: 2, row: 1, tone: "accent" },
    { id: "res", label: "Resolution", detail: "Agreement or binding decision; review causes to prevent future disputes (consultation, leadership, policies).", col: 1, row: 1, tone: "output" },
  ],
  edges: [
    { from: "issue", to: "neg" },
    { from: "neg", to: "griev", label: "unresolved" },
    { from: "griev", to: "med", label: "unresolved" },
    { from: "med", to: "trib", label: "unresolved" },
    { from: "trib", to: "court", label: "legal breach / appeal", dashed: true },
    { from: "court", to: "res" },
    { from: "neg", to: "res", label: "agreed", dashed: true },
  ],
};

export function TrainingFlow() {
  return <FlowDiagram flow={TRAINING} />;
}
export function PerformanceFlow() {
  return <FlowDiagram flow={PERFORMANCE} />;
}
export function DisputesFlow() {
  return (
    <div className="space-y-3">
      <FlowDiagram flow={DISPUTES} />
      <div className="flex flex-wrap gap-2 text-xs">
        <Tag tone="good">Internal methods: faster, cheaper, preserve relationships</Tag>
        <Tag tone="warn">External methods: binding, but slow, costly and adversarial</Tag>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rewards comparison matrix
// ---------------------------------------------------------------------------

const REWARDS = [
  { name: "Base salary / wages", money: true, group: false, perf: false, note: "Must meet award/agreement minimums." },
  { name: "Individual bonus / commission", money: true, group: false, perf: true, note: "Performance pay linked to personal targets — motivates high achievers, may reduce teamwork." },
  { name: "Team bonus / gainsharing", money: true, group: true, perf: true, note: "Encourages cooperation; risk of free riders." },
  { name: "Profit sharing / employee share plan", money: true, group: true, perf: true, note: "Aligns employees with business success." },
  { name: "Recognition awards", money: false, group: false, perf: true, note: "Low cost, valued if sincere and timely." },
  { name: "Flexible hours / remote work", money: false, group: false, perf: false, note: "Supports work–life balance; strong retention tool." },
  { name: "Training and career development", money: false, group: false, perf: false, note: "Builds skills and loyalty; also benefits the business." },
  { name: "Team celebrations / extra leave", money: false, group: true, perf: true, note: "Builds culture and belonging." },
];

export function RewardsCompare() {
  const [sel, setSel] = useState(1);
  const r = REWARDS[sel];
  const quad = (money: boolean, group: boolean) => REWARDS.map((x, i) => ({ ...x, i })).filter((x) => x.money === money && x.group === group);
  const Cell2 = ({ money, group, title }: { money: boolean; group: boolean; title: string }) => (
    <div className="rounded-xl border border-stone-200 p-2 dark:border-stone-800">
      <p className="mb-1 text-[11px] font-semibold text-stone-500 uppercase">{title}</p>
      <div className="flex flex-wrap gap-1">
        {quad(money, group).map((x) => (
          <button key={x.name} type="button" onClick={() => setSel(x.i)} aria-pressed={sel === x.i} className={cx("rounded-lg border px-2 py-1 text-xs", sel === x.i ? "border-blue-600 bg-blue-600 text-white" : "border-stone-200 dark:border-stone-700")}>
            {x.name}
            {x.perf && " ★"}
          </button>
        ))}
      </div>
    </div>
  );
  return (
    <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
      <div className="grid grid-cols-2 gap-2">
        <Cell2 money group={false} title="Monetary · Individual" />
        <Cell2 money group title="Monetary · Group" />
        <Cell2 money={false} group={false} title="Non-monetary · Individual" />
        <Cell2 money={false} group title="Non-monetary · Group" />
        <p className="col-span-2 text-xs text-stone-500">★ = linked to performance (performance pay or recognition of results)</p>
      </div>
      <motion.div key={sel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-stone-200 p-4 text-sm dark:border-stone-800">
        <p className="font-display text-lg font-semibold">{r.name}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Tag>{r.money ? "Monetary" : "Non-monetary"}</Tag>
          <Tag>{r.group ? "Group" : "Individual"}</Tag>
          {r.perf && <Tag tone="good">Performance-linked</Tag>}
        </div>
        <p className="mt-2 text-stone-700 dark:text-stone-300">{r.note}</p>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HR effectiveness dashboard
// ---------------------------------------------------------------------------

export function HrDashboard() {
  const ch = useChartTheme();
  const [d, setD] = usePersistentState("hr:dashboard", { start: 180, end: 200, separations: 38, daysLost: 1900, scheduled: 45_600, accidents: 6, grievances: 9, satisfaction: 64, targetTurnover: 15, targetAbsence: 3 });
  const avg = (d.start + d.end) / 2;
  const tr = turnoverRate(d.separations, avg);
  const ar = absenteeismRate(d.daysLost, d.scheduled);
  const set = (k: keyof typeof d) => (v: number) => setD((x) => ({ ...x, [k]: Math.max(0, v) }));
  const data = [
    { name: "Turnover %", actual: round(tr ?? 0, 1), target: d.targetTurnover },
    { name: "Absenteeism %", actual: round(ar ?? 0, 1), target: d.targetAbsence },
  ];
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="Employees at start of year" value={d.start} onChange={set("start")} />
        <NumberField label="Employees at end of year" value={d.end} onChange={set("end")} />
        <NumberField label="Separations during year" value={d.separations} onChange={set("separations")} />
        <NumberField label="Target turnover" suffix="%" value={d.targetTurnover} onChange={set("targetTurnover")} />
        <NumberField label="Days lost to unplanned absence" value={d.daysLost} onChange={set("daysLost")} />
        <NumberField label="Total scheduled working days" value={d.scheduled} onChange={set("scheduled")} hint="employees × working days" />
        <NumberField label="Target absenteeism" suffix="%" value={d.targetAbsence} step={0.5} onChange={set("targetAbsence")} />
        <NumberField label="Workplace accidents (lost-time)" value={d.accidents} onChange={set("accidents")} />
        <NumberField label="Formal grievances / disputes" value={d.grievances} onChange={set("grievances")} />
        <NumberField label="Worker satisfaction (survey %)" suffix="%" value={d.satisfaction} onChange={set("satisfaction")} />
      </div>
      <div>
        <div className="h-52">
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10 }}>
              <CartesianGrid {...ch.gridProps} />
              <XAxis dataKey="name" {...ch.axisProps} />
              <YAxis {...ch.axisProps} tickFormatter={(x) => `${x}%`} />
              <Tooltip {...ch.tooltipProps} formatter={(x: number) => `${x}%`} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="actual" name="Actual" fill={ch.series[1]} radius={[4, 4, 0, 0]} maxBarSize={50} stroke={ch.isDark ? "#1c1916" : "#fff"} strokeWidth={2} />
              <Bar dataKey="target" name="Target / benchmark" fill={ch.isDark ? "#78716c" : "#a8a29e"} radius={[4, 4, 0, 0]} maxBarSize={50} stroke={ch.isDark ? "#1c1916" : "#fff"} strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 space-y-1.5 text-sm">
          <p>Average employees = ({d.start} + {d.end}) ÷ 2 = {avg}</p>
          <p>Turnover = {d.separations} ÷ {avg} × 100 = <span className="font-semibold">{tr === null ? "–" : `${round(tr, 1)}%`}</span> {tr !== null && <Tag tone={tr <= d.targetTurnover ? "good" : "bad"}>{tr <= d.targetTurnover ? "within target" : "above target"}</Tag>}</p>
          <p>Absenteeism = {d.daysLost.toLocaleString("en-AU")} ÷ {d.scheduled.toLocaleString("en-AU")} × 100 = <span className="font-semibold">{ar === null ? "–" : `${round(ar, 1)}%`}</span> {ar !== null && <Tag tone={ar <= d.targetAbsence ? "good" : "bad"}>{ar <= d.targetAbsence ? "within target" : "above target"}</Tag>}</p>
          <p>Accidents: {d.accidents} · Grievances: {d.grievances} · Satisfaction: {d.satisfaction}%</p>
        </div>
        <Callout tone="exam" title="Read indicators together">
          {(tr ?? 0) > d.targetTurnover && (ar ?? 0) > d.targetAbsence && d.satisfaction < 70
            ? "High turnover and absenteeism with below-target satisfaction point to problems in maintenance strategies (rewards, leadership, conditions). Investigate with exit interviews and surveys."
            : "Indicators are mixed. No single measure proves HR is effective — compare trends over time and benchmark against the industry."}
        </Callout>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Turnover simulator
// ---------------------------------------------------------------------------

export function TurnoverSimulator() {
  const ch = useChartTheme();
  const [staff, setStaff] = useState(120);
  const [rate, setRate] = useState(25);
  const [cost, setCost] = useState(12_000);
  const [retention, setRetention] = useState(0);
  const retentionEffect = retention * 0.25; // each 1% of payroll invested cuts turnover by 0.25 points (illustrative)
  const newRate = Math.max(3, rate - retentionEffect * 4);
  const sepBefore = (rate / 100) * staff;
  const sepAfter = (newRate / 100) * staff;
  const payroll = staff * 65_000;
  const invest = (retention / 100) * payroll;
  const savings = turnoverCost(sepBefore, cost) - turnoverCost(sepAfter, cost);
  const data = [
    { name: "Current", "Turnover cost": Math.round(turnoverCost(sepBefore, cost)), "Retention investment": 0 },
    { name: "With retention program", "Turnover cost": Math.round(turnoverCost(sepAfter, cost)), "Retention investment": Math.round(invest) },
  ];
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
      <div className="space-y-3">
        <Slider label="Number of employees" value={staff} min={20} max={500} step={10} onChange={setStaff} />
        <Slider label="Current annual turnover rate" value={rate} min={5} max={60} onChange={setRate} format={(v) => `${v}%`} />
        <Slider label="Cost to replace one employee" value={cost} min={2000} max={40_000} step={1000} onChange={setCost} format={(v) => formatCurrency(v)} />
        <Slider label="Retention program investment (% of payroll)" value={retention} min={0} max={5} step={0.5} onChange={setRetention} format={(v) => `${v}%`} />
        <p className="text-xs text-stone-500">Replacement cost includes advertising, selection, induction, training and lost productivity. Retention effects are illustrative assumptions (each 1% of payroll reduces turnover by 1 percentage point, to a floor of 3%).</p>
      </div>
      <div>
        <div className="h-56">
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10 }}>
              <CartesianGrid {...ch.gridProps} />
              <XAxis dataKey="name" {...ch.axisProps} />
              <YAxis {...ch.axisProps} tickFormatter={(x) => `$${Math.round(x / 1000)}k`} />
              <Tooltip {...ch.tooltipProps} formatter={(x: number) => formatCurrency(x)} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Turnover cost" stackId="a" fill={ch.series[0]} stroke={ch.isDark ? "#1c1916" : "#fff"} strokeWidth={2} />
              <Bar dataKey="Retention investment" stackId="a" fill={ch.series[1]} stroke={ch.isDark ? "#1c1916" : "#fff"} strokeWidth={2} radius={[4, 4, 0, 0]} />
              <ReferenceLine y={0} stroke={ch.axis} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="rounded-xl bg-stone-50 p-2 dark:bg-night-3"><p className="text-xs text-stone-500">Turnover rate</p><p className="font-semibold">{rate}% → {round(newRate, 1)}%</p></div>
          <div className="rounded-xl bg-stone-50 p-2 dark:bg-night-3"><p className="text-xs text-stone-500">Leavers per year</p><p className="font-semibold">{Math.round(sepBefore)} → {Math.round(sepAfter)}</p></div>
          <div className={cx("rounded-xl p-2", savings - invest >= 0 ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-red-50 dark:bg-red-950/30")}><p className="text-xs text-stone-500">Net saving</p><p className="font-semibold">{formatCurrency(savings - invest)}</p></div>
        </div>
        <p className="mt-2 text-sm text-stone-700 dark:text-stone-300">Reducing turnover also retains skills and customer relationships that are hard to value — but retention programs only pay off if they address the real reasons staff leave.</p>
      </div>
    </div>
  );
}


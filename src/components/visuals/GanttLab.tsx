import { useMemo, useState } from "react";
import { Plus, RotateCcw, Trash2 } from "lucide-react";
import { schedule, networkLayers, type Activity, type ScheduledActivity } from "../../lib/scheduling";
import { Button, Callout, Segmented } from "../ui";
import { useSettings } from "../../state/settings";
import { cx } from "../../lib/theme";
import { usePersistentState } from "../../state/storage";

const PRESETS: Record<string, { label: string; unit: string; activities: Activity[] }> = {
  cafe: {
    label: "Opening a new café",
    unit: "weeks",
    activities: [
      { id: "A", name: "Sign lease", duration: 2, predecessors: [] },
      { id: "B", name: "Fit-out premises", duration: 6, predecessors: ["A"] },
      { id: "C", name: "Order equipment", duration: 3, predecessors: ["A"] },
      { id: "D", name: "Install equipment", duration: 1, predecessors: ["B", "C"] },
      { id: "E", name: "Recruit staff", duration: 4, predecessors: ["A"] },
      { id: "F", name: "Train staff", duration: 2, predecessors: ["D", "E"] },
      { id: "G", name: "Launch marketing", duration: 3, predecessors: ["A"] },
      { id: "H", name: "Opening day", duration: 1, predecessors: ["F", "G"] },
    ],
  },
  product: {
    label: "Launching a new product",
    unit: "weeks",
    activities: [
      { id: "A", name: "Market research", duration: 3, predecessors: [] },
      { id: "B", name: "Product design", duration: 4, predecessors: ["A"] },
      { id: "C", name: "Source suppliers", duration: 3, predecessors: ["A"] },
      { id: "D", name: "Prototype & test", duration: 3, predecessors: ["B"] },
      { id: "E", name: "Set up production", duration: 4, predecessors: ["C", "D"] },
      { id: "F", name: "Plan promotion", duration: 2, predecessors: ["D"] },
      { id: "G", name: "Launch", duration: 1, predecessors: ["E", "F"] },
    ],
  },
  hsc: {
    label: "HSC-style example (from practice questions)",
    unit: "weeks",
    activities: [
      { id: "A", name: "Activity A", duration: 3, predecessors: [] },
      { id: "B", name: "Activity B", duration: 2, predecessors: ["A"] },
      { id: "C", name: "Activity C", duration: 4, predecessors: ["A"] },
      { id: "D", name: "Activity D", duration: 5, predecessors: ["B"] },
      { id: "E", name: "Activity E", duration: 2, predecessors: ["C"] },
      { id: "F", name: "Activity F", duration: 1, predecessors: ["D", "E"] },
    ],
  },
};

const NEXT_ID = (acts: Activity[]) => {
  for (let i = 0; i < 26; i++) {
    const id = String.fromCharCode(65 + i);
    if (!acts.some((a) => a.id === id)) return id;
  }
  return `X${acts.length}`;
};

export function GanttLab() {
  const [preset, setPreset] = usePersistentState<string>("sim:gantt-preset", "cafe");
  const [acts, setActs] = usePersistentState<Activity[]>("sim:gantt", PRESETS.cafe.activities);
  const [view, setView] = useState<"gantt" | "network" | "table">("gantt");
  const result = useMemo(() => schedule(acts), [acts]);
  const unit = PRESETS[preset]?.unit ?? "weeks";

  const update = (i: number, patch: Partial<Activity>) => setActs((a) => a.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const loadPreset = (p: string) => {
    setPreset(p);
    setActs(PRESETS[p].activities);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented size="sm" label="Example project" value={preset} onChange={loadPreset} options={Object.entries(PRESETS).map(([k, v]) => ({ value: k, label: v.label }))} />
        <Button size="sm" variant="ghost" onClick={() => loadPreset(preset)}>
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
      </div>

      <div className="scroll-thin overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="text-left text-xs text-stone-500">
              <th className="py-1 pr-2 font-semibold">ID</th>
              <th className="py-1 pr-2 font-semibold">Activity</th>
              <th className="py-1 pr-2 font-semibold">Duration ({unit})</th>
              <th className="py-1 pr-2 font-semibold">Depends on (comma-separated IDs)</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {acts.map((a, i) => (
              <tr key={i}>
                <td className="py-1 pr-2 font-semibold">{a.id}</td>
                <td className="py-1 pr-2">
                  <input aria-label={`Name of activity ${a.id}`} value={a.name} onChange={(e) => update(i, { name: e.target.value })} className="w-full rounded-lg border border-stone-300 bg-white px-2 py-1 dark:border-stone-700 dark:bg-night-3" />
                </td>
                <td className="py-1 pr-2">
                  <input aria-label={`Duration of activity ${a.id}`} type="number" min={0} value={a.duration} onChange={(e) => update(i, { duration: Math.max(0, Number(e.target.value) || 0) })} className="w-20 rounded-lg border border-stone-300 bg-white px-2 py-1 tabular-nums dark:border-stone-700 dark:bg-night-3" />
                </td>
                <td className="py-1 pr-2">
                  <input
                    aria-label={`Predecessors of activity ${a.id}`}
                    value={a.predecessors.join(", ")}
                    onChange={(e) =>
                      update(i, {
                        predecessors: e.target.value
                          .split(",")
                          .map((s) => s.trim().toUpperCase())
                          .filter(Boolean),
                      })
                    }
                    className="w-full rounded-lg border border-stone-300 bg-white px-2 py-1 dark:border-stone-700 dark:bg-night-3"
                    placeholder="none"
                  />
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => setActs((x) => x.filter((_, j) => j !== i).map((y) => ({ ...y, predecessors: y.predecessors.filter((p) => p !== a.id) })))}
                    className="rounded-lg p-1.5 text-stone-400 hover:text-red-600"
                    aria-label={`Delete activity ${a.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button variant="secondary" size="sm" onClick={() => setActs((a) => [...a, { id: NEXT_ID(a), name: "New activity", duration: 1, predecessors: a.length ? [a[a.length - 1].id] : [] }])}>
        <Plus className="h-4 w-4" /> Add activity
      </Button>

      {!result.ok ? (
        <Callout tone="warning" title="Cannot schedule this project">
          {result.error}
        </Callout>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl bg-bronze-50 px-4 py-2 dark:bg-bronze-950/50">
              <p className="text-xs text-stone-500">Minimum project duration</p>
              <p className="text-2xl font-semibold tabular-nums">
                {result.projectDuration} {unit}
              </p>
            </div>
            <div className="rounded-xl bg-red-50 px-4 py-2 dark:bg-red-950/30">
              <p className="text-xs text-stone-500">Critical path{result.criticalPaths.length > 1 ? "s" : ""}</p>
              <p className="text-lg font-semibold">{result.criticalPaths.map((p) => p.join(" → ")).join("  |  ")}</p>
            </div>
            <Segmented
              size="sm"
              label="Chart view"
              value={view}
              onChange={setView}
              options={[
                { value: "gantt", label: "Gantt chart" },
                { value: "network", label: "CPA network" },
                { value: "table", label: "ES/EF/LS/LF table" },
              ]}
            />
          </div>
          {view === "gantt" && <Gantt acts={result.activities} total={result.projectDuration} unit={unit} />}
          {view === "network" && <Network acts={result.activities} />}
          {view === "table" && <ScheduleTable acts={result.activities} />}
          <Callout tone="exam" title="How to read this">
            Critical activities (red) have zero float — any delay to them delays the whole project. Shaded extensions show float: how long a non-critical activity can be delayed without delaying completion. Try increasing the duration of a non-critical activity beyond its float and watch the critical path change.
          </Callout>
        </>
      )}
    </div>
  );
}

function Gantt({ acts, total, unit }: { acts: ScheduledActivity[]; total: number; unit: string }) {
  const { isDark } = useSettings();
  const rowH = 34;
  const labelW = 150;
  const width = 720;
  const scale = (width - labelW - 20) / Math.max(1, total);
  const height = acts.length * rowH + 40;
  const sorted = [...acts].sort((a, b) => a.es - b.es || a.id.localeCompare(b.id));
  return (
    <div className="scroll-thin overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
      <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[620px]" role="img" aria-label={`Gantt chart; project duration ${total} ${unit}`}>
        {Array.from({ length: total + 1 }, (_, t) => (
          <g key={t}>
            <line x1={labelW + t * scale} x2={labelW + t * scale} y1={20} y2={height - 6} stroke={isDark ? "#3a342e" : "#e7e1d9"} />
            {(total <= 30 || t % 2 === 0) && (
              <text x={labelW + t * scale} y={14} fontSize={10} textAnchor="middle" fill={isDark ? "#a8a29e" : "#78716c"}>
                {t}
              </text>
            )}
          </g>
        ))}
        {sorted.map((a, i) => {
          const y = 26 + i * rowH;
          return (
            <g key={a.id}>
              <text x={8} y={y + 16} fontSize={12} fill={isDark ? "#e7e5e4" : "#292524"} fontWeight={600}>
                {a.id}: {a.name.length > 16 ? a.name.slice(0, 15) + "…" : a.name}
              </text>
              {a.float > 0 && <rect x={labelW + a.ef * scale} y={y + 6} width={a.float * scale} height={rowH - 16} rx={4} fill={isDark ? "#57534e" : "#e7e5e4"} opacity={0.8} />}
              <rect x={labelW + a.es * scale} y={y + 4} width={Math.max(2, a.duration * scale)} height={rowH - 12} rx={4} fill={a.critical ? "#dc2626" : isDark ? "#3b82f6" : "#2563eb"}>
                <title>
                  {a.id} {a.name}: starts {a.es}, finishes {a.ef} {unit}; float {a.float}
                </title>
              </rect>
              {a.duration * scale > 22 && (
                <text x={labelW + a.es * scale + (a.duration * scale) / 2} y={y + 17} fontSize={11} fill="#fff" textAnchor="middle" fontWeight={600}>
                  {a.duration}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-4 px-3 pb-2 text-xs text-stone-600 dark:text-stone-400">
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-red-600" /> Critical activity
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-blue-600" /> Non-critical activity
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-stone-300 dark:bg-stone-600" /> Float (slack)
        </span>
        <span>Time axis in {unit}</span>
      </div>
    </div>
  );
}

function Network({ acts }: { acts: ScheduledActivity[] }) {
  const { isDark } = useSettings();
  const layers = networkLayers(acts);
  const byLayer = new Map<number, ScheduledActivity[]>();
  acts.forEach((a) => {
    const l = layers.get(a.id) ?? 0;
    byLayer.set(l, [...(byLayer.get(l) ?? []), a]);
  });
  const cols = Math.max(...[...byLayer.keys()]) + 1;
  const maxRows = Math.max(...[...byLayer.values()].map((v) => v.length));
  const W = 150;
  const H = 96;
  const gapX = 50;
  const gapY = 22;
  const width = cols * (W + gapX) + 20;
  const height = maxRows * (H + gapY) + 20;
  const pos = new Map<string, { x: number; y: number }>();
  [...byLayer.entries()].forEach(([l, list]) => {
    const offset = ((maxRows - list.length) * (H + gapY)) / 2;
    list.forEach((a, i) => pos.set(a.id, { x: 10 + l * (W + gapX), y: 10 + offset + i * (H + gapY) }));
  });
  const stroke = isDark ? "#78716c" : "#a8a29e";
  return (
    <div className="scroll-thin overflow-x-auto rounded-xl border border-stone-200 p-2 dark:border-stone-800">
      <svg viewBox={`0 0 ${width} ${height}`} style={{ minWidth: Math.min(width, 900) }} role="img" aria-label="Critical path network diagram">
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={stroke} />
          </marker>
          <marker id="arr-c" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#dc2626" />
          </marker>
        </defs>
        {acts.flatMap((a) =>
          a.predecessors.map((p) => {
            const from = pos.get(p)!;
            const to = pos.get(a.id)!;
            const pa = acts.find((x) => x.id === p)!;
            const crit = pa.critical && a.critical && pa.ef === a.es;
            return (
              <path
                key={p + a.id}
                d={`M ${from.x + W} ${from.y + H / 2} C ${from.x + W + gapX / 2} ${from.y + H / 2}, ${to.x - gapX / 2} ${to.y + H / 2}, ${to.x - 2} ${to.y + H / 2}`}
                fill="none"
                stroke={crit ? "#dc2626" : stroke}
                strokeWidth={crit ? 2.5 : 1.5}
                markerEnd={`url(#${crit ? "arr-c" : "arr"})`}
              />
            );
          }),
        )}
        {acts.map((a) => {
          const p = pos.get(a.id)!;
          const fg = isDark ? "#f5f5f4" : "#1c1917";
          const sub = isDark ? "#a8a29e" : "#78716c";
          return (
            <g key={a.id} transform={`translate(${p.x},${p.y})`}>
              <rect width={W} height={H} rx={10} fill={isDark ? "#1c1916" : "#fff"} stroke={a.critical ? "#dc2626" : stroke} strokeWidth={a.critical ? 2.5 : 1.5} />
              <line x1={0} x2={W} y1={28} y2={28} stroke={stroke} />
              <line x1={0} x2={W} y1={68} y2={68} stroke={stroke} />
              <line x1={W / 2} x2={W / 2} y1={0} y2={28} stroke={stroke} />
              <line x1={W / 2} x2={W / 2} y1={68} y2={H} stroke={stroke} />
              <text x={W / 4} y={18} textAnchor="middle" fontSize={11} fill={sub}>
                ES {a.es}
              </text>
              <text x={(3 * W) / 4} y={18} textAnchor="middle" fontSize={11} fill={sub}>
                EF {a.ef}
              </text>
              <text x={W / 2} y={46} textAnchor="middle" fontSize={13} fontWeight={700} fill={fg}>
                {a.id} ({a.duration})
              </text>
              <text x={W / 2} y={61} textAnchor="middle" fontSize={10} fill={sub}>
                {a.name.length > 20 ? a.name.slice(0, 19) + "…" : a.name} · float {a.float}
              </text>
              <text x={W / 4} y={86} textAnchor="middle" fontSize={11} fill={sub}>
                LS {a.ls}
              </text>
              <text x={(3 * W) / 4} y={86} textAnchor="middle" fontSize={11} fill={sub}>
                LF {a.lf}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="px-2 pt-1 text-xs text-stone-500">Activity-on-node: ES/EF = earliest start/finish; LS/LF = latest start/finish; float = LS − ES. Red = critical path.</p>
    </div>
  );
}

function ScheduleTable({ acts }: { acts: ScheduledActivity[] }) {
  return (
    <div className="scroll-thin overflow-x-auto">
      <table className="w-full min-w-[520px] text-sm">
        <thead>
          <tr className="border-b border-stone-200 text-left text-xs text-stone-500 dark:border-stone-800">
            {["Activity", "Duration", "ES", "EF", "LS", "LF", "Float", "Critical?"].map((h) => (
              <th key={h} className="px-2 py-2 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {acts.map((a) => (
            <tr key={a.id} className={cx("border-b border-stone-100 dark:border-stone-800", a.critical && "bg-red-50/60 dark:bg-red-950/20")}>
              <td className="px-2 py-1.5 font-medium">
                {a.id} — {a.name}
              </td>
              {[a.duration, a.es, a.ef, a.ls, a.lf, a.float].map((v, i) => (
                <td key={i} className="px-2 py-1.5 tabular-nums">
                  {v}
                </td>
              ))}
              <td className="px-2 py-1.5">{a.critical ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

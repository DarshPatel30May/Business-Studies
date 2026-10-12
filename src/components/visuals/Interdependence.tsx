import { useState } from "react";
import { motion } from "motion/react";
import { CONNECTIONS, SCENARIOS } from "../../content/hsc";
import type { TopicId } from "../../content/types";
import { TOPIC_THEME, cx, topicHex } from "../../lib/theme";
import { useSettings } from "../../state/settings";
import { Segmented } from "../ui";

const POS: Record<TopicId, { x: number; y: number }> = {
  operations: { x: 110, y: 70 },
  marketing: { x: 450, y: 70 },
  finance: { x: 110, y: 290 },
  hr: { x: 450, y: 290 },
};

export function InterdependenceMap({ topic }: { topic?: TopicId }) {
  const { isDark } = useSettings();
  const initial = topic ? CONNECTIONS.find((c) => c.a === topic || c.b === topic)!.id : CONNECTIONS[0].id;
  const [sel, setSel] = useState(initial);
  const conn = CONNECTIONS.find((c) => c.id === sel)!;
  const visible = topic ? CONNECTIONS.filter((c) => c.a === topic || c.b === topic) : CONNECTIONS;

  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <svg viewBox="0 0 560 360" className="w-full" role="group" aria-label="Interdependence of the four key business functions">
          {CONNECTIONS.map((c) => {
            const a = POS[c.a];
            const b = POS[c.b];
            const active = c.id === sel;
            const related = !topic || c.a === topic || c.b === topic;
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;
            return (
              <g key={c.id} opacity={related ? 1 : 0.25}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={active ? (isDark ? "#d9b68a" : "#956236") : isDark ? "#57534e" : "#d6d3d1"} strokeWidth={active ? 5 : 3} strokeLinecap="round" />
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="transparent"
                  strokeWidth={26}
                  style={{ cursor: related ? "pointer" : "default" }}
                  onClick={() => related && setSel(c.id)}
                >
                  <title>{c.title}</title>
                </line>
                <circle cx={mx} cy={my} r={active ? 9 : 6} fill={active ? (isDark ? "#d9b68a" : "#956236") : isDark ? "#78716c" : "#a8a29e"} style={{ cursor: related ? "pointer" : "default" }} onClick={() => related && setSel(c.id)} />
              </g>
            );
          })}
          {(Object.keys(POS) as TopicId[]).map((id) => {
            const p = POS[id];
            const th = TOPIC_THEME[id];
            const dim = topic && topic !== id && !CONNECTIONS.find((c) => c.id === sel && (c.a === id || c.b === id));
            return (
              <g key={id} opacity={dim ? 0.55 : 1}>
                <rect x={p.x - 88} y={p.y - 30} width={176} height={60} rx={16} fill={topicHex(id, isDark)} />
                <text x={p.x} y={p.y + 5} textAnchor="middle" fill="#fff" fontSize={16} fontWeight={700} fontFamily="Inter Variable, sans-serif">
                  {th.label}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {visible.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSel(c.id)}
              aria-pressed={sel === c.id}
              className={cx("rounded-lg border px-2.5 py-1 text-xs font-medium", sel === c.id ? "border-bronze-500 bg-bronze-50 text-bronze-900 dark:bg-bronze-900/40 dark:text-bronze-100" : "border-stone-200 text-stone-600 dark:border-stone-700 dark:text-stone-300")}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>
      <motion.div key={conn.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 dark:border-stone-800 dark:bg-night-3" aria-live="polite">
        <p className="text-xs font-semibold tracking-wider text-bronze-600 uppercase dark:text-bronze-400">Connection</p>
        <h4 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-50">{conn.title}</h4>
        <p className="mt-2 text-[15px] leading-relaxed text-stone-800 dark:text-stone-200">{conn.summary}</p>
        <ul className="mt-3 space-y-2">
          {conn.examples.map((e) => (
            <li key={e} className="flex gap-2 text-sm text-stone-700 dark:text-stone-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze-500" />
              {e}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

export function DecisionRipple() {
  const [id, setId] = useState(SCENARIOS[0].id);
  const sc = SCENARIOS.find((s) => s.id === id)!;
  return (
    <div>
      <Segmented label="Business decision" value={id} onChange={setId} options={SCENARIOS.map((s) => ({ value: s.id, label: s.decision.split(" ").slice(0, 4).join(" ") + "…" }))} size="sm" />
      <p className="mt-4 rounded-xl bg-bronze-50 p-3 text-sm font-semibold text-bronze-950 dark:bg-bronze-950/50 dark:text-bronze-100">Decision: {sc.decision}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {(Object.keys(sc.effects) as TopicId[]).map((t, i) => (
          <motion.div key={sc.id + t} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }} className={cx("rounded-xl border p-3", TOPIC_THEME[t].border, TOPIC_THEME[t].bgSoft)}>
            <p className={cx("text-sm font-semibold", TOPIC_THEME[t].textStrong)}>{TOPIC_THEME[t].label}</p>
            <p className="mt-1 text-sm text-stone-700 dark:text-stone-300">{sc.effects[t]}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

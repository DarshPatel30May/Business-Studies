import { useState, type ReactNode } from "react";
import { ChevronDown, Lightbulb, GraduationCap, ThumbsDown, ThumbsUp, Wrench, Building2, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import type { Block, ComparisonTable, Concept, Influence, Strategy, TopicId } from "../../content/types";
import { BookmarkButton, Callout, Card, SectionHeading, Badge } from "../ui";
import { FlowDiagram } from "./FlowDiagram";
import { useSettings } from "../../state/settings";
import { TOPIC_THEME, cx } from "../../lib/theme";
import { VisualRegistry } from "../visuals/registry";

function Supplementary() {
  return <Badge className="bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300">Supplementary</Badge>;
}

export function ConceptCard({ c, topic, section }: { c: Concept; topic: TopicId; section: string }) {
  const { mode } = useSettings();
  const t = TOPIC_THEME[topic];
  return (
    <Card id={c.id} className="scroll-mt-28 p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className={cx("font-display text-lg font-semibold", t.textStrong)}>{c.term}</h3>
        <div className="flex items-center gap-1">
          {c.supplementary && <Supplementary />}
          <BookmarkButton id={`concept:${c.id}`} title={c.term} to={`/topic/${topic}/${section}?focus=${c.id}`} kind="Concept" topic={topic} />
        </div>
      </div>
      <p className="mt-2 text-[15px] leading-relaxed font-medium text-stone-800 dark:text-stone-200">{c.definition}</p>
      {mode === "beginner" && c.simple && (
        <p className="mt-3 flex gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <span className="font-semibold">In simple terms: </span>
            {c.simple}
          </span>
        </p>
      )}
      {c.explanation && <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">{c.explanation}</p>}
      {c.example && (
        <p className="mt-3 flex gap-2 text-sm text-stone-700 dark:text-stone-300">
          <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
          <span>
            <span className="font-semibold">Example: </span>
            {c.example}
          </span>
        </p>
      )}
      {mode === "advanced" && c.advanced && (
        <p className="mt-3 flex gap-2 rounded-xl border border-bronze-200 bg-bronze-50/70 p-3 text-sm text-bronze-950 dark:border-bronze-800 dark:bg-bronze-950/40 dark:text-bronze-100">
          <GraduationCap className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <span className="font-semibold">HSC depth: </span>
            {c.advanced}
          </span>
        </p>
      )}
    </Card>
  );
}

function List({ items, icon, tone }: { items: string[]; icon: ReactNode; tone: string }) {
  return (
    <ul className="space-y-1.5">
      {items.map((x) => (
        <li key={x} className="flex gap-2 text-sm leading-snug text-stone-700 dark:text-stone-300">
          <span className={cx("mt-0.5 shrink-0", tone)}>{icon}</span>
          <span>{x}</span>
        </li>
      ))}
    </ul>
  );
}

export function InfluenceCard({ inf, topic }: { inf: Influence; topic: TopicId }) {
  const { mode } = useSettings();
  const t = TOPIC_THEME[topic];
  const [open, setOpen] = useState(true);
  return (
    <Card id={inf.id} className="scroll-mt-28 overflow-hidden">
      <div className={cx("flex items-start justify-between gap-2 border-b p-5", t.border, t.bgSoft)}>
        <div>
          <p className="text-[11px] font-semibold tracking-wider text-stone-500 uppercase">Influence</p>
          <h3 className={cx("font-display text-lg font-semibold", t.textStrong)}>{inf.name}</h3>
        </div>
        <div className="flex items-center gap-1">
          <BookmarkButton id={`inf:${inf.id}`} title={inf.name} to={`/topic/${topic}/influences?focus=${inf.id}`} kind="Influence" topic={topic} />
          <button type="button" onClick={() => setOpen(!open)} className="rounded-lg p-1.5 text-stone-500 hover:bg-white/60 dark:hover:bg-stone-800" aria-expanded={open} aria-label={open ? "Collapse" : "Expand"}>
            <ChevronDown className={cx("h-4 w-4 transition-transform", open ? "rotate-180" : "")} />
          </button>
        </div>
      </div>
      {open && (
        <div className="grid gap-4 p-5 md:grid-cols-2">
          <div className="space-y-3 md:col-span-2">
            <p className="text-sm leading-relaxed text-stone-800 dark:text-stone-200">
              <span className="font-semibold">1. Meaning — </span>
              {inf.meaning}
            </p>
            <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">
              <span className="font-semibold">2. Effect on operations/management — </span>
              {inf.effect}
            </p>
          </div>
          <div className="rounded-xl bg-emerald-50/70 p-3 dark:bg-emerald-950/30">
            <p className="mb-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">3. Potential positive effects</p>
            <List items={inf.positive} icon={<TrendingUp className="h-3.5 w-3.5" />} tone="text-emerald-600" />
          </div>
          <div className="rounded-xl bg-red-50/70 p-3 dark:bg-red-950/25">
            <p className="mb-2 text-xs font-semibold text-red-800 dark:text-red-300">4. Potential negative effects</p>
            <List items={inf.negative} icon={<TrendingDown className="h-3.5 w-3.5" />} tone="text-red-600" />
          </div>
          <div className="rounded-xl bg-stone-50 p-3 dark:bg-night-3">
            <p className="mb-2 text-xs font-semibold text-stone-700 dark:text-stone-300">5. Management responses</p>
            <List items={inf.responses} icon={<Wrench className="h-3.5 w-3.5" />} tone="text-bronze-600" />
          </div>
          <div className="rounded-xl bg-stone-50 p-3 dark:bg-night-3">
            <p className="mb-2 text-xs font-semibold text-stone-700 dark:text-stone-300">6. Business example</p>
            <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">{inf.example}</p>
          </div>
          {mode === "advanced" && inf.advanced && (
            <p className="flex gap-2 rounded-xl border border-bronze-200 bg-bronze-50/70 p-3 text-sm text-bronze-950 md:col-span-2 dark:border-bronze-800 dark:bg-bronze-950/40 dark:text-bronze-100">
              <GraduationCap className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <span className="font-semibold">HSC depth: </span>
                {inf.advanced}
              </span>
            </p>
          )}
        </div>
      )}
    </Card>
  );
}

export function StrategyCard({ s, topic }: { s: Strategy; topic: TopicId }) {
  const t = TOPIC_THEME[topic];
  return (
    <Card id={s.id} className="scroll-mt-28 overflow-hidden">
      <div className="flex items-start justify-between gap-2 p-5 pb-0">
        <div>
          <p className={cx("text-[11px] font-semibold tracking-wider uppercase", t.text)}>Strategy</p>
          <h3 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-50">{s.name}</h3>
        </div>
        <div className="flex items-center gap-1">
          {s.supplementary && <Supplementary />}
          <BookmarkButton id={`str:${s.id}`} title={s.name} to={`/topic/${topic}/strategies?focus=${s.id}`} kind="Strategy" topic={topic} />
        </div>
      </div>
      <div className="space-y-3 p-5">
        <p className="text-[15px] leading-relaxed font-medium text-stone-800 dark:text-stone-200">{s.definition}</p>
        {s.how && <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">{s.how}</p>}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900 dark:bg-emerald-950/25">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              <ThumbsUp className="h-3.5 w-3.5" /> Advantages
            </p>
            <List items={s.advantages} icon={<span>+</span>} tone="text-emerald-700 font-bold" />
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50/60 p-3 dark:border-red-900 dark:bg-red-950/20">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-red-800 dark:text-red-300">
              <ThumbsDown className="h-3.5 w-3.5" /> Disadvantages
            </p>
            <List items={s.disadvantages} icon={<span>−</span>} tone="text-red-700 font-bold" />
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">
            <span className="font-semibold">When it is appropriate: </span>
            {s.application}
          </p>
          <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">
            <span className="font-semibold">Effectiveness: </span>
            {s.effectiveness}
          </p>
        </div>
        {s.example && (
          <p className="flex gap-2 rounded-xl bg-stone-50 p-3 text-sm text-stone-700 dark:bg-night-3 dark:text-stone-300">
            <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
            <span>
              <span className="font-semibold">Example: </span>
              {s.example}
            </span>
          </p>
        )}
      </div>
    </Card>
  );
}

export function ComparisonView({ table, topic }: { table: ComparisonTable; topic?: TopicId }) {
  const t = topic ? TOPIC_THEME[topic] : null;
  return (
    <Card id={table.id} className="scroll-mt-28 overflow-hidden">
      <div className="p-5 pb-3">
        <h3 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-50">{table.title}</h3>
        {table.caption && <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{table.caption}</p>}
      </div>
      <div className="scroll-thin overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className={cx(t ? t.bgSoft : "bg-stone-50 dark:bg-night-3")}>
              {table.columns.map((c, i) => (
                <th key={c + i} scope="col" className="border-y border-stone-200 px-4 py-2 text-left text-xs font-semibold text-stone-700 dark:border-stone-800 dark:text-stone-300">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r) => (
              <tr key={r.label} className="align-top odd:bg-white even:bg-stone-50/50 dark:odd:bg-night-2 dark:even:bg-night-3/50">
                <th scope="row" className="border-b border-stone-200 px-4 py-2.5 text-left font-semibold text-stone-900 dark:border-stone-800 dark:text-stone-100">
                  {r.label}
                </th>
                {r.cells.map((c, i) => (
                  <td key={i} className="border-b border-stone-200 px-4 py-2.5 leading-snug text-stone-700 dark:border-stone-800 dark:text-stone-300">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function ProsConsView({ id, title, pros, cons }: { id: string; title: string; pros: string[]; cons: string[] }) {
  return (
    <Card id={id} className="scroll-mt-28 p-5">
      <h3 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-50">{title}</h3>
      <div className="mt-4 grid gap-0 overflow-hidden rounded-xl border border-stone-200 sm:grid-cols-2 dark:border-stone-800">
        <div className="bg-emerald-50/70 p-4 dark:bg-emerald-950/25">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            <ThumbsUp className="h-4 w-4" /> Advantages
          </p>
          <ul className="space-y-2">
            {pros.map((p) => (
              <li key={p} className="rounded-lg bg-white px-3 py-2 text-sm shadow-sm dark:bg-night-2">
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-red-50/70 p-4 dark:bg-red-950/20">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-800 dark:text-red-300">
            <ThumbsDown className="h-4 w-4" /> Disadvantages
          </p>
          <ul className="space-y-2">
            {cons.map((p) => (
              <li key={p} className="rounded-lg bg-white px-3 py-2 text-sm shadow-sm dark:bg-night-2">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

export function VisualBlock({ id, visual, title, caption, topic, section }: { id: string; visual: string; title: string; caption?: string; topic: TopicId; section: string }) {
  const Comp = VisualRegistry[visual];
  const t = TOPIC_THEME[topic];
  return (
    <Card id={id} className="scroll-mt-28 overflow-hidden">
      <div className={cx("flex items-start justify-between gap-3 border-b px-5 py-4", t.border)}>
        <div>
          <p className={cx("flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase", t.text)}>
            <Sparkles className="h-3 w-3" /> Interactive
          </p>
          <h3 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-50">{title}</h3>
          {caption && <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">{caption}</p>}
        </div>
        <BookmarkButton id={`vis:${id}`} title={title} to={`/topic/${topic}/${section}?focus=${id}`} kind="Visual" topic={topic} />
      </div>
      <div className="p-4 sm:p-5">{Comp ? <Comp topic={topic} /> : <p className="text-sm text-red-600">Visual “{visual}” is not registered.</p>}</div>
    </Card>
  );
}

export function BlockRenderer({ blocks, topic, section }: { blocks: Block[]; topic: TopicId; section: string }) {
  const { visualOnly } = useSettings();
  return (
    <div className="space-y-6">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "heading":
            return <SectionHeading key={b.id} id={b.id} title={b.title} intro={visualOnly ? undefined : b.intro} />;
          case "concepts":
            if (visualOnly)
              return (
                <div key={i} className="grid gap-2 sm:grid-cols-2">
                  {b.items.map((c) => (
                    <div key={c.id} id={c.id} className="scroll-mt-28 rounded-xl border border-stone-200 bg-white px-3 py-2 dark:border-stone-800 dark:bg-night-2">
                      <p className={cx("text-sm font-semibold", TOPIC_THEME[topic].textStrong)}>{c.term}</p>
                      <p className="text-xs text-stone-600 dark:text-stone-400">{c.definition}</p>
                    </div>
                  ))}
                </div>
              );
            return (
              <div key={i} className="grid gap-4 lg:grid-cols-2">
                {b.items.map((c) => (
                  <ConceptCard key={c.id} c={c} topic={topic} section={section} />
                ))}
              </div>
            );
          case "influences":
            if (visualOnly)
              return (
                <div key={i} className="grid gap-2 sm:grid-cols-2">
                  {b.items.map((x) => (
                    <div key={x.id} id={x.id} className="scroll-mt-28 rounded-xl border border-stone-200 bg-white p-3 text-xs dark:border-stone-800 dark:bg-night-2">
                      <p className={cx("text-sm font-semibold", TOPIC_THEME[topic].textStrong)}>{x.name}</p>
                      <p className="mt-1 text-emerald-700 dark:text-emerald-400">+ {x.positive[0]}</p>
                      <p className="text-red-700 dark:text-red-400">− {x.negative[0]}</p>
                    </div>
                  ))}
                </div>
              );
            return (
              <div key={i} className="space-y-4">
                {b.items.map((x) => (
                  <InfluenceCard key={x.id} inf={x} topic={topic} />
                ))}
              </div>
            );
          case "strategies":
            if (visualOnly)
              return (
                <div key={i} className="grid gap-2 sm:grid-cols-2">
                  {b.items.map((x) => (
                    <div key={x.id} id={x.id} className="scroll-mt-28 rounded-xl border border-stone-200 bg-white p-3 text-xs dark:border-stone-800 dark:bg-night-2">
                      <p className={cx("text-sm font-semibold", TOPIC_THEME[topic].textStrong)}>{x.name}</p>
                      <p className="mt-1 text-emerald-700 dark:text-emerald-400">+ {x.advantages[0]}</p>
                      <p className="text-red-700 dark:text-red-400">− {x.disadvantages[0]}</p>
                    </div>
                  ))}
                </div>
              );
            return (
              <div key={i} className="space-y-4">
                {b.items.map((x) => (
                  <StrategyCard key={x.id} s={x} topic={topic} />
                ))}
              </div>
            );
          case "visual":
            return <VisualBlock key={b.id} id={b.id} visual={b.visual} title={b.title} caption={b.caption} topic={topic} section={section} />;
          case "comparison":
            return <ComparisonView key={b.table.id} table={b.table} topic={topic} />;
          case "flow":
            return (
              <Card key={b.flow.id} id={b.flow.id} className="scroll-mt-28 p-5">
                <h3 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-50">{b.flow.title}</h3>
                {b.flow.caption && <p className="mt-1 text-sm text-stone-500">{b.flow.caption}</p>}
                <div className="mt-4">
                  <FlowDiagram flow={b.flow} />
                </div>
              </Card>
            );
          case "callout":
            if (visualOnly) return null;
            return (
              <Callout key={i} tone={b.tone} title={b.title}>
                {b.text}
              </Callout>
            );
          case "proscons":
            return <ProsConsView key={b.id} id={b.id} title={b.title} pros={b.pros} cons={b.cons} />;
        }
      })}
    </div>
  );
}

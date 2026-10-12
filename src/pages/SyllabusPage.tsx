import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Circle, ListChecks, ExternalLink } from "lucide-react";
import { TOPICS, allDotPoints, flattenDotPoints } from "../content";
import type { DotPoint } from "../content/types";
import { TOPIC_THEME, cx } from "../lib/theme";
import { Bar, Button, Callout, Card, PageHeader, ProgressRing, Segmented } from "../components/ui";
import { useProgress } from "../state/progress";

export default function SyllabusPage() {
  const { checklist, toggleDotPoint } = useProgress();
  const [filter, setFilter] = useState<"all" | "todo" | "done">("all");
  const total = TOPICS.flatMap(allDotPoints);
  const pct = (total.filter((d) => checklist[d.id]).length / total.length) * 100;

  const Row = ({ dp, topicId, depth }: { dp: DotPoint; topicId: string; depth: number }) => {
    const done = !!checklist[dp.id];
    if ((filter === "todo" && done) || (filter === "done" && !done)) return null;
    return (
      <li className={cx("flex items-start gap-2.5 py-1", depth > 0 && "ml-6")}>
        <button type="button" onClick={() => toggleDotPoint(dp.id)} aria-pressed={done} aria-label={`Toggle: ${dp.text}`} className="mt-0.5 shrink-0">
          {done ? <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" /> : <Circle className="h-4.5 w-4.5 text-stone-300 dark:text-stone-600" />}
        </button>
        <span className={cx("flex-1 text-sm", done && "text-stone-500")}>{dp.text}</span>
        {dp.link && (
          <Link to={`/topic/${topicId}/${dp.link.section}${dp.link.anchor ? `?focus=${dp.link.anchor}` : ""}`} className="shrink-0 text-bronze-700 dark:text-bronze-400" aria-label={`Study: ${dp.text}`}>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        )}
      </li>
    );
  };

  const renderTree = (points: DotPoint[], topicId: string, depth = 0): React.ReactNode =>
    points.map((p) => (
      <div key={p.id}>
        <Row dp={p} topicId={topicId} depth={depth} />
        {p.children && renderTree(p.children, topicId, depth + 1)}
      </div>
    ));

  return (
    <div className="space-y-6">
      <PageHeader icon={<ListChecks className="h-6 w-6" />} title="Interactive syllabus explorer" subtitle="Every HSC Business Studies dot point across the four topics. Tick off what you understand; each dot point links to where it is taught.">
        <div className="flex items-center gap-3">
          <ProgressRing value={pct} size={56} />
          <span className="text-sm text-stone-500">overall</span>
        </div>
      </PageHeader>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented label="Filter dot points" value={filter} onChange={setFilter} options={[{ value: "all", label: "All" }, { value: "todo", label: "Still to learn" }, { value: "done", label: "Completed" }]} />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {TOPICS.map((t) => {
          const th = TOPIC_THEME[t.id];
          const dps = allDotPoints(t);
          const p = (dps.filter((d) => checklist[d.id]).length / dps.length) * 100;
          return (
            <Card key={t.id} className={cx("border-t-4 p-5", th.border)}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className={cx("text-xs font-semibold tracking-wider uppercase", th.text)}>Topic {t.number}</p>
                  <Link to={`/topic/${t.id}/syllabus`} className="font-display text-xl font-semibold hover:underline">{t.name}</Link>
                </div>
                <span className="text-sm font-semibold tabular-nums">{Math.round(p)}%</span>
              </div>
              <Bar value={p} color={th.hex} className="mt-2" />
              {t.syllabus.map((a) => {
                const ids = flattenDotPoints(a.learnAbout).map((d) => d.id);
                const allDone = ids.every((id) => checklist[id]);
                return (
                  <div key={a.id} className="mt-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">{a.title}</p>
                      <Button size="sm" variant="ghost" onClick={() => ids.forEach((id) => toggleDotPoint(id, !allDone))}>
                        {allDone ? "Untick all" : "Tick all"}
                      </Button>
                    </div>
                    <ul>{renderTree(a.learnAbout, t.id)}</ul>
                  </div>
                );
              })}
              <div className="mt-4">
                <p className="text-sm font-semibold">Students learn to</p>
                <ul>{renderTree(t.learnTo, t.id)}</ul>
              </div>
            </Card>
          );
        })}
      </div>
      <Callout tone="syllabus" title="Source">
        NSW Education Standards Authority (NESA), Business Studies Stage 6 Syllabus (2010) — HSC course. Dot points are reproduced in condensed form and 'learn to' statements are paraphrased; consult the official syllabus for exact wording.
      </Callout>
    </div>
  );
}

import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Download, NotebookPen, Upload, Trash2 } from "lucide-react";
import { Bar as RBar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TOPICS } from "../content";
import { MCQS } from "../content/questions/mcq";
import { SHORT_ANSWERS } from "../content/questions/shortAnswer";
import { TOPIC_THEME, cx, topicHex } from "../lib/theme";
import { useStats, areaLabel, areaSection } from "../state/stats";
import { useProgress } from "../state/progress";
import { Bar, Button, Callout, Card, EmptyState, PageHeader, Stat } from "../components/ui";
import { useChartTheme } from "../components/visuals/chartKit";

export default function ProgressPage() {
  const stats = useStats();
  const { attempts, resetAll, exportJson, importJson, bookmarks } = useProgress();
  const ch = useChartTheme();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  const topicData = stats.topics.map((t) => ({ name: TOPIC_THEME[t.topic].label, topic: t.topic, accuracy: t.accuracy ?? 0, attempts: t.attempts }));
  const kindLabel: Record<string, string> = { mcq: "Multiple choice", short: "Short answer", report: "Business report", extended: "Extended response" };

  const recommendations: { text: string; to: string }[] = [];
  stats.weak.slice(0, 3).forEach((w) => {
    const a = areaLabel(w.key);
    if (a) recommendations.push({ text: `Revise ${TOPIC_THEME[a.topic].label}: ${a.title} (${w.accuracy}% accuracy over ${w.attempts} questions)`, to: `/topic/${a.topic}/${areaSection(w.key)}` });
  });
  stats.topics.filter((t) => t.attempts === 0).forEach((t) => recommendations.push({ text: `You have not practised ${TOPIC_THEME[t.topic].label} questions yet`, to: `/exam?tab=mcq&topic=${t.topic}` }));
  stats.topics.filter((t) => t.checklistPct < 50).forEach((t) => recommendations.push({ text: `${TOPIC_THEME[t.topic].label} syllabus checklist is ${Math.round(t.checklistPct)}% complete`, to: `/topic/${t.topic}/syllabus` }));
  if (!stats.byKind.find((k) => k.key === "short")) recommendations.push({ text: "Try Section II short-answer questions with marking criteria", to: "/exam?tab=short" });
  if (!stats.byKind.find((k) => k.key === "report")) recommendations.push({ text: "Practise a Section III business report", to: "/report-builder" });
  if (!stats.byKind.find((k) => k.key === "extended")) recommendations.push({ text: "Plan and write a Section IV extended response", to: "/extended-response" });

  return (
    <div className="space-y-6">
      <PageHeader icon={<NotebookPen className="h-6 w-6" />} title="Progress and weak-topic identification" subtitle="Your practice results, syllabus checklist and recommendations — calculated from your actual attempts and stored only in this browser." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Questions attempted" value={stats.totalAttempts} sub={`of ${MCQS.length + SHORT_ANSWERS.length} MCQ and short-answer items`} />
        <Stat label="Overall accuracy" value={stats.overallAccuracy === null ? "–" : `${stats.overallAccuracy}%`} sub="latest attempt per question" />
        <Stat label="Syllabus checklist" value={`${Math.round(stats.overallChecklist)}%`} sub="dot points ticked" />
        <Stat label="Bookmarks" value={bookmarks.length} sub={<Link to="/bookmarks" className="underline">view</Link>} />
      </div>

      <Card className="p-5">
        <p className="font-semibold">Recommendations based on your results</p>
        {recommendations.length === 0 ? (
          <p className="mt-2 text-sm text-stone-500">Great work — no gaps detected. Keep practising at HSC difficulty.</p>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {recommendations.slice(0, 8).map((r) => (
              <li key={r.text}>
                <Link to={r.to} className="flex items-center justify-between gap-2 rounded-xl border border-stone-200 px-3 py-2 text-sm hover:border-stone-400 dark:border-stone-800">
                  {r.text} <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <p className="font-semibold">Accuracy by topic</p>
          {attempts.length === 0 ? (
            <EmptyState title="No practice yet">Attempt some questions in the <Link to="/exam" className="underline">exam centre</Link>.</EmptyState>
          ) : (
            <div className="mt-2 h-60">
              <ResponsiveContainer>
                <BarChart data={topicData} margin={{ top: 10, right: 10, left: -10 }}>
                  <CartesianGrid {...ch.gridProps} />
                  <XAxis dataKey="name" {...ch.axisProps} />
                  <YAxis {...ch.axisProps} domain={[0, 100]} tickFormatter={(x) => `${x}%`} />
                  <Tooltip {...ch.tooltipProps} formatter={(x: number, _n, p) => [`${x}% (${p.payload.attempts} attempts)`, "Accuracy"]} />
                  <RBar dataKey="accuracy" radius={[4, 4, 0, 0]} maxBarSize={56}>
                    {topicData.map((d) => <Cell key={d.topic} fill={topicHex(d.topic, ch.isDark)} />)}
                  </RBar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
        <Card className="p-5">
          <p className="font-semibold">By question type and difficulty</p>
          <div className="mt-3 space-y-3">
            {stats.byKind.length === 0 && <p className="text-sm text-stone-500">No data yet.</p>}
            {stats.byKind.map((k) => (
              <div key={k.key}>
                <div className="flex justify-between text-sm"><span>{kindLabel[k.key]}</span><span className="tabular-nums">{k.accuracy}% · {k.attempts}</span></div>
                <Bar value={k.accuracy ?? 0} />
              </div>
            ))}
            {stats.byDifficulty.map((k) => (
              <div key={k.key}>
                <div className="flex justify-between text-sm"><span className="capitalize">{k.key === "hsc" ? "HSC difficulty" : k.key}</span><span className="tabular-nums">{k.accuracy}% · {k.attempts}</span></div>
                <Bar value={k.accuracy ?? 0} color="#2563eb" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <p className="font-semibold">By syllabus area</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {TOPICS.flatMap((t) =>
            t.syllabus.map((a) => {
              const b = stats.byArea.find((x) => x.key === a.id);
              return (
                <div key={a.id} className="rounded-xl border border-stone-200 p-3 dark:border-stone-800">
                  <div className="flex justify-between gap-2 text-sm">
                    <span><span className={cx("font-semibold", TOPIC_THEME[t.id].text)}>{t.name}</span> · {a.title}</span>
                    <span className="shrink-0 tabular-nums">{b ? `${b.accuracy}% (${b.attempts})` : "—"}</span>
                  </div>
                  <Bar value={b?.accuracy ?? 0} color={TOPIC_THEME[t.id].hex} className="mt-2" />
                </div>
              );
            }),
          )}
        </div>
      </Card>

      <Card className="space-y-3 p-5">
        <p className="font-semibold">Your data</p>
        <p className="text-sm text-stone-600 dark:text-stone-400">Progress is stored in this browser's local storage — no account or server. Export a backup to move it to another device.</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              const blob = new Blob([exportJson()], { type: "application/json" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = "hsc-business-studies-progress.json";
              a.click();
              URL.revokeObjectURL(a.href);
            }}
          >
            <Download className="h-4 w-4" /> Export progress
          </Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" /> Import progress
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setMsg(importJson(await f.text()) ? "Progress imported." : "That file could not be read.");
              e.target.value = "";
            }}
          />
          {!confirmReset ? (
            <Button variant="ghost" onClick={() => setConfirmReset(true)}>
              <Trash2 className="h-4 w-4" /> Reset all progress
            </Button>
          ) : (
            <span className="flex items-center gap-2 text-sm">
              Delete all progress, attempts and bookmarks?
              <Button variant="danger" size="sm" onClick={() => { resetAll(); setConfirmReset(false); setMsg("Progress reset."); }}>Yes, reset</Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>Cancel</Button>
            </span>
          )}
        </div>
        {msg && <p className="text-sm text-emerald-700 dark:text-emerald-400" role="status">{msg}</p>}
      </Card>
      <Callout tone="info" title="How weak topics are identified">
        Only your most recent attempt at each question counts. A syllabus area is flagged when you have at least two attempts and accuracy below 65%. Self-assessed reports and essays count as their indicative mark out of 20.
      </Callout>
    </div>
  );
}

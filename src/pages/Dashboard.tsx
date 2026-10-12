import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Calculator, ClipboardCheck, FileText, FlaskConical, Gauge, Layers, Library, Network, PenLine, Sigma, Target, ListChecks } from "lucide-react";
import { TOPICS } from "../content";
import { EXAM_STRUCTURE } from "../content/hsc";
import { TOPIC_THEME, cx } from "../lib/theme";
import { useStats, areaLabel, areaSection } from "../state/stats";
import { Bar, Card, ProgressRing, Callout } from "../components/ui";
import { useProgress } from "../state/progress";

const TOOLS = [
  { to: "/interdependence", label: "Interdependence map", desc: "How the four functions connect", icon: Network },
  { to: "/calculator", label: "Ratio calculator", desc: "Step-by-step working and interpretation", icon: Calculator },
  { to: "/finance-lab", label: "Finance lab", desc: "Statements, ratios and cash flow", icon: FlaskConical },
  { to: "/simulation", label: "Business simulation", desc: "Run a business for four quarters", icon: Gauge },
  { to: "/formulas", label: "Formula centre", desc: "Every ratio with worked examples", icon: Sigma },
  { to: "/case-studies", label: "Case studies", desc: "Verified real-world businesses", icon: Library },
  { to: "/report-builder", label: "Report builder", desc: "Section III business report", icon: FileText },
  { to: "/extended-response", label: "Extended response", desc: "Section IV planning and verbs", icon: PenLine },
  { to: "/exam", label: "Exam practice", desc: "MCQ, short answer, report, essay", icon: ClipboardCheck },
  { to: "/flashcards", label: "Flashcards", desc: "Terms and formulas", icon: Layers },
  { to: "/syllabus", label: "Syllabus checklist", desc: "Track every dot point", icon: ListChecks },
];

export default function Dashboard() {
  const stats = useStats();
  const { visited } = useProgress();
  const lastVisited = Object.entries(visited).sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 dark:border-stone-800 dark:bg-night-2">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-bronze-400/15 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-xs font-semibold tracking-widest text-bronze-600 uppercase dark:text-bronze-400">NSW HSC 2026 · Business Studies Stage 6 Syllabus (2010)</p>
            <h1 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-stone-900 sm:text-5xl dark:text-stone-50">
              Understand the whole HSC Business Studies course — visually.
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">
              Four topics, every syllabus dot point, interactive diagrams, financial calculators, simulations, verified case studies and HSC-style practice. Your progress is saved in this browser.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={lastVisited ? `/topic/${lastVisited}` : "/topic/operations/overview"} className="inline-flex items-center gap-2 rounded-xl bg-bronze-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-bronze-800 dark:bg-bronze-500 dark:text-night">
                {lastVisited ? "Continue where you left off" : "Start with Topic 1: Operations"} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/exam" className="inline-flex items-center gap-2 rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold hover:bg-stone-50 dark:border-stone-700 dark:hover:bg-stone-800">
                Practise HSC questions
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 self-center">
            <div className="rounded-2xl bg-stone-50 p-4 dark:bg-night-3">
              <p className="text-xs text-stone-500">Syllabus checklist</p>
              <div className="mt-2 flex items-center gap-3">
                <ProgressRing value={stats.overallChecklist} size={52} />
                <p className="text-sm text-stone-600 dark:text-stone-400">of dot points ticked</p>
              </div>
            </div>
            <div className="rounded-2xl bg-stone-50 p-4 dark:bg-night-3">
              <p className="text-xs text-stone-500">Practice accuracy</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums">{stats.overallAccuracy === null ? "–" : `${stats.overallAccuracy}%`}</p>
              <p className="text-xs text-stone-500">{stats.totalAttempts} questions attempted</p>
            </div>
            <div className="col-span-2 rounded-2xl bg-stone-50 p-4 dark:bg-night-3">
              <p className="text-xs text-stone-500">HSC examination</p>
              <p className="mt-1 text-sm">
                <span className="font-semibold">{EXAM_STRUCTURE.total} marks</span> · {EXAM_STRUCTURE.writingTime} writing · {EXAM_STRUCTURE.readingTime} reading
              </p>
              <div className="mt-2 flex h-2.5 overflow-hidden rounded-full">
                {EXAM_STRUCTURE.sections.map((s, i) => (
                  <div key={s.id} style={{ width: `${s.marks}%` }} className={cx("h-full", ["bg-orange-500", "bg-violet-500", "bg-emerald-500", "bg-blue-500"][i], i > 0 && "border-l-2 border-white dark:border-night-3")} title={`${s.name}: ${s.marks} marks`} />
                ))}
              </div>
              <p className="mt-1 text-[11px] text-stone-500">Section I 20 · Section II 40 · Section III 20 · Section IV 20</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-2xl font-semibold text-stone-900 dark:text-stone-50">The four HSC topics</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {TOPICS.map((t, i) => {
            const th = TOPIC_THEME[t.id];
            const s = stats.topics.find((x) => x.topic === t.id)!;
            const Icon = th.icon;
            return (
              <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/topic/${t.id}/overview`} className={cx("group relative block overflow-hidden rounded-3xl border bg-white p-6 transition-shadow hover:shadow-lg dark:bg-night-2", th.border)}>
                  <div className={cx("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80", th.gradient)} />
                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div className={cx("grid h-12 w-12 place-items-center rounded-2xl text-white", th.bgSolid)}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <ProgressRing value={s.checklistPct} color={th.hex} label={`${t.name} checklist ${Math.round(s.checklistPct)}%`} />
                    </div>
                    <p className={cx("mt-4 text-xs font-semibold tracking-wider uppercase", th.text)}>Topic {t.number}</p>
                    <h3 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-50">{t.name}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">{t.focus}</p>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-stone-500">Dot points</p>
                        <p className="font-semibold tabular-nums">
                          {s.checked}/{s.totalDotPoints}
                        </p>
                      </div>
                      <div>
                        <p className="text-stone-500">Sections read</p>
                        <p className="font-semibold tabular-nums">
                          {s.sectionsVisited}/{s.totalSections}
                        </p>
                      </div>
                      <div>
                        <p className="text-stone-500">Accuracy</p>
                        <p className="font-semibold tabular-nums">{s.accuracy === null ? "–" : `${s.accuracy}%`}</p>
                      </div>
                    </div>
                    <Bar value={s.checklistPct} color={th.hex} className="mt-3" />
                    <p className={cx("mt-4 flex items-center gap-1 text-sm font-semibold", th.text)}>
                      Open topic <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {stats.weak.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-semibold">
            <Target className="h-5 w-5 text-red-600" /> Focus areas from your practice
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {stats.weak.slice(0, 3).map((w) => {
              const a = areaLabel(w.key);
              if (!a) return null;
              return (
                <Card key={w.key} className="p-4">
                  <p className={cx("text-xs font-semibold", TOPIC_THEME[a.topic].text)}>{TOPIC_THEME[a.topic].label}</p>
                  <p className="font-semibold">{a.title}</p>
                  <p className="text-sm text-stone-500">
                    {w.accuracy}% accuracy over {w.attempts} questions
                  </p>
                  <Link to={`/topic/${a.topic}/${areaSection(w.key)}`} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-bronze-700 dark:text-bronze-400">
                    Revise this area <ArrowRight className="h-4 w-4" />
                  </Link>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 font-display text-2xl font-semibold text-stone-900 dark:text-stone-50">Labs, tools and HSC preparation</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <Link key={t.to} to={t.to} className="group flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-4 transition-colors hover:border-bronze-300 dark:border-stone-800 dark:bg-night-2 dark:hover:border-bronze-700">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-bronze-100 text-bronze-800 dark:bg-bronze-900/50 dark:text-bronze-200">
                <t.icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-semibold text-stone-900 dark:text-stone-100">{t.label}</span>
                <span className="block text-sm text-stone-500">{t.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Callout tone="syllabus" title="About this guide">
        Content follows the NESA Business Studies Stage 6 Syllabus (2010), which applies to the 2026 HSC. Syllabus dot points are reproduced in condensed form — always check the official syllabus on the NESA website. Items marked “Supplementary” are optional explanations beyond the syllabus. Simulations use fictional, illustrative data.
      </Callout>
    </div>
  );
}

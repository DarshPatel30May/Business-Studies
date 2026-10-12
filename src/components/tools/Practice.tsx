import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, XCircle, Pause, Play, RotateCcw, Timer as TimerIcon, ChevronRight, Eye } from "lucide-react";
import { MCQS, type Difficulty, type MCQ } from "../../content/questions/mcq";
import { SHORT_ANSWERS, type ShortAnswer } from "../../content/questions/shortAnswer";
import type { TopicId } from "../../content/types";
import { analyseWriting, countWords, requiresJudgement, type FeedbackReport } from "../../lib/feedback";
import { groupBy, latestAttempts, suggestDifficulty } from "../../lib/analytics";
import { TOPIC_THEME, cx } from "../../lib/theme";
import { useProgress } from "../../state/progress";
import { usePersistentState } from "../../state/storage";
import { Bar, Button, Callout, Card, Disclaimer, Segmented, Tag, TextArea, TopicBadge, Select } from "../ui";

// ---------------------------------------------------------------------------
// Feedback panel
// ---------------------------------------------------------------------------

export function FeedbackPanel({ report }: { report: FeedbackReport }) {
  const levelText = ["Not evident", "Limited", "Sound", "Strong"];
  return (
    <div className="space-y-3">
      <Disclaimer>Automated feedback looks for terminology, stimulus references, cause-and-effect language and judgement words. It is a guide only — it cannot judge accuracy or quality the way NESA's human markers do, and it is not a mark.</Disclaimer>
      <div className="grid gap-2 md:grid-cols-2">
        {report.criteria.map((c) => (
          <div key={c.id} className="rounded-xl border border-stone-200 p-3 dark:border-stone-800">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">{c.label}</p>
              <Tag tone={c.level >= 3 ? "good" : c.level === 2 ? "neutral" : c.level === 1 ? "warn" : "bad"}>{levelText[c.level]}</Tag>
            </div>
            <Bar value={(c.level / 3) * 100} color={c.level >= 2 ? "#059669" : c.level === 1 ? "#d97706" : "#dc2626"} className="mt-2" />
            <p className="mt-2 text-xs text-stone-600 dark:text-stone-400">{c.advice}</p>
            {c.found.length > 0 && <p className="mt-1 text-[11px] text-stone-500">Found: {c.found.slice(0, 8).join(", ")}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Countdown timer
// ---------------------------------------------------------------------------

export function Timer({ minutes, label }: { minutes: number; label?: string }) {
  const [left, setLeft] = useState(minutes * 60);
  const [running, setRunning] = useState(false);
  const ref = useRef<number | null>(null);
  useEffect(() => setLeft(minutes * 60), [minutes]);
  useEffect(() => {
    if (!running) return;
    ref.current = window.setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => {
      if (ref.current) window.clearInterval(ref.current);
    };
  }, [running]);
  useEffect(() => {
    if (left === 0) setRunning(false);
  }, [left]);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <div className={cx("inline-flex items-center gap-2 rounded-xl border px-3 py-1.5", left === 0 ? "border-red-400 bg-red-50 dark:bg-red-950/30" : left < 300 ? "border-amber-400" : "border-stone-300 dark:border-stone-700")}>
      <TimerIcon className="h-4 w-4" />
      <span className="text-xs text-stone-500">{label ?? "Timer"}</span>
      <span className="font-semibold tabular-nums" aria-live="off">
        {mm}:{ss}
      </span>
      <button type="button" onClick={() => setRunning(!running)} aria-label={running ? "Pause timer" : "Start timer"} className="rounded p-1 hover:bg-stone-100 dark:hover:bg-stone-800">
        {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
      <button type="button" onClick={() => { setRunning(false); setLeft(minutes * 60); }} aria-label="Reset timer" className="rounded p-1 hover:bg-stone-100 dark:hover:bg-stone-800">
        <RotateCcw className="h-4 w-4" />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MCQ practice
// ---------------------------------------------------------------------------

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Deterministic option order per question so the answer letter is not always the same. */
export function optionOrder(q: MCQ): number[] {
  const order = [0, 1, 2, 3];
  let h = hash(q.id);
  for (let i = order.length - 1; i > 0; i--) {
    const j = h % (i + 1);
    h = Math.floor(h / (i + 1)) + 7919;
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

type DiffChoice = Difficulty | "adaptive" | "all";

export function McqPractice({ initialTopic }: { initialTopic?: TopicId | "all" }) {
  const { attempts, recordAttempt } = useProgress();
  const [cfg, setCfg] = usePersistentState("exam:mcq-config", { topic: (initialTopic ?? "all") as TopicId | "all", difficulty: "adaptive" as DiffChoice, count: 10, marking: "immediate" as "immediate" | "delayed" });
  const [quiz, setQuiz] = useState<MCQ[] | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [i, setI] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialTopic) setCfg((c) => ({ ...c, topic: initialTopic }));
  }, [initialTopic, setCfg]);

  const adaptiveLevel = useMemo(() => {
    const latest = latestAttempts(attempts.filter((a) => a.kind === "mcq" && (cfg.topic === "all" || a.topic === cfg.topic)));
    const last10 = [...latest].sort((a, b) => b.at - a.at).slice(0, 10);
    const acc = groupBy(last10, () => "x")[0]?.accuracy ?? null;
    const lastDiff = last10[0]?.difficulty ?? "medium";
    return suggestDifficulty(acc, lastDiff);
  }, [attempts, cfg.topic]);

  const start = () => {
    let pool = MCQS.filter((q) => cfg.topic === "all" || q.topic === cfg.topic);
    const target = cfg.difficulty === "adaptive" ? adaptiveLevel : cfg.difficulty;
    if (target !== "all") {
      const exact = pool.filter((q) => q.difficulty === target);
      const rest = pool.filter((q) => q.difficulty !== target);
      pool = [...exact, ...(cfg.difficulty === "adaptive" ? rest : [])];
    }
    // Prefer questions not yet answered correctly, then shuffle deterministically by time seed.
    const correct = new Set(attempts.filter((a) => a.kind === "mcq" && a.score === a.max).map((a) => a.qid));
    const seed = Date.now();
    pool = [...pool].sort((a, b) => Number(correct.has(a.id)) - Number(correct.has(b.id)) || (hash(a.id + seed) % 1000) - (hash(b.id + seed) % 1000));
    setQuiz(pool.slice(0, cfg.count));
    setAnswers({});
    setI(0);
    setSubmitted(false);
  };

  const choose = (q: MCQ, original: number) => {
    if (answers[q.id] !== undefined && (cfg.marking === "immediate" || submitted)) return;
    setAnswers((a) => ({ ...a, [q.id]: original }));
    if (cfg.marking === "immediate") recordAttempt({ qid: q.id, kind: "mcq", topic: q.topic, area: q.area, difficulty: q.difficulty, score: original === q.answer ? 1 : 0, max: 1 });
  };

  const submitAll = () => {
    if (!quiz) return;
    setSubmitted(true);
    quiz.forEach((q) => {
      if (answers[q.id] !== undefined) recordAttempt({ qid: q.id, kind: "mcq", topic: q.topic, area: q.area, difficulty: q.difficulty, score: answers[q.id] === q.answer ? 1 : 0, max: 1 });
    });
  };

  if (!quiz) {
    return (
      <Card className="space-y-4 p-5">
        <p className="font-semibold">Section I — objective-response practice</p>
        <div className="grid gap-3 md:grid-cols-2">
          <Select label="Topic" value={cfg.topic} onChange={(v) => setCfg((c) => ({ ...c, topic: v }))} options={[{ value: "all", label: "All topics (mixed, like the HSC)" }, ...(["operations", "marketing", "finance", "hr"] as TopicId[]).map((t) => ({ value: t, label: TOPIC_THEME[t].label }))]} />
          <Select
            label="Difficulty"
            value={cfg.difficulty}
            onChange={(v) => setCfg((c) => ({ ...c, difficulty: v }))}
            options={[
              { value: "adaptive", label: `Adaptive (currently: ${adaptiveLevel === "hsc" ? "HSC exam" : adaptiveLevel})` },
              { value: "easy", label: "Easy" },
              { value: "medium", label: "Medium" },
              { value: "hard", label: "Hard" },
              { value: "hsc", label: "HSC exam difficulty" },
              { value: "all", label: "All difficulties" },
            ]}
          />
          <Select label="Number of questions" value={String(cfg.count)} onChange={(v) => setCfg((c) => ({ ...c, count: Number(v) }))} options={[{ value: "5", label: "5" }, { value: "10", label: "10" }, { value: "20", label: "20 (full Section I)" }]} />
          <Select label="Marking" value={cfg.marking} onChange={(v) => setCfg((c) => ({ ...c, marking: v }))} options={[{ value: "immediate", label: "Immediate — feedback after each question" }, { value: "delayed", label: "Delayed — mark at the end (exam style)" }]} />
        </div>
        <p className="text-xs text-stone-500">Adaptive mode moves up a level when your recent accuracy is 80% or more and down when it is below 50%. Unanswered or previously incorrect questions are prioritised.</p>
        <Button onClick={start}>Start practice</Button>
      </Card>
    );
  }

  if (quiz.length === 0) return <Callout tone="info" title="No questions match">Try a different topic or difficulty.<Button variant="ghost" onClick={() => setQuiz(null)}>Back</Button></Callout>;

  const q = quiz[i];
  const order = optionOrder(q);
  const picked = answers[q.id];
  const reveal = (cfg.marking === "immediate" && picked !== undefined) || submitted;
  const score = quiz.filter((x) => answers[x.id] === x.answer).length;
  const done = cfg.marking === "immediate" ? Object.keys(answers).length === quiz.length : submitted;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-stone-500">
          Question {i + 1} of {quiz.length} · Answered {Object.keys(answers).length}
          {done && ` · Score ${score}/${quiz.length}`}
        </p>
        <div className="flex gap-2">
          {cfg.marking === "delayed" && !submitted && (
            <Button size="sm" onClick={submitAll} disabled={Object.keys(answers).length === 0}>
              Submit and mark
            </Button>
          )}
          <Button size="sm" variant="secondary" onClick={() => setQuiz(null)}>
            New practice set
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {quiz.map((x, j) => {
          const a = answers[x.id];
          const show = (cfg.marking === "immediate" && a !== undefined) || submitted;
          return (
            <button
              key={x.id}
              type="button"
              onClick={() => setI(j)}
              aria-label={`Go to question ${j + 1}`}
              className={cx(
                "h-8 w-8 rounded-lg border text-xs font-semibold",
                j === i && "ring-2 ring-bronze-500",
                show ? (a === x.answer ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40" : a !== undefined ? "border-red-500 bg-red-50 dark:bg-red-950/30" : "border-stone-300") : a !== undefined ? "border-bronze-500 bg-bronze-50 dark:bg-bronze-900/40" : "border-stone-300 dark:border-stone-700",
              )}
            >
              {j + 1}
            </button>
          );
        })}
      </div>
      <Card className="p-5">
        <div className="flex flex-wrap gap-1.5">
          <TopicBadge topic={q.topic} />
          <Tag>{q.difficulty === "hsc" ? "HSC difficulty" : q.difficulty}</Tag>
          <Tag>{q.type}</Tag>
        </div>
        {q.stimulus && <p className="mt-3 rounded-xl border-l-4 border-bronze-400 bg-stone-50 p-3 text-sm dark:bg-night-3">{q.stimulus}</p>}
        <p className="mt-3 font-display text-lg font-semibold">
          {i + 1}. {q.question}
        </p>
        <div className="mt-3 space-y-2" role="radiogroup" aria-label="Answer options">
          {order.map((orig, pos) => {
            const isPicked = picked === orig;
            const isCorrect = orig === q.answer;
            return (
              <button
                key={orig}
                type="button"
                role="radio"
                aria-checked={isPicked}
                onClick={() => choose(q, orig)}
                className={cx(
                  "flex w-full items-start gap-3 rounded-xl border-2 p-3 text-left text-sm transition-colors",
                  reveal && isCorrect ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" : reveal && isPicked ? "border-red-500 bg-red-50 dark:bg-red-950/30" : isPicked ? "border-bronze-500 bg-bronze-50 dark:bg-bronze-900/30" : "border-stone-200 hover:border-stone-400 dark:border-stone-700",
                )}
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-current text-xs font-bold">{"ABCD"[pos]}</span>
                <span className="flex-1">{q.options[orig]}</span>
                {reveal && isCorrect && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />}
                {reveal && isPicked && !isCorrect && <XCircle className="h-5 w-5 shrink-0 text-red-600" />}
              </button>
            );
          })}
        </div>
        {reveal && (
          <div className="mt-4 space-y-2 text-sm">
            <p className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950/30">
              <span className="font-semibold">Correct answer: {"ABCD"[order.indexOf(q.answer)]}. </span>
              {q.explanation}
            </p>
            <div className="rounded-xl bg-stone-50 p-3 dark:bg-night-3">
              <p className="font-semibold">Why the other options are wrong</p>
              <ul className="mt-1 space-y-1">
                {order.map((orig, pos) => (orig === q.answer ? null : <li key={orig}><span className="font-semibold">{"ABCD"[pos]}:</span> {q.distractors[orig]}</li>))}
              </ul>
            </div>
          </div>
        )}
        <div className="mt-4 flex justify-between">
          <Button variant="ghost" size="sm" disabled={i === 0} onClick={() => setI(i - 1)}>
            Previous
          </Button>
          <Button size="sm" disabled={i === quiz.length - 1} onClick={() => setI(i + 1)}>
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
      {done && (
        <Callout tone={score / quiz.length >= 0.7 ? "info" : "warning"} title={`Result: ${score}/${quiz.length} (${Math.round((score / quiz.length) * 100)}%)`}>
          {score / quiz.length >= 0.8 ? "Excellent — adaptive mode will step up the difficulty." : score / quiz.length >= 0.5 ? "Solid. Review the explanations for the questions you missed." : "Revise the related topic sections, then try again — adaptive mode will adjust the difficulty."} Your results are saved in Progress.
        </Callout>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Short-answer practice
// ---------------------------------------------------------------------------

export function ShortAnswerPractice({ initialTopic }: { initialTopic?: TopicId | "all" }) {
  const { recordAttempt } = useProgress();
  const [topic, setTopic] = useState<TopicId | "all">(initialTopic ?? "all");
  const [marks, setMarks] = useState<string>("all");
  const list = SHORT_ANSWERS.filter((s) => (topic === "all" || s.topic === topic) && (marks === "all" || String(s.marks) === marks));
  const [id, setId] = useState(list[0]?.id);
  const q = list.find((s) => s.id === id) ?? list[0];
  useEffect(() => {
    if (initialTopic) setTopic(initialTopic);
  }, [initialTopic]);
  return (
    <div className="space-y-4">
      <Card className="grid gap-3 p-5 md:grid-cols-3">
        <Select label="Topic" value={topic} onChange={setTopic} options={[{ value: "all", label: "All topics" }, ...(["operations", "marketing", "finance", "hr"] as TopicId[]).map((t) => ({ value: t, label: TOPIC_THEME[t].label }))]} />
        <Select label="Marks" value={marks} onChange={setMarks} options={[{ value: "all", label: "Any" }, ...["2", "3", "4", "5", "6"].map((m) => ({ value: m, label: `${m} marks` }))]} />
        <Select label="Question" value={q?.id ?? ""} onChange={setId} options={list.map((s, i) => ({ value: s.id, label: `${i + 1}. (${s.marks} marks) ${s.question.slice(0, 60)}…` }))} />
      </Card>
      {q ? <ShortAnswerItem key={q.id} q={q} onRecord={(score) => recordAttempt({ qid: q.id, kind: "short", topic: q.topic, area: q.area, difficulty: q.difficulty, score, max: q.marks })} /> : <Callout tone="info" title="No questions match">Change the filters.</Callout>}
    </div>
  );
}

function ShortAnswerItem({ q, onRecord }: { q: ShortAnswer; onRecord: (score: number) => void }) {
  const [text, setText] = usePersistentState<string>(`sa:${q.id}`, "");
  const [shown, setShown] = useState(false);
  const [self, setSelf] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const report = useMemo(
    () => analyseWriting(text, { keyTerms: q.keyTerms, stimulusTerms: q.stimulusTerms ?? [], requiresJudgement: requiresJudgement(q.verb), wordRange: [q.marks * 15, q.marks * 60] }, "paragraph"),
    [text, q],
  );
  const numericMatch = useMemo(() => {
    if (!q.numeric) return null;
    const nums = (text.match(/-?\d+(?:[.,]\d+)?/g) ?? []).map((n) => Number(n.replace(/,/g, "")));
    return nums.some((n) => Math.abs(n - q.numeric!.answer) <= q.numeric!.tolerance + 1e-9);
  }, [text, q]);
  return (
    <Card className="space-y-4 p-5">
      <div className="flex flex-wrap items-center gap-1.5">
        <TopicBadge topic={q.topic} />
        <Tag>{q.marks} marks</Tag>
        <Tag>Directive: {q.verb}</Tag>
        <Tag>{q.type}</Tag>
      </div>
      {q.stimulus && <p className="rounded-xl border-l-4 border-bronze-400 bg-stone-50 p-3 text-sm dark:bg-night-3">{q.stimulus}</p>}
      <p className="font-display text-lg font-semibold">{q.question}</p>
      <TextArea label={`Your answer (${countWords(text)} words) — saved automatically`} value={text} onChange={setText} rows={8} placeholder="Write your answer here…" />
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setShown(true)} disabled={!text.trim()}>
          <Eye className="h-4 w-4" /> Check my answer
        </Button>
        <Button variant="ghost" onClick={() => setShown(true)}>
          Show marking criteria and sample
        </Button>
      </div>
      {shown && (
        <div className="space-y-4">
          {q.numeric && text.trim() && (
            <Callout tone={numericMatch ? "info" : "warning"} title={numericMatch ? "Calculation: correct final answer found" : "Calculation: the expected answer was not found"}>
              Expected answer: {q.numeric.answer}
              {q.numeric.unit === "%" ? "%" : ` ${q.numeric.unit}`}. Check your working shows the formula, substitution and correct format.
            </Callout>
          )}
          {text.trim() && <FeedbackPanel report={report} />}
          <div className="rounded-xl border border-stone-200 p-4 dark:border-stone-800">
            <p className="text-sm font-semibold">Marking criteria</p>
            <table className="mt-2 w-full text-sm">
              <tbody>
                {q.criteria.map((c) => (
                  <tr key={c.marks} className="border-t border-stone-100 align-top dark:border-stone-800">
                    <td className="w-16 py-1.5 font-semibold">{c.marks}</td>
                    <td className="py-1.5">{c.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-stone-500">Original criteria written in the style of NESA marking guidelines.</p>
          </div>
          <div className="rounded-xl bg-emerald-50/70 p-4 text-sm dark:bg-emerald-950/25">
            <p className="font-semibold">Sample answer</p>
            <p className="mt-1 leading-relaxed whitespace-pre-line">{q.sample}</p>
          </div>
          <div className="rounded-xl border border-stone-200 p-4 dark:border-stone-800">
            <p className="text-sm font-semibold">Self-assessment: how many marks would your answer earn against the criteria?</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Segmented label="Self-assessed mark" value={self === null ? "" : String(self)} onChange={(v) => { setSelf(Number(v)); setSaved(false); }} options={Array.from({ length: q.marks + 1 }, (_, i) => ({ value: String(i), label: String(i) }))} size="sm" />
              <Button size="sm" disabled={self === null || saved} onClick={() => { onRecord(self!); setSaved(true); }}>
                {saved ? "Saved to progress" : "Save result"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ClipboardCheck } from "lucide-react";
import { EXAM_STRUCTURE, REPORT_CRITERIA, EXTENDED_CRITERIA, BANDS_20 } from "../content/hsc";
import { REPORTS, REPORT_TIME_GUIDE } from "../content/questions/reports";
import { EXTENDED, EXTENDED_SETS } from "../content/questions/extended";
import { MCQS } from "../content/questions/mcq";
import { SHORT_ANSWERS } from "../content/questions/shortAnswer";
import type { TopicId } from "../content/types";
import { Button, Callout, Card, PageHeader, Select, Tabs, TextArea, TopicBadge, Checkbox } from "../components/ui";
import { FeedbackPanel, McqPractice, ShortAnswerPractice, Timer } from "../components/tools/Practice";
import { analyseWriting, countWords } from "../lib/feedback";
import { usePersistentState } from "../state/storage";
import { useProgress } from "../state/progress";
import { cx } from "../lib/theme";

type Tab = "overview" | "mcq" | "short" | "report" | "extended";

export default function ExamCentre() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get("tab") as Tab) ?? "overview";
  const topicParam = params.get("topic") as TopicId | null;
  const setTab = (t: Tab) => {
    const p = new URLSearchParams(params);
    p.set("tab", t);
    setParams(p, { replace: true });
  };
  return (
    <div className="space-y-6">
      <PageHeader icon={<ClipboardCheck className="h-6 w-6" />} title="HSC Exam Preparation Centre" subtitle={`Practise every section of the ${EXAM_STRUCTURE.total}-mark HSC examination: ${EXAM_STRUCTURE.writingTime} writing time plus ${EXAM_STRUCTURE.readingTime} reading time.`} />
      <Tabs
        ariaLabel="Exam sections"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "overview", label: "Exam structure" },
          { id: "mcq", label: `Section I — MCQ (${MCQS.length})` },
          { id: "short", label: `Section II — Short answer (${SHORT_ANSWERS.length})` },
          { id: "report", label: `Section III — Business report (${REPORTS.length})` },
          { id: "extended", label: `Section IV — Extended response (${EXTENDED.length})` },
        ]}
      />
      {tab === "overview" && <Overview go={setTab} />}
      {tab === "mcq" && <McqPractice initialTopic={topicParam ?? undefined} />}
      {tab === "short" && <ShortAnswerPractice initialTopic={topicParam ?? undefined} />}
      {tab === "report" && <ReportPractice />}
      {tab === "extended" && <ExtendedPractice />}
    </div>
  );
}

function Overview({ go }: { go: (t: Tab) => void }) {
  const tabs: Tab[] = ["mcq", "short", "report", "extended"];
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        {EXAM_STRUCTURE.sections.map((s, i) => (
          <Card key={s.id} className="p-5">
            <div className="flex items-start justify-between gap-2">
              <p className="font-display text-lg font-semibold">{s.name}</p>
              <span className="rounded-lg bg-bronze-100 px-2 py-1 text-sm font-bold text-bronze-900 dark:bg-bronze-900/50 dark:text-bronze-100">{s.marks} marks</span>
            </div>
            <p className="mt-1 text-sm text-stone-500">{s.time}</p>
            <p className="mt-2 text-sm text-stone-700 dark:text-stone-300">{s.format}</p>
            <Button size="sm" className="mt-3" onClick={() => go(tabs[i])}>
              Practise {s.name.split(" — ")[0]}
            </Button>
          </Card>
        ))}
      </div>
      <Callout tone="syllabus" title="Examination specifications">{EXAM_STRUCTURE.note}</Callout>
      <Card className="p-5">
        <p className="font-semibold">Time management (3 hours)</p>
        <div className="mt-3 flex h-8 overflow-hidden rounded-xl text-xs font-semibold text-white">
          <div className="flex items-center justify-center bg-orange-600" style={{ width: `${(35 / 180) * 100}%` }}>I · 35 min</div>
          <div className="flex items-center justify-center border-l-2 border-white bg-violet-600 dark:border-night-2" style={{ width: `${(75 / 180) * 100}%` }}>II · 75 min</div>
          <div className="flex items-center justify-center border-l-2 border-white bg-emerald-600 dark:border-night-2" style={{ width: `${(35 / 180) * 100}%` }}>III · 35 min</div>
          <div className="flex items-center justify-center border-l-2 border-white bg-blue-600 dark:border-night-2" style={{ width: `${(35 / 180) * 100}%` }}>IV · 35 min</div>
        </div>
        <ul className="mt-3 space-y-1 text-sm text-stone-700 dark:text-stone-300">
          <li>• Reading time: read the Section III stimulus and Section IV choices to start planning mentally.</li>
          <li>• Section I: about 1.5 minutes per question — flag calculation questions and return to them.</li>
          <li>• Section II: roughly 1.8 minutes per mark; let the marks guide the length.</li>
          <li>• Sections III and IV: plan for about 5 minutes before writing.</li>
        </ul>
      </Card>
      <Card className="p-5">
        <p className="font-semibold">Adaptive practice and tracking</p>
        <p className="mt-1 text-sm text-stone-700 dark:text-stone-300">Questions are tagged by topic, syllabus area, question type and four difficulty levels (easy, medium, hard, HSC exam difficulty). Your results are saved locally and analysed on the <Link to="/progress" className="font-semibold underline">Progress</Link> page, which recommends areas to revise.</p>
      </Card>
    </div>
  );
}

function SelfAssess({ criteria, onSave, qid, topic, area, kind }: { criteria: string[]; onSave?: () => void; qid: string; topic: TopicId; area: string; kind: "report" | "extended" }) {
  const { recordAttempt } = useProgress();
  const [scores, setScores] = useState<number[]>(criteria.map(() => 3));
  const [saved, setSaved] = useState(false);
  const total = Math.round((scores.reduce((a, b) => a + b, 0) / (criteria.length * 5)) * 20);
  const band = BANDS_20.find((b) => {
    const [lo, hi] = b.range.split("–").map(Number);
    return total >= lo && total <= hi;
  });
  return (
    <div className="rounded-xl border border-stone-200 p-4 dark:border-stone-800">
      <p className="text-sm font-semibold">Self-assessment against the criteria (0 = not shown, 5 = excellent)</p>
      <div className="mt-2 space-y-2">
        {criteria.map((c, i) => (
          <div key={c} className="grid items-center gap-2 sm:grid-cols-[1fr_200px]">
            <span className="text-sm">{c}</span>
            <input type="range" min={0} max={5} value={scores[i]} aria-label={c} onChange={(e) => { const n = [...scores]; n[i] = Number(e.target.value); setScores(n); setSaved(false); }} className="accent-bronze-600" />
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm">
        Indicative mark: <span className="font-semibold">{total}/20</span> {band && <>— band {band.range}: {band.text}</>}
      </p>
      <Button size="sm" className="mt-2" disabled={saved} onClick={() => { recordAttempt({ qid, kind, topic, area, score: total, max: 20 }); setSaved(true); onSave?.(); }}>
        {saved ? "Saved to progress" : "Save self-assessment"}
      </Button>
      <p className="mt-2 text-xs text-stone-500">Self-assessment helps you reflect; it is not an official mark.</p>
    </div>
  );
}

function BandsTable() {
  return (
    <table className="w-full text-sm">
      <tbody>
        {BANDS_20.map((b) => (
          <tr key={b.range} className="border-t border-stone-100 align-top dark:border-stone-800">
            <td className="w-16 py-1.5 font-semibold">{b.range}</td>
            <td className="py-1.5">{b.text}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ReportPractice() {
  const [id, setId] = useState(REPORTS[0].id);
  const r = REPORTS.find((x) => x.id === id)!;
  const [text, setText] = usePersistentState<string>(`exam-report:${id}`, "");
  const [show, setShow] = useState(false);
  const fb = useMemo(() => analyseWriting(text, { keyTerms: r.keyTerms, stimulusTerms: r.stimulusTerms, requiresJudgement: true, wordRange: [500, 1100] }, "report"), [text, r]);
  return (
    <div className="space-y-4">
      <Card className="flex flex-wrap items-end justify-between gap-3 p-5">
        <div className="min-w-64 flex-1">
          <Select label="Business report question" value={id} onChange={(v) => { setId(v); setShow(false); }} options={REPORTS.map((x) => ({ value: x.id, label: x.title }))} />
        </div>
        <Timer minutes={35} label="Section III" />
      </Card>
      <Card className="space-y-3 p-5">
        <div className="flex flex-wrap gap-1.5">{r.topics.map((t) => <TopicBadge key={t} topic={t} />)}</div>
        <p className="font-display text-lg font-semibold">{r.question}</p>
        <div className="rounded-xl border-l-4 border-bronze-400 bg-stone-50 p-4 text-sm leading-relaxed dark:bg-night-3">
          {r.stimulus.map((p) => <p key={p} className="mb-2 last:mb-0">{p}</p>)}
          {r.table && (
            <div className="scroll-thin mt-3 overflow-x-auto">
              <table className="w-full min-w-[360px] text-sm tabular-nums">
                <caption className="pb-1 text-left text-xs font-semibold text-stone-500">{r.table.caption}</caption>
                <thead><tr>{r.table.columns.map((c) => <th key={c} className="border-b border-stone-300 px-2 py-1 text-left dark:border-stone-700">{c}</th>)}</tr></thead>
                <tbody>{r.table.rows.map((row) => <tr key={row[0]}>{row.map((c, i) => <td key={i} className="border-b border-stone-200 px-2 py-1 dark:border-stone-800">{c}</td>)}</tr>)}</tbody>
              </table>
            </div>
          )}
        </div>
        <p className="text-sm text-stone-600 dark:text-stone-400">Need help structuring it? Use the step-by-step <Link to={`/report-builder?q=${r.id}`} className="font-semibold underline">Business Report Builder</Link>.</p>
      </Card>
      <Card className="space-y-3 p-5">
        <TextArea label={`Your business report (${countWords(text)} words) — saved automatically`} value={text} onChange={setText} rows={16} placeholder={"Title\n\nExecutive summary\n...\n\nHeading 1\n...\n\nRecommendations\n..."} />
        <Button onClick={() => setShow(true)}>Check against criteria</Button>
      </Card>
      {show && (
        <div className="space-y-4">
          {text.trim() && <FeedbackPanel report={fb} />}
          <Card className="p-5">
            <p className="font-semibold">In your answer you will be assessed on how well you:</p>
            <ul className="mt-1 list-disc pl-5 text-sm">{REPORT_CRITERIA.map((c) => <li key={c}>{c}</li>)}</ul>
            <p className="mt-4 font-semibold">Indicative marking bands</p>
            <BandsTable />
          </Card>
          <Card className="p-5">
            <p className="font-semibold">Model response plan</p>
            <div className="mt-2 grid gap-3 md:grid-cols-2">
              {r.modelPlan.map((s) => (
                <div key={s.heading} className="rounded-xl bg-stone-50 p-3 text-sm dark:bg-night-3">
                  <p className="font-semibold">{s.heading}</p>
                  <ul className="mt-1 space-y-1">{s.points.map((p) => <li key={p}>• {p}</li>)}</ul>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm font-semibold">Time guide</p>
            <ul className="text-sm">{REPORT_TIME_GUIDE.map((t) => <li key={t.task}>• {t.minutes} min — {t.task}</li>)}</ul>
          </Card>
          <SelfAssess criteria={REPORT_CRITERIA} qid={r.id} topic={r.topics[0]} area={`${r.topics[0] === "operations" ? "ops" : r.topics[0] === "marketing" ? "mkt" : r.topics[0] === "finance" ? "fin" : "hr"}-strategies`} kind="report" />
        </div>
      )}
    </div>
  );
}

function ExtendedPractice() {
  const [setId, setSetId] = useState(EXTENDED_SETS[0].id);
  const set = EXTENDED_SETS.find((s) => s.id === setId)!;
  const [qid, setQid] = useState(set.questions[0]);
  const q = EXTENDED.find((e) => e.id === (set.questions.includes(qid) ? qid : set.questions[0]))!;
  const [plan, setPlan] = usePersistentState<string>(`exam-ext-plan:${q.id}`, "");
  const [text, setText] = usePersistentState<string>(`exam-ext:${q.id}`, "");
  const [show, setShow] = useState(false);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const fb = useMemo(() => analyseWriting(text, { keyTerms: q.keyTerms, stimulusTerms: [], requiresJudgement: ["Evaluate", "Assess", "Discuss", "Recommend", "Justify"].includes(q.verb), wordRange: [600, 1100] }, "essay"), [text, q]);
  const CHECK = ["Clear thesis that answers the question and uses the directive verb", "Each body paragraph starts with a topic sentence", "Accurate syllabus terminology throughout", "At least one specific, dated case study example", "Cause-and-effect analysis of impacts on business performance", "Judgement (if required) sustained throughout, not only in the conclusion", "Conclusion restates the judgement"];
  return (
    <div className="space-y-4">
      <Card className="flex flex-wrap items-end justify-between gap-3 p-5">
        <div className="flex flex-wrap items-end gap-3">
          <Select label="Practice set" value={setId} onChange={(v) => { setSetId(v); setQid(EXTENDED_SETS.find((s) => s.id === v)!.questions[0]); setShow(false); }} options={EXTENDED_SETS.map((s) => ({ value: s.id, label: s.label }))} />
        </div>
        <Timer minutes={35} label="Section IV" />
      </Card>
      <p className="text-sm text-stone-600 dark:text-stone-400">Answer EITHER question — they come from different topics, as in the HSC.</p>
      <div className="grid gap-3 md:grid-cols-2">
        {set.questions.map((id, i) => {
          const e = EXTENDED.find((x) => x.id === id)!;
          return (
            <button key={id} type="button" onClick={() => { setQid(id); setShow(false); }} aria-pressed={q.id === id} className={cx("rounded-2xl border-2 p-4 text-left", q.id === id ? "border-bronze-500 bg-bronze-50 dark:bg-bronze-900/30" : "border-stone-200 dark:border-stone-800")}>
              <p className="text-xs font-semibold text-stone-500">Question {24 + i}</p>
              <div className="mt-1"><TopicBadge topic={e.topic} /></div>
              <p className="mt-2 font-display text-[15px] font-semibold">{e.question}</p>
            </button>
          );
        })}
      </div>
      <Card className="space-y-3 p-5">
        <TextArea label="Plan (thesis, arguments, case studies)" value={plan} onChange={setPlan} rows={5} />
        <TextArea label={`Response (${countWords(text)} words) — about 800 words is a common guide`} value={text} onChange={setText} rows={18} />
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setShow(true)}>Check against criteria</Button>
          <Link to={`/extended-response?q=${q.id}`} className="rounded-xl px-3 py-2 text-sm font-semibold underline">Open the planner for this question</Link>
        </div>
      </Card>
      {show && (
        <div className="space-y-4">
          {text.trim() && <FeedbackPanel report={fb} />}
          <Card className="space-y-3 p-5">
            <p className="font-semibold">In your answer you will be assessed on how well you:</p>
            <ul className="list-disc pl-5 text-sm">{EXTENDED_CRITERIA.map((c) => <li key={c}>{c}</li>)}</ul>
            <p className="font-semibold">Quality checklist</p>
            <div className="space-y-1.5">{CHECK.map((c) => <Checkbox key={c} checked={!!checks[c]} onChange={(v) => setChecks((s) => ({ ...s, [c]: v }))} label={c} />)}</div>
            <p className="font-semibold">Indicative marking bands</p>
            <BandsTable />
          </Card>
          <Card className="p-5">
            <p className="font-semibold">Model plan</p>
            <p className="mt-1 text-sm"><span className="font-semibold">Thesis: </span>{q.plan.thesis}</p>
            <div className="mt-2 grid gap-2 md:grid-cols-3">
              {q.plan.paragraphs.map((p) => (
                <div key={p.point} className="rounded-xl bg-stone-50 p-3 text-xs dark:bg-night-3">
                  <p className="text-sm font-semibold">{p.point}</p>
                  <p><span className="font-semibold">Explain: </span>{p.explanation}</p>
                  <p><span className="font-semibold">Apply: </span>{p.application}</p>
                  <p><span className="font-semibold">Evaluate: </span>{p.evaluation}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-sm"><span className="font-semibold">Conclusion: </span>{q.plan.conclusion}</p>
            {q.sample && (
              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-semibold text-bronze-700 dark:text-bronze-400">Read the original sample response ({countWords(q.sample)} words)</summary>
                <div className="mt-2 space-y-3 font-display text-[15px] leading-relaxed">{q.sample.split("\n\n").map((p) => <p key={p.slice(0, 30)}>{p}</p>)}</div>
              </details>
            )}
          </Card>
          <SelfAssess criteria={EXTENDED_CRITERIA} qid={q.id} topic={q.topic} area={q.area} kind="extended" />
        </div>
      )}
    </div>
  );
}


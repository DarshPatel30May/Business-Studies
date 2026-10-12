import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowDown, ArrowUp, CheckCircle2, FileText, Plus, Trash2, XCircle, Printer } from "lucide-react";
import { REPORTS, REPORT_STRUCTURE_GUIDE, REPORT_TIME_GUIDE, type ReportQuestion } from "../content/questions/reports";
import { REPORT_CRITERIA, BANDS_20 } from "../content/hsc";
import type { TopicId } from "../content/types";
import { Button, Callout, Card, Checkbox, PageHeader, TextArea, TopicBadge } from "../components/ui";
import { FeedbackPanel, Timer } from "../components/tools/Practice";
import { analyseWriting, countWords } from "../lib/feedback";
import { TOPIC_THEME, cx } from "../lib/theme";
import { usePersistentState } from "../state/storage";

interface BuilderState {
  step: number;
  read: boolean;
  problems: number[];
  problemsChecked: boolean;
  functions: TopicId[];
  functionsChecked: boolean;
  strategies: number[];
  strategiesChecked: boolean;
  structure: string[];
  drafts: Record<string, string>;
}

const STEPS = ["Select question", "Read stimulus", "Identify problems", "Business functions", "Choose strategies", "Organise structure", "Draft paragraphs", "Check against criteria"];

const fresh = (r: ReportQuestion): BuilderState => ({
  step: 1,
  read: false,
  problems: [],
  problemsChecked: false,
  functions: [],
  functionsChecked: false,
  strategies: [],
  strategiesChecked: false,
  structure: ["Title", ...r.structure],
  drafts: {},
});

function Stimulus({ r }: { r: ReportQuestion }) {
  return (
    <div className="rounded-xl border-l-4 border-bronze-400 bg-stone-50 p-4 text-sm leading-relaxed dark:bg-night-3">
      {r.stimulus.map((p) => (
        <p key={p} className="mb-2 last:mb-0">{p}</p>
      ))}
      {r.table && (
        <div className="scroll-thin mt-3 overflow-x-auto">
          <table className="w-full min-w-[360px] text-sm tabular-nums">
            <caption className="pb-1 text-left text-xs font-semibold text-stone-500">{r.table.caption}</caption>
            <thead>
              <tr>{r.table.columns.map((c) => <th key={c} className="border-b border-stone-300 px-2 py-1 text-left dark:border-stone-700">{c}</th>)}</tr>
            </thead>
            <tbody>
              {r.table.rows.map((row) => (
                <tr key={row[0]}>{row.map((c, i) => <td key={i} className="border-b border-stone-200 px-2 py-1 dark:border-stone-800">{c}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ReportBuilder() {
  const [params] = useSearchParams();
  const [qid, setQid] = usePersistentState<string>("report:current", params.get("q") ?? REPORTS[0].id);
  const r = REPORTS.find((x) => x.id === qid) ?? REPORTS[0];
  const [st, setSt] = usePersistentState<BuilderState>(`report:${r.id}`, fresh(r));
  const set = (patch: Partial<BuilderState>) => setSt((s) => ({ ...s, ...patch }));
  const [newHeading, setNewHeading] = useState("");

  const fullText = useMemo(() => st.structure.map((h) => `${h}\n\n${st.drafts[h] ?? ""}`).join("\n\n"), [st.structure, st.drafts]);
  const fb = useMemo(() => analyseWriting(fullText, { keyTerms: r.keyTerms, stimulusTerms: r.stimulusTerms, requiresJudgement: true, wordRange: [500, 1100] }, "report"), [fullText, r]);
  const words = countWords(Object.values(st.drafts).join(" "));

  const structureFeedback = useMemo(() => {
    const s = st.structure.map((x) => x.toLowerCase());
    const out: { ok: boolean; text: string }[] = [];
    const es = s.findIndex((x) => x.includes("executive summary"));
    out.push({ ok: es >= 0 && es <= 1, text: es < 0 ? "Add an executive summary near the start." : es <= 1 ? "Executive summary is at the start." : "Move the executive summary to the start (after the title)." });
    const rec = s.findIndex((x) => x.includes("recommend"));
    out.push({ ok: rec >= 0 && rec >= s.length - 3, text: rec < 0 ? "Add a recommendations section." : rec >= s.length - 3 ? "Recommendations come near the end." : "Recommendations usually follow your analysis — move them later." });
    const con = s.findIndex((x) => x.includes("conclusion"));
    out.push({ ok: con === -1 || con === s.length - 1, text: con === -1 ? "A short conclusion is optional but recommended." : con === s.length - 1 ? "Conclusion is last." : "Place the conclusion last." });
    const body = s.filter((x) => !["title", "executive summary", "introduction", "recommendations", "conclusion"].some((k) => x.includes(k)));
    out.push({ ok: body.length >= 2, text: body.length >= 2 ? `${body.length} body sections with headings.` : "Add at least two body sections with headings linked to the question." });
    return out;
  }, [st.structure]);

  const move = (i: number, d: -1 | 1) => {
    const s = [...st.structure];
    const j = i + d;
    if (j < 0 || j >= s.length) return;
    [s[i], s[j]] = [s[j], s[i]];
    set({ structure: s });
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={<FileText className="h-6 w-6" />} title="Business Report Builder" subtitle="A step-by-step guide to Section III. Work through the stimulus, identify problems, choose strategies, structure your report, draft it and check it against indicative criteria.">
        <Timer minutes={35} label="Section III" />
      </PageHeader>

      <Card className="p-5">
        <p className="font-semibold">Report structure (flexible — adapt it to the question)</p>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          {REPORT_STRUCTURE_GUIDE.map((g) => (
            <div key={g.part} className="rounded-xl bg-stone-50 p-3 text-sm dark:bg-night-3">
              <p className="font-semibold">{g.part}</p>
              <p className="text-stone-600 dark:text-stone-400">{g.detail}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-stone-500">There is no single required template. Markers look for a sustained, logical response in the form of a report that answers the question using the stimulus.</p>
      </Card>

      <nav aria-label="Builder steps" className="scroll-thin flex gap-1 overflow-x-auto">
        {STEPS.map((s, i) => (
          <button key={s} type="button" onClick={() => set({ step: i + 1 })} aria-current={st.step === i + 1 ? "step" : undefined} className={cx("flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm", st.step === i + 1 ? "border-bronze-500 bg-bronze-50 font-semibold dark:bg-bronze-900/40" : "border-stone-200 dark:border-stone-800")}>
            <span className={cx("grid h-5 w-5 place-items-center rounded-full text-[11px] font-bold", st.step > i + 1 ? "bg-emerald-600 text-white" : "bg-stone-200 dark:bg-stone-700")}>{i + 1}</span>
            {s}
          </button>
        ))}
      </nav>

      <Card className="space-y-4 p-5">
        {st.step === 1 && (
          <>
            <p className="font-semibold">1. Select a report question</p>
            <div className="grid gap-3 md:grid-cols-3">
              {REPORTS.map((x) => (
                <button key={x.id} type="button" onClick={() => setQid(x.id)} aria-pressed={x.id === r.id} className={cx("rounded-2xl border-2 p-4 text-left", x.id === r.id ? "border-bronze-500 bg-bronze-50 dark:bg-bronze-900/30" : "border-stone-200 dark:border-stone-800")}>
                  <div className="flex flex-wrap gap-1">{x.topics.map((t) => <TopicBadge key={t} topic={t} short />)}</div>
                  <p className="mt-2 font-semibold">{x.title}</p>
                  <p className="mt-1 text-xs text-stone-500">{x.business}</p>
                </button>
              ))}
            </div>
            <p className="rounded-xl bg-stone-50 p-3 text-sm dark:bg-night-3"><span className="font-semibold">Question: </span>{r.question}</p>
            <p className="text-sm text-stone-600 dark:text-stone-400">Directive: <span className="font-semibold">{r.verb}</span>. Your role: <span className="font-semibold">{r.role}</span>.</p>
          </>
        )}
        {st.step === 2 && (
          <>
            <p className="font-semibold">2. Read the business stimulus</p>
            <p className="text-sm text-stone-600 dark:text-stone-400">Underline every figure, problem and named stakeholder. Ask: what is going wrong, why, and which key business functions are involved?</p>
            <Stimulus r={r} />
            <Checkbox checked={st.read} onChange={(v) => set({ read: v })} label="I have read the stimulus and noted the key figures" />
          </>
        )}
        {st.step === 3 && (
          <>
            <p className="font-semibold">3. Identify the key problems</p>
            <p className="text-sm text-stone-600 dark:text-stone-400">Select every statement that is a genuine problem supported by the stimulus, then check.</p>
            <div className="space-y-2">
              {r.problems.map((p, i) => {
                const on = st.problems.includes(i);
                const show = st.problemsChecked;
                const right = on === p.relevant;
                return (
                  <div key={p.text} className={cx("rounded-xl border p-3", show ? (right ? "border-emerald-300" : "border-red-300") : "border-stone-200 dark:border-stone-800")}>
                    <Checkbox checked={on} onChange={(v) => set({ problems: v ? [...st.problems, i] : st.problems.filter((x) => x !== i), problemsChecked: false })} label={p.text} />
                    {show && <p className={cx("mt-1 ml-6 text-xs", right ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400")}>{right ? "✓ " : "✗ "}{p.feedback}</p>}
                  </div>
                );
              })}
            </div>
            <Button onClick={() => set({ problemsChecked: true })}>Check problems</Button>
          </>
        )}
        {st.step === 4 && (
          <>
            <p className="font-semibold">4. Which key business functions does the report need to address?</p>
            <div className="grid gap-2 sm:grid-cols-4">
              {(["operations", "marketing", "finance", "hr"] as TopicId[]).map((t) => {
                const on = st.functions.includes(t);
                const right = on === r.functions.includes(t);
                return (
                  <div key={t} className={cx("rounded-xl border-2 p-3", st.functionsChecked ? (right ? "border-emerald-400" : "border-red-400") : on ? TOPIC_THEME[t].border : "border-stone-200 dark:border-stone-800")}>
                    <Checkbox checked={on} onChange={(v) => set({ functions: v ? [...st.functions, t] : st.functions.filter((x) => x !== t), functionsChecked: false })} label={TOPIC_THEME[t].label} />
                  </div>
                );
              })}
            </div>
            <Button onClick={() => set({ functionsChecked: true })}>Check</Button>
            {st.functionsChecked && <Callout tone="info" title="Functions this stimulus centres on">{r.functions.map((f) => TOPIC_THEME[f].label).join(", ")}. Strong reports also note interdependence — e.g. how a finance decision affects operations or HR.</Callout>}
          </>
        )}
        {st.step === 5 && (
          <>
            <p className="font-semibold">5. Choose appropriate strategies</p>
            <div className="space-y-2">
              {r.strategies.map((s, i) => {
                const on = st.strategies.includes(i);
                const show = st.strategiesChecked && on;
                return (
                  <div key={s.text} className={cx("rounded-xl border p-3", show ? (s.appropriate ? "border-emerald-300" : "border-red-300") : "border-stone-200 dark:border-stone-800")}>
                    <Checkbox checked={on} onChange={(v) => set({ strategies: v ? [...st.strategies, i] : st.strategies.filter((x) => x !== i), strategiesChecked: false })} label={s.text} />
                    {show && <p className={cx("mt-1 ml-6 text-xs", s.appropriate ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400")}>{s.appropriate ? "✓ Appropriate: " : "✗ Not appropriate: "}{s.why}</p>}
                  </div>
                );
              })}
            </div>
            <Button onClick={() => set({ strategiesChecked: true })}>Check my choices</Button>
            {st.strategiesChecked && (
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Appropriate strategies you did not select: {r.strategies.filter((s, i) => s.appropriate && !st.strategies.includes(i)).length || "none"}.
              </p>
            )}
          </>
        )}
        {st.step === 6 && (
          <>
            <p className="font-semibold">6. Organise your report structure</p>
            <p className="text-sm text-stone-600 dark:text-stone-400">Reorder, rename or add headings so they mirror the question's requirements.</p>
            <ol className="space-y-1.5">
              {st.structure.map((h, i) => (
                <li key={h + i} className="flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-1.5 dark:border-stone-800">
                  <span className="w-5 text-xs text-stone-400">{i + 1}</span>
                  <input aria-label={`Heading ${i + 1}`} value={h} onChange={(e) => { const s = [...st.structure]; const old = s[i]; s[i] = e.target.value; const drafts = { ...st.drafts, [e.target.value]: st.drafts[old] ?? "" }; set({ structure: s, drafts }); }} className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none" />
                  <button type="button" onClick={() => move(i, -1)} aria-label="Move up" className="rounded p-1 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"><ArrowUp className="h-4 w-4" /></button>
                  <button type="button" onClick={() => move(i, 1)} aria-label="Move down" className="rounded p-1 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"><ArrowDown className="h-4 w-4" /></button>
                  <button type="button" onClick={() => set({ structure: st.structure.filter((_, j) => j !== i) })} aria-label="Remove heading" className="rounded p-1 text-stone-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                </li>
              ))}
            </ol>
            <div className="flex gap-2">
              <input value={newHeading} onChange={(e) => setNewHeading(e.target.value)} placeholder="New heading, e.g. Analysis of HR effectiveness" aria-label="New heading" className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-night-3" />
              <Button variant="secondary" onClick={() => { if (newHeading.trim()) { set({ structure: [...st.structure, newHeading.trim()] }); setNewHeading(""); } }}><Plus className="h-4 w-4" /> Add</Button>
            </div>
            <ul className="space-y-1 text-sm">
              {structureFeedback.map((f) => (
                <li key={f.text} className="flex items-center gap-2">{f.ok ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-amber-600" />}{f.text}</li>
              ))}
            </ul>
          </>
        )}
        {st.step === 7 && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">7. Draft your paragraphs</p>
              <p className="text-sm text-stone-500">{words} words (a typical response is roughly 600–1,000 words)</p>
            </div>
            <details className="rounded-xl bg-stone-50 p-3 text-sm dark:bg-night-3">
              <summary className="cursor-pointer font-semibold">Show the stimulus</summary>
              <div className="mt-2"><Stimulus r={r} /></div>
            </details>
            <p className="text-xs text-stone-500">In each body section: syllabus terminology → explain the issue → apply to the stimulus (names, figures) → strategy → consequences (analysis) → judgement where required.</p>
            <div className="space-y-4">
              {st.structure.map((h) => (
                <TextArea key={h} label={h} value={st.drafts[h] ?? ""} onChange={(v) => set({ drafts: { ...st.drafts, [h]: v } })} rows={h.toLowerCase() === "title" ? 1 : 5} />
              ))}
            </div>
          </>
        )}
        {st.step === 8 && (
          <>
            <p className="font-semibold">8. Check your report against indicative marking criteria</p>
            <ul className="list-disc pl-5 text-sm">{REPORT_CRITERIA.map((c) => <li key={c}>{c}</li>)}</ul>
            {words > 0 ? <FeedbackPanel report={fb} /> : <Callout tone="info" title="Nothing to check yet">Draft your report in step 7 first.</Callout>}
            <div className="rounded-xl border border-stone-200 p-4 dark:border-stone-800">
              <p className="text-sm font-semibold">Indicative marking bands (20 marks)</p>
              <table className="mt-1 w-full text-sm"><tbody>{BANDS_20.map((b) => <tr key={b.range} className="border-t border-stone-100 align-top dark:border-stone-800"><td className="w-16 py-1.5 font-semibold">{b.range}</td><td className="py-1.5">{b.text}</td></tr>)}</tbody></table>
            </div>
            <details className="rounded-xl border border-stone-200 p-4 dark:border-stone-800">
              <summary className="cursor-pointer text-sm font-semibold">Compare with the model response plan</summary>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {r.modelPlan.map((s) => (
                  <div key={s.heading} className="rounded-xl bg-stone-50 p-3 text-sm dark:bg-night-3">
                    <p className="font-semibold">{s.heading}</p>
                    <ul className="mt-1 space-y-1">{s.points.map((p) => <li key={p}>• {p}</li>)}</ul>
                  </div>
                ))}
              </div>
            </details>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print / save as PDF</Button>
              <Button variant="ghost" onClick={() => setSt(fresh(r))}>Start this report again</Button>
            </div>
          </>
        )}
      </Card>

      <div className="flex justify-between">
        <Button variant="ghost" disabled={st.step === 1} onClick={() => set({ step: st.step - 1 })}>Previous step</Button>
        <Button disabled={st.step === STEPS.length} onClick={() => set({ step: st.step + 1 })}>Next step</Button>
      </div>

      <Card className="p-5">
        <p className="font-semibold">Time-management guide (about 35 minutes)</p>
        <ul className="mt-2 space-y-1 text-sm">{REPORT_TIME_GUIDE.map((t) => <li key={t.task}>• <span className="font-semibold">{t.minutes} min</span> — {t.task}</li>)}</ul>
      </Card>
    </div>
  );
}

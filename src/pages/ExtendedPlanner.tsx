import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Copy, PenLine, Printer, Wand2 } from "lucide-react";
import { TOPICS, topicById } from "../content";
import { DIRECTIVES, directiveByVerb } from "../content/hsc";
import { EXTENDED } from "../content/questions/extended";
import { CASE_STUDIES } from "../content/caseStudies";
import type { Block, TopicId } from "../content/types";
import { Button, Callout, Card, Checkbox, PageHeader, Select, TextArea, Tabs } from "../components/ui";
import { FeedbackPanel } from "../components/tools/Practice";
import { analyseWriting, countWords, requiresJudgement } from "../lib/feedback";
import { TOPIC_THEME, cx } from "../lib/theme";
import { usePersistentState } from "../state/storage";

interface Item {
  id: string;
  name: string;
  definition: string;
  pro?: string;
  con?: string;
}

const AREA_SECTION: Record<string, "concepts" | "influences" | "processes" | "strategies"> = {};
function sectionForArea(areaId: string) {
  if (AREA_SECTION[areaId]) return AREA_SECTION[areaId];
  if (areaId.endsWith("role")) return "concepts";
  if (areaId.endsWith("influences")) return "influences";
  if (areaId.endsWith("processes") || areaId.endsWith("process")) return "processes";
  return "strategies";
}

function itemsFrom(blocks: Block[]): Item[] {
  const out: Item[] = [];
  for (const b of blocks) {
    if (b.kind === "strategies") b.items.forEach((s) => out.push({ id: s.id, name: s.name, definition: s.definition, pro: s.advantages[0], con: s.disadvantages[0] }));
    if (b.kind === "influences") b.items.forEach((s) => out.push({ id: s.id, name: s.name, definition: s.meaning, pro: s.positive[0], con: s.negative[0] }));
    if (b.kind === "concepts") b.items.forEach((s) => out.push({ id: s.id, name: s.term, definition: s.definition }));
  }
  return out;
}

const lc = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export default function ExtendedPlanner() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState<"verbs" | "structure" | "planner" | "samples">(params.get("q") ? "planner" : params.get("verb") ? "verbs" : "verbs");
  return (
    <div className="space-y-6">
      <PageHeader icon={<PenLine className="h-6 w-6" />} title="Extended Response Centre" subtitle="Section IV: one 20-mark extended response from a choice of two questions. Learn what each directive verb demands, how to structure roughly 800 words, and plan responses with your case studies." />
      <Tabs ariaLabel="Extended response tools" value={tab} onChange={setTab} tabs={[{ id: "verbs", label: "Directive verbs" }, { id: "structure", label: "Structure & paragraphs" }, { id: "planner", label: "Response planner" }, { id: "samples", label: "Sample responses" }]} />
      {tab === "verbs" && <Verbs initial={params.get("verb") ?? "Evaluate"} />}
      {tab === "structure" && <Structure />}
      {tab === "planner" && <Planner initialQ={params.get("q")} />}
      {tab === "samples" && <Samples />}
    </div>
  );
}

function Verbs({ initial }: { initial: string }) {
  const [verb, setVerb] = useState(directiveByVerb(initial)?.verb ?? "Evaluate");
  const d = directiveByVerb(verb)!;
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-1.5">
        {DIRECTIVES.map((x) => (
          <button key={x.verb} type="button" onClick={() => setVerb(x.verb)} aria-pressed={verb === x.verb} className={cx("rounded-lg border px-3 py-1.5 text-sm font-medium", verb === x.verb ? "border-bronze-500 bg-bronze-600 text-white" : "border-stone-200 dark:border-stone-700")}>
            {x.verb}
          </button>
        ))}
      </div>
      <Card className="grid gap-5 p-5 md:grid-cols-2">
        <div>
          <p className="font-display text-2xl font-semibold">{d.verb}</p>
          <p className="mt-1 text-sm text-stone-500">NESA glossary: “{d.meaning}”</p>
          <p className="mt-3 text-sm">{d.expects}</p>
          <p className="mt-3 text-sm"><span className="font-semibold">Judgement required? </span>{d.judgement ? "Yes — make and sustain a clear judgement." : "No — focus on accurate knowledge and explanation."}</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Response structure</p>
          <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm">{d.structure.map((s) => <li key={s}>{s}</li>)}</ol>
          <p className="mt-3 text-sm"><span className="font-semibold">Sentence starter: </span>“{d.sentenceStarter}”</p>
          <p className="mt-2 text-sm"><span className="font-semibold">Example question: </span>{d.example}</p>
        </div>
      </Card>
      <Card className="p-5">
        <p className="font-semibold">How the expected response changes — same topic, different verbs</p>
        <div className="scroll-thin mt-3 overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead><tr className="text-left text-xs text-stone-500"><th className="py-1 pr-3">Verb</th><th className="py-1 pr-3">Question about JIT</th><th className="py-1">What a strong answer does</th></tr></thead>
            <tbody>
              {[
                ["Identify", "Identify one inventory strategy.", "Names JIT."],
                ["Describe", "Describe JIT inventory management.", "Gives features: minimal stock, frequent deliveries, reliance on suppliers."],
                ["Explain", "Explain how JIT can reduce costs.", "Shows cause and effect: less stock → lower holding costs and less cash tied up → higher profit."],
                ["Analyse", "Analyse the impact of JIT on a business.", "Breaks into components (costs, cash flow, supplier risk, quality) and draws out implications for performance."],
                ["Evaluate", "Evaluate the effectiveness of JIT.", "Sets criteria (cost, reliability, risk), weighs evidence (e.g. Toyota 2011), reaches a supported judgement."],
              ].map(([v, q, a]) => (
                <tr key={v} className="border-t border-stone-100 align-top dark:border-stone-800"><td className="py-2 pr-3 font-semibold">{v}</td><td className="py-2 pr-3">{q}</td><td className="py-2">{a}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Structure() {
  const [para, setPara] = usePersistentState<string>("ext:paragraph", "");
  const fb = useMemo(() => analyseWriting(para, { keyTerms: ["strategy", "effective", "costs", "profit", "quality", "customer", "objective"], stimulusTerms: CASE_STUDIES.map((c) => c.business.split(" ")[0]), requiresJudgement: true, wordRange: [100, 220] }, "paragraph"), [para]);
  const parts = [
    { k: "Point", d: "Identify a relevant business strategy (topic sentence that answers the question).", e: "Just-in-time inventory management is highly effective in minimising operating costs." },
    { k: "Explanation", d: "Explain how the strategy works.", e: "JIT means materials arrive only as needed, so little stock is held and holding costs fall." },
    { k: "Application", d: "Apply it to a relevant business or scenario — specific, dated detail.", e: "Toyota uses kanban signals and close supplier partnerships as part of the Toyota Production System." },
    { k: "Analysis", d: "Explain its effects on business performance (cause → effect).", e: "This releases working capital and exposes waste, which lowers unit costs and supports profitability." },
    { k: "Evaluation", d: "Make a supported judgement about effectiveness — when required by the verb.", e: "However, the 2011 earthquake showed JIT's dependence on supply, so it is most effective when combined with supply-chain risk management." },
  ];
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5 text-sm">
          <p className="font-semibold">Structure of an extended response (≈ 800 words)</p>
          <ul className="mt-2 space-y-2">
            <li><span className="font-semibold">Thesis statement:</span> one sentence that directly answers the question and reflects the verb (a judgement for evaluate/assess).</li>
            <li><span className="font-semibold">Introduction (≈ 80–100 words):</span> thesis, key terms defined, the strategies/arguments you will cover and the case studies you will use.</li>
            <li><span className="font-semibold">Body paragraphs (3–4 × ≈ 150 words):</span> one main idea each, opening with a topic sentence linked to the question.</li>
            <li><span className="font-semibold">Integration of case studies:</span> specific names, dates and evidence — woven into analysis, not bolted on as a separate story.</li>
            <li><span className="font-semibold">Conclusion (≈ 60–80 words):</span> restate the judgement; no new information.</li>
          </ul>
        </Card>
        <Card className="p-5 text-sm">
          <p className="font-semibold">Thesis statements by verb</p>
          <ul className="mt-2 space-y-2">
            <li><span className="font-semibold">Evaluate / Assess:</span> “Operations strategies are highly effective in reducing costs, although their effectiveness depends on managing supply-chain risk.”</li>
            <li><span className="font-semibold">Explain:</span> “Marketing strategies achieve objectives by matching the marketing mix to the needs of a chosen target market.”</li>
            <li><span className="font-semibold">Analyse:</span> “Technology affects HR through changes to required skills, job design and workforce size, each with significant implications for productivity.”</li>
            <li><span className="font-semibold">Discuss:</span> “Debt finance offers control and tax advantages but increases financial risk; on balance it suits businesses with stable cash flows.”</li>
          </ul>
        </Card>
      </div>
      <Card className="p-5">
        <p className="font-semibold">Example paragraph framework</p>
        <div className="mt-3 grid gap-2 md:grid-cols-5">
          {parts.map((p, i) => (
            <div key={p.k} className="rounded-xl border border-stone-200 p-3 dark:border-stone-800">
              <p className="text-xs font-bold text-bronze-600 dark:text-bronze-400">{i + 1}. {p.k}</p>
              <p className="mt-1 text-xs text-stone-600 dark:text-stone-400">{p.d}</p>
              <p className="mt-2 text-xs italic">“{p.e}”</p>
            </div>
          ))}
        </div>
        <Callout tone="info" title="Paragraph structures are flexible">Adapt the framework to the question: an 'explain' question needs no evaluation step, and strong writers often blend application and analysis in the same sentence.</Callout>
      </Card>
      <Card className="space-y-3 p-5">
        <p className="font-semibold">Paragraph checker</p>
        <TextArea label={`Write one body paragraph (${countWords(para)} words)`} value={para} onChange={setPara} rows={7} />
        {para.trim() && <FeedbackPanel report={fb} />}
      </Card>
    </div>
  );
}

function Planner({ initialQ }: { initialQ: string | null }) {
  const pre = EXTENDED.find((e) => e.id === initialQ);
  const [topic, setTopic] = usePersistentState<TopicId>("ext:topic", pre?.topic ?? "operations");
  const t = topicById(topic)!;
  const [area, setArea] = usePersistentState<string>("ext:area", pre?.area ?? t.syllabus[t.syllabus.length - 1].id);
  const areaValid = t.syllabus.some((a) => a.id === area) ? area : t.syllabus[t.syllabus.length - 1].id;
  const bank = EXTENDED.filter((e) => e.topic === topic);
  const [qid, setQid] = usePersistentState<string>("ext:q", pre?.id ?? "custom");
  const [custom, setCustom] = usePersistentState<string>("ext:custom", "");
  const q = EXTENDED.find((e) => e.id === qid && e.topic === topic);
  const [verb, setVerb] = usePersistentState<string>("ext:verb", pre?.verb ?? "Evaluate");
  const items = useMemo(() => itemsFrom(t.sections[sectionForArea(areaValid)]), [t, areaValid]);
  const [chosen, setChosen] = usePersistentState<string[]>("ext:chosen", []);
  const chosenItems = items.filter((i) => chosen.includes(i.id));
  const cases = CASE_STUDIES.filter((c) => c.topics.includes(topic));
  const [caseIds, setCaseIds] = usePersistentState<string[]>("ext:cases", []);
  const chosenCases = cases.filter((c) => caseIds.includes(c.id));
  const [generated, setGenerated] = useState(false);
  const d = directiveByVerb(verb)!;
  const judge = requiresJudgement(verb) || d.judgement;
  const questionText = q?.question ?? custom;

  const plan = useMemo(() => {
    if (!chosenItems.length) return null;
    const names = chosenItems.map((i) => lc(i.name));
    const list = names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names[0];
    const thesis = judge
      ? `${chosenItems.length > 1 ? `Strategies such as ${list} are` : `${chosenItems[0].name} is`} [highly / largely / partly] effective in [achieving the goal in the question] because [main reason], although their effectiveness is limited by [main limitation].`
      : verb === "Compare" || verb === "Contrast"
        ? `${chosenItems[0]?.name} and ${chosenItems[1]?.name ?? "[second item]"} ${verb === "Compare" ? "share [similarity] but differ in [difference]" : "differ in [difference 1] and [difference 2]"}.`
        : `${t.name} management uses ${list} to [purpose in the question], each affecting business performance in different ways.`;
    const intro = `Define: ${chosenItems.slice(0, 2).map((i) => `${i.name} — ${lc(i.definition)}`).join(" ")} State your thesis. Outline the ${chosenItems.length} arguments and name ${chosenCases.length ? chosenCases.map((c) => c.business).join(" and ") : "your case study"}.`;
    const paras = chosenItems.map((it, i) => {
      const cs = chosenCases[i % Math.max(1, chosenCases.length)];
      return {
        topic: `Topic sentence: ${it.name} ${judge ? "is [effective/limited] in" : "contributes to"} [the focus of the question].`,
        explanation: `Explain: ${it.definition}`,
        application: cs ? `Apply (${cs.business}, ${cs.period}): ${cs.hscUse}` : "Apply: add a specific, dated example from a case study.",
        analysis: `Analyse: show the effect on business performance — e.g. costs, profitability, customer satisfaction, market share or productivity.${it.pro ? ` Benefit to develop: ${lc(it.pro)}` : ""}`,
        evaluation: judge ? `Evaluate: weigh the benefit against ${it.con ? lc(it.con) : "its main limitation"} and judge effectiveness in this context.` : "",
      };
    });
    const conclusion = judge ? "Restate your judgement, summarise why the strategies are effective and the conditions that limit them. No new information." : "Summarise how the elements work together to answer the question.";
    return { thesis, intro, paras, conclusion };
  }, [chosenItems, chosenCases, judge, verb, t.name]);

  const copyText = plan ? [`Question: ${questionText}`, `Thesis: ${plan.thesis}`, `Introduction: ${plan.intro}`, ...plan.paras.map((p, i) => [`Paragraph ${i + 1}`, p.topic, p.explanation, p.application, p.analysis, p.evaluation].filter(Boolean).join("\n")), `Conclusion: ${plan.conclusion}`].join("\n\n") : "";

  return (
    <div className="space-y-5">
      <Card className="grid gap-4 p-5 md:grid-cols-2">
        <Select label="1. Topic" value={topic} onChange={(v) => { setTopic(v); setChosen([]); setCaseIds([]); setQid("custom"); setGenerated(false); const nt = topicById(v)!; setArea(nt.syllabus[nt.syllabus.length - 1].id); }} options={TOPICS.map((x) => ({ value: x.id, label: `Topic ${x.number}: ${x.name}` }))} />
        <Select label="2. Syllabus area" value={areaValid} onChange={(v) => { setArea(v); setChosen([]); setGenerated(false); }} options={t.syllabus.map((a) => ({ value: a.id, label: a.title }))} />
        <Select label="3. Question" value={q ? q.id : "custom"} onChange={(v) => { setQid(v); const e = EXTENDED.find((x) => x.id === v); if (e) { setVerb(e.verb); setArea(e.area); } setGenerated(false); }} options={[...bank.map((e) => ({ value: e.id, label: e.question })), { value: "custom", label: "Write my own question…" }]} />
        <Select label="4. Directive verb" value={verb} onChange={(v) => { setVerb(v); setGenerated(false); }} options={DIRECTIVES.map((x) => ({ value: x.verb, label: `${x.verb} — ${x.meaning}` }))} />
        {!q && <div className="md:col-span-2"><TextArea label="Your question" value={custom} onChange={setCustom} rows={2} placeholder="e.g. Evaluate the effectiveness of quality management strategies in a business you have studied." /></div>}
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <p className="text-sm font-semibold">5. Relevant strategies / concepts ({chosen.length} selected — aim for 3)</p>
          {q && <p className="mt-1 text-xs text-stone-500">Suggested for this question: {q.suggestedStrategies.join(", ")}</p>}
          <div className="scroll-thin mt-2 max-h-72 space-y-1.5 overflow-y-auto pr-2">
            {items.map((i) => (
              <Checkbox key={i.id} checked={chosen.includes(i.id)} onChange={(v) => { setChosen(v ? [...chosen, i.id] : chosen.filter((x) => x !== i.id)); setGenerated(false); }} label={i.name} />
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-semibold">6. Business case studies</p>
          {q && <p className="mt-1 text-xs text-stone-500">Suggested: {q.suggestedCases.map((c) => CASE_STUDIES.find((x) => x.id === c)?.business).join(", ")}</p>}
          <div className="mt-2 space-y-1.5">
            {cases.map((c) => (
              <Checkbox key={c.id} checked={caseIds.includes(c.id)} onChange={(v) => { setCaseIds(v ? [...caseIds, c.id] : caseIds.filter((x) => x !== c.id)); setGenerated(false); }} label={<span>{c.business} <span className="text-xs text-stone-500">— {c.headline}</span></span>} />
            ))}
          </div>
        </Card>
      </div>
      <Button onClick={() => setGenerated(true)} disabled={!chosenItems.length}>
        <Wand2 className="h-4 w-4" /> Generate response plan
      </Button>
      {generated && plan && (
        <Card className={cx("space-y-4 border-2 p-5", TOPIC_THEME[topic].border)}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold tracking-wider text-stone-500 uppercase">Response plan · {verb}</p>
              <p className="font-display text-lg font-semibold">{questionText || "(Write or choose a question)"}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => navigator.clipboard?.writeText(copyText).catch(() => undefined)}><Copy className="h-4 w-4" /> Copy</Button>
              <Button size="sm" variant="secondary" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print</Button>
            </div>
          </div>
          <div className="rounded-xl bg-bronze-50 p-3 text-sm dark:bg-bronze-950/40"><span className="font-semibold">Thesis: </span>{plan.thesis}</div>
          <div className="text-sm"><span className="font-semibold">Introduction: </span>{plan.intro}</div>
          {plan.paras.map((p, i) => (
            <div key={i} className="rounded-xl border border-stone-200 p-3 text-sm dark:border-stone-800">
              <p className="font-semibold">Body paragraph {i + 1}</p>
              <ul className="mt-1 space-y-1">
                <li>{p.topic}</li>
                <li>{p.explanation}</li>
                <li>{p.application}</li>
                <li>{p.analysis}</li>
                {p.evaluation && <li className="text-bronze-800 dark:text-bronze-300">{p.evaluation}</li>}
              </ul>
            </div>
          ))}
          <div className="text-sm"><span className="font-semibold">Conclusion: </span>{plan.conclusion}</div>
          <p className="text-xs text-stone-500">The plan uses stored syllabus definitions and verified case study content. Replace the [bracketed] prompts with your own judgement — markers reward your analysis, not template wording.</p>
          <Link to="/exam?tab=extended" className="text-sm font-semibold text-bronze-700 underline dark:text-bronze-400">Write it under timed conditions →</Link>
        </Card>
      )}
    </div>
  );
}

function Samples() {
  const samples = EXTENDED.filter((e) => e.sample);
  const [id, setId] = useState(samples[0].id);
  const e = samples.find((x) => x.id === id)!;
  return (
    <div className="space-y-4">
      <Callout tone="info" title="Original sample responses">These responses were written for this guide to illustrate structure, integration of case studies and sustained judgement. They are not official NESA exemplars, and their case-study facts are drawn from the verified case study library.</Callout>
      <Select label="Sample response" value={id} onChange={setId} options={samples.map((s) => ({ value: s.id, label: s.question }))} />
      <Card className="p-6">
        <p className="text-xs font-semibold tracking-wider text-stone-500 uppercase">{TOPIC_THEME[e.topic].label} · {e.verb} · {countWords(e.sample!)} words</p>
        <p className="mt-1 font-display text-lg font-semibold">{e.question}</p>
        <div className="mt-4 space-y-4 font-display text-[16px] leading-relaxed text-stone-800 dark:text-stone-200">
          {e.sample!.split("\n\n").map((p, i) => (
            <p key={i} className={i === 0 ? "rounded-xl bg-bronze-50/70 p-3 dark:bg-bronze-950/30" : ""}>{p}</p>
          ))}
        </div>
        <div className="mt-5 grid gap-2 text-sm md:grid-cols-3">
          <div className="rounded-xl bg-stone-50 p-3 dark:bg-night-3"><p className="font-semibold">Why it works</p><p>Thesis states a judgement; each paragraph opens with a topic sentence and ends with a mini-judgement.</p></div>
          <div className="rounded-xl bg-stone-50 p-3 dark:bg-night-3"><p className="font-semibold">Case studies</p><p>Specific, dated evidence is integrated into the analysis rather than told as a story.</p></div>
          <div className="rounded-xl bg-stone-50 p-3 dark:bg-night-3"><p className="font-semibold">Terminology</p><p>{e.keyTerms.slice(0, 6).join(", ")}…</p></div>
        </div>
      </Card>
    </div>
  );
}

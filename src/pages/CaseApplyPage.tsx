import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Copy } from "lucide-react";
import { CASE_STUDIES, STRATEGY_TAGS, VERIFICATION_NOTE, caseStudyById } from "../content/caseStudies";
import { DIRECTIVES, directiveByVerb } from "../content/hsc";
import type { TopicId } from "../content/types";
import { TOPIC_THEME } from "../lib/theme";
import { Button, Callout, Card, Disclaimer, PageHeader, Segmented, Select } from "../components/ui";

export default function CaseApplyPage() {
  const [topic, setTopic] = useState<TopicId>("operations");
  const tags = STRATEGY_TAGS.filter((t) => t.topic === topic);
  const [tag, setTag] = useState(tags[0].id);
  const cases = CASE_STUDIES.filter((c) => c.tags.includes(tag));
  const [caseId, setCaseId] = useState(cases[0]?.id ?? "");
  const [verb, setVerb] = useState("Evaluate");
  const c = caseStudyById(caseId);
  const d = directiveByVerb(verb)!;
  const tagLabel = STRATEGY_TAGS.find((t) => t.id === tag)!.label;
  const [copied, setCopied] = useState(false);

  const effectiveCaseId = cases.some((x) => x.id === caseId) ? caseId : cases[0]?.id;
  const cs = caseStudyById(effectiveCaseId ?? "") ?? c;

  const plan = useMemo(() => {
    if (!cs) return null;
    const point = `${tagLabel} — ${cs.business} (${cs.period})`;
    const explain = cs.strategy;
    const apply = cs.implementation.slice(0, 2).join(" ");
    const analyse = `As a result: ${cs.benefits[0]?.toLowerCase() ?? ""} However, ${cs.limitations[0]?.charAt(0).toLowerCase()}${cs.limitations[0]?.slice(1) ?? ""}`;
    const evidence = cs.evidence.map((e) => `${e.text} (${e.date})`).join(" ");
    const judge = d.judgement ? cs.evaluation : "";
    return { point, explain, apply, analyse, evidence, judge };
  }, [cs, tagLabel, d.judgement]);

  const copyText = plan
    ? [plan.point, plan.explain, plan.apply, plan.analyse, plan.evidence, plan.judge].filter(Boolean).join("\n\n")
    : "";

  return (
    <div className="space-y-6">
      <PageHeader icon={<Briefcase className="h-6 w-6" />} title="Case study application tool" subtitle="Choose a topic, a strategy, a case study and an examination verb. The tool assembles a structured explanation from verified stored content — it never invents facts." />
      <Card className="grid gap-4 p-5 md:grid-cols-2 lg:grid-cols-4">
        <div className="md:col-span-2 lg:col-span-4">
          <Segmented
            label="HSC topic"
            value={topic}
            onChange={(t) => {
              setTopic(t);
              const first = STRATEGY_TAGS.find((x) => x.topic === t)!.id;
              setTag(first);
              setCaseId(CASE_STUDIES.find((x) => x.tags.includes(first))?.id ?? "");
            }}
            options={(["operations", "marketing", "finance", "hr"] as TopicId[]).map((t) => ({ value: t, label: TOPIC_THEME[t].label }))}
          />
        </div>
        <Select
          label="Business strategy / syllabus concept"
          value={tag}
          onChange={(t) => {
            setTag(t);
            setCaseId(CASE_STUDIES.find((x) => x.tags.includes(t))?.id ?? "");
          }}
          options={tags.map((t) => ({ value: t.id, label: t.label }))}
        />
        <Select label="Case study" value={effectiveCaseId ?? ""} onChange={setCaseId} options={cases.map((x) => ({ value: x.id, label: x.business }))} />
        <Select label="Examination verb" value={verb} onChange={setVerb} options={DIRECTIVES.map((x) => ({ value: x.verb, label: x.verb }))} />
      </Card>

      {!cs || !plan ? (
        <Callout tone="info" title="No verified case study for this combination">Choose another strategy — only case studies with verified material for a strategy are offered.</Callout>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <Card className="space-y-4 p-5">
            <p className="text-xs font-semibold tracking-wider text-bronze-600 uppercase dark:text-bronze-400">
              {verb}: {d.meaning}
            </p>
            {[
              ["Point — identify the strategy", plan.point],
              ["Explanation — how the strategy works", plan.explain],
              ["Application — what the business did", plan.apply],
              ["Analysis — effects on performance", plan.analyse],
              ["Evidence (dated)", plan.evidence],
              ...(d.judgement ? [["Evaluation — supported judgement", plan.judge]] : []),
            ].map(([h, t]) => (
              <div key={h}>
                <p className="text-sm font-semibold">{h}</p>
                <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">{t}</p>
              </div>
            ))}
            <div className="rounded-xl bg-bronze-50 p-3 text-sm dark:bg-bronze-950/40">
              <p className="font-semibold">Model sentence from the case study file</p>
              <p className="mt-1 italic">{cs.hscUse}</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(copyText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  } catch {
                    setCopied(false);
                  }
                }}
              >
                <Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy plan"}
              </Button>
              <Link to={`/case-studies/${cs.id}`} className="rounded-xl px-3 py-1.5 text-sm font-semibold text-bronze-700 underline dark:text-bronze-400">
                Full case study
              </Link>
            </div>
          </Card>
          <div className="space-y-4">
            <Card className="p-5 text-sm">
              <p className="font-semibold">What '{verb}' requires</p>
              <p className="mt-1 text-stone-700 dark:text-stone-300">{d.expects}</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                {d.structure.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <p className="mt-2 text-xs text-stone-500">Starter: “{d.sentenceStarter}”</p>
            </Card>
            <Disclaimer>{VERIFICATION_NOTE}</Disclaimer>
            <p className="text-xs text-stone-500">Rewrite the plan in your own words — markers reward precise application and judgement, not copied text.</p>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { GitCompareArrows } from "lucide-react";
import { CASE_STUDIES, caseStudyById } from "../content/caseStudies";
import type { TopicId } from "../content/types";
import { TOPIC_THEME, cx } from "../lib/theme";
import { Callout, Card, PageHeader, Segmented, Select } from "../components/ui";

export default function CaseComparePage() {
  const [fn, setFn] = useState<TopicId>("operations");
  const options = CASE_STUDIES.map((c) => ({ value: c.id, label: `${c.business}${c.functions[fn] ? "" : " (no material for this function)"}` }));
  const withFn = CASE_STUDIES.filter((c) => c.functions[fn]);
  const [a, setA] = useState(withFn[0]?.id ?? CASE_STUDIES[0].id);
  const [b, setB] = useState(withFn[1]?.id ?? CASE_STUDIES[1].id);
  const ca = caseStudyById(a)!;
  const cb = caseStudyById(b)!;
  const th = TOPIC_THEME[fn];
  const rows: { label: string; get: (c: typeof ca) => string }[] = [
    { label: `Approach to ${th.label}`, get: (c) => c.functions[fn] ?? "No verified material stored for this function — choose a different business or function." },
    { label: "Industry / period", get: (c) => `${c.industry} · ${c.period}` },
    { label: "Core strategy", get: (c) => c.strategy },
    { label: "Reasons", get: (c) => c.reasons },
    { label: "Main benefit", get: (c) => c.benefits[0] ?? "—" },
    { label: "Main limitation", get: (c) => c.limitations[0] ?? "—" },
    { label: "Evaluation", get: (c) => c.evaluation },
  ];
  return (
    <div className="space-y-6">
      <PageHeader icon={<GitCompareArrows className="h-6 w-6" />} title="Compare two businesses" subtitle="Select a key business function and two case studies to compare their approaches side by side — useful for 'compare' and 'contrast' questions and for using two case studies in an extended response." />
      <Card className="space-y-4 p-5">
        <Segmented label="Business function" value={fn} onChange={setFn} options={(["operations", "marketing", "finance", "hr"] as TopicId[]).map((t) => ({ value: t, label: TOPIC_THEME[t].label }))} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Select label="Business A" value={a} onChange={setA} options={options} />
          <Select label="Business B" value={b} onChange={setB} options={options} />
        </div>
        <p className="text-xs text-stone-500">Businesses with stored material for {th.label}: {withFn.map((c) => c.business).join(", ")}.</p>
      </Card>
      <div className="scroll-thin overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-44" />
              {[ca, cb].map((c) => (
                <th key={c.id} className={cx("rounded-t-xl p-3 text-left", th.bgSoft)}>
                  <Link to={`/case-studies/${c.id}`} className="font-display text-base font-semibold hover:underline">{c.business}</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="align-top">
                <th scope="row" className="border-t border-stone-200 p-3 text-left text-xs font-semibold text-stone-500 dark:border-stone-800">{r.label}</th>
                {[ca, cb].map((c) => (
                  <td key={c.id} className="border-t border-stone-200 p-3 leading-relaxed dark:border-stone-800">{r.get(c)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Callout tone="exam" title="Writing a comparison">
        Point-by-point is stronger than two separate descriptions: “Both {ca.business} and {cb.business} … ; however, {ca.business} … whereas {cb.business} …”. Then judge which approach was more effective for its context, using the evidence.
      </Callout>
    </div>
  );
}

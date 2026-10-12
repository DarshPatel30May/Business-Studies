import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Sigma, Calculator } from "lucide-react";
import { FORMULAS, formatFormulaValue, type Formula } from "../content/formulas";
import { BookmarkButton, Callout, Card, Formula as Tex, PageHeader, Segmented, Tag, TopicBadge } from "../components/ui";
import { FormulaCalculator, workingSteps } from "../components/tools/FormulaCalculator";
import { cx } from "../lib/theme";

function FormulaCard({ f }: { f: Formula }) {
  const example = Object.fromEntries(f.inputs.map((i) => [i.key, i.example]));
  const exValue = f.compute(example);
  return (
    <Card id={f.id} className="scroll-mt-28 overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-stone-200 p-5 dark:border-stone-800">
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <TopicBadge topic={f.topic} short />
            <Tag>{f.category}</Tag>
            {f.syllabusRatio ? <Tag tone="good">Syllabus ratio</Tag> : <Tag>Supporting calculation</Tag>}
          </div>
          <h3 className="mt-2 font-display text-xl font-semibold">{f.name}</h3>
        </div>
        <BookmarkButton id={`formula:${f.id}`} title={f.name} to={`/formulas?focus=${f.id}`} kind="Formula" topic={f.topic} />
      </div>
      <div className="grid gap-5 p-5 lg:grid-cols-2">
        <div className="space-y-4 text-sm">
          <div className="rounded-xl bg-stone-50 p-3 dark:bg-night-3">
            <Tex latex={f.latex} />
          </div>
          <div>
            <p className="font-semibold">Components</p>
            <dl className="mt-1 space-y-1">
              {f.inputs.map((i) => (
                <div key={i.key}>
                  <dt className="inline font-medium">{i.label}: </dt>
                  <dd className="inline text-stone-600 dark:text-stone-400">{i.definition}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p>
            <span className="font-semibold">When it is used: </span>
            {f.whenUsed}
          </p>
          <div>
            <p className="font-semibold">Worked example</p>
            <p className="text-stone-600 dark:text-stone-400">{f.inputs.map((i) => `${i.label} = ${i.prefix ?? ""}${i.example.toLocaleString("en-AU")}`).join("; ")}</p>
            {workingSteps(f, example).map((s, i) => (
              <Tex key={i} latex={s} />
            ))}
            <p className="mt-1">
              Answer: <span className="font-semibold">{formatFormulaValue(f, exValue)}</span>. {f.interpretHint(exValue)}
            </p>
          </div>
          <div>
            <p className="font-semibold">Common mistakes</p>
            <ul className="mt-1 space-y-1 text-stone-700 dark:text-stone-300">
              {f.mistakes.map((m) => (
                <li key={m}>✗ {m}</li>
              ))}
            </ul>
          </div>
          <p>
            <span className="font-semibold">Business objective: </span>
            {f.objective}
          </p>
        </div>
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
            <Calculator className="h-4 w-4" /> Try it
          </p>
          <FormulaCalculator f={f} />
        </div>
      </div>
    </Card>
  );
}

export default function FormulaCentre() {
  const [params] = useSearchParams();
  const focus = params.get("focus");
  const [filter, setFilter] = useState<"all" | "syllabus" | "supporting">("all");
  const list = useMemo(() => FORMULAS.filter((f) => filter === "all" || (filter === "syllabus" ? f.syllabusRatio : !f.syllabusRatio)), [filter]);
  useEffect(() => {
    if (!focus) return;
    const t = setTimeout(() => {
      const el = document.getElementById(focus);
      el?.scrollIntoView({ behavior: "smooth" });
      el?.classList.add("focus-flash");
    }, 150);
    return () => clearTimeout(t);
  }, [focus]);
  return (
    <div className="space-y-6">
      <PageHeader icon={<Sigma className="h-6 w-6" />} title="Formula Centre" subtitle="Every financial ratio named in the syllabus, plus the supporting calculations used in HSC questions — each with its equation, components, worked example, calculator, interpretation and common mistakes." />
      <Callout tone="exam" title="HSC examination convention">
        NESA advises that HSC questions requiring a financial ratio calculation include the relevant formula. You are assessed on applying it correctly (substitution, working, format) and on interpreting and analysing the result — not on memorising it. Knowing the formulas still saves time.
      </Callout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented label="Filter formulas" value={filter} onChange={setFilter} options={[{ value: "all", label: `All (${FORMULAS.length})` }, { value: "syllabus", label: "Syllabus ratios (7)" }, { value: "supporting", label: "Supporting calculations" }]} />
        <Link to="/calculator" className="text-sm font-semibold text-bronze-700 underline dark:text-bronze-400">Open the step-by-step ratio calculator →</Link>
      </div>
      <div className="scroll-thin flex gap-2 overflow-x-auto pb-1">
        {list.map((f) => (
          <a key={f.id} href={`#/formulas?focus=${f.id}`} className={cx("shrink-0 rounded-lg border border-stone-200 px-2.5 py-1 text-xs font-medium hover:border-stone-400 dark:border-stone-700", focus === f.id && "border-bronze-500")}>
            {f.name}
          </a>
        ))}
      </div>
      <div className="space-y-6">
        {list.map((f) => (
          <FormulaCard key={f.id} f={f} />
        ))}
      </div>
      <Callout tone="warning" title="Avoid these confusions">
        Profit ≠ revenue · Liquidity (short-term) ≠ solvency (long-term) · Gross profit ≠ net profit · Assets ≠ equity (equity = assets − liabilities) · Expenses (costs of a period) ≠ liabilities (debts owed) · Cash flow ≠ profit · Debt finance (borrowed) ≠ equity finance (owners' funds).
      </Callout>
    </div>
  );
}

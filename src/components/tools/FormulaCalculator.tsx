import { useEffect, useState } from "react";
import { AlertTriangle, Lightbulb } from "lucide-react";
import type { Formula } from "../../content/formulas";
import { formatFormulaValue } from "../../content/formulas";
import { formatNumber, interpretRatio, round, collectionPeriod } from "../../lib/finance";
import { Formula as Tex, NumberField, Tag } from "../ui";
import { cx } from "../../lib/theme";

const LIMITATIONS = [
  "A single ratio means little on its own — compare it over time, against standards (targets, industry averages) and with similar businesses.",
  "Ratios use historical figures; they describe the past, not the future.",
  "Businesses may use different accounting practices (e.g. valuing assets, capitalising expenses), so comparisons can mislead.",
  "Balance sheet figures are a snapshot at one date and may not represent the whole year (timing issues).",
  "Ratios show symptoms, not causes — investigate the reasons behind a result before recommending a strategy.",
];

const tex = (n: number, money?: boolean, dp = 2) => {
  const s = formatNumber(round(n, dp), dp).replace(/,/g, "{,}");
  return money ? `\\$${s}` : s;
};

export function workingSteps(f: Formula, v: Record<string, number>): string[] {
  const [a, b] = f.inputs;
  const A = v[a.key];
  const B = b ? v[b.key] : 0;
  const ma = a.prefix === "$";
  const mb = b?.prefix === "$";
  const value = f.compute(v);
  const out: string[] = [];
  switch (f.id) {
    case "gross-profit":
    case "net-profit":
    case "working-capital":
      out.push(`= ${tex(A, ma)} - ${tex(B, mb)}`);
      out.push(`= ${tex(A - B, true)}`);
      return out;
    case "sales-revenue":
      out.push(`= ${tex(A, ma)} \\times ${tex(B, mb)}`);
      out.push(`= ${tex(A * B, true)}`);
      return out;
    case "percentage-change":
      out.push(`= \\dfrac{${tex(B)} - ${tex(A)}}{${tex(A)}} \\times 100`);
      out.push(`= \\dfrac{${tex(B - A)}}{${tex(A)}} \\times 100`);
      if (value !== null) out.push(`= ${tex(value)}\\%`);
      return out;
    case "collection-period":
      out.push(`= \\dfrac{365}{${tex(A)}}`);
      if (value !== null) out.push(`= ${tex(value)} \\text{ days}`);
      return out;
  }
  out.push(`= \\dfrac{${tex(A, ma)}}{${tex(B, mb)}}${f.format === "percent" || f.format === "percentValue" ? " \\times 100" : ""}`);
  if (value === null) {
    out.push("\\text{undefined — the denominator is zero}");
    return out;
  }
  if (f.format === "percent") {
    out.push(`= ${tex(value, false, 4)} \\times 100`);
    out.push(`= ${tex(value * 100)}\\%`);
  } else if (f.format === "percentValue") {
    out.push(`= ${tex(value)}\\%`);
  } else if (f.format === "times") {
    out.push(`= ${tex(value)} \\text{ times}`);
    const d = collectionPeriod(value);
    if (d !== null) out.push(`\\text{Collection period} = \\dfrac{365}{${tex(value)}} \\approx ${tex(d)} \\text{ days}`);
  } else {
    out.push(`= ${tex(value)} : 1`);
  }
  return out;
}

export function FormulaCalculator({ f, full = false }: { f: Formula; full?: boolean }) {
  const [v, setV] = useState<Record<string, number>>(() => Object.fromEntries(f.inputs.map((i) => [i.key, i.example])));
  useEffect(() => setV(Object.fromEntries(f.inputs.map((i) => [i.key, i.example]))), [f]);
  const value = f.compute(v);
  const steps = workingSteps(f, v);
  const interp = f.ratioId ? interpretRatio(f.ratioId, value) : null;
  return (
    <div className="space-y-4">
      <div className={cx("grid gap-3", f.inputs.length > 1 ? "sm:grid-cols-2" : "")}>
        {f.inputs.map((i) => (
          <NumberField key={i.key} label={`${i.label} (${i.symbol})`} prefix={i.prefix} value={v[i.key]} step={i.prefix === "$" ? 1000 : 1} onChange={(x) => setV((s) => ({ ...s, [i.key]: x }))} hint={full ? i.definition : undefined} />
        ))}
      </div>
      <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-4 dark:border-stone-800 dark:bg-night-3">
        {full && <p className="mb-1 text-xs font-semibold tracking-wider text-stone-500 uppercase">1. Formula</p>}
        <Tex latex={f.latex} />
        {full && <p className="mt-3 mb-1 text-xs font-semibold tracking-wider text-stone-500 uppercase">3–4. Substitution and step-by-step working</p>}
        {steps.map((s, i) => (
          <Tex key={i} latex={s} />
        ))}
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-stone-200 pt-3 dark:border-stone-700">
          {full && <span className="text-xs font-semibold tracking-wider text-stone-500 uppercase">5–6. Answer</span>}
          <span className="text-2xl font-semibold tabular-nums text-stone-900 dark:text-stone-50">{formatFormulaValue(f, value)}</span>
          {interp && interp.rating !== "neutral" && <Tag tone={interp.rating === "concern" ? "bad" : interp.rating === "strong" ? "good" : "warn"}>{interp.headline}</Tag>}
        </div>
      </div>
      {full && (
        <div className="rounded-xl border border-stone-200 p-4 dark:border-stone-800">
          <p className="text-xs font-semibold tracking-wider text-stone-500 uppercase">2. Variable definitions</p>
          <dl className="mt-1 space-y-1 text-sm">
            {f.inputs.map((i) => (
              <div key={i.key}>
                <dt className="inline font-semibold">{i.symbol} — {i.label}: </dt>
                <dd className="inline text-stone-700 dark:text-stone-300">{i.definition}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      <div className="rounded-xl bg-emerald-50/70 p-4 text-sm dark:bg-emerald-950/25">
        <p className="flex items-center gap-1.5 font-semibold">
          <Lightbulb className="h-4 w-4" /> {full ? "7. Interpretation" : "Interpretation"}
        </p>
        <p className="mt-1 text-stone-800 dark:text-stone-200">{f.interpretHint(value)}</p>
        {full && interp && interp.implications.length > 0 && (
          <>
            <p className="mt-3 font-semibold">8. Business implications</p>
            <ul className="mt-1 space-y-1">
              {interp.implications.map((x) => (
                <li key={x}>• {x}</li>
              ))}
            </ul>
          </>
        )}
        {full && <p className="mt-3"><span className="font-semibold">Linked financial objective: </span>{f.objective}</p>}
      </div>
      {full && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm dark:border-amber-900 dark:bg-amber-950/25">
          <p className="flex items-center gap-1.5 font-semibold text-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4" /> 9. Limitations of interpretation
          </p>
          <ul className="mt-1 space-y-1 text-amber-950 dark:text-amber-100">
            {LIMITATIONS.map((l) => (
              <li key={l}>• {l}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

import { Calculator } from "lucide-react";
import { FORMULAS } from "../content/formulas";
import { Callout, Card, PageHeader, Select } from "../components/ui";
import { FormulaCalculator } from "../components/tools/FormulaCalculator";
import { usePersistentState } from "../state/storage";

export default function CalculatorPage() {
  const [id, setId] = usePersistentState<string>("calc:formula", "current-ratio");
  const f = FORMULAS.find((x) => x.id === id) ?? FORMULAS[0];
  return (
    <div className="space-y-6">
      <PageHeader icon={<Calculator className="h-6 w-6" />} title="Financial ratio calculator" subtitle="Select a ratio, enter the figures and get the formula, variable definitions, substitution, step-by-step working, the answer in the correct format, an interpretation, business implications and the limitations of interpretation." />
      <Card className="p-5">
        <div className="max-w-md">
          <Select
            label="Ratio or calculation"
            value={f.id}
            onChange={setId}
            options={FORMULAS.map((x) => ({ value: x.id, label: `${x.name}${x.syllabusRatio ? " — syllabus ratio" : ""}` }))}
          />
        </div>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">{f.whenUsed}</p>
      </Card>
      <FormulaCalculator f={f} full />
      <Callout tone="exam" title="Exam technique">
        Write the formula, substitute with dollar signs, show the division, then give the answer in the correct format: ratios as “x : 1”, profitability and expense ratios as percentages, accounts receivable turnover as “times” (and days if useful). Always add one sentence interpreting what the result means for the business.
      </Callout>
    </div>
  );
}

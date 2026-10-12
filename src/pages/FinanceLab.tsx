import { FlaskConical } from "lucide-react";
import { Card, PageHeader, Tabs } from "../components/ui";
import { usePersistentState } from "../state/storage";
import { CashFlowVisual, ExchangeVisual, FinanceSimulator, ProfitabilityGraph, RatioDashboard, RevExpChart, IncomeStatementVisual, BalanceSheetVisual } from "../components/visuals/FinanceVisuals";

const TABS = [
  { id: "sim", label: "Statement simulator", desc: "Change figures — statements and ratios update together.", C: FinanceSimulator },
  { id: "dash", label: "Analysis dashboard", desc: "Comparative ratio analysis over time and against the industry.", C: RatioDashboard },
  { id: "trend", label: "Profitability trends", desc: "Five years of gross profit, net profit and ROE.", C: ProfitabilityGraph },
  { id: "income", label: "Income statement", desc: "See sales flow down to net profit.", C: IncomeStatementVisual },
  { id: "balance", label: "Balance sheet", desc: "Assets = liabilities + owners' equity.", C: BalanceSheetVisual },
  { id: "cash", label: "Cash flow statement", desc: "Operating, investing and financing activities.", C: CashFlowVisual },
  { id: "rev", label: "Revenue, expenses & profit", desc: "Cost and revenue controls in profitability management.", C: RevExpChart },
  { id: "fx", label: "Exchange rates", desc: "Global financial management and hedging.", C: ExchangeVisual },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function FinanceLab() {
  const [tab, setTab] = usePersistentState<TabId>("financelab:tab", "sim");
  const t = TABS.find((x) => x.id === tab) ?? TABS[0];
  return (
    <div className="space-y-6">
      <PageHeader topic="finance" icon={<FlaskConical className="h-6 w-6" />} title="Finance lab" subtitle="Financial statement simulator, analysis dashboard and interactive statements — every calculation is internally consistent and tested." />
      <Tabs ariaLabel="Finance lab tools" value={tab} onChange={setTab} tabs={TABS.map((x) => ({ id: x.id, label: x.label }))} />
      <Card className="p-5">
        <p className="mb-4 text-sm text-stone-600 dark:text-stone-400">{t.desc}</p>
        <t.C />
      </Card>
    </div>
  );
}

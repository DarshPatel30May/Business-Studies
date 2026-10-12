import type { TopicId } from "./types";
import type { RatioFormat, RatioId } from "../lib/finance";
import * as F from "../lib/finance";
import { absenteeismRate, turnoverRate } from "../lib/sim/hr";

export interface FormulaInput {
  key: string;
  label: string;
  symbol: string;
  definition: string;
  example: number;
  prefix?: string;
}

export interface Formula {
  id: string;
  name: string;
  topic: TopicId;
  category: "Liquidity" | "Gearing (solvency)" | "Profitability" | "Efficiency" | "Statement calculation" | "Supporting calculation" | "HR indicator" | "Marketing measure";
  /** True when the formula is one of the ratios explicitly named in the syllabus. */
  syllabusRatio: boolean;
  latex: string;
  inputs: FormulaInput[];
  format: RatioFormat | "currency" | "percentValue" | "days";
  compute: (v: Record<string, number>) => number | null;
  ratioId?: RatioId;
  whenUsed: string;
  objective: string;
  mistakes: string[];
  interpretHint: (value: number | null) => string;
}

const pct = (x: number | null) => (x === null ? null : x);

export const FORMULAS: Formula[] = [
  {
    id: "current-ratio",
    name: "Current ratio",
    topic: "finance",
    category: "Liquidity",
    syllabusRatio: true,
    ratioId: "current",
    latex: "\\text{Current ratio} = \\dfrac{\\text{Current assets}}{\\text{Current liabilities}}",
    inputs: [
      { key: "ca", label: "Current assets", symbol: "CA", definition: "Assets expected to be converted to cash within 12 months: cash, accounts receivable, inventory, prepaid expenses.", example: 180_000, prefix: "$" },
      { key: "cl", label: "Current liabilities", symbol: "CL", definition: "Debts due within 12 months: accounts payable, overdraft, short-term loans, current portion of long-term debt.", example: 120_000, prefix: "$" },
    ],
    format: "ratio",
    compute: (v) => F.currentRatio(v.ca, v.cl),
    whenUsed: "To assess liquidity — whether the business can pay its short-term debts as they fall due.",
    objective: "Liquidity",
    mistakes: [
      "Using total assets or total liabilities instead of current figures.",
      "Writing the answer as a percentage — it is a ratio (e.g. 1.5 : 1).",
      "Assuming a higher ratio is always better — very high ratios suggest idle resources.",
    ],
    interpretHint: (v) => F.interpretRatio("current", v).meaning,
  },
  {
    id: "debt-to-equity",
    name: "Debt to equity ratio",
    topic: "finance",
    category: "Gearing (solvency)",
    syllabusRatio: true,
    ratioId: "debtToEquity",
    latex: "\\text{Debt to equity ratio} = \\dfrac{\\text{Total liabilities}}{\\text{Total equity}}",
    inputs: [
      { key: "tl", label: "Total liabilities", symbol: "TL", definition: "All debts owed to external parties — current plus non-current liabilities.", example: 300_000, prefix: "$" },
      { key: "te", label: "Total equity", symbol: "TE", definition: "Owners' funds in the business: capital contributed plus retained profits (= total assets − total liabilities).", example: 400_000, prefix: "$" },
    ],
    format: "ratio",
    compute: (v) => F.debtToEquity(v.tl, v.te),
    whenUsed: "To assess solvency (gearing) — the extent to which the business relies on debt rather than owners' funds.",
    objective: "Solvency",
    mistakes: [
      "Using only non-current liabilities — the syllabus formula uses TOTAL liabilities.",
      "Confusing equity with total assets.",
      "Interpreting high gearing as always bad — it can raise returns if borrowed funds earn more than their interest cost.",
    ],
    interpretHint: (v) => F.interpretRatio("debtToEquity", v).meaning,
  },
  {
    id: "gross-profit-ratio",
    name: "Gross profit ratio",
    topic: "finance",
    category: "Profitability",
    syllabusRatio: true,
    ratioId: "grossProfit",
    latex: "\\text{Gross profit ratio} = \\dfrac{\\text{Gross profit}}{\\text{Sales}} \\times 100",
    inputs: [
      { key: "gp", label: "Gross profit", symbol: "GP", definition: "Sales minus cost of goods sold.", example: 200_000, prefix: "$" },
      { key: "sales", label: "Sales", symbol: "S", definition: "Total revenue from selling goods and services (net of returns) for the period.", example: 500_000, prefix: "$" },
    ],
    format: "percent",
    compute: (v) => F.grossProfitRatio(v.gp, v.sales),
    whenUsed: "To measure the margin earned on goods sold, before operating expenses.",
    objective: "Profitability",
    mistakes: [
      "Using net profit instead of gross profit.",
      "Confusing gross profit with sales revenue.",
      "Forgetting to express the answer as a percentage.",
    ],
    interpretHint: (v) => F.interpretRatio("grossProfit", v).meaning,
  },
  {
    id: "net-profit-ratio",
    name: "Net profit ratio",
    topic: "finance",
    category: "Profitability",
    syllabusRatio: true,
    ratioId: "netProfit",
    latex: "\\text{Net profit ratio} = \\dfrac{\\text{Net profit}}{\\text{Sales}} \\times 100",
    inputs: [
      { key: "np", label: "Net profit", symbol: "NP", definition: "Gross profit minus all expenses for the period.", example: 60_000, prefix: "$" },
      { key: "sales", label: "Sales", symbol: "S", definition: "Total revenue from sales for the period.", example: 500_000, prefix: "$" },
    ],
    format: "percent",
    compute: (v) => F.netProfitRatio(v.np, v.sales),
    whenUsed: "To measure how much of each sales dollar is left as profit after all expenses.",
    objective: "Profitability",
    mistakes: [
      "Using gross profit instead of net profit.",
      "Not comparing with the gross profit ratio to identify whether expenses are the problem.",
    ],
    interpretHint: (v) => F.interpretRatio("netProfit", v).meaning,
  },
  {
    id: "return-on-equity",
    name: "Return on equity (ROE)",
    topic: "finance",
    category: "Profitability",
    syllabusRatio: true,
    ratioId: "roe",
    latex: "\\text{Return on equity} = \\dfrac{\\text{Net profit}}{\\text{Total equity}} \\times 100",
    inputs: [
      { key: "np", label: "Net profit", symbol: "NP", definition: "Profit after all expenses for the period.", example: 60_000, prefix: "$" },
      { key: "te", label: "Total equity", symbol: "TE", definition: "Owners' funds (total assets − total liabilities).", example: 400_000, prefix: "$" },
    ],
    format: "percent",
    compute: (v) => F.returnOnEquity(v.np, v.te),
    whenUsed: "To measure the return owners earn on their investment in the business.",
    objective: "Profitability",
    mistakes: [
      "Dividing by total assets instead of total equity.",
      "Ignoring gearing — high debt reduces equity and can inflate ROE.",
    ],
    interpretHint: (v) => F.interpretRatio("roe", v).meaning,
  },
  {
    id: "expense-ratio",
    name: "Expense ratio",
    topic: "finance",
    category: "Efficiency",
    syllabusRatio: true,
    ratioId: "expense",
    latex: "\\text{Expense ratio} = \\dfrac{\\text{Total expenses}}{\\text{Sales}} \\times 100",
    inputs: [
      { key: "exp", label: "Total expenses", symbol: "E", definition: "Expenses for the period as given in the question (commonly operating expenses — selling, administrative and financial).", example: 140_000, prefix: "$" },
      { key: "sales", label: "Sales", symbol: "S", definition: "Total revenue from sales for the period.", example: 500_000, prefix: "$" },
    ],
    format: "percent",
    compute: (v) => F.expenseRatio(v.exp, v.sales),
    whenUsed: "To measure efficiency — how much of each sales dollar is used by expenses.",
    objective: "Efficiency",
    mistakes: [
      "Treating expenses as liabilities — expenses are costs of a period; liabilities are debts owed.",
      "Inconsistently including or excluding cost of goods sold — use the 'total expenses' figure the question provides.",
    ],
    interpretHint: (v) => F.interpretRatio("expense", v).meaning,
  },
  {
    id: "ar-turnover",
    name: "Accounts receivable turnover ratio",
    topic: "finance",
    category: "Efficiency",
    syllabusRatio: true,
    ratioId: "arTurnover",
    latex: "\\text{Accounts receivable turnover} = \\dfrac{\\text{Sales}}{\\text{Accounts receivable}}",
    inputs: [
      { key: "sales", label: "Sales", symbol: "S", definition: "Total sales for the year (ideally credit sales, if given).", example: 730_000, prefix: "$" },
      { key: "ar", label: "Accounts receivable", symbol: "AR", definition: "Amounts owed to the business by credit customers (debtors).", example: 73_000, prefix: "$" },
    ],
    format: "times",
    compute: (v) => F.accountsReceivableTurnover(v.sales, v.ar),
    whenUsed: "To measure how efficiently the business collects money from credit customers. 365 ÷ the ratio gives the average collection period in days.",
    objective: "Efficiency (and liquidity)",
    mistakes: [
      "Inverting the formula (AR ÷ sales).",
      "Not converting to days when comparing with credit terms.",
      "Confusing accounts receivable (owed TO the business) with accounts payable (owed BY the business).",
    ],
    interpretHint: (v) => F.interpretRatio("arTurnover", v).meaning,
  },
  {
    id: "collection-period",
    name: "Average collection period (days)",
    topic: "finance",
    category: "Supporting calculation",
    syllabusRatio: false,
    latex: "\\text{Collection period} = \\dfrac{365}{\\text{Accounts receivable turnover}}",
    inputs: [{ key: "art", label: "Accounts receivable turnover", symbol: "ART", definition: "Sales ÷ accounts receivable.", example: 10 }],
    format: "days",
    compute: (v) => F.collectionPeriod(v.art),
    whenUsed: "To compare how long customers take to pay with the credit terms the business offers.",
    objective: "Efficiency / liquidity",
    mistakes: ["Dividing 365 by sales instead of by the turnover ratio."],
    interpretHint: (v) => (v === null ? "Cannot be calculated." : `Customers take about ${Math.round(v)} days on average to pay. If credit terms are 30 days, ${v > 30 ? "collection is slow — consider discounts for early payment, tighter credit control or factoring" : "collection is within terms"}.`),
  },
  {
    id: "gross-profit",
    name: "Gross profit",
    topic: "finance",
    category: "Statement calculation",
    syllabusRatio: false,
    latex: "\\text{Gross profit} = \\text{Sales} - \\text{Cost of goods sold}",
    inputs: [
      { key: "sales", label: "Sales", symbol: "S", definition: "Revenue from sales.", example: 500_000, prefix: "$" },
      { key: "cogs", label: "Cost of goods sold", symbol: "COGS", definition: "Opening stock + purchases − closing stock: the cost of the goods actually sold.", example: 300_000, prefix: "$" },
    ],
    format: "currency",
    compute: (v) => F.grossProfit(v.sales, v.cogs),
    whenUsed: "The first profit figure in the income statement.",
    objective: "Profitability",
    mistakes: ["Subtracting operating expenses here — they are deducted later to find net profit.", "Confusing gross profit with revenue."],
    interpretHint: (v) => (v === null ? "" : v >= 0 ? `The business earns ${F.formatCurrency(v)} after paying for the goods it sold, before other expenses.` : "Cost of goods sold exceeds sales — a gross loss."),
  },
  {
    id: "net-profit",
    name: "Net profit",
    topic: "finance",
    category: "Statement calculation",
    syllabusRatio: false,
    latex: "\\text{Net profit} = \\text{Gross profit} - \\text{Expenses}",
    inputs: [
      { key: "gp", label: "Gross profit", symbol: "GP", definition: "Sales − cost of goods sold.", example: 200_000, prefix: "$" },
      { key: "exp", label: "Expenses", symbol: "E", definition: "Selling, administrative and financial expenses (and tax if after-tax profit is required).", example: 140_000, prefix: "$" },
    ],
    format: "currency",
    compute: (v) => F.netProfit(v.gp, v.exp),
    whenUsed: "The 'bottom line' of the income statement.",
    objective: "Profitability",
    mistakes: ["Treating net profit as cash — profit is not the same as cash flow."],
    interpretHint: (v) => (v === null ? "" : v >= 0 ? `Net profit of ${F.formatCurrency(v)} is available for owners (dividends) or to retain for growth.` : `A net loss of ${F.formatCurrency(Math.abs(v))}.`),
  },
  {
    id: "sales-revenue",
    name: "Sales revenue",
    topic: "finance",
    category: "Statement calculation",
    syllabusRatio: false,
    latex: "\\text{Sales revenue} = \\text{Price} \\times \\text{Quantity sold}",
    inputs: [
      { key: "p", label: "Price per unit", symbol: "P", definition: "Selling price of one unit.", example: 45, prefix: "$" },
      { key: "q", label: "Quantity sold", symbol: "Q", definition: "Number of units sold in the period.", example: 12_000 },
    ],
    format: "currency",
    compute: (v) => F.salesRevenue(v.p, v.q),
    whenUsed: "To calculate revenue for forecasts and marketing objectives.",
    objective: "Profitability / growth",
    mistakes: ["Confusing revenue (money from sales) with profit (revenue minus expenses)."],
    interpretHint: (v) => (v === null ? "" : `Revenue of ${F.formatCurrency(v)} before any costs are deducted.`),
  },
  {
    id: "working-capital",
    name: "Working capital",
    topic: "finance",
    category: "Statement calculation",
    syllabusRatio: false,
    latex: "\\text{Working capital} = \\text{Current assets} - \\text{Current liabilities}",
    inputs: [
      { key: "ca", label: "Current assets", symbol: "CA", definition: "Assets convertible to cash within 12 months.", example: 180_000, prefix: "$" },
      { key: "cl", label: "Current liabilities", symbol: "CL", definition: "Debts due within 12 months.", example: 120_000, prefix: "$" },
    ],
    format: "currency",
    compute: (v) => F.workingCapital(v.ca, v.cl),
    whenUsed: "To show the funds available for day-to-day operations (the dollar version of the current ratio).",
    objective: "Liquidity",
    mistakes: ["Dividing instead of subtracting (that gives the current ratio)."],
    interpretHint: (v) => (v === null ? "" : v >= 0 ? `Positive working capital of ${F.formatCurrency(v)}: current assets cover current liabilities.` : "Negative working capital: current liabilities exceed current assets — a liquidity warning sign."),
  },
  {
    id: "percentage-change",
    name: "Percentage change",
    topic: "finance",
    category: "Supporting calculation",
    syllabusRatio: false,
    latex: "\\%\\ \\text{change} = \\dfrac{\\text{New value} - \\text{Old value}}{\\text{Old value}} \\times 100",
    inputs: [
      { key: "old", label: "Old (earlier) value", symbol: "Old", definition: "The value in the earlier period.", example: 400_000 },
      { key: "new", label: "New (later) value", symbol: "New", definition: "The value in the later period.", example: 460_000 },
    ],
    format: "percentValue",
    compute: (v) => pct(F.percentageChange(v.old, v.new)),
    whenUsed: "To measure growth or decline over time — sales, profit, market share, turnover, costs.",
    objective: "Growth (and comparative analysis)",
    mistakes: ["Dividing by the new value instead of the old value.", "Confusing a percentage change with a change in percentage points (e.g. a market share moving from 10% to 12% is +2 percentage points but a 20% increase)."],
    interpretHint: (v) => (v === null ? "Cannot be calculated from an old value of zero." : `${v >= 0 ? "An increase" : "A decrease"} of ${Math.abs(F.round(v, 1))}% over the period.`),
  },
  {
    id: "market-share",
    name: "Market share",
    topic: "marketing",
    category: "Marketing measure",
    syllabusRatio: false,
    latex: "\\text{Market share} = \\dfrac{\\text{Business's sales}}{\\text{Total market sales}} \\times 100",
    inputs: [
      { key: "own", label: "Business's sales", symbol: "S_b", definition: "The business's sales (units or $) in the market.", example: 3_000_000, prefix: "$" },
      { key: "total", label: "Total market sales", symbol: "S_m", definition: "Sales of all businesses in that market (same units).", example: 25_000_000, prefix: "$" },
    ],
    format: "percentValue",
    compute: (v) => {
      const r = F.safeDivide(v.own, v.total);
      return r === null ? null : r * 100;
    },
    whenUsed: "To measure progress toward market share objectives in the marketing process.",
    objective: "Growth (marketing objective)",
    mistakes: ["Mixing units and dollars in numerator and denominator."],
    interpretHint: (v) => (v === null ? "" : `The business holds ${F.round(v, 1)}% of the market. Compare with targets and competitors over time.`),
  },
  {
    id: "turnover-rate",
    name: "Staff turnover rate",
    topic: "hr",
    category: "HR indicator",
    syllabusRatio: false,
    latex: "\\text{Staff turnover rate} = \\dfrac{\\text{Number of separations}}{\\text{Average number of employees}} \\times 100",
    inputs: [
      { key: "sep", label: "Separations in the period", symbol: "Sep", definition: "Employees who left (resignations, dismissals, retirements, redundancies).", example: 18 },
      { key: "avg", label: "Average number of employees", symbol: "Avg", definition: "(Employees at start + employees at end) ÷ 2.", example: 120 },
    ],
    format: "percentValue",
    compute: (v) => turnoverRate(v.sep, v.avg),
    whenUsed: "As an indicator of HR effectiveness (changes in staff turnover).",
    objective: "HR effectiveness (links to efficiency and profitability)",
    mistakes: ["Using the end-of-year headcount instead of the average.", "Treating all turnover as bad — some turnover is healthy."],
    interpretHint: (v) => (v === null ? "" : `${F.round(v, 1)}% of the workforce left during the period. Compare with past years and the industry benchmark.`),
  },
  {
    id: "absenteeism-rate",
    name: "Absenteeism rate",
    topic: "hr",
    category: "HR indicator",
    syllabusRatio: false,
    latex: "\\text{Absenteeism rate} = \\dfrac{\\text{Days lost to unplanned absence}}{\\text{Total scheduled working days}} \\times 100",
    inputs: [
      { key: "lost", label: "Days lost to unplanned absence", symbol: "D", definition: "Working days employees were absent without prior approval.", example: 540 },
      { key: "sched", label: "Total scheduled working days", symbol: "T", definition: "Employees × scheduled working days in the period.", example: 12_000 },
    ],
    format: "percentValue",
    compute: (v) => absenteeismRate(v.lost, v.sched),
    whenUsed: "As an indicator of HR effectiveness (absenteeism).",
    objective: "HR effectiveness",
    mistakes: ["Including approved annual leave as absenteeism."],
    interpretHint: (v) => (v === null ? "" : `On average ${F.round(v, 1)}% of scheduled working time was lost to unplanned absence.`),
  },
];

export const formulaById = (id: string) => FORMULAS.find((f) => f.id === id);

export function formatFormulaValue(f: Formula, value: number | null): string {
  if (value === null) return "undefined (check that the denominator is not zero)";
  switch (f.format) {
    case "currency":
      return F.formatCurrency(value);
    case "percentValue":
      return `${F.formatNumber(F.round(value, 2), 2)}%`;
    case "days":
      return `${F.formatNumber(F.round(value, 1), 1)} days`;
    default:
      return F.formatRatio(value, f.format);
  }
}

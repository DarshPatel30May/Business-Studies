// Financial calculations used across the site. All functions are pure so they can be unit tested.
// Ratio definitions follow the NSW Business Studies Stage 6 Syllabus (2010), HSC Topic 3 Finance:
//   current ratio = current assets ÷ current liabilities
//   debt to equity ratio = total liabilities ÷ total equity
//   gross profit ratio = gross profit ÷ sales
//   net profit ratio = net profit ÷ sales
//   return on equity ratio = net profit ÷ total equity
//   expense ratio = total expenses ÷ sales
//   accounts receivable turnover ratio = sales ÷ accounts receivable

export type RatioId =
  | "current"
  | "debtToEquity"
  | "grossProfit"
  | "netProfit"
  | "roe"
  | "expense"
  | "arTurnover";

export type RatioFormat = "ratio" | "percent" | "times";

/** Divide, returning null when the denominator is zero or either value is not finite. */
export function safeDivide(numerator: number, denominator: number): number | null {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) return null;
  return numerator / denominator;
}

/** Round half away from zero to `dp` decimal places, avoiding binary floating point artefacts. */
export function round(value: number, dp = 2): number {
  const factor = 10 ** dp;
  const shifted = Math.abs(value) * factor;
  const rounded = Math.round(Number(shifted.toPrecision(15)));
  return (Math.sign(value) * rounded) / factor;
}

export const grossProfit = (sales: number, cogs: number) => sales - cogs;
export const netProfit = (grossProfitValue: number, expenses: number) => grossProfitValue - expenses;
export const salesRevenue = (price: number, quantity: number) => price * quantity;
export const workingCapital = (currentAssets: number, currentLiabilities: number) =>
  currentAssets - currentLiabilities;

export const currentRatio = (currentAssets: number, currentLiabilities: number) =>
  safeDivide(currentAssets, currentLiabilities);
export const debtToEquity = (totalLiabilities: number, totalEquity: number) =>
  safeDivide(totalLiabilities, totalEquity);
export const grossProfitRatio = (gp: number, sales: number) => safeDivide(gp, sales);
export const netProfitRatio = (np: number, sales: number) => safeDivide(np, sales);
export const returnOnEquity = (np: number, totalEquity: number) => safeDivide(np, totalEquity);
export const expenseRatio = (totalExpenses: number, sales: number) => safeDivide(totalExpenses, sales);
export const accountsReceivableTurnover = (sales: number, receivables: number) =>
  safeDivide(sales, receivables);

/** Average collection period in days, derived from the accounts receivable turnover ratio. */
export function collectionPeriod(arTurnover: number | null, daysInYear = 365): number | null {
  if (arTurnover === null || arTurnover <= 0) return null;
  return daysInYear / arTurnover;
}

/** Percentage change from an old value to a new value, as a percentage (e.g. 12.5 for +12.5%). */
export function percentageChange(oldValue: number, newValue: number): number | null {
  const r = safeDivide(newValue - oldValue, Math.abs(oldValue));
  return r === null ? null : r * 100;
}

export function formatCurrency(value: number, dp = 0): string {
  const sign = value < 0 ? "−" : "";
  return (
    sign +
    "$" +
    Math.abs(value).toLocaleString("en-AU", { minimumFractionDigits: dp, maximumFractionDigits: dp })
  );
}

export function formatNumber(value: number, dp = 2): string {
  return value.toLocaleString("en-AU", { minimumFractionDigits: 0, maximumFractionDigits: dp });
}

/** Present a raw ratio in HSC reporting format. */
export function formatRatio(value: number | null, format: RatioFormat, dp = 2): string {
  if (value === null) return "undefined (denominator is zero)";
  switch (format) {
    case "percent":
      return `${formatNumber(round(value * 100, dp), dp)}%`;
    case "times":
      return `${formatNumber(round(value, dp), dp)} times`;
    default:
      return `${formatNumber(round(value, dp), dp)} : 1`;
  }
}

// ---------------------------------------------------------------------------
// Ratio interpretation. Benchmarks are general textbook guides only — they vary
// greatly between industries and must be compared over time and against peers.
// ---------------------------------------------------------------------------

export type Rating = "strong" | "adequate" | "concern" | "neutral";

export interface Interpretation {
  rating: Rating;
  headline: string;
  meaning: string;
  implications: string[];
}

export function interpretRatio(id: RatioId, value: number | null): Interpretation {
  if (value === null) {
    return {
      rating: "neutral",
      headline: "Cannot be calculated",
      meaning: "The denominator is zero, so the ratio is undefined. Check the figures entered.",
      implications: [],
    };
  }
  switch (id) {
    case "current": {
      if (value < 1)
        return {
          rating: "concern",
          headline: "Liquidity concern",
          meaning: `The business has $${round(value, 2)} of current assets for every $1 of current liabilities, so it may not be able to pay its short-term debts as they fall due from current assets alone.`,
          implications: [
            "Risk of relying on an overdraft or emergency borrowing to meet obligations.",
            "Consider working capital strategies: faster collection of receivables, reducing excess inventory, renegotiating payables, or sale and leaseback.",
          ],
        };
      if (value <= 2.0)
        return {
          rating: value >= 1.5 ? "strong" : "adequate",
          headline: value >= 1.5 ? "Sound liquidity" : "Acceptable liquidity",
          meaning: `The business holds $${round(value, 2)} of current assets for each $1 of current liabilities. Textbooks commonly cite about 1.5–2 : 1 as a comfortable range, although the appropriate level depends on the industry.`,
          implications: [
            "The business should be able to meet short-term obligations.",
            "Monitor the trend over time and the quality of current assets (e.g. slow-moving inventory).",
          ],
        };
      return {
        rating: "adequate",
        headline: "Very high liquidity",
        meaning: `With $${round(value, 2)} of current assets per $1 of current liabilities, liquidity is high — but excess cash, receivables or inventory may be idle resources that could earn a better return.`,
        implications: [
          "Check whether inventory or receivables are building up (slow sales or slow collections).",
          "Surplus cash could be invested, used to repay debt or used for growth.",
        ],
      };
    }
    case "debtToEquity": {
      if (value > 1.5)
        return {
          rating: "concern",
          headline: "Highly geared",
          meaning: `The business has $${round(value, 2)} of liabilities for every $1 of owners' equity. It relies heavily on debt finance, increasing financial risk and interest commitments.`,
          implications: [
            "Solvency risk rises if profits fall or interest rates increase.",
            "Lenders may charge higher interest or refuse further credit.",
            "Consider equity finance or using retained profits to reduce debt.",
          ],
        };
      if (value > 1)
        return {
          rating: "adequate",
          headline: "Moderately high gearing",
          meaning: `Liabilities exceed equity ($${round(value, 2)} per $1 of equity). This may be acceptable for stable, asset-heavy businesses but increases risk.`,
          implications: [
            "Debt can increase returns to owners if the return on borrowed funds exceeds the interest cost.",
            "Monitor interest cover and the ability to refinance.",
          ],
        };
      return {
        rating: "strong",
        headline: "Low to moderate gearing",
        meaning: `The business has $${round(value, 2)} of liabilities for each $1 of equity, so it is financed more by owners than by creditors. Textbooks commonly treat a ratio below 1 : 1 as lower risk.`,
        implications: [
          "Strong solvency position and capacity to borrow for growth.",
          "Very low gearing may mean the business is missing profitable opportunities that debt could fund.",
        ],
      };
    }
    case "grossProfit":
      return {
        rating: value <= 0 ? "concern" : "neutral",
        headline: value <= 0 ? "No gross profit" : `${round(value * 100, 1)} cents of gross profit per $1 of sales`,
        meaning:
          value <= 0
            ? "Cost of goods sold equals or exceeds sales — the business loses money on what it sells before any operating expenses."
            : `For every $1 of sales, ${round(value * 100, 1)} cents remains after paying for the goods sold. Compare with previous periods and industry averages: supermarkets typically have much lower margins than software businesses.`,
        implications: [
          "A falling gross profit ratio may indicate rising supplier costs, discounting or a change in sales mix.",
          "Improve by negotiating with suppliers, global sourcing, reducing waste or adjusting pricing.",
        ],
      };
    case "netProfit":
      return {
        rating: value <= 0 ? "concern" : "neutral",
        headline: value <= 0 ? "Net loss" : `${round(value * 100, 1)} cents of net profit per $1 of sales`,
        meaning:
          value <= 0
            ? "Expenses exceed gross profit, so the business made a loss for the period."
            : `After all expenses, ${round(value * 100, 1)} cents of every sales dollar is profit. A large gap between the gross and net profit ratios points to high operating expenses.`,
        implications: [
          "Compare with the gross profit ratio to see whether expenses are the problem.",
          "Profitability management: cost controls (fixed and variable costs, cost centres, expense minimisation) and revenue controls.",
        ],
      };
    case "roe":
      return {
        rating: value <= 0 ? "concern" : "neutral",
        headline: value <= 0 ? "Negative return to owners" : `${round(value * 100, 1)}% return on owners' funds`,
        meaning:
          value <= 0
            ? "Owners earned no return on their investment for the period."
            : `Owners earned ${round(value * 100, 1)} cents of net profit for every $1 they have invested. Compare with the return available from alternative investments of similar risk.`,
        implications: [
          "High ROE may reflect strong profitability — or high gearing (less equity), so check the debt to equity ratio.",
          "Low ROE may discourage investors and make equity finance harder to raise.",
        ],
      };
    case "expense":
      return {
        rating: value >= 1 ? "concern" : "neutral",
        headline: `${round(value * 100, 1)} cents of expenses per $1 of sales`,
        meaning:
          value >= 1
            ? "Expenses equal or exceed sales — the business is not covering its costs."
            : `Expenses consume ${round(value * 100, 1)} cents of every sales dollar. A rising expense ratio means expenses are growing faster than sales.`,
        implications: [
          "Analyse individual expense categories (selling, administrative, finance) to locate the problem.",
          "Use budgets, cost centres and expense minimisation to control costs.",
        ],
      };
    case "arTurnover": {
      const days = collectionPeriod(value);
      return {
        rating: days !== null && days > 60 ? "concern" : "neutral",
        headline: `Receivables collected ${round(value, 2)} times a year (≈ ${days === null ? "–" : Math.round(days)} days)`,
        meaning: `The business turns its accounts receivable into cash about ${round(value, 2)} times per year — an average collection period of about ${days === null ? "–" : Math.round(days)} days. Compare this with the credit terms offered (e.g. 30 days).`,
        implications: [
          "A slow collection period ties up cash and weakens liquidity.",
          "Improve with discounts for early payment, tighter credit policies, debt-collection follow-up or factoring.",
        ],
      };
    }
  }
}

// ---------------------------------------------------------------------------
// Financial statement model for the statement simulator.
// ---------------------------------------------------------------------------

export interface StatementInputs {
  sales: number;
  cogs: number;
  operatingExpenses: number;
  currentAssets: number;
  receivables: number;
  currentLiabilities: number;
  totalLiabilities: number;
  ownersEquity: number;
  /** Total assets. If omitted it is derived as liabilities + equity (accounting equation). */
  totalAssets?: number;
}

export interface ValidationIssue {
  field: keyof StatementInputs | "balance";
  message: string;
}

export interface Statements {
  income: {
    sales: number;
    cogs: number;
    grossProfit: number;
    operatingExpenses: number;
    netProfit: number;
  };
  balance: {
    currentAssets: number;
    receivables: number;
    otherCurrentAssets: number;
    nonCurrentAssets: number;
    totalAssets: number;
    currentLiabilities: number;
    nonCurrentLiabilities: number;
    totalLiabilities: number;
    ownersEquity: number;
    liabilitiesPlusEquity: number;
    balances: boolean;
  };
  ratios: Record<RatioId, number | null>;
  workingCapital: number;
  issues: ValidationIssue[];
}

export function validateStatementInputs(i: StatementInputs): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const nonNegative: (keyof StatementInputs)[] = [
    "sales",
    "cogs",
    "operatingExpenses",
    "currentAssets",
    "receivables",
    "currentLiabilities",
    "totalLiabilities",
  ];
  for (const f of nonNegative) {
    const v = i[f];
    if (typeof v === "number" && (!Number.isFinite(v) || v < 0))
      issues.push({ field: f, message: `${labelFor(f)} cannot be negative.` });
  }
  if (i.receivables > i.currentAssets)
    issues.push({
      field: "receivables",
      message: "Receivables are part of current assets, so they cannot exceed total current assets.",
    });
  if (i.currentLiabilities > i.totalLiabilities)
    issues.push({
      field: "currentLiabilities",
      message: "Current liabilities are part of total liabilities, so they cannot exceed total liabilities.",
    });
  const totalAssets = i.totalAssets ?? i.totalLiabilities + i.ownersEquity;
  if (totalAssets < i.currentAssets)
    issues.push({
      field: "balance",
      message:
        "Total assets (liabilities + owners' equity) would be smaller than current assets, implying negative non-current assets. Increase liabilities or equity, or reduce current assets.",
    });
  if (i.totalAssets !== undefined && round(i.totalAssets, 2) !== round(i.totalLiabilities + i.ownersEquity, 2))
    issues.push({
      field: "balance",
      message: `The balance sheet does not balance: assets ${formatCurrency(i.totalAssets)} ≠ liabilities + owners' equity ${formatCurrency(
        i.totalLiabilities + i.ownersEquity,
      )}. Under the accounting equation (Assets = Liabilities + Owners' equity) the two sides must be equal.`,
    });
  return issues;
}

function labelFor(f: keyof StatementInputs): string {
  const map: Record<keyof StatementInputs, string> = {
    sales: "Sales",
    cogs: "Cost of goods sold",
    operatingExpenses: "Operating expenses",
    currentAssets: "Current assets",
    receivables: "Accounts receivable",
    currentLiabilities: "Current liabilities",
    totalLiabilities: "Total liabilities",
    ownersEquity: "Owners' equity",
    totalAssets: "Total assets",
  };
  return map[f];
}

export function buildStatements(i: StatementInputs): Statements {
  const gp = grossProfit(i.sales, i.cogs);
  const np = netProfit(gp, i.operatingExpenses);
  const totalAssets = i.totalAssets ?? i.totalLiabilities + i.ownersEquity;
  const liabilitiesPlusEquity = i.totalLiabilities + i.ownersEquity;
  return {
    income: {
      sales: i.sales,
      cogs: i.cogs,
      grossProfit: gp,
      operatingExpenses: i.operatingExpenses,
      netProfit: np,
    },
    balance: {
      currentAssets: i.currentAssets,
      receivables: i.receivables,
      otherCurrentAssets: i.currentAssets - i.receivables,
      nonCurrentAssets: totalAssets - i.currentAssets,
      totalAssets,
      currentLiabilities: i.currentLiabilities,
      nonCurrentLiabilities: i.totalLiabilities - i.currentLiabilities,
      totalLiabilities: i.totalLiabilities,
      ownersEquity: i.ownersEquity,
      liabilitiesPlusEquity,
      balances: round(totalAssets, 2) === round(liabilitiesPlusEquity, 2),
    },
    ratios: {
      current: currentRatio(i.currentAssets, i.currentLiabilities),
      debtToEquity: debtToEquity(i.totalLiabilities, i.ownersEquity),
      grossProfit: grossProfitRatio(gp, i.sales),
      netProfit: netProfitRatio(np, i.sales),
      roe: returnOnEquity(np, i.ownersEquity),
      expense: expenseRatio(i.operatingExpenses, i.sales),
      arTurnover: accountsReceivableTurnover(i.sales, i.receivables),
    },
    workingCapital: workingCapital(i.currentAssets, i.currentLiabilities),
    issues: validateStatementInputs(i),
  };
}

// ---------------------------------------------------------------------------
// Cash flow statement
// ---------------------------------------------------------------------------

export interface CashFlowLine {
  id: string;
  label: string;
  activity: "operating" | "investing" | "financing";
  /** Positive = inflow, negative = outflow. */
  amount: number;
}

export interface CashFlowSummary {
  operating: number;
  investing: number;
  financing: number;
  netChange: number;
  openingCash: number;
  closingCash: number;
}

export function summariseCashFlow(lines: CashFlowLine[], openingCash: number): CashFlowSummary {
  const sum = (a: CashFlowLine["activity"]) =>
    lines.filter((l) => l.activity === a).reduce((t, l) => t + l.amount, 0);
  const operating = sum("operating");
  const investing = sum("investing");
  const financing = sum("financing");
  const netChange = operating + investing + financing;
  return { operating, investing, financing, netChange, openingCash, closingCash: openingCash + netChange };
}

// ---------------------------------------------------------------------------
// Exchange rate effects (global financial management)
// ---------------------------------------------------------------------------

/** AUD cost of a foreign-currency amount given the rate quoted as foreign units per 1 AUD (e.g. 0.65 USD). */
export function audCostOfForeignAmount(foreignAmount: number, foreignPerAud: number): number | null {
  return safeDivide(foreignAmount, foreignPerAud);
}

/** Foreign-currency price of an AUD amount given the rate quoted as foreign units per 1 AUD. */
export function foreignPriceOfAudAmount(audAmount: number, foreignPerAud: number): number {
  return audAmount * foreignPerAud;
}

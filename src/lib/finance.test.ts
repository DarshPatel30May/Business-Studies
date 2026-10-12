import { describe, expect, it } from "vitest";
import {
  accountsReceivableTurnover,
  audCostOfForeignAmount,
  buildStatements,
  collectionPeriod,
  currentRatio,
  debtToEquity,
  expenseRatio,
  formatRatio,
  grossProfit,
  grossProfitRatio,
  interpretRatio,
  netProfit,
  netProfitRatio,
  percentageChange,
  returnOnEquity,
  round,
  safeDivide,
  summariseCashFlow,
  validateStatementInputs,
  workingCapital,
} from "./finance";

describe("basic calculations", () => {
  it("calculates gross and net profit", () => {
    expect(grossProfit(500_000, 300_000)).toBe(200_000);
    expect(netProfit(200_000, 150_000)).toBe(50_000);
  });
  it("calculates working capital", () => {
    expect(workingCapital(120_000, 80_000)).toBe(40_000);
  });
  it("handles division by zero", () => {
    expect(safeDivide(5, 0)).toBeNull();
    expect(currentRatio(100, 0)).toBeNull();
  });
  it("rounds half away from zero without floating point error", () => {
    expect(round(1.005, 2)).toBe(1.01);
    expect(round(-2.345, 2)).toBe(-2.35);
    expect(round(0.1 + 0.2, 2)).toBe(0.3);
  });
  it("calculates percentage change", () => {
    expect(percentageChange(200, 250)).toBe(25);
    expect(percentageChange(250, 200)).toBe(-20);
    expect(percentageChange(0, 10)).toBeNull();
    expect(percentageChange(-100, -50)).toBe(50);
  });
});

describe("syllabus ratios", () => {
  it("current ratio = current assets ÷ current liabilities", () => {
    expect(currentRatio(150_000, 100_000)).toBe(1.5);
    expect(formatRatio(currentRatio(150_000, 100_000), "ratio")).toBe("1.5 : 1");
  });
  it("debt to equity = total liabilities ÷ total equity", () => {
    expect(debtToEquity(300_000, 400_000)).toBe(0.75);
  });
  it("gross profit ratio = gross profit ÷ sales", () => {
    expect(grossProfitRatio(200_000, 500_000)).toBe(0.4);
    expect(formatRatio(0.4, "percent")).toBe("40%");
  });
  it("net profit ratio = net profit ÷ sales", () => {
    expect(netProfitRatio(50_000, 500_000)).toBe(0.1);
  });
  it("return on equity = net profit ÷ total equity", () => {
    expect(returnOnEquity(50_000, 400_000)).toBe(0.125);
    expect(formatRatio(0.125, "percent", 1)).toBe("12.5%");
  });
  it("expense ratio = total expenses ÷ sales", () => {
    expect(expenseRatio(150_000, 500_000)).toBe(0.3);
  });
  it("accounts receivable turnover = sales ÷ accounts receivable, and collection period", () => {
    const art = accountsReceivableTurnover(730_000, 73_000);
    expect(art).toBe(10);
    expect(collectionPeriod(art)).toBe(36.5);
    expect(formatRatio(art, "times")).toBe("10 times");
    expect(collectionPeriod(null)).toBeNull();
  });
});

describe("interpretation", () => {
  it("flags a current ratio below 1 as a liquidity concern", () => {
    expect(interpretRatio("current", 0.8).rating).toBe("concern");
    expect(interpretRatio("current", 1.7).rating).toBe("strong");
    expect(interpretRatio("current", 3.2).headline).toMatch(/high/i);
  });
  it("flags high gearing", () => {
    expect(interpretRatio("debtToEquity", 2).rating).toBe("concern");
    expect(interpretRatio("debtToEquity", 0.6).rating).toBe("strong");
  });
  it("flags a net loss", () => {
    expect(interpretRatio("netProfit", -0.05).rating).toBe("concern");
  });
  it("handles undefined ratios", () => {
    expect(interpretRatio("roe", null).rating).toBe("neutral");
  });
});

describe("financial statements", () => {
  const base = {
    sales: 800_000,
    cogs: 480_000,
    operatingExpenses: 220_000,
    currentAssets: 210_000,
    receivables: 80_000,
    currentLiabilities: 140_000,
    totalLiabilities: 360_000,
    ownersEquity: 440_000,
  };
  it("builds internally consistent statements", () => {
    const s = buildStatements(base);
    expect(s.income.grossProfit).toBe(320_000);
    expect(s.income.netProfit).toBe(100_000);
    expect(s.balance.totalAssets).toBe(800_000);
    expect(s.balance.nonCurrentAssets).toBe(590_000);
    expect(s.balance.nonCurrentLiabilities).toBe(220_000);
    expect(s.balance.balances).toBe(true);
    expect(s.balance.totalAssets).toBe(s.balance.totalLiabilities + s.balance.ownersEquity);
    expect(s.ratios.current).toBe(1.5);
    expect(s.ratios.grossProfit).toBe(0.4);
    expect(s.ratios.netProfit).toBe(0.125);
    expect(s.ratios.arTurnover).toBe(10);
    expect(s.workingCapital).toBe(70_000);
    expect(s.issues).toHaveLength(0);
  });
  it("detects a balance sheet that does not balance", () => {
    const issues = validateStatementInputs({ ...base, totalAssets: 900_000 });
    expect(issues.some((i) => i.field === "balance")).toBe(true);
    expect(buildStatements({ ...base, totalAssets: 900_000 }).balance.balances).toBe(false);
  });
  it("rejects receivables larger than current assets", () => {
    expect(validateStatementInputs({ ...base, receivables: 300_000 }).some((i) => i.field === "receivables")).toBe(true);
  });
  it("rejects current liabilities larger than total liabilities", () => {
    expect(validateStatementInputs({ ...base, currentLiabilities: 400_000 }).some((i) => i.field === "currentLiabilities")).toBe(true);
  });
  it("rejects negative non-current assets", () => {
    expect(validateStatementInputs({ ...base, currentAssets: 900_000 }).some((i) => i.field === "balance")).toBe(true);
  });
});

describe("cash flow and exchange rates", () => {
  it("summarises the three activities", () => {
    const s = summariseCashFlow(
      [
        { id: "a", label: "Receipts from customers", activity: "operating", amount: 500 },
        { id: "b", label: "Payments to suppliers", activity: "operating", amount: -300 },
        { id: "c", label: "Purchase of equipment", activity: "investing", amount: -150 },
        { id: "d", label: "Loan received", activity: "financing", amount: 100 },
      ],
      50,
    );
    expect(s.operating).toBe(200);
    expect(s.investing).toBe(-150);
    expect(s.financing).toBe(100);
    expect(s.netChange).toBe(150);
    expect(s.closingCash).toBe(200);
  });
  it("shows a falling AUD raises the AUD cost of imports", () => {
    const strong = audCostOfForeignAmount(10_000, 0.7)!;
    const weak = audCostOfForeignAmount(10_000, 0.6)!;
    expect(weak).toBeGreaterThan(strong);
    expect(round(weak, 2)).toBe(16_666.67);
  });
});

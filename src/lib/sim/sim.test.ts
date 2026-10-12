import { describe, expect, it } from "vitest";
import { simulateOperations, type OpsDecisions } from "./operations";
import { simulateMarketing, type MktDecisions } from "./marketing";
import { absenteeismRate, simulateHr, turnoverRate, type HrDecisions } from "./hr";
import { DEFAULT_DECISIONS, PRESETS, initialState, runQuarter } from "./business";

const ops: OpsDecisions = { inventory: "buffer", technology: "established", quality: "control", supplier: "single-local", outsourcing: "in-house" };

describe("operations simulator", () => {
  it("is deterministic", () => {
    expect(simulateOperations(ops)).toEqual(simulateOperations(ops));
  });
  it("JIT lowers inventory holdings and operating cost", () => {
    const base = simulateOperations(ops);
    const jit = simulateOperations({ ...ops, inventory: "jit" });
    expect(jit.inventoryDays).toBeLessThan(base.inventoryDays);
    expect(jit.operatingCost).toBeLessThan(base.operatingCost);
  });
  it("JIT with global suppliers reduces delivery reliability and raises a risk", () => {
    const a = simulateOperations({ ...ops, inventory: "jit", supplier: "partnership" });
    const b = simulateOperations({ ...ops, inventory: "jit", supplier: "multiple-global" });
    expect(b.reliability).toBeLessThan(a.reliability);
    expect(b.risks.some((r) => r.includes("JIT"))).toBe(true);
  });
  it("quality improvement raises quality", () => {
    expect(simulateOperations({ ...ops, quality: "improvement" }).quality).toBeGreaterThan(simulateOperations(ops).quality);
  });
  it("keeps outputs within bounds", () => {
    const r = simulateOperations({ inventory: "jit", technology: "leading", quality: "improvement", supplier: "partnership", outsourcing: "noncore" });
    expect(r.quality).toBeLessThanOrEqual(100);
    expect(r.reliability).toBeLessThanOrEqual(99.5);
    expect(r.satisfaction).toBeGreaterThanOrEqual(0);
    expect(r.satisfaction).toBeLessThanOrEqual(100);
  });
});

describe("marketing simulator", () => {
  const consistent: MktDecisions = { target: "niche-premium", positioning: "premium", pricing: "skimming", promotion: "personal", distribution: "exclusive", budget: 150_000 };
  it("is deterministic", () => {
    expect(simulateMarketing(consistent)).toEqual(simulateMarketing(consistent));
  });
  it("rewards a consistent marketing mix over a conflicting one", () => {
    const conflicting = simulateMarketing({ ...consistent, positioning: "value", pricing: "penetration", distribution: "intensive", promotion: "sales-promo" });
    const good = simulateMarketing(consistent);
    expect(good.consistency).toBeGreaterThan(conflicting.consistency);
    expect(good.profit).toBeGreaterThan(conflicting.profit);
  });
  it("revenue equals units × price", () => {
    const r = simulateMarketing(consistent);
    expect(r.revenue).toBe(r.unitsSold * r.price);
  });
  it("shows diminishing returns to promotional budget", () => {
    const a = simulateMarketing({ ...consistent, budget: 50_000 }).awareness;
    const b = simulateMarketing({ ...consistent, budget: 100_000 }).awareness;
    const c = simulateMarketing({ ...consistent, budget: 150_000 }).awareness;
    expect(b - a).toBeGreaterThan(c - b);
  });
  it("skimming sets a higher price than penetration", () => {
    expect(simulateMarketing(consistent).price).toBeGreaterThan(simulateMarketing({ ...consistent, pricing: "penetration" }).price);
  });
});

describe("HR simulator", () => {
  const base: HrDecisions = { recruitment: "mixed", training: "minimal", leadership: "autocratic", rewards: "award", performance: "administrative", disputes: "grievance" };
  it("is deterministic", () => {
    expect(simulateHr(base)).toEqual(simulateHr(base));
  });
  it("democratic leadership and development reduce turnover", () => {
    const better = simulateHr({ ...base, leadership: "democratic", training: "future", performance: "developmental" });
    expect(better.turnover).toBeLessThan(simulateHr(base).turnover);
    expect(better.satisfaction).toBeGreaterThan(simulateHr(base).satisfaction);
  });
  it("early tribunal escalation harms workplace relations", () => {
    expect(simulateHr({ ...base, disputes: "tribunal" }).relations).toBeLessThan(simulateHr({ ...base, disputes: "negotiation" }).relations);
  });
  it("always lists legal obligations", () => {
    expect(simulateHr(base).legal.length).toBeGreaterThanOrEqual(3);
  });
  it("calculates HR metrics", () => {
    expect(turnoverRate(15, 100)).toBe(15);
    expect(turnoverRate(1, 0)).toBeNull();
    expect(absenteeismRate(45, 1000)).toBe(4.5);
  });
});

describe("business simulation", () => {
  it("is deterministic", () => {
    const p = PRESETS.manufacturing;
    const a = runQuarter(p, initialState(p), DEFAULT_DECISIONS);
    const b = runQuarter(p, initialState(p), DEFAULT_DECISIONS);
    expect(a).toEqual(b);
  });
  it("keeps the profit identity: profit = revenue − expenses", () => {
    for (const p of Object.values(PRESETS)) {
      const { result } = runQuarter(p, initialState(p), DEFAULT_DECISIONS);
      expect(result.profit).toBe(result.revenue - result.expenses);
      expect(result.unitsSold).toBeLessThanOrEqual(result.capacity);
    }
  });
  it("cash balance carries between quarters", () => {
    const p = PRESETS.retail;
    const q1 = runQuarter(p, initialState(p), DEFAULT_DECISIONS);
    const q2 = runQuarter(p, q1.next, DEFAULT_DECISIONS);
    expect(q2.result.cashBalance).toBe(q1.result.cashBalance + q2.result.cashFlow);
    expect(q2.result.quarter).toBe(2);
  });
  it("borrowing increases cash and adds interest", () => {
    const p = PRESETS.tech;
    const without = runQuarter(p, initialState(p), DEFAULT_DECISIONS).result;
    const withLoan = runQuarter(p, initialState(p), { ...DEFAULT_DECISIONS, borrowing: 150_000 }).result;
    expect(withLoan.interest).toBe(3000);
    expect(withLoan.cashBalance).toBeGreaterThan(without.cashBalance);
    expect(withLoan.loanBalance).toBe(135_000);
  });
  it("factoring speeds up cash but costs a fee", () => {
    const p = PRESETS.manufacturing;
    const std = runQuarter(p, initialState(p), DEFAULT_DECISIONS).result;
    const fac = runQuarter(p, initialState(p), { ...DEFAULT_DECISIONS, cash: "factoring" }).result;
    expect(fac.profit).toBeLessThan(std.profit);
    expect(fac.cashFlow).toBeGreaterThan(std.cashFlow);
  });
  it("raising price reduces demand", () => {
    const p = PRESETS.hospitality;
    const lo = runQuarter(p, initialState(p), { ...DEFAULT_DECISIONS, priceChange: -10 }).result;
    const hi = runQuarter(p, initialState(p), { ...DEFAULT_DECISIONS, priceChange: 10 }).result;
    expect(hi.demand).toBeLessThan(lo.demand);
  });
});

import { describe, expect, it } from "vitest";
import { annualHoldingCost, averageInventoryValue, valueInventory } from "./inventory";

const batches = [
  { label: "Opening stock", units: 100, unitCost: 10 },
  { label: "March purchase", units: 100, unitCost: 12 },
  { label: "June purchase", units: 100, unitCost: 15 },
];

describe("inventory valuation", () => {
  it("FIFO issues oldest stock first", () => {
    const r = valueInventory(batches, 150, "FIFO");
    expect(r.cogs).toBe(100 * 10 + 50 * 12);
    expect(r.closingUnits).toBe(150);
    expect(r.closingValue).toBe(50 * 12 + 100 * 15);
  });
  it("LIFO issues newest stock first", () => {
    const r = valueInventory(batches, 150, "LIFO");
    expect(r.cogs).toBe(100 * 15 + 50 * 12);
    expect(r.closingValue).toBe(100 * 10 + 50 * 12);
  });
  it("COGS + closing stock equals total cost of goods available under both methods", () => {
    const total = batches.reduce((t, b) => t + b.units * b.unitCost, 0);
    for (const m of ["FIFO", "LIFO"] as const) {
      const r = valueInventory(batches, 210, m);
      expect(r.cogs + r.closingValue).toBe(total);
    }
  });
  it("with rising prices FIFO reports a lower COGS (higher profit) than LIFO", () => {
    expect(valueInventory(batches, 150, "FIFO").cogs).toBeLessThan(valueInventory(batches, 150, "LIFO").cogs);
  });
  it("reports a shortfall when sales exceed stock", () => {
    const r = valueInventory(batches, 350, "FIFO");
    expect(r.shortfall).toBe(50);
    expect(r.unitsSold).toBe(300);
    expect(r.closingUnits).toBe(0);
  });
  it("does not mutate the input batches", () => {
    valueInventory(batches, 150, "FIFO");
    expect(batches[0].units).toBe(100);
  });
});

describe("holding costs", () => {
  it("scales with days of stock held", () => {
    const base = { annualDemand: 36_500, daysOfStock: 30, unitCost: 20, holdingRate: 0.25 };
    expect(averageInventoryValue(base)).toBe(60_000);
    expect(annualHoldingCost(base)).toBe(15_000);
    expect(annualHoldingCost({ ...base, daysOfStock: 3 })).toBe(1_500);
  });
});

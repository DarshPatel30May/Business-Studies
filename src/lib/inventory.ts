// Inventory valuation under FIFO and LIFO (periodic method), plus a simple holding-cost comparison
// used to illustrate just-in-time (JIT). Note: LIFO is listed in the HSC syllabus but is not permitted
// for financial reporting under Australian Accounting Standard AASB 102 Inventories.

export interface Batch {
  label: string;
  units: number;
  unitCost: number;
}

export interface LayerUse {
  label: string;
  units: number;
  unitCost: number;
  cost: number;
}

export interface ValuationResult {
  method: "FIFO" | "LIFO";
  unitsSold: number;
  cogs: number;
  issued: LayerUse[];
  closingUnits: number;
  closingValue: number;
  closingLayers: LayerUse[];
  shortfall: number;
}

/**
 * Value cost of goods sold and closing inventory.
 * `batches` must be listed oldest first. FIFO issues the oldest units first; LIFO issues the newest first.
 */
export function valueInventory(batches: Batch[], unitsSold: number, method: "FIFO" | "LIFO"): ValuationResult {
  const layers = batches
    .filter((b) => b.units > 0)
    .map((b) => ({ ...b }));
  const issueOrder = method === "FIFO" ? layers : [...layers].reverse();
  let remaining = Math.max(0, unitsSold);
  const issued: LayerUse[] = [];
  for (const layer of issueOrder) {
    if (remaining <= 0) break;
    const take = Math.min(layer.units, remaining);
    if (take > 0) {
      issued.push({ label: layer.label, units: take, unitCost: layer.unitCost, cost: take * layer.unitCost });
      layer.units -= take;
      remaining -= take;
    }
  }
  const closingLayers = layers
    .filter((l) => l.units > 0)
    .map((l) => ({ label: l.label, units: l.units, unitCost: l.unitCost, cost: l.units * l.unitCost }));
  return {
    method,
    unitsSold: Math.max(0, unitsSold) - remaining,
    cogs: issued.reduce((t, l) => t + l.cost, 0),
    issued,
    closingUnits: closingLayers.reduce((t, l) => t + l.units, 0),
    closingValue: closingLayers.reduce((t, l) => t + l.cost, 0),
    closingLayers,
    shortfall: remaining,
  };
}

export interface HoldingInputs {
  annualDemand: number;
  /** Average stock held, in days of demand. */
  daysOfStock: number;
  unitCost: number;
  /** Annual holding cost as a fraction of stock value (storage, insurance, obsolescence, capital). */
  holdingRate: number;
}

export function averageInventoryValue(i: HoldingInputs): number {
  return (i.annualDemand / 365) * i.daysOfStock * i.unitCost;
}

export function annualHoldingCost(i: HoldingInputs): number {
  return averageInventoryValue(i) * i.holdingRate;
}

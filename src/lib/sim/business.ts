// Integrated business simulation — a transparent, deterministic, multi-quarter teaching model.
// FICTIONAL RESULTS ONLY. The model shows how decisions in one key business function affect the
// others (interdependence). It does not predict real business outcomes.

export type BusinessType = "manufacturing" | "retail" | "hospitality" | "tech" | "transport";

export interface BusinessPreset {
  id: BusinessType;
  name: string;
  description: string;
  basePrice: number;
  unitVariableCost: number;
  baseDemand: number; // units per quarter at base price with baseline decisions
  baseCapacity: number; // units per quarter with adequate staffing
  fixedCosts: number; // per quarter, excluding wages and promotion
  staff: number;
  wagePerStaff: number; // per quarter
  startingCash: number;
  unitLabel: string;
  priceSensitivity: number; // % demand change per 1% price change
  inventoryRelevant: boolean;
}

export const PRESETS: Record<BusinessType, BusinessPreset> = {
  manufacturing: {
    id: "manufacturing",
    name: "Manufacturing — 'Ironbark Outdoor Furniture'",
    description: "Makes timber and steel outdoor furniture sold through retailers and online. Capital-intensive with significant inventory.",
    basePrice: 450,
    unitVariableCost: 240,
    baseDemand: 2400,
    baseCapacity: 2600,
    fixedCosts: 150_000,
    staff: 30,
    wagePerStaff: 17_000,
    startingCash: 250_000,
    unitLabel: "units",
    priceSensitivity: 1.3,
    inventoryRelevant: true,
  },
  retail: {
    id: "retail",
    name: "Retail — 'Harbour & Co. Homewares'",
    description: "Three homewares stores plus an online shop. Buys finished goods from suppliers; margins depend on purchasing and pricing.",
    basePrice: 60,
    unitVariableCost: 33,
    baseDemand: 21_000,
    baseCapacity: 23_000,
    fixedCosts: 120_000,
    staff: 22,
    wagePerStaff: 14_500,
    startingCash: 180_000,
    unitLabel: "items",
    priceSensitivity: 1.6,
    inventoryRelevant: true,
  },
  hospitality: {
    id: "hospitality",
    name: "Hospitality — 'Saltbush Café & Catering'",
    description: "A café with a catering arm. Perishable stock, high labour content and high customer contact (visibility).",
    basePrice: 24,
    unitVariableCost: 9,
    baseDemand: 26_000,
    baseCapacity: 28_000,
    fixedCosts: 70_000,
    staff: 24,
    wagePerStaff: 13_000,
    startingCash: 90_000,
    unitLabel: "meals",
    priceSensitivity: 1.2,
    inventoryRelevant: true,
  },
  tech: {
    id: "tech",
    name: "Technology services — 'Gridline IT Solutions'",
    description: "Provides managed IT support to small businesses on monthly contracts. Few physical inputs; skills are the key resource.",
    basePrice: 1500,
    unitVariableCost: 380,
    baseDemand: 420,
    baseCapacity: 450,
    fixedCosts: 60_000,
    staff: 18,
    wagePerStaff: 26_000,
    startingCash: 160_000,
    unitLabel: "client-months",
    priceSensitivity: 0.9,
    inventoryRelevant: false,
  },
  transport: {
    id: "transport",
    name: "Transport services — 'Red Gum Freight'",
    description: "Regional road freight between NSW towns. Fuel, vehicles and driver availability drive costs and capacity.",
    basePrice: 950,
    unitVariableCost: 520,
    baseDemand: 1150,
    baseCapacity: 1250,
    fixedCosts: 110_000,
    staff: 20,
    wagePerStaff: 19_000,
    startingCash: 200_000,
    unitLabel: "deliveries",
    priceSensitivity: 1.1,
    inventoryRelevant: false,
  },
};

export interface BizDecisions {
  // Operations
  inventory: "jit" | "balanced" | "high";
  suppliers: "local" | "global" | "partnership";
  production: "labour" | "automated";
  quality: "control" | "assurance" | "improvement";
  // Marketing
  priceChange: number; // −20..+20 (% vs base price)
  promotion: 0 | 1 | 2 | 3; // none, low, medium, high
  target: "mass" | "niche";
  distribution: "intensive" | "selective" | "online";
  // Finance
  borrowing: 0 | 50_000 | 150_000;
  investment: "none" | "equipment" | "systems";
  cash: "standard" | "discounts" | "factoring" | "tight-credit";
  expenses: "none" | "moderate" | "aggressive";
  // Human resources
  staffing: "lean" | "adequate" | "generous";
  training: "none" | "basic" | "extensive";
  rewards: "minimum" | "above-award" | "performance";
  leadership: "autocratic" | "democratic" | "situational";
}

export const DEFAULT_DECISIONS: BizDecisions = {
  inventory: "balanced",
  suppliers: "local",
  production: "labour",
  quality: "control",
  priceChange: 0,
  promotion: 1,
  target: "mass",
  distribution: "selective",
  borrowing: 0,
  investment: "none",
  cash: "standard",
  expenses: "none",
  staffing: "adequate",
  training: "basic",
  rewards: "minimum",
  leadership: "situational",
};

export interface BizState {
  quarter: number;
  cash: number;
  loan: number;
  customerSat: number;
  employeeSat: number;
  receivables: number; // accounts receivable at end of quarter
  capacityBoost: number; // multiplier from past investment
  efficiencyBoost: number; // reduces variable cost
}

export interface QuarterResult {
  quarter: number;
  price: number;
  demand: number;
  capacity: number;
  unitsSold: number;
  revenue: number;
  variableCosts: number;
  wages: number;
  promotionCost: number;
  trainingCost: number;
  fixedCosts: number;
  interest: number;
  otherCosts: number;
  expenses: number;
  profit: number;
  cashFlow: number;
  cashBalance: number;
  loanBalance: number;
  customerSat: number;
  employeeSat: number;
  production: number; // production performance index (utilisation × quality)
  qualityIndex: number;
  risks: string[];
  explanations: { fn: "Operations" | "Marketing" | "Finance" | "Human resources"; text: string }[];
}

export const BIZ_ASSUMPTIONS = [
  "All businesses and figures are fictional. Each quarter is calculated with fixed formulas — the same decisions always give the same results.",
  "Demand = base demand × price effect × promotion effect × target-market effect × distribution effect × customer-satisfaction effect.",
  "Price effect: each 1% price rise reduces demand by the business's price sensitivity (e.g. 1.3%).",
  "Units sold = the lower of demand and effective capacity. Capacity depends on staffing, production method, investment and employee satisfaction.",
  "Profit = revenue − (variable costs + wages + promotion + training + fixed costs + interest + other costs).",
  "Cash flow = profit + new borrowing − investment spending − loan repayments − increase in accounts receivable. Customers owe about one-third of each quarter's sales at quarter end (5% with factoring, 20% with tight credit). Depreciation is ignored for simplicity.",
  "Borrowing and investment are one-off decisions made in the quarter they are chosen; they reset to none after each quarter.",
  "Loans are charged 2% interest per quarter (about 8% per year) and 10% of the balance is repaid each quarter.",
  "Customer and employee satisfaction carry over between quarters and move gradually toward the level the current decisions support.",
];

export function initialState(preset: BusinessPreset): BizState {
  return {
    quarter: 0,
    cash: preset.startingCash,
    loan: 0,
    receivables: Math.round(preset.basePrice * preset.baseDemand * RECEIVABLE_SHARE.standard),
    customerSat: 60,
    employeeSat: 60,
    capacityBoost: 1,
    efficiencyBoost: 1,
  };
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Share of a quarter's revenue still owed by customers at quarter end, by cash management policy. */
export const RECEIVABLE_SHARE: Record<BizDecisions["cash"], number> = {
  standard: 0.33,
  discounts: 0.33,
  factoring: 0.05,
  "tight-credit": 0.2,
};

export function runQuarter(preset: BusinessPreset, state: BizState, d: BizDecisions): { result: QuarterResult; next: BizState } {
  const explanations: QuarterResult["explanations"] = [];
  const risks: string[] = [];

  // ---------------- Human resources ----------------
  const staffMult = { lean: 0.85, adequate: 1, generous: 1.15 }[d.staffing];
  const staffCount = Math.round(preset.staff * staffMult);
  const rewardMult = { minimum: 1, "above-award": 1.08, performance: 1.04 }[d.rewards];
  const wages = Math.round(staffCount * preset.wagePerStaff * rewardMult);
  const trainingCost = { none: 0, basic: 300, extensive: 1200 }[d.training] * staffCount;
  let empTarget = 55;
  empTarget += { lean: -10, adequate: 0, generous: 6 }[d.staffing];
  empTarget += { none: -6, basic: 2, extensive: 9 }[d.training];
  empTarget += { minimum: 0, "above-award": 9, performance: 5 }[d.rewards];
  empTarget += { autocratic: -6, democratic: 7, situational: 6 }[d.leadership];
  if (d.expenses === "aggressive") empTarget -= 5;
  empTarget = clamp(empTarget, 10, 95);
  const employeeSat = Math.round(state.employeeSat + (empTarget - state.employeeSat) * 0.5);
  explanations.push({
    fn: "Human resources",
    text: `Staffing is ${d.staffing} (${staffCount} employees) with ${d.training} training, ${d.rewards.replace("-", " ")} rewards and ${d.leadership} leadership. Employee satisfaction moves toward ${empTarget} — it affects productivity, quality of service and turnover risk.`,
  });

  // ---------------- Operations ----------------
  let qualityIndex = { control: 60, assurance: 70, improvement: 76 }[d.quality];
  qualityIndex += { none: -6, basic: 0, extensive: 6 }[d.training];
  qualityIndex += { local: 0, global: -5, partnership: 4 }[d.suppliers];
  if (d.production === "automated") qualityIndex += 5;
  if (d.expenses === "aggressive") qualityIndex -= 4;
  qualityIndex = clamp(qualityIndex, 20, 98);

  const productivity = 0.8 + 0.4 * (employeeSat / 100); // 0.8–1.2
  const methodMult = d.production === "automated" ? 1.15 : 1;
  const capacity = Math.round(preset.baseCapacity * staffMult * methodMult * state.capacityBoost * productivity);

  let variableUnitCost = preset.unitVariableCost * state.efficiencyBoost;
  variableUnitCost *= { local: 1, global: 0.88, partnership: 0.95 }[d.suppliers];
  variableUnitCost *= d.production === "automated" ? 0.94 : 1;
  variableUnitCost *= { control: 1.03, assurance: 1.01, improvement: 0.99 }[d.quality];

  // Inventory: holding costs and availability.
  let availability = 1;
  let inventoryCost = 0;
  if (preset.inventoryRelevant) {
    if (d.inventory === "jit") {
      inventoryCost = 0;
      availability = d.suppliers === "global" ? 0.88 : d.suppliers === "partnership" ? 0.99 : 0.96;
      if (d.suppliers === "global") risks.push("JIT with distant global suppliers: shipping delays cause stock-outs (supply chain risk).");
    } else if (d.inventory === "balanced") {
      inventoryCost = 0.02 * preset.baseDemand * preset.unitVariableCost * 0.25;
      availability = 0.98;
    } else {
      inventoryCost = 0.06 * preset.baseDemand * preset.unitVariableCost * 0.25;
      availability = 1;
      risks.push("High stock levels tie up cash and risk obsolescence or spoilage.");
    }
  }
  explanations.push({
    fn: "Operations",
    text: `Quality index ${Math.round(qualityIndex)} (${d.quality.replace("-", " ")}${d.production === "automated" ? ", automated production" : ""}). Effective capacity ${capacity.toLocaleString("en-AU")} ${preset.unitLabel}. Variable cost per unit ≈ $${variableUnitCost.toFixed(0)} — ${d.suppliers === "global" ? "global sourcing lowers input costs but adds lead-time risk" : d.suppliers === "partnership" ? "supplier partnerships trade a little cost saving for dependability" : "local suppliers are dependable but cost more"}.${preset.inventoryRelevant ? ` Inventory strategy: ${d.inventory.toUpperCase() === "JIT" ? "JIT" : d.inventory}.` : ""}`,
  });

  // ---------------- Marketing ----------------
  const price = Math.round(preset.basePrice * (1 + d.priceChange / 100) * 100) / 100;
  const priceEffect = Math.max(0.2, 1 - (preset.priceSensitivity * d.priceChange) / 100);
  const promoEffect = [0.88, 1, 1.1, 1.17][d.promotion];
  const promotionCost = [0, 0.02, 0.045, 0.08][d.promotion] * preset.basePrice * preset.baseDemand;
  const targetEffect = d.target === "mass" ? 1 : 0.7;
  // Niche buyers are less price sensitive and value quality more.
  const nicheQualityBonus = d.target === "niche" ? 1 + (qualityIndex - 60) / 100 : 1;
  const nichePriceRelief = d.target === "niche" && d.priceChange > 0 ? 1 + (preset.priceSensitivity * d.priceChange * 0.4) / 100 : 1;
  const distEffect = { intensive: 1.12, selective: 1, online: 0.92 }[d.distribution];
  const distCost = { intensive: 0.03, selective: 0.015, online: 0.01 }[d.distribution] * preset.basePrice * preset.baseDemand;
  const custEffect = 0.85 + 0.3 * (state.customerSat / 100);
  const demand = Math.round(
    preset.baseDemand * priceEffect * promoEffect * targetEffect * nicheQualityBonus * nichePriceRelief * distEffect * custEffect,
  );
  const unitsSold = Math.round(Math.min(demand * availability, capacity));
  if (demand > capacity * 1.05) risks.push("Demand exceeds capacity: customers are turned away and satisfaction falls.");
  const revenue = Math.round(unitsSold * price);
  explanations.push({
    fn: "Marketing",
    text: `Price $${price.toLocaleString("en-AU")} (${d.priceChange >= 0 ? "+" : ""}${d.priceChange}% vs base). Demand ${demand.toLocaleString("en-AU")} ${preset.unitLabel}; sold ${unitsSold.toLocaleString("en-AU")}. ${d.target === "niche" ? "A niche target reduces volume but buyers value quality and accept higher prices." : "A mass market maximises volume but customers compare prices closely."} ${["No promotion reduces awareness.", "Low promotion maintains awareness.", "Medium promotion lifts demand.", "Heavy promotion lifts demand, with diminishing returns."][d.promotion]}`,
  });

  // ---------------- Finance ----------------
  const expenseCut = { none: 1, moderate: 0.94, aggressive: 0.85 }[d.expenses];
  const fixedCosts = Math.round(preset.fixedCosts * expenseCut);
  const newLoan = d.borrowing; // one-off: drawn down in the quarter it is chosen
  const loanBefore = state.loan + newLoan;
  const interest = Math.round(loanBefore * 0.02);
  const repayment = Math.round(loanBefore * 0.1);
  const investmentCost = { none: 0, equipment: 0.12, systems: 0.06 }[d.investment] * preset.basePrice * preset.baseDemand;
  const factoringFee = d.cash === "factoring" ? revenue * 0.02 : 0;
  const discountCost = d.cash === "discounts" ? -variableUnitCost * unitsSold * 0.02 : 0; // discounts received for paying suppliers early
  const variableCosts = Math.round(variableUnitCost * unitsSold);
  const otherCosts = Math.round(inventoryCost + distCost + factoringFee + discountCost);
  const expenses = Math.round(variableCosts + wages + promotionCost + trainingCost + fixedCosts + interest + otherCosts);
  const profit = revenue - expenses;

  // Timing of cash: part of each quarter's revenue is still owed by customers (accounts receivable) at quarter end.
  // A rise in receivables means profit has not yet turned into cash; a fall releases cash.
  const receivables = Math.round(revenue * RECEIVABLE_SHARE[d.cash]);
  const timing = state.receivables - receivables;
  const cashFlow = Math.round(profit + newLoan - investmentCost - repayment + timing);
  const cashBalance = Math.round(state.cash + cashFlow);
  const loanBalance = Math.max(0, loanBefore - repayment);
  explanations.push({
    fn: "Finance",
    text: `Profit $${profit.toLocaleString("en-AU")} and cash flow $${cashFlow.toLocaleString("en-AU")} differ because of loan proceeds, investment spending, loan repayments and the timing of customer payments — profit is not the same as cash.${d.borrowing ? ` Debt finance adds interest of $${interest.toLocaleString("en-AU")} this quarter.` : ""}${d.cash === "factoring" ? " Factoring brings cash forward but costs a 2% fee." : ""}${d.cash === "discounts" ? " Paying suppliers early earns discounts but uses cash sooner." : ""}`,
  });

  // ---------------- Satisfaction & risks ----------------
  let custTarget = 40 + 0.45 * qualityIndex;
  custTarget += d.target === "niche" ? 3 : 0;
  custTarget -= Math.max(0, d.priceChange) * 0.3;
  custTarget += Math.max(0, -d.priceChange) * 0.2;
  if (demand > capacity * 1.05) custTarget -= 8;
  if (d.cash === "tight-credit") custTarget -= 3;
  custTarget += { lean: -4, adequate: 0, generous: 3 }[d.staffing];
  custTarget = clamp(custTarget, 10, 98);
  const customerSat = Math.round(state.customerSat + (custTarget - state.customerSat) * 0.5);

  if (cashBalance < 0) risks.push("Negative cash balance: the business cannot pay its bills without an overdraft (liquidity crisis).");
  else if (cashBalance < preset.fixedCosts) risks.push("Low cash buffer: less than one quarter of fixed costs held in cash.");
  if (loanBalance > preset.startingCash) risks.push("High gearing: debt exceeds the starting equity of the business (solvency risk).");
  if (employeeSat < 45) risks.push("Low employee satisfaction: higher turnover, absenteeism and dispute risk.");
  if (d.leadership === "autocratic" && d.rewards === "minimum" && d.staffing === "lean") risks.push("Industrial relations risk: lean staffing, minimum rewards and autocratic leadership.");
  if (customerSat < 50) risks.push("Low customer satisfaction: risk of losing market share.");
  if (profit < 0) risks.push("Operating at a loss this quarter.");
  if (d.expenses === "aggressive") risks.push("Aggressive cost-cutting can reduce quality and morale (short-term vs long-term objectives).");
  if (d.production === "automated" && state.quarter === 0 && d.training === "none") risks.push("Automation without training: resistance to change and errors are likely.");

  const production = Math.round(Math.min(100, (unitsSold / Math.max(1, capacity)) * 60 + qualityIndex * 0.4));

  const next: BizState = {
    quarter: state.quarter + 1,
    cash: cashBalance,
    loan: loanBalance,
    receivables,
    customerSat,
    employeeSat,
    capacityBoost: state.capacityBoost * (d.investment === "equipment" ? 1.06 : 1),
    efficiencyBoost: state.efficiencyBoost * (d.investment === "systems" ? 0.97 : 1),
  };

  return {
    result: {
      quarter: next.quarter,
      price,
      demand,
      capacity,
      unitsSold,
      revenue,
      variableCosts,
      wages,
      promotionCost: Math.round(promotionCost),
      trainingCost,
      fixedCosts,
      interest,
      otherCosts,
      expenses,
      profit,
      cashFlow,
      cashBalance,
      loanBalance,
      customerSat,
      employeeSat,
      production,
      qualityIndex: Math.round(qualityIndex),
      risks,
      explanations,
    },
    next,
  };
}

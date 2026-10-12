// Operations strategy simulator — a transparent, deterministic teaching model.
// Values are ILLUSTRATIVE ONLY. They show the direction and rough size of trade-offs
// discussed in the syllabus; they are not predictions of real business performance.

export type InventoryChoice = "jit" | "buffer" | "large";
export type TechChoice = "established" | "leading";
export type QualityChoice = "control" | "assurance" | "improvement";
export type SupplierChoice = "single-local" | "multiple-global" | "partnership";
export type OutsourceChoice = "in-house" | "noncore" | "production";

export interface OpsDecisions {
  inventory: InventoryChoice;
  technology: TechChoice;
  quality: QualityChoice;
  supplier: SupplierChoice;
  outsourcing: OutsourceChoice;
}

export interface OpsResult {
  operatingCost: number; // $'000 per year
  quality: number; // index 0–100
  reliability: number; // % on-time, in-full deliveries
  inventoryDays: number; // average days of stock held
  satisfaction: number; // index 0–100
  notes: { decision: string; effect: string; concept: string }[];
  risks: string[];
}

export const OPS_BASELINE = {
  operatingCost: 4000,
  quality: 60,
  reliability: 88,
  inventoryDays: 30,
  satisfaction: 62,
};

export const OPS_ASSUMPTIONS = [
  "Fictional business: a mid-sized Australian furniture manufacturer with annual operating costs of about $4.0 million under the baseline.",
  "The baseline is: moderate buffer stock, established technology, quality control only, one local supplier, all production in-house.",
  "Each choice adds or subtracts a fixed amount from the baseline; a few combinations interact (e.g. JIT with distant global suppliers).",
  "Customer satisfaction is calculated from quality (50%) and delivery reliability (50%), adjusted for flexibility.",
  "Figures are illustrative teaching values, not industry data.",
];

type Delta = Partial<Record<"operatingCost" | "quality" | "reliability" | "inventoryDays" | "satisfaction", number>>;

const effects: {
  [K in keyof OpsDecisions]: Record<OpsDecisions[K], { delta: Delta; effect: string; concept: string; label: string }>;
} = {
  inventory: {
    jit: {
      label: "Just-in-time (JIT)",
      delta: { operatingCost: -260, inventoryDays: -24, reliability: -4 },
      effect: "Lower holding costs (storage, insurance, obsolescence) and less cash tied up, but less protection against supply delays.",
      concept: "Inventory management — JIT",
    },
    buffer: {
      label: "Moderate buffer stock (FIFO rotation)",
      delta: {},
      effect: "Baseline: some safety stock rotated oldest-first to reduce obsolescence.",
      concept: "Inventory management — advantages/disadvantages of holding stock; FIFO",
    },
    large: {
      label: "Large safety stock (just-in-case)",
      delta: { operatingCost: 240, inventoryDays: 35, reliability: 5 },
      effect: "Protects against stock-outs and demand spikes, but raises holding costs and the risk of obsolete stock.",
      concept: "Inventory management — advantages of holding stock",
    },
  },
  technology: {
    established: {
      label: "Established technology",
      delta: {},
      effect: "Baseline: proven, reliable equipment with lower purchase cost but limited efficiency gains.",
      concept: "Technology — established",
    },
    leading: {
      label: "Leading-edge technology",
      delta: { operatingCost: -180, quality: 10, reliability: 3 },
      effect: "Automation improves consistency and lowers unit costs over time, but requires capital investment and retraining (depreciation is included in operating costs).",
      concept: "Technology — leading edge; overcoming resistance to change",
    },
  },
  quality: {
    control: {
      label: "Quality control",
      delta: {},
      effect: "Baseline: inspection finds defects after production — rework and scrap are costly.",
      concept: "Quality management — control",
    },
    assurance: {
      label: "Quality assurance (e.g. ISO 9001-style system)",
      delta: { operatingCost: 60, quality: 12, reliability: 2 },
      effect: "Standards built into processes prevent defects; certification costs money but gives customers confidence.",
      concept: "Quality management — assurance",
    },
    improvement: {
      label: "Quality improvement (TQM / continuous improvement)",
      delta: { operatingCost: 20, quality: 18, reliability: 3 },
      effect: "Employees continuously improve processes; up-front training costs are offset over time by lower waste.",
      concept: "Quality management — improvement (TQM, continuous improvement)",
    },
  },
  supplier: {
    "single-local": {
      label: "Single local supplier",
      delta: {},
      effect: "Baseline: short lead times and simple communication, but higher input prices and dependence on one firm.",
      concept: "Supply chain management — supplier relationships",
    },
    "multiple-global": {
      label: "Multiple low-cost global suppliers",
      delta: { operatingCost: -320, quality: -6, reliability: -6 },
      effect: "Global sourcing lowers input costs but lengthens lead times and adds exchange-rate and quality risks.",
      concept: "Supply chain management — global sourcing",
    },
    partnership: {
      label: "Long-term supplier partnership",
      delta: { operatingCost: -120, quality: 5, reliability: 5 },
      effect: "Close relationships share information and forecasts, improving dependability and joint quality improvement.",
      concept: "Supply chain management — supplier relationships",
    },
  },
  outsourcing: {
    "in-house": {
      label: "Keep everything in-house",
      delta: {},
      effect: "Baseline: full control over processes and quality, but carries all fixed costs.",
      concept: "Outsourcing",
    },
    noncore: {
      label: "Outsource non-core activities (logistics, maintenance)",
      delta: { operatingCost: -150, reliability: 1 },
      effect: "Specialists handle non-core work at lower cost so management can focus on core manufacturing.",
      concept: "Outsourcing — advantages",
    },
    production: {
      label: "Outsource production overseas",
      delta: { operatingCost: -480, quality: -8, reliability: -5, inventoryDays: 10 },
      effect: "Large labour-cost savings, but loss of control over quality and working conditions, longer lead times and reputational (CSR) risk.",
      concept: "Outsourcing — disadvantages; CSR",
    },
  },
};

export function optionLabel<K extends keyof OpsDecisions>(key: K, value: OpsDecisions[K]): string {
  return effects[key][value].label;
}

export const OPS_OPTIONS: { [K in keyof OpsDecisions]: { value: OpsDecisions[K]; label: string }[] } = {
  inventory: (Object.keys(effects.inventory) as InventoryChoice[]).map((v) => ({ value: v, label: effects.inventory[v].label })),
  technology: (Object.keys(effects.technology) as TechChoice[]).map((v) => ({ value: v, label: effects.technology[v].label })),
  quality: (Object.keys(effects.quality) as QualityChoice[]).map((v) => ({ value: v, label: effects.quality[v].label })),
  supplier: (Object.keys(effects.supplier) as SupplierChoice[]).map((v) => ({ value: v, label: effects.supplier[v].label })),
  outsourcing: (Object.keys(effects.outsourcing) as OutsourceChoice[]).map((v) => ({ value: v, label: effects.outsourcing[v].label })),
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function simulateOperations(d: OpsDecisions): OpsResult {
  const r = { ...OPS_BASELINE };
  const notes: OpsResult["notes"] = [];
  const risks: string[] = [];
  (Object.keys(d) as (keyof OpsDecisions)[]).forEach((key) => {
    const e = (effects[key] as Record<string, { delta: Delta; effect: string; concept: string; label: string }>)[d[key]];
    for (const [k, v] of Object.entries(e.delta)) r[k as keyof typeof r] += v as number;
    notes.push({ decision: e.label, effect: e.effect, concept: e.concept });
  });

  // Interactions
  if (d.inventory === "jit" && (d.supplier === "multiple-global" || d.outsourcing === "production")) {
    r.reliability -= 8;
    risks.push("JIT combined with distant suppliers: a single shipping delay can halt production (supply chain disruption risk).");
  }
  if (d.inventory === "jit" && d.supplier === "partnership") {
    r.reliability += 4;
    notes.push({
      decision: "JIT + supplier partnership",
      effect: "Reliable partner suppliers make frequent small deliveries workable — the combination JIT depends on.",
      concept: "Inventory management — JIT; supplier relationships",
    });
  }
  if (d.technology === "leading" && d.quality === "improvement") {
    r.quality += 4;
    notes.push({
      decision: "Leading-edge technology + continuous improvement",
      effect: "Trained employees use precise technology to keep improving processes — a mutually reinforcing combination.",
      concept: "Technology; quality improvement",
    });
  }
  if (d.outsourcing === "production" && d.quality === "control") {
    r.quality -= 4;
    risks.push("Outsourced production with inspection-only quality: defects may be found late, after shipping.");
  }
  if (d.outsourcing === "production") risks.push("Reputational and ethical risk if overseas contractors do not meet labour and environmental standards (CSR).");
  if (d.supplier === "multiple-global") risks.push("Exchange-rate movements can raise the AUD cost of imported inputs.");
  if (d.inventory === "large") risks.push("Obsolescence risk: large stock may become outdated if designs or trends change.");
  if (d.technology === "leading") risks.push("Resistance to change: retraining, possible redundancies and employee inertia must be managed.");

  r.quality = clamp(r.quality, 0, 100);
  r.reliability = clamp(r.reliability, 50, 99.5);
  r.inventoryDays = Math.max(2, r.inventoryDays);
  const flexibilityAdj = d.inventory === "large" ? 2 : d.inventory === "jit" ? -1 : 0;
  r.satisfaction = clamp(0.5 * r.quality + 0.5 * (r.reliability - 30) * (100 / 69.5) + flexibilityAdj - 3, 0, 100);
  r.satisfaction = Math.round(r.satisfaction);
  return { ...r, notes, risks };
}

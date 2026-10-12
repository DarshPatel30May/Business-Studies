// HR management simulator and HR metrics — a deterministic teaching model.
// ILLUSTRATIVE ONLY: shows trade-offs between HR strategies; not a prediction for any real workplace.

export type RecruitChoice = "internal" | "external" | "mixed";
export type TrainingChoice = "minimal" | "current" | "future";
export type LeadershipChoice = "autocratic" | "democratic" | "laissez-faire" | "situational";
export type RewardChoice = "award" | "above-award" | "non-monetary" | "group" | "performance-pay";
export type PerfChoice = "developmental" | "administrative" | "balanced";
export type DisputeChoice = "negotiation" | "mediation" | "grievance" | "tribunal";

export interface HrDecisions {
  recruitment: RecruitChoice;
  training: TrainingChoice;
  leadership: LeadershipChoice;
  rewards: RewardChoice;
  performance: PerfChoice;
  disputes: DisputeChoice;
}

export interface HrResult {
  turnover: number; // % per year
  satisfaction: number; // index 0–100
  productivity: number; // index, baseline 100
  absenteeism: number; // % of scheduled days
  costs: number; // annual HR-related costs, $
  relations: number; // workplace relations index 0–100
  notes: { decision: string; text: string }[];
  legal: string[];
}

export const HR_ASSUMPTIONS = [
  "Fictional workplace: a 150-employee hotel and conference venue in regional NSW.",
  "Baseline: pay at the relevant modern award, minimal training, mixed recruitment, autocratic leadership, administrative appraisal, disputes handled by grievance procedure.",
  "Baseline annual staff turnover is 28%; each departure costs about $9,000 to replace (recruitment, induction, lost productivity).",
  "Each choice adds a fixed effect to the baseline; some combinations interact. Values are illustrative teaching figures.",
  "Legal minimums (National Employment Standards, award rates, WHS duties) apply under every option and cannot be traded away.",
];

const BASE = { turnover: 28, satisfaction: 55, productivity: 100, absenteeism: 4.5, relations: 55 };
const HEADCOUNT = 150;
const REPLACEMENT_COST = 9000;
const BASE_WAGE_BILL = 150 * 58_000;

type D = Partial<{ turnover: number; satisfaction: number; productivity: number; absenteeism: number; relations: number; cost: number }>;

const E: { [K in keyof HrDecisions]: Record<HrDecisions[K], { label: string; d: D; text: string }> } = {
  recruitment: {
    internal: {
      label: "Internal recruitment",
      d: { satisfaction: 4, turnover: -2, productivity: 1, cost: -40_000 },
      text: "Promoting from within motivates staff and lowers recruitment costs, but brings fewer new ideas and leaves a vacancy to fill.",
    },
    external: {
      label: "External recruitment",
      d: { satisfaction: -2, productivity: 2, cost: 60_000 },
      text: "A wider pool brings new skills and ideas, but costs more, takes longer and can frustrate existing staff seeking promotion.",
    },
    mixed: { label: "Mix of internal and external", d: {}, text: "Baseline: balances motivation from promotion with access to new skills." },
  },
  training: {
    minimal: { label: "Minimal training (induction and compliance only)", d: {}, text: "Baseline: low cost, but skills gaps limit productivity and service quality." },
    current: {
      label: "Training for current skills",
      d: { productivity: 6, satisfaction: 4, turnover: -3, cost: 120_000 },
      text: "Improves performance in present roles quickly — a short-term focus.",
    },
    future: {
      label: "Development for future skills",
      d: { productivity: 4, satisfaction: 7, turnover: -5, cost: 180_000 },
      text: "Builds capability for future roles and technology; benefits take longer and trained staff may be poached.",
    },
  },
  leadership: {
    autocratic: { label: "Autocratic", d: {}, text: "Baseline: quick decisions and clear control, but low involvement can reduce motivation." },
    democratic: {
      label: "Democratic (participative)",
      d: { satisfaction: 8, relations: 10, turnover: -4, productivity: 2, absenteeism: -0.6 },
      text: "Involving employees builds commitment and ideas, though decisions take longer.",
    },
    "laissez-faire": {
      label: "Laissez-faire",
      d: { satisfaction: 1, productivity: -6, relations: -2, absenteeism: 0.5 },
      text: "Suits highly skilled, self-motivated professionals; in a hotel with many new or casual staff it causes confusion and inconsistent service.",
    },
    situational: {
      label: "Situational (adapts to the task and team)",
      d: { satisfaction: 6, relations: 7, turnover: -3, productivity: 4, absenteeism: -0.4 },
      text: "Managers vary their style with employee readiness and urgency — directive in emergencies, participative in planning.",
    },
  },
  rewards: {
    award: { label: "Pay the modern award rate", d: {}, text: "Baseline: legally compliant minimum pay; little to differentiate the employer in a tight labour market." },
    "above-award": {
      label: "Above-award monetary rewards",
      d: { satisfaction: 6, turnover: -5, cost: 0.05 * BASE_WAGE_BILL },
      text: "Higher pay attracts and retains staff but adds a large fixed cost.",
    },
    "non-monetary": {
      label: "Non-monetary rewards (recognition, flexible rosters)",
      d: { satisfaction: 7, turnover: -4, absenteeism: -0.7, cost: 60_000 },
      text: "Flexibility and recognition support work–life balance at relatively low cost.",
    },
    group: {
      label: "Group (team) bonuses",
      d: { satisfaction: 3, productivity: 4, relations: 4, turnover: -1, cost: 0.02 * BASE_WAGE_BILL },
      text: "Encourages cooperation and shared goals; strong performers may resent 'free riders'.",
    },
    "performance-pay": {
      label: "Individual performance pay",
      d: { satisfaction: 2, productivity: 6, relations: -3, turnover: -2, cost: 0.03 * BASE_WAGE_BILL },
      text: "Rewards high achievers and links pay to objectives, but can undermine teamwork and is hard to measure fairly in service roles.",
    },
  },
  performance: {
    developmental: {
      label: "Developmental performance management",
      d: { satisfaction: 5, productivity: 3, turnover: -2, cost: 30_000 },
      text: "Focuses on feedback, coaching and growth — builds motivation and skills.",
    },
    administrative: {
      label: "Administrative performance management",
      d: {},
      text: "Baseline: appraisal used for decisions on pay, promotion and dismissal; useful for records but can feel judgemental.",
    },
    balanced: {
      label: "Balanced (developmental + administrative)",
      d: { satisfaction: 3, productivity: 3, turnover: -1, cost: 20_000 },
      text: "Separates development conversations from pay decisions to keep both purposes credible.",
    },
  },
  disputes: {
    negotiation: {
      label: "Direct negotiation",
      d: { relations: 6, satisfaction: 2 },
      text: "Parties resolve issues themselves — fast, low cost and preserves relationships.",
    },
    mediation: {
      label: "Mediation",
      d: { relations: 5, satisfaction: 1, cost: 15_000 },
      text: "A neutral third party helps the parties reach their own agreement when talks stall.",
    },
    grievance: {
      label: "Grievance procedure",
      d: {},
      text: "Baseline: a documented step-by-step process (often required in awards and agreements) gives consistency and fairness.",
    },
    tribunal: {
      label: "Escalate to the Fair Work Commission early",
      d: { relations: -10, satisfaction: -4, cost: 80_000 },
      text: "Tribunals provide a binding outcome when other methods fail, but early escalation is costly, slow and damages trust.",
    },
  },
};

export const HR_OPTIONS: { [K in keyof HrDecisions]: { value: HrDecisions[K]; label: string }[] } = Object.fromEntries(
  (Object.keys(E) as (keyof HrDecisions)[]).map((k) => [
    k,
    Object.entries(E[k]).map(([value, v]) => ({ value, label: (v as { label: string }).label })),
  ]),
) as never;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function simulateHr(dec: HrDecisions): HrResult {
  const r = { ...BASE };
  let extraCost = 0;
  const notes: HrResult["notes"] = [];
  (Object.keys(dec) as (keyof HrDecisions)[]).forEach((k) => {
    const e = (E[k] as Record<string, { label: string; d: D; text: string }>)[dec[k]];
    r.turnover += e.d.turnover ?? 0;
    r.satisfaction += e.d.satisfaction ?? 0;
    r.productivity += e.d.productivity ?? 0;
    r.absenteeism += e.d.absenteeism ?? 0;
    r.relations += e.d.relations ?? 0;
    extraCost += e.d.cost ?? 0;
    notes.push({ decision: e.label, text: e.text });
  });
  if (dec.leadership === "autocratic" && dec.rewards === "award" && dec.training === "minimal") {
    r.relations -= 6;
    r.turnover += 3;
    notes.push({
      decision: "Low-investment combination",
      text: "Autocratic leadership with minimum pay and little training signals low commitment to staff — a common trigger for disputes and turnover.",
    });
  }
  if (dec.rewards === "performance-pay" && dec.performance === "administrative") {
    notes.push({
      decision: "Performance pay + administrative appraisal",
      text: "Logical link: administrative appraisal provides the ratings performance pay needs — but check that measures are fair and transparent.",
    });
    r.productivity += 1;
  }
  if (dec.training === "future" && dec.recruitment === "internal") {
    r.satisfaction += 3;
    notes.push({
      decision: "Future-skills development + internal recruitment",
      text: "Developing staff for future roles creates a pipeline for internal promotion (succession planning).",
    });
  }
  r.satisfaction = clamp(r.satisfaction, 0, 100);
  r.relations = clamp(r.relations, 0, 100);
  // Satisfaction feeds turnover and absenteeism.
  r.turnover = clamp(r.turnover - (r.satisfaction - BASE.satisfaction) * 0.15, 4, 60);
  r.absenteeism = clamp(r.absenteeism - (r.satisfaction - BASE.satisfaction) * 0.02, 1, 12);
  const separations = (r.turnover / 100) * HEADCOUNT;
  const costs = Math.round(BASE_WAGE_BILL + extraCost + separations * REPLACEMENT_COST);
  const legal = [
    "All employees must receive at least the National Employment Standards and the applicable modern award or enterprise agreement (Fair Work Act 2009).",
    "The employer has a primary duty of care for work health and safety (Work Health and Safety Act 2011 (NSW)) and must hold workers compensation insurance.",
    "Recruitment, promotion and reward decisions must not discriminate on protected attributes (e.g. sex, race, age, disability).",
  ];
  if (dec.disputes === "tribunal") legal.push("The Fair Work Commission generally expects parties to attempt to resolve disputes at the workplace level first.");
  if (dec.rewards === "performance-pay") legal.push("Performance pay sits on top of award minimums — it cannot be used to pay below the award rate.");
  return {
    turnover: Math.round(r.turnover * 10) / 10,
    satisfaction: Math.round(r.satisfaction),
    productivity: Math.round(r.productivity),
    absenteeism: Math.round(r.absenteeism * 10) / 10,
    relations: Math.round(r.relations),
    costs,
    notes,
    legal,
  };
}

// ---------------------------------------------------------------------------
// HR metrics (common workplace measures used as indicators of HR effectiveness)
// ---------------------------------------------------------------------------

/** Staff turnover rate (%) = separations ÷ average number of employees × 100 */
export function turnoverRate(separations: number, averageEmployees: number): number | null {
  if (averageEmployees <= 0) return null;
  return (separations / averageEmployees) * 100;
}

/** Absenteeism rate (%) = days lost to unplanned absence ÷ total scheduled working days × 100 */
export function absenteeismRate(daysLost: number, scheduledDays: number): number | null {
  if (scheduledDays <= 0) return null;
  return (daysLost / scheduledDays) * 100;
}

export function turnoverCost(separations: number, replacementCost: number): number {
  return separations * replacementCost;
}

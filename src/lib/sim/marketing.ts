// Marketing strategy simulator — a transparent, deterministic teaching model.
// ILLUSTRATIVE ONLY: outcomes show how consistent marketing-mix decisions tend to reinforce each other.
// They are not market forecasts.

export type TargetChoice = "mass" | "niche-premium" | "niche-eco";
export type PositionChoice = "premium" | "value" | "eco";
export type PriceChoice = "skimming" | "penetration" | "competition" | "cost-plus";
export type PromoChoice = "advertising" | "social" | "personal" | "sales-promo";
export type DistChoice = "intensive" | "selective" | "exclusive" | "online";

export interface MktDecisions {
  target: TargetChoice;
  positioning: PositionChoice;
  pricing: PriceChoice;
  promotion: PromoChoice;
  distribution: DistChoice;
  budget: number; // $ promotional budget
}

export interface MktResult {
  price: number;
  unitsSold: number;
  revenue: number;
  reach: number; // people reached
  awareness: number; // % of target market
  marketShare: number; // %
  profit: number;
  consistency: number; // 0–100 fit score
  explanations: { area: string; verdict: "effective" | "mixed" | "ineffective"; text: string }[];
}

export const MKT_ASSUMPTIONS = [
  "Fictional product: 'Tidal', an insulated reusable drink bottle launched in Australia. Unit cost of production is $7.",
  "Target market sizes (potential buyers this year): mass 2,000,000; niche premium 250,000; niche eco-conscious 400,000.",
  "Total category sales (all brands): mass 1,200,000 units; niche premium 120,000; niche eco 200,000. Market share = our units ÷ (category units + our units).",
  "Awareness rises with budget but with diminishing returns: awareness = max × (1 − e^(−budget ÷ k)). Promotion methods differ in efficiency for each target market.",
  "Niche buyers convert at a higher base rate (mass 12%, premium 20%, eco 18% of aware, reachable buyers). Purchase rate also depends on how well price, positioning, promotion and distribution fit the target market (consistency score).",
  "Distribution choice sets the share of the market that can easily find the product, and a fixed channel cost.",
  "All figures are illustrative teaching values.",
];

const MARKET = {
  mass: { size: 2_000_000, category: 1_200_000, refPrice: 25, k: 260_000, conversion: 0.12 },
  "niche-premium": { size: 250_000, category: 120_000, refPrice: 55, k: 90_000, conversion: 0.2 },
  "niche-eco": { size: 400_000, category: 200_000, refPrice: 38, k: 120_000, conversion: 0.18 },
} as const;

const UNIT_COST = 7;

const PRICE_MULT: Record<PriceChoice, number> = {
  skimming: 1.35,
  penetration: 0.72,
  competition: 1.0,
  "cost-plus": 0, // computed from cost
};

const PROMO_EFFICIENCY: Record<PromoChoice, Record<TargetChoice, number>> = {
  advertising: { mass: 1.0, "niche-premium": 0.7, "niche-eco": 0.65 },
  social: { mass: 0.75, "niche-premium": 0.85, "niche-eco": 1.0 },
  personal: { mass: 0.3, "niche-premium": 0.9, "niche-eco": 0.55 },
  "sales-promo": { mass: 0.85, "niche-premium": 0.4, "niche-eco": 0.6 },
};

const DIST: Record<DistChoice, { coverage: number; fixed: number; marginCut: number }> = {
  intensive: { coverage: 0.95, fixed: 120_000, marginCut: 0.35 },
  selective: { coverage: 0.65, fixed: 70_000, marginCut: 0.3 },
  exclusive: { coverage: 0.3, fixed: 45_000, marginCut: 0.25 },
  online: { coverage: 0.55, fixed: 40_000, marginCut: 0.08 },
};

/** Fit tables: 1 = strong fit, 0.5 = acceptable, 0 = conflicting. */
const POSITION_FIT: Record<PositionChoice, Record<TargetChoice, number>> = {
  premium: { mass: 0.3, "niche-premium": 1, "niche-eco": 0.6 },
  value: { mass: 1, "niche-premium": 0, "niche-eco": 0.4 },
  eco: { mass: 0.5, "niche-premium": 0.6, "niche-eco": 1 },
};
const PRICE_FIT: Record<PriceChoice, Record<PositionChoice, number>> = {
  skimming: { premium: 1, value: 0, eco: 0.6 },
  penetration: { premium: 0, value: 1, eco: 0.4 },
  competition: { premium: 0.5, value: 0.8, eco: 0.8 },
  "cost-plus": { premium: 0.3, value: 0.7, eco: 0.6 },
};
const DIST_FIT: Record<DistChoice, Record<PositionChoice, number>> = {
  intensive: { premium: 0.2, value: 1, eco: 0.5 },
  selective: { premium: 0.8, value: 0.6, eco: 0.9 },
  exclusive: { premium: 1, value: 0, eco: 0.5 },
  online: { premium: 0.7, value: 0.7, eco: 0.9 },
};

export function simulateMarketing(d: MktDecisions): MktResult {
  const m = MARKET[d.target];
  const price =
    d.pricing === "cost-plus" ? Math.round(UNIT_COST * 3) : Math.round(m.refPrice * PRICE_MULT[d.pricing]);
  const posFit = POSITION_FIT[d.positioning][d.target];
  const priceFit = PRICE_FIT[d.pricing][d.positioning];
  const distFit = DIST_FIT[d.distribution][d.positioning];
  const promoEff = PROMO_EFFICIENCY[d.promotion][d.target];
  const consistency = Math.round(((posFit + priceFit + distFit + promoEff) / 4) * 100);

  const budget = Math.max(0, d.budget);
  const awarenessFrac = 0.85 * (1 - Math.exp(-(budget * promoEff) / m.k));
  const awareness = Math.round(awarenessFrac * 1000) / 10;
  const reach = Math.round(m.size * awarenessFrac);
  const dist = DIST[d.distribution];

  // Price response: buyers compare our price with the reference price for the segment.
  const priceRatio = price / m.refPrice;
  const priceResponse = Math.max(0.15, Math.min(1.6, 1.25 - 0.75 * (priceRatio - 1) - 0.25));
  const purchaseRate = m.conversion * priceResponse * (0.35 + 0.65 * (consistency / 100));
  const unitsSold = Math.round(reach * dist.coverage * purchaseRate);

  const revenue = unitsSold * price;
  const channelMargin = revenue * dist.marginCut;
  const profit = Math.round(revenue - channelMargin - unitsSold * UNIT_COST - budget - dist.fixed);
  const marketShare = Math.round((unitsSold / (m.category + unitsSold)) * 1000) / 10;

  const explanations: MktResult["explanations"] = [];
  const verdict = (x: number) => (x >= 0.8 ? "effective" : x >= 0.45 ? "mixed" : "ineffective") as MktResult["explanations"][number]["verdict"];
  explanations.push({
    area: "Positioning vs target market",
    verdict: verdict(posFit),
    text:
      posFit >= 0.8
        ? "The positioning matches what this segment values, so the message is credible."
        : posFit >= 0.45
          ? "Partial fit: some customers in this segment value the positioning, others will not."
          : "Mismatch: the positioning conflicts with what this segment values (e.g. a 'value' brand aimed at premium buyers).",
  });
  explanations.push({
    area: "Pricing strategy",
    verdict: verdict(priceFit),
    text:
      d.pricing === "skimming"
        ? `Price skimming ($${price}) suits innovative or premium products where early adopters will pay more; it signals quality but limits volume.`
        : d.pricing === "penetration"
          ? `Penetration pricing ($${price}) builds market share quickly but lowers margin and can cheapen a premium image.`
          : d.pricing === "competition"
            ? `Competition-based pricing ($${price}) matches rivals, so differentiation must come from other elements of the mix.`
            : `Cost-based (cost-plus) pricing ($${price}) guarantees a margin over cost but ignores what customers will pay.`,
  });
  explanations.push({
    area: "Promotion",
    verdict: verdict(promoEff),
    text:
      promoEff >= 0.8
        ? "This promotional method reaches the chosen segment efficiently."
        : "This method is a weak match for the segment, so much of the budget is wasted on people outside the target market.",
  });
  explanations.push({
    area: "Distribution",
    verdict: verdict(distFit),
    text:
      d.distribution === "intensive"
        ? "Intensive distribution maximises availability — ideal for value products — but intermediaries take a large share of revenue and premium image is diluted."
        : d.distribution === "exclusive"
          ? "Exclusive distribution supports a prestige image and close retailer relationships, but limits availability."
          : d.distribution === "selective"
            ? "Selective distribution balances availability with control over how the product is presented."
            : "Online direct (e-commerce) keeps more margin and gathers customer data, but buyers cannot handle the product first.",
  });
  explanations.push({
    area: "Budget",
    verdict: budget < m.k * 0.3 ? "ineffective" : budget > m.k * 3 ? "mixed" : "effective",
    text:
      budget < m.k * 0.3
        ? "The budget is too small to build meaningful awareness in this market."
        : budget > m.k * 3
          ? "Diminishing returns: extra spending adds little awareness while reducing profit."
          : "The budget builds awareness efficiently before diminishing returns set in.",
  });
  return { price, unitsSold, revenue, reach, awareness, marketShare, profit, consistency, explanations };
}

import type { TopicId } from "./types";

// ---------------------------------------------------------------------------
// Directive terms — meanings follow the NESA Glossary of key words.
// ---------------------------------------------------------------------------

export interface Directive {
  verb: string;
  meaning: string;
  expects: string;
  judgement: boolean;
  structure: string[];
  sentenceStarter: string;
  example: string;
}

export const DIRECTIVES: Directive[] = [
  {
    verb: "Identify",
    meaning: "Recognise and name.",
    expects: "Name the feature, factor or strategy. No explanation needed — usually 1 mark per point.",
    judgement: false,
    structure: ["Name the item precisely, using syllabus terminology."],
    sentenceStarter: "One source of short-term finance is…",
    example: "Identify ONE source of short-term debt finance. → 'An overdraft.'",
  },
  {
    verb: "Outline",
    meaning: "Sketch in general terms; indicate the main features of.",
    expects: "A brief description of the main features — more than naming, less than explaining.",
    judgement: false,
    structure: ["Name it.", "Give one or two main features."],
    sentenceStarter: "JIT is an inventory strategy where…",
    example: "Outline the role of the Fair Work Commission.",
  },
  {
    verb: "Describe",
    meaning: "Provide characteristics and features.",
    expects: "A detailed picture of WHAT something is or looks like — characteristics, features, stages.",
    judgement: false,
    structure: ["Define the concept.", "Give its key characteristics/features.", "Add an example where useful."],
    sentenceStarter: "Quality assurance involves… Its key features include…",
    example: "Describe the acquisition stage of the human resource cycle.",
  },
  {
    verb: "Explain",
    meaning: "Relate cause and effect; make the relationships between things evident; provide why and/or how.",
    expects: "HOW something works and WHY it has an effect. Use linking words ('because', 'which leads to', 'as a result').",
    judgement: false,
    structure: ["State the point.", "Explain how/why it works.", "Show the effect (cause → effect).", "Example."],
    sentenceStarter: "Factoring improves liquidity because… which means…",
    example: "Explain how a business could use factoring to improve its cash flow.",
  },
  {
    verb: "Discuss",
    meaning: "Identify issues and provide points for and/or against.",
    expects: "A balanced response — advantages AND disadvantages (or arguments for AND against). A concluding view is good practice.",
    judgement: true,
    structure: ["Identify the issue.", "Points for (with explanation).", "Points against (with explanation).", "Brief concluding view."],
    sentenceStarter: "On one hand… However… On balance…",
    example: "Discuss the balance between cost-based competition and corporate social responsibility.",
  },
  {
    verb: "Analyse",
    meaning: "Identify components and the relationship between them; draw out and relate implications.",
    expects: "Break the issue into parts, show how they relate and what the implications/consequences are for the business.",
    judgement: false,
    structure: ["Identify the components/factors.", "Explain relationships between them.", "Draw out implications for business performance."],
    sentenceStarter: "The decline in the current ratio from 1.8:1 to 1.1:1 indicates… This has implications for…",
    example: "Analyse the impact of technology on human resource management.",
  },
  {
    verb: "Assess",
    meaning: "Make a judgement of value, quality, outcomes, results or size.",
    expects: "Explain AND judge how significant/effective/large something is. State the judgement clearly.",
    judgement: true,
    structure: ["Judgement up front.", "Explain each factor with evidence.", "Weigh strengths and limitations.", "Restate judgement."],
    sentenceStarter: "Outsourcing has been largely effective because…, although…",
    example: "Assess the effectiveness of global sourcing for a business you have studied.",
  },
  {
    verb: "Evaluate",
    meaning: "Make a judgement based on criteria; determine the value of.",
    expects: "Set criteria (e.g. cost, profitability, customer satisfaction), judge the strategy against them with evidence, and reach a clear overall judgement.",
    judgement: true,
    structure: ["Thesis with judgement.", "Criteria stated.", "Strengths vs limitations with evidence.", "Overall judgement."],
    sentenceStarter: "Measured against profitability and customer satisfaction, penetration pricing was highly effective…",
    example: "Evaluate the effectiveness of performance management strategies in a business you have studied.",
  },
  {
    verb: "Compare",
    meaning: "Show how things are similar or different.",
    expects: "Both similarities AND differences, point by point — not two separate descriptions.",
    judgement: false,
    structure: ["Point of comparison 1: both A and B…; whereas A… B…", "Point of comparison 2…", "Summary of key similarity/difference."],
    sentenceStarter: "Both debt and equity provide funds for growth; however, debt…, whereas equity…",
    example: "Compare debt finance and equity finance.",
  },
  {
    verb: "Contrast",
    meaning: "Show how things are different or opposite.",
    expects: "Differences only, made explicit with linking words ('whereas', 'in contrast').",
    judgement: false,
    structure: ["Difference 1 (A vs B).", "Difference 2 (A vs B).", "Difference 3 (A vs B)."],
    sentenceStarter: "Autocratic leaders make decisions alone, whereas democratic leaders…",
    example: "Contrast the developmental and administrative approaches to performance management.",
  },
  {
    verb: "Justify",
    meaning: "Support an argument or conclusion.",
    expects: "Give reasons and evidence that support a stated position or recommendation.",
    judgement: true,
    structure: ["State the position.", "Reason 1 with evidence.", "Reason 2 with evidence.", "Why it is better than the alternative."],
    sentenceStarter: "Leasing is the most appropriate source because…",
    example: "Justify a source of finance for the expansion described in the stimulus.",
  },
  {
    verb: "Recommend",
    meaning: "Provide reasons in favour.",
    expects: "Put forward a course of action and give reasons why it should be taken, linked to the scenario.",
    judgement: true,
    structure: ["State the recommendation.", "Explain how it solves the problem in the scenario.", "Give reasons/benefits.", "Acknowledge a limitation and how to manage it."],
    sentenceStarter: "It is recommended that X adopts… because…",
    example: "Recommend TWO strategies to improve the business's liquidity.",
  },
  {
    verb: "Examine",
    meaning: "Inquire into.",
    expects: "Investigate the issue in detail — features, causes, effects — often with case study evidence.",
    judgement: false,
    structure: ["Identify aspects of the issue.", "Investigate each with explanation and evidence."],
    sentenceStarter: "Examining X shows that…",
    example: "Examine the impact of globalisation on operations strategy.",
  },
  {
    verb: "Calculate",
    meaning: "Ascertain/determine from given facts, figures or information.",
    expects: "Show the formula, substitution and answer with correct units or format.",
    judgement: false,
    structure: ["Formula.", "Substitute figures.", "Answer with format (ratio, %, times, $)."],
    sentenceStarter: "Current ratio = CA ÷ CL = $150,000 ÷ $100,000 = 1.5 : 1",
    example: "Calculate the current ratio for 2026.",
  },
];

export const directiveByVerb = (v: string) => DIRECTIVES.find((d) => d.verb.toLowerCase() === v.toLowerCase());

// ---------------------------------------------------------------------------
// HSC examination structure (NESA Business Studies examination specifications)
// ---------------------------------------------------------------------------

export const EXAM_STRUCTURE = {
  total: 100,
  writingTime: "3 hours",
  readingTime: "5 minutes",
  sections: [
    {
      id: "I",
      name: "Section I — Objective response",
      marks: 20,
      time: "Allow about 35 minutes",
      format: "20 multiple-choice questions, each with four options (A–D). Questions may include calculations and stimulus material.",
    },
    {
      id: "II",
      name: "Section II — Short answer",
      marks: 40,
      time: "Allow about 1 hour and 15 minutes",
      format: "Short-answer questions, which may contain parts. Questions may use stimulus material such as business scenarios, financial information or graphs, and may require calculations.",
    },
    {
      id: "III",
      name: "Section III — Business report",
      marks: 20,
      time: "Allow about 35 minutes",
      format: "One compulsory question. Candidates respond to a business scenario (stimulus) in the form of a business report.",
    },
    {
      id: "IV",
      name: "Section IV — Extended response",
      marks: 20,
      time: "Allow about 35 minutes",
      format: "Answer ONE of two questions, which are drawn from different topics. Responses are expected to apply relevant case studies and contemporary business issues.",
    },
  ],
  note: "Structure summarised from the NESA Business Studies HSC examination specifications and recent HSC papers. Always check the current specifications on the NESA website. Questions requiring ratio calculations provide the relevant formula.",
};

export const REPORT_CRITERIA = [
  "Demonstrate knowledge and understanding relevant to the question",
  "Use relevant information from the stimulus (business scenario)",
  "Communicate using relevant business terminology and concepts",
  "Present a sustained, logical and cohesive response in the form of a business report",
];

export const EXTENDED_CRITERIA = [
  "Demonstrate knowledge and understanding relevant to the question",
  "Apply relevant business case studies and contemporary business issues",
  "Communicate using relevant business terminology and concepts",
  "Present a sustained, logical and cohesive response",
];

/** Indicative mark bands for 20-mark responses (structure modelled on NESA marking guidelines; wording is original). */
export const BANDS_20 = [
  { range: "17–20", text: "Comprehensive knowledge and understanding; clearly and directly addresses the question with sustained judgement where required; skilful use of the stimulus/case studies; precise terminology; well-structured, logical and cohesive." },
  { range: "13–16", text: "Sound knowledge and understanding; addresses the question; relevant use of stimulus/case studies; appropriate terminology; well organised." },
  { range: "9–12", text: "Some knowledge and understanding; addresses parts of the question; limited use of stimulus/case studies; some terminology; some organisation." },
  { range: "5–8", text: "Limited knowledge; mostly descriptive or general; little application; basic terminology." },
  { range: "1–4", text: "Elementary knowledge; minimal relevance to the question." },
];

// ---------------------------------------------------------------------------
// Interdependence of key business functions
// ---------------------------------------------------------------------------

export interface Connection {
  id: string;
  a: TopicId;
  b: TopicId;
  title: string;
  summary: string;
  examples: string[];
}

export const CONNECTIONS: Connection[] = [
  {
    id: "ops-mkt",
    a: "operations",
    b: "marketing",
    title: "Operations ↔ Marketing",
    summary: "Marketing identifies customer demand, while Operations produces the goods or delivers the services required to satisfy that demand.",
    examples: [
      "Marketing's sales forecasts determine production volumes and inventory levels.",
      "Product design is a joint task: Marketing defines what customers value; Operations determines what can be produced at the target cost and quality.",
      "A promotion that creates more demand than Operations can supply causes stock-outs and damages the brand.",
      "Operations quality and dependability make Marketing's promises credible.",
    ],
  },
  {
    id: "ops-fin",
    a: "operations",
    b: "finance",
    title: "Operations ↔ Finance",
    summary: "Operations requires funding for equipment, technology, materials and production processes; Operations efficiency drives costs and profitability.",
    examples: [
      "Purchasing leading-edge technology requires capital — debt, equity or leasing.",
      "Inventory ties up working capital; JIT releases cash and improves liquidity.",
      "Cost of goods sold (largely an operations cost) determines the gross profit ratio.",
    ],
  },
  {
    id: "ops-hr",
    a: "operations",
    b: "hr",
    title: "Operations ↔ Human Resources",
    summary: "Operations depends on employees with appropriate skills and sufficient staffing; changes in operations change HR needs.",
    examples: [
      "Automation requires retraining and may lead to redundancies — overcoming resistance to change.",
      "Task design in operations links to job design in HR.",
      "Quality improvement (TQM) relies on trained, empowered employees.",
    ],
  },
  {
    id: "mkt-fin",
    a: "marketing",
    b: "finance",
    title: "Marketing ↔ Finance",
    summary: "Marketing requires budgets, while successful marketing generates the revenue that supports financial objectives.",
    examples: [
      "Finance sets the marketing budget and evaluates the return on promotional spending.",
      "Marketing objectives (market share, sales) are revenue controls in profitability management.",
      "Pricing decisions affect gross profit margins and cash flow.",
    ],
  },
  {
    id: "fin-hr",
    a: "finance",
    b: "hr",
    title: "Finance ↔ Human Resources",
    summary: "Finance allocates funding for wages, recruitment, training and employee development; HR costs are a major influence on expenses.",
    examples: [
      "Wage increases in an enterprise agreement must be budgeted and affect the expense ratio.",
      "Redundancy payments are a financial cost of restructuring.",
      "Training is an investment that should improve productivity and future profitability.",
    ],
  },
  {
    id: "mkt-hr",
    a: "marketing",
    b: "hr",
    title: "Marketing ↔ Human Resources",
    summary: "Employees influence customer service quality, brand reputation and the delivery of marketing promises.",
    examples: [
      "'People' is an element of the services marketing mix — recruitment and training shape service quality.",
      "Personal selling depends on skilled, motivated salespeople (often with performance pay).",
      "Employee behaviour and workplace disputes can affect brand reputation.",
    ],
  },
];

export interface Scenario {
  id: string;
  decision: string;
  effects: Record<TopicId, string>;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "automation",
    decision: "A manufacturer invests in automated production equipment.",
    effects: {
      operations: "Higher capacity, consistency and quality; lower unit cost over time; plant layout must be reorganised.",
      marketing: "Lower costs allow more competitive pricing; consistent quality supports brand reputation.",
      finance: "Large capital outlay funded by debt, equity or leasing; depreciation and interest affect profit; long-term efficiency gains.",
      hr: "Retraining for new skills; possible redundancies; resistance to change must be managed through consultation.",
    },
  },
  {
    id: "new-market",
    decision: "A retailer expands into an overseas market.",
    effects: {
      operations: "New supply chain and logistics arrangements; possible global sourcing and economies of scale.",
      marketing: "Decide on standardisation vs customisation, global pricing and positioning against local competitors.",
      finance: "Exchange-rate risk, international payment methods and hedging; funding for expansion.",
      hr: "Recruit local staff or expatriates; comply with local employment law; manage cultural differences.",
    },
  },
  {
    id: "penetration",
    decision: "A business launches a new product with penetration pricing.",
    effects: {
      operations: "Must achieve high volume and low unit costs; capacity and inventory planning are critical.",
      marketing: "Rapid growth in market share; risk of a 'cheap' image.",
      finance: "Low initial margins reduce the gross profit ratio; cash flow must cover the build-up period.",
      hr: "More staff or overtime may be needed to meet volume; training for efficient processes.",
    },
  },
  {
    id: "outsourcing-cc",
    decision: "A business outsources its customer service call centre overseas.",
    effects: {
      operations: "Lower operating costs but less control over service quality and response times.",
      marketing: "Customer satisfaction and brand reputation may suffer if service quality falls.",
      finance: "Lower wage expenses improve the expense ratio; contract-management costs added.",
      hr: "Redundancies, consultation obligations and morale effects for remaining staff.",
    },
  },
];

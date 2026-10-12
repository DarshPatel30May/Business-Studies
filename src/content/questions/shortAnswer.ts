import type { TopicId } from "../types";
import type { Difficulty } from "./mcq";

export interface ShortAnswer {
  id: string;
  topic: TopicId;
  area: string;
  difficulty: Difficulty;
  marks: number;
  verb: string;
  type: "knowledge" | "calculation" | "analysis" | "evaluation";
  stimulus?: string;
  question: string;
  /** Marking criteria, highest band first. */
  criteria: { marks: string; description: string }[];
  sample: string;
  keyTerms: string[];
  stimulusTerms?: string[];
  /** For calculation questions: the numeric answer and acceptable tolerance. */
  numeric?: { answer: number; tolerance: number; unit: string };
}

export const SHORT_ANSWERS: ShortAnswer[] = [
  // OPERATIONS
  {
    id: "op-s1", topic: "operations", area: "ops-role", difficulty: "easy", marks: 2, verb: "Outline", type: "knowledge",
    question: "Outline the strategic role of operations in achieving cost leadership.",
    criteria: [
      { marks: "2", description: "Sketches in general terms how operations achieves cost leadership, with a relevant feature (e.g. economies of scale, efficient processes)." },
      { marks: "1", description: "Provides some relevant information about cost leadership or operations." },
    ],
    sample: "Cost leadership is gaining a competitive advantage by producing at a lower cost than competitors. Operations contributes by achieving economies of scale, using efficient technology and minimising waste (e.g. through JIT), which lowers unit costs so the business can charge lower prices or earn higher margins.",
    keyTerms: ["cost leadership", "competitive advantage", "economies of scale", "unit cost", "efficiency", "lower prices"],
  },
  {
    id: "op-s2", topic: "operations", area: "ops-processes", difficulty: "medium", marks: 4, verb: "Explain", type: "analysis",
    stimulus: "Sunrise Bakery produces bread for supermarkets and also runs a café where customers order at the counter.",
    question: "Explain how volume and visibility differ between Sunrise Bakery's wholesale production and its café.",
    criteria: [
      { marks: "4", description: "Clearly explains how volume AND visibility differ, relating cause and effect to the operations of each part of the business, using the stimulus." },
      { marks: "3", description: "Explains how volume and visibility differ, with some reference to the stimulus." },
      { marks: "2", description: "Describes volume and/or visibility." },
      { marks: "1", description: "Provides some relevant information." },
    ],
    sample: "Wholesale bread production is high volume: large quantities of standardised loaves allow Sunrise to use specialised ovens and repetitive processes, lowering unit costs. Its visibility is low because supermarket customers never see production, so the bakery can focus on efficiency rather than presentation. In contrast, the café is lower volume and highly visible: customers are present while orders are taken and served, so staff presentation, waiting times and service quality directly affect satisfaction. This means the café needs more customer-facing staff and flexible processes, which increases its cost per item compared with wholesale production.",
    keyTerms: ["volume", "visibility", "customer contact", "unit cost", "standardised", "efficiency", "customer satisfaction"],
    stimulusTerms: ["Sunrise", "supermarket", "café", "bread"],
  },
  {
    id: "op-s3", topic: "operations", area: "ops-processes", difficulty: "hsc", marks: 3, verb: "Calculate", type: "calculation",
    stimulus: "Activity A (2 days, –), B (4 days, A), C (3 days, A), D (2 days, B), E (5 days, C), F (1 day, D and E).",
    question: "Calculate the minimum project completion time and identify the critical path. Show your working.",
    criteria: [
      { marks: "3", description: "Correctly calculates both path lengths, identifies the critical path (A-C-E-F) and the completion time (11 days)." },
      { marks: "2", description: "Correct completion time OR correct critical path, with some working." },
      { marks: "1", description: "Some correct working." },
    ],
    sample: "Path A-B-D-F = 2 + 4 + 2 + 1 = 9 days. Path A-C-E-F = 2 + 3 + 5 + 1 = 11 days. The critical path is the longest path, A-C-E-F, so the minimum completion time is 11 days. (Activities B and D have 2 days of float.)",
    keyTerms: ["critical path", "float", "path"],
    numeric: { answer: 11, tolerance: 0, unit: "days" },
  },
  {
    id: "op-s4", topic: "operations", area: "ops-strategies", difficulty: "hard", marks: 5, verb: "Analyse", type: "analysis",
    stimulus: "Coastline Furniture is considering moving from a 'just-in-case' inventory system to just-in-time (JIT). It imports timber from a single supplier in South-East Asia.",
    question: "Analyse the implications of adopting JIT inventory management for Coastline Furniture.",
    criteria: [
      { marks: "5", description: "Identifies the components of JIT and clearly relates them to Coastline, drawing out benefits and risks (incl. the single overseas supplier) and their implications for business performance." },
      { marks: "4", description: "Analyses benefits and risks of JIT with reference to the stimulus." },
      { marks: "2–3", description: "Describes features, advantages and/or disadvantages of JIT." },
      { marks: "1", description: "Provides some relevant information." },
    ],
    sample: "JIT involves receiving materials only as needed for production, so Coastline would hold minimal timber stock. This would reduce holding costs (storage, insurance, obsolescence) and release cash tied up in inventory, improving liquidity and working capital. It also exposes inefficiencies because there is no buffer stock to hide problems. However, JIT relies on reliable, frequent deliveries. Coastline's single South-East Asian supplier creates a major risk: shipping delays, port congestion or a disruption at the supplier would leave no stock to continue production, causing missed deliveries and lower customer satisfaction. The long lead times of international shipping also make small, frequent deliveries expensive. The implication is that JIT could lower costs only if Coastline first strengthens its supply chain — e.g. developing a local or second supplier and sharing demand forecasts — or keeps a small safety stock of imported timber.",
    keyTerms: ["JIT", "holding costs", "inventory", "supplier", "lead time", "supply chain", "liquidity", "safety stock", "dependability"],
    stimulusTerms: ["Coastline", "single supplier", "South-East Asia", "timber", "just-in-case"],
  },
  {
    id: "op-s5", topic: "operations", area: "ops-influences", difficulty: "hsc", marks: 6, verb: "Discuss", type: "evaluation",
    question: "Discuss the balance between cost-based competition and corporate social responsibility in operations management. Refer to a business you have studied.",
    criteria: [
      { marks: "5–6", description: "Provides points for and against, clearly showing the tension between cost-based competition and CSR, with effective use of a relevant business example and a reasoned conclusion." },
      { marks: "3–4", description: "Discusses cost-based competition and CSR with some reference to a business." },
      { marks: "2", description: "Describes cost-based competition and/or CSR." },
      { marks: "1", description: "Provides some relevant information." },
    ],
    sample: "Cost-based competition pressures businesses to minimise unit costs, for example through global sourcing and outsourcing to low-wage countries. This supports low prices and market share. However, CSR requires operating ethically and sustainably beyond legal minimums, which often adds costs — auditing suppliers, using sustainable materials or paying fair prices. Nike illustrates the tension: outsourcing manufacturing to contract factories kept costs low, but criticism of conditions in those factories in the 1990s damaged its reputation. Nike responded with supplier codes of conduct and, in 2005, published its factory list — adding monitoring costs but rebuilding trust. On the other hand, some CSR initiatives lower costs over time, such as energy efficiency and waste reduction. On balance, businesses can compete on cost while meeting CSR expectations if they treat CSR as risk management and seek efficiency gains that also benefit the environment and workers, rather than cutting costs at the expense of ethics.",
    keyTerms: ["cost-based competition", "corporate social responsibility", "ethical", "legal compliance", "global sourcing", "outsourcing", "sustainability", "reputation"],
    stimulusTerms: ["Nike", "2005", "contract factories", "code of conduct"],
  },

  // MARKETING
  {
    id: "mk-s1", topic: "marketing", area: "mkt-influences", difficulty: "easy", marks: 2, verb: "Identify", type: "knowledge",
    question: "Identify TWO factors that influence customer choice.",
    criteria: [
      { marks: "2", description: "Identifies two relevant factors (e.g. psychological, sociocultural, economic, government)." },
      { marks: "1", description: "Identifies one relevant factor." },
    ],
    sample: "1. Economic factors (e.g. income and interest rates). 2. Sociocultural factors (e.g. family, reference groups and culture).",
    keyTerms: ["psychological", "sociocultural", "economic", "government"],
  },
  {
    id: "mk-s2", topic: "marketing", area: "mkt-process", difficulty: "medium", marks: 4, verb: "Explain", type: "analysis",
    stimulus: "GreenStep, a local sneaker brand made from recycled materials, has a loyal online following. A large international competitor has just launched a cheaper recycled sneaker, while government grants are available for sustainable manufacturers.",
    question: "Explain how GreenStep could use a SWOT analysis in its marketing process.",
    criteria: [
      { marks: "4", description: "Explains how SWOT informs the marketing process, correctly classifying internal and external factors from the stimulus and linking them to strategy." },
      { marks: "3", description: "Explains SWOT with some use of the stimulus." },
      { marks: "2", description: "Describes SWOT." },
      { marks: "1", description: "Provides some relevant information." },
    ],
    sample: "A SWOT analysis is part of the situational analysis at the start of the marketing process. GreenStep's strength is its loyal online following and sustainable positioning (internal). Its weakness may be higher costs than a large international producer (internal). The government grants are an opportunity to fund expansion (external), while the competitor's cheaper recycled sneaker is a threat (external). By matching strengths to opportunities, GreenStep could use the grant to scale production and emphasise its local, authentic brand to differentiate itself, reducing the threat of price competition. This analysis then informs its marketing objectives and strategies.",
    keyTerms: ["SWOT", "situational analysis", "strength", "weakness", "opportunity", "threat", "internal", "external", "differentiate"],
    stimulusTerms: ["GreenStep", "competitor", "grants", "loyal", "recycled"],
  },
  {
    id: "mk-s3", topic: "marketing", area: "mkt-strategies", difficulty: "medium", marks: 3, verb: "Compare", type: "analysis",
    question: "Compare price skimming and penetration pricing.",
    criteria: [
      { marks: "3", description: "Clearly shows similarities AND differences between the two strategies." },
      { marks: "2", description: "Shows a difference (or similarity) with some explanation." },
      { marks: "1", description: "Describes one strategy." },
    ],
    sample: "Both are pricing strategies used when launching a new product, and both plan for the price to change over time. However, price skimming sets a high initial price to target early adopters and recover development costs, whereas penetration pricing sets a low initial price to gain market share quickly. Skimming suits innovative, differentiated products with little early competition, whereas penetration suits price-sensitive mass markets where economies of scale matter.",
    keyTerms: ["price skimming", "penetration pricing", "market share", "early adopters", "whereas", "both"],
  },
  {
    id: "mk-s4", topic: "marketing", area: "mkt-influences", difficulty: "hard", marks: 5, verb: "Explain", type: "analysis",
    question: "Explain the importance of ethical behaviour and government regulation in marketing. Use an example.",
    criteria: [
      { marks: "5", description: "Explains the importance of BOTH ethics and regulation, distinguishing them clearly, with an accurate, relevant example." },
      { marks: "4", description: "Explains both with an example." },
      { marks: "2–3", description: "Describes ethics and/or regulation." },
      { marks: "1", description: "Provides some relevant information." },
    ],
    sample: "Government regulation sets enforceable minimum standards. Under the Australian Consumer Law, misleading or deceptive conduct is prohibited, and penalties are significant: in 2024 the Federal Court ordered Qantas to pay $100 million after it admitted selling tickets on flights it had already cancelled. Regulation therefore protects consumers and creates fair competition between businesses. Ethical behaviour goes beyond the law — for example, avoiding sugging or marketing unhealthy food to children, even where this is not prohibited. Ethics matters because trust is central to customer loyalty: businesses seen as dishonest lose customers and reputation, while truthful, accurate advertising builds long-term relationships. Together, regulation provides the minimum and ethics builds the trust that supports long-term profitability.",
    keyTerms: ["ethical", "Australian Consumer Law", "misleading", "deceptive", "regulation", "ACCC", "trust", "reputation", "sugging"],
  },
  {
    id: "mk-s5", topic: "marketing", area: "mkt-strategies", difficulty: "hsc", marks: 6, verb: "Evaluate", type: "evaluation",
    question: "Evaluate the use of standardisation and customisation in global marketing. Refer to a business you have studied.",
    criteria: [
      { marks: "5–6", description: "Makes a clear judgement about standardisation and customisation against criteria (cost, local appeal, brand), supported by an accurate business example." },
      { marks: "3–4", description: "Explains standardisation and customisation with some judgement and an example." },
      { marks: "2", description: "Describes standardisation and/or customisation." },
      { marks: "1", description: "Provides some relevant information." },
    ],
    sample: "Standardisation uses the same marketing mix in every country, lowering costs through economies of scale and creating a consistent global brand. Customisation adapts the mix to local tastes, culture and law, increasing appeal but raising costs. McDonald's combines both effectively: a standardised global brand and core menu deliver efficiency and recognition, while customised local menu items and promotions — such as embracing 'Macca's' in Australia — increase local relevance. By contrast, Wesfarmers' attempt to convert UK Homebase stores to the Bunnings format (2016–2018) shows the risk of under-customising: changes that suited Australian customers did not suit UK shoppers and the business was sold in 2018. Overall, a 'think global, act local' balance is the most effective approach — standardising the brand and core processes while customising product and promotion where customer preferences differ.",
    keyTerms: ["standardisation", "customisation", "global branding", "economies of scale", "local", "effective", "overall"],
    stimulusTerms: ["McDonald's", "Macca's", "Bunnings", "Homebase", "Wesfarmers"],
  },

  // FINANCE
  {
    id: "fi-s1", topic: "finance", area: "fin-processes", difficulty: "medium", marks: 2, verb: "Calculate", type: "calculation",
    stimulus: "Current assets: $360,000. Current liabilities: $240,000. Current ratio = current assets ÷ current liabilities.",
    question: "Calculate the current ratio. Show your working.",
    criteria: [
      { marks: "2", description: "Correct answer (1.5 : 1) with working." },
      { marks: "1", description: "Correct substitution or partially correct working." },
    ],
    sample: "Current ratio = $360,000 ÷ $240,000 = 1.5 : 1",
    keyTerms: ["current ratio"],
    numeric: { answer: 1.5, tolerance: 0.01, unit: ": 1" },
  },
  {
    id: "fi-s2", topic: "finance", area: "fin-processes", difficulty: "hard", marks: 4, verb: "Analyse", type: "analysis",
    stimulus: "Bayside Hardware — 2025: current ratio 1.9 : 1, debt to equity 0.7 : 1, net profit ratio 9%. 2026: current ratio 1.1 : 1, debt to equity 1.6 : 1, net profit ratio 8%. Industry averages: current ratio 1.6 : 1; debt to equity 0.9 : 1.",
    question: "Analyse the changes in Bayside Hardware's liquidity and solvency between 2025 and 2026.",
    criteria: [
      { marks: "4", description: "Identifies changes in both liquidity and solvency, uses comparative data (time and industry), and draws out implications for the business." },
      { marks: "3", description: "Explains changes in liquidity and solvency using the data." },
      { marks: "2", description: "Describes some changes." },
      { marks: "1", description: "Provides some relevant information." },
    ],
    sample: "Liquidity has weakened: the current ratio fell from 1.9 : 1 (above the industry average of 1.6 : 1) to 1.1 : 1, now well below the industry average. Bayside has only $1.10 of current assets for each $1 of current liabilities, increasing the risk it cannot pay short-term debts. Solvency has also deteriorated: the debt to equity ratio rose from 0.7 : 1 to 1.6 : 1, well above the industry average of 0.9 : 1, so Bayside now relies more on debt than owners' funds. Together these suggest Bayside may have borrowed — possibly short-term — to fund expansion, increasing interest costs and financial risk; the slight fall in the net profit ratio (9% to 8%) means profits are not keeping pace. Bayside should consider working capital strategies and reducing gearing.",
    keyTerms: ["liquidity", "solvency", "current ratio", "debt to equity", "industry average", "gearing", "financial risk", "working capital"],
    stimulusTerms: ["Bayside", "1.9", "1.1", "0.7", "1.6", "industry"],
  },
  {
    id: "fi-s3", topic: "finance", area: "fin-processes", difficulty: "hsc", marks: 3, verb: "Calculate", type: "calculation",
    stimulus: "Sales $500,000; cost of goods sold $300,000; expenses $140,000; total equity $400,000. Return on equity = net profit ÷ total equity.",
    question: "Calculate the return on equity. Show your working.",
    criteria: [
      { marks: "3", description: "Correctly calculates gross profit, net profit and ROE (15%) with working." },
      { marks: "2", description: "Calculates net profit correctly but makes an error in ROE, or minor error in working." },
      { marks: "1", description: "Some correct working (e.g. gross profit)." },
    ],
    sample: "Gross profit = $500,000 − $300,000 = $200,000. Net profit = $200,000 − $140,000 = $60,000. ROE = $60,000 ÷ $400,000 × 100 = 15%.",
    keyTerms: ["gross profit", "net profit", "return on equity"],
    numeric: { answer: 15, tolerance: 0.1, unit: "%" },
  },
  {
    id: "fi-s4", topic: "finance", area: "fin-strategies", difficulty: "medium", marks: 4, verb: "Explain", type: "analysis",
    question: "Explain TWO cash flow management strategies a business could use to improve its liquidity.",
    criteria: [
      { marks: "4", description: "Clearly explains how TWO relevant strategies improve liquidity (cause and effect)." },
      { marks: "3", description: "Explains two strategies with limited detail, or one strategy in detail." },
      { marks: "2", description: "Describes one or two strategies." },
      { marks: "1", description: "Provides some relevant information." },
    ],
    sample: "Discounts for early payment: offering customers, for example, a 2% discount if they pay within 7 days encourages faster payment, so cash flows in sooner and the business is better able to meet its short-term commitments — although it receives slightly less revenue. Factoring: the business sells its accounts receivable to a factor at a discount and receives immediate cash rather than waiting 30–60 days. This converts receivables to cash straight away, improving liquidity, at the cost of the factor's fee.",
    keyTerms: ["discounts for early payment", "factoring", "liquidity", "cash flow", "accounts receivable", "distribution of payments"],
  },
  {
    id: "fi-s5", topic: "finance", area: "fin-strategies", difficulty: "hsc", marks: 6, verb: "Recommend", type: "evaluation",
    stimulus: "Outback Eyewear imports frames from the United States and pays in US dollars 90 days after delivery. The Australian dollar has been volatile over the past year.",
    question: "Recommend strategies Outback Eyewear could use to manage its global financial risks. Justify your recommendations.",
    criteria: [
      { marks: "5–6", description: "Recommends appropriate global financial strategies, clearly justified with reference to exchange-rate risk and the stimulus." },
      { marks: "3–4", description: "Explains relevant strategies with some reference to the stimulus." },
      { marks: "2", description: "Describes global financial management strategies." },
      { marks: "1", description: "Provides some relevant information." },
    ],
    sample: "Outback Eyewear faces exchange-rate risk because it pays in US dollars 90 days after delivery: if the AUD falls in that time, each invoice costs more in Australian dollars, reducing its gross profit margin. I recommend a forward exchange contract (a derivative), which locks in today's exchange rate for the payment date. This removes uncertainty and protects profit margins, although Outback forgoes any gain if the AUD rises. Second, Outback could negotiate with its supplier to invoice in Australian dollars, transferring currency risk to the supplier — though the supplier may raise prices. Third, as a natural hedge over time, Outback could seek some US-dollar revenue (e.g. exporting) or Australian suppliers so its currency exposure is reduced. A forward contract is the most practical immediate strategy because it directly matches the 90-day payment timing.",
    keyTerms: ["exchange rate", "hedging", "derivatives", "forward exchange contract", "currency", "risk", "profit margin", "recommend"],
    stimulusTerms: ["Outback", "US dollars", "90 days", "volatile"],
  },

  // HUMAN RESOURCES
  {
    id: "hr-s1", topic: "hr", area: "hr-influences", difficulty: "easy", marks: 2, verb: "Outline", type: "knowledge",
    question: "Outline the role of the Fair Work Commission.",
    criteria: [
      { marks: "2", description: "Sketches the main functions of the FWC (e.g. sets minimum wages and awards, approves enterprise agreements, resolves disputes, unfair dismissal)." },
      { marks: "1", description: "Provides some relevant information." },
    ],
    sample: "The Fair Work Commission is Australia's national workplace relations tribunal. It reviews minimum wages and modern awards each year, approves enterprise agreements (applying the better off overall test), and helps resolve workplace disputes and unfair dismissal claims.",
    keyTerms: ["Fair Work Commission", "tribunal", "minimum wage", "modern awards", "enterprise agreements", "disputes", "unfair dismissal"],
  },
  {
    id: "hr-s2", topic: "hr", area: "hr-strategies", difficulty: "medium", marks: 3, verb: "Contrast", type: "analysis",
    question: "Contrast the developmental and administrative approaches to performance management.",
    criteria: [
      { marks: "3", description: "Clearly shows how the two approaches differ in purpose, process and outcome." },
      { marks: "2", description: "Shows a difference with some detail." },
      { marks: "1", description: "Describes one approach." },
    ],
    sample: "The developmental approach focuses on improving the employee's skills and career through feedback, coaching and training plans, whereas the administrative approach uses appraisal results to make decisions about pay, promotion, transfer or dismissal. Developmental reviews are forward-looking and supportive, whereas administrative reviews are evaluative and create formal records — which can make employees reluctant to discuss weaknesses.",
    keyTerms: ["developmental", "administrative", "appraisal", "feedback", "whereas", "promotion", "training"],
  },
  {
    id: "hr-s3", topic: "hr", area: "hr-effectiveness", difficulty: "hsc", marks: 3, verb: "Calculate", type: "calculation",
    stimulus: "At the start of the year a business had 110 employees and at the end it had 130. During the year 30 employees left. Staff turnover rate = separations ÷ average number of employees × 100.",
    question: "Calculate the staff turnover rate. Show your working.",
    criteria: [
      { marks: "3", description: "Correctly calculates the average (120) and the turnover rate (25%) with working." },
      { marks: "2", description: "Minor error (e.g. uses end-of-year headcount) with otherwise correct method." },
      { marks: "1", description: "Some correct working." },
    ],
    sample: "Average employees = (110 + 130) ÷ 2 = 120. Turnover rate = 30 ÷ 120 × 100 = 25%.",
    keyTerms: ["turnover", "average"],
    numeric: { answer: 25, tolerance: 0.1, unit: "%" },
  },
  {
    id: "hr-s4", topic: "hr", area: "hr-strategies", difficulty: "hard", marks: 5, verb: "Analyse", type: "analysis",
    question: "Analyse the causes of workplace disputes and the strategies used to resolve them.",
    criteria: [
      { marks: "5", description: "Identifies causes and resolution strategies and clearly relates them, drawing out implications (cost, relationships, speed)." },
      { marks: "4", description: "Explains causes and strategies with some links between them." },
      { marks: "2–3", description: "Describes causes and/or strategies." },
      { marks: "1", description: "Provides some relevant information." },
    ],
    sample: "Disputes commonly arise over pay and conditions during enterprise bargaining, job security (redundancies, outsourcing, technological change), working hours and rosters, and safety concerns. The appropriate resolution strategy depends on the cause and seriousness. Negotiation suits bargaining over pay because the parties can trade productivity improvements for wage increases; it is quick and preserves relationships. When negotiations stall, mediation by a neutral third party (often the Fair Work Commission) helps the parties reach their own agreement. Individual grievances — such as a roster complaint — are best handled through the grievance procedure in the award or agreement, which provides consistent steps. Serious unresolved disputes may require courts or tribunals; for example, the Federal Court found Qantas's 2020 outsourcing of ground handling breached the Fair Work Act. External resolution is binding but costly, slow and damaging to workplace relations, so businesses benefit most from resolving disputes early through internal methods.",
    keyTerms: ["disputes", "negotiation", "mediation", "grievance procedure", "courts", "tribunals", "Fair Work Commission", "enterprise bargaining", "job security"],
  },
  {
    id: "hr-s5", topic: "hr", area: "hr-influences", difficulty: "hsc", marks: 6, verb: "Discuss", type: "evaluation",
    question: "Discuss the influence of government on the process of determining employment contracts.",
    criteria: [
      { marks: "5–6", description: "Provides a balanced discussion of how government (legislation, FWC, FWO) influences employment contracts, with accurate legal terminology and examples." },
      { marks: "3–4", description: "Explains government influences on employment contracts." },
      { marks: "2", description: "Describes some government influences." },
      { marks: "1", description: "Provides some relevant information." },
    ],
    sample: "Government strongly shapes employment contracts through the Fair Work Act 2009. The National Employment Standards set minimum entitlements — such as annual leave, personal leave and notice of termination — that no contract can remove. Through the Fair Work Commission, government also sets minimum award wages in the Annual Wage Review and maintains modern awards, which set minimum pay and conditions for each industry. Enterprise agreements must be approved by the Commission and pass the better off overall test, so collective bargaining operates within government rules. The Fair Work Ombudsman enforces compliance, investigating underpayments. These influences protect employees and create a level playing field for employers. However, they also limit flexibility: businesses cannot simply negotiate lower conditions, and compliance with complex awards is costly — contributing to underpayment cases in some large businesses. Overall, government sets the framework within which employers and employees negotiate, balancing fairness with the flexibility businesses need.",
    keyTerms: ["Fair Work Act", "National Employment Standards", "modern awards", "enterprise agreements", "Fair Work Commission", "Fair Work Ombudsman", "better off overall test", "employment contract"],
  },
];

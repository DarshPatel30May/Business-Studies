import type { TopicId } from "../types";

export interface ReportQuestion {
  id: string;
  title: string;
  business: string;
  topics: TopicId[];
  verb: string;
  question: string;
  role: string;
  stimulus: string[];
  table?: { caption: string; columns: string[]; rows: string[][] };
  problems: { text: string; relevant: boolean; feedback: string }[];
  functions: TopicId[];
  strategies: { text: string; appropriate: boolean; why: string }[];
  structure: string[];
  modelPlan: { heading: string; points: string[] }[];
  keyTerms: string[];
  stimulusTerms: string[];
}

export const REPORT_TIME_GUIDE = [
  { minutes: 5, task: "Read the question and stimulus; underline the directive verb, the business problems and every figure." },
  { minutes: 5, task: "Plan: list problems → match each to syllabus strategies → decide headings and your recommendations." },
  { minutes: 22, task: "Write: title, executive summary, body sections under headings, recommendations." },
  { minutes: 3, task: "Check: does every section answer the question? Have you used the stimulus figures? Is there a clear judgement?" },
];

export const REPORT_STRUCTURE_GUIDE = [
  { part: "Title", detail: "A professional, specific title, e.g. 'Report on Financial and Operational Strategies for Ironbark Outdoor Furniture'. Include To / From / Date if you wish." },
  { part: "Executive summary", detail: "3–5 sentences: the business problem, the key issues identified, the strategies recommended and the intended outcome. Written last, placed first." },
  { part: "Introduction (optional)", detail: "Purpose of the report and the issues it addresses. Keep it brief — or combine with the executive summary." },
  { part: "Body sections with headings", detail: "Use headings that mirror the question's requirements (e.g. 'Analysis of liquidity', 'Operations strategies'). In each: syllabus terminology, explanation of the issue, application to the stimulus (names, figures), strategies and their effects, and evaluation where the verb requires it." },
  { part: "Recommendations", detail: "Specific, practical, justified actions linked to the problems in the stimulus. Numbered points are acceptable." },
  { part: "Conclusion", detail: "A concise judgement summarising how the recommendations will address the problem." },
];

export const REPORTS: ReportQuestion[] = [
  {
    id: "rep-ironbark",
    title: "Ironbark Outdoor Furniture — cash flow and operations",
    business: "Ironbark Outdoor Furniture Pty Ltd (fictional)",
    topics: ["finance", "operations"],
    verb: "Recommend",
    question:
      "You are a business consultant engaged by the owners of Ironbark Outdoor Furniture. Write a business report to the owners that analyses Ironbark's financial position and recommends financial and operations strategies to improve its performance.",
    role: "Business consultant",
    stimulus: [
      "Ironbark Outdoor Furniture is a family-owned manufacturer in Newcastle, NSW, employing 45 people. It makes timber and steel outdoor furniture sold to retailers and online.",
      "Sales grew strongly in 2026 after a successful online campaign. To avoid running out of stock, the production manager doubled raw-material orders from its single timber supplier in Vietnam. Warehouse space is now full.",
      "Retail customers are now taking an average of about 75 days to pay, although Ironbark's credit terms are 30 days. The overdraft is close to its limit and two suppliers have been paid late.",
      "Customer returns due to defects rose from 2% to 6% of units in 2026. Products are inspected only at the end of the production line.",
      "The owners are considering a $500,000 bank loan for a new automated production line, to be repaid over 7 years.",
    ],
    table: {
      caption: "Ironbark — selected financial information",
      columns: ["", "2025", "2026"],
      rows: [
        ["Sales", "$3,200,000", "$3,600,000"],
        ["Cost of goods sold", "$1,900,000", "$2,300,000"],
        ["Expenses", "$900,000", "$1,050,000"],
        ["Inventory", "$380,000", "$690,000"],
        ["Accounts receivable", "$300,000", "$740,000"],
        ["Cash", "$140,000", "$20,000"],
        ["Current liabilities", "$500,000", "$1,200,000"],
        ["Current ratio", "1.64 : 1", "1.21 : 1"],
        ["Gross profit ratio", "40.6%", "36.1%"],
        ["Net profit ratio", "12.5%", "6.9%"],
      ],
    },
    problems: [
      { text: "Liquidity has deteriorated — the current ratio fell from 1.64 : 1 to 1.21 : 1 and cash fell to $20,000.", relevant: true, feedback: "Correct — this is the central financial problem. Note the current ratio still looks above 1 : 1 but most current assets are slow-moving inventory and receivables." },
      { text: "Receivables are collected too slowly (≈ 75 days vs 30-day terms).", relevant: true, feedback: "Correct — AR turnover ≈ $3.6m ÷ $740k ≈ 4.9 times, about 75 days." },
      { text: "Excess inventory is tying up working capital and storage space.", relevant: true, feedback: "Correct — inventory rose 82% while sales rose only 12.5%." },
      { text: "Quality problems: defect returns tripled and quality relies on end-of-line inspection (quality control).", relevant: true, feedback: "Correct — this raises costs (rework, returns) and may explain part of the fall in the gross profit ratio." },
      { text: "Profitability fell: GP ratio 40.6% → 36.1%; NP ratio 12.5% → 6.9%.", relevant: true, feedback: "Correct — both margins fell, so both cost of goods sold and expenses rose faster than sales." },
      { text: "Sales are falling.", relevant: false, feedback: "Incorrect — sales rose from $3.2m to $3.6m. The problems are liquidity, costs and quality, not demand." },
      { text: "The business has too many employees.", relevant: false, feedback: "The stimulus gives no evidence of overstaffing. Avoid inventing problems not supported by the stimulus." },
    ],
    functions: ["finance", "operations"],
    strategies: [
      { text: "Offer discounts for early payment and enforce credit terms (follow-up, credit checks).", appropriate: true, why: "Directly speeds up collection of $740,000 of receivables, improving cash flow and liquidity." },
      { text: "Factor some receivables.", appropriate: true, why: "Provides immediate cash to reduce the overdraft — though the fee lowers profit, so use selectively." },
      { text: "Reduce inventory: order in line with forecasts, move toward JIT with a more reliable or second supplier.", appropriate: true, why: "Releases working capital; a second (possibly local) supplier reduces the risk of a single overseas source." },
      { text: "Introduce quality assurance / improvement (process standards, staff training) rather than relying on end-of-line inspection.", appropriate: true, why: "Prevents defects, reducing returns and costs and protecting reputation." },
      { text: "Fund the automated line with the overdraft.", appropriate: false, why: "Mismatch — a long-term asset should be financed with long-term finance (term loan, leasing). The overdraft is already near its limit." },
      { text: "Take the 7-year loan or lease the equipment — but only after stabilising cash flow.", appropriate: true, why: "Matches long-term finance to a long-term asset. Leasing conserves cash; timing matters because liquidity is currently weak and gearing will rise." },
      { text: "Double the promotional budget to increase sales further.", appropriate: false, why: "Higher sales on 75-day credit would worsen cash flow. The problem is converting sales to cash, not demand." },
    ],
    structure: ["Executive summary", "Introduction", "Analysis of financial position", "Working capital and cash flow management", "Operations strategies: inventory and quality", "Financing the automated production line", "Recommendations", "Conclusion"],
    modelPlan: [
      { heading: "Executive summary", points: ["Ironbark is profitable but faces a liquidity problem caused by slow receivables and excess inventory, plus rising defect costs.", "Recommend: credit control and early-payment discounts; inventory reduction with improved supplier arrangements; quality assurance; delay or lease the automation investment.", "Outcome: improved liquidity, restored margins, sustainable growth."] },
      { heading: "Analysis of financial position", points: ["Current ratio 1.64 → 1.21 : 1; cash $140k → $20k — liquidity weakening; quality of current assets is poor (inventory + receivables = 99% of CA).", "AR turnover ≈ 4.9 times (≈ 75 days) vs 30-day terms.", "GP ratio 40.6% → 36.1% (COGS rising faster than sales — defects, rework); NP ratio 12.5% → 6.9% (expenses up 16.7% vs sales 12.5%).", "Limitation: two years only; compare with industry averages."] },
      { heading: "Working capital and cash flow", points: ["Discounts for early payment (e.g. 2/7, net 30), credit checks and follow-up.", "Selective factoring to clear the overdraft — evaluate fee vs benefit.", "Distribute payments to suppliers to restore good relations."] },
      { heading: "Operations: inventory and quality", points: ["Align orders with demand forecasts; reduce inventory toward JIT only once supply is dependable (single overseas supplier = risk).", "Develop a second/local supplier — supply chain management.", "Shift from quality control to quality assurance/improvement; train staff; track defect rate KPI."] },
      { heading: "Financing the automated line", points: ["Match terms: 7-year loan or lease, not the overdraft.", "Gearing will increase; interest adds to expenses — timing after liquidity recovers.", "Benefits: lower unit costs and consistent quality (links to defect problem); HR implications: retraining, resistance to change."] },
      { heading: "Recommendations", points: ["1. Implement credit control and early-payment discounts immediately.", "2. Reduce inventory by aligning orders with forecasts and sourcing a second supplier.", "3. Introduce quality assurance and staff training to cut defects below 2%.", "4. Lease (or finance with a long-term loan) the automated line once the current ratio recovers above 1.5 : 1."] },
    ],
    keyTerms: ["liquidity", "current ratio", "working capital", "accounts receivable", "factoring", "discounts for early payment", "inventory", "JIT", "supplier", "quality assurance", "quality control", "gross profit ratio", "net profit ratio", "matching", "leasing", "gearing", "overdraft", "supply chain"],
    stimulusTerms: ["Ironbark", "75 days", "30 days", "Vietnam", "$500,000", "1.21", "1.64", "36.1%", "6.9%", "6%", "defect", "overdraft"],
  },
  {
    id: "rep-harbourview",
    title: "Harbourview Hotel — people and customer experience",
    business: "Harbourview Hotel (fictional)",
    topics: ["hr", "marketing"],
    verb: "Analyse / Recommend",
    question:
      "You are the newly appointed HR and Marketing Manager of Harbourview Hotel. Write a business report to the General Manager that analyses the human resource and marketing issues facing the hotel and recommends strategies to address them.",
    role: "HR and Marketing Manager",
    stimulus: [
      "Harbourview Hotel is a 160-room hotel in Port Stephens, NSW, employing 140 staff. It targets couples and conference groups.",
      "To cut costs over the past two years, management reduced permanent positions and relied more on casual staff, and cut the training budget. Managers make decisions with little consultation.",
      "Online reviews increasingly mention slow check-in, inconsistent service and unfriendly staff. A new resort with a modern day spa opened nearby last year.",
      "A staff survey found that 58% of employees felt 'not valued'. Several staff have raised concerns about short-notice roster changes; two formal grievances are unresolved.",
    ],
    table: {
      caption: "Harbourview Hotel — key indicators",
      columns: ["Indicator", "2024", "2026"],
      rows: [
        ["Staff turnover", "18%", "34%"],
        ["Absenteeism", "3.2%", "5.9%"],
        ["Casual staff (% of workforce)", "40%", "62%"],
        ["Training spend per employee", "$650", "$180"],
        ["Average online rating (out of 5)", "4.4", "3.7"],
        ["Occupancy rate", "82%", "71%"],
        ["Formal grievances lodged", "1", "7"],
      ],
    },
    problems: [
      { text: "HR effectiveness has declined: turnover nearly doubled (18% → 34%) and absenteeism rose (3.2% → 5.9%).", relevant: true, feedback: "Correct — these are syllabus indicators of HR effectiveness." },
      { text: "Training cuts have reduced service quality (training spend $650 → $180; reviews mention inconsistent service).", relevant: true, feedback: "Correct — links HR development to the marketing 'people' and 'processes' elements." },
      { text: "Autocratic leadership and roster practices are creating disputes (grievances 1 → 7).", relevant: true, feedback: "Correct — levels of disputation are an HR effectiveness indicator." },
      { text: "Customer perception and competitive position have weakened (rating 4.4 → 3.7, occupancy 82% → 71%, new competitor).", relevant: true, feedback: "Correct — the marketing problem is linked to the HR problem (interdependence)." },
      { text: "The hotel's prices are too low.", relevant: false, feedback: "No pricing data is provided — avoid unsupported claims." },
      { text: "The hotel must stop employing casual staff entirely.", relevant: false, feedback: "Casual staff suit variation in demand in hospitality. The issue is the balance and how staff are trained and managed." },
    ],
    functions: ["hr", "marketing"],
    strategies: [
      { text: "Re-invest in training for current skills (customer service, check-in systems) and induction for casual staff.", appropriate: true, why: "Addresses the service-quality complaints directly and should lift ratings." },
      { text: "Move to a democratic/situational leadership style; consult staff on rosters.", appropriate: true, why: "Improves satisfaction and reduces grievances; consultation on roster changes is also commonly required by awards." },
      { text: "Resolve grievances through the grievance procedure and negotiation; use mediation if needed.", appropriate: true, why: "Internal methods are faster and cheaper and preserve relationships." },
      { text: "Non-monetary rewards (recognition program, roster flexibility) plus some permanent roles for key positions.", appropriate: true, why: "Addresses the 58% 'not valued' finding at relatively low cost and improves retention." },
      { text: "Pay casual staff below the award to fund training.", appropriate: false, why: "Unlawful — the modern award and NES are minimum legal entitlements." },
      { text: "Reposition marketing around service and experience; use relationship marketing (guest follow-up, responses to reviews) and improve physical evidence.", appropriate: true, why: "Targets the couples and conference segments and counters the new resort's differentiation." },
      { text: "Run heavy discounting to raise occupancy immediately.", appropriate: false, why: "May raise occupancy short-term but erodes margins and positioning without fixing the service problem." },
    ],
    structure: ["Executive summary", "Introduction", "Analysis of HR effectiveness", "Impact on marketing and customer experience", "HR strategies", "Marketing strategies", "Recommendations", "Conclusion"],
    modelPlan: [
      { heading: "Executive summary", points: ["Cost-cutting in HR has reduced service quality, which is damaging reviews and occupancy.", "Recommend reinvesting in training, participative leadership, grievance resolution, recognition and a service-focused marketing strategy.", "Expected outcome: lower turnover and absenteeism, improved ratings and occupancy."] },
      { heading: "Analysis of HR effectiveness", points: ["Turnover 18% → 34%; absenteeism 3.2% → 5.9%; grievances 1 → 7; 58% feel 'not valued'.", "Causes: autocratic leadership, short-notice rosters, training cuts, casualisation.", "Cost: replacing 34% of 140 staff each year (≈ 48 people) means recruitment and induction costs and lost productivity."] },
      { heading: "Impact on marketing", points: ["Services marketing: people, processes and physical evidence shape perceived quality.", "Rating 4.4 → 3.7 and occupancy 82% → 71% — word of mouth (online reviews) amplifies service failures.", "New competitor differentiates with a modern spa."] },
      { heading: "HR strategies", points: ["Training (current skills) and induction for casuals.", "Situational/democratic leadership; consultative rostering.", "Grievance procedure → negotiation → mediation.", "Rewards: recognition, flexibility; legal obligations (NES, award) must be met."] },
      { heading: "Marketing strategies", points: ["Position on personalised service for couples and conference groups.", "Relationship marketing: respond to reviews, loyalty offers.", "Improve processes (faster check-in technology) and physical evidence."] },
      { heading: "Recommendations", points: ["1. Restore training budget toward $650 per employee; induct all casuals.", "2. Introduce consultative rostering with 14 days' notice where possible.", "3. Resolve outstanding grievances within 30 days.", "4. Launch recognition program; target turnover below 20% within 12 months.", "5. Relaunch service positioning and online review management; target a 4.3 rating."] },
    ],
    keyTerms: ["staff turnover", "absenteeism", "training", "leadership", "democratic", "situational", "grievance", "negotiation", "mediation", "rewards", "non-monetary", "award", "people", "processes", "physical evidence", "relationship marketing", "positioning", "word of mouth", "interdependence"],
    stimulusTerms: ["Harbourview", "34%", "18%", "5.9%", "3.7", "71%", "58%", "casual", "$180", "grievances", "resort"],
  },
  {
    id: "rep-tidal",
    title: "Tidal Bottles — going global",
    business: "Tidal Bottles Pty Ltd (fictional)",
    topics: ["marketing", "finance", "operations"],
    verb: "Evaluate / Recommend",
    question:
      "Tidal Bottles plans to expand into the United States and Japan. As a business analyst, write a business report to the board that evaluates the global marketing, operations and financial issues of this expansion and recommends appropriate strategies.",
    role: "Business analyst",
    stimulus: [
      "Tidal Bottles designs insulated reusable drink bottles in Melbourne and has 9% market share in Australia. Its products are made by a contract manufacturer in China and sold online and through selected outdoor retailers.",
      "A US distributor has offered to place Tidal in 400 stores. Japanese research shows consumers prefer smaller bottles and minimalist designs.",
      "The board wants to keep Tidal's 'Australian coastal' brand identity. Overseas customers would pay in US dollars and Japanese yen. The AUD/USD exchange rate moved between US$0.62 and US$0.69 over the past year.",
      "Expansion is expected to require $1.2 million for inventory, marketing and logistics. The business currently has a debt to equity ratio of 0.4 : 1 and $300,000 in cash.",
    ],
    problems: [
      { text: "Deciding the balance between standardisation and customisation for the US and Japanese markets.", relevant: true, feedback: "Correct — Japanese preferences differ (size, design), while the board wants a consistent brand." },
      { text: "Exchange-rate risk on foreign-currency revenue.", relevant: true, feedback: "Correct — a rising AUD would reduce the AUD value of US$ and yen revenue." },
      { text: "Choosing an appropriate source of finance for $1.2 million.", relevant: true, feedback: "Correct — cash covers only $300k; gearing is low (0.4 : 1), so debt is possible." },
      { text: "Supply chain and outsourcing risks with a single overseas contract manufacturer.", relevant: true, feedback: "Correct — larger volumes and new markets increase supply chain complexity and dependence on one supplier." },
      { text: "Tidal has too much debt to borrow.", relevant: false, feedback: "Incorrect — a debt to equity ratio of 0.4 : 1 indicates low gearing." },
    ],
    functions: ["marketing", "finance", "operations"],
    strategies: [
      { text: "Global branding with customisation: keep the brand, adapt bottle size and design for Japan.", appropriate: true, why: "Balances brand consistency with local preferences ('think global, act local')." },
      { text: "Use the US distributor (selective/intensive distribution) while maintaining online direct sales.", appropriate: true, why: "Rapid market access; but margin is shared with intermediaries." },
      { text: "Hedge with forward exchange contracts for expected foreign revenue.", appropriate: true, why: "Protects profit margins from AUD appreciation." },
      { text: "Finance with a mix of long-term debt and retained profits (gearing is low).", appropriate: true, why: "Debt is affordable given low gearing; avoid using short-term finance for a multi-year expansion." },
      { text: "Standardise everything to minimise cost.", appropriate: false, why: "Ignores research showing different Japanese preferences — risk of poor sales (cf. Bunnings UK)." },
      { text: "Rely on clean payment for all overseas retailers.", appropriate: false, why: "Highest risk for the exporter with new, unfamiliar customers — use letters of credit or payment in advance initially." },
      { text: "Add a second contract manufacturer and strengthen supplier quality assurance.", appropriate: true, why: "Reduces supply chain risk and supports CSR monitoring as volumes grow." },
    ],
    structure: ["Executive summary", "Introduction", "Global marketing strategy", "Operations and supply chain", "Financing the expansion", "Managing global financial risk", "Recommendations", "Conclusion"],
    modelPlan: [
      { heading: "Global marketing", points: ["Global branding: keep 'Australian coastal' identity — competitive positioning as authentic, sustainable.", "Customise product (smaller, minimalist) for Japan; standardise for US where preferences are similar.", "Global pricing: consider local competitors, distribution margins and exchange rates."] },
      { heading: "Operations", points: ["Single contract manufacturer — outsourcing risk; add a second supplier.", "Logistics and warehousing in the US; inventory planning for 400 stores.", "Quality assurance and CSR monitoring of suppliers."] },
      { heading: "Finance", points: ["$1.2m needed; $300k cash; D/E 0.4 : 1 → capacity for long-term debt.", "Match terms: long-term loan; leasing for warehouse equipment; consider equity if risk appetite is low.", "Cash flow budget for the build-up period."] },
      { heading: "Global financial risk", points: ["Exchange rate US$0.62–0.69: a 10% AUD rise cuts AUD revenue ~10%.", "Forward exchange contracts / options (derivatives); natural hedging by paying some costs in US$.", "Letters of credit for new overseas retailers."] },
      { heading: "Recommendations", points: ["1. Enter the US first via the distributor; customise for Japan after a pilot.", "2. Finance with a 5-year loan plus retained profits.", "3. Hedge 50–75% of forecast foreign revenue with forward contracts.", "4. Contract a second manufacturer and implement supplier audits."] },
    ],
    keyTerms: ["global branding", "standardisation", "customisation", "global pricing", "competitive positioning", "exchange rate", "hedging", "derivatives", "letter of credit", "debt to equity", "gearing", "matching", "outsourcing", "supply chain", "distribution", "global sourcing"],
    stimulusTerms: ["Tidal", "United States", "Japan", "400 stores", "US$0.62", "0.69", "$1.2 million", "0.4", "$300,000", "9%", "China"],
  },
];

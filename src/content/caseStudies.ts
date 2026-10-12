import type { TopicId } from "./types";

export interface Source {
  publisher: string;
  title: string;
  date: string;
  url?: string;
}

export interface CaseStudy {
  id: string;
  business: string;
  industry: string;
  topics: TopicId[];
  period: string;
  status: "past" | "current" | "past-and-current";
  tags: string[];
  headline: string;
  strategy: string;
  reasons: string;
  implementation: string[];
  benefits: string[];
  limitations: string[];
  evidence: { text: string; date: string }[];
  evaluation: string;
  hscUse: string;
  /** Approach to each key business function, used by the comparison tool. Only verified material is stored. */
  functions: Partial<Record<TopicId, string>>;
  sources: Source[];
}

export interface StrategyTag {
  id: string;
  label: string;
  topic: TopicId;
}

export const STRATEGY_TAGS: StrategyTag[] = [
  { id: "cost-leadership", label: "Cost leadership", topic: "operations" },
  { id: "differentiation", label: "Good/service differentiation", topic: "operations" },
  { id: "jit", label: "Inventory management — JIT", topic: "operations" },
  { id: "quality", label: "Quality management", topic: "operations" },
  { id: "supply-chain", label: "Supply chain management", topic: "operations" },
  { id: "global-sourcing", label: "Global sourcing", topic: "operations" },
  { id: "outsourcing", label: "Outsourcing", topic: "operations" },
  { id: "technology", label: "Technology", topic: "operations" },
  { id: "csr-ops", label: "CSR in operations", topic: "operations" },
  { id: "globalisation", label: "Globalisation (influence)", topic: "operations" },
  { id: "speed-flexibility", label: "Performance objectives — speed and flexibility", topic: "operations" },
  { id: "positioning", label: "Segmentation and positioning", topic: "marketing" },
  { id: "branding", label: "Branding", topic: "marketing" },
  { id: "pricing", label: "Pricing strategies", topic: "marketing" },
  { id: "promotion", label: "Promotion", topic: "marketing" },
  { id: "relationship", label: "Relationship marketing / loyalty", topic: "marketing" },
  { id: "global-marketing", label: "Global marketing (standardisation/customisation)", topic: "marketing" },
  { id: "consumer-law", label: "Consumer law", topic: "marketing" },
  { id: "marketing-ethics", label: "Ethical marketing", topic: "marketing" },
  { id: "equity-finance", label: "Equity finance", topic: "finance" },
  { id: "liquidity", label: "Liquidity / cash flow management", topic: "finance" },
  { id: "profitability-mgmt", label: "Profitability management", topic: "finance" },
  { id: "dispute", label: "Workplace disputes", topic: "hr" },
  { id: "hr-outsourcing", label: "Outsourcing / contractors", topic: "hr" },
  { id: "flexible-work", label: "Social influences — flexible work", topic: "hr" },
  { id: "hr-ethics", label: "Ethics and CSR in HRM", topic: "hr" },
  { id: "training", label: "Training and development", topic: "hr" },
  { id: "global-hr", label: "Global HR", topic: "hr" },
];

export const VERIFICATION_NOTE =
  "Case studies summarise publicly reported information from the sources listed, as at the dates shown. Businesses change their strategies — check the latest annual report or official announcement before quoting figures in an assessment. Where this guide was unable to confirm a precise figure, it is described qualitatively rather than invented.";

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "toyota",
    business: "Toyota Motor Corporation",
    industry: "Automotive manufacturing",
    topics: ["operations", "hr"],
    period: "Toyota Production System developed from the 1950s; ongoing. Australian manufacturing ended October 2017.",
    status: "past-and-current",
    tags: ["jit", "quality", "supply-chain", "globalisation", "training", "cost-leadership"],
    headline: "The Toyota Production System: just-in-time, built-in quality and continuous improvement",
    strategy:
      "The Toyota Production System (TPS) combines just-in-time (making only what is needed, when it is needed, in the amount needed) and jidoka (automation with a human touch — stopping production when a problem occurs so defects are not passed on), supported by kaizen (continuous improvement by employees).",
    reasons: "To eliminate waste (excess inventory, overproduction, waiting, defects), lower costs and build quality into every step rather than inspecting it in afterwards.",
    implementation: [
      "Kanban signals pull parts through production only as they are used, minimising inventory.",
      "Workers are empowered to stop the line when they detect an abnormality, so causes are fixed immediately.",
      "Close, long-term relationships with suppliers who deliver frequently in small batches.",
      "Standardised work and employee-led kaizen improvement activities.",
    ],
    benefits: [
      "Low inventory holding costs and less waste.",
      "Quality assurance built into the process (prevention rather than detection).",
      "Employee involvement supports motivation and ongoing productivity gains.",
    ],
    limitations: [
      "JIT depends on reliable supply: the March 2011 Great East Japan Earthquake and tsunami disrupted Toyota's parts supply and production.",
      "After the 2011 disruption Toyota worked to improve visibility of its multi-tier supply chain, showing the need to balance lean inventory with resilience.",
      "In Australia, TPS efficiency could not overcome structural cost disadvantages: Toyota announced in February 2014 that it would end local manufacturing, which ceased at Altona in October 2017.",
    ],
    evidence: [
      { text: "Toyota describes TPS as being built on the two pillars of jidoka and just-in-time.", date: "Toyota global website (current)" },
      { text: "Toyota Australia announced the end of local vehicle manufacturing, citing factors including the high Australian dollar, high manufacturing costs and a small domestic market.", date: "10 February 2014" },
      { text: "The Altona plant built its last vehicle and closed.", date: "3 October 2017" },
    ],
    evaluation:
      "TPS has been highly influential and is widely credited with Toyota's reputation for quality and efficiency. However, the 2011 disruption showed that JIT increases exposure to supply shocks, and the Australian closure shows that operations strategy alone cannot offset unfavourable influences such as globalisation and cost-based competition.",
    hscUse:
      "Toyota's use of JIT inventory management demonstrates how minimising stock reduces holding costs and exposes inefficiencies; however, the 2011 earthquake showed JIT's dependence on dependable suppliers, so JIT is most effective when combined with strong supplier relationships and supply-chain risk planning.",
    functions: {
      operations: "Lean production via TPS: JIT (kanban), jidoka (built-in quality), standardised work, continuous improvement, close supplier partnerships.",
      hr: "Employees are empowered to stop production to fix problems and take part in kaizen improvement; training in standardised work and problem-solving supports quality.",
    },
    sources: [
      { publisher: "Toyota Motor Corporation", title: "Toyota Production System (company vision and philosophy pages)", date: "Accessed 2026", url: "https://global.toyota" },
      { publisher: "Toyota Australia", title: "Media release: Toyota Australia to end local manufacturing", date: "10 February 2014", url: "https://www.toyota.com.au" },
      { publisher: "Toyota Australia", title: "Media release: Altona plant closure", date: "October 2017", url: "https://www.toyota.com.au" },
    ],
  },
  {
    id: "qantas-jetstar",
    business: "Qantas Group (Qantas and Jetstar)",
    industry: "Aviation (services)",
    topics: ["marketing", "operations"],
    period: "Jetstar launched 2004; dual-brand strategy ongoing",
    status: "current",
    tags: ["positioning", "differentiation", "cost-leadership", "branding"],
    headline: "Two brands, two positions: full-service Qantas and low-cost Jetstar",
    strategy:
      "The Qantas Group operates a dual-brand strategy: Qantas is positioned as a premium, full-service carrier, while Jetstar is positioned as a low-fares carrier competing for price-sensitive travellers.",
    reasons:
      "To compete in both the premium and price-sensitive segments of the market — protecting Qantas's premium brand from discounting while responding to low-cost competitors.",
    implementation: [
      "Jetstar uses a low-cost operating model (e.g. charging separately for extras such as checked baggage and seat selection).",
      "Qantas differentiates through service features: lounges, frequent flyer benefits, inclusions and network.",
      "Each brand has its own marketing mix — price, promotion and physical evidence differ.",
    ],
    benefits: [
      "Market segmentation allows the Group to serve different target markets without confusing either brand.",
      "Shared group resources (e.g. some infrastructure, scale) can support both operations.",
    ],
    limitations: [
      "Both brands depend on the Group's reputation — problems affecting one can affect perceptions of the other.",
      "Low-cost and premium models require different cultures and cost structures, which are complex to manage within one group.",
    ],
    evidence: [
      { text: "Qantas Group reports Qantas Domestic, Qantas International and Jetstar as separate segments in its annual reports.", date: "Qantas Group annual reports (e.g. 2024)" },
    ],
    evaluation:
      "The dual-brand approach is a clear example of segmentation and positioning in practice. Its effectiveness should be judged with segment results in the annual report and customer measures (on-time performance, satisfaction), which vary year to year.",
    hscUse:
      "The Qantas Group positions Qantas as a premium full-service brand and Jetstar as a low-cost brand, demonstrating how market segmentation and positioning allow one business to target both price-sensitive and service-focused customers with different marketing mixes.",
    functions: {
      marketing: "Segmentation and positioning via two brands: Qantas (premium, service differentiation, Frequent Flyer relationship marketing) and Jetstar (low fares).",
      operations: "Jetstar applies a low-cost operating model; Qantas emphasises service quality and network — cost leadership and differentiation within one group.",
    },
    sources: [{ publisher: "Qantas Group", title: "Annual Report (segment reporting: Qantas Domestic, Qantas International, Jetstar Group)", date: "2024", url: "https://investor.qantas.com" }],
  },
  {
    id: "qantas-accc",
    business: "Qantas Airways",
    industry: "Aviation (services)",
    topics: ["marketing"],
    period: "Conduct in 2022; ACCC proceedings 2023; penalty ordered 2024",
    status: "past",
    tags: ["consumer-law", "marketing-ethics"],
    headline: "Selling tickets on cancelled flights: misleading conduct under the Australian Consumer Law",
    strategy:
      "This is an example of the consequences of failing to comply with consumer law, rather than a planned strategy. The ACCC alleged Qantas continued to sell tickets on flights it had already cancelled and did not promptly notify existing ticketholders.",
    reasons: "The ACCC alleged the conduct breached the Australian Consumer Law's prohibitions on false or misleading representations.",
    implementation: [
      "ACCC commenced Federal Court proceedings against Qantas in August 2023.",
      "Qantas admitted the conduct and agreed with the ACCC to propose a penalty and a remediation program for affected customers (May 2024).",
      "The Federal Court ordered Qantas to pay a $100 million penalty.",
    ],
    benefits: ["For consumers: remediation payments and stronger enforcement signal."],
    limitations: [
      "For Qantas: a $100 million penalty, remediation costs and significant reputational damage at a time when customer satisfaction was already under pressure.",
    ],
    evidence: [
      { text: "ACCC instituted proceedings alleging false, misleading or deceptive conduct.", date: "31 August 2023" },
      { text: "Qantas agreed to pay a $100 million penalty (subject to court approval) and around $20 million in remediation to affected customers.", date: "6 May 2024" },
      { text: "The Federal Court ordered the $100 million penalty.", date: "2024" },
    ],
    evaluation:
      "The case shows why consumer law and ethical marketing matter: short-term revenue from misleading practices can lead to penalties far larger than the gains and lasting damage to trust.",
    hscUse:
      "Consumer law influences marketing because penalties for misleading conduct are severe: in 2024 the Federal Court ordered Qantas to pay $100 million after it admitted selling tickets on flights it had already cancelled, showing that misleading practices damage both profitability and brand reputation.",
    functions: {
      marketing: "Illustrates the influence of consumer law (ACL — false or misleading representations) and ethics on marketing practices.",
    },
    sources: [
      { publisher: "ACCC", title: "Media release: ACCC takes action against Qantas over alleged 'ghost flights'", date: "31 August 2023", url: "https://www.accc.gov.au" },
      { publisher: "ACCC", title: "Media release: Qantas to pay $100 million penalty and around $20 million in remediation (proposed settlement)", date: "6 May 2024", url: "https://www.accc.gov.au" },
    ],
  },
  {
    id: "qantas-outsourcing",
    business: "Qantas Airways",
    industry: "Aviation (services)",
    topics: ["hr", "operations"],
    period: "Outsourcing decision 2020; court decisions 2021–2023; compensation and penalty proceedings followed",
    status: "past",
    tags: ["hr-outsourcing", "outsourcing", "dispute", "hr-ethics"],
    headline: "Outsourcing ground handling: when cost savings meet the Fair Work Act",
    strategy: "In November 2020 Qantas outsourced its remaining in-house ground-handling operations (baggage handling, aircraft cleaning and related work) at 10 Australian airports to third-party providers.",
    reasons: "Qantas stated the decision would reduce costs and help the airline recover from the financial impact of the COVID-19 pandemic.",
    implementation: [
      "Ground-handling work was transferred to external contractors, and the affected employees' roles were made redundant.",
      "The Transport Workers' Union challenged the decision in the Federal Court under the Fair Work Act's general protections provisions.",
    ],
    benefits: ["Qantas expected lower ongoing operating costs from using specialist contractors."],
    limitations: [
      "The Federal Court found (July 2021) that the outsourcing contravened the general protections in the Fair Work Act because a reason for it was to prevent employees exercising workplace rights, such as taking protected industrial action.",
      "The Full Federal Court upheld the decision (2022) and the High Court dismissed Qantas's appeal (September 2023).",
      "Compensation and penalty orders followed, and the dispute damaged employee relations and public reputation.",
    ],
    evidence: [
      { text: "Federal Court judgment: Transport Workers' Union of Australia v Qantas Airways Limited.", date: "30 July 2021" },
      { text: "High Court dismissed Qantas's appeal.", date: "13 September 2023" },
    ],
    evaluation:
      "Outsourcing can reduce costs, but this case shows it must comply with workplace law: the legal, financial and reputational costs that followed undermined the intended benefits. It illustrates the difference between legal compliance and ethical responsibility in HRM.",
    hscUse:
      "Although outsourcing can lower costs, Qantas's 2020 outsourcing of ground handling was found by the Federal Court (upheld by the High Court in 2023) to breach the Fair Work Act's general protections, demonstrating that the legal framework constrains HR strategies and that poorly managed outsourcing can increase disputation and harm reputation.",
    functions: {
      hr: "Used outsourcing/contractors to reduce labour costs; the decision was found unlawful under the Fair Work Act general protections — a key example of legal influences and workplace disputes.",
      operations: "Outsourced non-flying ground-handling operations to specialist providers to reduce costs.",
    },
    sources: [
      { publisher: "Federal Court of Australia", title: "Transport Workers' Union of Australia v Qantas Airways Limited [2021] FCA 873", date: "30 July 2021", url: "https://www.fedcourt.gov.au" },
      { publisher: "High Court of Australia", title: "Qantas Airways Limited v Transport Workers' Union of Australia [2023] HCA 27", date: "13 September 2023", url: "https://www.hcourt.gov.au" },
    ],
  },
  {
    id: "qantas-capital-2020",
    business: "Qantas Group",
    industry: "Aviation (services)",
    topics: ["finance"],
    period: "June–July 2020",
    status: "past",
    tags: ["equity-finance", "liquidity", "profitability-mgmt"],
    headline: "Strengthening the balance sheet during COVID-19: placement plus share purchase plan",
    strategy: "As part of its June 2020 recovery plan, Qantas raised new equity through an institutional placement followed by a share purchase plan (SPP) for existing shareholders.",
    reasons: "Border closures had reduced revenue dramatically. New equity strengthened liquidity and the balance sheet without adding more debt and interest commitments.",
    implementation: [
      "A fully underwritten institutional placement of approximately $1.36 billion was announced on 25 June 2020.",
      "A non-underwritten share purchase plan was offered so eligible existing shareholders could buy new shares at the same price.",
      "The capital raising was part of a broader recovery plan that included major cost reductions and job cuts.",
    ],
    benefits: ["Fast access to large amounts of equity through a placement.", "The SPP allowed retail shareholders to participate and limit dilution.", "Reduced reliance on debt at a time of high uncertainty."],
    limitations: ["Existing shareholders who did not participate were diluted.", "Shares were issued at a time of depressed share prices, so more shares were needed to raise each dollar."],
    evidence: [{ text: "Qantas ASX announcement: recovery plan and approximately $1.36 billion institutional placement plus share purchase plan.", date: "25 June 2020" }],
    evaluation:
      "The raising illustrates the syllabus equity sources (placements and share purchase plans) and the trade-off between dilution and lower financial risk. It should be evaluated alongside the cost reductions that accompanied it.",
    hscUse:
      "In June 2020 Qantas used a placement of approximately $1.36 billion, followed by a share purchase plan, to strengthen liquidity during COVID-19; equity finance avoided adding interest commitments, although it diluted existing shareholders.",
    functions: { finance: "Raised equity via an institutional placement and a share purchase plan to support liquidity and solvency during COVID-19." },
    sources: [{ publisher: "Qantas Group / ASX", title: "ASX announcement: Qantas Group Recovery Plan and Equity Raising", date: "25 June 2020", url: "https://investor.qantas.com" }],
  },
  {
    id: "woolworths",
    business: "Woolworths Group",
    industry: "Supermarket retail",
    topics: ["operations", "marketing", "hr"],
    period: "2018–present (selected strategies)",
    status: "past-and-current",
    tags: ["supply-chain", "technology", "relationship", "consumer-law", "hr-ethics", "csr-ops"],
    headline: "Supply chain automation, loyalty data and the consequences of compliance failures",
    strategy:
      "Woolworths invests in automated distribution centres and digital systems to improve supply chain efficiency, uses its Everyday Rewards loyalty program for relationship marketing, and has faced regulatory scrutiny over pricing claims and past wage underpayments.",
    reasons: "Supermarkets compete intensely on price, convenience and availability, so supply chain efficiency and customer data are important sources of advantage.",
    implementation: [
      "Automated regional distribution centres to move stock to stores faster and more accurately.",
      "Everyday Rewards loyalty program collects purchase data to personalise offers.",
      "Phased out single-use plastic bags in stores in June 2018 (environmental sustainability).",
      "In October 2019 Woolworths disclosed it had underpaid many salaried store team members and began a remediation program.",
    ],
    benefits: ["Supply chain technology improves efficiency and stock availability.", "Loyalty data supports targeted promotion and customer retention."],
    limitations: [
      "Automation requires large capital investment and changes the skills required of employees.",
      "In September 2024 the ACCC commenced proceedings alleging that some 'Prices Dropped' discount claims were misleading; Woolworths has said it will defend the claims. Check the current status of these proceedings before using them.",
      "Wage underpayment caused remediation costs and reputational damage, showing the importance of payroll compliance.",
    ],
    evidence: [
      { text: "Single-use plastic bags removed from Woolworths stores.", date: "20 June 2018" },
      { text: "Woolworths announced it had underpaid salaried team members and would remediate.", date: "October 2019" },
      { text: "ACCC instituted proceedings against Woolworths (and separately Coles) over discount claims.", date: "September 2024 (proceedings ongoing at time of writing — verify)" },
    ],
    evaluation:
      "Woolworths shows the interdependence of functions: operations investment supports marketing promises of availability and value, while failures in HR compliance and marketing claims create legal and reputational risk. Outcomes of the ACCC proceedings should be checked before drawing conclusions.",
    hscUse:
      "Woolworths' investment in automated distribution centres shows how technology in supply chain management can improve the speed and dependability of operations, but such investment requires significant capital and retraining, linking operations to finance and HR.",
    functions: {
      operations: "Automated distribution centres and supply chain technology to improve efficiency and availability.",
      marketing: "Everyday Rewards relationship marketing using purchase data; pricing claims scrutinised by the ACCC (2024 proceedings).",
      hr: "Disclosed underpayment of salaried staff (2019) and undertook remediation — an example of legal obligations and ethics in HRM.",
    },
    sources: [
      { publisher: "Woolworths Group", title: "Annual Reports (supply chain and loyalty sections)", date: "2019–2025", url: "https://www.woolworthsgroup.com.au" },
      { publisher: "Woolworths Group", title: "ASX announcement regarding salaried team member remuneration review", date: "30 October 2019", url: "https://www.woolworthsgroup.com.au" },
      { publisher: "ACCC", title: "Media release: ACCC takes action against Woolworths and Coles over alleged misleading discount claims", date: "September 2024", url: "https://www.accc.gov.au" },
    ],
  },
  {
    id: "apple",
    business: "Apple Inc.",
    industry: "Consumer technology",
    topics: ["operations", "marketing"],
    period: "Ongoing (contract manufacturing model since the 2000s)",
    status: "current",
    tags: ["outsourcing", "global-sourcing", "csr-ops", "differentiation", "branding", "global-marketing", "pricing"],
    headline: "Design in-house, manufacture through partners — and differentiate through brand",
    strategy:
      "Apple designs its products and software in-house but outsources most final assembly to contract manufacturers such as Foxconn (Hon Hai), sourcing components globally. It competes through differentiation: design, integrated hardware–software–services, premium branding and a controlled retail experience.",
    reasons: "Outsourcing provides scale, flexibility and access to specialised manufacturing capability; differentiation supports premium prices and customer loyalty.",
    implementation: [
      "Global supply chain of component suppliers and assembly partners, largely in Asia, with assembly increasingly diversified to countries including India and Vietnam.",
      "Supplier Code of Conduct and annual supplier responsibility reporting with audits of labour and environmental practices.",
      "Largely standardised global branding and product range with localised pricing and retail.",
      "Apple Stores provide physical evidence and a controlled service experience.",
    ],
    benefits: ["Scale and flexibility without owning factories.", "Strong differentiation supports premium pricing and loyalty.", "Global branding creates worldwide recognition."],
    limitations: [
      "Outsourcing reduces direct control over working conditions; Apple's suppliers have faced criticism over labour practices, which creates reputational risk.",
      "Concentration of production in particular countries exposes Apple to geopolitical and supply disruptions.",
    ],
    evidence: [
      { text: "Apple publishes an annual supplier responsibility progress report (now 'People and Environment in Our Supply Chain').", date: "Annually since 2007" },
      { text: "Apple's annual Form 10-K describes reliance on outsourcing partners, many located outside the US, for manufacturing.", date: "Apple Form 10-K (e.g. fiscal 2024)" },
    ],
    evaluation:
      "Apple demonstrates that outsourcing manufacturing can be compatible with a strong differentiation strategy when the business retains control of design and brand. It also shows that outsourcing transfers operational risk rather than eliminating it — CSR monitoring is essential.",
    hscUse:
      "Apple outsources most final assembly to contract manufacturers such as Foxconn while retaining design in-house, which gives it scale and flexibility; however, its annual supplier responsibility reporting shows that outsourcing requires ongoing monitoring of suppliers' labour and environmental practices to manage CSR risk.",
    functions: {
      operations: "Outsourced final assembly and global sourcing of components; supplier code of conduct and audits; design retained in-house.",
      marketing: "Differentiation and premium positioning; standardised global brand; Apple Stores as physical evidence; price points across product lines.",
    },
    sources: [
      { publisher: "Apple Inc.", title: "People and Environment in Our Supply Chain — annual progress report", date: "Annual", url: "https://www.apple.com" },
      { publisher: "Apple Inc.", title: "Form 10-K Annual Report", date: "Fiscal 2024", url: "https://investor.apple.com" },
    ],
  },
  {
    id: "mcdonalds",
    business: "McDonald's",
    industry: "Quick-service restaurants (hospitality)",
    topics: ["operations", "marketing", "hr"],
    period: "Ongoing",
    status: "current",
    tags: ["global-marketing", "branding", "quality", "training", "speed-flexibility", "cost-leadership"],
    headline: "Standardised operations, a global brand and local customisation",
    strategy:
      "McDonald's uses highly standardised task design, process layout and training to deliver consistent, fast service at high volume, combined with a global brand that is customised to local tastes and culture.",
    reasons: "High volume and low variety allow economies of scale and consistent quality; customisation helps the brand appeal in different cultures.",
    implementation: [
      "Standard operating procedures and kitchen layouts designed for speed and consistency across restaurants.",
      "Extensive staff training, including Hamburger University for managers.",
      "Core global menu items alongside local items in different countries.",
      "In Australia, McDonald's embraced the nickname 'Macca's', including changing signage at some restaurants for an Australia Day promotion in 2013.",
    ],
    benefits: ["Consistency and speed support customer satisfaction and efficiency.", "Global brand recognition with local relevance."],
    limitations: ["Standardisation limits flexibility and can make jobs repetitive.", "Faces criticism related to products that may damage health, prompting menu and marketing changes."],
    evidence: [
      { text: "McDonald's operates in over 100 countries with a franchise-based model.", date: "McDonald's Corporation annual reports" },
      { text: "Macca's signage introduced at selected Australian restaurants for Australia Day.", date: "January 2013" },
    ],
    evaluation:
      "McDonald's shows how volume and low variety enable cost efficiency and consistency (operations), while a 'think global, act local' approach balances standardisation and customisation (marketing).",
    hscUse:
      "McDonald's balances standardisation and customisation in global marketing: it retains a standardised global brand and core menu, but customises menus for local tastes — and in Australia embraced the 'Macca's' nickname — increasing local appeal while preserving economies of scale.",
    functions: {
      operations: "Standardised task design and process layout for high volume, low variety and speed.",
      marketing: "Global branding with local customisation of menus and promotion ('Macca's' in Australia).",
      hr: "Structured training (including Hamburger University for managers) supports consistency; specific task job design.",
    },
    sources: [
      { publisher: "McDonald's Corporation", title: "Annual Report / Form 10-K", date: "2024", url: "https://corporate.mcdonalds.com" },
      { publisher: "McDonald's Australia", title: "Newsroom: Macca's Australia Day campaign", date: "January 2013", url: "https://mcdonalds.com.au" },
    ],
  },
  {
    id: "aldi",
    business: "ALDI Australia",
    industry: "Supermarket retail",
    topics: ["operations", "marketing"],
    period: "Entered Australia in 2001; ongoing",
    status: "current",
    tags: ["cost-leadership", "pricing", "branding"],
    headline: "Cost leadership through a limited range and private labels",
    strategy: "ALDI competes on low prices through a cost leadership operations strategy: a limited range of products, mostly exclusive (private-label) brands, smaller stores and efficient store processes.",
    reasons: "Lower operating costs allow consistently low shelf prices in a market long dominated by Woolworths and Coles.",
    implementation: [
      "A much smaller product range than full-line supermarkets, increasing volume per product and purchasing power.",
      "Mainly exclusive brands rather than national brands.",
      "Efficient store practices (e.g. products displayed in shipping cartons, customers bag their own groceries).",
    ],
    benefits: ["Lower costs passed on as low prices — clear value positioning.", "Private labels give control over specifications and margins."],
    limitations: ["Limited range means some shoppers must visit other stores.", "No traditional loyalty program, reducing personalised relationship marketing."],
    evidence: [{ text: "ALDI opened its first Australian stores in Sydney in 2001.", date: "January 2001" }],
    evaluation:
      "ALDI is a strong example of cost leadership through low variety and high volume. Effectiveness is reflected in its growth since 2001, although precise market share figures should be checked against current industry data.",
    hscUse:
      "ALDI Australia demonstrates cost leadership: by limiting variety and focusing on exclusive brands, it increases volume per product and reduces handling costs, allowing it to compete on price against larger rivals.",
    functions: {
      operations: "Low variety, high volume per line, efficient store processes — cost leadership.",
      marketing: "Value positioning, private-label branding, low everyday prices; limited promotion of national brands.",
    },
    sources: [{ publisher: "ALDI Australia", title: "About ALDI / corporate information", date: "Accessed 2026", url: "https://www.aldi.com.au" }],
  },
  {
    id: "kmart",
    business: "Kmart Australia (Wesfarmers)",
    industry: "Discount department store retail",
    topics: ["operations", "marketing"],
    period: "Turnaround from 2008; ongoing",
    status: "past-and-current",
    tags: ["cost-leadership", "global-sourcing", "pricing", "supply-chain"],
    headline: "Lower prices through a simplified range and direct sourcing",
    strategy:
      "Kmart Australia's turnaround from 2008 repositioned the business around consistently low prices, supported by a reduced range of higher-volume products, sourcing directly from manufacturers and lower operating costs.",
    reasons: "Kmart had been underperforming; a low-price, high-volume model aimed to attract more customers and improve returns.",
    implementation: [
      "Reduced product range to focus on high-volume items.",
      "Direct sourcing from overseas manufacturers to remove intermediaries.",
      "Everyday low prices and reduced reliance on promotional discounting.",
    ],
    benefits: ["Lower unit costs from scale and direct sourcing.", "Clear low-price positioning attracts value-conscious shoppers."],
    limitations: [
      "Global sourcing exposes Kmart to exchange-rate movements and supply chain disruption.",
      "Requires ethical sourcing programs to manage supplier labour standards (CSR).",
    ],
    evidence: [{ text: "Wesfarmers annual reports describe Kmart's lowest-price, high-volume operating model and its sourcing operations.", date: "Wesfarmers annual reports" }],
    evaluation: "Kmart illustrates how operations (global sourcing, low variety) and marketing (low-price positioning) work together in a cost leadership strategy.",
    hscUse:
      "Kmart Australia's use of direct global sourcing and a reduced product range lowers its unit costs, supporting a cost leadership strategy that allows consistently low prices — although it increases exposure to exchange-rate risk and requires ethical sourcing controls.",
    functions: {
      operations: "Direct global sourcing, reduced range of high-volume products, efficient supply chain.",
      marketing: "Everyday low price positioning.",
    },
    sources: [{ publisher: "Wesfarmers", title: "Annual Reports (Kmart Group divisional review)", date: "2010–2025", url: "https://www.wesfarmers.com.au" }],
  },
  {
    id: "bunnings-uk",
    business: "Wesfarmers — Bunnings UK & Ireland (Homebase)",
    industry: "Home improvement retail",
    topics: ["marketing", "operations"],
    period: "2016–2018",
    status: "past",
    tags: ["global-marketing", "globalisation"],
    headline: "Exporting an Australian retail model: the limits of standardisation",
    strategy: "In 2016 Wesfarmers acquired the UK home improvement chain Homebase and began converting stores to the Bunnings format, applying the business model that had been successful in Australia.",
    reasons: "To grow internationally by applying Bunnings' proven warehouse-store model to a large overseas market.",
    implementation: [
      "Homebase was acquired in early 2016 and pilot stores were converted to the Bunnings brand.",
      "The range and format were changed toward the Australian model.",
    ],
    benefits: ["Potential access to a large new market and economies of scale (expected, not achieved)."],
    limitations: [
      "Wesfarmers later acknowledged mistakes in the execution, including changes to the product range that did not suit UK customers.",
      "In 2018 Wesfarmers sold the business to Hilco Capital, recording a substantial loss on the venture.",
    ],
    evidence: [
      { text: "Wesfarmers completed the acquisition of Homebase.", date: "February 2016" },
      { text: "Wesfarmers announced the sale of Bunnings UK & Ireland to Hilco.", date: "May 2018" },
    ],
    evaluation:
      "The venture is widely cited as an example of failing to customise the marketing mix and operations to a different market — supporting the syllabus point that global marketing must balance standardisation with customisation.",
    hscUse:
      "Wesfarmers' attempt to convert Homebase stores to the Bunnings format in the UK (2016–2018) illustrates the risks of standardisation in global marketing: changes to range and format that suited Australian customers did not suit UK customers, and the business was sold in 2018.",
    functions: {
      marketing: "Attempted to standardise the Bunnings brand and format in the UK; insufficient customisation to local customer preferences.",
      operations: "Converted acquired stores to the Bunnings warehouse model; exited in 2018.",
    },
    sources: [
      { publisher: "Wesfarmers", title: "ASX announcement: Acquisition of Homebase", date: "January–February 2016", url: "https://www.wesfarmers.com.au" },
      { publisher: "Wesfarmers", title: "ASX announcement: Sale of Bunnings UK & Ireland", date: "May 2018", url: "https://www.wesfarmers.com.au" },
    ],
  },
  {
    id: "coca-cola-share",
    business: "Coca-Cola (Coca-Cola South Pacific)",
    industry: "Beverages",
    topics: ["marketing"],
    period: "Campaign launched in Australia in 2011; later run in many countries",
    status: "past",
    tags: ["promotion", "global-marketing", "branding"],
    headline: "'Share a Coke': personalising a global brand",
    strategy: "The 'Share a Coke' campaign replaced the Coca-Cola logo on bottles with popular first names, encouraging consumers to find and share a personalised bottle.",
    reasons: "To re-engage young adult consumers with a mature global brand and encourage social sharing (word of mouth).",
    implementation: [
      "Launched in Australia in 2011 with common Australian first names on packaging.",
      "Supported by advertising, social media and in-store activity; later adapted in many other countries with locally popular names.",
    ],
    benefits: ["Packaging became a promotional tool and generated word of mouth and social media sharing.", "A global brand was customised to local markets (names) while keeping its identity."],
    limitations: ["Novelty campaigns are hard to repeat with the same impact.", "Personalised packaging adds production complexity."],
    evidence: [{ text: "The Coca-Cola Company describes Share a Coke as originating in Australia in 2011.", date: "Coca-Cola company history pages" }],
    evaluation: "The campaign shows how packaging, promotion and opinion leaders/word of mouth can refresh a mature product (PLC extension strategy). Sales effects reported in media vary, so avoid quoting unverified figures.",
    hscUse:
      "Coca-Cola's 'Share a Coke' campaign, launched in Australia in 2011, used personalised packaging as a promotional tool to stimulate word of mouth — an extension strategy for a product in the maturity stage of its life cycle.",
    functions: { marketing: "Personalised packaging, social media and word of mouth; global brand customised with local names." },
    sources: [{ publisher: "The Coca-Cola Company", title: "Share a Coke — company history", date: "Accessed 2026", url: "https://www.coca-colacompany.com" }],
  },
  {
    id: "zara",
    business: "Inditex (Zara)",
    industry: "Fashion retail",
    topics: ["operations"],
    period: "Ongoing",
    status: "current",
    tags: ["speed-flexibility", "supply-chain", "differentiation"],
    headline: "Speed and flexibility as competitive weapons",
    strategy: "Zara's operations prioritise speed and flexibility: designs are produced in smaller batches and replenished frequently, with a significant share of production located close to its headquarters in Spain so collections can respond quickly to customer demand.",
    reasons: "Fashion demand is unpredictable; responding quickly to what sells reduces unsold stock and markdowns.",
    implementation: [
      "Proximity sourcing in Spain, Portugal, Morocco and Turkey for fast-moving items, alongside sourcing from Asia.",
      "Store sales data and staff feedback inform design and replenishment.",
      "Frequent, small deliveries to stores keep ranges fresh.",
    ],
    benefits: ["Reduced risk of unsold stock; fresh ranges encourage repeat visits.", "Speed and flexibility differentiate Zara from slower competitors."],
    limitations: ["Proximity production can cost more per unit than offshore production.", "Fast fashion faces environmental sustainability criticism."],
    evidence: [{ text: "Inditex annual reports describe its proximity sourcing model and integrated design–production–logistics system.", date: "Inditex annual reports" }],
    evaluation: "Zara shows that performance objectives such as speed and flexibility can be a source of competitive advantage, even at a higher unit cost — but must be balanced with sustainability expectations.",
    hscUse:
      "Inditex's Zara prioritises speed and flexibility by sourcing much of its fast-moving fashion close to Spain, enabling it to respond quickly to sales data and reduce unsold stock, demonstrating the trade-off between cost and speed in operations.",
    functions: { operations: "Speed and flexibility performance objectives; proximity sourcing; frequent replenishment informed by sales data." },
    sources: [{ publisher: "Inditex", title: "Annual Report (business model and supply chain sections)", date: "2024", url: "https://www.inditex.com" }],
  },
  {
    id: "nike",
    business: "Nike, Inc.",
    industry: "Footwear and apparel",
    topics: ["operations", "hr"],
    period: "1990s criticism; supplier disclosure from 2005; ongoing",
    status: "past-and-current",
    tags: ["outsourcing", "csr-ops", "global-hr", "hr-ethics"],
    headline: "Outsourced manufacturing and the rise of supply chain transparency",
    strategy: "Nike outsources almost all manufacturing to independent contract factories, mainly in Asia. After strong criticism of working conditions in its suppliers' factories in the 1990s, Nike introduced supplier codes of conduct and, in 2005, published a list of its contract factories.",
    reasons: "Outsourcing provides lower costs and flexibility; responding to criticism aimed to protect the brand and improve conditions.",
    implementation: [
      "Code of conduct for suppliers and factory monitoring.",
      "Public disclosure of contract factory locations (2005 onwards), now available through an online manufacturing map.",
      "Sustainability and impact reporting.",
    ],
    benefits: ["Low-cost, flexible production at global scale.", "Transparency improved stakeholder trust and set an industry precedent."],
    limitations: ["Outsourcing means Nike does not directly control working conditions.", "Monitoring cannot guarantee compliance across a large supplier base."],
    evidence: [{ text: "Nike's 2005 Corporate Responsibility Report included a list of its active contract factories.", date: "2005" }],
    evaluation: "Nike illustrates the balance between cost-based competition and CSR: outsourcing lowers costs but requires investment in monitoring and transparency to manage ethical risks.",
    hscUse:
      "Nike's response to 1990s criticism of conditions in its contract factories — including publishing its factory list in 2005 — shows that businesses relying on outsourcing must invest in supplier monitoring to balance cost-based competition with corporate social responsibility.",
    functions: {
      operations: "Outsourced manufacturing to contract factories; supplier code of conduct; transparency.",
      hr: "Global HR issue: labour standards in outsourced supply chains; ethics and CSR beyond legal compliance.",
    },
    sources: [
      { publisher: "Nike, Inc.", title: "FY05–06 Corporate Responsibility Report (contract factory disclosure)", date: "2005–2007", url: "https://about.nike.com" },
      { publisher: "Nike, Inc.", title: "Impact Report", date: "Annual", url: "https://about.nike.com" },
    ],
  },
  {
    id: "atlassian",
    business: "Atlassian",
    industry: "Software / technology services",
    topics: ["hr"],
    period: "Team Anywhere policy from 2020; ongoing",
    status: "current",
    tags: ["flexible-work", "global-hr"],
    headline: "'Team Anywhere': distributed work as an HR strategy",
    strategy: "In 2020 Atlassian introduced 'Team Anywhere', allowing most employees to choose whether to work from home or an office, with offices used mainly for connection and collaboration.",
    reasons: "To respond to changing work patterns, widen the talent pool beyond office locations and support work–life balance.",
    implementation: [
      "Most employees can work from any location in countries where Atlassian has a legal entity.",
      "Investment in collaboration tools and occasional in-person gatherings.",
    ],
    benefits: ["Access to a larger, more diverse talent pool (labour supply and skills).", "Supports worker satisfaction and retention through flexibility."],
    limitations: ["Maintaining culture, communication and new-employee development is harder at a distance.", "Managing employment law and tax across multiple countries is complex."],
    evidence: [{ text: "Atlassian announced its Team Anywhere approach.", date: "August 2020" }],
    evaluation: "Team Anywhere is a clear response to social and technological influences on HRM. Its effectiveness should be assessed with indicators such as turnover, engagement and productivity, which Atlassian reports selectively.",
    hscUse:
      "Atlassian's 2020 'Team Anywhere' policy responds to social influences such as changing work patterns and expectations of work–life balance, widening its labour supply while requiring new strategies to maintain corporate culture.",
    functions: { hr: "Flexible, distributed work (Team Anywhere) to attract global talent and support work–life balance." },
    sources: [{ publisher: "Atlassian", title: "Team Anywhere — Atlassian's distributed work approach", date: "2020", url: "https://www.atlassian.com" }],
  },
  {
    id: "patagonia",
    business: "Patagonia",
    industry: "Outdoor apparel",
    topics: ["marketing", "operations"],
    period: "'Don't Buy This Jacket' 2011; ownership change 2022",
    status: "past-and-current",
    tags: ["marketing-ethics", "csr-ops", "branding", "positioning"],
    headline: "Environmental responsibility as a positioning strategy",
    strategy: "Patagonia positions itself around environmental responsibility. On Black Friday 2011 it ran a New York Times advertisement headed 'Don't Buy This Jacket', urging customers to buy only what they need, and it promotes repair and resale of its products (Worn Wear).",
    reasons: "To reinforce a brand built on environmental values and appeal to environmentally conscious customers.",
    implementation: [
      "'Don't Buy This Jacket' advertisement (November 2011).",
      "Repair and resale programs to extend product life.",
      "In 2022 the founder transferred ownership of the company to a trust and a non-profit organisation dedicated to addressing climate change.",
    ],
    benefits: ["Highly differentiated, credible brand with loyal customers.", "Environmental commitment aligns marketing claims with operations practices."],
    limitations: ["Premium prices limit the target market.", "Ethical claims must be continually substantiated to avoid accusations of greenwashing."],
    evidence: [
      { text: "'Don't Buy This Jacket' advertisement published in The New York Times.", date: "25 November 2011" },
      { text: "Patagonia announced its ownership change.", date: "September 2022" },
    ],
    evaluation: "Patagonia shows ethical marketing and CSR can support differentiation when claims are backed by genuine operational practices.",
    hscUse:
      "Patagonia's 2011 'Don't Buy This Jacket' campaign shows how truthful environmental messaging, supported by repair and resale programs, can strengthen differentiation and brand loyalty in a niche market.",
    functions: {
      marketing: "Niche positioning on environmental values; ethical advertising; relationship marketing through repair/resale.",
      operations: "Environmental sustainability in product design, materials and repair programs.",
    },
    sources: [
      { publisher: "Patagonia", title: "Don't Buy This Jacket, Black Friday and the New York Times (company blog)", date: "November 2011", url: "https://www.patagonia.com" },
      { publisher: "Patagonia", title: "Earth is now our only shareholder (ownership announcement)", date: "September 2022", url: "https://www.patagonia.com" },
    ],
  },
];

export const caseStudyById = (id: string) => CASE_STUDIES.find((c) => c.id === id);

import type { TopicId } from "../types";

export interface ExtendedQuestion {
  id: string;
  topic: TopicId;
  area: string;
  verb: string;
  question: string;
  keyTerms: string[];
  suggestedStrategies: string[];
  suggestedCases: string[];
  plan: {
    thesis: string;
    paragraphs: { point: string; explanation: string; application: string; evaluation: string }[];
    conclusion: string;
  };
  sample?: string;
}

/** Practice sets: each pair contains two questions from different topics, mirroring Section IV. */
export const EXTENDED_SETS: { id: string; label: string; questions: [string, string] }[] = [
  { id: "set-1", label: "Practice set 1", questions: ["ext-ops-1", "ext-mkt-1"] },
  { id: "set-2", label: "Practice set 2", questions: ["ext-fin-1", "ext-hr-1"] },
  { id: "set-3", label: "Practice set 3", questions: ["ext-hr-2", "ext-ops-2"] },
  { id: "set-4", label: "Practice set 4", questions: ["ext-mkt-2", "ext-fin-2"] },
];

export const EXTENDED: ExtendedQuestion[] = [
  {
    id: "ext-ops-1",
    topic: "operations",
    area: "ops-strategies",
    verb: "Evaluate",
    question: "Evaluate the effectiveness of operations strategies in achieving business goals. Refer to a business you have studied.",
    keyTerms: ["operations strategies", "inventory management", "JIT", "quality management", "outsourcing", "supply chain", "cost leadership", "differentiation", "effective", "performance objectives"],
    suggestedStrategies: ["Inventory management (JIT)", "Quality management", "Outsourcing", "Supply chain management", "Technology"],
    suggestedCases: ["toyota", "apple", "zara"],
    plan: {
      thesis: "Operations strategies are highly effective in achieving goals such as cost minimisation and quality when they are aligned with the business's competitive strategy, but their effectiveness is limited by the risks they create — particularly supply chain vulnerability and reduced control.",
      paragraphs: [
        { point: "JIT inventory management", explanation: "Minimises holding costs and waste; exposes inefficiency.", application: "Toyota Production System — kanban, supplier partnerships.", evaluation: "Highly effective for cost and quality, but the 2011 earthquake showed vulnerability → effective only with resilient supply chains." },
        { point: "Quality management", explanation: "Jidoka and kaizen build quality into the process (assurance and improvement).", application: "Toyota workers can stop the line; continuous improvement.", evaluation: "Very effective — prevention lowers rework and warranty costs and supports reputation." },
        { point: "Outsourcing and global sourcing", explanation: "Specialists' scale lowers costs; flexibility.", application: "Apple outsources assembly to contract manufacturers (e.g. Foxconn) while keeping design in-house.", evaluation: "Effective for cost and scale, but CSR and control risks require supplier auditing — partially offsets savings." },
      ],
      conclusion: "Operations strategies are most effective when they reinforce the business's chosen source of competitive advantage and are supported by risk management; used in isolation, cost-focused strategies can undermine long-term goals.",
    },
    sample: `Operations strategies are the long-term decisions a business makes about how it transforms inputs into goods and services. They are highly effective in achieving business goals such as minimising costs, improving quality and building competitive advantage when they are aligned with the business's overall strategy. However, their effectiveness is limited when they increase exposure to risk, as Toyota's experience with just-in-time (JIT) inventory management and Apple's reliance on outsourcing demonstrate. This response evaluates three operations strategies against the criteria of cost efficiency, quality and resilience.

Inventory management through JIT is highly effective in minimising costs. JIT involves receiving materials only as they are needed for production, so stock levels and holding costs — storage, insurance and obsolescence — are kept to a minimum. Toyota developed JIT as one of the two pillars of the Toyota Production System, using kanban signals to pull parts through production only as they are used and relying on close, long-term relationships with suppliers who deliver frequently in small batches. This releases working capital that would otherwise be tied up in inventory and exposes inefficiencies that buffer stock would hide, supporting Toyota's goal of lean, low-cost production. However, the effectiveness of JIT depends on dependable supply. The March 2011 Great East Japan Earthquake and tsunami disrupted Toyota's parts supply and production, and Toyota subsequently worked to improve visibility of its supply chain. Therefore, JIT is highly effective in achieving cost goals in stable conditions but is less effective when supply chains are exposed to shocks, unless the business invests in supply chain risk management.

Quality management is a particularly effective strategy because it reduces costs and builds reputation at the same time. Quality control relies on inspecting outputs, whereas quality assurance and quality improvement prevent defects by building standards into processes. Through jidoka, Toyota empowers workers to stop the production line when they detect an abnormality, so the cause is fixed immediately rather than defects being passed on. Combined with kaizen — continuous improvement led by employees — this approach reduces waste, rework and warranty claims. This demonstrates the interdependence of operations and human resources, as effective quality improvement requires trained and empowered employees. The main limitation is that such a culture takes years to develop and requires ongoing investment in training. Nonetheless, because prevention is cheaper than detection and protects brand reputation, quality improvement is one of the most effective operations strategies for achieving both efficiency and differentiation goals.

Outsourcing and global sourcing are effective in achieving cost and scale goals but carry significant control and ethical risks. Apple designs its products and software in-house while outsourcing most final assembly to contract manufacturers such as Foxconn and sourcing components globally. This allows Apple to produce at enormous scale without owning factories, converting fixed costs into more flexible costs and letting management focus on design, software and brand — the core of its differentiation strategy. However, outsourcing reduces direct control over working conditions and environmental practices. Apple's suppliers have faced criticism over labour practices, and Apple now publishes an annual report on people and the environment in its supply chain describing supplier audits. These monitoring costs and the reputational risk partly offset the savings, showing the balance businesses must strike between cost-based competition and corporate social responsibility. Concentrating production in particular countries also exposes Apple to geopolitical and supply disruption, which is why Apple has diversified some assembly to countries such as India and Vietnam. Overall, outsourcing is effective for Apple because it retains control of the activities that create its competitive advantage, but it is only sustainable when combined with rigorous supplier management.

The effectiveness of each strategy also depends on how it fits the business's competitive strategy. Toyota's strategies support cost efficiency and reliability, while Apple's outsourcing supports a differentiation strategy based on design and brand. A strategy that is effective for one business may be ineffective for another — for example, a small manufacturer with a single overseas supplier would face greater risk from JIT than Toyota, which has the scale to build strong supplier partnerships.

In conclusion, operations strategies are highly effective in achieving business goals when they reinforce the business's source of competitive advantage and are supported by appropriate risk management. JIT and quality management have enabled Toyota to achieve efficiency and quality, and outsourcing has enabled Apple to achieve scale while focusing on design. However, their effectiveness is limited by supply chain vulnerability and reduced control, so the most effective businesses combine cost-focused strategies with resilience, supplier relationships and corporate social responsibility.`,
  },
  {
    id: "ext-mkt-1",
    topic: "marketing",
    area: "mkt-strategies",
    verb: "Evaluate",
    question: "Evaluate the effectiveness of global marketing strategies for a business entering international markets. Refer to businesses you have studied.",
    keyTerms: ["global marketing", "global branding", "standardisation", "customisation", "global pricing", "competitive positioning", "marketing mix", "effective"],
    suggestedStrategies: ["Global branding", "Standardisation", "Customisation", "Global pricing", "Competitive positioning"],
    suggestedCases: ["mcdonalds", "bunnings-uk", "coca-cola-share", "apple"],
    plan: {
      thesis: "Global marketing strategies are most effective when businesses standardise what customers value consistently (brand, core product) and customise what differs between markets; strategies that over-standardise risk failure.",
      paragraphs: [
        { point: "Global branding and standardisation", explanation: "One brand and consistent mix → economies of scale, recognition.", application: "Apple's largely standardised global brand and products.", evaluation: "Highly effective where customer needs are similar across countries." },
        { point: "Customisation", explanation: "Adapting product, promotion and price to local culture and law.", application: "McDonald's local menu items; 'Macca's' in Australia; Share a Coke local names.", evaluation: "Effective in increasing local appeal; adds cost and complexity." },
        { point: "Failure to customise", explanation: "Assuming a domestic model will work abroad.", application: "Bunnings UK (Homebase) 2016–2018 — range/format did not suit UK customers; sold 2018.", evaluation: "Shows the cost of under-customisation — strongly negative outcome." },
      ],
      conclusion: "The most effective approach is a balance — 'think global, act local' — based on market research in each country.",
    },
    sample: `Global marketing involves marketing goods and services across national borders using strategies such as global branding, standardisation, customisation, global pricing and competitive positioning. These strategies are highly effective when a business standardises the elements customers value consistently across countries — such as its brand and core product — while customising the elements that differ between markets. When businesses assume a domestic formula will work everywhere, global marketing can fail, as Wesfarmers' Bunnings UK venture demonstrates. This response evaluates global marketing strategies using the criteria of cost efficiency, customer appeal and business performance.

Global branding and standardisation are effective in creating recognition and reducing costs. Standardisation uses the same marketing mix in every country, allowing economies of scale in production and promotion and a consistent brand image for customers who travel or shop online. Apple largely standardises its brand, product range and premium positioning worldwide, supported by its own retail stores, which provide consistent physical evidence of quality. Because customers in many countries value similar features — design, ease of use and an integrated ecosystem — standardisation strengthens Apple's competitive positioning as a premium, differentiated brand. The limitation is that standardisation assumes customer needs are similar; Apple still adjusts prices for local taxes, exchange rates and competition, showing that even highly standardised businesses use global pricing strategies. Therefore, standardisation is highly effective where needs are similar, but rarely complete.

Customisation is effective in increasing local appeal, although it raises costs. McDonald's combines a standardised global brand and core menu with customised items and promotions in different countries. In Australia, McDonald's embraced the local nickname 'Macca's', changing signage at selected restaurants for an Australia Day promotion in 2013, which strengthened its connection with Australian customers without changing its global identity. Similarly, Coca-Cola's 'Share a Coke' campaign, which originated in Australia in 2011, customised a global brand by printing locally popular first names on packaging, and the concept was later adapted in many countries with local names. These examples show that customisation of promotion and product can refresh a mature brand and encourage word of mouth. However, customisation adds complexity to operations and marketing budgets, so it is most effective when targeted at the elements of the mix that genuinely matter to local customers.

The importance of customisation is shown most clearly when it is absent. In 2016 Wesfarmers acquired the UK home improvement chain Homebase and began converting stores to the Bunnings format that had been successful in Australia. Wesfarmers later acknowledged mistakes, including changes to the product range that did not suit UK customers, and in 2018 it sold the business, recording a substantial loss. This shows that global marketing strategies are ineffective when market research about local preferences, competitors and shopping habits is not fully reflected in the marketing mix. Competitive positioning that works in one country cannot be assumed to transfer to another with different competitors and customer expectations.

Global pricing also affects effectiveness. Businesses must consider production and distribution costs, local incomes, competitor prices and exchange rates. A falling Australian dollar makes Australian exports cheaper for overseas customers, while a rising dollar can erode margins, so global marketing decisions are interdependent with global financial management strategies such as hedging.

In conclusion, global marketing strategies are highly effective when businesses achieve an appropriate balance between standardisation and customisation. Standardised global branding delivers recognition and economies of scale, as Apple shows, while customisation — demonstrated by McDonald's and Coca-Cola — increases local relevance. The Bunnings UK experience shows that failing to customise can lead to costly failure. The most effective global marketers therefore 'think global and act local', using market research in each country to decide which elements of the marketing mix to standardise and which to adapt.`,
  },
  {
    id: "ext-fin-1",
    topic: "finance",
    area: "fin-strategies",
    verb: "Evaluate",
    question: "Evaluate the effectiveness of financial management strategies in improving a business's liquidity and profitability.",
    keyTerms: ["cash flow management", "working capital", "factoring", "discounts for early payment", "sale and leaseback", "leasing", "cost controls", "revenue controls", "liquidity", "profitability", "current ratio", "net profit ratio"],
    suggestedStrategies: ["Cash flow management", "Working capital management", "Profitability management", "Sale and leaseback"],
    suggestedCases: ["qantas-capital-2020", "woolworths"],
    plan: {
      thesis: "Financial strategies are effective in improving liquidity and profitability when matched to the specific weakness revealed by ratio analysis, but there is often a trade-off between the two objectives.",
      paragraphs: [
        { point: "Cash flow management", explanation: "Distribution of payments, discounts for early payment, factoring speed up/smooth cash flow.", application: "Use a hypothetical: AR turnover 5 times (73 days) vs 30-day terms.", evaluation: "Effective for liquidity; discounts/fees reduce profitability — trade-off." },
        { point: "Working capital management", explanation: "Control of cash, receivables, inventory, payables; leasing; sale and leaseback.", application: "Sale and leaseback releases cash tied up in property.", evaluation: "Very effective short-term liquidity boost; ongoing lease costs reduce profit and asset ownership." },
        { point: "Profitability management", explanation: "Cost controls (fixed/variable, cost centres, expense minimisation) and revenue controls.", application: "Qantas 2020 recovery plan combined cost reductions with equity raising.", evaluation: "Effective if cuts target waste, not value-adding activities." },
      ],
      conclusion: "No single strategy maximises both objectives — effective financial management combines strategies and monitors ratios over time.",
    },
  },
  {
    id: "ext-hr-1",
    topic: "hr",
    area: "hr-strategies",
    verb: "Assess",
    question: "Assess the effectiveness of human resource management strategies in managing workplace disputes. Refer to a business you have studied.",
    keyTerms: ["workplace disputes", "negotiation", "mediation", "grievance procedures", "courts and tribunals", "Fair Work Commission", "leadership", "outsourcing", "levels of disputation", "effectiveness"],
    suggestedStrategies: ["Negotiation", "Mediation", "Grievance procedures", "Courts and tribunals", "Leadership style"],
    suggestedCases: ["qantas-outsourcing", "woolworths"],
    plan: {
      thesis: "Internal strategies (negotiation, grievance procedures, participative leadership) are the most effective in preventing and resolving disputes; external resolution is effective in producing binding outcomes but costly and damaging to relationships.",
      paragraphs: [
        { point: "Causes and prevention", explanation: "Pay, job security, outsourcing, rosters; leadership and consultation prevent disputes.", application: "Qantas 2020 outsourcing triggered legal challenge.", evaluation: "Prevention is the most effective (and cheapest) approach." },
        { point: "Negotiation and grievance procedures", explanation: "Quick, low cost; preserves relationships.", application: "Award dispute-resolution terms; enterprise bargaining.", evaluation: "Highly effective for most disputes; limited when trust has broken down." },
        { point: "Mediation, courts and tribunals", explanation: "Neutral third party; binding decisions.", application: "Federal Court 2021 & High Court 2023 Qantas decisions.", evaluation: "Effective at enforcing rights; costly and reputationally damaging for the business." },
      ],
      conclusion: "Overall, HR strategies are most effective when they prevent disputes through consultation and lawful decision-making.",
    },
  },
  {
    id: "ext-hr-2",
    topic: "hr",
    area: "hr-influences",
    verb: "Explain",
    question: "Explain how businesses exhibit corporate social responsibility in the management of human resources.",
    keyTerms: ["corporate social responsibility", "ethics", "legal compliance", "work-life balance", "diversity", "wellbeing", "fair treatment", "flexible work"],
    suggestedStrategies: ["Rewards", "Training and development", "Flexible work arrangements", "Diversity and inclusion"],
    suggestedCases: ["atlassian", "woolworths", "nike"],
    plan: {
      thesis: "Businesses exhibit CSR in HRM by going beyond legal compliance to treat employees fairly, support their wellbeing and development, and uphold labour standards in their supply chains.",
      paragraphs: [
        { point: "Legal compliance vs ethical responsibility", explanation: "NES/awards/WHS are minimums; CSR goes beyond them.", application: "Woolworths 2019 underpayment remediation shows the cost of compliance failure.", evaluation: "Compliance is the foundation of CSR." },
        { point: "Flexibility and wellbeing", explanation: "Flexible work, wellbeing programs, work–life balance.", application: "Atlassian Team Anywhere (2020).", evaluation: "Supports attraction and retention." },
        { point: "Global labour standards", explanation: "Supplier codes of conduct and transparency.", application: "Nike factory list (2005).", evaluation: "Extends CSR to outsourced workers." },
      ],
      conclusion: "CSR in HRM benefits employees and the business through engagement, retention and reputation.",
    },
  },
  {
    id: "ext-ops-2",
    topic: "operations",
    area: "ops-influences",
    verb: "Analyse",
    question: "Analyse the impact of globalisation on operations strategy.",
    keyTerms: ["globalisation", "global sourcing", "economies of scale", "scanning and learning", "research and development", "outsourcing", "supply chain", "cost-based competition"],
    suggestedStrategies: ["Global sourcing", "Economies of scale", "Outsourcing", "Supply chain management", "Scanning and learning"],
    suggestedCases: ["toyota", "kmart", "apple", "zara"],
    plan: {
      thesis: "Globalisation creates opportunities to lower costs and access ideas, but intensifies cost-based competition and supply chain risk, reshaping operations strategy.",
      paragraphs: [
        { point: "Global sourcing and outsourcing", explanation: "Access to lower-cost inputs and specialist manufacturers.", application: "Kmart direct global sourcing; Apple contract manufacturing.", evaluation: "Lower costs; exchange-rate, quality and CSR risks." },
        { point: "Cost-based competition", explanation: "Global competitors force cost reductions or exit.", application: "Toyota ended Australian manufacturing (2017).", evaluation: "Some local operations become unviable." },
        { point: "Scanning and learning / speed", explanation: "Adopting global best practice; responsiveness.", application: "Zara proximity sourcing for speed.", evaluation: "Shows global strategy can trade cost for speed." },
      ],
      conclusion: "Globalisation's impact depends on whether a business can turn global scale and sourcing into advantage while managing risk.",
    },
  },
  {
    id: "ext-mkt-2",
    topic: "marketing",
    area: "mkt-influences",
    verb: "Discuss",
    question: "Discuss the influence of consumer laws and ethics on marketing strategies.",
    keyTerms: ["Australian Consumer Law", "misleading and deceptive", "consumer guarantees", "warranties", "price discrimination", "ethics", "truth in advertising", "sugging", "reputation"],
    suggestedStrategies: ["Promotion", "Pricing", "Branding"],
    suggestedCases: ["qantas-accc", "woolworths", "patagonia"],
    plan: {
      thesis: "Consumer law constrains marketing by setting enforceable minimum standards, while ethics shapes long-term trust — both influence strategy positively and negatively.",
      paragraphs: [
        { point: "Misleading and deceptive conduct", explanation: "ACL s 18/s 29; large penalties.", application: "Qantas $100m penalty (2024).", evaluation: "Strong deterrent — compliance protects profitability." },
        { point: "Pricing claims and consumer guarantees", explanation: "Accuracy of 'was/now' claims; guarantees can't be excluded.", application: "ACCC 2024 proceedings against Woolworths (ongoing — outcome to verify).", evaluation: "Increases compliance costs; builds trust." },
        { point: "Ethics beyond the law", explanation: "Truth, taste, health, sugging.", application: "Patagonia 'Don't Buy This Jacket' (2011).", evaluation: "Ethical positioning can be a source of differentiation." },
      ],
      conclusion: "On balance, law and ethics improve marketing effectiveness by building trust, though they limit some short-term tactics.",
    },
  },
  {
    id: "ext-fin-2",
    topic: "finance",
    area: "fin-influences",
    verb: "Discuss",
    question: "Discuss the advantages and disadvantages of debt and equity finance for a business seeking to expand.",
    keyTerms: ["debt finance", "equity finance", "gearing", "debt to equity ratio", "interest", "dilution", "placement", "share purchase plan", "matching", "solvency"],
    suggestedStrategies: ["Long-term borrowing", "Ordinary shares (placements, rights issues, SPPs)", "Private equity", "Leasing"],
    suggestedCases: ["qantas-capital-2020"],
    plan: {
      thesis: "Debt suits businesses with low gearing and stable cash flows; equity suits riskier or highly geared businesses — the right choice depends on risk, control and cost.",
      paragraphs: [
        { point: "Debt advantages/disadvantages", explanation: "No dilution; tax-deductible interest vs repayments and risk.", application: "Hypothetical expansion with D/E 0.4 : 1.", evaluation: "Effective when returns exceed interest cost." },
        { point: "Equity advantages/disadvantages", explanation: "No repayments, lower risk vs dilution and cost of issue.", application: "Qantas 2020 placement + SPP.", evaluation: "Effective when debt would threaten solvency." },
        { point: "Matching and influences", explanation: "Terms, interest rates, economic outlook.", application: "Rising interest rates 2022–23.", evaluation: "External influences change the balance." },
      ],
      conclusion: "Most businesses use a mix, monitoring gearing to balance return and risk.",
    },
  },
];

import type { TopicContent } from "../types";

export const finance: TopicContent = {
  id: "finance",
  number: 3,
  name: "Finance",
  short: "Fin",
  focus: "The focus of this topic is the role of interpreting financial information in the planning and management of a business.",
  summary:
    "Financial management is the planning and monitoring of a business's financial resources to achieve its financial objectives — profitability, growth, efficiency, liquidity and solvency. Managers choose appropriate sources of finance, plan with budgets, monitor results with financial statements and ratios, and apply strategies for cash flow, working capital, profitability and global financial risk.",
  goals: [
    "Explain the strategic role of financial management and the five financial objectives.",
    "Compare internal and external, debt and equity sources of finance and the role of financial institutions.",
    "Interpret the income statement, balance sheet and cash flow statement.",
    "Calculate, interpret and compare the syllabus financial ratios — and recognise their limitations.",
    "Evaluate cash flow, working capital, profitability and global financial management strategies.",
  ],
  outcomes: ["H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9", "H10"],
  indicativeTime: "25% of HSC course time",
  syllabus: [
    {
      id: "fin-role",
      title: "Role of financial management",
      learnAbout: [
        { id: "fin-role-strategic", text: "strategic role of financial management", link: { section: "concepts", anchor: "fin-strategic-role" } },
        {
          id: "fin-role-objectives",
          text: "objectives of financial management — profitability, growth, efficiency, liquidity, solvency; short-term and long-term",
          link: { section: "concepts", anchor: "fin-objectives" },
        },
        { id: "fin-role-interdependence", text: "interdependence with other key business functions", link: { section: "concepts", anchor: "fin-interdependence" } },
      ],
    },
    {
      id: "fin-influences",
      title: "Influences on financial management",
      learnAbout: [
        { id: "fin-inf-internal", text: "internal sources of finance — retained profits", link: { section: "influences", anchor: "fin-internal" } },
        {
          id: "fin-inf-external",
          text: "external sources of finance",
          link: { section: "influences", anchor: "fin-external" },
          children: [
            { id: "fin-inf-debt-short", text: "debt — short-term borrowing (overdraft, commercial bills, factoring)", link: { section: "influences", anchor: "fin-debt-short" } },
            { id: "fin-inf-debt-long", text: "debt — long-term borrowing (mortgage, debentures, unsecured notes, leasing)", link: { section: "influences", anchor: "fin-debt-long" } },
            { id: "fin-inf-equity", text: "equity — ordinary shares (new issues, rights issues, placements, share purchase plans), private equity", link: { section: "influences", anchor: "fin-equity" } },
          ],
        },
        {
          id: "fin-inf-institutions",
          text: "financial institutions — banks, investment banks, finance and life insurance companies, superannuation funds, unit trusts and the Australian Securities Exchange",
          link: { section: "influences", anchor: "fin-institutions" },
        },
        { id: "fin-inf-gov", text: "influence of government — Australian Securities and Investments Commission, company taxation", link: { section: "influences", anchor: "fin-inf-government" } },
        { id: "fin-inf-global", text: "global market influences — economic outlook, availability of funds, interest rates", link: { section: "influences", anchor: "fin-inf-global" } },
      ],
    },
    {
      id: "fin-processes",
      title: "Processes of financial management",
      learnAbout: [
        {
          id: "fin-proc-planning",
          text: "planning and implementing — financial needs, budgets, record systems, financial risks, financial controls",
          link: { section: "processes", anchor: "fin-planning" },
          children: [
            { id: "fin-proc-debt-equity", text: "debt and equity financing — advantages and disadvantages of each", link: { section: "processes", anchor: "fin-debt-vs-equity" } },
            { id: "fin-proc-matching", text: "matching the terms and source of finance to business purpose", link: { section: "processes", anchor: "fin-matching" } },
          ],
        },
        { id: "fin-proc-monitoring", text: "monitoring and controlling — cash flow statement, income statement, balance sheet", link: { section: "processes", anchor: "fin-statements" } },
        {
          id: "fin-proc-ratios",
          text: "financial ratios",
          link: { section: "processes", anchor: "fin-ratios" },
          children: [
            { id: "fin-proc-liquidity", text: "liquidity — current ratio (current assets ÷ current liabilities)", link: { section: "processes", anchor: "fin-ratio-current" } },
            { id: "fin-proc-gearing", text: "gearing — debt to equity ratio (total liabilities ÷ total equity)", link: { section: "processes", anchor: "fin-ratio-de" } },
            {
              id: "fin-proc-profitability",
              text: "profitability — gross profit ratio (gross profit ÷ sales); net profit ratio (net profit ÷ sales); return on equity ratio (net profit ÷ total equity)",
              link: { section: "processes", anchor: "fin-ratio-profitability" },
            },
            {
              id: "fin-proc-efficiency",
              text: "efficiency — expense ratio (total expenses ÷ sales); accounts receivable turnover ratio (sales ÷ accounts receivable)",
              link: { section: "processes", anchor: "fin-ratio-efficiency" },
            },
            { id: "fin-proc-comparative", text: "comparative ratio analysis — over different time periods, against standards, with similar businesses", link: { section: "processes", anchor: "fin-comparative" } },
          ],
        },
        {
          id: "fin-proc-limitations",
          text: "limitations of financial reports — normalised earnings, capitalising expenses, valuing assets, timing issues, debt repayments, notes to the financial statements",
          link: { section: "processes", anchor: "fin-limitations" },
        },
        { id: "fin-proc-ethics", text: "ethical issues related to financial reports", link: { section: "processes", anchor: "fin-ethics" } },
      ],
    },
    {
      id: "fin-strategies",
      title: "Financial management strategies",
      learnAbout: [
        { id: "fin-str-cash", text: "cash flow management — cash flow statement, distribution of payments, discounts for early payment, factoring", link: { section: "strategies", anchor: "fin-str-cashflow" } },
        {
          id: "fin-str-wc",
          text: "working capital management — control of current assets (cash, receivables, inventories); control of current liabilities (payables, loans, overdrafts); strategies — leasing, sale and lease back",
          link: { section: "strategies", anchor: "fin-str-working-capital" },
        },
        {
          id: "fin-str-profit",
          text: "profitability management — cost controls (fixed and variable, cost centres, expense minimisation); revenue controls (marketing objectives)",
          link: { section: "strategies", anchor: "fin-str-profitability" },
        },
        {
          id: "fin-str-global",
          text: "global financial management — exchange rates, interest rates, methods of international payment (payment in advance, letter of credit, clean payment, bill of exchange), hedging, derivatives",
          link: { section: "strategies", anchor: "fin-str-global" },
        },
      ],
    },
  ],
  learnTo: [
    { id: "fin-lt-1", text: "examine contemporary business issues to: discuss the influence of government and the global market on financial management", link: { section: "influences", anchor: "fin-inf-global" } },
    { id: "fin-lt-2", text: "examine contemporary business issues to: explain the importance of ethical financial reporting", link: { section: "processes", anchor: "fin-ethics" } },
    { id: "fin-lt-3", text: "investigate aspects of business using hypothetical situations and actual business case studies to: calculate, analyse and interpret financial ratios and financial statements, including comparative ratio analysis", link: { section: "processes", anchor: "fin-ratio-dashboard" } },
    { id: "fin-lt-4", text: "investigate aspects of business using hypothetical situations and actual business case studies to: recommend and evaluate financial management strategies appropriate to a business situation", link: { section: "strategies", anchor: "fin-statement-simulator" } },
  ],
  sections: {
    concepts: [
      {
        kind: "heading",
        id: "fin-role-heading",
        title: "Role of financial management",
        intro: "Every business decision has a financial consequence. Financial management makes sure the business has the right amount of funds, at the right time, from the right sources — and uses them well.",
      },
      {
        kind: "concepts",
        items: [
          {
            id: "fin-strategic-role",
            term: "Strategic role of financial management",
            definition: "Planning and monitoring a business's financial resources so that it can achieve its long-term goals and financial objectives.",
            explanation: "Financial managers decide how much finance is needed, where it should come from (debt or equity), how it should be allocated between competing uses, and monitor results through financial statements and ratios. Sound financial decisions support growth, profitability and survival.",
            simple: "Finance is about getting money, spending it wisely and checking how well it's working.",
            advanced: "Strategic financial decisions are long-term (e.g. capital structure, major investments) and affect risk. Link them to the whole business: e.g. the decision to borrow for new technology affects operations efficiency, HR (retraining) and marketing (lower prices).",
          },
          {
            id: "fin-decision-making",
            term: "Financial decision-making and allocation of resources",
            definition: "Choosing between alternative uses of limited funds based on their expected return and risk.",
            explanation: "Funds are allocated through budgets to departments and projects. Priorities depend on objectives — e.g. a business focused on liquidity will keep more cash; one focused on growth will invest more.",
          },
        ],
      },
      { kind: "heading", id: "fin-objectives", title: "Objectives of financial management", intro: "The five financial objectives guide financial decisions. They can conflict, so businesses must balance them." },
      { kind: "visual", id: "fin-objectives-visual", visual: "fin-objectives", title: "Financial objectives diagram", caption: "Select an objective to see what it means, how it is measured and which objectives it conflicts with." },
      {
        kind: "concepts",
        items: [
          { id: "fin-obj-profitability", term: "Profitability", definition: "The ability of a business to maximise its profits.", explanation: "Measured by the gross profit, net profit and return on equity ratios. Profit is needed to reward owners and fund growth." },
          { id: "fin-obj-growth", term: "Growth", definition: "The ability of a business to increase its size in the longer term.", explanation: "Shown by increases in sales, assets, market share, profit and the number of employees or locations. Growth depends on using assets to generate sales and reinvesting profits." },
          { id: "fin-obj-efficiency", term: "Efficiency", definition: "The ability of a business to minimise its costs and manage its assets so that maximum profit is achieved with the lowest possible level of assets.", explanation: "Measured by the expense ratio and accounts receivable turnover ratio." },
          { id: "fin-obj-liquidity", term: "Liquidity", definition: "The extent to which a business can meet its short-term financial commitments (usually within 12 months).", explanation: "Measured by the current ratio. A business can be profitable yet fail through lack of liquidity." },
          { id: "fin-obj-solvency", term: "Solvency", definition: "The extent to which a business can meet its financial commitments in the longer term.", explanation: "Measured by the debt to equity (gearing) ratio. It shows the risk of the business's capital structure." },
          {
            id: "fin-short-long",
            term: "Short-term and long-term objectives",
            definition: "Short-term (tactical/operational) objectives are set for periods of up to about 12 months; long-term (strategic) objectives cover several years.",
            explanation: "Short-term objectives (e.g. maintain a current ratio of 1.5 : 1, reduce the expense ratio this year) support long-term objectives (e.g. grow market share by expanding interstate over five years).",
          },
          {
            id: "fin-conflicts",
            term: "Conflicts between financial objectives",
            definition: "Situations where pursuing one objective makes another harder to achieve.",
            explanation: "Liquidity vs profitability: holding more cash improves liquidity but idle cash earns little. Growth vs liquidity/solvency: expansion often uses cash and debt. Short-term profitability vs long-term growth: cutting R&D or training raises this year's profit but harms future growth.",
            advanced: "A strong HSC answer gives a specific conflict, explains why it arises and recommends how the business could balance it (e.g. finance expansion with a mix of retained profits and long-term debt to protect liquidity).",
          },
        ],
      },
      { kind: "heading", id: "fin-interdependence", title: "Interdependence with other key business functions" },
      { kind: "visual", id: "fin-interdependence-map", visual: "interdependence-fin", title: "Finance interdependence map", caption: "Select a connection to see how Finance links to each function." },
      {
        kind: "concepts",
        items: [
          { id: "fin-int-ops", term: "Finance and Operations", definition: "Finance funds equipment, materials, inventory and technology; operations efficiency determines costs and profitability.", explanation: "Inventory decisions affect working capital and liquidity." },
          { id: "fin-int-mkt", term: "Finance and Marketing", definition: "Finance sets marketing budgets and forecasts; marketing generates sales revenue.", explanation: "Revenue controls in profitability management depend on achieving marketing objectives." },
          { id: "fin-int-hr", term: "Finance and Human Resources", definition: "Finance budgets for wages, recruitment, training and rewards; HR decisions are often a business's largest expense.", explanation: "Redundancy payments, wage increases and training must be planned and funded." },
        ],
      },
    ],
    influences: [
      {
        kind: "heading",
        id: "fin-sources",
        title: "Sources of finance",
        intro: "Finance comes from inside the business (internal) or from outside (external). External finance is either debt (borrowed, must be repaid with interest) or equity (owners' funds).",
      },
      { kind: "visual", id: "fin-internal-external-visual", visual: "fin-internal-external", title: "Internal versus external finance flowchart", caption: "Select a source to see its type, term, cost and suitable uses." },
      {
        kind: "concepts",
        items: [
          {
            id: "fin-internal",
            term: "Internal source of finance — retained profits",
            definition: "Profits kept in the business rather than distributed to owners as dividends or drawings.",
            explanation: "Retained profits are the cheapest and most accessible source: no interest, no repayments, no loss of control. However, they are limited in amount and owners receive lower dividends.",
          },
          {
            id: "fin-external",
            term: "External sources of finance",
            definition: "Funds obtained from outside the business — from lenders (debt) or new or existing owners (equity).",
          },
        ],
      },
      {
        kind: "heading",
        id: "fin-debt-short",
        title: "Debt finance — short-term borrowing",
        intro: "Short-term debt is repaid within about 12 months and is used for working capital needs.",
      },
      {
        kind: "concepts",
        items: [
          { id: "fin-overdraft", term: "Overdraft", definition: "A bank arrangement allowing a business to withdraw more than the balance of its account, up to an agreed limit.", explanation: "Flexible and quick for short-term cash shortfalls. Interest is charged only on the amount overdrawn, but rates are relatively high and the bank can reduce the limit." },
          { id: "fin-commercial-bills", term: "Commercial bills", definition: "Short-term loans (usually 30–180 days) issued by a financial institution, often for amounts of $100,000 or more, repaid in full at the end of the term.", explanation: "Used for larger short-term needs; typically secured against business assets." },
          { id: "fin-factoring", term: "Factoring", definition: "Selling accounts receivable to a factoring company (a 'factor') at a discount in exchange for immediate cash.", explanation: "Improves cash flow immediately and the factor may handle collection, but the business receives less than the full value of its receivables. Customers may view it negatively." },
        ],
      },
      {
        kind: "heading",
        id: "fin-debt-long",
        title: "Debt finance — long-term borrowing",
        intro: "Long-term debt is repaid over more than 12 months and funds non-current assets and expansion.",
      },
      {
        kind: "concepts",
        items: [
          { id: "fin-mortgage", term: "Mortgage", definition: "A long-term loan secured by property (land and buildings), repaid with interest over a set period.", explanation: "Lower interest than unsecured loans because of the security; the lender can sell the property if repayments are not made." },
          { id: "fin-debentures", term: "Debentures", definition: "Securities issued by a company to investors for a fixed rate of interest over a fixed period, secured against the company's assets.", explanation: "Raise large amounts from the public; holders rank ahead of unsecured creditors and shareholders if the company fails." },
          { id: "fin-unsecured-notes", term: "Unsecured notes", definition: "Loans from investors for a set period that are not backed by security over assets.", explanation: "Because they are riskier for investors, they pay a higher interest rate than debentures." },
          { id: "fin-leasing", term: "Leasing", definition: "Paying for the use of an asset owned by another party (the lessor) for a period of time, without buying it.", explanation: "Conserves cash and avoids large capital outlays; lease payments are generally tax deductible. Over time the total cost can exceed the purchase price, and the business does not own the asset at the end (unless the agreement provides for it)." },
        ],
      },
      {
        kind: "heading",
        id: "fin-equity",
        title: "Equity finance",
        intro: "Equity finance is provided by the owners. It does not need to be repaid and has no interest, but owners expect a return (dividends and growth) and new owners dilute control.",
      },
      {
        kind: "concepts",
        items: [
          { id: "fin-ordinary-shares", term: "Ordinary shares", definition: "Units of ownership in a company; shareholders are entitled to dividends (if declared) and to vote at general meetings.", explanation: "Issued through the Australian Securities Exchange (ASX) for listed public companies." },
          { id: "fin-new-issue", term: "New issue", definition: "A security issued to the market for the first time, for example through an initial public offering (IPO) supported by a prospectus.", explanation: "Raises large amounts but is expensive (underwriting, legal, prospectus costs) and must comply with Corporations Act and ASIC requirements." },
          { id: "fin-rights-issue", term: "Rights issue", definition: "An offer of new shares to existing shareholders in proportion to their current holdings, usually at a discount.", explanation: "Raises capital without diluting the ownership proportions of shareholders who take up their rights." },
          { id: "fin-placement", term: "Placement", definition: "Selling new shares directly to selected (usually institutional) investors without a prospectus.", explanation: "Fast and cheap, but dilutes existing shareholders who are not offered shares. ASX Listing Rules limit the size of placements without shareholder approval." },
          { id: "fin-spp", term: "Share purchase plan (SPP)", definition: "An offer to existing shareholders to buy a limited dollar amount of additional shares, usually at a discount and without brokerage.", explanation: "Often used alongside a placement so retail shareholders can also participate." },
          { id: "fin-private-equity", term: "Private equity", definition: "Money invested in a company that is not listed on a stock exchange, by private investors or private equity funds.", explanation: "Provides capital and expertise for expansion or restructuring; investors usually seek significant control and a high return, often within several years." },
        ],
      },
      { kind: "visual", id: "fin-debt-equity-tree", visual: "fin-debt-equity", title: "Debt versus equity — decision tree", caption: "Answer the questions to see whether debt or equity finance better suits a situation." },
      {
        kind: "heading",
        id: "fin-institutions",
        title: "Financial institutions",
        intro: "Financial institutions channel funds from savers and investors to businesses that need them.",
      },
      {
        kind: "comparison",
        table: {
          id: "fin-institutions-table",
          title: "Financial institutions comparison",
          columns: ["Institution", "Main role", "Finance provided to business"],
          rows: [
            { label: "Banks", cells: ["Accept deposits and lend money; the largest source of business funds in Australia", "Overdrafts, commercial bills, term loans, mortgages, leasing, international trade finance"] },
            { label: "Investment banks", cells: ["Arrange large financing deals and provide advice; do not take ordinary retail deposits", "Advice on mergers and acquisitions, underwriting share issues, arranging large loans and hedging"] },
            { label: "Finance companies", cells: ["Non-bank lenders raising funds from debentures and lending to businesses and consumers", "Equipment finance, leasing, factoring, smaller and riskier loans (often at higher interest rates)"] },
            { label: "Life insurance companies", cells: ["Collect premiums and invest them to pay future claims", "Long-term loans and equity investment in companies"] },
            { label: "Superannuation funds", cells: ["Invest compulsory and voluntary retirement savings", "Major investors in shares, property and infrastructure — a large source of equity finance"] },
            { label: "Unit trusts", cells: ["Pool investors' funds into units managed by a fund manager", "Invest in shares, property, mortgages and other securities"] },
            { label: "Australian Securities Exchange (ASX)", cells: ["Australia's primary securities exchange: the market where shares and other securities are issued and traded", "Enables companies to raise equity through new issues, rights issues and placements; provides liquidity for investors"] },
          ],
        },
      },
      {
        kind: "heading",
        id: "fin-gov-global",
        title: "Government and global market influences",
      },
      {
        kind: "influences",
        items: [
          {
            id: "fin-inf-government",
            name: "Influence of government — ASIC and company taxation",
            meaning: "ASIC (Australian Securities and Investments Commission) regulates companies, financial markets and financial services under the Corporations Act 2001 (Cth). Company taxation is the tax on company profits.",
            effect: "ASIC requires companies to keep proper financial records and large entities to lodge audited financial reports, enforces directors' duties and disclosure rules, and protects investors. Company tax reduces profit available for dividends and retained profits.",
            positive: ["ASIC regulation builds investor confidence, making it easier to raise funds.", "Lower company tax for smaller businesses leaves more profit for reinvestment."],
            negative: ["Compliance costs (audits, reporting, legal advice).", "Tax reduces funds available for growth."],
            responses: ["Accurate, timely reporting and strong governance.", "Legal tax planning (e.g. timing of deductions)."],
            example: "The company tax rate is 30%, or 25% for base rate entities (generally aggregated turnover below $50 million with no more than 80% passive income) — ATO. Penalties apply when directors breach their duties.",
          },
          {
            id: "fin-inf-global",
            name: "Global market influences",
            meaning: "Conditions in the world economy and financial markets that affect Australian businesses' access to and cost of finance.",
            effect: "The global economic outlook affects demand and profits; the availability of funds depends on global lending conditions; interest rates (influenced by central banks and global markets) determine the cost of borrowing.",
            positive: ["A strong global outlook raises demand and investor willingness to lend and invest.", "Low global interest rates reduce the cost of debt."],
            negative: ["A global downturn reduces sales and makes lenders cautious (credit becomes scarce).", "Rising interest rates increase debt costs and reduce profitability."],
            responses: ["Match finance to purpose and lock in fixed rates when rates are expected to rise.", "Maintain liquidity buffers and reduce gearing in uncertain times.", "Hedge interest-rate and currency risk."],
            example: "During the 2008 global financial crisis, global credit tightened and many Australian companies raised equity to reduce debt. In 2022–23 the Reserve Bank of Australia raised the cash rate sharply, increasing business borrowing costs.",
            advanced: "For 'discuss the influence of government and the global market', present both positive and negative effects and link each to a specific financial objective (e.g. rising rates threaten solvency and profitability).",
          },
        ],
      },
    ],
    processes: [
      {
        kind: "heading",
        id: "fin-planning",
        title: "Planning and implementing",
        intro: "Financial planning determines how much money the business needs, when and from where — and sets up the systems to control it.",
      },
      {
        kind: "concepts",
        items: [
          { id: "fin-needs", term: "Financial needs", definition: "The amount and timing of funds the business requires to operate and achieve its objectives.", explanation: "Determined by the size of the business, its stage of growth, current financial position and plans (e.g. new equipment, expansion). A business plan and cash flow forecasts identify needs." },
          { id: "fin-budgets", term: "Budgets", definition: "Financial plans that express expected income and expenditure in figures for a future period.", explanation: "Operating budgets (sales, production, expenses), project budgets (capital expenditure) and financial budgets (cash flow budget, budgeted income statement and balance sheet). Budgets set targets and allow comparison of actual with planned results." },
          { id: "fin-records", term: "Record systems", definition: "The systems that collect and store accurate financial information.", explanation: "Accurate records (e.g. accounting software, double-entry bookkeeping) are needed to prepare reports, meet ASIC and ATO requirements, and support decisions." },
          { id: "fin-risks", term: "Financial risks", definition: "The risk that a business cannot meet its financial commitments.", explanation: "Higher borrowing increases financial risk because interest and repayments must be paid regardless of profit. Risks must be weighed against expected returns." },
          { id: "fin-controls", term: "Financial controls", definition: "Policies and procedures that protect assets and ensure accurate records — preventing theft, fraud and errors.", explanation: "Examples: clear lines of authority, separation of duties, rotation of duties, protection of assets (security, insurance), control of cash (two signatories), control of credit procedures." },
        ],
      },
      { kind: "heading", id: "fin-debt-vs-equity", title: "Debt and equity financing — advantages and disadvantages" },
      {
        kind: "comparison",
        table: {
          id: "fin-debt-equity-table",
          title: "Debt versus equity finance",
          columns: ["", "Debt finance", "Equity finance"],
          rows: [
            { label: "Meaning", cells: ["Funds borrowed from external lenders", "Funds provided by the owners"] },
            { label: "Repayment", cells: ["Must be repaid with interest by a set date", "Not repaid while the business continues"] },
            { label: "Cost", cells: ["Interest (generally tax deductible)", "Dividends expected; no interest"] },
            { label: "Control", cells: ["No loss of ownership control", "New owners dilute control and profit share"] },
            { label: "Risk", cells: ["Increases gearing and financial risk — repayments due even in bad times", "Lower financial risk; owners bear the risk"] },
            { label: "Availability", cells: ["Readily available for businesses with security and good credit", "Limited by owners' funds or investor interest; share issues are costly"] },
            { label: "Ratio affected", cells: ["Raises the debt to equity ratio", "Lowers the debt to equity ratio"] },
          ],
        },
      },
      {
        kind: "concepts",
        items: [
          {
            id: "fin-matching",
            term: "Matching the terms and source of finance to business purpose",
            definition: "Using short-term finance for short-term needs and long-term finance for long-term assets.",
            explanation: "Working capital needs (stock, wages) should be funded by short-term sources such as an overdraft or trade credit; non-current assets (buildings, major equipment) by long-term sources such as mortgages, debentures, leasing or equity. Mismatching — e.g. buying a factory with an overdraft — risks a liquidity crisis when the short-term debt falls due.",
          },
        ],
      },
      {
        kind: "heading",
        id: "fin-statements",
        title: "Monitoring and controlling: the financial statements",
        intro: "Three statements are used to monitor financial performance and position. Each answers a different question.",
      },
      { kind: "visual", id: "fin-statements-relationship", visual: "fin-relationship", title: "Financial statements relationship diagram", caption: "How the income statement, balance sheet and cash flow statement connect." },
      {
        kind: "concepts",
        items: [
          {
            id: "fin-income-statement",
            term: "Income statement",
            definition: "A statement showing the revenue earned and expenses incurred over a period, and the resulting profit or loss.",
            explanation: "Structure: Sales − Cost of goods sold = Gross profit; Gross profit − Expenses = Net profit. It measures profitability over a period of time.",
          },
          {
            id: "fin-balance-sheet",
            term: "Balance sheet",
            definition: "A statement of the assets, liabilities and owners' equity of a business at a particular point in time.",
            explanation: "Based on the accounting equation: Assets = Liabilities + Owners' equity. Assets and liabilities are classified as current (within 12 months) or non-current. It shows liquidity and solvency.",
          },
          {
            id: "fin-cash-flow-statement",
            term: "Cash flow statement",
            definition: "A statement showing the movement of cash into and out of a business over a period, classified as operating, investing and financing activities.",
            explanation: "Operating: day-to-day trading (receipts from customers, payments to suppliers and employees). Investing: buying and selling non-current assets. Financing: borrowing, repaying loans, issuing shares, paying dividends. It shows whether the business can pay its debts as they fall due.",
            advanced: "Profit ≠ cash. A profitable business can run out of cash (e.g. sales on credit not yet collected, cash spent on inventory or equipment).",
          },
        ],
      },
      { kind: "visual", id: "fin-income-visual", visual: "fin-income", title: "Income statement visual breakdown", caption: "Edit the figures to see sales flow down to net profit." },
      { kind: "visual", id: "fin-balance-visual", visual: "fin-balance", title: "Balance sheet structure", caption: "Assets must equal liabilities plus owners' equity." },
      { kind: "visual", id: "fin-cashflow-visual", visual: "fin-cashflow", title: "Interactive cash flow statement", caption: "Change cash inflows and outflows to see net cash flow and closing cash by activity." },
      {
        kind: "heading",
        id: "fin-ratios",
        title: "Financial ratios",
        intro: "Ratios express relationships between figures in the financial statements, making it possible to compare performance over time and with other businesses. In the HSC examination, questions that require a ratio calculation provide the relevant formula — the skill being assessed is applying, interpreting and analysing it.",
      },
      {
        kind: "concepts",
        items: [
          {
            id: "fin-ratio-current",
            term: "Liquidity — current ratio",
            definition: "Current ratio = current assets ÷ current liabilities. Expressed as a ratio, e.g. 1.6 : 1.",
            explanation: "Shows whether the business can meet its short-term debts. Textbooks commonly cite about 1.5–2 : 1 as sound, but the right level depends on the industry. Below 1 : 1 suggests liquidity problems; very high ratios may mean idle resources.",
          },
          {
            id: "fin-ratio-de",
            term: "Gearing — debt to equity ratio",
            definition: "Debt to equity ratio = total liabilities ÷ total equity. Expressed as a ratio, e.g. 0.8 : 1.",
            explanation: "Shows the extent to which the business relies on debt rather than owners' funds — a measure of solvency. A high ratio means higher financial risk; textbooks commonly treat below 1 : 1 as lower risk.",
          },
          {
            id: "fin-ratio-profitability",
            term: "Profitability ratios",
            definition: "Gross profit ratio = gross profit ÷ sales; net profit ratio = net profit ÷ sales; return on equity = net profit ÷ total equity. Usually expressed as percentages.",
            explanation: "The gross profit ratio shows the margin earned on goods sold; the net profit ratio shows profit after all expenses; return on equity shows the return to owners on their investment. Compare with past results and industry averages — margins vary greatly between industries.",
          },
          {
            id: "fin-ratio-efficiency",
            term: "Efficiency ratios",
            definition: "Expense ratio = total expenses ÷ sales (as a %); accounts receivable turnover ratio = sales ÷ accounts receivable (times per year).",
            explanation: "The expense ratio shows how much of each sales dollar is used up by expenses — lower is more efficient. The accounts receivable turnover ratio shows how quickly credit customers pay; 365 ÷ the ratio gives the average collection period in days, which can be compared with credit terms.",
            advanced: "If an exam question supplies a figure for 'total expenses', use it exactly as given. Some textbooks include cost of goods sold in total expenses and others use operating expenses only — follow the data and formula provided.",
          },
        ],
      },
      { kind: "visual", id: "fin-ratio-dashboard", visual: "fin-ratio-dashboard", title: "Financial ratio dashboard", caption: "Two years of illustrative data for a fictional business — compare ratios over time and against an industry average." },
      { kind: "comparison", table: { id: "fin-liq-vs-solv", title: "Liquidity versus solvency", columns: ["", "Liquidity", "Solvency"], rows: [
        { label: "Question answered", cells: ["Can the business pay its debts in the SHORT term (≤ 12 months)?", "Can the business meet its debts in the LONG term? How risky is its capital structure?"] },
        { label: "Ratio", cells: ["Current ratio = current assets ÷ current liabilities", "Debt to equity ratio = total liabilities ÷ total equity"] },
        { label: "Statement", cells: ["Balance sheet (current section)", "Balance sheet (total liabilities and equity)"] },
        { label: "Warning sign", cells: ["Current ratio below 1 : 1; relying on overdraft", "Debt to equity rising above 1 : 1 and trending up"] },
        { label: "Strategies", cells: ["Working capital management: collect receivables faster, reduce excess stock, factoring, sale and leaseback", "Reduce debt with retained profits; raise equity; avoid funding long-term assets with short-term debt"] },
      ] } },
      {
        kind: "concepts",
        items: [
          {
            id: "fin-comparative",
            term: "Comparative ratio analysis",
            definition: "Comparing ratios over different time periods, against standards, and with similar businesses to give them meaning.",
            explanation: "A single ratio means little on its own. Trends over time show improvement or deterioration; standards (budgets, targets, industry benchmarks) show whether performance is acceptable; comparison with similar businesses (same industry and size) shows competitiveness.",
            advanced: "Strengths: simple, comparable, highlights problems early. Limitations: based on historical data; businesses may use different accounting methods; industry averages hide differences; ratios show symptoms, not causes.",
          },
          {
            id: "fin-limitations",
            term: "Limitations of financial reports",
            definition: "Reasons why financial reports may not give a complete or accurate picture of a business.",
            explanation: "Normalised earnings: removing one-off or abnormal items (e.g. sale of a property) to show ongoing profit — but judgement is involved and can be manipulated. Capitalising expenses: recording an expense (e.g. R&D) as an asset, which increases reported profit and assets. Valuing assets: assets may be recorded at historical cost or revalued; intangibles like goodwill are hard to value. Timing issues: transactions recorded in a period may not reflect when cash moved; one-off events distort comparisons. Debt repayments: the balance sheet may not show how soon debts must be repaid or the business's capacity to repay. Notes to the financial statements: important details are in the notes, which are complex and often overlooked.",
          },
          {
            id: "fin-ethics",
            term: "Ethical issues related to financial reports",
            definition: "Issues of honesty, accuracy and transparency in the preparation and presentation of financial information.",
            explanation: "Unethical practices include manipulating figures (e.g. inappropriate capitalising of expenses), recording sales in the wrong period, inflating asset values and hiding debts. Audits (independent checks of financial reports), ASIC enforcement and directors' duties under the Corporations Act 2001 promote ethical reporting. Accurate reports matter because investors, lenders, employees and the ATO rely on them.",
          },
        ],
      },
      { kind: "visual", id: "fin-profitability-graph", visual: "fin-profitability", title: "Profitability analysis graph", caption: "Compare gross profit ratio, net profit ratio and ROE over five illustrative years." },
    ],
    strategies: [
      {
        kind: "heading",
        id: "fin-strategies-heading",
        title: "Financial management strategies",
        intro: "Strategies manage cash flow, working capital, profitability and global financial risk. The right mix depends on the business's financial objectives and its current position revealed by ratio analysis.",
      },
      {
        kind: "strategies",
        items: [
          {
            id: "fin-str-cashflow",
            name: "Cash flow management",
            definition: "Strategies to ensure a business has enough cash to meet its commitments as they fall due.",
            how: "Use cash flow statements and projections to anticipate shortfalls. Distribution of payments: spread payments evenly over the year so large bills do not fall in the same month. Discounts for early payment: offer customers a discount (e.g. 2% if paid within 7 days) to speed up cash inflows. Factoring: sell receivables for immediate cash.",
            advantages: ["Prevents liquidity crises and the cost of emergency borrowing.", "Discounts and factoring speed up cash inflows.", "Spreading payments smooths cash outflows."],
            disadvantages: ["Discounts and factoring reduce the revenue actually received.", "Projections are only as accurate as their assumptions."],
            application: "Essential for seasonal businesses and those selling on credit.",
            effectiveness: "Effective when cash flow projections are updated regularly and strategies are combined with good credit control.",
          },
          {
            id: "fin-str-working-capital",
            name: "Working capital management",
            definition: "Managing current assets and current liabilities to ensure the business has enough liquidity while not holding excess idle resources. Working capital = current assets − current liabilities.",
            how: "Control of current assets: cash (keep enough for needs, invest surplus), receivables (credit checks, prompt invoicing, follow-up), inventories (avoid excess stock — e.g. JIT). Control of current liabilities: payables (use trade credit fully but pay on time to keep discounts and reputation), loans (match terms; refinance), overdrafts (use as a short-term buffer only). Strategies: leasing (use assets without large cash outlays) and sale and lease back (sell an asset such as a building and lease it back, releasing cash).",
            advantages: ["Improves liquidity and reduces reliance on borrowing.", "Sale and leaseback releases large amounts of cash quickly.", "Leasing conserves capital for core activities."],
            disadvantages: ["Too little inventory or tight credit may lose sales.", "Sale and leaseback means ongoing lease payments and loss of the asset's capital growth."],
            application: "Used when the current ratio is low or falling, or when cash is tied up in receivables and inventory.",
            effectiveness: "Effective when the business balances liquidity with profitability — excessive working capital is also inefficient.",
          },
        ],
      },
      { kind: "visual", id: "fin-working-capital-flow", visual: "fin-working-capital", title: "Working capital management flowchart", caption: "Diagnose a working capital problem and select strategies." },
      {
        kind: "strategies",
        items: [
          {
            id: "fin-str-profitability",
            name: "Profitability management",
            definition: "Controlling costs and revenue to improve profit.",
            how: "Cost controls: fixed costs (do not change with output, e.g. rent, salaries — renegotiate contracts) and variable costs (change with output, e.g. materials — global sourcing, reducing waste); cost centres (sections of the business to which costs are allocated so managers are accountable); expense minimisation (policies to reduce expenses, e.g. energy use, travel, administration). Revenue controls: marketing objectives — the right sales mix, pricing and sales volume to maximise revenue and margins.",
            advantages: ["Directly increases gross and net profit ratios.", "Cost centres improve accountability.", "Revenue controls align marketing with financial objectives."],
            disadvantages: ["Excessive cost-cutting can reduce quality, morale and long-term growth.", "Revenue strategies (e.g. price cuts) may reduce margins."],
            application: "Used when profitability ratios are falling or below industry averages.",
            effectiveness: "Most effective when cost controls target waste rather than value-adding activities, and revenue controls are supported by marketing research.",
          },
        ],
      },
      { kind: "visual", id: "fin-rev-exp-chart", visual: "fin-rev-exp", title: "Revenue, expenses and profit — interactive chart", caption: "Adjust price, volume, fixed and variable costs to see the effect on profit." },
      {
        kind: "strategies",
        items: [
          {
            id: "fin-str-global",
            name: "Global financial management",
            definition: "Managing the financial risks and opportunities of international trade and investment.",
            how: "Exchange rates: movements change the AUD value of foreign costs and revenues. Interest rates: global rates affect the cost of borrowing overseas. Methods of international payment: payment in advance (exporter receives payment before goods are sent — lowest risk for exporter), letter of credit (importer's bank guarantees payment once documents proving shipment are presented), clean payment (exporter ships and invoices; importer pays later — highest risk for exporter, used between trusted parties), bill of exchange (a document demanding the importer pay a set amount at a set time, through banks; documents of title released on payment or acceptance). Hedging: strategies that reduce the risk of exchange-rate movements (e.g. natural hedging by matching foreign revenue and costs). Derivatives: financial instruments whose value is derived from an underlying asset — forward exchange contracts, options and swaps — used to manage currency and interest-rate risk.",
            advantages: ["Protects profit margins from adverse currency movements.", "Payment methods reduce the risk of non-payment.", "Allows confident international expansion."],
            disadvantages: ["Hedging and derivatives cost money and may forgo gains from favourable movements.", "Secure payment methods (letters of credit) involve bank fees and paperwork."],
            application: "Essential for importers, exporters and businesses with overseas operations or debt.",
            effectiveness: "Effective when the level of hedging matches the business's exposure; over-hedging or speculation can create losses.",
          },
        ],
      },
      { kind: "visual", id: "fin-exchange-visual", visual: "fin-exchange", title: "Exchange rate effects on costs and revenues", caption: "Move the AUD/USD rate to see how an importer's costs and an exporter's revenue change." },
      { kind: "comparison", table: { id: "fin-payment-methods", title: "Methods of international payment — risk spectrum", caption: "Ordered from lowest to highest risk for the EXPORTER.", columns: ["Method", "How it works", "Risk to exporter", "Risk to importer"], rows: [
        { label: "Payment in advance", cells: ["Importer pays before goods are shipped", "Lowest", "Highest — may not receive goods"] },
        { label: "Letter of credit", cells: ["Importer's bank commits to pay the exporter when shipping documents meeting the terms are presented", "Low", "Low–moderate; bank fees"] },
        { label: "Bill of exchange", cells: ["Exporter's bank sends a bill and documents to the importer's bank; documents released when the importer pays (sight) or accepts the bill to pay later (term)", "Moderate", "Moderate"] },
        { label: "Clean payment", cells: ["Exporter ships goods and documents directly; importer pays later (open account)", "Highest", "Lowest"] },
      ] } },
      { kind: "visual", id: "fin-statement-simulator", visual: "fin-simulator", title: "Financial statement and performance simulator", caption: "Adjust the figures — statements and ratios update together and the balance sheet must balance." },
    ],
  },
  revision: {
    takeaways: [
      "Financial objectives: profitability, growth, efficiency, liquidity, solvency — they often conflict.",
      "Internal finance = retained profits; external = debt (must be repaid with interest) or equity (owners' funds).",
      "Match short-term finance to short-term needs and long-term finance to long-term assets.",
      "Income statement = performance over a period; balance sheet = position at a point in time; cash flow statement = movement of cash.",
      "Current ratio (liquidity) = CA ÷ CL; debt to equity (solvency) = TL ÷ TE.",
      "GP ratio = GP ÷ sales; NP ratio = NP ÷ sales; ROE = NP ÷ total equity.",
      "Expense ratio = total expenses ÷ sales; AR turnover = sales ÷ accounts receivable (365 ÷ ART = days).",
      "Ratios only have meaning when compared over time, against standards and with similar businesses.",
      "Financial reports have limitations: normalised earnings, capitalising expenses, valuing assets, timing, debt repayments, notes.",
      "Strategies: cash flow, working capital (incl. leasing, sale and leaseback), profitability and global (payment methods, hedging, derivatives).",
    ],
    thirtySecond:
      "Financial management plans, raises and monitors money to achieve profitability, growth, efficiency, liquidity and solvency. Businesses fund themselves with retained profits, debt (overdrafts, commercial bills, factoring, mortgages, debentures, unsecured notes, leasing) or equity (new issues, rights issues, placements, share purchase plans, private equity) through banks, investment banks, super funds, the ASX and others, regulated by ASIC and taxed by the ATO. They plan with budgets and controls, monitor with the income statement, balance sheet and cash flow statement, and analyse with the syllabus ratios — comparing over time, against standards and with similar firms, aware of reporting limitations. Strategies manage cash flow, working capital, profitability and global risk.",
    terms: ["fin-obj-liquidity", "fin-obj-solvency", "fin-factoring", "fin-debentures", "fin-rights-issue", "fin-placement", "fin-matching", "fin-cash-flow-statement", "fin-comparative", "fin-limitations"],
    formulas: ["current-ratio", "debt-to-equity", "gross-profit-ratio", "net-profit-ratio", "return-on-equity", "expense-ratio", "ar-turnover", "working-capital"],
    misconceptions: [
      { myth: "Profit and cash are the same thing.", fact: "Profit is revenue minus expenses; cash flow is actual money in and out. Credit sales and asset purchases create differences." },
      { myth: "Liquidity and solvency mean the same thing.", fact: "Liquidity is short-term (current ratio); solvency is long-term (debt to equity ratio)." },
      { myth: "A higher current ratio is always better.", fact: "Very high current ratios can mean idle cash or excess inventory — an inefficient use of resources." },
      { myth: "Equity finance is free.", fact: "There is no interest, but owners expect dividends and growth, and control is diluted." },
      { myth: "You must memorise every ratio formula for the HSC exam.", fact: "HSC questions requiring ratio calculations provide the formula; you need to apply and interpret it — though knowing them speeds you up." },
    ],
    examApplication: [
      "Show working in calculations: formula → substitution → answer with correct format (ratio, % or times).",
      "Interpret every ratio you calculate: what it shows, whether it is good or bad, and compared with what.",
      "Recommend a strategy that targets the weakness the ratio reveals (e.g. low current ratio → working capital strategies).",
      "In business reports, use the stimulus figures and note limitations of ratio analysis.",
    ],
  },
};

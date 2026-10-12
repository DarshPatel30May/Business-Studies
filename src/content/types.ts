// Shared content model. Educational content lives in /src/content as typed data;
// components in /src/components only render it.

export type TopicId = "operations" | "marketing" | "finance" | "hr";

export type SectionId =
  | "overview"
  | "syllabus"
  | "concepts"
  | "influences"
  | "processes"
  | "strategies"
  | "case-studies"
  | "revision";

/** A single syllabus dot point. `link` points to where it is taught on the site. */
export interface DotPoint {
  id: string;
  text: string;
  children?: DotPoint[];
  link?: { section: SectionId; anchor?: string };
}

export interface SyllabusArea {
  id: string;
  title: string;
  learnAbout: DotPoint[];
}

export interface Concept {
  id: string;
  term: string;
  definition: string;
  /** How / why it works — shown in both modes. */
  explanation?: string;
  /** Plain-language version shown in Beginner mode. */
  simple?: string;
  example?: string;
  /** HSC depth: evaluation, nuance, exam tip — shown in Advanced mode. */
  advanced?: string;
  /** True when the item is a supplementary explanation rather than a syllabus dot point. */
  supplementary?: boolean;
}

export interface Influence {
  id: string;
  name: string;
  meaning: string;
  effect: string;
  positive: string[];
  negative: string[];
  responses: string[];
  example: string;
  advanced?: string;
}

export interface Strategy {
  id: string;
  name: string;
  definition: string;
  how?: string;
  advantages: string[];
  disadvantages: string[];
  application: string;
  effectiveness: string;
  example?: string;
  supplementary?: boolean;
}

export interface ComparisonTable {
  id: string;
  title: string;
  caption?: string;
  columns: string[];
  rows: { label: string; cells: string[] }[];
}

export interface FlowNode {
  id: string;
  label: string;
  detail: string;
  /** Grid position (column, row) — converted to pixels by the renderer. */
  col: number;
  row: number;
  tone?: "input" | "process" | "output" | "neutral" | "decision" | "accent";
}

export interface FlowSpec {
  id: string;
  title: string;
  caption?: string;
  nodes: FlowNode[];
  edges: { from: string; to: string; label?: string; dashed?: boolean }[];
  height?: number;
}

export type Block =
  | { kind: "heading"; id: string; title: string; intro?: string }
  | { kind: "concepts"; items: Concept[] }
  | { kind: "influences"; items: Influence[] }
  | { kind: "strategies"; items: Strategy[] }
  | { kind: "visual"; id: string; visual: string; title: string; caption?: string }
  | { kind: "comparison"; table: ComparisonTable }
  | { kind: "flow"; flow: FlowSpec }
  | { kind: "callout"; tone: "info" | "exam" | "warning" | "syllabus"; title: string; text: string }
  | { kind: "proscons"; id: string; title: string; pros: string[]; cons: string[] };

export interface Misconception {
  myth: string;
  fact: string;
}

export interface TopicRevision {
  takeaways: string[];
  thirtySecond: string;
  terms: string[];
  formulas: string[];
  misconceptions: Misconception[];
  examApplication: string[];
}

export interface TopicContent {
  id: TopicId;
  number: number;
  name: string;
  short: string;
  focus: string;
  summary: string;
  goals: string[];
  outcomes: string[];
  indicativeTime: string;
  syllabus: SyllabusArea[];
  learnTo: DotPoint[];
  sections: {
    concepts: Block[];
    influences: Block[];
    processes: Block[];
    strategies: Block[];
  };
  revision: TopicRevision;
}

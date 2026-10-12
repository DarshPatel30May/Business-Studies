// Heuristic writing feedback for the Business Report Builder and Extended Response tools.
// IMPORTANT: this is keyword- and pattern-based guidance only. It cannot judge accuracy or
// quality the way an experienced HSC marker does, and its scores are NOT NESA marks.

export interface FeedbackContext {
  /** Syllabus terms relevant to the question (lower-case or mixed). */
  keyTerms: string[];
  /** Names, figures and facts from the stimulus that show application. */
  stimulusTerms: string[];
  /** Whether the question requires a judgement (evaluate, assess, recommend, justify, to what extent). */
  requiresJudgement: boolean;
  /** Target word range for the piece being checked. */
  wordRange?: [number, number];
}

export type CriterionId = "relevance" | "terminology" | "application" | "analysis" | "evaluation" | "structure" | "clarity";

export interface CriterionFeedback {
  id: CriterionId;
  label: string;
  /** 0–3 indicator: 0 not evident, 1 limited, 2 sound, 3 strong. */
  level: 0 | 1 | 2 | 3;
  found: string[];
  advice: string;
}

export interface FeedbackReport {
  wordCount: number;
  criteria: CriterionFeedback[];
}

const CAUSAL = [
  "because",
  "therefore",
  "as a result",
  "which means",
  "this means",
  "leading to",
  "leads to",
  "resulting in",
  "results in",
  "consequently",
  "thereby",
  "so that",
  "in turn",
  "which would",
  "which will",
  "due to",
  "allowing",
  "enabling",
  "impact",
  "effect",
];

const EVALUATIVE = [
  "most effective",
  "highly effective",
  "effective",
  "ineffective",
  "limited",
  "however",
  "although",
  "on balance",
  "overall",
  "to a large extent",
  "to a limited extent",
  "outweigh",
  "outweighs",
  "more appropriate",
  "best",
  "recommend",
  "should",
  "judgement",
  "in the long term",
  "in the short term",
  "trade-off",
  "whereas",
  "despite",
];

const REPORT_HEADINGS = ["executive summary", "introduction", "recommendation", "conclusion"];

export function countWords(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

function findAll(text: string, phrases: string[]): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();
  for (const p of phrases) {
    const needle = p.toLowerCase().trim();
    if (!needle) continue;
    const re = new RegExp(`(^|[^a-z0-9])${escapeRegExp(needle)}(s|es)?([^a-z0-9]|$)`, "i");
    if (re.test(lower)) found.add(p);
  }
  return [...found];
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function levelFrom(count: number, thresholds: [number, number, number]): 0 | 1 | 2 | 3 {
  if (count >= thresholds[2]) return 3;
  if (count >= thresholds[1]) return 2;
  if (count >= thresholds[0]) return 1;
  return 0;
}

function averageSentenceLength(text: string): number {
  const sentences = text.split(/[.!?]+\s/).map((s) => s.trim()).filter(Boolean);
  if (!sentences.length) return 0;
  return countWords(text) / sentences.length;
}

export function analyseWriting(text: string, ctx: FeedbackContext, mode: "report" | "essay" | "paragraph"): FeedbackReport {
  const wordCount = countWords(text);
  const terms = findAll(text, ctx.keyTerms);
  const stim = findAll(text, ctx.stimulusTerms);
  const causal = findAll(text, CAUSAL);
  const evaluative = findAll(text, EVALUATIVE);
  const headings = findAll(text, REPORT_HEADINGS);
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
  const avgLen = averageSentenceLength(text);

  const criteria: CriterionFeedback[] = [];
  const relevantShare = ctx.keyTerms.length ? terms.length / ctx.keyTerms.length : 0;
  criteria.push({
    id: "relevance",
    label: "Relevance to the question",
    level: wordCount === 0 ? 0 : relevantShare >= 0.4 ? 3 : relevantShare >= 0.2 ? 2 : relevantShare > 0 ? 1 : 0,
    found: terms.slice(0, 8),
    advice:
      relevantShare >= 0.4
        ? "Your response stays focused on the concepts the question asks about."
        : "Re-read the question and make sure each section answers it directly. Use the key concepts named in the question.",
  });
  criteria.push({
    id: "terminology",
    label: "Business terminology",
    level: levelFrom(terms.length, [1, 3, 6]),
    found: terms,
    advice:
      terms.length >= 6
        ? "Strong use of syllabus terminology."
        : `Use more precise syllabus terms, e.g. ${ctx.keyTerms.filter((t) => !terms.includes(t)).slice(0, 4).join(", ")}.`,
  });
  criteria.push({
    id: "application",
    label: "Application to the stimulus / case study",
    level: levelFrom(stim.length, [1, 3, 5]),
    found: stim,
    advice:
      stim.length >= 3
        ? "Good — you refer to specific details from the business scenario."
        : "Refer to specific names, figures and problems from the stimulus. Generic answers that could apply to any business score lower.",
  });
  criteria.push({
    id: "analysis",
    label: "Analysis (cause and effect)",
    level: levelFrom(causal.length, [1, 2, 5]),
    found: causal,
    advice:
      causal.length >= 3
        ? "You explain consequences and relationships, not just describe."
        : "Show cause and effect: explain HOW the strategy works and WHAT impact it has on business performance (use 'which leads to', 'as a result', 'therefore').",
  });
  criteria.push({
    id: "evaluation",
    label: ctx.requiresJudgement ? "Evaluation / judgement" : "Evaluation (not required by this verb)",
    level: ctx.requiresJudgement ? levelFrom(evaluative.length, [1, 3, 5]) : evaluative.length ? 2 : 1,
    found: evaluative,
    advice: ctx.requiresJudgement
      ? evaluative.length >= 3
        ? "You make judgements and weigh up strengths and limitations."
        : "This question requires a judgement. State how effective / appropriate each strategy is, weigh advantages against limitations, and give an overall judgement."
      : "This directive does not require a judgement, so focus on clear explanation or analysis.",
  });
  if (mode === "report") {
    criteria.push({
      id: "structure",
      label: "Report structure",
      level: levelFrom(headings.length + (paragraphs >= 4 ? 1 : 0), [1, 2, 4]),
      found: headings,
      advice:
        headings.length >= 3
          ? "Clear report features (e.g. executive summary, headings, recommendations)."
          : "Use report features: a title, an executive summary, headings linked to the question, recommendations and a brief conclusion.",
    });
  } else {
    criteria.push({
      id: "structure",
      label: mode === "essay" ? "Essay structure" : "Paragraph structure",
      level: mode === "essay" ? levelFrom(paragraphs, [2, 4, 5]) : wordCount >= 80 ? 3 : wordCount >= 40 ? 2 : wordCount > 0 ? 1 : 0,
      found: [`${paragraphs} paragraph${paragraphs === 1 ? "" : "s"}`],
      advice:
        mode === "essay"
          ? "Aim for an introduction with a clear thesis, 3–4 body paragraphs each with a topic sentence, and a conclusion that answers the question."
          : "A strong paragraph moves from point → explanation → application → analysis (→ evaluation if required).",
    });
  }
  const [lo, hi] = ctx.wordRange ?? [0, Infinity];
  const inRange = wordCount >= lo && wordCount <= hi;
  criteria.push({
    id: "clarity",
    label: "Clarity and concision",
    level: wordCount === 0 ? 0 : inRange && avgLen <= 30 ? 3 : avgLen <= 35 ? 2 : 1,
    found: [`${wordCount} words`, `≈ ${Math.round(avgLen)} words per sentence`],
    advice:
      avgLen > 30
        ? "Some sentences are long. Shorter sentences make your analysis easier to follow."
        : wordCount < lo
          ? `Your response is shorter than the suggested range (${lo}–${hi === Infinity ? "+" : hi} words).`
          : wordCount > hi
            ? `Your response is longer than the suggested range (${lo}–${hi} words). In the exam, time is limited — prioritise depth over length.`
            : "Clear and concise.",
  });
  return { wordCount, criteria };
}

export function requiresJudgement(verb: string): boolean {
  return ["evaluate", "assess", "recommend", "justify", "discuss", "to what extent", "critically analyse"].includes(verb.toLowerCase());
}

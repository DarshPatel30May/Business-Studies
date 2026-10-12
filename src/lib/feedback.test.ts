import { describe, expect, it } from "vitest";
import { analyseWriting, countWords, requiresJudgement } from "./feedback";

const ctx = {
  keyTerms: ["liquidity", "factoring", "current ratio", "working capital", "cash flow"],
  stimulusTerms: ["Ironbark", "$40,000", "overdraft"],
  requiresJudgement: true,
  wordRange: [50, 400] as [number, number],
};

describe("writing feedback", () => {
  it("counts words", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("  one two\nthree ")).toBe(3);
  });
  it("detects terminology, application, analysis and evaluation", () => {
    const text =
      "Executive summary\n\nIronbark's current ratio has fallen, which means its liquidity is weak and it relies on a $40,000 overdraft. " +
      "Factoring receivables would improve cash flow because cash is received immediately. However, the fee reduces profit, so on balance it is effective only in the short term.\n\nRecommendations\n\nIronbark should improve working capital management.";
    const r = analyseWriting(text, ctx, "report");
    const by = Object.fromEntries(r.criteria.map((c) => [c.id, c]));
    expect(by.terminology.found).toEqual(expect.arrayContaining(["liquidity", "factoring", "current ratio", "working capital", "cash flow"]));
    expect(by.application.level).toBe(2);
    expect(by.analysis.level).toBeGreaterThanOrEqual(2);
    expect(by.evaluation.level).toBeGreaterThanOrEqual(2);
    expect(by.structure.found).toEqual(expect.arrayContaining(["executive summary", "recommendation"]));
  });
  it("gives zero levels for an empty response", () => {
    const r = analyseWriting("", ctx, "essay");
    expect(r.wordCount).toBe(0);
    expect(r.criteria.find((c) => c.id === "terminology")!.level).toBe(0);
    expect(r.criteria.find((c) => c.id === "clarity")!.level).toBe(0);
  });
  it("matches whole phrases only", () => {
    const r = analyseWriting("The cashflowing river", { ...ctx, keyTerms: ["cash flow"] }, "paragraph");
    expect(r.criteria.find((c) => c.id === "terminology")!.found).toHaveLength(0);
  });
  it("identifies judgement verbs", () => {
    expect(requiresJudgement("Evaluate")).toBe(true);
    expect(requiresJudgement("describe")).toBe(false);
  });
});

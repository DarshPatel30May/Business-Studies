import { describe, expect, it } from "vitest";
import { groupBy, latestAttempts, suggestDifficulty, weakAreas, type AttemptLike } from "./analytics";

const a = (qid: string, topic: AttemptLike["topic"], area: string, score: number, max: number, at: number): AttemptLike => ({
  qid,
  kind: "mcq",
  topic,
  area,
  score,
  max,
  at,
});

describe("analytics", () => {
  const attempts = [
    a("q1", "finance", "fin-processes", 0, 1, 1),
    a("q1", "finance", "fin-processes", 1, 1, 5), // retried correctly
    a("q2", "finance", "fin-processes", 0, 1, 2),
    a("q3", "finance", "fin-processes", 0, 1, 3),
    a("q4", "hr", "hr-strategies", 1, 1, 4),
    a("q5", "hr", "hr-strategies", 1, 1, 6),
  ];
  it("keeps the latest attempt per question", () => {
    const l = latestAttempts(attempts);
    expect(l).toHaveLength(5);
    expect(l.find((x) => x.qid === "q1")!.score).toBe(1);
  });
  it("groups and computes accuracy", () => {
    const g = groupBy(latestAttempts(attempts), (x) => x.topic);
    expect(g.find((b) => b.key === "finance")!.accuracy).toBe(33);
    expect(g.find((b) => b.key === "hr")!.accuracy).toBe(100);
  });
  it("identifies weak areas", () => {
    const w = weakAreas(groupBy(latestAttempts(attempts), (x) => x.area));
    expect(w.map((x) => x.key)).toEqual(["fin-processes"]);
  });
  it("adapts difficulty", () => {
    expect(suggestDifficulty(90, "medium")).toBe("hard");
    expect(suggestDifficulty(30, "medium")).toBe("easy");
    expect(suggestDifficulty(65, "medium")).toBe("medium");
    expect(suggestDifficulty(95, "hsc")).toBe("hsc");
  });
});

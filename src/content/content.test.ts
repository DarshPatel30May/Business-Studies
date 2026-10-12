import { describe, expect, it } from "vitest";
import { TOPICS, allDotPoints, anchorsInBlocks, GLOSSARY, search } from "./index";
import { FORMULAS, formulaById } from "./formulas";
import { CASE_STUDIES, STRATEGY_TAGS } from "./caseStudies";
import { MCQS } from "./questions/mcq";
import { SHORT_ANSWERS } from "./questions/shortAnswer";
import { REPORTS } from "./questions/reports";
import { EXTENDED, EXTENDED_SETS } from "./questions/extended";
import { VISUAL_IDS } from "./visualIds";
import { CONNECTIONS } from "./hsc";

describe("topic content", () => {
  it("has four topics in syllabus order", () => {
    expect(TOPICS.map((t) => t.id)).toEqual(["operations", "marketing", "finance", "hr"]);
  });

  for (const t of TOPICS) {
    describe(t.name, () => {
      it("links every syllabus dot point to an anchor that exists", () => {
        for (const dp of allDotPoints(t)) {
          expect(dp.link, `${dp.id} has no link`).toBeDefined();
          const { section, anchor } = dp.link!;
          if (!anchor) continue;
          const blocks = (t.sections as Record<string, Parameters<typeof anchorsInBlocks>[0]>)[section];
          expect(blocks, `${dp.id} links to unknown section ${section}`).toBeDefined();
          expect(anchorsInBlocks(blocks), `${dp.id} → ${section}#${anchor}`).toContain(anchor);
        }
      });
      it("has unique anchors across sections", () => {
        const all = Object.values(t.sections).flatMap((b) => anchorsInBlocks(b));
        expect(new Set(all).size).toBe(all.length);
      });
      it("only references registered visuals", () => {
        for (const blocks of Object.values(t.sections))
          for (const b of blocks) if (b.kind === "visual") expect(VISUAL_IDS, b.visual).toContain(b.visual);
      });
      it("has a complete quick revision section", () => {
        expect(t.revision.takeaways.length).toBeGreaterThan(0);
        expect(t.revision.takeaways.length).toBeLessThanOrEqual(10);
        expect(t.revision.misconceptions.length).toBeGreaterThan(0);
        for (const term of t.revision.terms) expect(GLOSSARY.map((g) => g.id), term).toContain(term);
        for (const f of t.revision.formulas) expect(formulaById(f), f).toBeDefined();
      });
      it("contains no placeholder text", () => {
        const json = JSON.stringify(t).toLowerCase();
        for (const bad of ["lorem", "todo", "tbd", "placeholder", "coming soon"]) expect(json).not.toContain(bad);
      });
    });
  }
});

describe("question banks", () => {
  it("multiple-choice questions are well formed", () => {
    const ids = new Set<string>();
    for (const q of MCQS) {
      expect(ids.has(q.id), q.id).toBe(false);
      ids.add(q.id);
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size, q.id).toBe(4);
      expect(q.distractors[q.answer], q.id).toBe("");
      q.distractors.forEach((d, i) => {
        if (i !== q.answer) expect(d.length, `${q.id} distractor ${i}`).toBeGreaterThan(0);
      });
      const topic = TOPICS.find((t) => t.id === q.topic)!;
      expect(topic.syllabus.map((a) => a.id), q.id).toContain(q.area);
    }
  });
  it("covers every topic and difficulty level", () => {
    for (const t of TOPICS) {
      for (const d of ["easy", "medium", "hard", "hsc"] as const) {
        expect(MCQS.some((q) => q.topic === t.id && q.difficulty === d), `${t.id} ${d}`).toBe(true);
      }
    }
  });
  it("short-answer questions cover 2–6 marks and have criteria", () => {
    const marks = new Set(SHORT_ANSWERS.map((s) => s.marks));
    for (const m of [2, 3, 4, 5, 6]) expect(marks.has(m), `${m} marks`).toBe(true);
    for (const s of SHORT_ANSWERS) {
      expect(s.criteria.length).toBeGreaterThan(0);
      expect(s.sample.length).toBeGreaterThan(30);
      expect(TOPICS.find((t) => t.id === s.topic)!.syllabus.map((a) => a.id), s.id).toContain(s.area);
    }
  });
  it("business reports have relevant and irrelevant options for feedback", () => {
    for (const r of REPORTS) {
      expect(r.problems.some((p) => p.relevant)).toBe(true);
      expect(r.problems.some((p) => !p.relevant)).toBe(true);
      expect(r.strategies.some((s) => s.appropriate)).toBe(true);
      expect(r.strategies.some((s) => !s.appropriate)).toBe(true);
    }
  });
  it("extended response sets pair questions from different topics", () => {
    for (const set of EXTENDED_SETS) {
      const [a, b] = set.questions.map((id) => EXTENDED.find((e) => e.id === id)!);
      expect(a && b, set.id).toBeTruthy();
      expect(a.topic).not.toBe(b.topic);
    }
    for (const e of EXTENDED) for (const c of e.suggestedCases) expect(CASE_STUDIES.map((x) => x.id), `${e.id} → ${c}`).toContain(c);
    expect(EXTENDED.filter((e) => e.sample).length).toBeGreaterThanOrEqual(2);
  });
});

describe("case studies and formulas", () => {
  it("every case study has sources, evidence and valid tags", () => {
    const tagIds = STRATEGY_TAGS.map((t) => t.id);
    for (const c of CASE_STUDIES) {
      expect(c.sources.length, c.id).toBeGreaterThan(0);
      expect(c.evidence.length, c.id).toBeGreaterThan(0);
      for (const tag of c.tags) expect(tagIds, `${c.id} tag ${tag}`).toContain(tag);
      for (const s of c.sources) if (s.url) expect(s.url.startsWith("https://"), s.url).toBe(true);
      expect(JSON.stringify(c).toLowerCase()).not.toContain("wikipedia");
    }
  });
  it("every strategy tag has at least one case study", () => {
    for (const t of STRATEGY_TAGS) expect(CASE_STUDIES.some((c) => c.tags.includes(t.id)), t.id).toBe(true);
  });
  it("every formula computes its worked example", () => {
    for (const f of FORMULAS) {
      const v = Object.fromEntries(f.inputs.map((i) => [i.key, i.example]));
      expect(f.compute(v), f.id).not.toBeNull();
    }
  });
  it("includes all seven syllabus ratios", () => {
    const syl = FORMULAS.filter((f) => f.syllabusRatio).map((f) => f.ratioId);
    expect(syl.sort()).toEqual(["arTurnover", "current", "debtToEquity", "expense", "grossProfit", "netProfit", "roe"].sort());
  });
  it("defines all six interdependence connections", () => {
    expect(CONNECTIONS).toHaveLength(6);
  });
});

describe("search", () => {
  it("finds concepts, formulas and case studies", () => {
    expect(search("critical path")[0].title.toLowerCase()).toContain("critical path");
    expect(search("current ratio").some((r) => r.kind === "Formula")).toBe(true);
    expect(search("toyota").some((r) => r.kind === "Case study")).toBe(true);
    expect(search("")).toHaveLength(0);
  });
});

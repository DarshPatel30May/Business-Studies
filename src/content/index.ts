import { operations } from "./topics/operations";
import { marketing } from "./topics/marketing";
import { finance } from "./topics/finance";
import { hr } from "./topics/hr";
import type { Block, DotPoint, SectionId, TopicContent, TopicId } from "./types";
import { FORMULAS } from "./formulas";
import { CASE_STUDIES } from "./caseStudies";
import { DIRECTIVES } from "./hsc";

export const TOPICS: TopicContent[] = [operations, marketing, finance, hr];
export const TOPIC_IDS: TopicId[] = ["operations", "marketing", "finance", "hr"];
export const topicById = (id: string): TopicContent | undefined => TOPICS.find((t) => t.id === id);

export const SECTIONS: { id: SectionId; label: string; letter: string }[] = [
  { id: "overview", label: "Overview", letter: "A" },
  { id: "syllabus", label: "Syllabus", letter: "B" },
  { id: "concepts", label: "Major concepts", letter: "C" },
  { id: "influences", label: "Influences", letter: "D" },
  { id: "processes", label: "Processes", letter: "E" },
  { id: "strategies", label: "Strategies", letter: "F" },
  { id: "case-studies", label: "Case studies", letter: "G" },
  { id: "revision", label: "Quick revision", letter: "H" },
];

/** Flatten every dot point (including children) for a topic. */
export function flattenDotPoints(points: DotPoint[]): DotPoint[] {
  return points.flatMap((p) => [p, ...(p.children ? flattenDotPoints(p.children) : [])]);
}

export function allDotPoints(topic: TopicContent): DotPoint[] {
  return [...topic.syllabus.flatMap((a) => flattenDotPoints(a.learnAbout)), ...topic.learnTo];
}

/** Every anchor id rendered within a topic section, used to validate syllabus links. */
export function anchorsInBlocks(blocks: Block[]): string[] {
  const ids: string[] = [];
  for (const b of blocks) {
    switch (b.kind) {
      case "heading":
        ids.push(b.id);
        break;
      case "concepts":
        b.items.forEach((i) => ids.push(i.id));
        break;
      case "influences":
        b.items.forEach((i) => ids.push(i.id));
        break;
      case "strategies":
        b.items.forEach((i) => ids.push(i.id));
        break;
      case "visual":
        ids.push(b.id);
        break;
      case "comparison":
        ids.push(b.table.id);
        break;
      case "flow":
        ids.push(b.flow.id);
        break;
      case "proscons":
        ids.push(b.id);
        break;
    }
  }
  return ids;
}

// ---------------------------------------------------------------------------
// Glossary — derived from topic content so definitions are never duplicated.
// ---------------------------------------------------------------------------

export interface GlossaryEntry {
  id: string;
  term: string;
  definition: string;
  topic: TopicId;
  section: SectionId;
}

export function buildGlossary(): GlossaryEntry[] {
  const out: GlossaryEntry[] = [];
  for (const t of TOPICS) {
    for (const section of ["concepts", "influences", "processes", "strategies"] as const) {
      for (const b of t.sections[section]) {
        if (b.kind === "concepts")
          b.items.forEach((c) => out.push({ id: c.id, term: c.term, definition: c.definition, topic: t.id, section }));
        if (b.kind === "influences")
          b.items.forEach((c) => out.push({ id: c.id, term: c.name, definition: c.meaning, topic: t.id, section }));
        if (b.kind === "strategies")
          b.items.forEach((c) => out.push({ id: c.id, term: c.name, definition: c.definition, topic: t.id, section }));
      }
    }
  }
  return out;
}

export const GLOSSARY = buildGlossary();
export const glossaryById = (id: string) => GLOSSARY.find((g) => g.id === id);

// ---------------------------------------------------------------------------
// Search index
// ---------------------------------------------------------------------------

export interface SearchItem {
  id: string;
  title: string;
  text: string;
  kind: "Concept" | "Influence" | "Strategy" | "Syllabus" | "Formula" | "Case study" | "Directive" | "Visual" | "Page";
  topic?: TopicId;
  to: string;
}

export const PAGES: { title: string; to: string; text: string }[] = [
  { title: "Dashboard", to: "/", text: "home topics progress overview" },
  { title: "Syllabus explorer and checklist", to: "/syllabus", text: "dot points students learn about learn to checklist completion" },
  { title: "Interdependence of business functions", to: "/interdependence", text: "operations marketing finance human resources connections" },
  { title: "Formula centre", to: "/formulas", text: "ratios current ratio debt to equity gross profit net profit return on equity expense ratio accounts receivable turnover percentage change" },
  { title: "Financial ratio calculator", to: "/calculator", text: "step by step working interpretation implications" },
  { title: "Financial statement simulator", to: "/finance-lab", text: "income statement balance sheet cash flow ratios analysis dashboard" },
  { title: "Business simulation centre", to: "/simulation", text: "run a business quarters decisions dashboard manufacturing retail hospitality technology transport" },
  { title: "Case study library", to: "/case-studies", text: "real businesses Toyota Qantas Woolworths Apple McDonald's evidence sources" },
  { title: "Case study comparison", to: "/case-studies/compare", text: "compare two businesses function" },
  { title: "Case study application tool", to: "/case-studies/apply", text: "use case study in HSC response verb" },
  { title: "Business report builder", to: "/report-builder", text: "section III business report stimulus executive summary recommendations feedback" },
  { title: "Extended response planner", to: "/extended-response", text: "section IV essay thesis paragraph planner directive verbs" },
  { title: "HSC exam practice centre", to: "/exam", text: "multiple choice short answer business report extended response practice difficulty" },
  { title: "Flashcards", to: "/flashcards", text: "revision terms definitions" },
  { title: "Progress and weak topics", to: "/progress", text: "performance recommendations weak topics analytics" },
  { title: "Bookmarks", to: "/bookmarks", text: "saved revision bookmarks" },
  { title: "Glossary", to: "/glossary", text: "terminology definitions key terms" },
  { title: "Sources and about", to: "/about", text: "sources NESA syllabus disclaimer installation" },
];

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];
  for (const t of TOPICS) {
    for (const section of ["concepts", "influences", "processes", "strategies"] as const) {
      for (const b of t.sections[section]) {
        const to = (anchor: string) => `/topic/${t.id}/${section}?focus=${anchor}`;
        if (b.kind === "concepts")
          b.items.forEach((c) =>
            items.push({ id: c.id, title: c.term, text: `${c.definition} ${c.explanation ?? ""} ${c.example ?? ""}`, kind: "Concept", topic: t.id, to: to(c.id) }),
          );
        if (b.kind === "influences")
          b.items.forEach((c) => items.push({ id: c.id, title: c.name, text: `${c.meaning} ${c.effect}`, kind: "Influence", topic: t.id, to: to(c.id) }));
        if (b.kind === "strategies")
          b.items.forEach((c) => items.push({ id: c.id, title: c.name, text: `${c.definition} ${c.how ?? ""}`, kind: "Strategy", topic: t.id, to: to(c.id) }));
        if (b.kind === "visual") items.push({ id: b.id, title: b.title, text: b.caption ?? "", kind: "Visual", topic: t.id, to: to(b.id) });
        if (b.kind === "comparison") items.push({ id: b.table.id, title: b.table.title, text: b.table.rows.map((r) => r.label + " " + r.cells.join(" ")).join(" "), kind: "Visual", topic: t.id, to: to(b.table.id) });
        if (b.kind === "flow") items.push({ id: b.flow.id, title: b.flow.title, text: b.flow.nodes.map((n) => n.label + " " + n.detail).join(" "), kind: "Visual", topic: t.id, to: to(b.flow.id) });
        if (b.kind === "heading") items.push({ id: b.id, title: b.title, text: b.intro ?? "", kind: "Concept", topic: t.id, to: to(b.id) });
      }
    }
    for (const dp of allDotPoints(t)) {
      items.push({ id: `sy-${dp.id}`, title: dp.text, text: dp.text, kind: "Syllabus", topic: t.id, to: dp.link ? `/topic/${t.id}/${dp.link.section}${dp.link.anchor ? `?focus=${dp.link.anchor}` : ""}` : `/topic/${t.id}/syllabus` });
    }
  }
  for (const f of FORMULAS) items.push({ id: f.id, title: f.name, text: `${f.category} ${f.whenUsed} ${f.inputs.map((i) => i.label).join(" ")}`, kind: "Formula", topic: f.topic, to: `/formulas?focus=${f.id}` });
  for (const c of CASE_STUDIES) items.push({ id: c.id, title: `${c.business} — ${c.headline}`, text: `${c.industry} ${c.strategy} ${c.tags.join(" ")}`, kind: "Case study", topic: c.topics[0], to: `/case-studies/${c.id}` });
  for (const d of DIRECTIVES) items.push({ id: `dir-${d.verb}`, title: `Directive: ${d.verb}`, text: `${d.meaning} ${d.expects}`, kind: "Directive", to: `/extended-response?verb=${d.verb}` });
  for (const p of PAGES) items.push({ id: `page-${p.to}`, title: p.title, text: p.text, kind: "Page", to: p.to });
  return items;
}

let INDEX: SearchItem[] | null = null;
export function searchIndex(): SearchItem[] {
  if (!INDEX) INDEX = buildSearchIndex();
  return INDEX;
}

/** Simple ranked keyword search: title matches score highest, then whole-word and partial text matches. */
export function search(query: string, limit = 30): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/).filter(Boolean);
  const scored = searchIndex()
    .map((item) => {
      const title = item.title.toLowerCase();
      const text = item.text.toLowerCase();
      let score = 0;
      if (title === q) score += 100;
      if (title.startsWith(q)) score += 40;
      if (title.includes(q)) score += 25;
      if (text.includes(q)) score += 8;
      for (const w of words) {
        if (title.includes(w)) score += 6;
        if (text.includes(w)) score += 2;
      }
      if (words.length > 1 && !words.every((w) => title.includes(w) || text.includes(w))) score = Math.min(score, 3);
      if (item.kind === "Syllabus") score *= 0.8;
      return { item, score };
    })
    .filter((s) => s.score > 3)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.item);
}

export { FORMULAS, CASE_STUDIES };

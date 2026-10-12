import { useMemo } from "react";
import { TOPICS, allDotPoints, SECTIONS } from "../content";
import type { TopicId } from "../content/types";
import { groupBy, latestAttempts, weakAreas } from "../lib/analytics";
import { useProgress } from "./progress";

export interface TopicStats {
  topic: TopicId;
  checklistPct: number;
  checked: number;
  totalDotPoints: number;
  sectionsVisited: number;
  totalSections: number;
  accuracy: number | null;
  attempts: number;
}

export function useStats() {
  const { checklist, visited, attempts } = useProgress();
  return useMemo(() => {
    const latest = latestAttempts(attempts);
    const byTopic = groupBy(latest, (a) => a.topic);
    const byArea = groupBy(latest, (a) => a.area);
    const byKind = groupBy(latest, (a) => a.kind);
    const byDifficulty = groupBy(latest.filter((a) => a.difficulty), (a) => a.difficulty!);
    const topics: TopicStats[] = TOPICS.map((t) => {
      const dps = allDotPoints(t);
      const checked = dps.filter((d) => checklist[d.id]).length;
      const b = byTopic.find((x) => x.key === t.id);
      return {
        topic: t.id,
        checklistPct: dps.length ? (checked / dps.length) * 100 : 0,
        checked,
        totalDotPoints: dps.length,
        sectionsVisited: SECTIONS.filter((s) => visited[`${t.id}/${s.id}`]).length,
        totalSections: SECTIONS.length,
        accuracy: b?.accuracy ?? null,
        attempts: b?.attempts ?? 0,
      };
    });
    const totalDp = topics.reduce((s, t) => s + t.totalDotPoints, 0);
    const totalChecked = topics.reduce((s, t) => s + t.checked, 0);
    return {
      topics,
      byArea,
      byKind,
      byDifficulty,
      weak: weakAreas(byArea),
      weakTopics: weakAreas(byTopic, 65, 3),
      overallChecklist: totalDp ? (totalChecked / totalDp) * 100 : 0,
      totalAttempts: latest.length,
      overallAccuracy: (() => {
        const s = latest.reduce((t, a) => t + a.score, 0);
        const m = latest.reduce((t, a) => t + a.max, 0);
        return m ? Math.round((s / m) * 100) : null;
      })(),
    };
  }, [checklist, visited, attempts]);
}

/** Human-readable label for a syllabus area id. */
export function areaLabel(areaId: string): { topic: TopicId; title: string } | null {
  for (const t of TOPICS) {
    const a = t.syllabus.find((x) => x.id === areaId);
    if (a) return { topic: t.id, title: a.title };
  }
  return null;
}

/** Map a syllabus area to the topic section that teaches it. */
export function areaSection(areaId: string): string {
  if (areaId.endsWith("-role")) return "concepts";
  if (areaId.endsWith("-influences")) return "influences";
  if (areaId.endsWith("-processes") || areaId.endsWith("-process")) return "processes";
  return "strategies";
}

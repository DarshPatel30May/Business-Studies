// Performance analytics for weak-topic identification. Pure functions so they can be tested.
import type { TopicId } from "../content/types";

export interface AttemptLike {
  qid: string;
  kind: "mcq" | "short" | "report" | "extended";
  topic: TopicId;
  area: string;
  difficulty?: string;
  score: number;
  max: number;
  at: number;
}

export interface Bucket {
  key: string;
  attempts: number;
  score: number;
  max: number;
  accuracy: number | null; // 0–100
}

/** Keep only the most recent attempt at each question so repeated practice reflects current ability. */
export function latestAttempts<T extends AttemptLike>(attempts: T[]): T[] {
  const map = new Map<string, T>();
  for (const a of [...attempts].sort((x, y) => x.at - y.at)) map.set(`${a.kind}:${a.qid}`, a);
  return [...map.values()];
}

export function groupBy<T extends AttemptLike>(attempts: T[], keyFn: (a: T) => string): Bucket[] {
  const map = new Map<string, Bucket>();
  for (const a of attempts) {
    const key = keyFn(a);
    const b = map.get(key) ?? { key, attempts: 0, score: 0, max: 0, accuracy: null };
    b.attempts += 1;
    b.score += a.score;
    b.max += a.max;
    map.set(key, b);
  }
  return [...map.values()].map((b) => ({ ...b, accuracy: b.max > 0 ? Math.round((b.score / b.max) * 100) : null }));
}

export interface Weakness {
  key: string;
  accuracy: number;
  attempts: number;
}

/** Areas with at least `minAttempts` attempts and accuracy below `threshold`, weakest first. */
export function weakAreas(buckets: Bucket[], threshold = 65, minAttempts = 2): Weakness[] {
  return buckets
    .filter((b) => b.accuracy !== null && b.attempts >= minAttempts && b.accuracy < threshold)
    .map((b) => ({ key: b.key, accuracy: b.accuracy!, attempts: b.attempts }))
    .sort((a, b) => a.accuracy - b.accuracy);
}

export function suggestDifficulty(accuracy: number | null, current: string): string {
  const order = ["easy", "medium", "hard", "hsc"];
  const i = Math.max(0, order.indexOf(current));
  if (accuracy === null) return current;
  if (accuracy >= 80 && i < order.length - 1) return order[i + 1];
  if (accuracy < 50 && i > 0) return order[i - 1];
  return current;
}

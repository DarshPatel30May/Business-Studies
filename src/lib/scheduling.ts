// Critical path analysis (CPA) and Gantt chart scheduling.
// Uses the activity-on-node method: forward pass for earliest start/finish,
// backward pass for latest start/finish; float = LS − ES; critical when float = 0.

export interface Activity {
  id: string;
  name: string;
  duration: number;
  predecessors: string[];
}

export interface ScheduledActivity extends Activity {
  es: number;
  ef: number;
  ls: number;
  lf: number;
  float: number;
  critical: boolean;
}

export interface ScheduleResult {
  ok: true;
  activities: ScheduledActivity[];
  /** Topological order of activity ids. */
  order: string[];
  projectDuration: number;
  /** Every critical path from a start activity to an end activity. */
  criticalPaths: string[][];
}

export interface ScheduleError {
  ok: false;
  error: string;
}

export function topologicalOrder(activities: Activity[]): { order: string[] } | { error: string } {
  const ids = new Set(activities.map((a) => a.id));
  if (ids.size !== activities.length) return { error: "Each activity needs a unique identifier." };
  for (const a of activities) {
    if (!Number.isFinite(a.duration) || a.duration < 0)
      return { error: `Activity ${a.id} has an invalid duration.` };
    for (const p of a.predecessors) {
      if (!ids.has(p)) return { error: `Activity ${a.id} depends on ${p}, which does not exist.` };
      if (p === a.id) return { error: `Activity ${a.id} cannot depend on itself.` };
    }
  }
  const indegree = new Map<string, number>();
  const successors = new Map<string, string[]>();
  for (const a of activities) {
    indegree.set(a.id, a.predecessors.length);
    successors.set(a.id, []);
  }
  for (const a of activities) for (const p of a.predecessors) successors.get(p)!.push(a.id);
  // Stable order: process in the order activities were listed.
  const queue = activities.filter((a) => a.predecessors.length === 0).map((a) => a.id);
  const order: string[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    order.push(id);
    for (const s of successors.get(id)!) {
      indegree.set(s, indegree.get(s)! - 1);
      if (indegree.get(s) === 0) queue.push(s);
    }
  }
  if (order.length !== activities.length)
    return { error: "The dependencies contain a loop (circular dependency), so no schedule is possible." };
  return { order };
}

export function schedule(activities: Activity[]): ScheduleResult | ScheduleError {
  if (activities.length === 0) return { ok: false, error: "Add at least one activity." };
  const topo = topologicalOrder(activities);
  if ("error" in topo) return { ok: false, error: topo.error };
  const byId = new Map(activities.map((a) => [a.id, a]));
  const es = new Map<string, number>();
  const ef = new Map<string, number>();
  for (const id of topo.order) {
    const a = byId.get(id)!;
    const start = a.predecessors.length ? Math.max(...a.predecessors.map((p) => ef.get(p)!)) : 0;
    es.set(id, start);
    ef.set(id, start + a.duration);
  }
  const projectDuration = Math.max(...activities.map((a) => ef.get(a.id)!));
  const successors = new Map<string, string[]>(activities.map((a) => [a.id, []]));
  for (const a of activities) for (const p of a.predecessors) successors.get(p)!.push(a.id);
  const lf = new Map<string, number>();
  const ls = new Map<string, number>();
  for (const id of [...topo.order].reverse()) {
    const a = byId.get(id)!;
    const succ = successors.get(id)!;
    const finish = succ.length ? Math.min(...succ.map((s) => ls.get(s)!)) : projectDuration;
    lf.set(id, finish);
    ls.set(id, finish - a.duration);
  }
  const scheduled: ScheduledActivity[] = activities.map((a) => {
    const fl = ls.get(a.id)! - es.get(a.id)!;
    return {
      ...a,
      es: es.get(a.id)!,
      ef: ef.get(a.id)!,
      ls: ls.get(a.id)!,
      lf: lf.get(a.id)!,
      float: fl,
      critical: Math.abs(fl) < 1e-9,
    };
  });

  // Enumerate critical paths: chains of critical activities where each starts when the previous finishes.
  const sched = new Map(scheduled.map((s) => [s.id, s]));
  const paths: string[][] = [];
  const starts = scheduled.filter((s) => s.critical && s.es === 0 && s.predecessors.length === 0);
  const walk = (id: string, path: string[]) => {
    const current = sched.get(id)!;
    const next = successors
      .get(id)!
      .map((s) => sched.get(s)!)
      .filter((s) => s.critical && Math.abs(s.es - current.ef) < 1e-9);
    if (next.length === 0) {
      if (Math.abs(current.ef - projectDuration) < 1e-9) paths.push(path);
      return;
    }
    for (const n of next) walk(n.id, [...path, n.id]);
  };
  for (const s of starts) walk(s.id, [s.id]);

  return { ok: true, activities: scheduled, order: topo.order, projectDuration, criticalPaths: paths };
}

/** Assign each activity a column (longest chain of predecessors) for drawing a network diagram. */
export function networkLayers(activities: Activity[]): Map<string, number> {
  const topo = topologicalOrder(activities);
  const layer = new Map<string, number>();
  if ("error" in topo) return layer;
  const byId = new Map(activities.map((a) => [a.id, a]));
  for (const id of topo.order) {
    const a = byId.get(id)!;
    layer.set(id, a.predecessors.length ? Math.max(...a.predecessors.map((p) => layer.get(p)!)) + 1 : 0);
  }
  return layer;
}

import { describe, expect, it } from "vitest";
import { networkLayers, schedule, type Activity } from "./scheduling";

const project: Activity[] = [
  { id: "A", name: "Design", duration: 3, predecessors: [] },
  { id: "B", name: "Order materials", duration: 2, predecessors: ["A"] },
  { id: "C", name: "Hire staff", duration: 4, predecessors: ["A"] },
  { id: "D", name: "Build", duration: 5, predecessors: ["B"] },
  { id: "E", name: "Train", duration: 2, predecessors: ["C"] },
  { id: "F", name: "Launch", duration: 1, predecessors: ["D", "E"] },
];

describe("critical path analysis", () => {
  it("computes earliest and latest times, float and project duration", () => {
    const r = schedule(project);
    if (!r.ok) throw new Error(r.error);
    expect(r.projectDuration).toBe(11);
    const get = (id: string) => r.activities.find((a) => a.id === id)!;
    expect(get("A")).toMatchObject({ es: 0, ef: 3, ls: 0, lf: 3, float: 0, critical: true });
    expect(get("B")).toMatchObject({ es: 3, ef: 5, ls: 3, lf: 5, float: 0, critical: true });
    expect(get("D")).toMatchObject({ es: 5, ef: 10, float: 0, critical: true });
    expect(get("C")).toMatchObject({ es: 3, ef: 7, ls: 4, lf: 8, float: 1, critical: false });
    expect(get("E")).toMatchObject({ es: 7, ef: 9, ls: 8, lf: 10, float: 1, critical: false });
    expect(get("F")).toMatchObject({ es: 10, ef: 11, float: 0, critical: true });
    expect(r.criticalPaths).toEqual([["A", "B", "D", "F"]]);
  });

  it("finds multiple critical paths", () => {
    const r = schedule([
      { id: "A", name: "a", duration: 2, predecessors: [] },
      { id: "B", name: "b", duration: 3, predecessors: ["A"] },
      { id: "C", name: "c", duration: 3, predecessors: ["A"] },
      { id: "D", name: "d", duration: 1, predecessors: ["B", "C"] },
    ]);
    if (!r.ok) throw new Error(r.error);
    expect(r.projectDuration).toBe(6);
    expect(r.criticalPaths).toEqual([
      ["A", "B", "D"],
      ["A", "C", "D"],
    ]);
  });

  it("handles parallel start activities", () => {
    const r = schedule([
      { id: "A", name: "a", duration: 4, predecessors: [] },
      { id: "B", name: "b", duration: 6, predecessors: [] },
      { id: "C", name: "c", duration: 2, predecessors: ["A", "B"] },
    ]);
    if (!r.ok) throw new Error(r.error);
    expect(r.projectDuration).toBe(8);
    expect(r.criticalPaths).toEqual([["B", "C"]]);
    expect(r.activities.find((a) => a.id === "A")!.float).toBe(2);
  });

  it("rejects circular dependencies", () => {
    const r = schedule([
      { id: "A", name: "a", duration: 1, predecessors: ["C"] },
      { id: "B", name: "b", duration: 1, predecessors: ["A"] },
      { id: "C", name: "c", duration: 1, predecessors: ["B"] },
    ]);
    expect(r.ok).toBe(false);
  });

  it("rejects unknown predecessors and self-dependency", () => {
    expect(schedule([{ id: "A", name: "a", duration: 1, predecessors: ["Z"] }]).ok).toBe(false);
    expect(schedule([{ id: "A", name: "a", duration: 1, predecessors: ["A"] }]).ok).toBe(false);
    expect(schedule([]).ok).toBe(false);
  });

  it("assigns network layers for drawing", () => {
    const layers = networkLayers(project);
    expect(layers.get("A")).toBe(0);
    expect(layers.get("B")).toBe(1);
    expect(layers.get("D")).toBe(2);
    expect(layers.get("F")).toBe(3);
  });
});

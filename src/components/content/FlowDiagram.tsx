import { memo, useMemo, useState } from "react";
import { ReactFlow, Handle, Position, MarkerType, type Edge, type Node, type NodeProps } from "@xyflow/react";
import type { FlowSpec } from "../../content/types";
import { useSettings } from "../../state/settings";
import { cx } from "../../lib/theme";

const TONE: Record<string, { light: string; dark: string; border: string }> = {
  input: { light: "#fff7ed", dark: "#2b1d12", border: "#fb923c" },
  process: { light: "#f5f3ff", dark: "#221a33", border: "#a78bfa" },
  output: { light: "#ecfdf5", dark: "#10261d", border: "#34d399" },
  decision: { light: "#eff6ff", dark: "#122036", border: "#60a5fa" },
  accent: { light: "#fbf7f2", dark: "#2a1b11", border: "#b07a43" },
  neutral: { light: "#ffffff", dark: "#26221e", border: "#a8a29e" },
};

type FlowNodeData = { label: string; tone: string; selected: boolean; dark: boolean };

const FlowNodeView = memo(function FlowNodeView({ data }: NodeProps<Node<FlowNodeData>>) {
  const t = TONE[data.tone] ?? TONE.neutral;
  return (
    <div
      className="rounded-xl px-3 py-2 text-center text-[13px] leading-snug font-semibold shadow-sm transition-transform"
      style={{
        width: 180,
        background: data.dark ? t.dark : t.light,
        border: `2px solid ${t.border}`,
        color: data.dark ? "#f5f5f4" : "#1c1917",
        transform: data.selected ? "scale(1.05)" : undefined,
        boxShadow: data.selected ? `0 0 0 4px ${t.border}55` : undefined,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} id="l" />
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} id="t" />
      {data.label}
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} id="r" />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} id="b" />
    </div>
  );
});

const nodeTypes = { flow: FlowNodeView };

export function FlowDiagram({ flow, colWidth = 230, rowHeight = 120 }: { flow: FlowSpec; colWidth?: number; rowHeight?: number }) {
  const { isDark } = useSettings();
  const [selected, setSelected] = useState<string>(flow.nodes[0]?.id ?? "");
  const maxRow = Math.max(...flow.nodes.map((n) => n.row));

  const nodes: Node<FlowNodeData>[] = useMemo(
    () =>
      flow.nodes.map((n) => ({
        id: n.id,
        type: "flow",
        position: { x: n.col * colWidth, y: n.row * rowHeight },
        data: { label: n.label, tone: n.tone ?? "neutral", selected: n.id === selected, dark: isDark },
        draggable: false,
        connectable: false,
      })),
    [flow, selected, isDark, colWidth, rowHeight],
  );

  const edges: Edge[] = useMemo(
    () =>
      flow.edges.map((e, i) => {
        const a = flow.nodes.find((n) => n.id === e.from)!;
        const b = flow.nodes.find((n) => n.id === e.to)!;
        const sameRow = a.row === b.row;
        const forward = b.col >= a.col;
        return {
          id: `e${i}`,
          source: e.from,
          target: e.to,
          sourceHandle: sameRow && forward ? "r" : "b",
          targetHandle: sameRow && forward ? "l" : "t",
          label: e.label,
          type: "smoothstep",
          animated: false,
          style: { stroke: isDark ? "#a8a29e" : "#78716c", strokeWidth: 1.6, strokeDasharray: e.dashed ? "6 4" : undefined },
          labelStyle: { fill: isDark ? "#e7e5e4" : "#44403c", fontSize: 11, fontWeight: 600 },
          labelBgStyle: { fill: isDark ? "#1c1916" : "#ffffff" },
          markerEnd: { type: MarkerType.ArrowClosed, color: isDark ? "#a8a29e" : "#78716c" },
        };
      }),
    [flow, isDark],
  );

  const sel = flow.nodes.find((n) => n.id === selected);
  const height = flow.height ?? Math.max(220, (maxRow + 1) * rowHeight + 60);

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50/60 dark:border-stone-800 dark:bg-night" style={{ height }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={(_, n) => setSelected(n.id)}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable
          zoomOnScroll={false}
          zoomOnPinch
          panOnScroll={false}
          preventScrolling={false}
          colorMode={isDark ? "dark" : "light"}
          proOptions={{ hideAttribution: true }}
          minZoom={0.3}
          maxZoom={1.5}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5" role="tablist" aria-label={`${flow.title} steps`}>
        {flow.nodes.map((n) => (
          <button
            key={n.id}
            type="button"
            role="tab"
            aria-selected={selected === n.id}
            onClick={() => setSelected(n.id)}
            className={cx(
              "rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
              selected === n.id ? "border-bronze-500 bg-bronze-50 text-bronze-900 dark:bg-bronze-900/40 dark:text-bronze-100" : "border-stone-200 text-stone-600 hover:border-stone-300 dark:border-stone-700 dark:text-stone-300",
            )}
          >
            {n.label}
          </button>
        ))}
      </div>
      {sel && (
        <div className="mt-3 rounded-xl border border-stone-200 bg-white p-3 text-sm dark:border-stone-800 dark:bg-night-3" aria-live="polite">
          <p className="font-semibold text-stone-900 dark:text-stone-100">{sel.label}</p>
          <p className="mt-1 leading-relaxed text-stone-600 dark:text-stone-300">{sel.detail}</p>
        </div>
      )}
    </div>
  );
}

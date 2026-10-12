import { useSettings } from "../../state/settings";
import { chartColors, seriesColors } from "../../lib/theme";

export function useChartTheme() {
  const { isDark } = useSettings();
  const c = chartColors(isDark);
  return {
    isDark,
    ...c,
    series: seriesColors(isDark),
    axisProps: { stroke: c.axis, tick: { fill: c.axis, fontSize: 12 }, tickLine: false, axisLine: { stroke: c.grid } },
    gridProps: { stroke: c.grid, strokeDasharray: "3 3", vertical: false },
    tooltipProps: {
      contentStyle: { background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: 10, fontSize: 12, color: c.text },
      labelStyle: { color: c.text, fontWeight: 600 },
      itemStyle: { color: c.text },
      cursor: { fill: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" },
    },
  };
}

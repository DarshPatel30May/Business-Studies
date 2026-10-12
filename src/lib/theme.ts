import { Factory, Megaphone, PiggyBank, Users, type LucideIcon } from "lucide-react";
import type { TopicId } from "../content/types";

export interface TopicTheme {
  label: string;
  icon: LucideIcon;
  hex: string;
  hexSoft: string;
  text: string;
  textStrong: string;
  bgSoft: string;
  bgSolid: string;
  border: string;
  ring: string;
  chip: string;
  gradient: string;
}

// Full class strings so Tailwind can detect them at build time.
export const TOPIC_THEME: Record<TopicId, TopicTheme> = {
  operations: {
    label: "Operations",
    icon: Factory,
    hex: "#ea580c",
    hexSoft: "#fdba74",
    text: "text-orange-700 dark:text-orange-300",
    textStrong: "text-orange-800 dark:text-orange-200",
    bgSoft: "bg-orange-50 dark:bg-orange-950/40",
    bgSolid: "bg-orange-600",
    border: "border-orange-200 dark:border-orange-900/70",
    ring: "ring-orange-500",
    chip: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200",
    gradient: "from-orange-500/15 via-orange-500/5 to-transparent",
  },
  marketing: {
    label: "Marketing",
    icon: Megaphone,
    hex: "#7c3aed",
    hexSoft: "#c4b5fd",
    text: "text-violet-700 dark:text-violet-300",
    textStrong: "text-violet-800 dark:text-violet-200",
    bgSoft: "bg-violet-50 dark:bg-violet-950/40",
    bgSolid: "bg-violet-600",
    border: "border-violet-200 dark:border-violet-900/70",
    ring: "ring-violet-500",
    chip: "bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200",
    gradient: "from-violet-500/15 via-violet-500/5 to-transparent",
  },
  finance: {
    label: "Finance",
    icon: PiggyBank,
    hex: "#059669",
    hexSoft: "#6ee7b7",
    text: "text-emerald-700 dark:text-emerald-300",
    textStrong: "text-emerald-800 dark:text-emerald-200",
    bgSoft: "bg-emerald-50 dark:bg-emerald-950/40",
    bgSolid: "bg-emerald-600",
    border: "border-emerald-200 dark:border-emerald-900/70",
    ring: "ring-emerald-500",
    chip: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
    gradient: "from-emerald-500/15 via-emerald-500/5 to-transparent",
  },
  hr: {
    label: "Human Resources",
    icon: Users,
    hex: "#2563eb",
    hexSoft: "#93c5fd",
    text: "text-blue-700 dark:text-blue-300",
    textStrong: "text-blue-800 dark:text-blue-200",
    bgSoft: "bg-blue-50 dark:bg-blue-950/40",
    bgSolid: "bg-blue-600",
    border: "border-blue-200 dark:border-blue-900/70",
    ring: "ring-blue-500",
    chip: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
    gradient: "from-blue-500/15 via-blue-500/5 to-transparent",
  },
};

export const BRONZE = "#b07a43";

/** Neutral chart colours that read well on both themes. */
export function chartColors(isDark: boolean) {
  return {
    grid: isDark ? "#3a342e" : "#e7e1d9",
    axis: isDark ? "#a8a29e" : "#78716c",
    text: isDark ? "#e7e5e4" : "#44403c",
    tooltipBg: isDark ? "#1c1916" : "#ffffff",
    tooltipBorder: isDark ? "#3a342e" : "#e7e1d9",
    muted: isDark ? "#57534e" : "#d6d3d1",
    positive: "#059669",
    negative: "#dc2626",
    bronze: BRONZE,
  };
}

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** Validated categorical series palette (dataviz validator: light and dark both pass). Fixed order — never cycled. */
export function seriesColors(isDark: boolean): string[] {
  return isDark ? ["#d97706", "#3b82f6", "#059669", "#8b5cf6"] : ["#b45309", "#2563eb", "#059669", "#7c3aed"];
}

/** Topic colour for chart marks, stepped for the current theme (validated). */
export function topicHex(topic: TopicId, isDark: boolean): string {
  const light: Record<TopicId, string> = { operations: "#ea580c", marketing: "#7c3aed", finance: "#059669", hr: "#2563eb" };
  const dark: Record<TopicId, string> = { operations: "#ea580c", marketing: "#8b5cf6", finance: "#059669", hr: "#3b82f6" };
  return (isDark ? dark : light)[topic];
}

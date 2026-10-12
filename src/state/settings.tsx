import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { usePersistentState } from "./storage";

export type ThemePref = "light" | "dark" | "system";
export type LearningMode = "beginner" | "advanced";

export interface Settings {
  theme: ThemePref;
  mode: LearningMode;
  visualOnly: boolean;
}

interface SettingsCtx extends Settings {
  setTheme: (t: ThemePref) => void;
  setMode: (m: LearningMode) => void;
  setVisualOnly: (v: boolean) => void;
  isDark: boolean;
}

const Ctx = createContext<SettingsCtx | null>(null);

const DEFAULTS: Settings = { theme: "system", mode: "advanced", visualOnly: false };

function systemDark() {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = usePersistentState<Settings>("settings", DEFAULTS);
  const isDark = settings.theme === "dark" || (settings.theme === "system" && systemDark());

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    if (settings.theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => document.documentElement.classList.toggle("dark", mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [settings.theme]);

  const value = useMemo<SettingsCtx>(
    () => ({
      ...settings,
      isDark,
      setTheme: (theme) => setSettings((s) => ({ ...s, theme })),
      setMode: (mode) => setSettings((s) => ({ ...s, mode })),
      setVisualOnly: (visualOnly) => setSettings((s) => ({ ...s, visualOnly })),
    }),
    [settings, isDark, setSettings],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSettings must be used inside SettingsProvider");
  return c;
}

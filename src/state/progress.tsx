import { createContext, useContext, useMemo, type ReactNode } from "react";
import { usePersistentState, writeStorage } from "./storage";
import type { TopicId } from "../content/types";

export interface Attempt {
  qid: string;
  kind: "mcq" | "short" | "report" | "extended";
  topic: TopicId;
  area: string;
  difficulty?: string;
  score: number;
  max: number;
  at: number;
}

export interface Bookmark {
  id: string;
  title: string;
  to: string;
  kind: string;
  topic?: TopicId;
  at: number;
}

export interface ProgressState {
  checklist: Record<string, boolean>;
  visited: Record<string, number>;
  attempts: Attempt[];
  bookmarks: Bookmark[];
  flashcards: Record<string, "known" | "learning">;
}

const EMPTY: ProgressState = { checklist: {}, visited: {}, attempts: [], bookmarks: [], flashcards: {} };

interface ProgressCtx extends ProgressState {
  toggleDotPoint: (id: string, value?: boolean) => void;
  markVisited: (key: string) => void;
  recordAttempt: (a: Omit<Attempt, "at">) => void;
  toggleBookmark: (b: Omit<Bookmark, "at">) => void;
  isBookmarked: (id: string) => boolean;
  setFlashcard: (id: string, status: "known" | "learning" | null) => void;
  resetAll: () => void;
  exportJson: () => string;
  importJson: (json: string) => boolean;
}

const Ctx = createContext<ProgressCtx | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = usePersistentState<ProgressState>("progress", EMPTY);

  const value = useMemo<ProgressCtx>(
    () => ({
      ...state,
      toggleDotPoint: (id, v) =>
        setState((s) => ({ ...s, checklist: { ...s.checklist, [id]: v ?? !s.checklist[id] } })),
      markVisited: (key) =>
        setState((s) => (s.visited[key] ? s : { ...s, visited: { ...s.visited, [key]: Date.now() } })),
      recordAttempt: (a) =>
        setState((s) => ({ ...s, attempts: [...s.attempts, { ...a, at: Date.now() }].slice(-2000) })),
      toggleBookmark: (b) =>
        setState((s) =>
          s.bookmarks.some((x) => x.id === b.id)
            ? { ...s, bookmarks: s.bookmarks.filter((x) => x.id !== b.id) }
            : { ...s, bookmarks: [{ ...b, at: Date.now() }, ...s.bookmarks] },
        ),
      isBookmarked: (id) => state.bookmarks.some((b) => b.id === id),
      setFlashcard: (id, status) =>
        setState((s) => {
          const next = { ...s.flashcards };
          if (status === null) delete next[id];
          else next[id] = status;
          return { ...s, flashcards: next };
        }),
      resetAll: () => {
        setState(EMPTY);
        writeStorage("progress", EMPTY);
      },
      exportJson: () => JSON.stringify(state, null, 2),
      importJson: (json) => {
        try {
          const parsed = JSON.parse(json) as Partial<ProgressState>;
          if (typeof parsed !== "object" || parsed === null) return false;
          setState({ ...EMPTY, ...parsed });
          return true;
        } catch {
          return false;
        }
      },
    }),
    [state, setState],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProgress() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useProgress must be used inside ProgressProvider");
  return c;
}

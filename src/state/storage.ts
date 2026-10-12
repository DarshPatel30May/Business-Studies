import { useCallback, useEffect, useRef, useState } from "react";

const PREFIX = "hscbs:";

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable (private mode, quota) — the app keeps working in memory.
  }
}

export function removeStorage(key: string) {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}

function load<T>(key: string, initial: T): T {
  const stored = readStorage<T>(key, initial);
  // Merge plain objects so fields added in later versions receive their defaults.
  if (initial && typeof initial === "object" && !Array.isArray(initial) && stored && typeof stored === "object" && !Array.isArray(stored))
    return { ...initial, ...stored };
  return stored;
}

/**
 * React state persisted to localStorage under a namespaced key.
 * When `key` changes, the value for the new key is loaded (never overwritten with the old key's value).
 */
export function usePersistentState<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<{ key: string; value: T }>(() => ({ key, value: load(key, initial) }));
  const dirty = useRef(false);

  let current = state;
  if (state.key !== key) {
    current = { key, value: load(key, initial) };
    setState(current);
  }

  useEffect(() => {
    if (!dirty.current) return;
    dirty.current = false;
    writeStorage(state.key, state.value);
  }, [state]);

  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      dirty.current = true;
      setState((s) => ({ key: s.key, value: typeof v === "function" ? (v as (p: T) => T)(s.value) : v }));
    },
    [],
  );
  return [current.value, set];
}

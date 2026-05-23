import type { State } from "./types";

const STORAGE_KEY = "pulse-fitness-state-v3";

export function loadState(): Partial<State> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<State>) : null;
  } catch {
    return null;
  }
}

export function saveState(state: State): void {
  if (typeof window === "undefined") return;
  try {
    const slim: Partial<State> = {
      ...state,
      toast: null,
      openSheet: null,
      activeWorkout: null,
      detailWorkout: null,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slim));
  } catch {
    // quota exceeded or storage unavailable - silently ignore
  }
}

export function clearStoredState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

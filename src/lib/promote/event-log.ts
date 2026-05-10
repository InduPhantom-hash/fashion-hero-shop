const STORAGE_KEY = "promuj-events";

export type PromoteEventName =
  | "open_form"
  | "fill_budget"
  | "fill_days"
  | "fill_keyword"
  | "open_checkout"
  | "submit_cc";

export interface PromoteEvent {
  name: PromoteEventName;
  payload?: Record<string, string | number>;
  at: string;
}

function read(): PromoteEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function logEvent(name: PromoteEventName, payload?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  const events = read();
  events.push({ name, payload, at: new Date().toISOString() });
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // localStorage full or blocked — silently ignore in pretotype
  }
}

export function getEvents(): PromoteEvent[] {
  return read();
}

export function clearEvents() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

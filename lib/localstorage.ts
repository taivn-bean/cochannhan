"use client";

export const loadFromLocalStorage = <T>(key: string, initialState: T): T => {
  if (typeof window === "undefined") return initialState;

  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : initialState;
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
    return initialState;
  }
};
// debounce-storage.ts
let queueTimeout: NodeJS.Timeout | null = null;

export const debounceSave = (key: string, value: any) => {
  if (typeof window === "undefined") return;

  if (queueTimeout) clearTimeout(queueTimeout);

  queueTimeout = setTimeout(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error("save error:", err);
    }
  }, 300);
};

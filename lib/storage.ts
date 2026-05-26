/**
 * Centralized localStorage keys + SSR-safe read/write helpers.
 * Keeping keys in one place avoids typos and makes them easy to find/version.
 */

export const STORAGE_KEYS = {
  /** Cached `/properties` API response. */
  properties: "side:properties",
  /** Array of favorited mlsIds. */
  favorites: "side:favorites",
} as const;

/**
 * Reads and JSON-parses a value from localStorage.
 * Returns `fallback` when running on the server, the key is missing, or parsing fails.
 */
export function readStorage<T>(key: string, fallback: T): T {
  // localStorage is unavailable during SSR.
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    // Corrupt JSON or storage disabled — fall back rather than throw.
    return fallback;
  }
}

/**
 * JSON-stringifies and writes a value to localStorage. No-op on the server.
 */
export function writeStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota/serialization errors; persistence is best-effort.
  }
}

import { useState, useEffect, useCallback } from "react";
import { readStorage, writeStorage } from "@/lib/storage";

/**
 * Generic state hook backed by localStorage.
 *
 * SSR note: initialize from `initialValue` (not localStorage) so server and first
 * client render match, then hydrate from storage in an effect to avoid mismatch
 * warnings. Mirror React's useState API by returning [value, setValue].
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(initialValue);

  // Hydrate from storage after mount (client-only) to avoid SSR hydration mismatch.
  useEffect(() => {
    setValue(readStorage<T>(key, initialValue));
    // initialValue is intentionally omitted: we only re-hydrate when the key changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Keep multiple tabs in sync: the `storage` event fires in *other* tabs when
  // this key changes, so re-read it to reflect their updates here.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) setValue(readStorage<T>(key, initialValue));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setStoredValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (prev: T) => T)(prev) : next;
        writeStorage(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return [value, setStoredValue];
}

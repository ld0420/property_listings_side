import { useState, useEffect, useMemo } from "react";
import type { Property } from "@/types/property";
import { fetchProperties } from "@/lib/simplyrets";
import { readStorage, writeStorage, STORAGE_KEYS } from "@/lib/storage";

/** Map viewport bounds; the visible list is filtered to properties inside these. */
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface UsePropertiesResult {
  /** Properties within the current map bounds (or all, when bounds is null). */
  properties: Property[];
  loading: boolean;
  error: Error | null;
}

/**
 * Loads listings on mount and exposes the subset within the current map bounds.
 */
export function useProperties(bounds: MapBounds | null): UsePropertiesResult {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Guards against setting state after unmount (e.g. StrictMode double-mount).
    let active = true;

    // Instant first paint from cache; skip the spinner if we have something.
    const cached = readStorage<Property[]>(STORAGE_KEYS.properties, []);
    if (cached.length > 0) {
      setAllProperties(cached);
      setLoading(false);
    }

    fetchProperties()
      .then((fresh) => {
        if (!active) return;
        setAllProperties(fresh);
        writeStorage(STORAGE_KEYS.properties, fresh);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active) return;
        // Keep showing cached data (if any) but record the error.
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const properties = useMemo(() => {
    if (!bounds) return allProperties;
    return allProperties.filter(({ geo }) => {
      if (!geo) return false;
      return (
        geo.lat <= bounds.north &&
        geo.lat >= bounds.south &&
        geo.lng <= bounds.east &&
        geo.lng >= bounds.west
      );
    });
  }, [allProperties, bounds]);

  return { properties, loading, error };
}

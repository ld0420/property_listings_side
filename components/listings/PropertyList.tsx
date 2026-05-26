import type { Property } from "@/types/property";
import PropertyCard from "./PropertyCard";

interface PropertyListProps {
  properties: Property[];
  loading: boolean;
  error: Error | null;
}

// 1 column by default; 2 columns from the `lg` breakpoint (1024px) up, once the
// list panel is wide enough to hold them (capped at 2 to match the Figma).
const GRID_CLASS = "m-0 grid list-none grid-cols-1 gap-8 p-8 lg:grid-cols-2";

/** Placeholder card shown while listings load, mirroring the real card layout. */
function SkeletonCard() {
  return (
    <li aria-hidden className="flex flex-col motion-safe:animate-pulse">
      <div className="h-[240px] w-full rounded-sm bg-gray-200" />
      <div className="space-y-2 py-3">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-5 w-1/2 rounded bg-gray-200" />
        <div className="h-4 w-2/3 rounded bg-gray-200" />
      </div>
    </li>
  );
}

/**
 * Right panel: a responsive grid of property cards (2-up on desktop, 1-up on
 * mobile) plus loading / error / empty states.
 */
export default function PropertyList({
  properties,
  loading,
  error,
}: PropertyListProps) {
  // Show skeletons only on the initial load (no data yet); a background refresh
  // with cached results already on screen shouldn't blank the list.
  if (loading && properties.length === 0) {
    return (
      <ul className={GRID_CLASS} aria-busy="true" aria-label="Loading listings">
        {Array.from({ length: 6 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </ul>
    );
  }

  if (error && properties.length === 0) {
    return (
      <p role="alert" className="p-8 text-gray-500">
        Couldn’t load listings. Please try again.
      </p>
    );
  }

  if (properties.length === 0) {
    return (
      <p role="status" className="p-8 text-gray-500">
        No properties in this area.
      </p>
    );
  }

  return (
    <ul className={GRID_CLASS}>
      {properties.map((property) => (
        <li key={property.mlsId}>
          <PropertyCard property={property} />
        </li>
      ))}
    </ul>
  );
}

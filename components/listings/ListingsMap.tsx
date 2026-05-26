import { useRef, useCallback } from "react";
import {
  GoogleMap,
  OverlayViewF,
  OverlayView,
  useJsApiLoader,
} from "@react-google-maps/api";
import type { Property } from "@/types/property";
import type { MapBounds } from "@/hooks/useProperties";
import { useFavorites } from "@/context/FavoritesContext";
import { abbreviatePrice } from "@/lib/format";
import {
  LOADER_OPTIONS,
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  centerOffset,
} from "@/lib/maps";

interface ListingsMapProps {
  properties: Property[];
  /** Fires when the user pans/zooms so the list can re-filter to the viewport. */
  onBoundsChange: (bounds: MapBounds) => void;
}

export default function ListingsMap({
  properties,
  onBoundsChange,
}: ListingsMapProps) {
  const { isLoaded, loadError } = useJsApiLoader(LOADER_OPTIONS);
  const { isFavorite } = useFavorites();
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // onIdle fires once after panning/zooming settles (debounced by the API),
  // so we report bounds without spamming on every intermediate frame.
  const handleIdle = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    // When the map is hidden (e.g. mobile list view) its container is zero-size
    // and getBounds() is meaningless — don't report bounds the list would filter on.
    const div = map.getDiv() as HTMLElement;
    if (!div.offsetWidth || !div.offsetHeight) return;

    const bounds = map.getBounds();
    if (!bounds) return;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    onBoundsChange({
      north: ne.lat(),
      south: sw.lat(),
      east: ne.lng(),
      west: sw.lng(),
    });
  }, [onBoundsChange]);

  if (loadError) {
    return (
      <div
        role="alert"
        className="flex h-full w-full items-center justify-center p-6 text-center text-sm text-gray-500"
      >
        The map couldn’t be loaded. You can still browse the listings.
      </div>
    );
  }
  if (!isLoaded)
    return (
      <div role="status" className="h-full w-full p-6 text-sm text-gray-500">
        Loading map…
      </div>
    );

  return (
    <GoogleMap
      mapContainerClassName="h-full w-full"
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      onLoad={handleLoad}
      onIdle={handleIdle}
    >
      {properties.map((property) => {
        if (!property.geo) return null;
        const favorited = isFavorite(property.mlsId);

        return (
          <OverlayViewF
            key={property.mlsId}
            position={{ lat: property.geo.lat, lng: property.geo.lng }}
            // OVERLAY_LAYER renders the pins without capturing pointer events,
            // so the user can still drag the map "through" them.
            mapPaneName={OverlayView.OVERLAY_LAYER}
            getPixelPositionOffset={centerOffset}
          >
            <span
              className={`rounded-full px-2 py-1 text-xs font-bold text-white shadow-md ${
                favorited ? "bg-red-600" : "bg-header"
              }`}
            >
              {abbreviatePrice(property.listPrice)}
            </span>
          </OverlayViewF>
        );
      })}
    </GoogleMap>
  );
}

/**
 * Google Maps configuration and helpers for the listings map. Centralized here
 * so map setup isn't scattered through the component (and is easy to tweak).
 */

// Key lives only in .env.local (gitignored). Copy .env.example to set it.
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

/**
 * Options for `useJsApiLoader`. Exported as a single stable object so its
 * reference doesn't change across renders — passing a fresh object each render
 * can make the loader warn about reloading the script. Add `libraries: [...]`
 * here (also stable) if ever needed.
 */
export const LOADER_OPTIONS = {
  id: "google-map-script",
  googleMapsApiKey: GOOGLE_MAPS_API_KEY,
};

/** Initial map view — Houston, TX, where the SimplyRETS demo listings cluster. */
export const DEFAULT_CENTER = { lat: 29.76, lng: -95.37 };
export const DEFAULT_ZOOM = 10;

/**
 * Pixel offset that centers an OverlayView on its coordinate
 * (passed to `getPixelPositionOffset`).
 */
export function centerOffset(width: number, height: number) {
  return { x: -(width / 2), y: -(height / 2) };
}

import type { Property } from "@/types/property";

/**
 * SimplyRETS API client.
 *
 * Uses HTTP Basic Auth with the public trial credentials (user/secret = "simplyrets").
 * These are demo-only and safe to keep client-side; for a real app the request would
 * be proxied through a backend route to hide credentials.
 *
 * @see https://docs.simplyrets.com/api/index.html#/Listings/get_properties
 */

const BASE_URL = "https://api.simplyrets.com";
const TRIAL_USER = "simplyrets";
const TRIAL_SECRET = "simplyrets";

/** HTTP Basic Auth header for the trial credentials. */
const authHeader = `Basic ${btoa(`${TRIAL_USER}:${TRIAL_SECRET}`)}`;

/**
 * Fetches the property listings from SimplyRETS.
 * Throws on a non-2xx response so callers can surface an error state.
 */
export async function fetchProperties(): Promise<Property[]> {
  const res = await fetch(`${BASE_URL}/properties`, {
    headers: { Authorization: authHeader },
  });

  if (!res.ok) {
    throw new Error(
      `SimplyRETS request failed: ${res.status} ${res.statusText}`,
    );
  }

  return (await res.json()) as Property[];
}

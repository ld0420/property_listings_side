/**
 * Hook test for the data-loading logic, with the network mocked.
 *
 * Covers the three behaviors that carry real risk: (1) fetch-on-mount + cache
 * write, (2) client-side filtering to the map bounds, and (3) the resilience path
 * where a failed refresh still shows cached data. Mocking `fetchProperties` keeps
 * the test fast and deterministic (no real HTTP).
 */
import { renderHook, waitFor } from "@testing-library/react";
import { useProperties } from "@/hooks/useProperties";
import * as api from "@/lib/simplyrets";
import { STORAGE_KEYS } from "@/lib/storage";
import { makeProperty } from "../test-utils/property";

jest.mock("@/lib/simplyrets");
const mockFetch = api.fetchProperties as jest.MockedFunction<
  typeof api.fetchProperties
>;

describe("useProperties", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("fetches on mount and caches the result", async () => {
    mockFetch.mockResolvedValue([makeProperty({ mlsId: 1 })]);

    const { result } = renderHook(() => useProperties(null));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.properties).toHaveLength(1);

    const cached = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.properties) as string,
    );
    expect(cached).toHaveLength(1);
  });

  it("filters properties to the current map bounds", async () => {
    const inside = makeProperty({ mlsId: 1, geo: { lat: 29.7, lng: -95.4 } });
    const outside = makeProperty({ mlsId: 2, geo: { lat: 40, lng: -100 } });
    mockFetch.mockResolvedValue([inside, outside]);

    const bounds = { north: 30, south: 29, east: -95, west: -96 };
    const { result } = renderHook(() => useProperties(bounds));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.properties.map((p) => p.mlsId)).toEqual([1]);
  });

  it("keeps showing cached data when the refresh fails", async () => {
    localStorage.setItem(
      STORAGE_KEYS.properties,
      JSON.stringify([makeProperty({ mlsId: 9 })]),
    );
    mockFetch.mockRejectedValue(new Error("network down"));

    const { result } = renderHook(() => useProperties(null));

    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(result.current.properties).toHaveLength(1);
  });
});

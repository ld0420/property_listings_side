import type { Property } from "@/types/property";

/**
 * Builds a valid Property for tests. Pass `overrides` to vary only the fields a
 * given test cares about, keeping the test focused on its assertion.
 */
export function makeProperty(overrides: Partial<Property> = {}): Property {
  return {
    mlsId: 1,
    listPrice: 199000,
    listDate: "2020-12-13T00:00:00Z",
    address: {
      full: "1839 Berkely Way",
      streetName: "Berkely Way",
      streetNumber: 1839,
      city: "Folsom",
      state: "CA",
      postalCode: "95630",
      country: "US",
    },
    property: { bedrooms: 2, bathsFull: 1, bathsHalf: 3, area: 1500 },
    geo: { lat: 29.7, lng: -95.4 },
    photos: ["https://example.com/photo.jpg"],
    ...overrides,
  };
}

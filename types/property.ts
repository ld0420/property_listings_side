/**
 * A subset of the SimplyRETS `/properties` response shape, typed to the fields
 * this app actually consumes. The full schema is large; extend as needed.
 *
 * @see https://docs.simplyrets.com/api/index.html#/Listings/get_properties
 */

export interface PropertyAddress {
  full: string;
  streetName: string;
  streetNumber: number;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PropertyDetails {
  bedrooms: number;
  bathsFull: number;
  bathsHalf: number;
  /** Living area, surfaced in the UI as "Sq Ft". */
  area: number;
}

/** Map coordinates used to place markers and filter by map bounds. */
export interface PropertyGeo {
  lat: number;
  lng: number;
}

export interface Property {
  /** Stable identifier we persist as a favorite. */
  mlsId: number;
  listPrice: number;
  /** ISO 8601 date string, formatted to MM/DD/YY in the UI. */
  listDate: string;
  address: PropertyAddress;
  property: PropertyDetails;
  /** Optional — some listings have no coordinates, so they can't be mapped. */
  geo?: PropertyGeo;
  /** Photo URLs; the UI displays `photos[0]`. */
  photos: string[];
}

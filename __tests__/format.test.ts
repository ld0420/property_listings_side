/**
 * Unit tests for the pure presentation formatters.
 *
 * These are the highest-ROI tests: the functions are pure, deterministic, and
 * require no React, DOM, or mocking — so they pin down the exact display rules
 * from the spec (bath math, currency, date format) cheaply and unambiguously.
 */
import {
  formatBaths,
  formatPrice,
  abbreviatePrice,
  formatArea,
  formatListDate,
} from "@/lib/format";

describe("formatBaths", () => {
  it("counts each half bath as 0.5 (1 full + 3 half = 2.5)", () => {
    expect(formatBaths(1, 3)).toBe(2.5);
  });

  it("returns whole numbers when there are no half baths", () => {
    expect(formatBaths(2, 0)).toBe(2);
  });
});

describe("formatPrice", () => {
  it("formats as USD with no decimals", () => {
    expect(formatPrice(199000)).toBe("$199,000");
  });

  it("formats millions with separators", () => {
    expect(formatPrice(3750000)).toBe("$3,750,000");
  });
});

describe("abbreviatePrice", () => {
  it("abbreviates thousands with a K suffix", () => {
    expect(abbreviatePrice(199000)).toBe("199K");
  });

  it("abbreviates millions with an M suffix, trimming trailing zeros", () => {
    expect(abbreviatePrice(3750000)).toBe("3.75M");
    expect(abbreviatePrice(3000000)).toBe("3M");
  });
});

describe("formatArea", () => {
  it("adds thousands separators", () => {
    expect(formatArea(1500)).toBe("1,500");
  });
});

describe("formatListDate", () => {
  it("formats an ISO date as MM/DD/YY", () => {
    expect(formatListDate("2020-12-13T00:00:00Z")).toBe("12/13/20");
  });

  it("uses UTC so the day does not shift by timezone", () => {
    // Late-evening UTC timestamp would roll back a day if parsed in local time.
    expect(formatListDate("2011-05-23T18:50:30.184391Z")).toBe("05/23/11");
  });

  it("returns an empty string for an unparseable date", () => {
    expect(formatListDate("not-a-date")).toBe("");
  });
});

/**
 * Pure presentation formatters. Kept framework-free and side-effect-free so they
 * are trivial to unit test (see __tests__/format.test.ts).
 */

/**
 * Combines full and half baths into a single decimal figure.
 * Each half bath counts as 0.5 (ex: 1 full + 3 half = 2.5).
 */
export function formatBaths(bathsFull: number, bathsHalf: number): number {
  return bathsFull + bathsHalf * 0.5;
}

/** Reused formatter instance (constructing Intl.NumberFormat is relatively costly). */
const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/**
 * Formats a number as USD with no decimals (ex: 199000 -> "$199,000").
 */
export function formatPrice(listPrice: number): string {
  return usdFormatter.format(listPrice);
}

/**
 * Abbreviates a price for a compact map pin (199000 -> "199K", 3750000 -> "3.75M").
 */
export function abbreviatePrice(price: number): string {
  if (price >= 1_000_000) {
    const millions = price / 1_000_000;
    // Trim trailing zeros: 3.00 -> "3", 3.75 -> "3.75".
    return `${parseFloat(millions.toFixed(2))}M`;
  }
  return `${Math.round(price / 1000)}K`;
}

/**
 * Formats living area with thousands separators (ex: 1500 -> "1,500").
 */
export function formatArea(area: number): string {
  return new Intl.NumberFormat("en-US").format(area);
}

/**
 * Formats an ISO date string as MM/DD/YY (ex: "2020-12-13" -> "12/13/20").
 * Uses UTC getters so the day doesn't shift based on the viewer's timezone.
 */
export function formatListDate(listDate: string): string {
  const date = new Date(listDate);
  if (Number.isNaN(date.getTime())) return "";

  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const yy = String(date.getUTCFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
}

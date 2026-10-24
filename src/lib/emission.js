// Planned emission of TOY at factor m = 1 (specification v0.3, section 9):
// every epoch k0 = 0.0505 % of the remaining supply, 365 epochs per year.
export const CAP = 100_000_000;
export const K0 = 505 / 1_000_000;

/** TOY issued after a number of years (plan, m = 1). */
export function issuedAfterYears(years) {
  return CAP * (1 - Math.pow(1 - K0, 365 * years));
}

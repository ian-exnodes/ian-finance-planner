// Month keys are "YYYY-MM" strings; they compare correctly with < and >.

/** "2026-07" + 6 → "2027-01" (delta may be negative) */
export function addMonths(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number);
  const total = y * 12 + (m - 1) + delta;
  const year = Math.floor(total / 12);
  const mm = String((total % 12 + 12) % 12 + 1).padStart(2, "0");
  return `${year}-${mm}`;
}

/** Whole months from `from` to `to`: monthDiff("2026-07", "2027-01") → 6 */
export function monthDiff(from: string, to: string): number {
  const [fy, fm] = from.split("-").map(Number);
  const [ty, tm] = to.split("-").map(Number);
  return (ty - fy) * 12 + (tm - fm);
}

/** Inclusive range: ("2026-11", "2027-01") → ["2026-11", "2026-12", "2027-01"] */
export function monthRange(start: string, end: string): string[] {
  const count = monthDiff(start, end) + 1;
  if (count <= 0) return [];
  return Array.from({ length: count }, (_, i) => addMonths(start, i));
}

/** Month key for a Date in local time */
export function monthFromDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

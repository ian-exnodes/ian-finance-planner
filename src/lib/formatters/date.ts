/**
 * "2026-07-01" or a Date → "01/07/2026".
 * Date-only strings are formatted without constructing a Date to avoid
 * timezone shifts (new Date("YYYY-MM-DD") is UTC midnight).
 */
export function formatDateVi(date: string | Date): string {
  if (typeof date === "string") {
    const [y, m, d] = date.slice(0, 10).split("-");
    if (y && m && d) return `${d}/${m}/${y}`;
    return date;
  }
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${d}/${m}/${date.getFullYear()}`;
}

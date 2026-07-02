/** "2026-07" → "Tháng 07/2026" (format from docs/04-DESIGN_SYSTEM.md) */
export function formatMonthVi(month: string): string {
  const [y, m] = month.split("-");
  if (!y || !m) return month;
  return `Tháng ${m}/${y}`;
}

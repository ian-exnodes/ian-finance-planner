/** "2026-07" → "Tháng 7/2026" */
export function formatMonthVi(month: string): string {
  const [y, m] = month.split("-");
  if (!y || !m) return month;
  return `Tháng ${Number(m)}/${y}`;
}

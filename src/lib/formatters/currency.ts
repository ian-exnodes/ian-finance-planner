const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

/** 30000000 → "30.000.000 ₫" */
export function formatVND(amount: number): string {
  return vndFormatter.format(amount);
}

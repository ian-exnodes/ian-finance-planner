import type { DebtRiskLabel, WishlistDecisionLabel } from "@/types";

/** totalDebtPayment / income; null (never NaN) when income is 0 or negative */
export function calculateDebtRatio(
  totalDebtPayment: number,
  income: number
): number | null {
  if (income <= 0) return null;
  return totalDebtPayment / income;
}

/** Risk thresholds from the PRD: <20% / 20–35% / 35–50% / >50% */
export function getDebtRiskLabel(ratio: number | null): DebtRiskLabel | null {
  if (ratio === null) return null;
  if (ratio < 0.2) return "An toàn";
  if (ratio < 0.35) return "Cần theo dõi";
  if (ratio <= 0.5) return "Rủi ro";
  return "Nguy hiểm";
}

/** Same thresholds applied to the projected ratio; no income → do not buy */
export function getWishlistDecision(
  projectedRatio: number | null
): WishlistDecisionLabel {
  if (projectedRatio === null) return "Không nên mua lúc này";
  if (projectedRatio < 0.2) return "Có thể mua";
  if (projectedRatio < 0.35) return "Nên cân nhắc";
  if (projectedRatio <= 0.5) return "Nên trì hoãn";
  return "Không nên mua lúc này";
}

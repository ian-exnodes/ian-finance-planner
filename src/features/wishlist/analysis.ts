import {
  calculateDebtRatio,
  getCreditDueForMonth,
  getTotalInstallmentsForMonth,
  getWishlistDecision,
  type CreditTransactionInput,
  type InstallmentInput,
} from "@/lib/calculations";
import { formatMonthVi } from "@/lib/formatters";
import type { WishlistDecisionLabel, WishlistItem } from "@/types";

type IncomeInput = { month: string; salary: number; bonus: number; other: number };

export interface WishlistAnalysis {
  monthlyImpact: number;
  currentRatio: number | null;
  projectedRatio: number | null;
  decision: WishlistDecisionLabel;
  explanation: string;
}

function percent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}

/**
 * Projects the debt ratio for the item's expected purchase month:
 * (existing debt payments that month + this item's monthly payment) / that month's income.
 * Wishlist items never feed the real dashboard — this is a what-if only.
 */
export function analyzeWishlistItem(
  item: Pick<WishlistItem, "price" | "months" | "expected_purchase_month">,
  data: {
    incomes: IncomeInput[];
    installments: InstallmentInput[];
    creditTransactions: CreditTransactionInput[];
  }
): WishlistAnalysis {
  const month = item.expected_purchase_month;
  const monthlyImpact = Math.round(item.price / Math.max(item.months, 1));

  const income = data.incomes.reduce(
    (sum, i) => (i.month === month ? sum + i.salary + i.bonus + i.other : sum),
    0
  );
  const existingDebt =
    getTotalInstallmentsForMonth(data.installments, month) +
    getCreditDueForMonth(data.creditTransactions, month);

  const currentRatio = calculateDebtRatio(existingDebt, income);
  const projectedRatio = calculateDebtRatio(existingDebt + monthlyImpact, income);
  const decision = getWishlistDecision(projectedRatio);

  const monthLabel = formatMonthVi(month);
  let explanation: string;
  if (projectedRatio === null) {
    explanation = `Chưa có dữ liệu thu nhập cho ${monthLabel}. Hãy thêm thu nhập tháng đó trước khi quyết định.`;
  } else if (decision === "Có thể mua") {
    explanation = `Tỷ lệ trả nợ ${monthLabel} dự kiến ${percent(projectedRatio)} — vẫn ở mức an toàn.`;
  } else if (decision === "Nên cân nhắc") {
    explanation = `Tỷ lệ trả nợ ${monthLabel} sẽ tăng lên ${percent(projectedRatio)}. Bạn vẫn mua được nhưng nên theo dõi chi tiêu.`;
  } else if (decision === "Nên trì hoãn") {
    explanation = `${monthLabel} hơi căng (dự kiến ${percent(projectedRatio)}). Bạn nên hạn chế mở thêm khoản trả góp mới trong tháng này.`;
  } else {
    explanation = `Tỷ lệ trả nợ ${monthLabel} dự kiến ${percent(projectedRatio)} — vượt mức an toàn. Nên chờ thời điểm phù hợp hơn.`;
  }

  return { monthlyImpact, currentRatio, projectedRatio, decision, explanation };
}

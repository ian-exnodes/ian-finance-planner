import {
  addMonths,
  calculateMonthlySummary,
  getCreditDueForMonth,
  getInstallmentPaymentForMonth,
  monthRange,
} from "@/lib/calculations";
import type { InstallmentType, MonthlySummary } from "@/types";
import { getIncomes } from "@/features/income/repository";
import { getFixedCosts } from "@/features/fixed-costs/repository";
import { getInstallments } from "@/features/installments/repository";
import { getCreditTransactions } from "@/features/credit-cards/repository";
import { INSTALLMENT_TYPE_LABELS } from "@/features/installments/labels";

export interface DashboardData {
  selectedMonth: string;
  months: string[];
  summaries: MonthlySummary[];
  selected: MonthlySummary;
  breakdown: { label: string; amount: number }[];
  hasAnyData: boolean;
}

/** Chart window: 2 months back, 9 months ahead of the selected month. */
export async function getDashboardData(
  selectedMonth: string
): Promise<DashboardData> {
  const [incomes, fixedCosts, installments, creditTransactions] =
    await Promise.all([
      getIncomes(),
      getFixedCosts(),
      getInstallments(),
      getCreditTransactions(),
    ]);

  const months = monthRange(
    addMonths(selectedMonth, -2),
    addMonths(selectedMonth, 9)
  );
  const summaries = months.map((month) =>
    calculateMonthlySummary({
      month,
      incomes,
      fixedCosts,
      installments,
      creditTransactions,
    })
  );
  const selected =
    summaries.find((s) => s.month === selectedMonth) ?? summaries[0];

  const breakdown: { label: string; amount: number }[] = [];
  for (const type of Object.keys(
    INSTALLMENT_TYPE_LABELS
  ) as InstallmentType[]) {
    const amount = installments
      .filter((i) => i.type === type)
      .reduce(
        (sum, i) => sum + getInstallmentPaymentForMonth(i, selectedMonth),
        0
      );
    if (amount > 0) {
      breakdown.push({
        label: `Trả góp — ${INSTALLMENT_TYPE_LABELS[type]}`,
        amount,
      });
    }
  }
  const creditDue = getCreditDueForMonth(creditTransactions, selectedMonth);
  if (creditDue > 0) {
    breakdown.push({ label: "Sao kê thẻ tín dụng", amount: creditDue });
  }
  breakdown.sort((a, b) => b.amount - a.amount);

  return {
    selectedMonth,
    months,
    summaries,
    selected,
    breakdown,
    hasAnyData:
      incomes.length > 0 ||
      fixedCosts.length > 0 ||
      installments.length > 0 ||
      creditTransactions.length > 0,
  };
}

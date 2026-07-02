import type { FixedCost, Income, MonthlySummary } from "@/types";
import { calculateDebtRatio } from "./debt-ratio";
import {
  getCreditDueForMonth,
  type CreditTransactionInput,
} from "./credit-cards";
import {
  getTotalInstallmentsForMonth,
  type InstallmentInput,
} from "./installments";

type IncomeInput = Pick<Income, "month" | "salary" | "bonus" | "other">;
type FixedCostInput = Pick<FixedCost, "amount">;

/** Total income recorded for a month */
export function getIncomeForMonth(
  incomes: IncomeInput[],
  month: string
): number {
  return incomes.reduce(
    (sum, i) =>
      i.month === month ? sum + i.salary + i.bonus + i.other : sum,
    0
  );
}

/** Fixed costs recur every month, so the total is month-independent */
export function getTotalFixedCosts(fixedCosts: FixedCostInput[]): number {
  return fixedCosts.reduce((sum, f) => sum + f.amount, 0);
}

/**
 * The dashboard's core numbers for one month.
 * totalDebt = active installment payments + unpaid credit for the statement month.
 */
export function calculateMonthlySummary(input: {
  month: string;
  incomes: IncomeInput[];
  fixedCosts: FixedCostInput[];
  installments: InstallmentInput[];
  creditTransactions: CreditTransactionInput[];
}): MonthlySummary {
  const income = getIncomeForMonth(input.incomes, input.month);
  const fixedCosts = getTotalFixedCosts(input.fixedCosts);
  const installmentPayments = getTotalInstallmentsForMonth(
    input.installments,
    input.month
  );
  const creditPayments = getCreditDueForMonth(
    input.creditTransactions,
    input.month
  );
  const totalDebt = installmentPayments + creditPayments;

  return {
    month: input.month,
    income,
    fixedCosts,
    installmentPayments,
    creditPayments,
    totalDebt,
    remaining: income - fixedCosts - totalDebt,
    debtRatio: calculateDebtRatio(totalDebt, income),
  };
}

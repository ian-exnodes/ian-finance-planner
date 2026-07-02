import type { Installment } from "@/types";
import { addMonths, monthDiff } from "./months";

/** The fields the installment math actually needs — full rows also satisfy this. */
export type InstallmentInput = Pick<
  Installment,
  "total_amount" | "months" | "monthly_payment" | "start_month" | "status"
>;

/** Explicit monthly_payment wins; otherwise total / months rounded to whole VND */
export function getMonthlyPayment(installment: InstallmentInput): number {
  if (installment.monthly_payment != null && installment.monthly_payment > 0) {
    return installment.monthly_payment;
  }
  if (installment.months <= 0) return 0;
  return Math.round(installment.total_amount / installment.months);
}

/** Last month a payment is due: start "2026-07" over 12 months → "2027-06" */
export function getInstallmentEndMonth(installment: InstallmentInput): string {
  return addMonths(installment.start_month, installment.months - 1);
}

/** Payment due for one installment in one month; 0 unless active and in range */
export function getInstallmentPaymentForMonth(
  installment: InstallmentInput,
  month: string
): number {
  if (installment.status !== "active") return 0;
  if (month < installment.start_month) return 0;
  if (month > getInstallmentEndMonth(installment)) return 0;
  return getMonthlyPayment(installment);
}

/** Sum of payments due in a month across installments (active ones only) */
export function getTotalInstallmentsForMonth(
  installments: InstallmentInput[],
  month: string
): number {
  return installments.reduce(
    (sum, i) => sum + getInstallmentPaymentForMonth(i, month),
    0
  );
}

/** Full payment schedule regardless of status: [{ month, amount }, ...] */
export function getInstallmentSchedule(
  installment: InstallmentInput
): { month: string; amount: number }[] {
  if (installment.months <= 0) return [];
  const amount = getMonthlyPayment(installment);
  return Array.from({ length: installment.months }, (_, i) => ({
    month: addMonths(installment.start_month, i),
    amount,
  }));
}

/** Months still owed as of currentMonth (inclusive); 0 once paid or finished */
export function getRemainingMonths(
  installment: InstallmentInput,
  currentMonth: string
): number {
  if (installment.status === "paid") return 0;
  const end = getInstallmentEndMonth(installment);
  if (currentMonth > end) return 0;
  const from =
    currentMonth < installment.start_month
      ? installment.start_month
      : currentMonth;
  return monthDiff(from, end) + 1;
}

/** Remaining months × monthly payment as of currentMonth */
export function getRemainingBalance(
  installment: InstallmentInput,
  currentMonth: string
): number {
  return (
    getRemainingMonths(installment, currentMonth) *
    getMonthlyPayment(installment)
  );
}

import type { CreditTransaction } from "@/types";

/** The fields the credit math actually needs — full rows also satisfy this. */
export type CreditTransactionInput = Pick<
  CreditTransaction,
  "card_id" | "amount" | "statement_month" | "paid"
>;

/** Unpaid amount due for a statement month across all cards */
export function getCreditDueForMonth(
  transactions: CreditTransactionInput[],
  month: string
): number {
  return transactions.reduce(
    (sum, t) =>
      t.statement_month === month && !t.paid ? sum + t.amount : sum,
    0
  );
}

/** Unpaid amount due for a statement month, per card_id */
export function getCreditDueByCardForMonth(
  transactions: CreditTransactionInput[],
  month: string
): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const t of transactions) {
    if (t.statement_month !== month || t.paid) continue;
    totals[t.card_id] = (totals[t.card_id] ?? 0) + t.amount;
  }
  return totals;
}

/** Totals per statement month (paid + unpaid), e.g. for statement history */
export function getCreditTotalsByStatementMonth(
  transactions: CreditTransactionInput[]
): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const t of transactions) {
    totals[t.statement_month] = (totals[t.statement_month] ?? 0) + t.amount;
  }
  return totals;
}

// Domain types matching the Supabase schema

export type InstallmentType = "credit_card" | "pay_later" | "loan" | "other";
export type InstallmentStatus = "active" | "paid" | "paused";
export type WishlistPriority = "low" | "medium" | "high";
export type WishlistNeedLevel = "nice_to_have" | "useful" | "necessary";

export interface Income {
  id: string;
  user_id: string;
  month: string; // "YYYY-MM"
  salary: number;
  bonus: number;
  other: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface FixedCost {
  id: string;
  user_id: string;
  name: string;
  category: string;
  amount: number;
  due_day: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Installment {
  id: string;
  user_id: string;
  item_name: string;
  provider: string;
  type: InstallmentType;
  purchase_date: string;
  total_amount: number;
  months: number;
  monthly_payment: number | null;
  start_month: string; // "YYYY-MM"
  due_day: number | null;
  status: InstallmentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreditCard {
  id: string;
  user_id: string;
  name: string;
  provider: string;
  statement_day: number | null;
  due_day: number | null;
  credit_limit: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  card_id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  statement_month: string; // "YYYY-MM"
  due_date: string | null;
  paid: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  item_name: string;
  price: number;
  payment_method: string;
  months: number;
  expected_purchase_month: string; // "YYYY-MM"
  priority: WishlistPriority;
  need_level: WishlistNeedLevel;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Derived / computed types
export interface MonthlySummary {
  month: string;
  income: number;
  fixedCosts: number;
  installmentPayments: number;
  creditPayments: number;
  totalDebt: number;
  remaining: number;
  debtRatio: number | null;
}

export type DebtRiskLabel =
  | "An toàn"
  | "Cần theo dõi"
  | "Rủi ro"
  | "Nguy hiểm";

export type WishlistDecisionLabel =
  | "Có thể mua"
  | "Nên cân nhắc"
  | "Nên trì hoãn"
  | "Không nên mua lúc này";

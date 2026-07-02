import { addMonths } from "@/lib/calculations";
import type {
  InstallmentStatus,
  InstallmentType,
  WishlistNeedLevel,
  WishlistPriority,
} from "@/types";

const SEED_NOTE = "Dữ liệu mẫu";

export interface SeedRows {
  incomes: {
    month: string;
    salary: number;
    bonus: number;
    other: number;
    notes: string;
  }[];
  fixedCosts: {
    name: string;
    category: string;
    amount: number;
    due_day: number | null;
    notes: string;
  }[];
  installments: {
    item_name: string;
    provider: string;
    type: InstallmentType;
    purchase_date: string;
    total_amount: number;
    months: number;
    monthly_payment: number | null;
    start_month: string;
    due_day: number | null;
    status: InstallmentStatus;
    notes: string;
  }[];
  creditCard: {
    id: string;
    name: string;
    provider: string;
    statement_day: number;
    due_day: number;
    credit_limit: number;
    notes: string;
  };
  creditTransactions: {
    card_id: string;
    date: string;
    description: string;
    category: string;
    amount: number;
    statement_month: string;
    due_date: string | null;
    paid: boolean;
    notes: string;
  }[];
  wishlistItems: {
    item_name: string;
    price: number;
    payment_method: string;
    months: number;
    expected_purchase_month: string;
    priority: WishlistPriority;
    need_level: WishlistNeedLevel;
    notes: string;
  }[];
}

/** Pure builder: all dates derive from currentMonth ("YYYY-MM"). */
export function buildSeedRows(currentMonth: string): SeedRows {
  const prev1 = addMonths(currentMonth, -1);
  const prev2 = addMonths(currentMonth, -2);
  const cardId = crypto.randomUUID();

  return {
    incomes: [
      { month: prev2, salary: 28000000, bonus: 0, other: 0, notes: SEED_NOTE },
      {
        month: prev1,
        salary: 28000000,
        bonus: 2000000,
        other: 0,
        notes: SEED_NOTE,
      },
      {
        month: currentMonth,
        salary: 28000000,
        bonus: 0,
        other: 1500000,
        notes: SEED_NOTE,
      },
    ],
    fixedCosts: [
      {
        name: "Tiền thuê nhà",
        category: "Nhà ở",
        amount: 5000000,
        due_day: 5,
        notes: SEED_NOTE,
      },
      {
        name: "Điện nước",
        category: "Tiện ích",
        amount: 800000,
        due_day: 10,
        notes: SEED_NOTE,
      },
      {
        name: "Internet",
        category: "Tiện ích",
        amount: 300000,
        due_day: 15,
        notes: SEED_NOTE,
      },
      {
        name: "Xăng xe",
        category: "Đi lại",
        amount: 500000,
        due_day: null,
        notes: SEED_NOTE,
      },
    ],
    installments: [
      {
        item_name: "iPhone 16",
        provider: "Thế Giới Di Động",
        type: "pay_later",
        purchase_date: `${addMonths(currentMonth, -3)}-15`,
        total_amount: 15000000,
        months: 12,
        monthly_payment: null,
        start_month: addMonths(currentMonth, -3),
        due_day: 10,
        status: "active",
        notes: SEED_NOTE,
      },
      {
        item_name: "Laptop làm việc",
        provider: "FPT Shop",
        type: "credit_card",
        purchase_date: `${prev1}-05`,
        total_amount: 24000000,
        months: 24,
        monthly_payment: 1050000,
        start_month: prev1,
        due_day: 20,
        status: "active",
        notes: SEED_NOTE,
      },
      {
        item_name: "Máy lọc không khí",
        provider: "Home Credit",
        type: "loan",
        purchase_date: `${addMonths(currentMonth, -8)}-01`,
        total_amount: 6000000,
        months: 6,
        monthly_payment: null,
        start_month: addMonths(currentMonth, -8),
        due_day: 5,
        status: "paid",
        notes: SEED_NOTE,
      },
    ],
    creditCard: {
      id: cardId,
      name: "Thẻ VIB Online Plus",
      provider: "VIB",
      statement_day: 25,
      due_day: 15,
      credit_limit: 50000000,
      notes: SEED_NOTE,
    },
    creditTransactions: [
      {
        card_id: cardId,
        date: `${prev1}-12`,
        description: "Siêu thị Coopmart",
        category: "Ăn uống",
        amount: 1200000,
        statement_month: prev1,
        due_date: `${currentMonth}-15`,
        paid: true,
        notes: SEED_NOTE,
      },
      {
        card_id: cardId,
        date: `${currentMonth}-03`,
        description: "Grab đi làm",
        category: "Đi lại",
        amount: 450000,
        statement_month: currentMonth,
        due_date: `${addMonths(currentMonth, 1)}-15`,
        paid: false,
        notes: SEED_NOTE,
      },
      {
        card_id: cardId,
        date: `${currentMonth}-08`,
        description: "Ăn tối cùng bạn",
        category: "Ăn uống",
        amount: 650000,
        statement_month: currentMonth,
        due_date: `${addMonths(currentMonth, 1)}-15`,
        paid: false,
        notes: SEED_NOTE,
      },
    ],
    wishlistItems: [
      {
        item_name: "Máy hút bụi robot",
        price: 9000000,
        payment_method: "Trả góp qua thẻ",
        months: 6,
        expected_purchase_month: addMonths(currentMonth, 1),
        priority: "medium",
        need_level: "useful",
        notes: SEED_NOTE,
      },
      {
        item_name: "Tai nghe chống ồn",
        price: 6500000,
        payment_method: "Trả thẳng",
        months: 1,
        expected_purchase_month: addMonths(currentMonth, 2),
        priority: "low",
        need_level: "nice_to_have",
        notes: SEED_NOTE,
      },
    ],
  };
}

"use server";

import { revalidatePath } from "next/cache";

import { monthFromDate } from "@/lib/calculations";
import { createClient } from "@/lib/supabase/server";
import { buildSeedRows } from "./data";

type ActionResult = { error: string } | void;

const SEEDABLE_TABLES = [
  "incomes",
  "fixed_costs",
  "installments",
  "credit_cards",
  "wishlist_items",
] as const;

export async function seedDemoDataAction(): Promise<ActionResult> {
  if (process.env.NODE_ENV === "production") {
    return { error: "Dữ liệu mẫu chỉ dùng trong môi trường phát triển." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Không thể lưu dữ liệu. Vui lòng thử lại." };

  // Duplicate guard: only seed a completely empty account.
  for (const table of SEEDABLE_TABLES) {
    const { data, error } = await supabase.from(table).select("id").limit(1);
    if (error) return { error: "Không thể lưu dữ liệu. Vui lòng thử lại." };
    if (data.length > 0) {
      return {
        error:
          "Bạn đã có dữ liệu. Dữ liệu mẫu chỉ tạo được khi tài khoản chưa có dữ liệu nào.",
      };
    }
  }

  const rows = buildSeedRows(monthFromDate(new Date()));
  const withUser = <T extends object>(items: T[]) =>
    items.map((item) => ({ user_id: user.id, ...item }));

  const inserts = [
    supabase.from("incomes").insert(withUser(rows.incomes)),
    supabase.from("fixed_costs").insert(withUser(rows.fixedCosts)),
    supabase.from("installments").insert(withUser(rows.installments)),
    supabase
      .from("credit_cards")
      .insert({ user_id: user.id, ...rows.creditCard }),
    supabase.from("wishlist_items").insert(withUser(rows.wishlistItems)),
  ];
  for (const insert of inserts) {
    const { error } = await insert;
    if (error) return { error: "Không thể lưu dữ liệu. Vui lòng thử lại." };
  }
  // Transactions last — they reference the card id.
  const { error: txError } = await supabase
    .from("credit_transactions")
    .insert(withUser(rows.creditTransactions));
  if (txError) return { error: "Không thể lưu dữ liệu. Vui lòng thử lại." };

  for (const path of [
    "/dashboard",
    "/incomes",
    "/fixed-costs",
    "/installments",
    "/credit-cards",
    "/wishlist",
  ]) {
    revalidatePath(path);
  }
}

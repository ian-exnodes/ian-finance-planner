import { createClient } from "@/lib/supabase/server";
import type { Income } from "@/types";
import type { IncomeValues } from "./schemas";

function toRow(values: IncomeValues) {
  return {
    month: values.month,
    salary: values.salary,
    bonus: values.bonus,
    other: values.other,
    notes: values.notes?.trim() ? values.notes.trim() : null,
  };
}

export async function getIncomes(): Promise<Income[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("incomes")
    .select("*")
    .order("month", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function createIncome(values: IncomeValues): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("incomes")
    .insert({ user_id: user.id, ...toRow(values) });
  if (error) throw new Error(error.message);
}

export async function updateIncome(
  id: string,
  values: IncomeValues
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("incomes")
    .update(toRow(values))
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteIncome(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("incomes").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

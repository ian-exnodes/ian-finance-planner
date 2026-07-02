import { createClient } from "@/lib/supabase/server";
import type { Installment } from "@/types";
import type { InstallmentValues } from "./schemas";

function toRow(values: InstallmentValues) {
  return {
    item_name: values.item_name.trim(),
    provider: values.provider.trim(),
    type: values.type,
    purchase_date: values.purchase_date,
    total_amount: values.total_amount,
    months: values.months,
    monthly_payment: values.monthly_payment,
    start_month: values.start_month,
    due_day: values.due_day,
    status: values.status,
    notes: values.notes?.trim() ? values.notes.trim() : null,
  };
}

export async function getInstallments(): Promise<Installment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("installments")
    .select("*")
    .order("status", { ascending: true })
    .order("start_month", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function createInstallment(
  values: InstallmentValues
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("installments")
    .insert({ user_id: user.id, ...toRow(values) });
  if (error) throw new Error(error.message);
}

export async function updateInstallment(
  id: string,
  values: InstallmentValues
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("installments")
    .update(toRow(values))
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteInstallment(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("installments").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

import { createClient } from "@/lib/supabase/server";
import type { FixedCost } from "@/types";
import type { FixedCostValues } from "./schemas";

function toRow(values: FixedCostValues) {
  return {
    name: values.name.trim(),
    category: values.category.trim(),
    amount: values.amount,
    due_day: values.due_day,
    notes: values.notes?.trim() ? values.notes.trim() : null,
  };
}

export async function getFixedCosts(): Promise<FixedCost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fixed_costs")
    .select("*")
    .order("amount", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function createFixedCost(values: FixedCostValues): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("fixed_costs")
    .insert({ user_id: user.id, ...toRow(values) });
  if (error) throw new Error(error.message);
}

export async function updateFixedCost(
  id: string,
  values: FixedCostValues
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("fixed_costs")
    .update(toRow(values))
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteFixedCost(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("fixed_costs").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

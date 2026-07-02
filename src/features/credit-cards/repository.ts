import { createClient } from "@/lib/supabase/server";
import type { CreditCard, CreditTransaction } from "@/types";
import type { CreditCardValues, CreditTransactionValues } from "./schemas";

function cardToRow(values: CreditCardValues) {
  return {
    name: values.name.trim(),
    provider: values.provider.trim(),
    statement_day: values.statement_day,
    due_day: values.due_day,
    credit_limit: values.credit_limit,
    notes: values.notes?.trim() ? values.notes.trim() : null,
  };
}

function transactionToRow(values: CreditTransactionValues) {
  return {
    card_id: values.card_id,
    date: values.date,
    description: values.description.trim(),
    category: values.category.trim(),
    amount: values.amount,
    statement_month: values.statement_month,
    due_date: values.due_date,
    paid: values.paid,
    notes: values.notes?.trim() ? values.notes.trim() : null,
  };
}

export async function getCreditCards(): Promise<CreditCard[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("credit_cards")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function createCreditCard(
  values: CreditCardValues
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("credit_cards")
    .insert({ user_id: user.id, ...cardToRow(values) });
  if (error) throw new Error(error.message);
}

export async function updateCreditCard(
  id: string,
  values: CreditCardValues
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("credit_cards")
    .update(cardToRow(values))
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteCreditCard(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("credit_cards").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getCreditTransactions(): Promise<CreditTransaction[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("credit_transactions")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function createCreditTransaction(
  values: CreditTransactionValues
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("credit_transactions")
    .insert({ user_id: user.id, ...transactionToRow(values) });
  if (error) throw new Error(error.message);
}

export async function updateCreditTransaction(
  id: string,
  values: CreditTransactionValues
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("credit_transactions")
    .update(transactionToRow(values))
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function setTransactionPaid(
  id: string,
  paid: boolean
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("credit_transactions")
    .update({ paid })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteCreditTransaction(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("credit_transactions")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}

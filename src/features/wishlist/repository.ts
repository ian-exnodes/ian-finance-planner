import { createClient } from "@/lib/supabase/server";
import type { WishlistItem } from "@/types";
import type { WishlistItemValues } from "./schemas";

function toRow(values: WishlistItemValues) {
  return {
    item_name: values.item_name.trim(),
    price: values.price,
    payment_method: values.payment_method.trim(),
    months: values.months,
    expected_purchase_month: values.expected_purchase_month,
    priority: values.priority,
    need_level: values.need_level,
    notes: values.notes?.trim() ? values.notes.trim() : null,
  };
}

export async function getWishlistItems(): Promise<WishlistItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wishlist_items")
    .select("*")
    .order("expected_purchase_month", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function createWishlistItem(
  values: WishlistItemValues
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("wishlist_items")
    .insert({ user_id: user.id, ...toRow(values) });
  if (error) throw new Error(error.message);
}

export async function updateWishlistItem(
  id: string,
  values: WishlistItemValues
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("wishlist_items")
    .update(toRow(values))
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteWishlistItem(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("wishlist_items")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}

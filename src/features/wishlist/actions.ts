"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { wishlistItemSchema, type WishlistItemValues } from "./schemas";
import {
  createWishlistItem,
  deleteWishlistItem,
  updateWishlistItem,
} from "./repository";

type ActionResult = { error: string } | void;

const SAVE_ERROR = "Không thể lưu dữ liệu. Vui lòng thử lại.";
const DELETE_ERROR = "Không thể xóa dữ liệu. Vui lòng thử lại.";
const INVALID_ERROR = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";

export async function createWishlistItemAction(
  values: WishlistItemValues
): Promise<ActionResult> {
  const parsed = wishlistItemSchema.safeParse(values);
  if (!parsed.success) return { error: INVALID_ERROR };

  try {
    await createWishlistItem(parsed.data);
  } catch {
    return { error: SAVE_ERROR };
  }
  revalidatePath("/wishlist");
}

export async function updateWishlistItemAction(
  id: string,
  values: WishlistItemValues
): Promise<ActionResult> {
  const parsedId = z.string().uuid().safeParse(id);
  const parsed = wishlistItemSchema.safeParse(values);
  if (!parsedId.success || !parsed.success) return { error: INVALID_ERROR };

  try {
    await updateWishlistItem(parsedId.data, parsed.data);
  } catch {
    return { error: SAVE_ERROR };
  }
  revalidatePath("/wishlist");
}

export async function deleteWishlistItemAction(
  id: string
): Promise<ActionResult> {
  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedId.success) return { error: INVALID_ERROR };

  try {
    await deleteWishlistItem(parsedId.data);
  } catch {
    return { error: DELETE_ERROR };
  }
  revalidatePath("/wishlist");
}

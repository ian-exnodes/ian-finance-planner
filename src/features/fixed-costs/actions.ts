"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { fixedCostSchema, type FixedCostValues } from "./schemas";
import {
  createFixedCost,
  deleteFixedCost,
  updateFixedCost,
} from "./repository";

type ActionResult = { error: string } | void;

const SAVE_ERROR = "Không thể lưu dữ liệu. Vui lòng thử lại.";
const DELETE_ERROR = "Không thể xóa dữ liệu. Vui lòng thử lại.";
const INVALID_ERROR = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";

function revalidateFixedCostViews() {
  revalidatePath("/fixed-costs");
  revalidatePath("/dashboard");
}

export async function createFixedCostAction(
  values: FixedCostValues
): Promise<ActionResult> {
  const parsed = fixedCostSchema.safeParse(values);
  if (!parsed.success) return { error: INVALID_ERROR };

  try {
    await createFixedCost(parsed.data);
  } catch {
    return { error: SAVE_ERROR };
  }
  revalidateFixedCostViews();
}

export async function updateFixedCostAction(
  id: string,
  values: FixedCostValues
): Promise<ActionResult> {
  const parsedId = z.string().uuid().safeParse(id);
  const parsed = fixedCostSchema.safeParse(values);
  if (!parsedId.success || !parsed.success) return { error: INVALID_ERROR };

  try {
    await updateFixedCost(parsedId.data, parsed.data);
  } catch {
    return { error: SAVE_ERROR };
  }
  revalidateFixedCostViews();
}

export async function deleteFixedCostAction(
  id: string
): Promise<ActionResult> {
  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedId.success) return { error: INVALID_ERROR };

  try {
    await deleteFixedCost(parsedId.data);
  } catch {
    return { error: DELETE_ERROR };
  }
  revalidateFixedCostViews();
}

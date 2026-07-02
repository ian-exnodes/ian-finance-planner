"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { incomeSchema, type IncomeValues } from "./schemas";
import { createIncome, deleteIncome, updateIncome } from "./repository";

type ActionResult = { error: string } | void;

const SAVE_ERROR = "Không thể lưu dữ liệu. Vui lòng thử lại.";
const DELETE_ERROR = "Không thể xóa dữ liệu. Vui lòng thử lại.";
const INVALID_ERROR = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";

function revalidateIncomeViews() {
  revalidatePath("/incomes");
  revalidatePath("/dashboard");
}

export async function createIncomeAction(
  values: IncomeValues
): Promise<ActionResult> {
  const parsed = incomeSchema.safeParse(values);
  if (!parsed.success) return { error: INVALID_ERROR };

  try {
    await createIncome(parsed.data);
  } catch {
    return { error: SAVE_ERROR };
  }
  revalidateIncomeViews();
}

export async function updateIncomeAction(
  id: string,
  values: IncomeValues
): Promise<ActionResult> {
  const parsedId = z.string().uuid().safeParse(id);
  const parsed = incomeSchema.safeParse(values);
  if (!parsedId.success || !parsed.success) return { error: INVALID_ERROR };

  try {
    await updateIncome(parsedId.data, parsed.data);
  } catch {
    return { error: SAVE_ERROR };
  }
  revalidateIncomeViews();
}

export async function deleteIncomeAction(id: string): Promise<ActionResult> {
  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedId.success) return { error: INVALID_ERROR };

  try {
    await deleteIncome(parsedId.data);
  } catch {
    return { error: DELETE_ERROR };
  }
  revalidateIncomeViews();
}

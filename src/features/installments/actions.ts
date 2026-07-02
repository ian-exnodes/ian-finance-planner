"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { installmentSchema, type InstallmentValues } from "./schemas";
import {
  createInstallment,
  deleteInstallment,
  updateInstallment,
} from "./repository";

type ActionResult = { error: string } | void;

const SAVE_ERROR = "Không thể lưu dữ liệu. Vui lòng thử lại.";
const DELETE_ERROR = "Không thể xóa dữ liệu. Vui lòng thử lại.";
const INVALID_ERROR = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";

function revalidateInstallmentViews() {
  revalidatePath("/installments");
  revalidatePath("/dashboard");
}

export async function createInstallmentAction(
  values: InstallmentValues
): Promise<ActionResult> {
  const parsed = installmentSchema.safeParse(values);
  if (!parsed.success) return { error: INVALID_ERROR };

  try {
    await createInstallment(parsed.data);
  } catch {
    return { error: SAVE_ERROR };
  }
  revalidateInstallmentViews();
}

export async function updateInstallmentAction(
  id: string,
  values: InstallmentValues
): Promise<ActionResult> {
  const parsedId = z.string().uuid().safeParse(id);
  const parsed = installmentSchema.safeParse(values);
  if (!parsedId.success || !parsed.success) return { error: INVALID_ERROR };

  try {
    await updateInstallment(parsedId.data, parsed.data);
  } catch {
    return { error: SAVE_ERROR };
  }
  revalidateInstallmentViews();
}

export async function deleteInstallmentAction(
  id: string
): Promise<ActionResult> {
  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedId.success) return { error: INVALID_ERROR };

  try {
    await deleteInstallment(parsedId.data);
  } catch {
    return { error: DELETE_ERROR };
  }
  revalidateInstallmentViews();
}

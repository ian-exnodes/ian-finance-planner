"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  creditCardSchema,
  creditTransactionSchema,
  type CreditCardValues,
  type CreditTransactionValues,
} from "./schemas";
import {
  createCreditCard,
  createCreditTransaction,
  deleteCreditCard,
  deleteCreditTransaction,
  setTransactionPaid,
  updateCreditCard,
  updateCreditTransaction,
} from "./repository";

type ActionResult = { error: string } | void;

const SAVE_ERROR = "Không thể lưu dữ liệu. Vui lòng thử lại.";
const DELETE_ERROR = "Không thể xóa dữ liệu. Vui lòng thử lại.";
const INVALID_ERROR = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";

const uuid = z.string().uuid();

function revalidateCreditViews() {
  revalidatePath("/credit-cards");
  revalidatePath("/dashboard");
}

export async function createCreditCardAction(
  values: CreditCardValues
): Promise<ActionResult> {
  const parsed = creditCardSchema.safeParse(values);
  if (!parsed.success) return { error: INVALID_ERROR };

  try {
    await createCreditCard(parsed.data);
  } catch {
    return { error: SAVE_ERROR };
  }
  revalidateCreditViews();
}

export async function updateCreditCardAction(
  id: string,
  values: CreditCardValues
): Promise<ActionResult> {
  const parsedId = uuid.safeParse(id);
  const parsed = creditCardSchema.safeParse(values);
  if (!parsedId.success || !parsed.success) return { error: INVALID_ERROR };

  try {
    await updateCreditCard(parsedId.data, parsed.data);
  } catch {
    return { error: SAVE_ERROR };
  }
  revalidateCreditViews();
}

export async function deleteCreditCardAction(
  id: string
): Promise<ActionResult> {
  const parsedId = uuid.safeParse(id);
  if (!parsedId.success) return { error: INVALID_ERROR };

  try {
    await deleteCreditCard(parsedId.data);
  } catch {
    return { error: DELETE_ERROR };
  }
  revalidateCreditViews();
}

export async function createCreditTransactionAction(
  values: CreditTransactionValues
): Promise<ActionResult> {
  const parsed = creditTransactionSchema.safeParse(values);
  if (!parsed.success) return { error: INVALID_ERROR };

  try {
    await createCreditTransaction(parsed.data);
  } catch {
    return { error: SAVE_ERROR };
  }
  revalidateCreditViews();
}

export async function updateCreditTransactionAction(
  id: string,
  values: CreditTransactionValues
): Promise<ActionResult> {
  const parsedId = uuid.safeParse(id);
  const parsed = creditTransactionSchema.safeParse(values);
  if (!parsedId.success || !parsed.success) return { error: INVALID_ERROR };

  try {
    await updateCreditTransaction(parsedId.data, parsed.data);
  } catch {
    return { error: SAVE_ERROR };
  }
  revalidateCreditViews();
}

export async function setTransactionPaidAction(
  id: string,
  paid: boolean
): Promise<ActionResult> {
  const parsedId = uuid.safeParse(id);
  const parsedPaid = z.boolean().safeParse(paid);
  if (!parsedId.success || !parsedPaid.success) return { error: INVALID_ERROR };

  try {
    await setTransactionPaid(parsedId.data, parsedPaid.data);
  } catch {
    return { error: SAVE_ERROR };
  }
  revalidateCreditViews();
}

export async function deleteCreditTransactionAction(
  id: string
): Promise<ActionResult> {
  const parsedId = uuid.safeParse(id);
  if (!parsedId.success) return { error: INVALID_ERROR };

  try {
    await deleteCreditTransaction(parsedId.data);
  } catch {
    return { error: DELETE_ERROR };
  }
  revalidateCreditViews();
}

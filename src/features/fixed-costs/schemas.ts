import { z } from "zod";

export const fixedCostSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên khoản chi"),
  category: z.string().min(1, "Vui lòng nhập danh mục"),
  amount: z.coerce
    .number({ invalid_type_error: "Vui lòng nhập số" })
    .min(0, "Số tiền không được âm"),
  due_day: z.preprocess(
    (v) => (v === "" || v == null ? null : Number(v)),
    z
      .number({ invalid_type_error: "Vui lòng nhập số" })
      .int("Ngày phải là số nguyên")
      .min(1, "Ngày từ 1 đến 31")
      .max(31, "Ngày từ 1 đến 31")
      .nullable()
  ),
  notes: z.string().max(500, "Ghi chú tối đa 500 ký tự").optional(),
});

export type FixedCostValues = z.infer<typeof fixedCostSchema>;

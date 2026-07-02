import { z } from "zod";

const nullableDay = z.preprocess(
  (v) => (v === "" || v == null ? null : Number(v)),
  z
    .number({ invalid_type_error: "Vui lòng nhập số" })
    .int("Ngày phải là số nguyên")
    .min(1, "Ngày từ 1 đến 31")
    .max(31, "Ngày từ 1 đến 31")
    .nullable()
);

export const creditCardSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên thẻ"),
  provider: z.string().min(1, "Vui lòng nhập ngân hàng phát hành"),
  statement_day: nullableDay,
  due_day: nullableDay,
  credit_limit: z.preprocess(
    (v) => (v === "" || v == null ? null : Number(v)),
    z
      .number({ invalid_type_error: "Vui lòng nhập số" })
      .positive("Hạn mức phải lớn hơn 0")
      .nullable()
  ),
  notes: z.string().max(500, "Ghi chú tối đa 500 ký tự").optional(),
});

export type CreditCardValues = z.infer<typeof creditCardSchema>;

export const creditTransactionSchema = z.object({
  card_id: z.string().uuid("Vui lòng chọn thẻ"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Vui lòng chọn ngày hợp lệ"),
  description: z.string().min(1, "Vui lòng nhập nội dung giao dịch"),
  category: z.string().min(1, "Vui lòng nhập danh mục"),
  amount: z.coerce
    .number({ invalid_type_error: "Vui lòng nhập số" })
    .positive("Số tiền phải lớn hơn 0"),
  statement_month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Vui lòng chọn tháng hợp lệ"),
  due_date: z.preprocess(
    (v) => (v === "" || v == null ? null : v),
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Vui lòng chọn ngày hợp lệ")
      .nullable()
  ),
  paid: z.boolean(),
  notes: z.string().max(500, "Ghi chú tối đa 500 ký tự").optional(),
});

export type CreditTransactionValues = z.infer<typeof creditTransactionSchema>;

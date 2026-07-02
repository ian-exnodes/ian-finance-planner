import { z } from "zod";

export const installmentSchema = z.object({
  item_name: z.string().min(1, "Vui lòng nhập tên món hàng"),
  provider: z.string().min(1, "Vui lòng nhập nơi trả góp"),
  type: z.enum(["credit_card", "pay_later", "loan", "other"], {
    invalid_type_error: "Loại không hợp lệ",
  }),
  purchase_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Vui lòng chọn ngày hợp lệ"),
  total_amount: z.coerce
    .number({ invalid_type_error: "Vui lòng nhập số" })
    .positive("Số tiền phải lớn hơn 0"),
  months: z.coerce
    .number({ invalid_type_error: "Vui lòng nhập số" })
    .int("Số tháng phải là số nguyên")
    .min(1, "Số tháng tối thiểu là 1")
    .max(120, "Số tháng tối đa là 120"),
  monthly_payment: z.preprocess(
    (v) => (v === "" || v == null ? null : Number(v)),
    z
      .number({ invalid_type_error: "Vui lòng nhập số" })
      .positive("Số tiền phải lớn hơn 0")
      .nullable()
  ),
  start_month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Vui lòng chọn tháng hợp lệ"),
  due_day: z.preprocess(
    (v) => (v === "" || v == null ? null : Number(v)),
    z
      .number({ invalid_type_error: "Vui lòng nhập số" })
      .int("Ngày phải là số nguyên")
      .min(1, "Ngày từ 1 đến 31")
      .max(31, "Ngày từ 1 đến 31")
      .nullable()
  ),
  status: z.enum(["active", "paid", "paused"], {
    invalid_type_error: "Trạng thái không hợp lệ",
  }),
  notes: z.string().max(500, "Ghi chú tối đa 500 ký tự").optional(),
});

export type InstallmentValues = z.infer<typeof installmentSchema>;

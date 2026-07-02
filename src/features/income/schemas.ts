import { z } from "zod";

export const incomeSchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Vui lòng chọn tháng hợp lệ"),
  salary: z.coerce
    .number({ invalid_type_error: "Vui lòng nhập số" })
    .min(0, "Số tiền không được âm"),
  bonus: z.coerce
    .number({ invalid_type_error: "Vui lòng nhập số" })
    .min(0, "Số tiền không được âm"),
  other: z.coerce
    .number({ invalid_type_error: "Vui lòng nhập số" })
    .min(0, "Số tiền không được âm"),
  notes: z.string().max(500, "Ghi chú tối đa 500 ký tự").optional(),
});

export type IncomeValues = z.infer<typeof incomeSchema>;

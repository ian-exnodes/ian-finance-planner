import { z } from "zod";

export const wishlistItemSchema = z.object({
  item_name: z.string().min(1, "Vui lòng nhập tên món hàng"),
  price: z.coerce
    .number({ invalid_type_error: "Vui lòng nhập số" })
    .positive("Giá phải lớn hơn 0"),
  payment_method: z.string().min(1, "Vui lòng nhập hình thức thanh toán"),
  months: z.coerce
    .number({ invalid_type_error: "Vui lòng nhập số" })
    .int("Số tháng phải là số nguyên")
    .min(1, "Số tháng tối thiểu là 1")
    .max(120, "Số tháng tối đa là 120"),
  expected_purchase_month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Vui lòng chọn tháng hợp lệ"),
  priority: z.enum(["low", "medium", "high"], {
    invalid_type_error: "Mức ưu tiên không hợp lệ",
  }),
  need_level: z.enum(["nice_to_have", "useful", "necessary"], {
    invalid_type_error: "Mức cần thiết không hợp lệ",
  }),
  notes: z.string().max(500, "Ghi chú tối đa 500 ký tự").optional(),
});

export type WishlistItemValues = z.infer<typeof wishlistItemSchema>;

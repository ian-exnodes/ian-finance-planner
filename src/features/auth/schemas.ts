import { z } from "zod";

export const authSchema = z.object({
  email: z
    .string()
    .min(1, "Vui lòng nhập email hợp lệ")
    .email("Vui lòng nhập email hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

export type AuthValues = z.infer<typeof authSchema>;

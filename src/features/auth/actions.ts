"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { type AuthValues } from "./schemas";

type ActionResult = { error: string } | { message: string };

export async function login(values: AuthValues): Promise<ActionResult | void> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(values);

  if (error) {
    return { error: "Email hoặc mật khẩu không đúng" };
  }

  redirect("/dashboard");
}

export async function signup(values: AuthValues): Promise<ActionResult | void> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(values);

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: "Email này đã được đăng ký" };
    }
    return { error: "Đăng ký không thành công. Vui lòng thử lại." };
  }

  if (data.session) {
    redirect("/dashboard");
  }

  return { message: "Vui lòng kiểm tra email để xác nhận tài khoản." };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

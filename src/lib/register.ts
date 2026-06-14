import { z } from "zod";
import { supabase } from "./supabase";

const schema = z.object({
  first_name: z.string().trim().min(1).max(100),
  last_name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(3).max(30),
  email: z.string().trim().email().max(255),
  reason: z.string().trim().min(1).max(200),
  ref: z.enum(["samad", "mehdi"]).optional(),
});

export type RegistrationData = z.infer<typeof schema>;

function registrationErrorMessage(error: { message?: string; code?: string; details?: string }) {
  const msg = error.message ?? "";
  if (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    msg.includes("Could not find the table") ||
    msg.includes("relation") && msg.includes("does not exist")
  ) {
    return "جدول التسجيل غير موجود في Supabase. شغّل migration SQL ثم أعد المحاولة.";
  }
  if (error.code === "42501" || msg.toLowerCase().includes("row-level security")) {
    return "صلاحيات الإدخال غير مفعّلة. أضف سياسة RLS للجدول registrations.";
  }
  if (msg.toLowerCase().includes("invalid api key") || msg.toLowerCase().includes("jwt")) {
    return "مفتاح Supabase غير صالح. تحقق من متغيرات Vercel وأعد النشر.";
  }
  return "تعذّر حفظ التسجيل. حاول مرة أخرى.";
}

export async function registerForLive(data: RegistrationData) {
  const parsed = schema.parse(data);
  const { error } = await supabase.from("registrations").insert(parsed);
  if (error) {
    console.error("[register]", error.message, error.code, error.details);
    throw new Error(registrationErrorMessage(error));
  }
  return { ok: true as const };
}

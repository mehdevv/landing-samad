import { z } from "zod";
import { supabase } from "./supabase";

const schema = z.object({
  first_name: z.string().trim().min(1).max(100),
  last_name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(3).max(30),
  email: z.string().trim().email().max(255),
  reason: z.string().trim().min(1).max(200),
});

export type RegistrationData = z.infer<typeof schema>;

export async function registerForLive(data: RegistrationData) {
  const parsed = schema.parse(data);
  const { error } = await supabase.from("registrations").insert(parsed);
  if (error) {
    console.error("[register]", error);
    throw new Error("Could not save your registration. Please try again.");
  }
  return { ok: true as const };
}

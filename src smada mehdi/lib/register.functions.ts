import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  first_name: z.string().trim().min(1).max(100),
  last_name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(3).max(30),
  email: z.string().trim().email().max(255),
  reason: z.string().trim().min(1).max(200),
});

export const registerForLive = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("registrations").insert(data);
    if (error) {
      console.error("[register]", error);
      throw new Error("Could not save your registration. Please try again.");
    }
    return { ok: true as const };
  });

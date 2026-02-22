import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email").trim(),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormInput = z.infer<typeof loginSchema>;

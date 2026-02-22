import { z } from "zod";

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long")
      .trim(),
    email: z
      .string()
      .email("Please enter a valid email")
      .max(254, "Email is too long")
      .trim()
      .toLowerCase(),
    phone: z
      .string()
      .regex(/^\d{10}$/, "Enter a valid 10-digit number")
      .trim(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormInput = z.infer<typeof signupSchema>;

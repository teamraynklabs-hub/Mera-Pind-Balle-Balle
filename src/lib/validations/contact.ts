import { z } from "zod";

export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(5, "Email is too short")
    .max(254, "Email is too long")
    .toLowerCase(),
  phone: z
    .string()
    .regex(/^[0-9\s\-\+\(\)]*$/, "Invalid phone format")
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must not exceed 5000 characters")
    .trim(),
});

export type ContactFormInput = z.infer<typeof ContactFormSchema>;

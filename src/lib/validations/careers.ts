import { z } from "zod";

export const careersSchema = z.object({
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
    .regex(/^[0-9\s\-\+\(\)]*$/, "Invalid phone format")
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  position: z
    .string()
    .min(2, "Position is required")
    .max(200, "Position is too long")
    .trim(),
  message: z
    .string()
    .max(5000, "Message is too long")
    .optional()
    .or(z.literal("")),
});

export type CareersFormInput = z.infer<typeof careersSchema>;

import { z } from "zod";

export const distributorSchema = z.object({
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
    .min(10, "Phone number is required")
    .max(20, "Phone number is too long")
    .trim(),
  location: z
    .string()
    .min(2, "Location is required")
    .max(100, "Location is too long")
    .trim(),
  businessType: z
    .string()
    .min(1, "Please select a business type"),
  experience: z
    .string()
    .min(1, "Please select your experience"),
  about: z
    .string()
    .min(10, "Tell us about your business (at least 10 characters)")
    .max(5000, "Text is too long")
    .trim(),
});

export type DistributorFormInput = z.infer<typeof distributorSchema>;

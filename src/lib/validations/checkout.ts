import { z } from "zod";

export const checkoutSchema = z.object({
  name: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Name too long"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phone: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
  line1: z
    .string()
    .min(10, "Address must be at least 10 characters"),
  line2: z.string(),
  city: z
    .string()
    .min(1, "City is required"),
  state: z
    .string()
    .min(1, "State is required"),
  pincode: z
    .string()
    .min(1, "Pincode is required")
    .regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

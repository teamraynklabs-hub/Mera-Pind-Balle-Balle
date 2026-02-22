"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserAuth } from "@/context/UserAuthContext";
import { toast } from "sonner";
import { motion } from "motion/react";
import { signupSchema, type SignupFormInput } from "@/lib/validations/signup";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { signup, user } = useUserAuth();

  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInput>({
    resolver: zodResolver(signupSchema),
  });

  if (user) {
    router.replace(redirectTo);
    return null;
  }

  async function onSubmit(data: SignupFormInput) {
    if (submitting) return;
    setSubmitting(true);
    const result = await signup({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
    });
    setSubmitting(false);

    if (result.success) {
      toast.success("Account created successfully");
      router.push(redirectTo);
    } else {
      toast.error(result.error || "Signup failed");
    }
  }

  function fieldClass(field: keyof typeof errors) {
    return errors[field] ? "border-red-500 focus-visible:ring-red-500/30" : "";
  }

  return (
    <main className="min-h-[85vh] flex items-center justify-center px-4 py-16 auth-gradient">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="p-8 sm:p-10 border rounded-2xl shadow-lg bg-card">
          <h1 className="text-2xl font-bold text-center mb-1">Create Account</h1>
          <p className="text-sm text-muted-foreground text-center mb-8">
            Sign up to start shopping
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Your full name"
                autoComplete="name"
                autoFocus
                className={fieldClass("name")}
                {...register("name")}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className={fieldClass("email")}
                {...register("email")}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="10-digit mobile number"
                autoComplete="tel"
                className={fieldClass("phone")}
                {...register("phone")}
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 characters"
                  autoComplete="new-password"
                  className={`pr-10 ${fieldClass("password")}`}
                  {...register("password")}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  className={`pr-10 ${fieldClass("confirmPassword")}`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full cursor-pointer"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-8">
            Already have an account?{" "}
            <Link
              href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
              className="text-primary font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}

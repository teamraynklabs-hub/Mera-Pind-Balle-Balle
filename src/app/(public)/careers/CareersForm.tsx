"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { motion } from "motion/react";
import { Send } from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { careersSchema, type CareersFormInput } from "@/lib/validations/careers";

const inputClasses =
  "w-full px-4 py-3.5 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground/60 text-sm transition-all duration-300 focus:outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20";

const errorInputClasses =
  "w-full px-4 py-3.5 rounded-xl bg-background/50 border border-red-500 text-foreground placeholder:text-muted-foreground/60 text-sm transition-all duration-300 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20";

export default function CareersForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CareersFormInput>({
    resolver: zodResolver(careersSchema),
  });

  const onSubmit = async (data: CareersFormInput) => {
    setLoading(true);
    setApiError(null);

    try {
      const base = getBaseUrl();
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        position: data.position,
        message: data.message || undefined,
      };

      await axios.post(`${base}/api/careers`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      setSent(true);
      reset();
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to submit application. Please try again.";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="career-application-form"
      className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28"
    >
      <ScrollReveal>
        <div className="max-w-3xl mx-auto">
          <div className="bg-card border rounded-2xl shadow-[var(--shadow-medium)] p-8 sm:p-10 md:p-12">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-2 text-center"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Submit Your Application
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Take the first step towards a meaningful career
            </p>

            {sent && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 mb-6 bg-primary/10 border border-primary/20 text-primary rounded-xl text-sm"
              >
                Application submitted successfully! We&apos;ll get back to you
                soon.
              </motion.div>
            )}

            {apiError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 mb-6 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm"
              >
                {apiError}
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name <span className="text-[var(--gold)]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className={errors.name ? errorInputClasses : inputClasses}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address <span className="text-[var(--gold)]">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Email Address"
                  className={errors.email ? errorInputClasses : inputClasses}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className={errors.phone ? errorInputClasses : inputClasses}
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Position Applying For{" "}
                  <span className="text-[var(--gold)]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Field Coordinator, Marketing Executive"
                  className={errors.position ? errorInputClasses : inputClasses}
                  {...register("position")}
                />
                {errors.position && (
                  <p className="text-xs text-destructive mt-1">{errors.position.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Cover Letter / Message{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  placeholder="Tell us about yourself, your experience, and why you'd like to join..."
                  rows={5}
                  className={`${errors.message ? errorInputClasses : inputClasses} resize-none`}
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-xs text-destructive mt-1">{errors.message.message}</p>
                )}
              </div>

              <div className="md:col-span-2 flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--gold)] text-[var(--gold-foreground)] font-semibold transition-all duration-300 hover:shadow-[0_0_24px_oklch(0.75_0.14_80/0.35)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  {loading ? (
                    "Submitting..."
                  ) : (
                    <>
                      Submit Application
                      <Send
                        size={16}
                        className="group-hover:translate-x-0.5 transition-transform duration-300"
                      />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

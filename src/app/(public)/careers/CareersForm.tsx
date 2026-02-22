"use client";

import { useState } from "react";
import axios from "axios";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { motion } from "motion/react";
import { Send } from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";

const inputClasses =
  "w-full px-4 py-3.5 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground/60 text-sm transition-all duration-300 focus:outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20";

export default function CareersForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const base = getBaseUrl();

      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        position: form.position.trim(),
        message: form.message.trim() || undefined,
      };

      await axios.post(`${base}/api/careers`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      setSent(true);
      setForm({ name: "", email: "", phone: "", position: "", message: "" });
    } catch (err: any) {
      console.error("CAREERS FORM ERROR:", err);
      const msg =
        err.response?.data?.error ||
        err.message ||
        "Failed to submit application. Please try again.";
      setError(msg);
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

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 mb-6 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={submitForm} className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name <span className="text-[var(--gold)]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className={inputClasses}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address <span className="text-[var(--gold)]">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className={inputClasses}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className={inputClasses}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Position Applying For{" "}
                  <span className="text-[var(--gold)]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Field Coordinator, Marketing Executive"
                  required
                  className={inputClasses}
                  value={form.position}
                  onChange={(e) =>
                    setForm({ ...form, position: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Cover Letter / Message{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  placeholder="Tell us about yourself, your experience, and why you'd like to join..."
                  rows={5}
                  className={inputClasses + " resize-none"}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                />
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

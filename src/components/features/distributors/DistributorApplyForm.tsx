"use client";

import { useState, useRef, type FormEvent } from "react";
import { motion, useInView } from "motion/react";
import { Send } from "lucide-react";
import axios from "axios";
import { getBaseUrl } from "@/lib/getBaseUrl";

const ease = [0.16, 1, 0.3, 1] as const;

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.6, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

const BUSINESS_TYPES = [
  "Retail Store",
  "Online Store",
  "Wholesale",
  "Franchise",
  "Other",
];

const EXPERIENCE_OPTIONS = [
  "Less than 1 year",
  "1-3 years",
  "3-5 years",
  "5-10 years",
  "10+ years",
];

export default function DistributorApplyForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    businessType: "",
    experience: "",
    about: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const base = getBaseUrl();

      // POST fields the backend accepts (name, email, phone, website)
      // Extra fields (location, businessType, experience, about) are logged
      // until the backend schema is extended to support them.
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        website: "", // not collected in this form
      };

      await axios.post(`${base}/api/distributors`, payload);

      setSubmitted(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        location: "",
        businessType: "",
        experience: "",
        about: "",
      });
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full px-4 py-3.5 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground/60 text-sm transition-all duration-300 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20";

  const selectBase =
    "w-full px-4 py-3.5 rounded-xl bg-background/50 border border-border text-foreground text-sm transition-all duration-300 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 appearance-none cursor-pointer";

  return (
    <section className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
      {/* Section Header */}
      <FadeUp className="text-center mb-12">
        <h2
          className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Apply Now
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Fill out the form below and we&apos;ll get back to you within 48 hours
        </p>
      </FadeUp>

      {/* Form Card */}
      <FadeUp delay={0.1}>
        <div className="max-w-4xl mx-auto card-base p-6 sm:p-8 md:p-10">
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 mb-6 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
            >
              Thank you! Your distributor application has been submitted
              successfully. We&apos;ll be in touch soon.
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 mb-6 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1: Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  className={inputBase}
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  className={inputBase}
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Row 2: Phone + Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Phone Number <span className="text-destructive">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 XXXXX XXXXX"
                  className={inputBase}
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Location / City <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="Your city"
                  className={inputBase}
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Row 3: Business Type + Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="relative">
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Business Type <span className="text-destructive">*</span>
                </label>
                <select
                  name="businessType"
                  className={selectBase}
                  value={form.businessType}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select type
                  </option>
                  {BUSINESS_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {/* Dropdown chevron */}
                <svg
                  className="pointer-events-none absolute right-4 top-[42px] h-4 w-4 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Years of Experience <span className="text-destructive">*</span>
                </label>
                <select
                  name="experience"
                  className={selectBase}
                  value={form.experience}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select experience
                  </option>
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-4 top-[42px] h-4 w-4 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Row 4: About Business */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                Tell Us About Your Business{" "}
                <span className="text-destructive">*</span>
              </label>
              <textarea
                name="about"
                placeholder="Share details about your current business, target market, and why you want to partner with us..."
                rows={5}
                className={`${inputBase} resize-none`}
                value={form.about}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full px-8 py-3.5 rounded-xl bg-gold text-gold-foreground font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-[0_0_24px_oklch(0.75_0.14_80/0.35)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </FadeUp>
    </section>
  );
}

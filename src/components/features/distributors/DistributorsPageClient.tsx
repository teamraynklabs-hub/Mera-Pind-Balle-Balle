"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { motion, useInView } from "motion/react";
import {
  Heart,
  Gem,
  TrendingUp,
  Users,
  Award,
  CheckCircle,
  Send,
} from "lucide-react";
import axios from "axios";
import { getBaseUrl } from "@/lib/getBaseUrl";

/* ── Types ── */

interface BenefitItem {
  title: string;
  description: string;
}

interface StepItem {
  title: string;
  description: string;
}

interface DistributorsPageData {
  hero: { title: string; subtitle: string; bannerImage: string };
  benefits: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: BenefitItem[];
  };
  requirements: {
    sectionTitle: string;
    sectionSubtitle: string;
    image: string;
    items: string[];
  };
  steps: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: StepItem[];
  };
  formSection: { title: string; subtitle: string };
}

interface DistributorsPageClientProps {
  initialData: DistributorsPageData;
}

/* ── Constants ── */

const ease = [0.16, 1, 0.3, 1] as const;

const FALLBACK_BANNER = "/photo1.png";

const BENEFIT_ICONS = [Heart, Gem, TrendingUp, Users, Award, CheckCircle];

function getBenefitIcon(index: number) {
  return BENEFIT_ICONS[index % BENEFIT_ICONS.length];
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

/* ── Fade-up animation wrapper ── */

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

/* ── ScrollReveal ── */

function ScrollReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease }}
    >
      {children}
    </motion.div>
  );
}

/* ── Main Component ── */

export default function DistributorsPageClient({
  initialData,
}: DistributorsPageClientProps) {
  const [data, setData] = useState<DistributorsPageData>(initialData);

  /* Form state */
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

  /* Fetch fresh data on mount for real-time updates */
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/distributors-page", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (json?.success && json.data) {
          setData(json.data);
        }
      } catch {
        /* keep initial data */
      }
    }
    fetchData();
  }, []);

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
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        website: "",
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
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const bannerImg =
    data.hero.bannerImage && data.hero.bannerImage.trim()
      ? data.hero.bannerImage
      : FALLBACK_BANNER;

  const requirementsImg =
    data.requirements.image && data.requirements.image.trim()
      ? data.requirements.image
      : "/photo2.png";

  const inputBase =
    "w-full px-4 py-3.5 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground/60 text-sm transition-all duration-300 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20";

  const selectBase =
    "w-full px-4 py-3.5 rounded-xl bg-background/50 border border-border text-foreground text-sm transition-all duration-300 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 appearance-none cursor-pointer";

  return (
    <>
      {/* ── 1. HERO ── */}
      <section className="relative overflow-hidden">
        <div className="relative w-full h-[50vh] min-h-[320px] max-h-[480px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bannerImg}
            alt={data.hero.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4 md:px-8 max-w-3xl mx-auto">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {data.hero.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease }}
                className="text-base sm:text-lg lg:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
              >
                {data.hero.subtitle}
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. BENEFITS ── */}
      <section className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
        <ScrollReveal className="text-center mb-14">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {data.benefits.sectionTitle}
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            {data.benefits.sectionSubtitle}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.benefits.items.map((item, i) => {
            const Icon = getBenefitIcon(i);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease }}
                className="group p-6 sm:p-7 rounded-2xl bg-card border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-deep)] hover:-translate-y-1.5 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center mb-5 group-hover:bg-[var(--gold)] group-hover:text-white transition-all duration-500">
                  <Icon
                    size={24}
                    className="text-[var(--gold)] group-hover:text-white transition-colors duration-500"
                  />
                </div>

                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── 3. REQUIREMENTS ── */}
      <section className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
        <div className="grid items-center gap-10 lg:gap-16 md:grid-cols-2">
          {/* Left — Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-[var(--shadow-deep)] border aspect-[4/3] bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={requirementsImg}
                alt={data.requirements.sectionTitle}
                className="w-full h-full object-cover absolute inset-0"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Right — Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
          >
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {data.requirements.sectionTitle}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-8">
              {data.requirements.sectionSubtitle}
            </p>

            <ul className="space-y-4">
              {data.requirements.items.map((req, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle
                    size={20}
                    className="text-[var(--gold)] mt-0.5 shrink-0"
                  />
                  <span className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    {req}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ── 4. STEPS ── */}
      <section className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
        <ScrollReveal className="text-center mb-14">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {data.steps.sectionTitle}
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            {data.steps.sectionSubtitle}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 max-w-4xl mx-auto">
          {data.steps.items.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--gold)] text-[var(--gold-foreground)] text-xl font-bold mb-4 shadow-lg">
                {String(i + 1).padStart(2, "0")}
              </div>

              <h3
                className="text-lg font-semibold mb-1.5"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 5. APPLICATION FORM ── */}
      <section className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
        <FadeUp className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {data.formSection.title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {data.formSection.subtitle}
          </p>
        </FadeUp>

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
                    Location / City{" "}
                    <span className="text-destructive">*</span>
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
                    Years of Experience{" "}
                    <span className="text-destructive">*</span>
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
    </>
  );
}

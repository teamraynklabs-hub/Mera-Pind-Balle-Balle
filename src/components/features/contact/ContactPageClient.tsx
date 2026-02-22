"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MapPin, Phone, Mail, Send, Clock, Globe, Building } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { ContactFormSchema, type ContactFormInput } from "@/lib/validations/contact";

/* ── Types ── */

interface ContactInfoItem {
  icon: string;
  title: string;
  lines: string[];
  href: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface ContactPageData {
  hero: { title: string; subtitle: string; image: string };
  contactInfo: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: ContactInfoItem[];
  };
  formSection: { title: string; subtitle: string };
  faqs: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: FaqItem[];
  };
}

interface ContactPageClientProps {
  initialData: ContactPageData;
}

/* ── Icon map ── */
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "map-pin": MapPin,
  phone: Phone,
  mail: Mail,
  clock: Clock,
  globe: Globe,
  building: Building,
};

function getIcon(name: string) {
  return ICON_MAP[name] || Mail;
}

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
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Main Component ── */
export default function ContactPageClient({ initialData }: ContactPageClientProps) {
  const [data, setData] = useState<ContactPageData>(initialData);

  /* Form state */
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    reset,
    formState: { errors: formErrors },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(ContactFormSchema),
  });

  /* ── Fetch fresh data on mount for real-time updates ── */
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/contact-page", { cache: "no-store" });
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

  const onSubmit = async (formData: ContactFormInput) => {
    setLoading(true);
    try {
      const base = getBaseUrl();
      await axios.post(`${base}/api/contact`, formData);
      setSent(true);
      reset();
      setTimeout(() => setSent(false), 5000);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full px-4 py-3.5 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground/60 text-sm transition-all duration-300 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20";

  const inputError =
    "w-full px-4 py-3.5 rounded-xl bg-background/50 border border-red-500 text-foreground placeholder:text-muted-foreground/60 text-sm transition-all duration-300 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20";

  return (
    <>
      {/* ── PAGE HERO ── */}
      <section className="text-center pt-28 pb-4 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-28">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.hero.title}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {data.hero.subtitle}
        </p>
        {data.hero.image && (
          <Image
            src={data.hero.image}
            alt={data.hero.title}
            width={1200}
            height={400}
            className="mt-8 w-full max-w-4xl mx-auto rounded-2xl object-cover max-h-80"
          />
        )}
      </section>

      {/* ── CONTACT FORM + INFO SECTION ── */}
      <div className="section-container">
        <section className="section-padding">
          {/* Section Header */}
          <FadeUp className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {data.contactInfo.sectionTitle}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              {data.contactInfo.sectionSubtitle}
            </p>
          </FadeUp>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* LEFT — Contact Form (3/5) */}
            <FadeUp delay={0.1} className="lg:col-span-3">
              <div className="card-base p-6 sm:p-8 md:p-10">
                <h3 className="text-xl sm:text-2xl font-semibold mb-1">
                  {data.formSection.title}
                </h3>
                {data.formSection.subtitle && (
                  <p className="text-sm text-muted-foreground mb-6">
                    {data.formSection.subtitle}
                  </p>
                )}

                {sent && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 mb-6 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
                  >
                    Your message has been sent successfully! We&apos;ll get back
                    to you soon.
                  </motion.div>
                )}

                <form onSubmit={rhfHandleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        className={formErrors.name ? inputError : inputBase}
                        {...register("name")}
                      />
                      {formErrors.name && (
                        <p className="text-xs text-destructive mt-1">{formErrors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className={formErrors.email ? inputError : inputBase}
                        {...register("email")}
                      />
                      {formErrors.email && (
                        <p className="text-xs text-destructive mt-1">{formErrors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        className={formErrors.phone ? inputError : inputBase}
                        {...register("phone")}
                      />
                      {formErrors.phone && (
                        <p className="text-xs text-destructive mt-1">{formErrors.phone.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        placeholder="What is this about?"
                        className={formErrors.subject ? inputError : inputBase}
                        {...register("subject")}
                      />
                      {formErrors.subject && (
                        <p className="text-xs text-destructive mt-1">{formErrors.subject.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                      Message
                    </label>
                    <textarea
                      placeholder="Tell us how we can help..."
                      rows={5}
                      className={`${formErrors.message ? inputError : inputBase} resize-none`}
                      {...register("message")}
                    />
                    {formErrors.message && (
                      <p className="text-xs text-destructive mt-1">{formErrors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gold text-gold-foreground font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-[0_0_24px_oklch(0.75_0.14_80/0.35)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </FadeUp>

            {/* RIGHT — Contact Info Cards (2/5) */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {(data.contactInfo.items || []).map((card, i) => {
                const IconComp = getIcon(card.icon);
                return (
                  <FadeUp key={card.title + i} delay={0.2 + i * 0.1}>
                    <div className="card-interactive p-6 sm:p-7 group">
                      <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-gold/20 group-hover:scale-110">
                        <IconComp size={22} className="text-gold" />
                      </div>
                      <h4 className="text-lg font-semibold mb-2">{card.title}</h4>
                      {(card.lines || []).map((line, idx) =>
                        card.href ? (
                          <a
                            key={idx}
                            href={card.href}
                            className="block text-muted-foreground text-sm leading-relaxed hover:text-gold transition-colors duration-200"
                          >
                            {line}
                          </a>
                        ) : (
                          <p
                            key={idx}
                            className="text-muted-foreground text-sm leading-relaxed"
                          >
                            {line}
                          </p>
                        )
                      )}
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* ── SEPARATOR ── */}
      <div className="section-container">
        <div className="border-t border-border/60 my-4" />
      </div>

      {/* ── FAQ SECTION ── */}
      {(data.faqs.items || []).length > 0 && (
        <section className="section-container section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold italic mb-3">
              {data.faqs.sectionTitle}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              {data.faqs.sectionSubtitle}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-5">
            {(data.faqs.items || []).map((faq, idx) => (
              <FadeUp key={idx} delay={idx * 0.05}>
                <div className="card-base p-6 sm:p-7">
                  <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

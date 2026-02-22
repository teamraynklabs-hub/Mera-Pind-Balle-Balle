"use client";

import { useState, type FormEvent } from "react";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import axios from "axios";
import { getBaseUrl } from "@/lib/getBaseUrl";

/* ── Contact Info Data ── */
const contactCards = [
  {
    icon: MapPin,
    title: "Address",
    lines: ["123 Heritage Lane", "New Delhi, India 110001"],
  },
  {
    icon: Phone,
    title: "Phone",
    lines: ["+91 12345 67890"],
    href: "tel:+911234567890",
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["hello@merapind.com"],
    href: "mailto:hello@merapind.com",
  },
];

/* ── Fade-up wrapper ── */
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
export default function ContactFormSection() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const base = getBaseUrl();
      await axios.post(`${base}/api/contact`, form);
      setSent(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSent(false), 5000);
    } catch {
      // Silently handled — toast or error UI can be added
    } finally {
      setLoading(false);
    }
  };

  /* ── Shared input classes ── */
  const inputBase =
    "w-full px-4 py-3.5 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground/60 text-sm transition-all duration-300 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20";

  return (
    <section className="section-padding">
      {/* ── Two-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* LEFT — Contact Form (3/5) */}
        <FadeUp delay={0.1} className="lg:col-span-3">
          <div className="card-base p-6 sm:p-8 md:p-10">
            <h3 className="text-xl sm:text-2xl font-semibold mb-6">
              Send Us a Message
            </h3>

            {sent && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 mb-6 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
              >
                Your message has been sent successfully! We&apos;ll get back to
                you soon.
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    className={inputBase}
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className={inputBase}
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Phone + Subject row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 XXXXX XXXXX"
                    className={inputBase}
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="What is this about?"
                    className={inputBase}
                    value={form.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  placeholder="Tell us how we can help..."
                  rows={5}
                  className={`${inputBase} resize-none`}
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Submit Button */}
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
          {contactCards.map((card, i) => (
            <FadeUp key={card.title} delay={0.2 + i * 0.1}>
              <div className="card-interactive p-6 sm:p-7 group">
                {/* Icon Circle */}
                <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-gold/20 group-hover:scale-110">
                  <card.icon size={22} className="text-gold" />
                </div>

                <h4 className="text-lg font-semibold mb-2">{card.title}</h4>

                {card.lines.map((line, idx) =>
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
          ))}
        </div>
      </div>
    </section>
  );
}

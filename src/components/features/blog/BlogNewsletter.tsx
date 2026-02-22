"use client";

import { Send } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";

export default function BlogNewsletter() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    /* TODO: POST /api/newsletter when endpoint is ready */
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section
      ref={ref}
      className="section-padding border-t border-border"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="section-container max-w-2xl text-center"
      >
        <h2
          className="text-3xl sm:text-4xl font-bold mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <span className="text-[#D4A336] italic">Stay Inspired</span>
        </h2>

        <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-lg mx-auto">
          Subscribe to receive stories, updates, and exclusive insights from our
          artisan community.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-5 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground shadow-[var(--shadow-soft)] focus:shadow-[var(--shadow-medium)] focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
          />
          <button
            type="submit"
            className="px-8 py-3.5 rounded-xl bg-[#D4A336] hover:bg-[#c4932e] text-white font-semibold text-sm tracking-wide transition-all duration-300 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] flex items-center justify-center gap-2"
          >
            <Send size={16} />
            Subscribe
          </button>
        </form>

        {submitted && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary text-sm mt-4 font-medium"
          >
            Thank you for subscribing!
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}

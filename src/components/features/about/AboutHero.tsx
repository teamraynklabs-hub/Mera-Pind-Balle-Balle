"use client";

import { motion } from "motion/react";

interface AboutHeroProps {
  title?: string;
  subtitle?: string;
}

const FALLBACK_TITLE = "Weaving Dreams into Reality";
const FALLBACK_SUBTITLE =
  "Marketplace empowering rural women artisans across India";

const ease = [0.16, 1, 0.3, 1] as const;

export default function AboutHero({ title, subtitle }: AboutHeroProps) {
  const heading = title || FALLBACK_TITLE;
  const sub = subtitle || FALLBACK_SUBTITLE;

  return (
    <section className="relative overflow-hidden min-h-[60vh] md:min-h-[70vh] flex items-center justify-center">
      {/* Dark gradient background — no image */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a]" />
      {/* Subtle primary color glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.06] via-transparent to-primary/[0.04]" />

      {/* Content — Centered */}
      <div className="relative z-10 text-center px-4 md:px-8 max-w-4xl mx-auto py-20 md:py-28">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="text-sm sm:text-base uppercase tracking-[0.3em] text-white/50 mb-6"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          About Us
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {heading}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease }}
          className="text-lg sm:text-xl lg:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed"
        >
          {sub}
        </motion.p>
      </div>
    </section>
  );
}

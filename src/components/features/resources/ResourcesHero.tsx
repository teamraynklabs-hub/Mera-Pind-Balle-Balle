"use client";

import { motion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

export default function ResourcesHero() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden py-28 md:py-40 lg:py-48">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#141420] to-[#0a0a0a]" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-[var(--gold)]/[0.03]" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 md:px-8 max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Resource Center
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease }}
          className="text-base sm:text-lg lg:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
        >
          Download catalogs, guides, and educational materials about our products
          and artisan communities.
        </motion.p>
      </div>
    </section>
  );
}

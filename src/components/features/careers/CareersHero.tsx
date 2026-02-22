"use client";

import { motion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

export default function CareersHero() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden py-30 md:py-44 lg:py-52 bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/50 to-background" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-[var(--gold)]/[0.03]" />

      <div className="relative z-10 text-center px-4 md:px-8 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Build Your Career with Purpose
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease }}
          className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Join our mission to empower rural women artisans while building a
          fulfilling career. We&apos;re looking for passionate individuals who
          want to make a real impact.
        </motion.p>
      </div>
    </section>
  );
}

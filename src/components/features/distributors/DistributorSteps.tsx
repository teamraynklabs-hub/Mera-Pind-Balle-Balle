"use client";

import { motion } from "motion/react";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { STEPS } from "./distributorData";

const ease = [0.16, 1, 0.3, 1] as const;

export default function DistributorSteps() {
  return (
    <section className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
      {/* Section Header */}
      <ScrollReveal className="text-center mb-14">
        <h2
          className="text-3xl sm:text-4xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          How It Works
        </h2>
        <p className="mt-3 text-muted-foreground text-lg">
          Simple steps to become our distribution partner
        </p>
      </ScrollReveal>

      {/* Steps Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 max-w-4xl mx-auto">
        {STEPS.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.12, ease }}
            className="text-center"
          >
            {/* Number Circle */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--gold)] text-[var(--gold-foreground)] text-xl font-bold mb-4 shadow-lg">
              {step.number}
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
  );
}

"use client";

import { Lightbulb, Target, Sprout, HandHeart } from "lucide-react";
import { motion } from "motion/react";
import ScrollReveal from "@/components/motion/ScrollReveal";

interface Initiative {
  title: string;
  description: string;
}

interface HomeInitiativesProps {
  initiatives: Initiative[];
}

const ease = [0.16, 1, 0.3, 1] as const;

const ICON_CYCLE = [Lightbulb, Target, Sprout, HandHeart];

export default function HomeInitiatives({
  initiatives,
}: HomeInitiativesProps) {
  const visible = initiatives.filter(
    (item) => item.title && item.title.trim() !== ""
  );
  if (visible.length === 0) return null;

  return (
    <section className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
      {/* Section Header */}
      <ScrollReveal className="text-center mb-14">
        <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-3">
          What We Do
        </p>
        <h2
          className="text-3xl sm:text-4xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Our Initiatives
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Driving meaningful change through purpose-led programs
        </p>
      </ScrollReveal>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((item, i) => {
          const Icon = ICON_CYCLE[i % ICON_CYCLE.length];

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              className="group relative p-7 sm:p-8 rounded-2xl border bg-card shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-deep)] hover:-translate-y-1 transition-all duration-500"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                <Icon size={24} />
              </div>

              {/* Title */}
              <h3
                className="text-lg font-semibold tracking-tight mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-[15px] leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

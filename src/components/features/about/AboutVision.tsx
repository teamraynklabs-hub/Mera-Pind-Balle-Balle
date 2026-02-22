"use client";

import { motion } from "motion/react";
import { Eye } from "lucide-react";

interface AboutVisionProps {
  title?: string;
  description?: string;
  image?: string;
}

const FALLBACK_TITLE = "A World Where Tradition Meets Opportunity";
const FALLBACK_DESCRIPTION =
  "We envision a future where every rural woman artisan has the opportunity to earn a dignified living through her craft, where traditional techniques are celebrated globally, and where handmade products are valued for their authenticity and story.";
const FALLBACK_IMAGE = "/hero.png";

const ease = [0.16, 1, 0.3, 1] as const;

export default function AboutVision({ title, description, image }: AboutVisionProps) {
  const heading = title || FALLBACK_TITLE;
  const desc = description || FALLBACK_DESCRIPTION;
  const img = image && image.trim() !== "" ? image : FALLBACK_IMAGE;

  return (
    <section className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
      <div className="grid items-center gap-10 lg:gap-16 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="order-2 md:order-1"
        >
          <div className="flex items-center gap-2 mb-3">
            <Eye size={16} className="text-primary" />
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium">
              Our Vision
            </p>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {heading}
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed text-base md:text-lg max-w-prose">
            {desc}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease }}
          className="order-1 md:order-2"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-[var(--shadow-deep)] border aspect-[4/3] bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt={heading}
              className="w-full h-full object-cover absolute inset-0"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "motion/react";
import { Target } from "lucide-react";

interface AboutMissionProps {
  title?: string;
  description?: string;
  image?: string;
}

const FALLBACK_TITLE = "Preserving Heritage, Creating Futures";
const FALLBACK_DESCRIPTION =
  "We connect skilled rural women artisans directly with conscious consumers, ensuring fair wages, preserving traditional crafts, and building sustainable livelihoods. Through skill development, fair pricing, and community support, we are transforming villages one family at a time.";
const FALLBACK_IMAGE = "/photo1.png";

const ease = [0.16, 1, 0.3, 1] as const;

export default function AboutMission({ title, description, image }: AboutMissionProps) {
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
          transition={{ duration: 0.7, ease }}
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

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Target size={16} className="text-primary" />
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium">
              Our Mission
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
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { motion } from "motion/react";

interface AboutHeroProps {
  title?: string;
  subtitle?: string;
  image?: string;
}

const FALLBACK_TITLE = "Weaving Dreams into Reality";
const FALLBACK_SUBTITLE =
  "Mera Pind Balle Balle is more than a marketplace—it's a movement to empower rural women artisans, preserve traditional crafts, and create sustainable livelihoods across India.";

const ease = [0.16, 1, 0.3, 1] as const;

export default function AboutHero({ title, subtitle, image }: AboutHeroProps) {
  const heading = title || FALLBACK_TITLE;
  const sub = subtitle || FALLBACK_SUBTITLE;
  const hasImage = image && image.trim() !== "";

  return (
    <section className="relative flex items-center justify-center overflow-hidden py-30 md:py-44 lg:py-52 bg-background">
      {hasImage ? (
        <>
          <Image
            src={image!}
            alt={heading}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/65" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/50 to-background" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-[var(--gold)]/[0.03]" />
        </>
      )}

      <div className="relative z-10 text-center px-4 md:px-8 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${hasImage ? "text-white" : "text-foreground"}`}
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {heading}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease }}
          className={`text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed ${hasImage ? "text-white/60" : "text-muted-foreground"}`}
        >
          {sub}
        </motion.p>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

interface HomeMissionSectionProps {
  title?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
}

const FALLBACK_TITLE = "Our Mission: Preserving Heritage, Creating Futures";
const FALLBACK_DESCRIPTION =
  "Mera Pind Balle Balle connects skilled rural women artisans directly with conscious consumers, ensuring fair wages, preserving traditional crafts, and building sustainable livelihoods.";
const FALLBACK_DESCRIPTION_2 =
  "Every purchase you make empowers a family, preserves centuries-old techniques, and contributes to a more sustainable and equitable world.";
const FALLBACK_BUTTON_TEXT = "Learn More About Us";
const FALLBACK_BUTTON_LINK = "/about";

const ease = [0.16, 1, 0.3, 1] as const;

export default function HomeMissionSection({
  title,
  description,
  image,
  buttonText,
  buttonLink,
}: HomeMissionSectionProps) {
  const heading = title || FALLBACK_TITLE;
  const desc = description || FALLBACK_DESCRIPTION;
  const ctaText = buttonText || FALLBACK_BUTTON_TEXT;
  const ctaLink = buttonLink || FALLBACK_BUTTON_LINK;
  const hasImage = image && image.trim() !== "";

  return (
    <section className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
      <div
        className={`grid items-center gap-10 lg:gap-16 ${
          hasImage ? "md:grid-cols-2" : "max-w-3xl mx-auto"
        }`}
      >
        {/* Left — Image */}
        {hasImage && (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-[var(--shadow-deep)] border aspect-[4/3]">
              <Image
                src={image}
                alt={heading}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </motion.div>
        )}

        {/* Right — Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
        >
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {heading}
          </h2>

          <p className="mt-6 text-muted-foreground leading-relaxed text-base md:text-lg max-w-prose">
            {desc}
          </p>

          {/* Second paragraph — show fallback if no custom description */}
          {!description && (
            <p className="mt-4 text-muted-foreground leading-relaxed text-base md:text-lg max-w-prose">
              {FALLBACK_DESCRIPTION_2}
            </p>
          )}

          <Button asChild className="mt-8" variant="outline" size="lg">
            <Link href={ctaLink}>
              {ctaText}
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import ParallaxImage from "@/components/motion/ParallaxImage";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  image: string;
  primaryCTA: { label: string; link: string };
  secondaryCTA: { label: string; link: string };
}

export default function HeroSection({
  title,
  subtitle,
  image,
  primaryCTA,
  secondaryCTA,
}: HeroSectionProps) {
  // Split title into two lines for styling (first line white, second line gold)
  const titleParts = title.split(/\n|(?<=Women)\s+(?=Through)/i);
  const firstLine = titleParts[0] || title;
  const secondLine = titleParts.length > 1 ? titleParts.slice(1).join(" ") : "";

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <div className="absolute inset-0 z-0">
        <ParallaxImage
          src={image}
          alt="Mera Pind Balle Balle"
          speed={0.2}
          className="h-full w-full"
          imgClassName="brightness-[0.85]"
          priority
          sizes="100vw"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      </div>

      {/* Hero Content — Centered */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 text-center px-4 max-w-4xl"
      >
        {/* Brand Name */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-sm sm:text-base uppercase tracking-[0.3em] text-white/70 mb-6"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Mera Pind Balle Balle
        </motion.p>

        {/* Title */}
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {firstLine}
          {secondLine && (
            <>
              <br />
              <span className="text-[#D4A336] italic">{secondLine}</span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-xl sm:text-2xl text-white/90 mb-8 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-base px-8 py-6"
          >
            <Link href={primaryCTA.link}>
              {primaryCTA.label}
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20 text-base px-8 py-6"
          >
            <Link href={secondaryCTA.link}>{secondaryCTA.label}</Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/80"
      >
        <ChevronDown className="h-8 w-8 animate-bounce" />
      </motion.div>
    </section>
  );
}

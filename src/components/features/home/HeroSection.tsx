"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ParallaxImage from "@/components/motion/ParallaxImage";
import TextReveal from "@/components/motion/TextReveal";
import ScrollReveal from "@/components/motion/ScrollReveal";

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
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
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
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
        <div className="max-w-2xl">
          <TextReveal
            text={title}
            as="h1"
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight"
            staggerDelay={0.05}
            duration={0.5}
          />

          <ScrollReveal delay={0.4} y={16}>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
              {subtitle}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.6} y={16}>
            <div className="mt-10 flex gap-4 flex-wrap">
              <Button asChild size="lg" className="text-base px-8 py-6">
                <Link href={primaryCTA.link}>
                  {primaryCTA.label}
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="text-base px-8 py-6"
              >
                <Link href={secondaryCTA.link}>{secondaryCTA.label}</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Scroll indicator */}
      <ScrollReveal
        delay={1.2}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 rounded-full border-2 border-foreground/20 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-2.5 rounded-full bg-foreground/40 animate-[fadeUp_1.5s_ease-in-out_infinite]" />
        </div>
      </ScrollReveal>
    </section>
  );
}

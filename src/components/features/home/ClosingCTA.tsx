"use client";

import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import TextReveal from "@/components/motion/TextReveal";
import ScrollReveal from "@/components/motion/ScrollReveal";

interface ClosingCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  link?: string;
}

export default function ClosingCTA({
  title,
  description,
  buttonText,
  link,
}: ClosingCTAProps) {
  const heading = title || "Ready to Make a Difference?";
  const subtitle =
    description ||
    "Every purchase supports rural artisans and empowers communities. Join us in creating lasting impact.";
  const primaryText = buttonText || "Shop Now";
  const primaryLink = link || "/products";

  return (
    <section className="relative overflow-hidden">
      {/* Full-width gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-[var(--gold)]/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />

      <div className="relative container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto">
          <ScrollReveal y={12}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Heart size={14} />
              Join the Movement
            </div>
          </ScrollReveal>

          <TextReveal
            text={heading}
            as="h2"
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5"
            staggerDelay={0.04}
          />

          <ScrollReveal delay={0.3} y={12}>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              {subtitle}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.5} y={12}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="text-base px-10 py-6 shadow-lg hover:shadow-primary/25 hover:shadow-xl transition-all duration-300"
              >
                <Link href={primaryLink}>
                  {primaryText}
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </Button>
             
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

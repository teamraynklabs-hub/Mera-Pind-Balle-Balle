"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/motion/ScrollReveal";

export default function StoriesCTA() {
  return (
    <section className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
      <ScrollReveal>
        <div className="relative overflow-hidden rounded-2xl bg-card border shadow-[var(--shadow-deep)]">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-[var(--gold)]/[0.04]" />

          <div className="relative text-center px-6 sm:px-12 py-16 md:py-20">
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Support Artisan Stories
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Every product in our collection carries a story. Shop our
              handcrafted treasures and be part of these incredible journeys.
            </p>
            <Button
              asChild
              size="lg"
              className="text-base px-10 py-6 shadow-lg hover:shadow-primary/25 hover:shadow-xl transition-all duration-300"
            >
              <Link href="/products">
                Explore Our Collection
                <ArrowRight
                  size={18}
                  className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                />
              </Link>
            </Button>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

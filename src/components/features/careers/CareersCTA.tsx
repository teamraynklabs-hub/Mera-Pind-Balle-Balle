"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";

export default function CareersCTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[var(--gold)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)] via-[var(--gold)] to-[oklch(0.6_0.15_75)]" />

      <div className="relative container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto">
          <ScrollReveal y={12}>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5 text-[var(--gold-foreground)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Don&apos;t See the Right Fit?
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2} y={12}>
            <p className="text-[var(--gold-foreground)]/80 text-lg max-w-xl mx-auto mb-4 leading-relaxed">
              We&apos;re always looking for talented individuals who share our
              mission.
            </p>
            <p className="text-[var(--gold-foreground)]/80 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Send us your resume and let&apos;s talk!
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.4} y={12}>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--gold-foreground)] text-[var(--gold)] font-semibold transition-all duration-300 hover:shadow-[0_0_24px_oklch(0.3_0.05_75/0.4)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Get in Touch
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

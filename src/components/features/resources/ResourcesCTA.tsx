"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";

export default function ResourcesCTA() {
  return (
    <section className="container mx-auto px-4 md:px-8 lg:px-12 pb-16 md:pb-24">
      <ScrollReveal>
        <div className="relative rounded-2xl border border-border bg-card overflow-hidden py-14 md:py-20 px-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_oklch(0_0_0/0.12),0_4px_8px_oklch(0_0_0/0.06)]">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/[0.04] via-transparent to-primary/[0.03]" />

          <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-[var(--gold)]/15 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-[var(--gold)]" strokeWidth={1.5} />
            </div>

            <h2
              className="text-2xl sm:text-3xl font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Need Something Specific?
            </h2>

            <p className="text-muted-foreground leading-relaxed max-w-md">
              Can&apos;t find what you&apos;re looking for? Contact our team and
              we&apos;ll be happy to provide custom resources or additional
              information.
            </p>

            <Link
              href="/contact"
              className="mt-2 inline-flex items-center justify-center px-8 py-3 rounded-lg bg-[var(--gold)] text-[var(--gold-foreground)] font-medium text-sm transition-all duration-300 hover:shadow-[0_0_20px_var(--gold)/30] hover:brightness-110 active:scale-[0.98]"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

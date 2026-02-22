"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";

export default function ViewAllProductsStrip() {
  return (
    <section className="border-y bg-accent/20">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-10 md:py-14">
        <ScrollReveal>
          <div className="flex items-center justify-center">
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 text-lg md:text-xl font-semibold text-foreground hover:text-primary transition-colors duration-300"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              View All Products
              <ArrowRight
                size={20}
                className="group-hover:translate-x-2 transition-transform duration-300"
              />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import StaggerContainer from "@/components/motion/StaggerContainer";
import TiltCard from "@/components/motion/TiltCard";
import ScrollReveal from "@/components/motion/ScrollReveal";

interface CategoryGridProps {
  categories: string[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null;

  return (
    <section className="bg-accent/30">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
        <ScrollReveal className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Shop by Category
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our curated collections
          </p>
        </ScrollReveal>

        <StaggerContainer
          className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          staggerDelay={0.08}
        >
          {categories.map((cat, i) => (
            <TiltCard key={i} maxTilt={6} scale={1.03}>
              <Link
                href={`/products?category=${encodeURIComponent(cat)}`}
                className="group flex items-center justify-center p-8 md:p-10 border rounded-2xl bg-card shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-deep)] hover:border-primary/30 transition-all duration-500"
              >
                <span className="text-lg font-semibold group-hover:text-primary transition-colors duration-300">
                  {cat}
                </span>
              </Link>
            </TiltCard>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

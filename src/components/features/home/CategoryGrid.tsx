"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import ScrollReveal from "@/components/motion/ScrollReveal";

interface CategoryWithImage {
  name: string;
  image?: string;
  description?: string;
  productCount?: number;
}

interface CategoryGridProps {
  categories: CategoryWithImage[];
}

const ease = [0.16, 1, 0.3, 1] as const;

// Fallback descriptions when backend doesn't provide them
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "handwoven textiles": "Traditional handwoven fabrics crafted by rural women artisans",
  "handcrafted jewelry": "Elegant jewelry pieces made with traditional techniques",
  "home decor": "Artisanal home decor items bringing rural charm to your space",
  "natural skincare": "Organic skincare products made from traditional recipes",
  "organic food": "Pure organic food products sourced from rural farms",
  "pottery": "Handcrafted pottery items with traditional rural designs",
  "bamboo crafts": "Eco-friendly bamboo products handmade by skilled artisans",
  "clothing": "Traditional clothing crafted with heritage techniques",
};

function getCategoryDescription(name: string, description?: string): string {
  if (description) return description;
  const key = name.toLowerCase().trim();
  if (CATEGORY_DESCRIPTIONS[key]) return CATEGORY_DESCRIPTIONS[key];
  return `Explore our curated ${name.toLowerCase()} collection`;
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null;

  return (
    <section className="bg-accent/30">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
        <ScrollReveal className="text-center mb-14">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Shop by Category
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collection of handcrafted products
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease }}
            >
              <Link
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group relative block rounded-2xl overflow-hidden aspect-[4/5] border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-deep)] transition-shadow duration-500"
              >
                {/* Background Image or Gradient Fallback */}
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-accent group-hover:from-primary/30 group-hover:via-primary/15 transition-colors duration-500" />
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors duration-500" />

                {/* Content at bottom */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3
                    className="text-xl font-bold text-white mb-1.5"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {cat.name}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {getCategoryDescription(cat.name, cat.description)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

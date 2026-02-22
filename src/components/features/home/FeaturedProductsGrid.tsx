"use client";

import { motion } from "motion/react";
import ScrollReveal from "@/components/motion/ScrollReveal";
import ProductCard from "@/components/features/products/ProductCard";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  isFeatured?: boolean;
  stock?: number;
}

interface FeaturedProductsGridProps {
  products: Product[];
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function FeaturedProductsGrid({ products }: FeaturedProductsGridProps) {
  if (products.length === 0) return null;

  return (
    <section className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
      <ScrollReveal className="text-center mb-14">
        <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-3">
          Handpicked for You
        </p>
        <h2
          className="text-3xl sm:text-4xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Featured Products
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our most loved products, crafted with care by rural artisans
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 8).map((product, i) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

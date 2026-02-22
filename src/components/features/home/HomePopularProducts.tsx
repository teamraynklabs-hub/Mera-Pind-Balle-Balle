"use client";

import Image from "next/image";
import { TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import ScrollReveal from "@/components/motion/ScrollReveal";

interface PopularProduct {
  title: string;
  description: string;
  image: string;
}

interface HomePopularProductsProps {
  products: PopularProduct[];
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function HomePopularProducts({
  products,
}: HomePopularProductsProps) {
  const visible = products.filter(
    (p) => p.title && p.title.trim() !== ""
  );
  if (visible.length === 0) return null;

  return (
    <section className="relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-primary/[0.06] to-primary/[0.03]" />

      <div className="relative container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-14">
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-3">
            Trending Now
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Popular Products
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Community favorites loved by customers across India
          </p>
        </ScrollReveal>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {visible.map((product, i) => {
            const hasImage = product.image && product.image.trim() !== "";

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.12, ease }}
                className="group rounded-2xl border bg-card overflow-hidden shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-deep)] hover:-translate-y-1.5 transition-all duration-500"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-accent/50">
                  {hasImage ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent">
                      <TrendingUp
                        size={40}
                        className="text-primary/30"
                      />
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3
                    className="text-lg font-semibold tracking-tight mb-2 line-clamp-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {product.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

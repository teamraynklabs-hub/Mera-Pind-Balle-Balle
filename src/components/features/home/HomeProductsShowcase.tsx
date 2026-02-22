"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/features/products/ProductCard";
import ScrollReveal from "@/components/motion/ScrollReveal";
import StaggerContainer from "@/components/motion/StaggerContainer";

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

interface HomeProductsShowcaseProps {
  products: Product[];
}

export default function HomeProductsShowcase({
  products,
}: HomeProductsShowcaseProps) {
  const visible = products.filter((p) => p.name && p.name.trim() !== "");
  if (visible.length === 0) return null;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-primary/[0.06] to-primary/[0.03]" />

      <div className="relative container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <ShoppingBag size={14} />
            Our Store
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Explore Our Products
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover handcrafted, sustainable products made with love by rural artisans
          </p>
        </ScrollReveal>

        {/* Products Grid */}
        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          staggerDelay={0.06}
        >
          {visible.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </StaggerContainer>

        {/* View All link */}
        <ScrollReveal delay={0.2} className="text-center mt-12">
          <Button size="lg" asChild>
            <Link href="/products">
              View All Products
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}

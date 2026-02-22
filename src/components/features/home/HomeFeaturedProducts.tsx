"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

interface HomeFeaturedProductsProps {
  products: Product[];
}

export default function HomeFeaturedProducts({ products }: HomeFeaturedProductsProps) {
  const visible = products.filter((p) => p.name && p.name.trim() !== "");
  if (visible.length === 0) return null;

  return (
    <section className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
      {/* Section Header */}
      <ScrollReveal className="text-center mb-14">
        <h2
          className="text-3xl sm:text-4xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Featured Collection
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Handpicked treasures from our most talented artisans
        </p>
      </ScrollReveal>

      {/* Products Grid — matches Products page layout */}
      <StaggerContainer
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        staggerDelay={0.06}
      >
        {visible.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </StaggerContainer>

      {/* View All link */}
      <ScrollReveal delay={0.2} className="text-center mt-12">
        <Button variant="outline" size="lg" asChild>
          <Link href="/products">
            View All Products
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </Button>
      </ScrollReveal>
    </section>
  );
}

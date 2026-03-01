"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/features/products/ProductCard";
import { motion } from "motion/react";
import ScrollReveal from "@/components/motion/ScrollReveal";

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

interface HomeProductsCarouselProps {
  products: Product[];
}

export default function HomeProductsCarousel({
  products,
}: HomeProductsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const visible = products.filter((p) => p.name && p.name.trim() !== "");
  if (visible.length === 0) return null;

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    // Scroll by roughly one card width + gap
    const cardWidth = el.querySelector<HTMLElement>(":scope > div")?.offsetWidth || 300;
    const amount = cardWidth + 24;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Header - Centered */}
        <ScrollReveal>
          <div className="text-center mb-12 relative flex flex-col items-center">
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-3">
              Our Store
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Our Products
            </h2>
            <p className="mt-3 text-muted-foreground text-lg max-w-xl mx-auto">
              Handcrafted with love by rural artisans across India
            </p>

            {/* Desktop arrows - Now absolute to sides or kept integrated */}
            <div className="hidden sm:flex items-center gap-3 mt-8">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className="w-11 h-11 rounded-full border bg-card flex items-center justify-center hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md"
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className="w-11 h-11 rounded-full border bg-card flex items-center justify-center hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Horizontal Scroll Track with Snapping and Animation */}
        <div className="relative">
          <div
            ref={scrollRef}
            suppressHydrationWarning
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mb-4 xl:px-[10%] lg:px-[10%] scrollbar-hide"
          >
            {visible.map((product, i) => (
              <motion.div
                key={product._id}
                suppressHydrationWarning
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.12, // Increased stagger for "loading" effect
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="w-[280px] sm:w-[300px] lg:w-[310px] shrink-0 snap-center"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          {/* Left fade edge */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
          )}

          {/* Right fade edge */}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
          )}
        </div>

        {/* Mobile arrows */}
        <div className="flex sm:hidden items-center justify-center gap-3 mt-6">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="w-10 h-10 rounded-full border bg-card flex items-center justify-center hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="w-10 h-10 rounded-full border bg-card flex items-center justify-center hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* View All */}
        <ScrollReveal delay={0.15} className="text-center mt-10">
          <Button variant="outline" size="lg" asChild>
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

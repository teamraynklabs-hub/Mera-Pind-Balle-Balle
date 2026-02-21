"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/motion/ScrollReveal";

interface ProductSpotlightProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
    description: string;
  };
}

export default function ProductSpotlight({ product }: ProductSpotlightProps) {
  return (
    <section className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
      <ScrollReveal>
        <div className="relative rounded-3xl overflow-hidden bg-card border shadow-[var(--shadow-medium)]">
          {/* Large product image */}
          <div className="relative aspect-[16/10] md:aspect-[16/7]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 90vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          </div>

          {/* Floating detail card */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="max-w-lg">
              <ScrollReveal delay={0.2} y={16}>
                <p className="text-sm font-medium text-primary mb-2 tracking-wide uppercase">
                  Featured Product
                </p>
                <h3 className="text-2xl sm:text-3xl font-bold mb-2">
                  {product.name}
                </h3>
                <p className="text-muted-foreground line-clamp-2 mb-4">
                  {product.description}
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-primary tabular-nums">
                    ₹{product.price}
                  </span>
                  <Button asChild size="lg">
                    <Link href={`/product/${product._id}`}>
                      View Product
                      <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </Button>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

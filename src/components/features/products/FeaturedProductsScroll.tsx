"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/motion/ScrollReveal";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export default function FeaturedProductsScroll({
  products,
}: {
  products: Product[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  }

  if (products.length === 0) return null;

  return (
    <ScrollReveal delay={0.15}>
      <div className="relative">
        {products.length > 3 && (
          <>
            <button
              onClick={() => scroll("left")}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-background border shadow-(--shadow-soft) rounded-full p-2.5 hover:bg-accent active:scale-95 transition hidden md:flex items-center justify-center"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-background border shadow-(--shadow-soft) rounded-full p-2.5 hover:bg-accent active:scale-95 transition hidden md:flex items-center justify-center"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/product/${product._id}`}
              className="snap-start shrink-0 w-72 bg-card border rounded-2xl shadow-(--shadow-soft) overflow-hidden hover:shadow-(--shadow-deep) transition-shadow duration-500 group"
            >
              <div className="relative w-full aspect-4/3 overflow-hidden bg-muted">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-103 transition-transform duration-500"
                  sizes="288px"
                />
              </div>

              <div className="p-5">
                <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold text-primary tabular-nums">
                    ₹{product.price}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="cursor-pointer"
                    tabIndex={-1}
                  >
                    <ShoppingCart size={14} className="mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}

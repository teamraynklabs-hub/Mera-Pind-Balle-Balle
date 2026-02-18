"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useUserAuth } from "@/context/UserAuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  const { addToCart } = useCart();
  const { user, loading } = useUserAuth();
  const router = useRouter();

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  }

  function handleAdd(product: Product) {
    if (!loading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(`/product/${product._id}`)}`);
      return;
    }
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    toast.success(`${product.name} added to cart`);
  }

  if (products.length === 0) return null;

  return (
    <div className="relative">
      {products.length > 3 && (
        <>
          <button
            onClick={() => scroll("left")}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-background border shadow-md rounded-full p-2 hover:bg-accent active:scale-95 transition hidden md:flex items-center justify-center"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-background border shadow-md rounded-full p-2 hover:bg-accent active:scale-95 transition hidden md:flex items-center justify-center"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="snap-start shrink-0 w-64 bg-card border rounded-xl shadow-xs overflow-hidden hover:shadow-md transition-shadow group"
          >
            <Link href={`/product/${product._id}`}>
              <div className="relative w-full aspect-4/3 overflow-hidden bg-muted">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="280px"
                />
              </div>
            </Link>

            <div className="p-4">
              <Link href={`/product/${product._id}`}>
                <h3 className="font-semibold line-clamp-1 hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                {product.description}
              </p>

              <div className="flex items-center justify-between mt-3">
                <span className="text-lg font-bold text-primary tabular-nums">
                  ₹{product.price}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => handleAdd(product)}
                >
                  <ShoppingCart size={14} className="mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

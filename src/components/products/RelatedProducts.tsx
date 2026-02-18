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
}

export default function RelatedProducts({ products }: { products: Product[] }) {
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
    <section className="mt-16 pt-10 border-t">
      <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>

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
              className="snap-start shrink-0 w-50 sm:w-55 bg-card border rounded-xl shadow-xs overflow-hidden hover:shadow-md transition-shadow group"
            >
              <Link href={`/product/${product._id}`}>
                <div className="relative w-full aspect-square overflow-hidden bg-muted">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="220px"
                  />
                </div>
              </Link>

              <div className="p-3.5">
                <Link href={`/product/${product._id}`}>
                  <h3 className="font-semibold text-sm line-clamp-1 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="font-bold text-primary tabular-nums">₹{product.price}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="cursor-pointer h-8 text-xs"
                    onClick={() => handleAdd(product)}
                  >
                    <ShoppingCart size={12} className="mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

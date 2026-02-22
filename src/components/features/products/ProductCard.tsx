"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category?: string;
    isFeatured?: boolean;
    stock?: number;
  };
}

import { memo } from "react";

function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-card border rounded-2xl overflow-hidden shadow-(--shadow-soft) hover:shadow-(--shadow-deep) hover:-translate-y-1 transition-all duration-500 flex flex-col h-full">
      {/* Image Section */}
      <div className="relative w-full aspect-square overflow-hidden bg-muted">
        <Link href={`/product/${product._id}`} className="block w-full h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 pointer-events-none">
          {product.isFeatured && (
            <Badge className="bg-primary text-primary-foreground shadow-sm">
              Featured
            </Badge>
          )}
        </div>

        {/* Low Stock Badge */}
        {product.stock !== undefined &&
          product.stock > 0 &&
          product.stock <= 5 && (
            <Badge
              variant="secondary"
              className="absolute top-3 right-3 z-10 bg-yellow-500/90 text-white border-0 pointer-events-none shadow-sm"
            >
              Only {product.stock} left
            </Badge>
          )}

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <Badge
              variant="destructive"
              className="text-sm px-4 py-1.5 border-0"
            >
              Out of Stock
            </Badge>
          </div>
        )}

        {/* Hover Overlay with Buttons */}
        {product.stock !== 0 && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/95 hover:bg-white text-foreground border-0 cursor-pointer shadow-md"
              asChild
            >
              <Link href={`/product/${product._id}`}>
                <ShoppingCart size={15} className="mr-1.5" />
                Add to Cart
              </Link>
            </Button>
            <Button
              size="sm"
              className="cursor-pointer shadow-md"
              asChild
            >
              <Link href={`/product/${product._id}`}>
                <Zap size={15} className="mr-1.5" />
                Buy Now
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category */}
        {product.category && (
          <p className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wider font-medium">
            {product.category}
          </p>
        )}

        {/* Product Name */}
        <Link href={`/product/${product._id}`}>
          <h3 className="font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-primary tabular-nums">
            ₹{product.price}
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);

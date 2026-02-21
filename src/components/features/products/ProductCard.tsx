"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-card border rounded-2xl shadow-(--shadow-soft) overflow-hidden hover:shadow-(--shadow-deep) transition-shadow duration-500 group flex flex-col">
      <Link href={`/product/${product._id}`}>
        <div className="relative w-full aspect-4/3 overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-103 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <Link href={`/product/${product._id}`}>
          <h3 className="font-semibold mb-1 hover:text-primary transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        <p className="text-xl font-bold text-primary mb-4 tabular-nums">
          ₹{product.price}
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-10 cursor-pointer"
            asChild
          >
            <Link href={`/product/${product._id}`}>
              <ShoppingCart size={15} className="mr-1.5" />
              Add to Cart
            </Link>
          </Button>
          <Button
            size="sm"
            className="flex-1 h-10 cursor-pointer"
            asChild
          >
            <Link href={`/product/${product._id}`}>
              <Zap size={15} className="mr-1.5" />
              Buy Now
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

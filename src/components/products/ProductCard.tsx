"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useUserAuth } from "@/context/UserAuthContext";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

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
  const { addToCart } = useCart();
  const { user, loading } = useUserAuth();
  const router = useRouter();
  const pathname = usePathname();

  function handleAddToCart() {
    if (!loading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
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

  function handleBuyNow() {
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
    router.push("/cart");
  }

  return (
    <div className="bg-card border rounded-xl shadow-xs overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
      <Link href={`/product/${product._id}`}>
        <div className="relative w-full aspect-4/3 overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      </Link>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <Link href={`/product/${product._id}`}>
          <h3 className="font-semibold mb-1 hover:text-primary transition-colors line-clamp-1">
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
            onClick={handleAddToCart}
          >
            <ShoppingCart size={15} className="mr-1.5" />
            Add to Cart
          </Button>
          <Button
            size="sm"
            className="flex-1 h-10 cursor-pointer"
            onClick={handleBuyNow}
          >
            <Zap size={15} className="mr-1.5" />
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}

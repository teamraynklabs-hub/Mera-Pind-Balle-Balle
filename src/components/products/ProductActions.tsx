"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useUserAuth } from "@/context/UserAuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProductActionsProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user, loading } = useUserAuth();
  const router = useRouter();

  function handleAddToCart() {
    if (!loading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(`/product/${product._id}`)}`);
      return;
    }
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
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
      quantity,
    });
    router.push("/cart");
  }

  return (
    <div className="space-y-5">
      {/* Quantity Selector */}
      <div>
        <label className="text-sm font-medium mb-2.5 block text-muted-foreground">
          Quantity
        </label>
        <div className="inline-flex items-center gap-3 border rounded-xl p-1.5 bg-card">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >
            <Minus size={16} />
          </Button>
          <span className="text-lg font-semibold w-8 text-center tabular-nums">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            disabled={quantity >= 10}
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="lg"
          className="flex-1 cursor-pointer"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={18} className="mr-2" />
          Add to Cart
        </Button>
        <Button
          size="lg"
          className="flex-1 cursor-pointer"
          onClick={handleBuyNow}
        >
          <Zap size={18} className="mr-2" />
          Buy Now
        </Button>
      </div>
    </div>
  );
}

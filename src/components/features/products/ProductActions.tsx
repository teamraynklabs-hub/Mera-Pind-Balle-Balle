"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useUserAuth } from "@/context/UserAuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CheckoutDrawer from "@/components/features/cart/CheckoutDrawer";

interface ProductActionsProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
    stock?: number;
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();
  const { user, loading } = useUserAuth();
  const router = useRouter();

  const maxQty = product.stock && product.stock > 0 ? Math.min(product.stock, 10) : 10;

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

  function handleWishlist() {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  }

  return (
    <>
      <div className="space-y-5">
        {/* Quantity Selector */}
        <div>
          <label className="text-sm font-medium mb-2.5 block">
            Quantity
          </label>
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center border rounded-xl overflow-hidden bg-card">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 h-10 flex items-center justify-center text-base font-semibold tabular-nums border-x">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                disabled={quantity >= maxQty}
                className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>
            {product.stock && product.stock > 0 && (
              <span className="text-sm text-muted-foreground">
                {product.stock} available
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            size="lg"
            className="flex-1 h-12 cursor-pointer text-base"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={18} className="mr-2" />
            Add to Cart
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 shrink-0 cursor-pointer"
            onClick={handleWishlist}
          >
            <Heart
              size={20}
              className={isWishlisted ? "fill-red-500 text-red-500" : ""}
            />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 shrink-0 cursor-pointer"
            onClick={handleShare}
          >
            <Share2 size={20} />
          </Button>
        </div>
      </div>

      <CheckoutDrawer open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  );
}

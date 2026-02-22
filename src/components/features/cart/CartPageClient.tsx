"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";

const CheckoutDrawer = dynamic(() => import("./CheckoutDrawer"), {
  ssr: false,
});

export default function CartPageClient() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-4 py-24 text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
            <ShoppingBag size={36} className="text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven&apos;t added any products yet. Browse our
            collection and find something you love.
          </p>
          <Button asChild size="lg">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12 sm:py-16 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <Link
          href="/products"
          className="p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -80 }}
                transition={{ duration: 0.25 }}
                className="flex gap-4 sm:gap-5 p-4 sm:p-5 bg-card border rounded-2xl shadow-(--shadow-soft) hover:shadow-(--shadow-medium) transition-shadow duration-500"
              >
                {/* Image */}
                <Link
                  href={`/product/${item.productId}`}
                  className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-muted"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.productId}`}
                    className="font-semibold text-sm sm:text-base hover:text-primary transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-primary font-bold text-sm sm:text-base mt-0.5">
                    ₹{item.price}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2.5">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      className="cursor-pointer"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                    >
                      <Minus size={14} />
                    </Button>
                    <span className="w-8 text-center text-sm font-semibold tabular-nums">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      className="cursor-pointer"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          Math.min(10, item.quantity + 1)
                        )
                      }
                      disabled={item.quantity >= 10}
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                </div>

                {/* Line Total & Remove */}
                <div className="flex flex-col items-end justify-between ml-2">
                  <p className="font-bold text-sm sm:text-base tabular-nums">
                    ₹{item.price * item.quantity}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-destructive cursor-pointer"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card/95 backdrop-blur-lg border rounded-2xl p-6 shadow-(--shadow-soft) sticky top-20">
            <h2 className="text-lg font-semibold mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Subtotal ({items.length} {items.length === 1 ? "item" : "items"})
                </span>
                <span className="font-medium tabular-nums">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-medium text-primary">Free</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg tabular-nums">₹{totalPrice}</span>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full mt-6 cursor-pointer"
              onClick={() => setCheckoutOpen(true)}
            >
              Proceed to Checkout
            </Button>

            {/* Trust Signals */}
            <div className="mt-5 pt-5 border-t flex items-center justify-center gap-6">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Shield size={14} className="text-primary" />
                <span className="text-xs font-medium">Secure</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Truck size={14} className="text-primary" />
                <span className="text-xs font-medium">Free Shipping</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Estimated delivery within 7–10 business days
            </p>
          </div>
        </div>
      </div>

      {/* Checkout Drawer */}
      <CheckoutDrawer
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </main>
  );
}

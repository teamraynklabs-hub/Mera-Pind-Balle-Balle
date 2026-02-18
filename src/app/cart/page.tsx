import type { Metadata } from "next";
import CartPageClient from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "Cart — Mera Pind Balle Balle",
  description: "Review your cart and proceed to checkout.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartPageClient />;
}

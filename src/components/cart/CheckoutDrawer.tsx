"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, User, MapPin, Banknote, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";
import { useUserAuth } from "@/context/UserAuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validations/checkout";

interface CheckoutDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CheckoutDrawer({ open, onClose }: CheckoutDrawerProps) {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useUserAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  useEffect(() => {
    if (open && user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        line1: user.address?.line1 || "",
        line2: user.address?.line2 || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        pincode: user.address?.pincode || "",
      });
    }
  }, [open, user, reset]);

  useEffect(() => {
    const firstError = Object.keys(errors)[0] as keyof CheckoutFormData | undefined;
    if (firstError) {
      setFocus(firstError);
    }
  }, [errors, setFocus]);

  async function onSubmit(data: CheckoutFormData) {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: data.name.trim(),
            email: data.email.trim(),
            phone: data.phone.trim(),
            address: {
              line1: data.line1.trim(),
              line2: (data.line2 || "").trim(),
              city: data.city.trim(),
              state: data.state.trim(),
              pincode: data.pincode.trim(),
            },
          },
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          paymentMethod: "COD",
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Failed to place order");
        return;
      }

      clearCart();
      onClose();
      router.push(`/order-success/${result.data._id}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  function inputClasses(fieldName: keyof CheckoutFormData) {
    return errors[fieldName] ? "border-red-500 focus-visible:ring-red-500/30" : "";
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-background border-l shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <h2 className="text-xl font-bold">Checkout</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex-1 overflow-y-auto"
            >
              <div className="p-6 space-y-7">
                {/* Section 1: Customer Info */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-md bg-primary/10">
                      <User size={16} className="text-primary" />
                    </div>
                    <h3 className="font-semibold">Personal Information</h3>
                  </div>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        placeholder="Your full name"
                        className={inputClasses("name")}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500">{errors.name.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="your@email.com"
                        className={inputClasses("email")}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500">{errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Mobile Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register("phone")}
                        placeholder="10-digit mobile number"
                        className={inputClasses("phone")}
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-500">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Section 2: Address */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-md bg-primary/10">
                      <MapPin size={16} className="text-primary" />
                    </div>
                    <h3 className="font-semibold">Delivery Address</h3>
                  </div>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="line1">Address *</Label>
                      <Input
                        id="line1"
                        {...register("line1")}
                        placeholder="House/Flat No., Street"
                        className={inputClasses("line1")}
                      />
                      {errors.line1 && (
                        <p className="text-xs text-red-500">{errors.line1.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="line2">Address Line 2</Label>
                      <Input
                        id="line2"
                        {...register("line2")}
                        placeholder="Landmark, Area (Optional)"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          {...register("city")}
                          placeholder="City"
                          className={inputClasses("city")}
                        />
                        {errors.city && (
                          <p className="text-xs text-red-500">{errors.city.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          {...register("state")}
                          placeholder="State"
                          className={inputClasses("state")}
                        />
                        {errors.state && (
                          <p className="text-xs text-red-500">{errors.state.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        {...register("pincode")}
                        placeholder="6-digit pincode"
                        className={inputClasses("pincode")}
                      />
                      {errors.pincode && (
                        <p className="text-xs text-red-500">{errors.pincode.message}</p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Section 3: Payment Method */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-md bg-primary/10">
                      <Banknote size={16} className="text-primary" />
                    </div>
                    <h3 className="font-semibold">Payment Method</h3>
                  </div>
                  <div className="p-4 border rounded-xl bg-card">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="COD"
                        checked
                        readOnly
                        className="accent-primary w-4 h-4"
                      />
                      <div>
                        <p className="font-medium text-sm">Cash on Delivery</p>
                        <p className="text-xs text-muted-foreground">
                          Pay when your order arrives
                        </p>
                      </div>
                    </label>
                  </div>
                </section>

                {/* Order Summary */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-md bg-primary/10">
                      <Package size={16} className="text-primary" />
                    </div>
                    <h3 className="font-semibold">Order Summary</h3>
                  </div>
                  <div className="space-y-2.5 rounded-xl border bg-card p-4">
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-muted-foreground truncate mr-4">
                          {item.name} &times; {item.quantity}
                        </span>
                        <span className="font-medium tabular-nums shrink-0">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                    <div className="border-t pt-2.5 flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-primary tabular-nums">₹{totalPrice}</span>
                    </div>
                  </div>
                </section>
              </div>

              {/* Footer */}
              <div className="p-6 border-t bg-background sticky bottom-0">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    `Place Order — ₹${totalPrice}`
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

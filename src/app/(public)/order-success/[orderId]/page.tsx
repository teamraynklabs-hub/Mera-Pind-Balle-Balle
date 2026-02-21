import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order.model";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, MapPin, CreditCard, Calendar } from "lucide-react";

interface Props {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `Order Confirmed — Mera Pind Balle Balle`,
    description: `Your order ${orderId} has been placed successfully.`,
    robots: { index: false, follow: false },
  };
}

export default async function OrderSuccessPage({ params }: Props) {
  const { orderId } = await params;

  await connectDB();

  let order;
  try {
    order = await Order.findById(orderId).lean();
  } catch {
    notFound();
  }

  if (!order) notFound();

  const data = JSON.parse(JSON.stringify(order));

  const estimatedDate = new Date(data.estimatedDelivery).toLocaleDateString(
    "en-IN",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <main className="container mx-auto px-4 py-14 sm:py-20 max-w-2xl">
      {/* Success Icon */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <CheckCircle2 size={44} className="text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-muted-foreground">
          Thank you for your order. We&apos;ll begin processing it shortly.
        </p>
      </div>

      {/* Order Number Card */}
      <div className="bg-card border rounded-xl p-6 mb-6 text-center shadow-xs">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
          Order Number
        </p>
        <p className="text-2xl font-bold text-primary tabular-nums">
          {data.orderNumber}
        </p>
      </div>

      {/* Order Details */}
      <div className="bg-card border rounded-xl p-6 space-y-6 mb-8 shadow-xs">
        {/* Items */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Package size={16} className="text-primary" />
            </div>
            <h3 className="font-semibold">Items Ordered</h3>
          </div>
          <div className="space-y-2">
            {data.items.map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.name} &times; {item.quantity}
                </span>
                <span className="font-medium tabular-nums">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
            <div className="border-t pt-2.5 flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-primary tabular-nums">₹{data.total}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-1.5 rounded-md bg-primary/10">
              <MapPin size={16} className="text-primary" />
            </div>
            <h3 className="font-semibold">Delivery Address</h3>
          </div>
          <div className="text-sm text-muted-foreground space-y-0.5 pl-9">
            <p className="font-medium text-foreground">{data.customer.name}</p>
            <p>{data.customer.address.line1}</p>
            {data.customer.address.line2 && (
              <p>{data.customer.address.line2}</p>
            )}
            <p>
              {data.customer.address.city}, {data.customer.address.state} —{" "}
              {data.customer.address.pincode}
            </p>
            <p>{data.customer.phone}</p>
          </div>
        </div>

        {/* Payment */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-1.5 rounded-md bg-primary/10">
              <CreditCard size={16} className="text-primary" />
            </div>
            <h3 className="font-semibold">Payment</h3>
          </div>
          <p className="text-sm text-muted-foreground pl-9">
            {data.paymentMethod === "COD"
              ? "Cash on Delivery"
              : "Online Payment"}{" "}
            — {data.paymentStatus}
          </p>
        </div>

        {/* Estimated Delivery */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Calendar size={16} className="text-primary" />
            </div>
            <h3 className="font-semibold">Estimated Delivery</h3>
          </div>
          <p className="text-sm text-muted-foreground pl-9">{estimatedDate}</p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Button asChild size="lg">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    </main>
  );
}

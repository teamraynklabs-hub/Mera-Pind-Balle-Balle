import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order.model";
import Product from "@/lib/models/Product.model";
import { getUserFromCookie } from "@/lib/auth/user-jwt";

export async function POST(req: Request) {
  try {
    // Verify authenticated user
    const authUser = await getUserFromCookie();
    if (!authUser) {
      return NextResponse.json(
        { error: "Authentication required. Please log in." },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await req.json();

    const { customer, items, paymentMethod } = body;

    // Validate required fields
    if (
      !customer?.name ||
      !customer?.email ||
      !customer?.phone ||
      !customer?.address?.line1 ||
      !customer?.address?.city ||
      !customer?.address?.state ||
      !customer?.address?.pincode
    ) {
      return NextResponse.json(
        { error: "All customer fields are required" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "At least one item is required" },
        { status: 400 }
      );
    }

    if (!paymentMethod || !["COD", "ONLINE"].includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Valid payment method is required" },
        { status: 400 }
      );
    }

    // Server-side price validation — fetch real prices from DB
    const productIds = items.map((i: any) => i.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds }, isActive: true }).lean();

    if (dbProducts.length !== items.length) {
      return NextResponse.json(
        { error: "One or more products are unavailable" },
        { status: 400 }
      );
    }

    const priceMap = new Map(
      dbProducts.map((p: any) => [p._id.toString(), p])
    );

    let subtotal = 0;
    const verifiedItems = items.map((item: any) => {
      const dbProduct = priceMap.get(item.productId);
      if (!dbProduct) {
        throw new Error(`Product ${item.productId} not found`);
      }
      const lineTotal = dbProduct.price * item.quantity;
      subtotal += lineTotal;
      return {
        productId: item.productId,
        name: dbProduct.name,
        price: dbProduct.price,
        quantity: item.quantity,
        image: dbProduct.image,
      };
    });

    const total = subtotal; // No delivery charge

    const order = await Order.create({
      userId: authUser.userId,
      customer,
      items: verifiedItems,
      subtotal,
      deliveryCharge: 0,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "PENDING" : "PENDING",
      status: "PLACED",
    });

    return NextResponse.json({
      success: true,
      data: {
        _id: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        estimatedDelivery: order.estimatedDelivery,
      },
    });
  } catch (error: any) {
    console.error("CREATE ORDER ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

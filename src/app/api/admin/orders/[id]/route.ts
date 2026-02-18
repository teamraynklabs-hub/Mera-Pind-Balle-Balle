import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order.model";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    await connectDB();
    const { id } = await params;
    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(order)));
  } catch (error: any) {
    console.error("ADMIN GET ORDER ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const allowedUpdates: Record<string, any> = {};

    if (body.status) allowedUpdates.status = body.status;
    if (body.paymentStatus) allowedUpdates.paymentStatus = body.paymentStatus;
    if (body.notes !== undefined) allowedUpdates.notes = body.notes;

    if (body.status === "DELIVERED") {
      allowedUpdates.deliveredAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(id, allowedUpdates, {
      new: true,
      runValidators: true,
    }).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(order)));
  } catch (error: any) {
    console.error("ADMIN UPDATE ORDER ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update order" },
      { status: 500 }
    );
  }
}

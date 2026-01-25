import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product.model";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({})
      .select("name price description image isActive")
      .lean();

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    console.error(" PRODUCTS API ERROR (REAL):", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

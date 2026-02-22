import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/lib/models/Category.model";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true })
      .select("name slug description image")
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({ success: true, data: categories });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

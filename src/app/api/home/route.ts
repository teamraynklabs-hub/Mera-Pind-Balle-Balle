import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Dashboard from "@/lib/models/Dashboard.model";
import Product from "@/lib/models/Product.model";

export async function GET() {
  try {
    await connectDB();

    const [dashboard, featuredProducts, allProducts] = await Promise.all([
      Dashboard.findOne({ isActive: true }).lean(),
      Product.find({ isActive: true, isFeatured: true })
        .select("name price image description category")
        .lean(),
      Product.find({ isActive: true })
        .select("category")
        .lean(),
    ]);

    if (!dashboard) {
      return NextResponse.json(
        { success: false, message: "No active dashboard found" },
        { status: 404 }
      );
    }

    // Extract unique categories from products
    const categories = [
      ...new Set(
        allProducts
          .map((p: any) => p.category)
          .filter((c: string) => c && c.trim() !== "")
      ),
    ];

    return NextResponse.json({
      success: true,
      data: {
        hero: dashboard.hero,
        initiatives: dashboard.initiatives || [],
        impact: dashboard.impact || [],
        cta: dashboard.cta,
        testimonials: (dashboard as any).testimonials || [],
        storySection: (dashboard as any).storySection || null,
        featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
        categories,
      },
    });
  } catch (error) {
    console.error("HOME API ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

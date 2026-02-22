import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Dashboard from "@/lib/models/Dashboard.model";
import Product from "@/lib/models/Product.model";

// Prevent Next.js from caching this route
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const [dashboard, allProducts] = await Promise.all([
      Dashboard.findOne({ isActive: true }).lean(),
      Product.find({ isActive: true })
        .sort({ createdAt: -1 })
        .select("name price image description category isFeatured stock")
        .lean(),
    ]);

    const featuredProducts = allProducts.filter((p: any) => p.isFeatured);

    if (!dashboard) {
      return NextResponse.json(
        { success: false, message: "No active dashboard found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          hero: dashboard.hero,
          initiatives: dashboard.initiatives || [],
          feedback: (dashboard as any).feedback || [],
          impact: dashboard.impact || [],
          cta: dashboard.cta,
          storySection: (dashboard as any).storySection || null,
          featuredProducts,
          allProducts,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("HOME API ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

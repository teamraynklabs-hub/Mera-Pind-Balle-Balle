import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Resource from "@/lib/models/Resource.model";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";

    // Build filter
    const filter: any = { isPublished: true };

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search) {
      const regex = { $regex: search, $options: "i" };
      filter.$or = [
        { title: regex },
        { description: regex },
        { category: regex },
      ];
    }

    const resources = await Resource.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    // Aggregate unique categories from all published resources
    const categoriesAgg = await Resource.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const categories = categoriesAgg.map((c: any) => c._id).filter(Boolean);

    return NextResponse.json(
      {
        success: true,
        data: {
          resources,
          categories,
          total: resources.length,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("RESOURCES API ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

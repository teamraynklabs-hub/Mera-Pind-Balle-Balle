import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Story from "@/lib/models/Story.model";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const search = searchParams.get("search")?.trim() || "";
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 9)));

    // Build filter
    const filter: any = { isPublished: true };

    if (search) {
      const regex = { $regex: search, $options: "i" };
      filter.$or = [
        { title: regex },
        { tags: regex },
        { excerpt: regex },
        { name: regex },
        { location: regex },
      ];
    }

    // Query stories
    const [stories, total] = await Promise.all([
      Story.find(filter)
        .sort({ featured: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Story.countDocuments(filter),
    ]);

    // Aggregate popular topics from all published story tags
    const topicsAgg = await Story.aggregate([
      { $match: { isPublished: true, tags: { $exists: true, $ne: [] } } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 12 },
    ]);
    const topics = topicsAgg.map((t: any) => t._id);

    return NextResponse.json(
      {
        success: true,
        data: {
          stories,
          total,
          page,
          limit,
          topics,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("STORIES API ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}

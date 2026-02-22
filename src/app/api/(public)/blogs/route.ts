import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/lib/models/Blog.model";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 6);

    const query: any = { isPublished: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }

    const [total, blogs, tagsAgg] = await Promise.all([
      Blog.countDocuments(query),
      Blog.find(query)
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Blog.aggregate([
        { $match: { isPublished: true } },
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 12 },
      ]),
    ]);

    const topics = tagsAgg.map((t: any) => t._id).filter(Boolean);

    return NextResponse.json(
      {
        success: true,
        data: {
          blogs,
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
    console.error("BLOG API ERROR:", error);
    return NextResponse.json(
      { success: false, data: { blogs: [], total: 0, topics: [] } },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/lib/models/Blog.model";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 6);

    const query: any = { isPublished: true };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const total = await Blog.countDocuments(query);

    const blogs = await Blog.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      blogs,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("BLOG API ERROR:", error);
    return NextResponse.json(
      { blogs: [], total: 0 },
      { status: 500 }
    );
  }
}

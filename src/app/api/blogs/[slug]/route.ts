import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/lib/models/Blog.model";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = await params;
  try {
    await connectDB();

    console.log("SLUG FROM URL:", slug);

    const blog = await Blog.findOne({
      slug: slug.trim().toLowerCase(),
      isPublished: true,
    }).lean();



    console.log("BLOG FOUND:", blog);

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("BLOG SLUG API ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

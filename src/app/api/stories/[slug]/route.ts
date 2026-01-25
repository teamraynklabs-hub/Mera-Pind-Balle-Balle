import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Story from "@/lib/models/Story.model";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    await connectDB();

    const story = await Story.findOne({
      slug: slug.trim().toLowerCase(),
      isPublished: true,
    }).lean();

    if (!story) {
      return NextResponse.json(
        { success: false, error: "Story not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: story,
    });
  } catch (error) {
    console.error("STORY SLUG API ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch story" },
      { status: 500 }
    );
  }
}

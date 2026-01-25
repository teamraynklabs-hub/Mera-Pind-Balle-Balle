import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Story from "@/lib/models/Story.model";

export async function GET() {
  try {
    await connectDB();

    const stories = await Story.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: stories,
    });
  } catch (error) {
    console.error("STORIES API ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}

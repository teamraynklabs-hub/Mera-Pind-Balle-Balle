import { NextResponse } from "next/server";
import About from "@/lib/models/About.model";
import { connectDB } from "@/lib/db";

// DB fetch helper
async function getAbout() {
  await connectDB();
  return About.findOne({ isActive: true }).lean();
}

// GET /api/about
export async function GET() {
  try {
    const about = await getAbout();

    if (!about) {
      return NextResponse.json(
        { success: false, message: "About data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error("ABOUT API ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch About data" },
      { status: 500 }
    );
  }
}

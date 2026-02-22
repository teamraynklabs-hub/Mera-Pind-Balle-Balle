import { NextResponse } from "next/server";
import About from "@/lib/models/About.model";
import { connectDB } from "@/lib/db";
import { normalizeAboutData, ABOUT_SEED_DATA } from "@/lib/normalizeAbout";

export async function GET() {
  try {
    await connectDB();
    const about = await About.findOne({ isActive: true }).lean();

    if (!about) {
      return NextResponse.json({ success: true, data: ABOUT_SEED_DATA });
    }

    const normalized = normalizeAboutData(about) || ABOUT_SEED_DATA;
    return NextResponse.json({ success: true, data: normalized });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch About data" },
      { status: 500 }
    );
  }
}

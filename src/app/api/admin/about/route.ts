import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import About from "@/lib/models/About.model";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import { normalizeAboutData, ABOUT_SEED_DATA } from "@/lib/normalizeAbout";

export async function GET() {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

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

export async function PATCH(request: NextRequest) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    await connectDB();
    const body = await request.json();

    if (!body.hero?.title?.trim()) {
      return NextResponse.json(
        { success: false, message: "Hero title is required" },
        { status: 400 }
      );
    }

    const updated = await About.findOneAndUpdate(
      { isActive: true },
      { $set: body },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    revalidatePath("/about");

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to update About page" },
      { status: 500 }
    );
  }
}

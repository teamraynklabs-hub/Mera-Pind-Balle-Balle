// app/api/admin/about/route.ts
import { NextRequest, NextResponse } from "next/server";
import About from "@/lib/models/About.model";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) {
      return adminCheck;
    }

    await connectDB();
    const about = await About.findOne({ isActive: true }).lean();

    if (!about) {
      // Return default structure if none exists
      return NextResponse.json({
        hero: { title: "", description: "", image: "" },
        mission: { title: "", description: "" },
        vision: { title: "", description: "" },
        values: { title: "", description: "" },
        whyWeExist: { description: "" },
        focusAreas: [],
        coreTeam: [],
        cta: { title: "", description: "", buttonText: "" },
      });
    }

    return NextResponse.json(about);
  } catch (error) {
    console.error("GET /api/admin/about error:", error);
    return NextResponse.json({ error: "Failed to fetch About data" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) {
      return adminCheck;
    }

    await connectDB();
    const body = await request.json();

    const updated = await About.findOneAndUpdate(
      { isActive: true },
      { $set: body },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PATCH /api/admin/about error:", error);
    return NextResponse.json({ error: "Failed to update About page" }, { status: 500 });
  }
}
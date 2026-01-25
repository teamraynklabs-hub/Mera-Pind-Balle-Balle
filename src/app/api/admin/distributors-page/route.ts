import { NextRequest, NextResponse } from "next/server";
import DistributorsPage from "@/lib/models/DistributorsPage.model";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) {
      return adminCheck;
    }

    await connectDB();
    
    const data = await DistributorsPage.findOne({ isActive: true }).lean();

    if (!data) {
      // Return default structure if none exists
      return NextResponse.json({
        bannerImage: "",
        benefits: [],
        requirements: [],
        isActive: true,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/admin/distributors-page error:", error);
    return NextResponse.json({ error: "Failed to fetch distributors page data" }, { status: 500 });
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

    // Upsert pattern: update existing or create new
    const updated = await DistributorsPage.findOneAndUpdate(
      { isActive: true },
      { $set: body },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PATCH /api/admin/distributors-page error:", error);
    return NextResponse.json({ error: "Failed to update distributors page" }, { status: 500 });
  }
}

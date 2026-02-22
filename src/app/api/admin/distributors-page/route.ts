import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import DistributorsPage from "@/lib/models/DistributorsPage.model";
import { requireAdmin } from "@/lib/requireAdmin";
import {
  normalizeDistributorsPageData,
  DISTRIBUTORS_PAGE_SEED_DATA,
} from "@/lib/normalizeDistributorsPage";

export async function GET() {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    await connectDB();
    const page = await DistributorsPage.findOne({ isActive: true }).lean();

    const data =
      normalizeDistributorsPageData(page) || DISTRIBUTORS_PAGE_SEED_DATA;
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch distributors page data" },
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

    const updated = await DistributorsPage.findOneAndUpdate(
      { isActive: true },
      { $set: body },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    revalidatePath("/distributors");

    const data =
      normalizeDistributorsPageData(updated) || DISTRIBUTORS_PAGE_SEED_DATA;
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to update distributors page" },
      { status: 500 }
    );
  }
}

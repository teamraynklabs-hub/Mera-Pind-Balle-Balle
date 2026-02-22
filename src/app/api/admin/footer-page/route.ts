import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import FooterPage from "@/lib/models/FooterPage.model";
import { requireAdmin } from "@/lib/requireAdmin";
import {
  normalizeFooterPageData,
  FOOTER_PAGE_SEED_DATA,
} from "@/lib/normalizeFooterPage";

export async function GET() {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    await connectDB();
    const page = await FooterPage.findOne({ isActive: true }).lean();

    const data = normalizeFooterPageData(page) || FOOTER_PAGE_SEED_DATA;
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch footer page data" },
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

    const updated = await FooterPage.findOneAndUpdate(
      { isActive: true },
      { $set: body },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    // Revalidate all pages since footer appears on every page
    revalidatePath("/", "layout");

    const data = normalizeFooterPageData(updated) || FOOTER_PAGE_SEED_DATA;
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to update footer page" },
      { status: 500 }
    );
  }
}

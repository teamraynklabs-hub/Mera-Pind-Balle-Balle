import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import TermsConditionsPage from "@/lib/models/TermsConditionsPage.model";
import { requireAdmin } from "@/lib/requireAdmin";
import {
  normalizeTermsConditionsPageData,
  TERMS_CONDITIONS_PAGE_SEED_DATA,
} from "@/lib/normalizeTermsConditionsPage";

export async function GET() {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    await connectDB();
    const page = await TermsConditionsPage.findOne({ isActive: true }).lean();

    const data =
      normalizeTermsConditionsPageData(page) || TERMS_CONDITIONS_PAGE_SEED_DATA;
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch terms & conditions page data" },
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
        { success: false, message: "Page title is required" },
        { status: 400 }
      );
    }

    const updated = await TermsConditionsPage.findOneAndUpdate(
      { isActive: true },
      { $set: body },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    revalidatePath("/terms-conditions");

    const data =
      normalizeTermsConditionsPageData(updated) ||
      TERMS_CONDITIONS_PAGE_SEED_DATA;
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to update terms & conditions page" },
      { status: 500 }
    );
  }
}

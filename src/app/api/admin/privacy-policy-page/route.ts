import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import PrivacyPolicyPage from "@/lib/models/PrivacyPolicyPage.model";
import { requireAdmin } from "@/lib/requireAdmin";
import {
  normalizePrivacyPolicyPageData,
  PRIVACY_POLICY_PAGE_SEED_DATA,
} from "@/lib/normalizePrivacyPolicyPage";

export async function GET() {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    await connectDB();
    const page = await PrivacyPolicyPage.findOne({ isActive: true }).lean();

    const data =
      normalizePrivacyPolicyPageData(page) || PRIVACY_POLICY_PAGE_SEED_DATA;
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch privacy policy page data" },
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

    const updated = await PrivacyPolicyPage.findOneAndUpdate(
      { isActive: true },
      { $set: body },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    revalidatePath("/privacy-policy");

    const data =
      normalizePrivacyPolicyPageData(updated) || PRIVACY_POLICY_PAGE_SEED_DATA;
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to update privacy policy page" },
      { status: 500 }
    );
  }
}

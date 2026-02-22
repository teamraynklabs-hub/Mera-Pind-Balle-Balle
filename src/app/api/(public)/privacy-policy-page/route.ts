import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import PrivacyPolicyPage from "@/lib/models/PrivacyPolicyPage.model";
import {
  normalizePrivacyPolicyPageData,
  PRIVACY_POLICY_PAGE_SEED_DATA,
} from "@/lib/normalizePrivacyPolicyPage";

export async function GET() {
  try {
    await connectDB();
    const page = await PrivacyPolicyPage.findOne({ isActive: true }).lean();

    if (!page) {
      return NextResponse.json({
        success: true,
        data: PRIVACY_POLICY_PAGE_SEED_DATA,
      });
    }

    const normalized =
      normalizePrivacyPolicyPageData(page) || PRIVACY_POLICY_PAGE_SEED_DATA;
    return NextResponse.json({ success: true, data: normalized });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch privacy policy page data" },
      { status: 500 }
    );
  }
}

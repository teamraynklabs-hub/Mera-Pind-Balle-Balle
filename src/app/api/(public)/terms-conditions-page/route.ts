import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import TermsConditionsPage from "@/lib/models/TermsConditionsPage.model";
import {
  normalizeTermsConditionsPageData,
  TERMS_CONDITIONS_PAGE_SEED_DATA,
} from "@/lib/normalizeTermsConditionsPage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const page = await TermsConditionsPage.findOne({ isActive: true }).lean();

    if (!page) {
      return NextResponse.json(
        { success: true, data: TERMS_CONDITIONS_PAGE_SEED_DATA },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        }
      );
    }

    const normalized =
      normalizeTermsConditionsPageData(page) || TERMS_CONDITIONS_PAGE_SEED_DATA;

    return NextResponse.json(
      { success: true, data: normalized },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch terms & conditions page data" },
      { status: 500 }
    );
  }
}

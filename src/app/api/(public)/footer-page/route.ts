import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FooterPage from "@/lib/models/FooterPage.model";
import {
  normalizeFooterPageData,
  FOOTER_PAGE_SEED_DATA,
} from "@/lib/normalizeFooterPage";

export async function GET() {
  try {
    await connectDB();
    const page = await FooterPage.findOne({ isActive: true }).lean();

    if (!page) {
      return NextResponse.json({ success: true, data: FOOTER_PAGE_SEED_DATA });
    }

    const normalized =
      normalizeFooterPageData(page) || FOOTER_PAGE_SEED_DATA;
    return NextResponse.json({ success: true, data: normalized });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch footer data" },
      { status: 500 }
    );
  }
}

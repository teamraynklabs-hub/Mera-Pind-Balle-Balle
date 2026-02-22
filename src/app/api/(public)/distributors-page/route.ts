import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import DistributorsPage from "@/lib/models/DistributorsPage.model";
import {
  normalizeDistributorsPageData,
  DISTRIBUTORS_PAGE_SEED_DATA,
} from "@/lib/normalizeDistributorsPage";

export async function GET() {
  try {
    await connectDB();
    const page = await DistributorsPage.findOne({ isActive: true }).lean();

    if (!page) {
      return NextResponse.json({ success: true, data: DISTRIBUTORS_PAGE_SEED_DATA });
    }

    const normalized =
      normalizeDistributorsPageData(page) || DISTRIBUTORS_PAGE_SEED_DATA;
    return NextResponse.json({ success: true, data: normalized });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch distributors page data" },
      { status: 500 }
    );
  }
}

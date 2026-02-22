import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ContactPage from "@/lib/models/ContactPage.model";
import {
  normalizeContactPageData,
  CONTACT_PAGE_SEED_DATA,
} from "@/lib/normalizeContactPage";

export async function GET() {
  try {
    await connectDB();
    const page = await ContactPage.findOne({ isActive: true }).lean();

    if (!page) {
      return NextResponse.json({ success: true, data: CONTACT_PAGE_SEED_DATA });
    }

    const normalized = normalizeContactPageData(page) || CONTACT_PAGE_SEED_DATA;
    return NextResponse.json({ success: true, data: normalized });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch contact page data" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import ContactPage from "@/lib/models/ContactPage.model";
import { requireAdmin } from "@/lib/requireAdmin";
import {
  normalizeContactPageData,
  CONTACT_PAGE_SEED_DATA,
} from "@/lib/normalizeContactPage";

export async function GET() {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    await connectDB();
    const page = await ContactPage.findOne({ isActive: true }).lean();

    const data = normalizeContactPageData(page) || CONTACT_PAGE_SEED_DATA;
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch contact page data" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    await connectDB();
    const body = await req.json();

    if (!body.hero?.title?.trim()) {
      return NextResponse.json(
        { success: false, message: "Hero title is required" },
        { status: 400 }
      );
    }

    const updated = await ContactPage.findOneAndUpdate(
      { isActive: true },
      { $set: body },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    revalidatePath("/contact");

    const data = normalizeContactPageData(updated) || CONTACT_PAGE_SEED_DATA;
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to update contact page" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ContactLead from "@/lib/models/Contact.model";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    await connectDB();

    const leads = await ContactLead.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: leads });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch contact leads" },
      { status: 500 }
    );
  }
}

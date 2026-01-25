import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ContactLead from "@/lib/models/Contact.model";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  const adminCheck = await requireAdmin();
  if (adminCheck instanceof NextResponse) {
    return adminCheck;
  }

  await connectDB();

  const leads = await ContactLead.find()
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(leads);
}

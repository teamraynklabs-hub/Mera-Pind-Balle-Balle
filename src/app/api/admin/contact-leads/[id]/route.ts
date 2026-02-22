import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ContactLead from "@/lib/models/Contact.model";
import { requireAdmin } from "@/lib/requireAdmin";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const updated = await ContactLead.findByIdAndUpdate(
      id,
      { isResolved: body.isResolved },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to update lead" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    await connectDB();
    const { id } = await params;

    const deleted = await ContactLead.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Lead deleted" });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to delete lead" },
      { status: 500 }
    );
  }
}

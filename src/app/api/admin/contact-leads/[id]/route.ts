import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ContactLead from "@/lib/models/Contact.model";
import { requireAdmin } from "@/lib/requireAdmin";

// PATCH – mark resolved / unresolved
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
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
      { error: "Lead not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}

// DELETE – hard delete
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
  await connectDB();

  
  const { id } = await params;

  const deleted = await ContactLead.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json(
      { error: "Lead not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}

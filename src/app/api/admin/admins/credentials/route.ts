import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { connectDB } from "@/lib/db";
import AdminUser from "@/lib/models/AdminUser.model";
import { hashPassword, verifyPassword } from "@/lib/auth/hash";

// GET returns current admin public info (email) for DB-based admins
export async function GET(req: Request) {
  const adminCheck = await requireAdmin();
  if (adminCheck instanceof NextResponse) return adminCheck;

  const session = adminCheck as any;

  if (session?.user?.id === "admin-env") {
    return NextResponse.json({ error: "Env-based admin in use" }, { status: 400 });
  }

  await connectDB();
  const admin = await AdminUser.findById(session.user.id).lean();
  if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

  return NextResponse.json({ email: (admin as any).email });
}

export async function PUT(req: Request) {
  const adminCheck = await requireAdmin();
  if (adminCheck instanceof NextResponse) return adminCheck;

  const session = adminCheck as any;

  // If using env-based admin, we cannot update env via API
  if (session?.user?.id === "admin-env") {
    return NextResponse.json(
      { error: "Cannot update env-based admin via web. Create a DB admin first." },
      { status: 400 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { email, password, currentPassword } = body || {};

  if (!email && !password) {
    return NextResponse.json({ error: "No changes provided" }, { status: 400 });
  }

  if (!currentPassword || typeof currentPassword !== "string") {
    return NextResponse.json({ error: "Current password is required" }, { status: 400 });
  }

  await connectDB();

  const admin = await AdminUser.findById(session.user.id);
  if (!admin) {
    return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
  }

  // verify current password
  const verified = await verifyPassword(currentPassword, (admin as any).password);
  if (!verified) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
  }

  // If updating email, ensure not used by another admin
  if (email && email !== (admin as any).email) {
    const exists = await AdminUser.findOne({ email }).lean();
    if (exists) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }
    admin.email = email;
  }

  if (password) admin.password = await hashPassword(password);

  await admin.save();

  return NextResponse.json({ ok: true });
}

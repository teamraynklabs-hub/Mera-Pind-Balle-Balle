import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/lib/models/Category.model";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    await connectDB();
    const categories = await Category.find().sort({ name: 1 }).lean();

    return NextResponse.json({ success: true, data: categories });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    await connectDB();
    const body = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Category name is required" },
        { status: 400 }
      );
    }

    const slug =
      body.slug?.trim() ||
      body.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const exists = await Category.findOne({
      $or: [{ name: body.name.trim() }, { slug }],
    });

    if (exists) {
      return NextResponse.json(
        { success: false, message: "Category already exists" },
        { status: 409 }
      );
    }

    const category = await Category.create({
      name: body.name.trim(),
      slug,
      description: body.description || "",
      image: body.image || "",
      isActive: body.isActive !== false,
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to create category" },
      { status: 500 }
    );
  }
}

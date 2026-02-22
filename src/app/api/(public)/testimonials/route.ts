import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Dashboard from "@/lib/models/Dashboard.model";

export async function GET() {
  try {
    await connectDB();

    const dashboard = await Dashboard.findOne({ isActive: true })
      .select("testimonials")
      .lean();

    if (!dashboard?.testimonials?.length) {
      return NextResponse.json({ success: true, data: [] });
    }

    const testimonials = (dashboard.testimonials as any[])
      .filter((t) => t.name && t.name.trim() !== "")
      .map((t) => ({
        name: t.name,
        location: t.location || t.role || "",
        rating: t.rating ?? 5,
        review: t.review || t.quote || "",
        image: t.image || t.avatar || "",
      }));

    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    console.error("TESTIMONIALS API ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

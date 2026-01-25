// app/api/dashboard/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Dashboard from "@/lib/models/Dashboard.model";

export async function GET() {
  try {
    await connectDB();

    // Find the active dashboard document
    const dashboard = await Dashboard.findOne({ isActive: true }).lean();

    if (!dashboard) {
      return NextResponse.json(
        { success: false, message: "No active dashboard found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    console.error("GET /api/dashboard error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
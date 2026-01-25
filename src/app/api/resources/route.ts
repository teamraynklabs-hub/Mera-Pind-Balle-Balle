import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ResourcesPage from "@/lib/models/Resource.model";

export async function GET() {
  try {
    await connectDB();

    const data = await ResourcesPage.findOne({ isActive: true }).lean();

    if (!data) {
      return NextResponse.json(null, { status: 404 });
    }

    // 🔥 RETURN RAW DATA
    return NextResponse.json(data);
  } catch (error) {
    console.error("RESOURCES API ERROR:", error);
    return NextResponse.json(null, { status: 500 });
  }
}

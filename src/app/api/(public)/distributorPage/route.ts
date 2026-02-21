// app/api/distributors/page/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import DistributorPage from "@/lib/models/DistributorsPage.model";  // ← you'll need to create this model

export async function GET() {
  try {
    await connectDB();
    
    // Assuming only one document exists (common for "page settings")
    const pageData = await DistributorPage.findOne({}).lean();
    // or: .findOne({ isActive: true })
    // or: .findById("your-fixed-id-here")

    if (!pageData) {
      return NextResponse.json(
        { error: "Distributor page content not found" },
        { status: 404 }
      );
    }

    // Optional: clean up mongo fields
    const { _id, __v, ...clean } = pageData;
    return NextResponse.json(clean);
  } catch (error) {
    console.error("GET /api/distributors/page error:", error);
    return NextResponse.json(
      { error: "Failed to load distributor page info" },
      { status: 500 }
    );
  }
}
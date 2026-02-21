import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import DistributorsPage from "@/lib/models/DistributorsPage.model";
import Distributor from "@/lib/models/Distributor.model";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const data = await DistributorsPage.findOne({ isActive: true }).lean();

    if (!data) {
      return NextResponse.json(
        { success: false, message: "No distributor page configured. Please set up via admin panel." },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("DISTRIBUTOR API ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    const distributor = await Distributor.create({
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      website: body.website?.trim() || undefined,
      status: "pending",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Distributor application submitted successfully",
        data: distributor,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("DISTRIBUTOR POST ERROR:", error);
    return NextResponse.json(
      { error: "Failed to submit distributor application" },
      { status: 500 }
    );
  }
}

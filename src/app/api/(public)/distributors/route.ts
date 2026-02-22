import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Distributor from "@/lib/models/Distributor.model";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { success: false, message: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    const distributor = await Distributor.create({
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      website: body.website?.trim() || "",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Distributor application submitted successfully",
        data: distributor,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to submit distributor application" },
      { status: 500 }
    );
  }
}

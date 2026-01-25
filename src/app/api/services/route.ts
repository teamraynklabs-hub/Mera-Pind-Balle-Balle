import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Service from "@/lib/models/Service.model";

export async function GET() {
  try {
    await connectDB();

    const services = await Service.find({ isActive: true })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("SERVICES API ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const service = await Service.create({
      ...body,
      isActive: true,
    });

    return NextResponse.json(
      {
        success: true,
        data: service,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("CREATE SERVICE ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create service" },
      { status: 500 }
    );
  }
}

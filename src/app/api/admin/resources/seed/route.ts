import { connectDB } from "@/lib/db";
import Resource from "@/lib/models/Resource.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    await Resource.deleteMany({});

    const resources = await Resource.insertMany([
      {
        title: "Government Rural Development Scheme",
        description: "A complete guide to latest schemes available for rural communities.",
        category: "Guide",
        fileType: "pdf",
        size: "2.5 MB",
        fileUrl: "",
        isPublished: true,
      },
      {
        title: "Women Empowerment Toolkit",
        description: "Training material and worksheets for self-help groups.",
        category: "Education",
        fileType: "pdf",
        size: "4.1 MB",
        fileUrl: "",
        isPublished: true,
      },
      {
        title: "Product Catalog 2026",
        description: "Complete catalog of our handcrafted product collection.",
        category: "Catalog",
        fileType: "pdf",
        size: "12.5 MB",
        fileUrl: "",
        isPublished: true,
      },
    ]);

    return NextResponse.json(
      { success: true, message: "Seed data created", data: resources },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error seeding data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed data" },
      { status: 500 }
    );
  }
}

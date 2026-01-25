import { connectDB } from "@/lib/db";
import ResourcesPage from "@/lib/models/Resource.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // Clear existing data
    await ResourcesPage.deleteMany({});

    // Create sample resource
    const resourcesPage = await ResourcesPage.create({
      bannerImage: "",
      documents: [
        {
          title: "Government Rural Development Scheme",
          type: "pdf",
          link: "https://example.com/scheme.pdf",
          description: "A complete guide to latest schemes available for rural communities.",
        },
        {
          title: "Women Empowerment Toolkit",
          type: "pdf",
          link: "https://example.com/toolkit.pdf",
          description: "Training material and worksheets for self-help groups.",
        },
      ],
    });

    return NextResponse.json(
      { message: "Seed data created", data: resourcesPage },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error seeding data:", error);
    return NextResponse.json(
      { error: "Failed to seed data" },
      { status: 500 }
    );
  }
}

import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import CareersPage from "@/lib/models/Career.model";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) {
      return adminCheck;
    }

    await connectDB();

    let page = await CareersPage.findOne({ isActive: true });

    if (!page) {
      // Auto-create if missing with all required fields
      try {
        page = new CareersPage({
          bannerImage: "https://via.placeholder.com/1200x400?text=Careers+Banner",
          jobs: [],
          isActive: true,
        });
        await page.save();
      } catch (createErr) {
        console.error("Failed to create careers page:", createErr);
        return NextResponse.json(
          { error: "Failed to create careers page" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    console.error("GET /api/admin/careers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch careers page" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) {
      return adminCheck;
    }

    await connectDB();

    const body = await request.json();

    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const page = await CareersPage.findOne({ isActive: true });

    if (!page) {
      return NextResponse.json(
        { error: "Careers page not found" },
        { status: 404 }
      );
    }

    const newJob = {
      title: body.title.trim(),
      location: body.location?.trim() || "",
      type: body.type || "Full-time",
      description: body.description.trim(),
      salary: body.salary?.trim() || "",
      image: body.image || "",
    };

    page.jobs.push(newJob);
    await page.save();

    const createdJob = page.jobs[page.jobs.length - 1];
    return NextResponse.json(
      { success: true, data: createdJob },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/admin/careers error:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
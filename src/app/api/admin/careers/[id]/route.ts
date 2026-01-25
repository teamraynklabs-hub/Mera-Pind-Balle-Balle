import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import CareersPage from "@/lib/models/Career.model";
import { requireAdmin } from "@/lib/requireAdmin";
import mongoose from "mongoose";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // 👈 REQUIRED in Next.js 15
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) {
      return adminCheck;
    }

    await connectDB();

    const jobId = id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return NextResponse.json(
        { error: "Invalid job ID" },
        { status: 400 }
      );
    }

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

    const jobIndex = page.jobs.findIndex(
      (job: any) => job._id.toString() === jobId
    );

    if (jobIndex === -1) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Update the job
    page.jobs[jobIndex] = {
      ...page.jobs[jobIndex],
      title: body.title.trim(),
      location: body.location?.trim() || "",
      type: body.type || "Full-time",
      description: body.description.trim(),
      salary: body.salary?.trim() || "",
      image: body.image || page.jobs[jobIndex].image,
    };

    await page.save();

    return NextResponse.json({
      success: true,
      data: page.jobs[jobIndex],
    });
  } catch (error) {
    console.error("PUT /api/admin/careers/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) {
      return adminCheck;
    }

    await connectDB();

    const jobId = id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return NextResponse.json(
        { error: "Invalid job ID" },
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

    const jobIndex = page.jobs.findIndex(
      (job: any) => job._id.toString() === jobId
    );

    if (jobIndex === -1) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Remove the job
    page.jobs.splice(jobIndex, 1);
    await page.save();

    return NextResponse.json({
      success: true,
      message: "Job deleted successfully",
      data: id,
    });
  } catch (error) {
    console.error("DELETE /api/admin/careers/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}

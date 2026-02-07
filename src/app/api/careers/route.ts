import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CareersPage from "@/lib/models/Career.model";
import CareerApplication from "@/lib/models/CareerApplication.model";

export async function GET() {
  try {
    await connectDB();

    const data = await CareersPage.findOne({ isActive: true }).lean();

    if (!data) {
      return NextResponse.json(
        { success: false, message: "Careers page not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("CAREERS GET ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load careers data" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    // minimal validation
    if (!body.name || !body.email || !body.position) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const application = await CareerApplication.create({
      name: body.name,
      email: body.email,
      phone: body.phone || "",
      position: body.position,
      message: body.message || "",
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully!",
      data: application,
    }, { status: 201 });
  } catch (error) {
    console.error("CAREERS POST ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit application" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { jobId } = await req.json();

    const page = await CareersPage.findOne({ isActive: true });

    if (!page) {
      return NextResponse.json(
        { success: false, message: "Careers page not found" },
        { status: 404 }
      );
    }

    page.jobs = page.jobs.filter(
      (job: any) => job._id.toString() !== jobId
    );

    await page.save();

    return NextResponse.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete job" },
      { status: 500 }
    );
  }
}

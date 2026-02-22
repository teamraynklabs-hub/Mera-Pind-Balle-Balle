import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Dashboard from "@/lib/models/Dashboard.model";
import { auth } from "@/auth";
import { z } from "zod";

// ────────────────────────────────────────────────
// Validation Schema
// ────────────────────────────────────────────────
const DashboardSchema = z.object({
  hero: z.object({
    title: z.string().min(1),
    subtitle: z.string().min(1),
    image: z.string().min(1),
    primaryCTA: z.object({
      label: z.string().min(1),
      link: z.string().min(1),
    }).passthrough(),
    secondaryCTA: z.object({
      label: z.string().min(1),
      link: z.string().min(1),
    }).passthrough(),
  }).passthrough(),
  initiatives: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      image: z.string().optional().default("/photo1.png"),
    }).passthrough()
  ),
  feedback: z.optional(z.array(
    z.object({
      name: z.string().min(1),
      role: z.string().min(1),
      quote: z.string().min(1),
      avatar: z.string().optional().default(""),
    }).passthrough()
  )),
  impact: z.array(
    z.object({
      label: z.string().min(1),
      value: z.string().min(1),
    }).passthrough()
  ),
  cta: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    buttonText: z.string().min(1),
    link: z.string().min(1),
  }).passthrough(),
  storySection: z.optional(z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    link: z.string(),
  }).passthrough()),
  footer: z.optional(z.any()),
  isActive: z.boolean().default(true),
}).passthrough();

// ────────────────────────────────────────────────
// POST - Admin only
// ────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Strip MongoDB internal fields before Zod validation
    const { _id, __v, createdAt, updatedAt, updatedBy: _ub, ...cleanBody } = body;
    const stripId = ({ _id, ...rest }: any) => rest;
    if (cleanBody.initiatives) cleanBody.initiatives = cleanBody.initiatives.map(stripId);
    if (cleanBody.feedback) cleanBody.feedback = cleanBody.feedback.map(stripId);
    if (cleanBody.impact) cleanBody.impact = cleanBody.impact.map(stripId);
    if (cleanBody.hero?.primaryCTA) cleanBody.hero.primaryCTA = stripId(cleanBody.hero.primaryCTA);
    if (cleanBody.hero?.secondaryCTA) cleanBody.hero.secondaryCTA = stripId(cleanBody.hero.secondaryCTA);

    const parsed = DashboardSchema.safeParse(cleanBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: parsed.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    await connectDB();

    const dashboard = await Dashboard.findOneAndUpdate(
      { isActive: true },
      {
        ...parsed.data,
        updatedBy: session.user.id,
        updatedAt: new Date(),
      },
      { new: true, upsert: true }
    ).lean();

    return NextResponse.json({
      success: true,
      message: "Dashboard updated successfully",
      data: dashboard,
    });
  } catch (err) {
    console.error("[ADMIN/DASHBOARD POST]", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// ────────────────────────────────────────────────
// GET - public (or admin-enhanced later)
// ────────────────────────────────────────────────
export async function GET() {
  await connectDB();
  const dashboard = await Dashboard.findOne({ isActive: true }).lean();

  if (!dashboard) {
    return NextResponse.json(
      { success: false, message: "No active dashboard found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: dashboard });
}

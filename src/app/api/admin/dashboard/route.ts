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
    image: z.string().url().or(z.string().startsWith("/")),
    primaryCTA: z.object({
      label: z.string().min(1),
      link: z.string().min(1),
    }),
    secondaryCTA: z.object({
      label: z.string().min(1),
      link: z.string().min(1),
    }),
  }),
  initiatives: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
    })
  ),
  popularProducts: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      image: z.string().url().or(z.string().startsWith("/")),
    })
  ),
  impact: z.array(
    z.object({
      label: z.string().min(1),
      value: z.string().min(1),
    })
  ),
  cta: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    buttonText: z.string().min(1),
    link: z.string().min(1),
  }),
  footer: z.optional(z.any()),
  isActive: z.boolean().default(true),
});

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
    const parsed = DashboardSchema.safeParse(body);

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

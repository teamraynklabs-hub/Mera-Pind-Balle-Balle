import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import NavbarSettings from "@/lib/models/NavbarSettings.model";
import { requireAdmin } from "@/lib/requireAdmin";
import cloudinary from "@/lib/cloudinary";
import {
  normalizeNavbarSettings,
  NAVBAR_SEED_DATA,
} from "@/lib/normalizeNavbarSettings";

export async function GET() {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    await connectDB();
    const settings = await NavbarSettings.findOne({ isActive: true }).lean();

    const data = normalizeNavbarSettings(settings) || NAVBAR_SEED_DATA;
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch navbar settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    await connectDB();

    const contentType = request.headers.get("content-type") || "";

    let updateData: any;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      updateData = {
        brandName: (formData.get("brandName") as string)?.trim() || "Mera Pind Balle Balle",
        showCart: formData.get("showCart") !== "false",
        showLogin: formData.get("showLogin") !== "false",
        showThemeToggle: formData.get("showThemeToggle") !== "false",
      };

      const navLinksRaw = formData.get("navLinks") as string;
      if (navLinksRaw) {
        try {
          updateData.navLinks = JSON.parse(navLinksRaw);
        } catch {
          // keep existing
        }
      }

      const logoFile = formData.get("logo") as File | null;
      if (logoFile && logoFile.size > 0) {
        const buffer = Buffer.from(await logoFile.arrayBuffer());
        const upload: any = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "mpbb/navbar", resource_type: "image" },
              (err, result) => (err ? reject(err) : resolve(result))
            )
            .end(buffer);
        });
        updateData.logoUrl = upload.secure_url;
      }
    } else {
      const body = await request.json();
      updateData = {
        brandName: body.brandName?.trim() || "Mera Pind Balle Balle",
        showCart: body.showCart !== false,
        showLogin: body.showLogin !== false,
        showThemeToggle: body.showThemeToggle !== false,
      };

      if (Array.isArray(body.navLinks)) {
        updateData.navLinks = body.navLinks;
      }

      if (body.logoUrl) {
        updateData.logoUrl = body.logoUrl;
      }
    }

    if (!updateData.brandName?.trim()) {
      return NextResponse.json(
        { success: false, message: "Brand name is required" },
        { status: 400 }
      );
    }

    const updated = await NavbarSettings.findOneAndUpdate(
      { isActive: true },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    const data = normalizeNavbarSettings(updated) || NAVBAR_SEED_DATA;
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to update navbar settings" },
      { status: 500 }
    );
  }
}

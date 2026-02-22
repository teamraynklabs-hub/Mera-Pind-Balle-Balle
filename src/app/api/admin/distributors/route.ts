import { connectDB } from "@/lib/db";
import Distributor from "@/lib/models/Distributor.model";
import { requireAdmin } from "@/lib/requireAdmin";
import cloudinary from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    await connectDB();
    const distributors = await Distributor.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: distributors || [] });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch distributors" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    await connectDB();

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const website = formData.get("website") as string;
    const file = formData.get("image") as File | null;

    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { success: false, message: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    let imageUrl = "";
    let imagePublicId = "";

    if (file && file.size > 0) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const upload: any = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "mpbb/distributors" },
              (err, result) => (err ? reject(err) : resolve(result))
            )
            .end(buffer);
        });
        imageUrl = upload.secure_url;
        imagePublicId = upload.public_id;
      } catch {
        return NextResponse.json(
          { success: false, message: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    const newDistributor = await Distributor.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      website: website?.trim() || "",
      image: imageUrl,
      publicId: imagePublicId,
    });

    return NextResponse.json(
      { success: true, data: newDistributor },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to create distributor" },
      { status: 500 }
    );
  }
}

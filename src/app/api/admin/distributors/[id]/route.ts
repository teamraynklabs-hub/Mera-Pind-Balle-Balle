import { connectDB } from "@/lib/db";
import Distributor from "@/lib/models/Distributor.model";
import { requireAdmin } from "@/lib/requireAdmin";
import { deleteCloudinaryImage } from "@/lib/cloudinaryDelete";
import cloudinary from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    const { id } = await params;
    await connectDB();
    const distributor = await Distributor.findById(id).lean();

    if (!distributor) {
      return NextResponse.json(
        { success: false, message: "Distributor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: distributor });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch distributor" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid distributor ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const website = formData.get("website") as string;
    const file = formData.get("image") as File | null;

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.trim();
    if (phone) updateData.phone = phone.trim();
    if (website !== undefined) updateData.website = website.trim();

    if (file && file.size > 0) {
      const existingDistributor = await Distributor.findById(id).lean();

      if (existingDistributor?.image) {
        await deleteCloudinaryImage(existingDistributor.image);
      }

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
        updateData.image = upload.secure_url;
        updateData.publicId = upload.public_id;
      } catch {
        return NextResponse.json(
          { success: false, message: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    const updatedDistributor = await Distributor.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).lean();

    if (!updatedDistributor) {
      return NextResponse.json(
        { success: false, message: "Distributor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedDistributor });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to update distributor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid distributor ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const deletedDistributor = await Distributor.findByIdAndDelete(id).lean();

    if (!deletedDistributor) {
      return NextResponse.json(
        { success: false, message: "Distributor not found" },
        { status: 404 }
      );
    }

    if (deletedDistributor.image) {
      await deleteCloudinaryImage(deletedDistributor.image);
    }

    return NextResponse.json({
      success: true,
      message: "Distributor deleted successfully",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to delete distributor" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Resource from "@/lib/models/Resource.model";
import cloudinary from "@/lib/cloudinary";
import { deleteCloudinaryImage } from "@/lib/cloudinaryDelete";
import { requireAdmin } from "@/lib/requireAdmin";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;

  await connectDB();

  const formData = await req.formData();

  const updateData: any = {
    title: (formData.get("title") as string)?.trim(),
    description: (formData.get("description") as string)?.trim() || "",
    category: (formData.get("category") as string)?.trim() || "Guide",
    fileType: (formData.get("fileType") as string)?.trim() || "pdf",
    size: (formData.get("size") as string)?.trim() || "",
    isPublished: formData.get("isPublished") !== "false",
  };

  const file = formData.get("file") as File | null;

  if (file && file.size > 0) {
    const existing = await Resource.findById(id);
    if (existing?.fileUrl) {
      await deleteCloudinaryImage(existing.fileUrl);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const upload: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "mpbb/resources", resource_type: "auto" },
          (err, result) => (err ? reject(err) : resolve(result))
        )
        .end(buffer);
    });
    updateData.fileUrl = upload.secure_url;
  }

  const updated = await Resource.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    return NextResponse.json(
      { success: false, error: "Resource not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;

  await connectDB();

  const resource = await Resource.findById(id);
  if (!resource) {
    return NextResponse.json(
      { success: false, error: "Resource not found" },
      { status: 404 }
    );
  }

  if (resource.fileUrl) {
    await deleteCloudinaryImage(resource.fileUrl);
  }

  await resource.deleteOne();

  return NextResponse.json({ success: true, message: "Resource deleted" });
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Resource from "@/lib/models/Resource.model";
import cloudinary from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;

  await connectDB();
  const resources = await Resource.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ success: true, data: resources });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;

  await connectDB();

  const formData = await req.formData();

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || "";
  const category = (formData.get("category") as string)?.trim() || "Guide";
  const fileType = (formData.get("fileType") as string)?.trim() || "pdf";
  const size = (formData.get("size") as string)?.trim() || "";
  const isPublished = formData.get("isPublished") !== "false";
  const file = formData.get("file") as File | null;

  if (!title) {
    return NextResponse.json(
      { success: false, error: "Title is required" },
      { status: 400 }
    );
  }

  let fileUrl = "";

  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const upload: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "mpbb/resources", resource_type: "auto" },
          (err, result) => (err ? reject(err) : resolve(result))
        )
        .end(buffer);
    });
    fileUrl = upload.secure_url;
  }

  const resource = await Resource.create({
    title,
    description,
    category,
    fileType,
    size,
    fileUrl,
    isPublished,
  });

  return NextResponse.json({ success: true, data: resource }, { status: 201 });
}

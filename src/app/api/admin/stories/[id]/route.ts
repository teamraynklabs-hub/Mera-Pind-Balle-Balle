import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Story from "@/lib/models/Story.model";
import cloudinary from "@/lib/cloudinary";
import { deleteCloudinaryImage } from "@/lib/cloudinaryDelete";
import { requireAdmin } from "@/lib/requireAdmin";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;

  await connectDB();
  const formData = await req.formData();

  const tagsRaw = (formData.get("tags") as string) || "";
  const tags = tagsRaw
    .split(",")
    .map((t: string) => t.trim())
    .filter(Boolean);

  const updateData: any = {
    title: (formData.get("title") as string)?.trim(),
    excerpt: (formData.get("excerpt") as string)?.trim(),
    content: formData.get("content") as string,
    name: (formData.get("name") as string)?.trim() || "",
    author: (formData.get("author") as string)?.trim() || "Mera Pind Balle Balle",
    location: (formData.get("location") as string)?.trim() || "",
    tags,
    featured: formData.get("featured") === "true",
    isPublished: formData.get("isPublished") !== "false",
  };

  const file = formData.get("image") as File | null;

  if (file && file.size > 0) {
    const story = await Story.findById(id);
    if (story?.image) {
      await deleteCloudinaryImage(story.image);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const upload: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "mpbb/stories" },
          (err, result) => (err ? reject(err) : resolve(result))
        )
        .end(buffer);
    });

    updateData.image = upload.secure_url;
  }

  const updated = await Story.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    return NextResponse.json(
      { success: false, error: "Story not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;

  await connectDB();

  const story = await Story.findById(id);
  if (!story) {
    return NextResponse.json(
      { success: false, error: "Story not found" },
      { status: 404 }
    );
  }

  await deleteCloudinaryImage(story.image);
  await story.deleteOne();

  return NextResponse.json({ success: true, message: "Story deleted" });
}

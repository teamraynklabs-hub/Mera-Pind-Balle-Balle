import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/lib/models/Blog.model";
import cloudinary from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/requireAdmin";
import { deleteCloudinaryImage } from "@/lib/cloudinaryDelete";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;

  await connectDB();

  const formData = await req.formData();

  const title = formData.get("title") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const author = (formData.get("author") as string) || "Mera Pind Balle Balle";
  const tagsRaw = (formData.get("tags") as string) || "";
  const rawIsPublished = formData.get("isPublished");
  const isPublished =
    rawIsPublished === null
      ? true
      : String(rawIsPublished) === "on" ||
        String(rawIsPublished) === "true" ||
        String(rawIsPublished) === "1";
  const slug = formData.get("slug") as string | null;
  const file = formData.get("image") as File | null;

  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const updateData: any = {
    title,
    excerpt,
    content,
    author,
    tags,
    isPublished,
  };

  if (slug) updateData.slug = slug;

  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());

    const upload: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "mpbb/blogs" },
          (err, result) => (err ? reject(err) : resolve(result))
        )
        .end(buffer);
    });

    updateData.image = upload.secure_url;
  }

  const updated = await Blog.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    return NextResponse.json(
      { success: false, message: "Blog not found" },
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

  const blog = await Blog.findById(id);

  if (!blog) {
    return NextResponse.json(
      { success: false, message: "Blog not found" },
      { status: 404 }
    );
  }

  await deleteCloudinaryImage(blog.image);
  await blog.deleteOne();

  return NextResponse.json({ success: true, message: "Blog deleted" });
}

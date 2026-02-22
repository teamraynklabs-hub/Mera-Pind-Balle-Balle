import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/lib/models/Blog.model";
import cloudinary from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;

  await connectDB();

  const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ success: true, data: blogs });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;

  await connectDB();

  const formData = await req.formData();

  const title = formData.get("title") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const author = (formData.get("author") as string) || "Mera Pind Balle Balle";
  const tagsRaw = (formData.get("tags") as string) || "";
  const slug =
    (formData.get("slug") as string) ||
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const isPublished = formData.get("isPublished") === "true";
  const image = formData.get("image") as File;

  if (!title || !excerpt || !content) {
    return NextResponse.json(
      { success: false, message: "Title, excerpt, and content are required" },
      { status: 400 }
    );
  }

  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  let imageUrl = "";

  if (image && image.size > 0) {
    const buffer = Buffer.from(await image.arrayBuffer());

    const upload: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "mpbb/blogs" },
          (err, result) => (err ? reject(err) : resolve(result))
        )
        .end(buffer);
    });

    imageUrl = upload.secure_url;
  }

  const blog = await Blog.create({
    title,
    slug,
    excerpt,
    content,
    author,
    tags,
    image: imageUrl,
    date: new Date(),
    isPublished,
  });

  return NextResponse.json({ success: true, data: blog }, { status: 201 });
}

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
  return NextResponse.json(blogs);
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;

  await connectDB();

  const formData = await req.formData();

  const title = formData.get("title") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const slug =
    (formData.get("slug") as string) ||
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const isPublished = formData.get("isPublished") === "true";
  const image = formData.get("image") as File;

  if (!title || !excerpt || !content || !image) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await image.arrayBuffer());

  const upload: any = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "mpbb/blogs" },
      (err, result) => (err ? reject(err) : resolve(result))
    ).end(buffer);
  });

  const blog = await Blog.create({
    title,
    slug,
    excerpt,
    content,
    image: upload.secure_url,
    date: new Date(),
    isPublished,
  });

  return NextResponse.json(blog);
}

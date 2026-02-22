import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Story from "@/lib/models/Story.model";
import cloudinary from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;

  await connectDB();
  const stories = await Story.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ success: true, data: stories });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;

  await connectDB();

  const formData = await req.formData();

  const title = (formData.get("title") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const content = formData.get("content") as string;
  const name = (formData.get("name") as string)?.trim() || "";
  const author = (formData.get("author") as string)?.trim() || "Mera Pind Balle Balle";
  const location = (formData.get("location") as string)?.trim() || "";
  const tagsRaw = (formData.get("tags") as string) || "";
  const featured = formData.get("featured") === "true";
  const isPublished = formData.get("isPublished") !== "false";
  const image = formData.get("image") as File;

  if (!title || !excerpt || !content || !image) {
    return NextResponse.json(
      { success: false, error: "Title, excerpt, content, and image are required" },
      { status: 400 }
    );
  }

  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const tags = tagsRaw
    .split(",")
    .map((t: string) => t.trim())
    .filter(Boolean);

  const buffer = Buffer.from(await image.arrayBuffer());

  const upload: any = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: "mpbb/stories" },
        (err, result) => (err ? reject(err) : resolve(result))
      )
      .end(buffer);
  });

  const story = await Story.create({
    title,
    slug,
    excerpt,
    content,
    name,
    author,
    location,
    tags,
    featured,
    image: upload.secure_url,
    metaTitle: title,
    metaDescription: excerpt,
    metaKeywords: tags.length > 0 ? tags : title.split(" ").slice(0, 5),
    isPublished,
  });

  return NextResponse.json({ success: true, data: story }, { status: 201 });
}

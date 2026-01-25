import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Story from "@/lib/models/Story.model";
import cloudinary from "@/lib/cloudinary";
import { deleteCloudinaryImage } from "@/lib/cloudinaryDelete";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
    const admin = await requireAdmin();
    if (admin instanceof Response) return admin;

    await connectDB();
    const stories = await Story.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(stories);
}

export async function POST(req: Request) {
    const admin = await requireAdmin();
    if (admin instanceof Response) return admin;

    await connectDB();

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const isPublished = formData.get("isPublished") !== "false";
    const image = formData.get("image") as File;

    if (!title || !excerpt || !content || !image) {
        return NextResponse.json(
            { error: "All fields are required" },
            { status: 400 }
        );
    }

    const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const buffer = Buffer.from(await image.arrayBuffer());

    const upload: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: "mpbb/stories" },
            (err, result) => (err ? reject(err) : resolve(result))
        ).end(buffer);
    });

    const metaTitle = title;
    const metaDescription = excerpt;
    
    const story = await Story.create({
        title,
        slug,
        excerpt,
        content,
        image: upload.secure_url,
        metaTitle,
        metaDescription,
        metaKeywords: title.split(" ").slice(0, 5),
        isPublished,
    });

    return NextResponse.json(story);
}

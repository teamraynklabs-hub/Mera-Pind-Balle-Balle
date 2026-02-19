import { connectDB } from "@/lib/db";
import ResourcesPage from "@/lib/models/Resource.model";
import cloudinary from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/requireAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const resourcesPage = await ResourcesPage.findOne().lean();

    if (!resourcesPage || !resourcesPage.documents?.length) {
      return NextResponse.json([], { status: 200 });
    }

    const docs = resourcesPage.documents.map((doc: any, idx: number) => {
      const docObj = { ...doc };
      if (!docObj._id) {
        docObj._id = `${idx}-${Date.now()}`;
      }
      return docObj;
    });

    return NextResponse.json(docs, { status: 200 });
  } catch (error) {
    console.error("GET /api/admin/resources ERROR:", error);
    return NextResponse.json(
      { error: String(error) },
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
    const title = formData.get("title") as string;
    const desc = formData.get("desc") as string;
    const file = formData.get("fileUrl") as File | null;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    let fileUrl = "";

    if (file) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadResponse = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "mpbb/resources",
              resource_type: "auto",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(buffer);
        });

        const uploadResult = uploadResponse as any;
        fileUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload file" },
          { status: 500 }
        );
      }
    }

    let resourcesPage = await ResourcesPage.findOne();

    if (!resourcesPage) {
      resourcesPage = await ResourcesPage.create({
        bannerImage: "",
        documents: [],
      });
    }

    const newDocument = {
      title,
      type: file?.type || "document",
      link: fileUrl,
      description: desc,
    };

    resourcesPage.documents.push(newDocument);
    await resourcesPage.save();

    const savedDocument = resourcesPage.documents[resourcesPage.documents.length - 1];

    return NextResponse.json(savedDocument, { status: 201 });
  } catch (error) {
    console.error("Error creating resource:", error);
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    );
  }
}

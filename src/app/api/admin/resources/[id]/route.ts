import { connectDB } from "@/lib/db";
import ResourcesPage from "@/lib/models/Resource.model";
import  cloudinary  from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/requireAdmin";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { deleteCloudinaryImage } from "@/lib/cloudinaryDelete";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const resourcesPage = await ResourcesPage.findOne();

    if (!resourcesPage) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    const document = resourcesPage.documents.id(id);

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(document, { status: 200 });
  } catch (error) {
    console.error("Error fetching resource:", error);
    return NextResponse.json(
      { error: "Failed to fetch resource" },
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

    await connectDB();
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const desc = formData.get("desc") as string;
    const file = formData.get("fileUrl") as File | null;

    const resourcesPage = await ResourcesPage.findOne();

    if (!resourcesPage) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    const document = resourcesPage.documents.id(id);

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    let fileUrl = document.link;
    let oldLink = document.link;

    // Upload new file if provided
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

        // Delete old file from Cloudinary
        if (oldLink) {
          await deleteCloudinaryImage(oldLink);
        }
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload file" },
          { status: 500 }
        );
      }
    }

    document.title = title || document.title;
    document.description = desc || document.description;
    if (file) {
      document.link = fileUrl;
      document.type = file.type;
    }

    await resourcesPage.save();

    return NextResponse.json(document, { status: 200 });
  } catch (error) {
    console.error("Error updating resource:", error);
    return NextResponse.json(
      { error: "Failed to update resource" },
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

    await connectDB();
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const resourcesPage = await ResourcesPage.findOne();

    if (!resourcesPage) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    const document = resourcesPage.documents.id(id);

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Delete file from Cloudinary
    if (document.link) {
      await deleteCloudinaryImage(document.link);
    }

    // Remove document from array
    resourcesPage.documents.id(id).deleteOne();
    await resourcesPage.save();

    return NextResponse.json(
      { message: "Resource deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting resource:", error);
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 }
    );
  }
}

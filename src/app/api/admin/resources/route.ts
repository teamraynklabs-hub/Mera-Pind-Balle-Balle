import { connectDB } from "@/lib/db";
import ResourcesPage from "@/lib/models/Resource.model";
import  cloudinary  from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/requireAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("=== GET /api/admin/resources called ===");
    await connectDB();
    console.log("Connected to DB");

    let resourcesPage = await ResourcesPage.findOne().lean();
    console.log("ResourcesPage found:", !!resourcesPage);

    // If no ResourcesPage exists, create one with sample data
    if (!resourcesPage) {
      console.log("Creating new ResourcesPage with sample data...");
      const newResourcesPage = await ResourcesPage.create({
        bannerImage: "https://placehold.co/1200x400?text=Resources",
        documents: [
          {
            title: "Annual Impact Report 2024",
            type: "PDF",
            link: "https://placehold.co/1x1?text=PDF",
            description: "Detailed report covering rural development metrics, training impact, and product distribution growth."
          },
          {
            title: "Product Catalogue",
            type: "PDF",
            link: "https://placehold.co/1x1?text=Catalogue",
            description: "Comprehensive list of artisan products, product specifications, and pricing."
          },
          {
            title: "Volunteer Program Brochure",
            type: "PDF",
            link: "https://placehold.co/1x1?text=Brochure",
            description: "Overview of all volunteer programs and community engagement opportunities."
          },
          {
            title: "Policies & Governance",
            type: "Document",
            link: "https://placehold.co/1x1?text=DOC",
            description: "Official operational policy guidelines, transparency policies, and governance frameworks."
          }
        ],
        isActive: true
      });
      resourcesPage = newResourcesPage.toObject ? newResourcesPage.toObject() : newResourcesPage;
      console.log("Created new ResourcesPage with", resourcesPage.documents?.length || 0, "documents");
    }

    if (!resourcesPage.documents || resourcesPage.documents.length === 0) {
      console.log("No documents found, returning empty array");
      return NextResponse.json([], { status: 200 });
    }

    // Ensure all documents have _id
    const docs = resourcesPage.documents.map((doc: any, idx: number) => {
      const docObj = { ...doc };
      if (!docObj._id) {
        docObj._id = `${idx}-${Date.now()}`;
      }
      return docObj;
    });

    console.log(`Returning ${docs.length} documents`);
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

    console.log("POST /api/admin/resources - title:", title, "has file:", !!file);

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    let fileUrl = "";
    let publicId = "";

    // Upload file to Cloudinary if provided
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
        publicId = uploadResult.public_id;
        console.log("File uploaded to Cloudinary:", fileUrl);
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload file" },
          { status: 500 }
        );
      }
    }

    // Get or create ResourcesPage document
    let resourcesPage = await ResourcesPage.findOne();
    console.log("Existing ResourcesPage:", !!resourcesPage);
    
    if (!resourcesPage) {
      resourcesPage = await ResourcesPage.create({
        bannerImage: "",
        documents: [],
      });
      console.log("Created new ResourcesPage");
    }

    // Add new document
    const newDocument = {
      title,
      type: file?.type || "document",
      link: fileUrl,
      description: desc,
    };

    resourcesPage.documents.push(newDocument);
    await resourcesPage.save();
    
    // Return the newly created document with its generated _id
    const savedDocument = resourcesPage.documents[resourcesPage.documents.length - 1];
    console.log("Saved new document:", savedDocument._id);

    return NextResponse.json(savedDocument, { status: 201 });
  } catch (error) {
    console.error("Error creating resource:", error);
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    );
  }
}

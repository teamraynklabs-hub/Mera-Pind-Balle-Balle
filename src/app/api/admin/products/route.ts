import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import Product from "@/lib/models/Product.model";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    await connectDB();
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: products });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    await connectDB();
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const originalPrice = Number(formData.get("originalPrice") || 0);
    const category = (formData.get("category") as string) || "";
    const stock = Number(formData.get("stock") || 0);
    const sku = (formData.get("sku") as string) || "";
    const material = (formData.get("material") as string) || "";
    const color = (formData.get("color") as string) || "";
    const weight = (formData.get("weight") as string) || "";
    const story = (formData.get("story") as string) || "";
    const careInstructions = (formData.get("careInstructions") as string) || "";
    const socialImpact = (formData.get("socialImpact") as string) || "";
    const isActive = formData.get("isActive") !== "false";
    const isFeatured = formData.get("isFeatured") === "true";
    const file = formData.get("image") as File;

    if (!name || !description || !price || !file) {
      return NextResponse.json(
        { success: false, message: "Name, description, price, and image are required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const upload: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "mpbb/products" },
          (err, result) => (err ? reject(err) : resolve(result))
        )
        .end(buffer);
    });

    const product = await Product.create({
      name,
      description,
      price,
      originalPrice,
      category,
      stock,
      sku,
      material,
      color,
      weight,
      story,
      careInstructions,
      socialImpact,
      isActive,
      isFeatured,
      image: upload.secure_url,
      imageId: upload.public_id,
    });

    revalidatePath("/products");

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to create product" },
      { status: 500 }
    );
  }
}

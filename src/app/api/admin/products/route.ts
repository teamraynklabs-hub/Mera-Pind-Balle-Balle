import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import Product from "@/lib/models/Product.model";
import { requireAdmin } from "@/lib/requireAdmin";

export async function POST(
  req: Request
) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) {
      return adminCheck;
    }

    await connectDB();
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const isActive = formData.get("isActive") !== "false";
    const file = formData.get("image") as File;

    if (!name || !description || !price || !file) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());

    const upload: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "mpbb/products" },
        (err, result) => (err ? reject(err) : resolve(result))
      ).end(buffer);
    });

 const product = await Product.create({
  name,
  description,
  price,
  image: upload.secure_url,
  imageId: upload.public_id, 
});


    return NextResponse.json(product);

  } catch (error) {
    console.error("ADMIN CREATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request
) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) {
      return adminCheck;
    }

    await connectDB();
    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(products);
  } catch (error) {
    console.error("ADMIN GET PRODUCTS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}



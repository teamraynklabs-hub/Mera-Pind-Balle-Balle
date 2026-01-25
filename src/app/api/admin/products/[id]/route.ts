import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import Product from "@/lib/models/Product.model";
import { requireAdmin } from "@/lib/requireAdmin";


export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) {
      return adminCheck;
    }

    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const file = formData.get("image") as File | null;

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const updateData: any = {
      name,
      description,
      price,
    };

    // 🔁 Replace image if new file uploaded
    if (file && file.size > 0) {
      // delete old image from Cloudinary if it exists
      if (product.imageId) {
        await cloudinary.uploader.destroy(product.imageId);
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const upload: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "mpbb/products" },
          (err, result) => (err ? reject(err) : resolve(result))
        ).end(buffer);
      });

      updateData.image = upload.secure_url;
      updateData.imageId = upload.public_id;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("ADMIN UPDATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) {
      return adminCheck;
    }

    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // 🧹 Remove image from Cloudinary if it exists
    if (product.imageId) {
      await cloudinary.uploader.destroy(product.imageId);
    }

    // 🗑 Delete product from database
    await Product.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN DELETE PRODUCT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

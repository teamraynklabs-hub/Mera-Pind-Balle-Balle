import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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
    if (adminCheck instanceof NextResponse) return adminCheck;

    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID required" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const formData = await req.formData();

    const updateData: Record<string, unknown> = {};

    const textFields = [
      "name", "description", "category", "sku", "material",
      "color", "weight", "story", "careInstructions", "socialImpact",
    ];
    for (const field of textFields) {
      const val = formData.get(field);
      if (val !== null) updateData[field] = val;
    }

    const numFields = ["price", "originalPrice", "stock"];
    for (const field of numFields) {
      const val = formData.get(field);
      if (val !== null) updateData[field] = Number(val);
    }

    const isActive = formData.get("isActive");
    if (isActive !== null) updateData.isActive = isActive !== "false";

    const isFeatured = formData.get("isFeatured");
    if (isFeatured !== null) updateData.isFeatured = isFeatured === "true";

    const file = formData.get("image") as File | null;
    if (file && file.size > 0) {
      if (product.imageId) {
        await cloudinary.uploader.destroy(product.imageId);
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

      updateData.image = upload.secure_url;
      updateData.imageId = upload.public_id;
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    revalidatePath("/products");

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID required" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    if (product.imageId) {
      await cloudinary.uploader.destroy(product.imageId);
    }

    await Product.findByIdAndDelete(id);

    revalidatePath("/products");

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    );
  }
}

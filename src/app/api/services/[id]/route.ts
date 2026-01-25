import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Service from "@/lib/models/Service.model";
import { Types } from "mongoose";
import { deleteCloudinaryImage } from "@/lib/cloudinaryDelete";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid service ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const service = await Service.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: service,
    });
  } catch (error: any) {
    console.error("PATCH SERVICE ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update service" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid service ID" },
        { status: 400 }
      );
    }

    const service = await Service.findById(id);

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if it exists
    if (service.icon) {
      await deleteCloudinaryImage(service.icon);
    }

    await Service.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE SERVICE ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete service" },
      { status: 500 }
    );
  }
}

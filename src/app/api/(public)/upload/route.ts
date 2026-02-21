import { NextResponse } from "next/server";
import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    // Check for admin key header OR session authentication
    const adminKey = req.headers.get("x-admin-key");
    const isAdminKeyValid = adminKey === process.env.ADMIN_API_KEY;

    // If no valid admin key, check session
    if (!isAdminKeyValid) {
      const session = await auth();
      if (!session || !session.user) {
        return NextResponse.json(
          { error: "Unauthorized: Admin access only" },
          { status: 401 }
        );
      }
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "mpbb/services" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      secure_url: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("ADMIN UPLOAD ERROR:", error);
    return NextResponse.json(
      { error: "Image upload failed" },
      { status: 500 }
    );
  }
}

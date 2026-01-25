import cloudinary from "@/lib/cloudinary";

export async function deleteCloudinaryImage(imageUrl?: string) {
  if (!imageUrl) return;

  try {
    const parts = imageUrl.split("/upload/");
    if (parts.length < 2) return;

    const publicIdWithExt = parts[1].split(".")[0];
    const publicId = publicIdWithExt.replace(/^v\d+\//, "");

    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("CLOUDINARY DELETE ERROR:", err);
  }
}

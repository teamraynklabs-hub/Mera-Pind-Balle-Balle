# Cloudinary Integration

## Overview

Cloudinary serves as the **image CDN and management platform** for all user-uploaded content. Images are uploaded via stream, organized in folders, and served through Cloudinary's global CDN.

## Configuration

**File**: `src/lib/cloudinary.ts`

```typescript
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
```

**Environment Variables**:
```
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>
```

## Upload Pattern

### Stream-Based Upload

All uploads use the stream API to avoid writing temporary files to disk:

```typescript
const file = formData.get("image") as File;
const buffer = Buffer.from(await file.arrayBuffer());

const upload = await new Promise((resolve, reject) => {
  cloudinary.uploader
    .upload_stream(
      { folder: "mpbb/products" },
      (err, result) => (err ? reject(err) : resolve(result))
    )
    .end(buffer);
});

// Result:
// upload.secure_url → "https://res.cloudinary.com/..."
// upload.public_id → "mpbb/products/abc123"
```

### Folder Organization

| Content Type | Cloudinary Folder | Used By |
|-------------|-------------------|---------|
| Product images | `mpbb/products` | Product CRUD |
| Blog images | `mpbb/blogs` | Blog CRUD |
| Story images | `mpbb/stories` | Story CRUD |
| Distributor logos | `mpbb/distributors` | Distributor CRUD |
| Service images | `mpbb/services` | Service CRUD |
| General uploads | `mpbb/uploads` | Upload endpoint |

## Deletion Pattern

**File**: `src/lib/cloudinaryDelete.ts`

```typescript
export async function deleteCloudinaryImage(imageUrl?: string) {
  if (!imageUrl) return;

  // Extract public_id from URL
  const publicIdWithExt = imageUrl.split("/upload/")[1].split(".")[0];
  const publicId = publicIdWithExt.replace(/^v\d+\//, "");

  await cloudinary.uploader.destroy(publicId);
}
```

### When Deletion Occurs

1. **Product update** — Old image deleted before new image upload
2. **Product deletion** — Main image and additional images deleted
3. **Blog/Story deletion** — Featured image deleted
4. **Distributor deletion** — Logo image deleted

## Update Flow

```
User submits form with new image
    │
    ├── Check if entity has existing image
    │   └── If yes: cloudinary.uploader.destroy(oldImageId)
    │
    ├── Upload new image via stream
    │   └── Store: { image: secure_url, imageId: public_id }
    │
    └── Save entity to database
```

## Upload Endpoint

**Route**: `POST /api/upload`

**Authentication**: Admin session OR `x-admin-key` header

```typescript
// Dual auth check
const session = await auth();
const adminKey = req.headers.get("x-admin-key");

if (!session?.user?.role === "admin" && adminKey !== process.env.ADMIN_API_KEY) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

## Next.js Image Configuration

```typescript
// next.config.ts
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "res.cloudinary.com",
    },
    {
      protocol: "https",
      hostname: "images.unsplash.com",
    },
  ],
}
```

This allows `next/image` to optimize and serve images from these domains.

## Serverless Consideration

Cloudinary is listed as a `serverExternalPackage` in Next.js config to prevent bundling issues:

```typescript
// next.config.ts
serverExternalPackages: ["cloudinary"],
```

## Data Model Pattern

Entities store both the URL and Cloudinary public ID:

```typescript
{
  image: "https://res.cloudinary.com/...",  // For display
  imageId: "mpbb/products/abc123",          // For deletion/updates
}
```

Products support multiple images:

```typescript
{
  image: String,          // Primary image
  imageId: String,        // Primary image Cloudinary ID
  images: [{              // Additional gallery images
    url: String,
    imageId: String,
  }],
}
```

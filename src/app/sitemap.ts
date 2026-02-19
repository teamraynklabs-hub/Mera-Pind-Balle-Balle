import { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/stories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/distributors`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-conditions`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    await connectDB();

    const Blog = (await import("@/lib/models/Blog.model")).default;
    const Story = (await import("@/lib/models/Story.model")).default;
    const Product = (await import("@/lib/models/Product.model")).default;

    const [blogs, stories, products] = await Promise.all([
      Blog.find({ isPublished: true }, { slug: 1, updatedAt: 1 }).lean().exec(),
      Story.find({ isPublished: true }, { slug: 1, updatedAt: 1 }).lean().exec(),
      Product.find({ isActive: true }, { _id: 1, category: 1, updatedAt: 1 }).lean().exec(),
    ]);

    const blogPages: MetadataRoute.Sitemap = (blogs || []).map((blog: any) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.updatedAt || new Date()),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    const storyPages: MetadataRoute.Sitemap = (stories || []).map((story: any) => ({
      url: `${baseUrl}/stories/${story.slug}`,
      lastModified: new Date(story.updatedAt || new Date()),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    const productPages: MetadataRoute.Sitemap = (products || []).map((product: any) => ({
      url: `${baseUrl}/product/${product._id}`,
      lastModified: new Date(product.updatedAt || new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Category pages from unique product categories
    const categories = [
      ...new Set(
        (products || [])
          .map((p: any) => p.category)
          .filter((c: string) => c && c.trim() !== "")
      ),
    ];

    const categoryPages: MetadataRoute.Sitemap = categories.map((cat: any) => ({
      url: `${baseUrl}/products?category=${encodeURIComponent(cat)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...staticPages, ...productPages, ...categoryPages, ...blogPages, ...storyPages];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return staticPages;
  }
}

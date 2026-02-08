import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

import { connectDB } from "@/lib/db";
import Blog from "@/lib/models/Blog.model";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://merapind.com";

async function fetchBlogBySlug(slug: string) {
  await connectDB();

  return Blog.findOne({
    slug: slug.trim().toLowerCase(),
    isPublished: true,
  }).lean();
}

// disable caching completely
export const dynamic = "force-dynamic";
export const revalidate = 0;

// === GENERATE STATIC PARAMS FOR PERFORMANCE ===
export async function generateStaticParams() {
  await connectDB();
  const blogs = await Blog.find({ isPublished: true }, { slug: 1 }).lean();
  return blogs.map((blog: any) => ({ slug: blog.slug }));
}

// === METADATA ===
export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;

  const blog = await fetchBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Not Found — Mera Pind Balle Balle",
      description: "No article found for this blog.",
    };
  }

  const url = `${BASE_URL}/blog/${blog.slug}`;

  return {
    title: blog.title,
    description: blog.excerpt,
    keywords: blog.tags || [],
    authors: [{ name: "Mera Pind Balle Balle" }],
    openGraph: {
      type: "article",
      url,
      title: blog.title,
      description: blog.excerpt,
      images: [
        {
          url: blog.image,
          width: 1200,
          height: 630,
          alt: blog.title,
          type: "image/jpeg",
        },
      ],
      publishedTime: blog.createdAt ? new Date(blog.createdAt).toISOString() : undefined,
      modifiedTime: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : undefined,
      authors: ["Mera Pind Balle Balle"],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: [blog.image],
      creator: "@MeraPindBalleBalle",
    },
    alternates: {
      canonical: url,
    },
  };
}

// === PAGE RENDER ===
export default async function BlogDetailPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;

  const blog = await fetchBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const url = `${BASE_URL}/blog/${blog.slug}`;
  const createdDate = blog.createdAt ? new Date(blog.createdAt) : new Date();
  const updatedDate = blog.updatedAt ? new Date(blog.updatedAt) : new Date();

  // Validate dates are valid
  const createdISO = !isNaN(createdDate.getTime()) ? createdDate.toISOString() : new Date().toISOString();
  const updatedISO = !isNaN(updatedDate.getTime()) ? updatedDate.toISOString() : new Date().toISOString();

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <header className="mb-10">
        <Image
          src={blog.image}
          alt={blog.title}
          width={1200}
          height={630}
          priority
          className="w-full h-auto rounded-xl"
        />
      </header>

      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-4">{blog.title}</h1>

        <time
          dateTime={createdISO}
          className="text-muted-foreground text-sm"
        >
          {createdDate.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>

      <div className="prose prose-lg max-w-none mb-10">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>

      <nav className="mt-10 border-t pt-6">
        <a href="/blog" className="text-primary hover:underline">
          ← Back to All Blogs
        </a>
      </nav>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: blog.title,
            description: blog.excerpt,
            image: blog.image,
            datePublished: createdISO,
            dateModified: updatedISO,
            author: {
              "@type": "Organization",
              name: "Mera Pind Balle Balle",
              url: BASE_URL,
            },
            articleBody: blog.content,
            url,
          }),
        }}
      />
    </article>
  );
}

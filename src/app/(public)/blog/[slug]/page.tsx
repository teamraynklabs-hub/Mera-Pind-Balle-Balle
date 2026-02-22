import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Blog from "@/lib/models/Blog.model";
import Breadcrumbs from "@/components/common/Breadcrumbs";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function fetchBlogBySlug(slug: string) {
  await connectDB();

  const blog = await Blog.findOne({
    slug: slug.trim().toLowerCase(),
    isPublished: true,
  }).lean();

  return blog ? JSON.parse(JSON.stringify(blog)) : null;
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
    title: `${blog.title} — Mera Pind Balle Balle`,
    description: blog.excerpt,
    keywords: blog.tags || [],
    authors: [{ name: blog.author || "Mera Pind Balle Balle" }],
    openGraph: {
      type: "article",
      url,
      title: blog.title,
      description: blog.excerpt,
      images: blog.image
        ? [{ url: blog.image, width: 1200, height: 630, alt: blog.title }]
        : [],
      publishedTime: blog.createdAt
        ? new Date(blog.createdAt).toISOString()
        : undefined,
      modifiedTime: blog.updatedAt
        ? new Date(blog.updatedAt).toISOString()
        : undefined,
      authors: [blog.author || "Mera Pind Balle Balle"],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: blog.image ? [blog.image] : [],
    },
    alternates: { canonical: url },
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
  const createdISO = !isNaN(createdDate.getTime())
    ? createdDate.toISOString()
    : new Date().toISOString();
  const updatedISO = blog.updatedAt
    ? new Date(blog.updatedAt).toISOString()
    : createdISO;

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <Breadcrumbs
        items={[
          { label: "Blog", href: "/blog" },
          { label: blog.title },
        ]}
      />

      {/* Cover Image */}
      {blog.image && (
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
      )}

      {/* Title & Meta */}
      <div className="mb-8">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>{blog.author || "Mera Pind Balle Balle"}</span>
          <span>&middot;</span>
          <time dateTime={createdISO}>
            {createdDate.toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {blog.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/blog?search=${encodeURIComponent(tag)}`}
                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-10 leading-relaxed">
        {blog.content ? (
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        ) : (
          <p>No content available.</p>
        )}
      </div>

      {/* Back Link */}
      <nav className="mt-10 border-t pt-6">
        <Link href="/blog" className="text-primary hover:underline">
          &larr; Back to All Blogs
        </Link>
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
              "@type": "Person",
              name: blog.author || "Mera Pind Balle Balle",
            },
            publisher: {
              "@type": "Organization",
              name: "Mera Pind Balle Balle",
              url: BASE_URL,
            },
            url,
          }),
        }}
      />
    </article>
  );
}

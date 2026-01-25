import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { connectDB } from "@/lib/db";
import Blog from "@/lib/models/Blog.model";

async function fetchBlogBySlug(slug: string) {
  await connectDB();

  return Blog.findOne({
    slug: slug.trim().toLowerCase(),
    isPublished: true,
  }).lean();
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

  return {
    title: `${blog.title} — Mera Pind Balle Balle`,
    description: blog.excerpt,
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


  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <section className="mb-10">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-80 object-cover rounded-xl"
        />
      </section>

      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

      <p className="text-muted-foreground text-sm mb-8">
        {new Date(blog.date).toDateString()}
      </p>

      <article className="prose prose-invert max-w-none">
        {blog.content}
      </article>

      <section className="mt-10">
        <a href="/blog" className="text-primary underline">
          ← Back to Blogs
        </a>
      </section>
    </main>
  );
}

import axios from "axios";
import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Metadata } from "next";

// === FETCH BLOG LIST ===
async function fetchBlogs() {
  try {
    const base = getBaseUrl();
    const res = await axios.get(`${base}/api/blogs`);
    return Array.isArray(res.data) ? res.data : [];
  } catch {
    return [];
  }
}

// === METADATA ===
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const resolved = await params; // IMPORTANT FIX

  const blogs = await fetchBlogs();
  const blog = blogs.find((b: any) => b.slug === resolved.slug);

  if (!blog) {
    return {
      title: "Blog Not Found — Mera Pind Balle Balle",
      description: "No article found for this slug."
    };
  }

  return {
    title: `${blog.title} — Mera Pind Balle Balle`,
    description: blog.summary
  };
}

// === PAGE RENDER ===
export default async function BlogDetailPage({ params }: any) {
  const resolved = await params; // IMPORTANT FIX

  console.log("SLUG =", resolved.slug);

  if (!resolved.slug) {
    return (
      <main className="container mx-auto p-10 text-center">
        <h1 className="text-xl font-bold">Invalid Blog URL</h1>
        <p className="text-muted-foreground">Slug missing.</p>
      </main>
    );
  }

  const blogs = await fetchBlogs();
  const blog = blogs.find((b: any) => b.slug === resolved.slug);

  if (!blog) {
    return (
      <main className="container mx-auto p-10 text-center">
        <h1 className="text-2xl font-bold">Blog Not Found</h1>
        <a href="/blog" className="text-primary underline">Go Back</a>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <section className="mb-12">
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

      <article className="prose text-muted-foreground leading-relaxed">
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

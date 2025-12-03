import axios from "axios";
import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Metadata } from "next";

// GET ALL BLOG POSTS
async function fetchBlogs() {
  try {
    const base = getBaseUrl();
    const res = await axios.get(`${base}/api/blogs`, {
      headers: { "Cache-Control": "no-cache" }
    });
    return res.data || [];
  } catch (err) {
    console.error("BLOG DETAIL FETCH ERROR:", err);
    return [];
  }
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  try {
    const blogs = await fetchBlogs();
    const blog = blogs?.find((b: any) => b.slug === params.slug);

    if (!blog) {
      return {
        title: "Blog Not Found — Mera Pind",
        description: "This blog post does not exist.",
      };
    }

    return {
      title: `${blog.title} — Mera Pind`,
      description: blog.summary,
    };
  } catch (err) {
    console.error("METADATA ERROR:", err);

    return {
      title: "Blog — Mera Pind",
      description: "Blog content could not be loaded.",
    };
  }
}


export default async function BlogDetailPage({ params }: any) {
  const blogs = await fetchBlogs();
  const blog = blogs.find((b: any) => b.slug === params.slug);

  if (!blog) {
    return (
      <main className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Blog Not Found</h1>
        <p className="text-muted-foreground">
          The blog you are looking for does not exist.
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">

      <section className="mb-12">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-80 object-cover rounded-xl shadow"
        />
      </section>

      <section className="mb-10">
        <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
        <p className="text-sm text-muted-foreground">
          {new Date(blog.date).toDateString()}
        </p>
      </section>

      <section className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
        {blog.content}
      </section>

      <section className="mt-10">
        <a href="/blog" className="text-primary hover:underline">
          ← Back to Blogs
        </a>
      </section>
    </main>
  );
}

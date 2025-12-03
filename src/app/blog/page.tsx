import axios from "axios";
import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Mera Pind",
  description:
    "Explore inspiring stories, updates, and insights about rural development, empowerment, and sustainable growth.",
};

async function getBlogs() {
  try {
    const base = getBaseUrl();
    const res = await axios.get(`${base}/api/blogs`);
    return res.data;
  } catch (error) {
    console.error("BLOG FETCH ERROR:", error);
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <main className="container mx-auto px-4 py-12">

      {/* PAGE HEADER */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Latest Blogs</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Read inspiring stories and updates from our community initiatives.
        </p>
      </section>

      {/* BLOG GRID */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
        {blogs.map((blog: any) => (
          <article
            key={blog.slug}
            className="bg-card border rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-56 object-cover"
            />

            <div className="p-6">
              <p className="text-xs text-muted-foreground mb-2">
                {new Date(blog.date).toDateString()}
              </p>

              <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>

              <p className="text-sm text-muted-foreground mb-4">
                {blog.summary}
              </p>

              <a
                href={`/blog/${blog.slug}`}
                className="text-primary text-sm font-medium hover:underline"
              >
                Read More →
              </a>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

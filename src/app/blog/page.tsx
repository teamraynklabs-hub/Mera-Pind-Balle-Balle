import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Blog from "@/lib/models/Blog.model";

export const metadata: Metadata = {
  title: "Blog — Mera Pind Balle Balle",
  description:
    "Read inspiring stories, updates, and news from rural communities.",
};

// Disable caching completely for real-time data
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Fetch blogs (search + pagination)
async function fetchBlogs(search: string, page: number, limit: number) {
  try {
    const base = getBaseUrl();
    const params = new URLSearchParams({
      search: search || "",
      page: page.toString(),
      limit: limit.toString(),
    });

    const res = await fetch(`${base}/api/blogs?${params}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch blogs");

    const data = await res.json();

    return {
      blogs: data.blogs ?? [],
      total: data.total ?? 0,
    };
  } catch (error) {
    console.error(error);
    return { blogs: [], total: 0 };
  }
}



export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;

  const search = params?.search ?? "";
  const page = Number(params?.page ?? 1);
  const limit = 6;

  const { blogs = [], total = 0 } = await fetchBlogs(
    search,
    page,
    limit
  );

  const totalPages = Math.ceil(total / limit);

  return (
    <main className="container mx-auto px-4 py-12">
      <section className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Latest Blogs
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore real stories, updates and inspiring journeys
          from rural India.
        </p>
      </section>

      {/* SEARCH */}
      <form className="max-w-md mx-auto mb-12" method="GET">
        <input
          type="text"
          name="search"
          placeholder="Search blogs..."
          defaultValue={search}
          className="w-full px-4 py-3 border rounded-lg bg-background shadow-sm"
        />

        <button
          type="submit"
          className="mt-3 w-full bg-primary text-white py-2 rounded-md"
        >
          Search
        </button>
      </form>

      {/* BLOG GRID */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
        {blogs.map((blog: any) => (
          <a
            key={blog.slug}
            href={`/blog/${blog.slug}`}
            className="block bg-card border rounded-xl shadow-sm hover:shadow-lg transition"
          >
            {blog.image && (
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-56 object-cover"
              />
            )}

            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">
                {blog.title}
              </h2>

              <p className="text-sm text-muted-foreground line-clamp-3">
                {blog.excerpt}
              </p>

              <p className="text-xs text-primary mt-3">
                {blog.createdAt
                  ? new Date(blog.createdAt || blog.data).toDateString()
                  : ""}
              </p>
            </div>
          </a>
        ))}
      </section>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <section className="flex justify-center items-center gap-4 mt-10">
          <a
            href={`?search=${search}&page=${page - 1}`}
            className={`px-4 py-2 border rounded-md ${
              page <= 1
                ? "opacity-40 pointer-events-none"
                : "hover:bg-accent"
            }`}
          >
            Previous
          </a>

          <span className="px-4 py-2 text-sm bg-accent rounded-md">
            Page {page} / {totalPages}
          </span>

          <a
            href={`?search=${search}&page=${page + 1}`}
            className={`px-4 py-2 border rounded-md ${
              page >= totalPages
                ? "opacity-40 pointer-events-none"
                : "hover:bg-accent"
            }`}
          >
            Next
          </a>
        </section>
      )}
    </main>
  );
}

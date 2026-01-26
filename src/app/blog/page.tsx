import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Mera Pind Balle Balle",
  description:
    "Read inspiring stories, updates, and news from rural communities.",
};

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
      cache: "force-cache",
      next: { revalidate: 300 }, // 5 minutes
    });

    if (!res.ok) {
      throw new Error(`Blog fetch failed: ${res.status}`);
    }

    const data = await res.json();

    return {
      blogs: Array.isArray(data.blogs) ? data.blogs : [],
      total: typeof data.total === "number" ? data.total : 0,
    };
  } catch (error) {
    console.error("BLOG FETCH ERROR:", error);
    return { blogs: [], total: 0 };
  }
}



export default async function BlogPage(props: any) {
  // NEXT FIX — unwrap the promise first
  const searchParams = await props.searchParams;

  const search = searchParams?.search ?? "";
  const page = Number(searchParams?.page ?? 1);
  const limit = 6;

  const { blogs = [], total = 0 } = await fetchBlogs(search, page, limit);

  const totalPages = Math.ceil(total / limit);

  return (
    <main className="container mx-auto px-4 py-12">
      {/* TITLE */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Latest Blogs</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore real stories, updates and inspiring journeys from rural India.
        </p>
      </section>

      {/* SEARCH BAR */}
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
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-56 object-cover"
            />

            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {blog.excerpt}
              </p>

              <p className="text-xs text-primary mt-3">
                {new Date(blog.date).toDateString()}
              </p>
            </div>
          </a>
        ))}
      </section>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <section className="flex justify-center items-center gap-4 mt-10">
          {/* PREVIOUS */}
          <a
            href={`?search=${search}&page=${page - 1}`}
            className={`px-4 py-2 border rounded-md ${
              page <= 1
                ? "opacity-40 pointer-events-none"
                : "hover:bg-accent transition"
            }`}
          >
            Previous
          </a>

          <span className="px-4 py-2 text-sm bg-accent rounded-md">
            Page {page} / {totalPages}
          </span>

          {/* NEXT */}
          <a
            href={`?search=${search}&page=${page + 1}`}
            className={`px-4 py-2 border rounded-md ${
              page >= totalPages
                ? "opacity-40 pointer-events-none"
                : "hover:bg-accent transition"
            }`}
          >
            Next
          </a>
        </section>
      )}
    </main>
  );
}

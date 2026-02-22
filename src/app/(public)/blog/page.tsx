import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Metadata } from "next";
import { breadcrumbForPage } from "@/lib/seo";
import BlogPageClient from "@/components/features/blog/BlogPageClient";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

export const metadata: Metadata = {
  title: "Blog — Mera Pind Balle Balle",
  description:
    "Read inspiring stories, updates, and news from rural communities.",
  alternates: { canonical: `${baseUrl}/blog` },
  openGraph: {
    title: "Blog — Mera Pind Balle Balle",
    description: "Read inspiring stories, updates, and news from rural communities.",
    url: `${baseUrl}/blog`,
    type: "website",
  },
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

  const { blogs = [], total = 0 } = await fetchBlogs(search, page, limit);

  return (
    <main className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbForPage("Blog", "/blog")) }}
      />

      <BlogPageClient
        blogs={blogs}
        total={total}
        page={page}
        limit={limit}
        search={search}
      />
    </main>
  );
}

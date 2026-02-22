"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import BlogHero from "./BlogHero";
import BlogFeatured from "./BlogFeatured";
import BlogGrid from "./BlogGrid";
import BlogNewsletter from "./BlogNewsletter";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  tags: string[];
}

interface BlogApiResponse {
  blogs: any[];
  total: number;
  page: number;
  limit: number;
  topics: string[];
}

const POLL_INTERVAL = 30_000;

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function normalizeBlog(b: any): BlogPost {
  return {
    slug: b.slug,
    title: b.title,
    excerpt: b.excerpt,
    image: b.image || "",
    author: b.author || "Mera Pind Balle Balle",
    date: formatDate(b.date || b.createdAt),
    tags: b.tags || [],
  };
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="section-padding text-center">
        <div className="h-12 w-72 bg-muted/40 rounded mx-auto mb-4" />
        <div className="h-6 w-96 bg-muted/30 rounded mx-auto mb-8" />
        <div className="h-12 w-full max-w-xl bg-muted/30 rounded-xl mx-auto" />
      </div>
      <div className="section-container mb-16">
        <div className="h-72 rounded-2xl bg-muted/30" />
      </div>
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 rounded-xl bg-muted/30" />
          ))}
        </div>
      </div>
    </div>
  );
}

function BlogPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || 1);
  const limit = 6;

  const [data, setData] = useState<BlogApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const fetchBlogs = useCallback(
    async (isInitial = false) => {
      try {
        const params = new URLSearchParams({
          search,
          page: page.toString(),
          limit: limit.toString(),
        });

        const res = await fetch(`/api/blogs?${params}`, { cache: "no-store" });
        const json = await res.json();

        if (!mountedRef.current) return;

        if (json.success && json.data) {
          setData(json.data);
        }
      } catch {
        // Silently fail on poll errors
      } finally {
        if (isInitial && mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [search, page, limit]
  );

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    fetchBlogs(true);

    const interval = setInterval(() => fetchBlogs(false), POLL_INTERVAL);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchBlogs]);

  if (loading) return <LoadingSkeleton />;

  if (!data || data.blogs.length === 0) {
    return (
      <>
        <BlogHero topics={data?.topics || []} initialSearch={search} />
        <div className="section-container section-padding text-center">
          <p className="text-muted-foreground text-lg">
            {search
              ? `No articles found for "${search}". Try a different search term.`
              : "No blog posts yet. Check back soon!"}
          </p>
        </div>
        <BlogNewsletter />
      </>
    );
  }

  const allPosts = data.blogs.map(normalizeBlog);
  const featuredPost = allPosts[0];
  const gridPosts = allPosts.slice(1);
  const totalPages = Math.ceil(data.total / limit);

  return (
    <>
      <BlogHero topics={data.topics} initialSearch={search} />

      {featuredPost && <BlogFeatured post={featuredPost} />}

      {gridPosts.length > 0 && (
        <BlogGrid
          posts={gridPosts}
          totalPages={totalPages}
          currentPage={page}
          search={search}
        />
      )}

      <BlogNewsletter />
    </>
  );
}

export default function BlogPageClient() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <BlogPageInner />
    </Suspense>
  );
}

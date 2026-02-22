"use client";

import { Suspense } from "react";
import BlogHero from "./BlogHero";
import BlogFeatured from "./BlogFeatured";
import BlogGrid from "./BlogGrid";
import BlogNewsletter from "./BlogNewsletter";

/* ── Temporary dummy blog data (replace when backend returns author/tags/featured) ── */
const DUMMY_BLOGS = [
  {
    slug: "story-behind-block-printing",
    title: "The Story Behind Block Printing",
    excerpt:
      "Uncover the rich history of block printing, a traditional art form that transforms fabric into masterpieces.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
    author: "Priya Sharma",
    date: "21/02/2026",
    tags: ["traditional crafts", "heritage textiles"],
    featured: true,
  },
  {
    slug: "sustainable-living-small-changes",
    title: "Sustainable Living: Small Changes, Big Impact",
    excerpt:
      "Practical tips for incorporating sustainable, handcrafted products into your daily life and supporting rural communities.",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
    author: "Priya Sharma",
    date: "20/02/2026",
    tags: ["sustainable fashion", "eco-friendly"],
    featured: false,
  },
  {
    slug: "terracotta-jewelry-earth-to-elegance",
    title: "Terracotta Jewelry: Earth to Elegance",
    excerpt:
      "Discover the timeless beauty of terracotta jewelry and the skilled artisans who transform clay into wearable art.",
    image:
      "https://images.unsplash.com/photo-1515562141589-67f0d2da1b3b?w=800&q=80",
    author: "Priya Sharma",
    date: "18/02/2026",
    tags: ["artisans", "traditional crafts"],
    featured: false,
  },
  {
    slug: "natural-dyes-eco-friendly-choice",
    title: "Natural Dyes: The Eco-Friendly Choice",
    excerpt:
      "Learn about the sustainable practice of using natural dyes extracted from plants, flowers, and minerals to color fabrics.",
    image:
      "https://images.unsplash.com/photo-1606722590656-3019cf763c10?w=800&q=80",
    author: "Priya Sharma",
    date: "15/02/2026",
    tags: ["natural dyes", "eco-friendly"],
    featured: false,
  },
  {
    slug: "women-weavers-of-rajasthan",
    title: "Women Weavers of Rajasthan",
    excerpt:
      "Meet the incredible women artisans of Rajasthan who are keeping centuries-old weaving traditions alive while building sustainable livelihoods.",
    image:
      "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=800&q=80",
    author: "Priya Sharma",
    date: "12/02/2026",
    tags: ["rural women", "handweaving"],
    featured: false,
  },
  {
    slug: "bamboo-craft-revival",
    title: "The Revival of Bamboo Craft",
    excerpt:
      "How rural artisan communities are reviving ancient bamboo craftsmanship to create modern, eco-conscious home decor.",
    image:
      "https://images.unsplash.com/photo-1567225591450-06036b3392a6?w=800&q=80",
    author: "Priya Sharma",
    date: "10/02/2026",
    tags: ["traditional crafts", "eco-friendly"],
    featured: false,
  },
];

interface BlogFromDB {
  slug: string;
  title: string;
  excerpt: string;
  image?: string;
  date?: string;
  createdAt?: string;
}

interface BlogPageClientProps {
  blogs: BlogFromDB[];
  total: number;
  page: number;
  limit: number;
  search: string;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function BlogPageClient({
  blogs,
  total,
  page,
  limit,
  search,
}: BlogPageClientProps) {
  const hasBackendData = blogs.length > 0;

  /* ── Normalize posts: use backend data or fall back to dummy ── */
  const allPosts = hasBackendData
    ? blogs.map((b) => ({
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt,
        image: b.image || "",
        author: "Priya Sharma", // DB model lacks author field — fallback
        date: formatDate(b.date || b.createdAt),
        tags: [] as string[],
        featured: false,
      }))
    : DUMMY_BLOGS;

  /* ── Featured post: first item ── */
  const featuredPost = allPosts[0];

  /* ── Grid posts: remaining items ── */
  const gridPosts = allPosts.slice(1);

  const totalPages = hasBackendData
    ? Math.ceil(total / limit)
    : 1;

  return (
    <>
      {/* Section 1 — Hero */}
      <Suspense fallback={null}>
        <BlogHero initialSearch={search} />
      </Suspense>

      {/* Section 2 — Featured Post */}
      {featuredPost && <BlogFeatured post={featuredPost} />}

      {/* Section 3 — Blog Grid */}
      {gridPosts.length > 0 && (
        <BlogGrid
          posts={gridPosts}
          totalPages={totalPages}
          currentPage={page}
          search={search}
        />
      )}

      {/* Section 4 — Newsletter */}
      <BlogNewsletter />
    </>
  );
}

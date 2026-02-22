"use client";

import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  tags?: string[];
}

interface BlogGridProps {
  posts: BlogPost[];
  totalPages: number;
  currentPage: number;
  search: string;
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link href={`/blog/${post.slug}`} className="block group h-full">
        <article className="card-interactive h-full flex flex-col overflow-hidden">
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden">
            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">No Image</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6 flex flex-col flex-1">
            {/* Meta */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <User size={12} />
                {post.author}
              </span>
            </div>

            {/* Title */}
            <h3
              className="text-lg sm:text-xl font-bold mb-2 leading-snug text-[#D4A336] line-clamp-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1">
              {post.excerpt}
            </p>

            {/* Read Article */}
            <span className="inline-flex items-center gap-2 text-sm text-primary font-medium group-hover:gap-3 transition-all duration-300 mt-auto">
              Read Article
              <ArrowRight size={14} />
            </span>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

export default function BlogGrid({
  posts,
  totalPages,
  currentPage,
  search,
}: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <section className="section-container section-padding text-center">
        <p className="text-muted-foreground text-lg">
          No articles found. Try a different search term.
        </p>
      </section>
    );
  }

  return (
    <section className="section-container pb-16 md:pb-24">
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {posts.map((post, index) => (
          <BlogCard key={post.slug} post={post} index={index} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-14">
          <Link
            href={`/blog?search=${encodeURIComponent(search)}&page=${currentPage - 1}`}
            className={`px-5 py-2.5 rounded-lg border border-border text-sm font-medium transition-all duration-200 ${
              currentPage <= 1
                ? "opacity-40 pointer-events-none"
                : "hover:bg-card hover:shadow-[var(--shadow-soft)]"
            }`}
          >
            Previous
          </Link>

          <span className="px-5 py-2.5 text-sm font-medium bg-card border border-border rounded-lg">
            Page {currentPage} / {totalPages}
          </span>

          <Link
            href={`/blog?search=${encodeURIComponent(search)}&page=${currentPage + 1}`}
            className={`px-5 py-2.5 rounded-lg border border-border text-sm font-medium transition-all duration-200 ${
              currentPage >= totalPages
                ? "opacity-40 pointer-events-none"
                : "hover:bg-card hover:shadow-[var(--shadow-soft)]"
            }`}
          >
            Next
          </Link>
        </div>
      )}
    </section>
  );
}

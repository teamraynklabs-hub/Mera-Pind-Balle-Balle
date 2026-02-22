"use client";

import Image from "next/image";
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

interface BlogFeaturedProps {
  post: BlogPost;
}

export default function BlogFeatured({ post }: BlogFeaturedProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="section-container mb-16 md:mb-24">
      <Link href={`/blog/${post.slug}`} className="block group">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-card border border-border rounded-2xl overflow-hidden shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-deep)] transition-shadow duration-500"
        >
          {/* Image */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden">
            <span className="absolute top-4 left-4 z-10 px-4 py-1.5 rounded-full bg-[#D4A336] text-white text-xs font-semibold tracking-wide uppercase">
              Featured
            </span>
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 lg:p-10 lg:pr-12">
            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <User size={14} />
                {post.author}
              </span>
            </div>

            {/* Title */}
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight text-[#D4A336] group-hover:opacity-90 transition-opacity"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6 line-clamp-3">
              {post.excerpt}
            </p>

            {/* Read More */}
            <span className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all duration-300">
              Read More
              <ArrowRight size={16} />
            </span>
          </div>
        </motion.div>
      </Link>
    </section>
  );
}

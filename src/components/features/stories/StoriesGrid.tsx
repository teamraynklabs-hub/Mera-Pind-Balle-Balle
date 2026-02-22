"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { MapPin, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";
import type { StoryItem } from "./storiesData";

interface StoriesGridProps {
  stories: StoryItem[];
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function StoriesGrid({ stories }: StoriesGridProps) {
  if (stories.length === 0) return null;

  return (
    <section className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
      {/* Section Header */}
      <ScrollReveal className="text-center mb-14">
        <h2
          className="text-3xl sm:text-4xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          More Inspiring Stories
        </h2>
        <p className="mt-3 text-muted-foreground text-lg">
          Each story represents a life changed, a family empowered
        </p>
      </ScrollReveal>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {stories.map((story, i) => (
          <motion.article
            key={story.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: i * 0.1, ease }}
            className="group bg-card border rounded-2xl overflow-hidden shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-deep)] hover:-translate-y-1.5 transition-all duration-500"
          >
            {/* Card Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <Image
                src={story.image}
                alt={story.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Gradient overlay at bottom for text readability */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
              {/* Location & Name overlay */}
              <div className="absolute bottom-3 left-4 right-4">
                <div className="flex items-center gap-1.5 text-white/80 text-xs mb-1">
                  <MapPin size={12} />
                  <span>{story.location}</span>
                </div>
                <p
                  className="text-white text-sm font-semibold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {story.name}
                </p>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 sm:p-6">
              <h3
                className="text-lg font-semibold mb-2 leading-snug"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {story.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
                {story.excerpt}
              </p>
              <Link
                href={`/stories/${story.slug}`}
                className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:gap-2.5 transition-all duration-300"
              >
                Read Story
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

"use client";

import { Search, Tag } from "lucide-react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

/* ── Temporary dummy topics (replace with GET /api/blog/topics) ── */
const DUMMY_TOPICS = [
  "handweaving",
  "traditional crafts",
  "rural women",
  "artisans",
  "heritage textiles",
  "natural dyes",
  "sustainable fashion",
  "eco-friendly",
];

interface BlogHeroProps {
  topics?: string[];
  initialSearch?: string;
}

export default function BlogHero({
  topics,
  initialSearch = "",
}: BlogHeroProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const finalTopics = topics && topics.length > 0 ? topics : DUMMY_TOPICS;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputRef.current?.value.trim() ?? "";
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("search", val);
    } else {
      params.delete("search");
    }
    params.delete("page");
    router.push(`/blog?${params.toString()}`);
  };

  const handleTopicClick = (topic: string) => {
    const params = new URLSearchParams();
    params.set("search", topic);
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <section className="section-padding text-center">
      <div className="section-container max-w-3xl">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <span className="text-[#D4A336] italic">Stories from the Heart</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Explore traditional crafts, rural empowerment, and artisan journeys
        </motion.p>

        {/* Search */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-xl mx-auto mb-10"
        >
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            ref={inputRef}
            type="text"
            name="search"
            defaultValue={initialSearch}
            placeholder="Search articles…"
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground shadow-[var(--shadow-soft)] focus:shadow-[var(--shadow-medium)] focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
          />
        </motion.form>

        {/* Popular Topics */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide"
        >
          <span className="text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">
            Popular Topics:
          </span>
          {finalTopics.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => handleTopicClick(topic)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-card border border-border text-sm text-foreground whitespace-nowrap hover:border-primary/50 hover:text-primary transition-all duration-200 flex-shrink-0"
            >
              <Tag size={13} className="text-muted-foreground" />
              {topic}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

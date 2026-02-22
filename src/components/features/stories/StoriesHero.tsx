"use client";

import { motion } from "motion/react";
import { Heart, Search } from "lucide-react";

interface StoriesHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function StoriesHero({
  searchQuery,
  onSearchChange,
}: StoriesHeroProps) {
  return (
    <section className="relative flex items-center justify-center overflow-hidden py-28 md:py-40 lg:py-48">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#141420] to-[#0a0a0a]" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-[var(--gold)]/[0.03]" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 md:px-8 max-w-3xl mx-auto">
        {/* Heart Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--gold)]/10">
            <Heart
              size={36}
              className="text-[var(--gold)]"
              fill="currentColor"
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Stories of Change
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease }}
          className="text-base sm:text-lg lg:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Meet the incredible women artisans whose lives have been transformed
          through their crafts. Every product you purchase supports their
          journey towards empowerment and independence.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease }}
          className="relative max-w-xl mx-auto"
        >
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, location, or keyword..."
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all duration-300 text-sm sm:text-base"
          />
        </motion.div>
      </div>
    </section>
  );
}

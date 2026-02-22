"use client";

import { useState, useMemo } from "react";
import StoriesHero from "./StoriesHero";
import StoriesFeatured from "./StoriesFeatured";
import StoriesGrid from "./StoriesGrid";
import StoriesImpact from "./StoriesImpact";
import StoriesCTA from "./StoriesCTA";
import { MOCK_STORIES, type StoryItem } from "./storiesData";

interface StoriesPageClientProps {
  /** Stories from backend API — may be empty or have different shape */
  backendStories: any[];
}

/**
 * Maps backend story objects to the unified StoryItem shape.
 * Falls back to mock data if backend returns nothing usable.
 */
function normalizeStories(raw: any[]): StoryItem[] {
  if (!raw || raw.length === 0) return MOCK_STORIES;

  return raw.map((s: any, i: number) => ({
    id: s._id || s.id || String(i + 1),
    slug: s.slug || `story-${i + 1}`,
    name: s.name || "",
    location: s.location || "",
    title: s.title || "Untitled",
    excerpt: s.excerpt || s.summary || "",
    image: s.image || "/photo1.png",
    featured: s.featured ?? i === 0,
  }));
}

export default function StoriesPageClient({
  backendStories,
}: StoriesPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const stories = useMemo(
    () => normalizeStories(backendStories),
    [backendStories]
  );

  // Featured story: first story with featured flag, or first story
  const featuredStory = useMemo(
    () => stories.find((s) => s.featured) || stories[0],
    [stories]
  );

  // Non-featured stories for grid
  const gridStories = useMemo(
    () => stories.filter((s) => s.id !== featuredStory?.id),
    [stories, featuredStory]
  );

  // Search filtering
  const filteredGridStories = useMemo(() => {
    if (!searchQuery.trim()) return gridStories;
    const q = searchQuery.toLowerCase();
    return gridStories.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.excerpt.toLowerCase().includes(q)
    );
  }, [gridStories, searchQuery]);

  return (
    <>
      {/* 1 — HERO */}
      <StoriesHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* 2 — FEATURED STORY */}
      {featuredStory && <StoriesFeatured story={featuredStory} />}

      {/* 3 — MORE INSPIRING STORIES */}
      <StoriesGrid stories={filteredGridStories} />

      {/* 4 — IMPACT VALUE CARDS */}
      <StoriesImpact />

      {/* 5 — SUPPORT CTA */}
      <StoriesCTA />
    </>
  );
}

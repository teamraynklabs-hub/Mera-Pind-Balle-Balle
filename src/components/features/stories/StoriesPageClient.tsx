"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Suspense } from "react";
import StoriesHero from "./StoriesHero";
import StoriesFeatured from "./StoriesFeatured";
import StoriesGrid from "./StoriesGrid";
import StoriesImpact from "./StoriesImpact";
import StoriesCTA from "./StoriesCTA";
import type { StoryItem } from "./storiesData";

interface StoriesApiResponse {
  stories: any[];
  total: number;
  page: number;
  limit: number;
  topics: string[];
}

const POLL_INTERVAL = 30_000;

function normalizeStory(s: any, i: number): StoryItem {
  return {
    id: s._id || s.id || String(i + 1),
    slug: s.slug || `story-${i + 1}`,
    name: s.name || "",
    location: s.location || "",
    title: s.title || "Untitled",
    excerpt: s.excerpt || "",
    image: s.image || "/photo1.png",
    featured: s.featured ?? false,
  };
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="py-28 md:py-40 bg-gradient-to-b from-background via-muted/50 to-background">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="h-20 w-20 rounded-full bg-muted/30 mx-auto mb-8" />
          <div className="h-12 w-72 bg-muted/30 rounded mx-auto mb-6" />
          <div className="h-6 w-96 bg-muted/20 rounded mx-auto mb-10" />
          <div className="h-12 w-full max-w-xl bg-muted/30 rounded-xl mx-auto" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-20">
        <div className="h-72 rounded-2xl bg-muted/30" />
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 rounded-xl bg-muted/30" />
          ))}
        </div>
      </div>
    </div>
  );
}

function StoriesPageInner() {
  const [data, setData] = useState<StoriesApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const mountedRef = useRef(true);

  const fetchStories = useCallback(
    async (isInitial = false) => {
      try {
        const res = await fetch("/api/stories", { cache: "no-store" });
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
    []
  );

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    fetchStories(true);

    const interval = setInterval(() => fetchStories(false), POLL_INTERVAL);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchStories]);

  // Normalize stories from API
  const stories = useMemo(
    () => (data?.stories || []).map(normalizeStory),
    [data]
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

  // Search filtering (client-side)
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

  if (loading) return <LoadingSkeleton />;

  if (!data || stories.length === 0) {
    return (
      <>
        <StoriesHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground text-lg">
            No stories yet. Check back soon!
          </p>
        </div>
        <StoriesImpact />
        <StoriesCTA />
      </>
    );
  }

  return (
    <>
      <StoriesHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {featuredStory && <StoriesFeatured story={featuredStory} />}

      {filteredGridStories.length > 0 && (
        <StoriesGrid stories={filteredGridStories} />
      )}

      <StoriesImpact />
      <StoriesCTA />
    </>
  );
}

export default function StoriesPageClient() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <StoriesPageInner />
    </Suspense>
  );
}

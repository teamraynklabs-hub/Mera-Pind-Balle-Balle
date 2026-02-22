"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Suspense } from "react";
import ResourcesHero from "./ResourcesHero";
import ResourcesFilter, { type ResourceCategory } from "./ResourcesFilter";
import ResourcesCard from "./ResourcesCard";
import ResourcesCTA from "./ResourcesCTA";
import ResourcesNewsletter from "./ResourcesNewsletter";
import { AnimatePresence } from "motion/react";
import type { Resource } from "./resourcesData";

interface ResourcesApiResponse {
  resources: any[];
  categories: string[];
  total: number;
}

const POLL_INTERVAL = 30_000;

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function normalizeResource(r: any, i: number): Resource {
  return {
    id: r._id || r.id || String(i + 1),
    title: r.title || "Untitled",
    description: r.description || "",
    category: r.category || "Guide",
    fileType: r.fileType || "pdf",
    size: r.size || "",
    date: formatDate(r.createdAt),
    fileUrl: r.fileUrl || "",
  };
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="py-28 md:py-40 bg-gradient-to-b from-background via-muted/50 to-background">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="h-12 w-72 bg-muted/30 rounded mx-auto mb-6" />
          <div className="h-6 w-96 bg-muted/20 rounded mx-auto" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center gap-2 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-20 rounded-full bg-muted/30" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-xl bg-muted/30" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ResourcesPageInner() {
  const [data, setData] = useState<ResourcesApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ResourceCategory>("All");
  const mountedRef = useRef(true);

  const fetchResources = useCallback(async (isInitial = false) => {
    try {
      const res = await fetch("/api/resources", { cache: "no-store" });
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
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    fetchResources(true);

    const interval = setInterval(() => fetchResources(false), POLL_INTERVAL);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchResources]);

  // Normalize resources from API
  const resources = useMemo(
    () => (data?.resources || []).map(normalizeResource),
    [data]
  );

  // Dynamic categories from backend
  const categories = useMemo(
    () => data?.categories || [],
    [data]
  );

  // Filter by selected category
  const filtered = useMemo(() => {
    if (selected === "All") return resources;
    return resources.filter((r) => r.category === selected);
  }, [resources, selected]);

  if (loading) return <LoadingSkeleton />;

  if (!data || resources.length === 0) {
    return (
      <>
        <ResourcesHero />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground text-lg">
            No resources available yet. Check back soon!
          </p>
        </div>
        <ResourcesCTA />
        <ResourcesNewsletter />
      </>
    );
  }

  return (
    <>
      <ResourcesHero />

      <ResourcesFilter
        selected={selected}
        onChange={setSelected}
        categories={categories}
      />

      <section className="container mx-auto px-4 md:px-8 lg:px-12 pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((resource, i) => (
              <ResourcesCard key={resource.id} resource={resource} index={i} />
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No resources found in this category.
            </p>
          </div>
        )}
      </section>

      <ResourcesCTA />
      <ResourcesNewsletter />
    </>
  );
}

export default function ResourcesPageClient() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ResourcesPageInner />
    </Suspense>
  );
}

"use client";

import { AnimatePresence } from "motion/react";
import ResourcesCard from "./ResourcesCard";
import type { Resource } from "./resourcesData";

interface ResourcesGridProps {
  resources: Resource[];
}

export default function ResourcesGrid({ resources }: ResourcesGridProps) {
  return (
    <section className="container mx-auto px-4 md:px-8 lg:px-12 pb-16 md:pb-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <AnimatePresence mode="popLayout">
          {resources.map((resource, i) => (
            <ResourcesCard key={resource.id} resource={resource} index={i} />
          ))}
        </AnimatePresence>
      </div>

      {resources.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">
            No resources found in this category.
          </p>
        </div>
      )}
    </section>
  );
}

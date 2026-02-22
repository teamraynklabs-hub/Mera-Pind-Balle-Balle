"use client";

import { useState, useMemo } from "react";
import { AnimatePresence } from "motion/react";
import ResourcesFilter, { type ResourceCategory } from "./ResourcesFilter";
import ResourcesCard from "./ResourcesCard";
import { DUMMY_RESOURCES } from "./resourcesData";

export default function ResourcesGrid() {
  const [selected, setSelected] = useState<ResourceCategory>("All");

  const filtered = useMemo(() => {
    if (selected === "All") return DUMMY_RESOURCES;
    return DUMMY_RESOURCES.filter((r) => r.category === selected);
  }, [selected]);

  return (
    <>
      <ResourcesFilter selected={selected} onChange={setSelected} />

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
    </>
  );
}

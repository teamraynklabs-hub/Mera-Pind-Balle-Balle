"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export type ResourceCategory = string;

interface ResourcesFilterProps {
  selected: ResourceCategory;
  onChange: (category: ResourceCategory) => void;
  categories?: string[];
}

export default function ResourcesFilter({
  selected,
  onChange,
  categories = [],
}: ResourcesFilterProps) {
  const tabs = ["All", ...categories];

  if (categories.length === 0) return null;

  return (
    <section className="py-8 md:py-12">
      <div className="flex justify-center">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-4 py-2 max-w-full">
          {tabs.map((cat) => (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              className={cn(
                "relative px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300",
                selected === cat
                  ? "text-[var(--gold-foreground)]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {selected === cat && (
                <motion.span
                  layoutId="active-filter"
                  className="absolute inset-0 rounded-full bg-[var(--gold)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

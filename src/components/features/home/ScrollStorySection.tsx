"use client";

import ScrollReveal from "@/components/motion/ScrollReveal";

interface Initiative {
  title: string;
  desc?: string;
  description?: string;
}

interface ScrollStorySectionProps {
  items: Initiative[];
}

export default function ScrollStorySection({ items }: ScrollStorySectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
      <ScrollReveal className="text-center mb-16 md:mb-20">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Our Key Initiatives
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Driving meaningful change through community-focused programs
        </p>
      </ScrollReveal>

      <div className="space-y-20 md:space-y-28">
        {items.map((item, i) => {
          const isReversed = i % 2 !== 0;
          return (
            <ScrollReveal key={i} delay={0.1}>
              <div
                className={`flex flex-col md:flex-row items-center gap-10 lg:gap-16 ${
                  isReversed ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Number accent */}
                <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl md:text-4xl font-bold text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed max-w-xl">
                    {item.desc || item.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}

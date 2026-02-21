"use client";

import StaggerContainer from "@/components/motion/StaggerContainer";
import ScrollReveal from "@/components/motion/ScrollReveal";

interface ImpactStat {
  number?: string;
  value?: string;
  label: string;
}

interface TrustSectionProps {
  impact: ImpactStat[];
}

export default function TrustSection({ impact }: TrustSectionProps) {
  if (impact.length === 0) return null;

  return (
    <section className="bg-primary/5">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
        <ScrollReveal className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Our Community Impact
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Real numbers that represent real change in rural communities
          </p>
        </ScrollReveal>

        <StaggerContainer
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-6"
          staggerDelay={0.12}
          y={30}
        >
          {impact.map((stat, i) => (
            <div
              key={i}
              className="text-center p-10 border rounded-2xl bg-card shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-deep)] transition-shadow duration-500"
            >
              <p className="text-5xl md:text-6xl font-bold text-primary tabular-nums">
                {stat.number || stat.value}
              </p>
              <p className="mt-3 text-muted-foreground text-lg">
                {stat.label}
              </p>
            </div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

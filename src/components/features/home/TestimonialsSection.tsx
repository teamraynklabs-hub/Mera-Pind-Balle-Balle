"use client";

import { Quote } from "lucide-react";
import StaggerContainer from "@/components/motion/StaggerContainer";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatar?: string;
}

export default function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <StaggerContainer
      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      staggerDelay={0.12}
    >
      {testimonials.map((t, i) => (
        <div
          key={i}
          className="p-8 border rounded-2xl bg-card shadow-(--shadow-soft) hover:shadow-(--shadow-deep) transition-shadow duration-500 flex flex-col"
        >
          <Quote size={22} className="text-primary/30 mb-4" />
          <p className="text-muted-foreground leading-relaxed flex-1 text-[15px]">
            &ldquo;{t.quote}&rdquo;
          </p>
          <div className="mt-5 pt-5 border-t flex items-center gap-3">
            {t.avatar ? (
              <img
                src={t.avatar}
                alt={t.name}
                className="w-11 h-11 rounded-full object-cover border"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {t.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-semibold text-sm">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </div>
        </div>
      ))}
    </StaggerContainer>
  );
}

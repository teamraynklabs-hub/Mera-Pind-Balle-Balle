"use client";

import { Quote } from "lucide-react";

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
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.map((t, i) => (
        <div
          key={i}
          className="p-6 border rounded-xl bg-card shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-shadow duration-300 flex flex-col opacity-0 animate-[fadeUp_0.8s_ease-out_forwards]"
          style={{ animationDelay: `${i * 0.15}s` }}
        >
          <Quote size={20} className="text-primary/40 mb-3" />
          <p className="text-muted-foreground leading-relaxed flex-1">
            &ldquo;{t.quote}&rdquo;
          </p>
          <div className="mt-4 pt-4 border-t flex items-center gap-3">
            {t.avatar ? (
              <img
                src={t.avatar}
                alt={t.name}
                className="w-10 h-10 rounded-full object-cover border"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
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
    </div>
  );
}

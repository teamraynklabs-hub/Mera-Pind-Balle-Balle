"use client";

import { Quote, Star, MapPin } from "lucide-react";
import { motion } from "motion/react";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatar?: string;
  rating?: number;
  location?: string;
}

const ease = [0.16, 1, 0.3, 1] as const;

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < rating
              ? "fill-[var(--gold)] text-[var(--gold)]"
              : "fill-muted text-muted"
          }
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.map((t, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: i * 0.12, ease }}
          className="p-8 border rounded-2xl bg-card shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-deep)] transition-all duration-500 flex flex-col group hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <Quote size={22} className="text-primary/30" />
            <StarRating rating={t.rating} />
          </div>

          <p className="text-muted-foreground leading-relaxed flex-1 text-[15px]">
            &ldquo;{t.quote}&rdquo;
          </p>

          <div className="mt-6 pt-5 border-t flex items-center gap-3">
            {t.avatar ? (
              <img
                src={t.avatar}
                alt={t.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                loading="lazy"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-base">
                {t.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-semibold text-sm">{t.name}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {t.location ? (
                  <>
                    <MapPin size={10} />
                    <span>{t.location}</span>
                  </>
                ) : (
                  <span>{t.role}</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

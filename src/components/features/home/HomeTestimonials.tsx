"use client";

import Image from "next/image";
import { Star, Quote, MapPin, User } from "lucide-react";
import { motion } from "motion/react";
import ScrollReveal from "@/components/motion/ScrollReveal";

interface Testimonial {
  name: string;
  location?: string;
  rating?: number;
  review?: string;
  image?: string;
  // Backward compat with existing Dashboard fields
  quote?: string;
  avatar?: string;
  role?: string;
}

interface HomeTestimonialsProps {
  testimonials: Testimonial[];
}

const ease = [0.16, 1, 0.3, 1] as const;

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < rating
              ? "fill-[var(--gold)] text-[var(--gold)]"
              : "text-muted-foreground/30"
          }
          strokeWidth={i < rating ? 0 : 1.5}
        />
      ))}
    </div>
  );
}

export default function HomeTestimonials({
  testimonials,
}: HomeTestimonialsProps) {
  const visible = testimonials.filter((t) => t.name && t.name.trim() !== "");
  if (visible.length === 0) return null;

  return (
    <section className="relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/40 via-accent/20 to-transparent" />

      <div className="relative container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-3">
            Testimonials
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What Our Customers Say
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Real stories from people who love our products
          </p>
        </ScrollReveal>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {visible.map((t, i) => {
            const reviewText = t.review || t.quote || "";
            const imageUrl = t.image || t.avatar || "";
            const locationText = t.location || t.role || "";

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.12, ease }}
                className="group relative flex flex-col rounded-2xl border bg-card p-7 sm:p-8 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-deep)] hover:-translate-y-1.5 transition-all duration-500"
              >
                {/* Decorative quote accent */}
                <div className="absolute top-5 right-6 opacity-[0.06]">
                  <Quote size={48} strokeWidth={1.5} />
                </div>

                {/* User Info — Top Row */}
                <div className="flex items-center gap-4 mb-5">
                  {imageUrl ? (
                    <div className="relative w-14 h-14 shrink-0 rounded-full overflow-hidden border-2 border-primary/20 shadow-sm">
                      <Image
                        src={imageUrl}
                        alt={t.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 shrink-0 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/15">
                      <User size={22} className="text-primary/60" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p
                      className="font-semibold text-[17px] leading-tight truncate"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {t.name}
                    </p>
                    {locationText && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <MapPin size={11} className="shrink-0" />
                        <span className="truncate">{locationText}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Star Rating */}
                <div className="mb-4">
                  <StarRating rating={t.rating} />
                </div>

                {/* Review Text */}
                <p className="text-muted-foreground leading-relaxed text-[15px] flex-1 italic">
                  &ldquo;{reviewText}&rdquo;
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, Quote, MapPin, User, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import ScrollReveal from "@/components/motion/ScrollReveal";

interface Feedback {
  name: string;
  location?: string;
  rating?: number;
  review?: string;
  image?: string;
  quote?: string;
  avatar?: string;
  role?: string;
}

interface HomeFeedbackProps {
  feedbacks: Feedback[];
}

const ease = [0.16, 1, 0.3, 1] as const;

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={15}
          className={
            i < rating
              ? "fill-[var(--gold)] text-[var(--gold)]"
              : "text-muted-foreground/25"
          }
          strokeWidth={i < rating ? 0 : 1.5}
        />
      ))}
    </div>
  );
}

export default function HomeFeedback({ feedbacks }: HomeFeedbackProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const visible = feedbacks.filter((f) => f.name && f.name.trim() !== "");
  if (visible.length === 0) return null;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/40 via-accent/20 to-transparent" />

      <div className="relative container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <MessageCircle size={14} />
            Customer Feedback
          </div>
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

        {/* Feedback Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {visible.map((f, i) => {
            const reviewText = f.review || f.quote || "";
            const imageUrl = f.image || f.avatar || "";
            const locationText = f.location || f.role || "";

            return (
              <motion.div
                key={i}
                suppressHydrationWarning
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.12,
                  ease
                }}
                className="group relative flex flex-col rounded-2xl border bg-card overflow-hidden shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-deep)] hover:-translate-y-1.5 transition-all duration-500"
              >
                {/* Top — User Image Banner */}
                <div className="relative h-20 bg-gradient-to-r from-primary/15 via-primary/10 to-[var(--gold)]/15">
                  {/* Quote watermark */}
                  <div className="absolute top-3 right-4 opacity-[0.08]">
                    <Quote size={40} strokeWidth={1.5} />
                  </div>

                  {/* Avatar — overlaps banner */}
                  <div className="absolute -bottom-8 left-7">
                    {imageUrl ? (
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-[3px] border-card shadow-md">
                        <Image
                          src={imageUrl}
                          alt={f.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/10 border-[3px] border-card shadow-md flex items-center justify-center">
                        <User size={24} className="text-primary/60" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="px-7 pt-12 pb-7 flex flex-col flex-1">
                  {/* Name & Location */}
                  <div className="mb-3">
                    <h4
                      className="font-semibold text-[17px] leading-tight"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {f.name}
                    </h4>
                    {locationText && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <MapPin size={11} className="shrink-0" />
                        <span className="truncate">{locationText}</span>
                      </div>
                    )}
                  </div>

                  {/* Star Rating */}
                  <div className="mb-4">
                    <StarRating rating={f.rating} />
                  </div>

                  {/* Review Text */}
                  <p className="text-muted-foreground leading-relaxed text-[15px] flex-1 italic">
                    &ldquo;{reviewText}&rdquo;
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

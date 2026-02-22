"use client";

import Image from "next/image";
import { motion } from "motion/react";
import ScrollReveal from "@/components/motion/ScrollReveal";

interface InitiativeItem {
  title: string;
  description: string;
  image: string;
}

interface InitiativeCardsProps {
  initiatives: InitiativeItem[];
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function InitiativeCards({ initiatives }: InitiativeCardsProps) {
  const visible = initiatives.filter(
    (item) => item.title && item.title.trim() !== ""
  );
  if (visible.length === 0) return null;

  return (
    <section className="bg-accent/30">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
        <ScrollReveal className="text-center mb-14">
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-3">
            What We Do
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Our Initiatives
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Driving meaningful change through purpose-led programs
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {visible.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease }}
            >
              <div className="group relative block rounded-2xl overflow-hidden aspect-[4/5] border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-deep)] transition-shadow duration-500">
                {/* Background Image */}
                <Image
                  src={item.image || "/photo1.png"}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors duration-500" />

                {/* Content at bottom */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3
                    className="text-xl font-bold text-white mb-1.5"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

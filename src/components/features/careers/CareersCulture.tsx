"use client";

import { motion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

const culturePoints = [
  "Collaborative and inclusive environment",
  "Work-life balance and flexible arrangements",
  "Regular team building and cultural activities",
  "Opportunities to visit artisan communities",
  "Professional development and training",
  "Recognition and rewards for great work",
];

export default function CareersCulture() {
  return (
    <section className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
      <div className="grid items-center gap-10 lg:gap-16 md:grid-cols-2">
        {/* Left — Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease }}
        >
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Our Culture
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg max-w-prose mb-8">
            At Mera Pind Balle Balle, we believe in creating a workplace where
            everyone feels valued, inspired, and empowered to do their best
            work.
          </p>

          <ul className="space-y-4">
            {culturePoints.map((point, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease }}
                className="flex items-start gap-3"
              >
                <span className="mt-1.5 w-2.5 h-2.5 rounded-full bg-[var(--gold)] shrink-0" />
                <span className="text-muted-foreground text-base leading-relaxed">
                  {point}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Right — Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-[var(--shadow-deep)] border aspect-[4/3] bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
              alt="Our team culture"
              className="w-full h-full object-cover absolute inset-0"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

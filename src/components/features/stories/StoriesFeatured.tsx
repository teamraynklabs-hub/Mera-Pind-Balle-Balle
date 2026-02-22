"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StoryItem } from "./storiesData";

interface StoriesFeaturedProps {
  story: StoryItem;
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function StoriesFeatured({ story }: StoriesFeaturedProps) {
  return (
    <section className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
      {/* Section Header */}
      <div className="text-center mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
          className="text-3xl sm:text-4xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Featured Story
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="mt-3 text-muted-foreground text-lg"
        >
          A journey of courage, resilience, and transformation
        </motion.p>
      </div>

      {/* Featured Story Card */}
      <div className="grid items-center gap-10 lg:gap-16 md:grid-cols-2">
        {/* Left — Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease }}
          className="group"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-[var(--shadow-deep)] border aspect-[4/3] bg-muted">
            <Image
              src={story.image}
              alt={story.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </motion.div>

        {/* Right — Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
        >
          <h3
            className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-[var(--gold)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {story.title}
          </h3>
          <p className="mt-5 text-muted-foreground leading-relaxed text-base md:text-lg max-w-prose">
            {story.excerpt}
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base px-8 py-6 group/btn"
            >
              <Link href={`/stories/${story.slug}`}>
                Read Full Story
                <ArrowRight
                  size={18}
                  className="ml-2 group-hover/btn:translate-x-1 transition-transform duration-300"
                />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

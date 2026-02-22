"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import ClientImage from "@/components/common/ClientImage";

interface MissionSectionProps {
  title: string;
  description: string;
  image?: string;
  link?: string;
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function MissionSection({
  title,
  description,
  image,
  link,
}: MissionSectionProps) {
  return (
    <section className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left: Image — Slide in from left */}
        {image && (
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-[var(--shadow-deep)] border group">
              <div className="overflow-hidden">
                <ClientImage
                  src={image}
                  alt={title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-3 -right-3 w-24 h-24 bg-primary/10 rounded-2xl -z-10" />
              <div className="absolute -top-3 -left-3 w-16 h-16 bg-[var(--gold)]/10 rounded-xl -z-10" />
            </div>
          </motion.div>
        )}

        {/* Right: Text — Slide in from right */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className={!image ? "md:col-span-2 max-w-2xl mx-auto text-center" : ""}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
            <BookOpen size={14} />
            Our Story
          </div>

          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {title}
          </h2>

          <p className="mt-5 text-muted-foreground leading-relaxed text-lg">
            {description}
          </p>

          {link && (
            <Button asChild className="mt-7" variant="outline" size="lg">
              <Link href={link}>
                Read Our Story
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
}

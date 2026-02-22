"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";
import { FALLBACK_REQUIREMENTS } from "./distributorData";

interface DistributorRequirementsProps {
  requirements?: string[];
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function DistributorRequirements({
  requirements,
}: DistributorRequirementsProps) {
  const items =
    requirements && requirements.length > 0
      ? requirements
      : FALLBACK_REQUIREMENTS;

  return (
    <section className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
      <div className="grid items-center gap-10 lg:gap-16 md:grid-cols-2">
        {/* Left — Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease }}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-[var(--shadow-deep)] border aspect-[4/3] bg-muted">
            <Image
              src="/photo2.png"
              alt="Partnership Requirements"
              fill
              className="object-cover"
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
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Partnership Requirements
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-8">
            We&apos;re looking for partners who share our values and commitment
            to supporting rural artisans.
          </p>

          <ul className="space-y-4">
            {items.map((req, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease }}
                className="flex items-start gap-3"
              >
                <CheckCircle
                  size={20}
                  className="text-[var(--gold)] mt-0.5 shrink-0"
                />
                <span className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {req}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

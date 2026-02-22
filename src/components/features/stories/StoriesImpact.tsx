"use client";

import { motion } from "motion/react";
import { Heart, DollarSign, Gem } from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";

interface ImpactCard {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
}

const IMPACT_CARDS: ImpactCard[] = [
  {
    icon: DollarSign,
    title: "Fair Wages",
    description:
      "Artisans receive 3-5x more than traditional middlemen would pay them",
  },
  {
    icon: Heart,
    title: "Economic Independence",
    description:
      "Women gain financial autonomy and decision-making power in their households",
  },
  {
    icon: Gem,
    title: "Heritage Preservation",
    description:
      "Traditional crafts and techniques are kept alive for future generations",
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function StoriesImpact() {
  return (
    <section className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
      {/* Section Header */}
      <ScrollReveal className="text-center mb-14">
        <h2
          className="text-3xl sm:text-4xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Every Purchase Makes a Difference
        </h2>
        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          When you buy from Mera Pind Balle Balle, you&apos;re not just
          purchasing a product&mdash;you&apos;re investing in a woman&apos;s
          future and her family&apos;s well-being.
        </p>
      </ScrollReveal>

      {/* Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {IMPACT_CARDS.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease }}
              className="group text-center p-7 sm:p-8 rounded-2xl bg-card border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-deep)] hover:shadow-[var(--gold)]/5 hover:-translate-y-1.5 transition-all duration-500"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--gold)]/10 text-[var(--gold)] mb-5 group-hover:bg-[var(--gold)] group-hover:text-white transition-colors duration-500">
                <Icon size={26} />
              </div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

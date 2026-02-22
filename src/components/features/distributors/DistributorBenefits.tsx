"use client";

import { motion } from "motion/react";
import {
  Heart,
  Gem,
  TrendingUp,
  Users,
  Award,
  CheckCircle,
} from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";
import {
  FALLBACK_BENEFITS,
  type BenefitItem,
} from "./distributorData";

interface DistributorBenefitsProps {
  /** Backend benefits as plain strings — mapped to cards with fallback */
  benefits?: string[];
}

const ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  "fair-pricing": Heart,
  quality: Gem,
  marketing: TrendingUp,
  training: Users,
  exclusive: Award,
  support: CheckCircle,
};

function getIconByIndex(index: number) {
  const icons = [Heart, Gem, TrendingUp, Users, Award, CheckCircle];
  return icons[index % icons.length];
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function DistributorBenefits({
  benefits,
}: DistributorBenefitsProps) {
  // Use fallback structured data; if backend provides string[], map to BenefitItem
  const items: BenefitItem[] =
    benefits && benefits.length > 0
      ? benefits.map((b, i) => ({
          icon: "",
          title: b,
          description: "",
        }))
      : FALLBACK_BENEFITS;

  return (
    <section className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
      {/* Section Header */}
      <ScrollReveal className="text-center mb-14">
        <h2
          className="text-3xl sm:text-4xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Partnership Benefits
        </h2>
        <p className="mt-3 text-muted-foreground text-lg">
          What you get when you partner with Mera Pind Balle Balle
        </p>
      </ScrollReveal>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => {
          const Icon = item.icon
            ? ICON_MAP[item.icon] || getIconByIndex(i)
            : getIconByIndex(i);

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease }}
              className="group p-6 sm:p-7 rounded-2xl bg-card border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-deep)] hover:-translate-y-1.5 transition-all duration-500"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center mb-5 group-hover:bg-[var(--gold)] group-hover:text-white transition-all duration-500">
                <Icon size={24} className="text-[var(--gold)] group-hover:text-white transition-colors duration-500" />
              </div>

              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {item.title}
              </h3>
              {item.description && (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

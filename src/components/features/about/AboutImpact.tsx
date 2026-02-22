"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";
import {
  Users,
  MapPin,
  ShoppingBag,
  Smile,
} from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";

interface ImpactStat {
  number: string;
  label: string;
  icon?: string;
}

interface AboutImpactProps {
  stats?: ImpactStat[];
}

const ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  women: Users,
  artisans: Users,
  users: Users,
  villages: MapPin,
  map: MapPin,
  communities: MapPin,
  products: ShoppingBag,
  crafts: ShoppingBag,
  customers: Smile,
  happy: Smile,
  families: Smile,
};

function getIcon(label: string, iconKey?: string) {
  if (iconKey && ICON_MAP[iconKey.toLowerCase()]) {
    return ICON_MAP[iconKey.toLowerCase()];
  }
  const lower = label.toLowerCase();
  for (const [key, Icon] of Object.entries(ICON_MAP)) {
    if (lower.includes(key)) return Icon;
  }
  return Users;
}

function CountUp({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;
    const startTime = performance.now();
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

function parseNumericValue(val: string): { num: number; suffix: string } {
  const match = val.match(/^([\d,]+)(.*)$/);
  if (match) {
    return { num: parseInt(match[1].replace(/,/g, ""), 10), suffix: match[2] };
  }
  return { num: 0, suffix: val };
}

const FALLBACK_STATS: ImpactStat[] = [
  { number: "500+", label: "Women Artisans Empowered", icon: "women" },
  { number: "50+", label: "Villages Reached", icon: "villages" },
  { number: "2000+", label: "Handcrafted Products", icon: "products" },
  { number: "10000+", label: "Happy Customers", icon: "customers" },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function AboutImpact({ stats }: AboutImpactProps) {
  const items = stats && stats.length > 0 ? stats : FALLBACK_STATS;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/40 via-accent/20 to-transparent" />

      <div className="relative container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
        <ScrollReveal className="text-center mb-14">
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-3">
            Making a Difference
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Our Impact
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Numbers that tell our story
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((stat, i) => {
            const { num, suffix } = parseNumericValue(stat.number);
            const Icon = getIcon(stat.label, stat.icon);

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease }}
                className="text-center p-8 md:p-10 rounded-2xl bg-card border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-deep)] transition-all duration-500 group"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                  <Icon size={26} />
                </div>
                <p className="text-4xl md:text-5xl font-bold text-foreground tabular-nums mb-3">
                  {num > 0 ? <CountUp target={num} /> : stat.number}
                  {suffix && (
                    <span className="text-primary">{suffix}</span>
                  )}
                </p>
                <p className="text-muted-foreground text-base font-medium">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

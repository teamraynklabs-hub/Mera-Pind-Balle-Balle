"use client";

import { motion } from "motion/react";
import { Heart, Shield, Leaf, Users } from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";

interface ValueItem {
  icon?: string;
  title: string;
  description: string;
}

interface AboutValuesProps {
  sectionTitle?: string;
  sectionSubtitle?: string;
  items?: ValueItem[];
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  heart: Heart,
  empowerment: Heart,
  shield: Shield,
  trust: Shield,
  integrity: Shield,
  leaf: Leaf,
  sustainability: Leaf,
  eco: Leaf,
  users: Users,
  community: Users,
  together: Users,
};

function getIcon(title: string, iconKey?: string) {
  if (iconKey && ICON_MAP[iconKey.toLowerCase()]) {
    return ICON_MAP[iconKey.toLowerCase()];
  }
  const lower = title.toLowerCase();
  for (const [key, Icon] of Object.entries(ICON_MAP)) {
    if (lower.includes(key)) return Icon;
  }
  return Heart;
}

const FALLBACK_ITEMS: ValueItem[] = [
  { icon: "heart", title: "Women Empowerment", description: "Placing women at the center of change — providing skills, markets, and confidence to lead their families towards a brighter future." },
  { icon: "sustainability", title: "Sustainability", description: "Every product is crafted with respect for the environment, using natural materials and eco-friendly practices passed down through generations." },
  { icon: "trust", title: "Fair Trade & Trust", description: "We ensure transparent pricing, fair wages, and trust-based partnerships with every artisan and customer in our community." },
  { icon: "community", title: "Community First", description: "We believe in the strength of collective action — our work nurtures entire villages, not just individuals, building lasting impact." },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function AboutValues({ sectionTitle, sectionSubtitle, items }: AboutValuesProps) {
  const heading = sectionTitle || "Our Core Values";
  const subtitle = sectionSubtitle || "The principles that guide everything we do";
  const valueItems = items && items.length > 0 ? items : FALLBACK_ITEMS;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-primary/[0.06] to-primary/[0.03]" />

      <div className="relative container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
        <ScrollReveal className="text-center mb-14">
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-3">
            What We Stand For
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {heading}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueItems.map((value, i) => {
            const Icon = getIcon(value.title, value.icon);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease }}
                className="group text-center p-7 sm:p-8 rounded-2xl bg-card border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-deep)] hover:-translate-y-1.5 transition-all duration-500"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                  <Icon size={26} />
                </div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

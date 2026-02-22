"use client";

import { motion } from "motion/react";
import { Heart, Users, TrendingUp, Award } from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";

const ease = [0.16, 1, 0.3, 1] as const;

const benefits = [
  {
    icon: Heart,
    title: "Purpose-Driven Work",
    description: "Make a real difference in rural artisan communities",
  },
  {
    icon: Users,
    title: "Collaborative Culture",
    description: "Work with passionate, like-minded individuals",
  },
  {
    icon: TrendingUp,
    title: "Growth Opportunities",
    description: "Continuous learning and career development",
  },
  {
    icon: Award,
    title: "Competitive Benefits",
    description: "Health insurance, flexible hours, and more",
  },
];

export default function CareersBenefits() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-primary/[0.06] to-primary/[0.03]" />

      <div className="relative container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
        <ScrollReveal className="text-center mb-14">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Why Join Us
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            More than just a job&mdash;it&apos;s an opportunity to create
            meaningful change
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease }}
                className="group text-center p-7 sm:p-8 rounded-2xl bg-card border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-deep)] hover:-translate-y-1.5 transition-all duration-500"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] mb-5 group-hover:bg-[var(--gold)] group-hover:text-[var(--gold-foreground)] transition-colors duration-500">
                  <Icon size={26} />
                </div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

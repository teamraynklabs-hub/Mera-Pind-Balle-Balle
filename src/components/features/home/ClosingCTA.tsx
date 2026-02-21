"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import TextReveal from "@/components/motion/TextReveal";
import ScrollReveal from "@/components/motion/ScrollReveal";

interface ClosingCTAProps {
  title: string;
  description: string;
  buttonText: string;
  link: string;
}

export default function ClosingCTA({
  title,
  description,
  buttonText,
  link,
}: ClosingCTAProps) {
  return (
    <section className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
      <div className="text-center py-16 md:py-20 px-6 md:px-12 bg-gradient-to-br from-primary/5 via-primary/3 to-accent/30 border border-primary/10 rounded-3xl">
        <TextReveal
          text={title}
          as="h2"
          className="text-3xl sm:text-4xl font-bold tracking-tight mb-5"
          staggerDelay={0.04}
        />

        <ScrollReveal delay={0.3} y={12}>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            {description}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.5} y={12}>
          <Button asChild size="lg" className="text-base px-10 py-6">
            <Link href={link}>
              {buttonText}
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}

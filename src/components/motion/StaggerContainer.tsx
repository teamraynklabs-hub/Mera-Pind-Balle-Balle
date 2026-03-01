"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
}

export default function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  y = 20,
  duration = 0.5,
  once = true,
  amount = 0.15,
}: StaggerContainerProps) {
  const [mounted, setMounted] = (require("react").useState)(false);
  (require("react").useEffect)(() => {
    setMounted(true);
  }, []);

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child, index) => (
        <motion.div
          suppressHydrationWarning
          initial={false}
          animate={mounted && isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
          transition={{
            duration,
            delay: index * staggerDelay,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

"use client";

import { motion } from "motion/react";
import { FALLBACK_BANNER } from "./distributorData";

interface DistributorHeroProps {
  bannerImage?: string;
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function DistributorHero({
  bannerImage,
}: DistributorHeroProps) {
  const img =
    bannerImage && bannerImage.trim() !== "" ? bannerImage : FALLBACK_BANNER;

  return (
    <section className="relative overflow-hidden">
      {/* Banner Image */}
      <div className="relative w-full h-[50vh] min-h-[320px] max-h-[480px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt="Become a Distributor"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

        {/* Centered Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 md:px-8 max-w-3xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Become a Distributor
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease }}
              className="text-base sm:text-lg lg:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
            >
              Join us in bringing high-quality rural products to more cities
              while creating meaningful economic impact.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import HeroSection from "@/components/features/home/HeroSection";
import TrustSection from "@/components/features/home/TrustSection";

const InitiativeCards = dynamic(
  () => import("@/components/features/home/InitiativeCards"),
  { ssr: false }
);
const HomeProductsCarousel = dynamic(
  () => import("@/components/features/home/HomeProductsCarousel"),
  { ssr: false }
);
const HomeFeaturedProducts = dynamic(
  () => import("@/components/features/home/HomeFeaturedProducts"),
  { ssr: false }
);
const HomeFeedback = dynamic(
  () => import("@/components/features/home/HomeFeedback"),
  { ssr: false }
);
const ClosingCTA = dynamic(
  () => import("@/components/features/home/ClosingCTA"),
  { ssr: false }
);

interface HomeData {
  hero: {
    title: string;
    subtitle: string;
    image: string;
    primaryCTA: { label: string; link: string };
    secondaryCTA: { label: string; link: string };
  };
  initiatives: { title: string; description: string; image: string }[];
  feedback: { name: string; role: string; quote: string; avatar: string }[];
  impact: { label: string; value: string }[];
  cta: {
    title: string;
    description: string;
    buttonText: string;
    link: string;
  };
  featuredProducts: any[];
  allProducts: any[];
}

const POLL_INTERVAL = 120_000; // 2 minutes

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="h-screen bg-muted/30" />

      {/* Impact stats skeleton */}
      <div className="container mx-auto px-4 py-20">
        <div className="h-8 w-48 bg-muted/40 rounded mx-auto mb-10" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-muted/30" />
          ))}
        </div>
      </div>

      {/* Initiatives skeleton */}
      <div className="container mx-auto px-4 py-20 bg-accent/30">
        <div className="h-8 w-40 bg-muted/40 rounded mx-auto mb-10" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[4/5] rounded-2xl bg-muted/30" />
          ))}
        </div>
      </div>

      {/* Feedback skeleton */}
      <div className="container mx-auto px-4 py-20">
        <div className="h-8 w-56 bg-muted/40 rounded mx-auto mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-muted/30" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePageContent() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async (isInitial = false) => {
    try {
      const res = await fetch("/api/home", { cache: "no-store" });
      const json = await res.json();

      if (!mountedRef.current) return;

      if (json.success && json.data) {
        setData(json.data);
        setError(false);
      } else if (isInitial) {
        setError(true);
      }
    } catch {
      if (isInitial && mountedRef.current) {
        setError(true);
      }
    } finally {
      if (isInitial && mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchData(true);

    const interval = setInterval(() => fetchData(false), POLL_INTERVAL);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchData]);

  if (loading) return <LoadingSkeleton />;

  if (error || !data) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">
          Unable to load dashboard data. Please try refreshing.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* HERO */}
      {data.hero && (
        <HeroSection
          title={data.hero.title}
          subtitle={data.hero.subtitle}
          image={data.hero.image || "/photo1.png"}
          primaryCTA={{
            label: data.hero.primaryCTA?.label || "Shop Collection",
            link: data.hero.primaryCTA?.link || "/products",
          }}
          secondaryCTA={{
            label: data.hero.secondaryCTA?.label || "Read Stories",
            link: data.hero.secondaryCTA?.link || "/stories",
          }}
        />
      )}

      {/* IMPACT STATS */}
      {data.impact?.length > 0 && <TrustSection impact={data.impact} />}

      {/* OUR INITIATIVES */}
      {data.initiatives?.length > 0 && (
        <InitiativeCards initiatives={data.initiatives} />
      )}

      {/* OUR PRODUCTS — Horizontal Scroll */}
      {data.allProducts?.length > 0 && (
        <HomeProductsCarousel products={data.allProducts} />
      )}

      {/* FEATURED COLLECTION */}
      {data.featuredProducts?.length > 0 && (
        <HomeFeaturedProducts products={data.featuredProducts} />
      )}

      {/* CUSTOMER FEEDBACK */}
      {data.feedback?.length > 0 && (
        <HomeFeedback feedbacks={data.feedback} />
      )}

      {/* FINAL CTA */}
      {data.cta && (
        <ClosingCTA
          title={data.cta.title}
          description={data.cta.description}
          buttonText={data.cta.buttonText}
          link={data.cta.link || "/products"}
        />
      )}
    </>
  );
}

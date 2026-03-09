"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import HeroSection from "@/components/features/home/HeroSection";
import TrustSection from "@/components/features/home/TrustSection";
import HomeProductsCarousel from "@/components/features/home/HomeProductsCarousel";
import HomeFeaturedProducts from "@/components/features/home/HomeFeaturedProducts";
import InitiativeCards from "@/components/features/home/InitiativeCards";
import HomeFeedback from "@/components/features/home/HomeFeedback";
import ClosingCTA from "@/components/features/home/ClosingCTA";

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

function ProductsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-20 animate-pulse">
      <div className="h-8 w-48 bg-muted/40 rounded mx-auto mb-10" />
      <div className="flex gap-6 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-[300px] shrink-0 aspect-[3/4] rounded-2xl bg-muted/30" />
        ))}
      </div>
    </div>
  );
}

export default function HomePageContent({ initialData }: { initialData?: HomeData }) {
  const [data, setData] = useState<HomeData | null>(initialData || null);
  // Match SSR data presence exactly to avoid hydration mismatches.
  // We'll still use loadingProducts for the specialized "extra time" delay.
  const [loading, setLoading] = useState(!initialData);
  const [loadingProducts, setLoadingProducts] = useState(true);
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
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    let heroTimer: NodeJS.Timeout;
    let productsTimer: NodeJS.Timeout;

    heroTimer = setTimeout(() => {
      if (!mountedRef.current) return;
      setLoading(false);

      productsTimer = setTimeout(() => {
        if (!mountedRef.current) return;
        setLoadingProducts(false);
      }, 800);
    }, 400);

    if (!initialData) {
      fetchData(true);
    }

    const interval = setInterval(() => fetchData(false), POLL_INTERVAL);

    return () => {
      mountedRef.current = false;
      if (heroTimer) clearTimeout(heroTimer);
      if (productsTimer) clearTimeout(productsTimer);
      clearInterval(interval);
    };
  }, [fetchData, initialData]);

  if (error || (!data && !loading)) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">
          Unable to load dashboard data. Please try refreshing.
        </p>
      </div>
    );
  }

  // To avoid hydration mismatch, we NO LONGER return a separate LoadingSkeleton component here.
  // Instead, we render the main tree and handle individual section loading.

  return (
    <div className="flex flex-col">
      {/* HERO — SSR compatible toggle */}
      {data?.hero ? (
        <HeroSection
          title={data.hero.title}
          subtitle={data.hero.subtitle}
          image={data.hero.image || "./hero.png"}
          primaryCTA={{
            label: data.hero.primaryCTA?.label || "Shop Collection",
            link: data.hero.primaryCTA?.link || "/products",
          }}
          secondaryCTA={{
            label: data.hero.secondaryCTA?.label || "Read Stories",
            link: data.hero.secondaryCTA?.link || "/stories",
          }}
        />
      ) : (
        <div className="h-screen bg-muted/30 animate-pulse" />
      )}

      {/* OUR PRODUCTS — Granular loading for user's requested delay */}
      {data?.allProducts && data.allProducts.length > 0 ? (
        loadingProducts ? (
          <ProductsSkeleton />
        ) : (
          <HomeProductsCarousel products={data.allProducts} />
        )
      ) : null}

      {/* FEATURED COLLECTION */}
      {!loading && data?.featuredProducts && data.featuredProducts.length > 0 && (
        <HomeFeaturedProducts products={data.featuredProducts} />
      )}

      {/* IMPACT STATS */}
      {!loading && data?.impact && data.impact.length > 0 && (
        <TrustSection impact={data.impact} />
      )}

      {/* OUR INITIATIVES */}
      {!loading && data?.initiatives && data.initiatives.length > 0 && (
        <InitiativeCards initiatives={data.initiatives} />
      )}

      {/* CUSTOMER FEEDBACK */}
      {!loading && data?.feedback && data.feedback.length > 0 && (
        <HomeFeedback feedbacks={data.feedback} />
      )}

      {/* FINAL CTA */}
      {!loading && data?.cta && (
        <ClosingCTA
          title={data.cta.title}
          description={data.cta.description}
          buttonText={data.cta.buttonText}
          link={data.cta.link || "/products"}
        />
      )}
    </div>
  );
}

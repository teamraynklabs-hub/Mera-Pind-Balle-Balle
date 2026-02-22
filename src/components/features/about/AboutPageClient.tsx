"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import AboutHero from "./AboutHero";
import AboutMission from "./AboutMission";
import AboutVision from "./AboutVision";
import AboutValues from "./AboutValues";
import AboutImpact from "./AboutImpact";
import AboutTeam from "./AboutTeam";
import AboutCTA from "./AboutCTA";

interface AboutData {
  hero?: { title?: string; subtitle?: string; image?: string };
  mission?: { title?: string; description?: string; image?: string };
  vision?: { title?: string; description?: string; image?: string };
  values?: {
    sectionTitle?: string;
    sectionSubtitle?: string;
    items?: { icon?: string; title: string; description: string }[];
  };
  impact?: {
    sectionTitle?: string;
    sectionSubtitle?: string;
    stats?: { number: string; label: string; icon?: string }[];
  };
  team?: {
    sectionTitle?: string;
    sectionSubtitle?: string;
    members?: { name: string; role: string; description?: string; image?: string }[];
  };
  cta?: {
    title?: string;
    description?: string;
    primaryButtonText?: string;
    primaryButtonLink?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
  };
}

interface AboutPageClientProps {
  initialData?: AboutData | null;
}

export default function AboutPageClient({ initialData }: AboutPageClientProps) {
  const [data, setData] = useState<AboutData | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const res = await fetch("/api/about", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        if (json?.success && json.data) {
          setData(json.data);
        }
      } catch {
        // Keep initialData or null on error
      } finally {
        setLoading(false);
      }
    }

    fetchAbout();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <AboutHero
        title={data?.hero?.title}
        subtitle={data?.hero?.subtitle}
        image={data?.hero?.image}
      />

      <AboutMission
        title={data?.mission?.title}
        description={data?.mission?.description}
        image={data?.mission?.image}
      />

      <AboutVision
        title={data?.vision?.title}
        description={data?.vision?.description}
        image={data?.vision?.image}
      />

      <AboutValues
        sectionTitle={data?.values?.sectionTitle}
        sectionSubtitle={data?.values?.sectionSubtitle}
        items={Array.isArray(data?.values?.items) ? data.values.items : []}
      />

      <AboutImpact
        sectionTitle={data?.impact?.sectionTitle}
        sectionSubtitle={data?.impact?.sectionSubtitle}
        stats={Array.isArray(data?.impact?.stats) ? data.impact.stats : []}
      />

      <AboutTeam
        sectionTitle={data?.team?.sectionTitle}
        sectionSubtitle={data?.team?.sectionSubtitle}
        members={Array.isArray(data?.team?.members) ? data.team.members : []}
      />

      <AboutCTA
        title={data?.cta?.title}
        description={data?.cta?.description}
        primaryButtonText={data?.cta?.primaryButtonText}
        primaryButtonLink={data?.cta?.primaryButtonLink}
        secondaryButtonText={data?.cta?.secondaryButtonText}
        secondaryButtonLink={data?.cta?.secondaryButtonLink}
      />
    </>
  );
}

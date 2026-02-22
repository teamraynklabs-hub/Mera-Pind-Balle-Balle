"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";

interface SectionItem {
  title: string;
  content: string;
}

interface PageData {
  hero: { title: string; subtitle: string };
  lastUpdated: string;
  sections: SectionItem[];
  contactEmail: string;
  contactPhone: string;
}

const POLL_INTERVAL = 30_000;

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let bulletGroup: string[] = [];

  function flushBullets() {
    if (bulletGroup.length > 0) {
      elements.push(
        <ul
          key={`ul-${elements.length}`}
          className="list-disc pl-6 text-muted-foreground space-y-2 mt-2"
        >
          {bulletGroup.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      );
      bulletGroup = [];
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("- ")) {
      bulletGroup.push(line.slice(2));
    } else {
      flushBullets();
      if (line.trim() === "") {
        continue;
      }
      elements.push(
        <p key={`p-${i}`} className="text-muted-foreground leading-relaxed mt-2">
          {line}
        </p>
      );
    }
  }

  flushBullets();
  return elements;
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 animate-pulse">
      <div className="h-10 w-72 bg-muted/30 rounded mb-6" />
      <div className="h-5 w-full max-w-xl bg-muted/20 rounded mb-10" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="mb-10">
          <div className="h-7 w-56 bg-muted/30 rounded mb-3" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted/15 rounded" />
            <div className="h-4 w-5/6 bg-muted/15 rounded" />
            <div className="h-4 w-4/6 bg-muted/15 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TermsConditionsClient() {
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async (isInitial = false) => {
    try {
      const res = await fetch("/api/terms-conditions-page", {
        cache: "no-store",
      });
      const json = await res.json();

      if (!mountedRef.current) return;

      if (json.success && json.data) {
        setData(json.data);
      }
    } catch {
      // Silently fail on poll errors
    } finally {
      if (isInitial && mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    fetchData(true);

    const interval = setInterval(() => fetchData(false), POLL_INTERVAL);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchData]);

  if (loading) return <LoadingSkeleton />;

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground text-lg">
          Terms & Conditions content is being prepared. Please check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1
        className="text-4xl font-bold mb-6"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {data.hero.title}
      </h1>

      {data.hero.subtitle && (
        <p className="text-muted-foreground mb-10 max-w-3xl">
          {data.hero.subtitle}
        </p>
      )}

      {data.lastUpdated && (
        <p className="text-sm text-muted-foreground/70 mb-10">
          Last updated:{" "}
          {new Date(data.lastUpdated).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}

      {data.sections.map((section, i) => (
        <section key={i} className="mb-12">
          <h2 className="text-2xl font-semibold mb-3">{section.title}</h2>
          {section.title.toLowerCase().includes("privacy") ? (
            <p className="text-muted-foreground">
              {section.content.replace(
                /Privacy Policy/g,
                ""
              ).trim()}{" "}
              <Link href="/privacy-policy" className="text-primary underline">
                Privacy Policy
              </Link>
              .
            </p>
          ) : (
            renderContent(section.content)
          )}
        </section>
      ))}

      {(data.contactEmail || data.contactPhone) && (
        <section className="mb-12">
          <div className="text-muted-foreground mt-2 space-y-1">
            {data.contactEmail && <p>Email: {data.contactEmail}</p>}
            {data.contactPhone && <p>Phone: {data.contactPhone}</p>}
          </div>
        </section>
      )}
    </div>
  );
}

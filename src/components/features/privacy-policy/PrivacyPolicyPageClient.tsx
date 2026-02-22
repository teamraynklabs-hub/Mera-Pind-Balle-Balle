"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { Mail, Phone } from "lucide-react";

/* ── Types ── */

interface SectionItem {
  title: string;
  content: string;
}

interface PrivacyPolicyPageData {
  hero: { title: string; subtitle: string };
  lastUpdated: string;
  sections: SectionItem[];
  contactEmail: string;
  contactPhone: string;
}

interface PrivacyPolicyPageClientProps {
  initialData: PrivacyPolicyPageData;
}

/* ── Animation wrapper ── */

const ease = [0.16, 1, 0.3, 1] as const;

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/* ── Content renderer (handles bullet points) ── */

function renderContent(content: string) {
  const lines = content.split("\n").filter((l) => l.trim() !== "");

  const bulletLines: string[] = [];
  const blocks: React.ReactNode[] = [];
  let key = 0;

  function flushBullets() {
    if (bulletLines.length > 0) {
      blocks.push(
        <ul
          key={key++}
          className="list-disc pl-6 text-muted-foreground space-y-2"
        >
          {bulletLines.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      );
      bulletLines.length = 0;
    }
  }

  for (const line of lines) {
    if (line.startsWith("- ") || line.startsWith("• ")) {
      bulletLines.push(line.slice(2));
    } else {
      flushBullets();
      blocks.push(
        <p key={key++} className="text-muted-foreground leading-relaxed">
          {line}
        </p>
      );
    }
  }
  flushBullets();

  return blocks;
}

/* ── Main Component ── */

export default function PrivacyPolicyPageClient({
  initialData,
}: PrivacyPolicyPageClientProps) {
  const [data, setData] = useState<PrivacyPolicyPageData>(initialData);

  /* Fetch fresh data on mount for real-time updates */
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/privacy-policy-page", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const json = await res.json();
        if (json?.success && json.data) {
          setData(json.data);
        }
      } catch {
        /* keep initial data */
      }
    }
    fetchData();
  }, []);

  const formattedDate = data.lastUpdated
    ? new Date(data.lastUpdated).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <>
      {/* ── HERO ── */}
      <section className="container mx-auto px-4 md:px-8 lg:px-12 pt-28 pb-8">
        <FadeUp>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {data.hero.title}
          </h1>

          {formattedDate && (
            <p className="text-sm text-muted-foreground/70 mb-4">
              Last updated: {formattedDate}
            </p>
          )}

          {data.hero.subtitle && (
            <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">
              {data.hero.subtitle}
            </p>
          )}
        </FadeUp>
      </section>

      {/* ── POLICY SECTIONS ── */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 pb-20">
        <div className="max-w-4xl space-y-10">
          {data.sections.map((section, i) => (
            <FadeUp key={i} delay={i * 0.03}>
              <section>
                <h2
                  className="text-2xl font-semibold mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {renderContent(section.content)}
                </div>
              </section>
            </FadeUp>
          ))}

          {/* Contact section (always shown if email or phone exists) */}
          {(data.contactEmail || data.contactPhone) && (
            <FadeUp delay={data.sections.length * 0.03}>
              <div className="mt-8 p-6 rounded-2xl bg-card border">
                <h3 className="text-lg font-semibold mb-3">
                  Questions about this policy?
                </h3>
                <div className="space-y-2">
                  {data.contactEmail && (
                    <a
                      href={`mailto:${data.contactEmail}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-[var(--gold)] transition-colors"
                    >
                      <Mail size={18} />
                      <span>{data.contactEmail}</span>
                    </a>
                  )}
                  {data.contactPhone && (
                    <a
                      href={`tel:${data.contactPhone.replace(/\s/g, "")}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-[var(--gold)] transition-colors"
                    >
                      <Phone size={18} />
                      <span>{data.contactPhone}</span>
                    </a>
                  )}
                </div>
              </div>
            </FadeUp>
          )}
        </div>
      </div>
    </>
  );
}

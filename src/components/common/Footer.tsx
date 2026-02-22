"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ── Types ── */

interface LinkItem {
  label: string;
  link: string;
}

interface SocialLink {
  platform: string;
  link: string;
}

interface FooterData {
  brand: { description: string };
  quickLinks: { columnTitle: string; items: LinkItem[] };
  supportLinks: { columnTitle: string; items: LinkItem[] };
  contactInfo: {
    columnTitle: string;
    address: string;
    phone: string;
    email: string;
  };
  socialLinks: SocialLink[];
  legalLinks: LinkItem[];
  copyrightText: string;
}

/* ── Social icon map ── */

const SOCIAL_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
};

/* ── Component ── */

export default function Footer({
  initialData,
}: {
  initialData?: FooterData | null;
}) {
  const [data, setData] = useState<FooterData | null>(initialData ?? null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Fetch fresh data on mount for real-time updates */
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/footer-page", { cache: "no-store" });
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

  /* Intersection observer for reveal animation */
  useEffect(() => {
    if (!footerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, [mounted]);

  if (!mounted) return null;

  const quickLinks = data?.quickLinks?.items ?? [];
  const supportLinks = data?.supportLinks?.items ?? [];
  const socialLinks = data?.socialLinks ?? [];
  const legalLinks = data?.legalLinks ?? [];
  const contactAddress =
    data?.contactInfo?.address || "123 Heritage Lane, New Delhi, India 110001";
  const contactPhone = data?.contactInfo?.phone || "+91 12345 67890";
  const contactEmail = data?.contactInfo?.email || "hello@merapind.com";
  const brandDescription =
    data?.brand?.description ||
    "Empowering rural women artisans through traditional crafts and sustainable livelihood.";
  const copyrightText =
    data?.copyrightText || "Mera Pind Balle Balle. All rights reserved.";

  const quickLinksTitle = data?.quickLinks?.columnTitle || "Quick Links";
  const supportLinksTitle =
    data?.supportLinks?.columnTitle || "Get Involved";
  const contactTitle = data?.contactInfo?.columnTitle || "Contact Us";

  const currentYear = new Date().getFullYear();

  return (
    <footer
      ref={footerRef}
      className="w-full bg-card border-t border-border"
    >
      <div
        className={`section-container py-14 md:py-16 transition-all duration-700 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* COLUMN 1 — BRAND */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-11 w-11 rounded-full overflow-hidden border border-border shadow-sm flex-shrink-0">
                <Image
                  src="/logo.jpeg"
                  alt="Mera Pind Balle Balle"
                  width={44}
                  height={44}
                  priority
                />
              </div>
              <h3 className="font-heading text-xl font-semibold tracking-tight">
                Mera Pind Balle Balle
              </h3>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-5">
              {brandDescription}
            </p>

            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map((item, i) => {
                  const Icon = SOCIAL_ICONS[item.platform];
                  if (!Icon) return null;
                  return (
                    <Link
                      key={`${item.platform}-${i}`}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.platform}
                      className="social-icon p-2 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary"
                    >
                      <Icon size={18} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* COLUMN 2 — QUICK LINKS */}
          <div className="text-center sm:text-left">
            <h4 className="font-heading text-base font-semibold mb-4 text-foreground">
              {quickLinksTitle}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((item, i) => (
                <li key={`ql-${i}`}>
                  <Link
                    href={item.link}
                    className="footer-link text-muted-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3 — SUPPORT LINKS */}
          <div className="text-center sm:text-left">
            <h4 className="font-heading text-base font-semibold mb-4 text-foreground">
              {supportLinksTitle}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {supportLinks.map((item, i) => (
                <li key={`sl-${i}`}>
                  <Link
                    href={item.link}
                    className="footer-link text-muted-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4 — CONTACT INFO */}
          <div className="text-center sm:text-left">
            <h4 className="font-heading text-base font-semibold mb-4 text-foreground">
              {contactTitle}
            </h4>
            <ul className="space-y-3.5 text-sm text-muted-foreground">
              {contactAddress && (
                <li className="flex items-start gap-2.5 justify-center sm:justify-start">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary/70" />
                  <span className="leading-relaxed">{contactAddress}</span>
                </li>
              )}
              {contactPhone && (
                <li className="flex items-center gap-2.5 justify-center sm:justify-start">
                  <Phone className="h-4 w-4 flex-shrink-0 text-primary/70" />
                  <a
                    href={`tel:${contactPhone.replace(/\s/g, "")}`}
                    className="footer-link"
                  >
                    {contactPhone}
                  </a>
                </li>
              )}
              {contactEmail && (
                <li className="flex items-center gap-2.5 justify-center sm:justify-start">
                  <Mail className="h-4 w-4 flex-shrink-0 text-primary/70" />
                  <a
                    href={`mailto:${contactEmail}`}
                    className="footer-link"
                  >
                    {contactEmail}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-border mt-10 mb-6" />

        {/* BOTTOM ROW */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-muted-foreground">
          <p>
            &copy; {currentYear} {copyrightText}
          </p>

          {legalLinks.length > 0 && (
            <div className="flex gap-5">
              {legalLinks.map((item, i) => (
                <Link
                  key={`ll-${i}`}
                  href={item.link}
                  className="hover:text-primary transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

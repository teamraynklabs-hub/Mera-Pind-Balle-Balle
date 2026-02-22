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

const DEFAULT_QUICK_LINKS = [
  { label: "Shop Products", link: "/products" },
  { label: "Artisan Stories", link: "/stories" },
  { label: "Blog", link: "/blog" },
  { label: "About Us", link: "/about" },
];

const DEFAULT_SUPPORT_LINKS = [
  { label: "Become a Distributor", link: "/distributors" },
  { label: "Careers", link: "/careers" },
  { label: "Resources", link: "/resources" },
  { label: "Contact", link: "/contact" },
];

const SOCIAL_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
};

export default function Footer({ footer }: { footer?: any }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const quickLinks =
    footer?.quickLinks?.length > 0 ? footer.quickLinks : DEFAULT_QUICK_LINKS;
  const supportLinks =
    footer?.supportLinks?.length > 0
      ? footer.supportLinks
      : DEFAULT_SUPPORT_LINKS;
  const legalLinks = footer?.legalLinks ?? [];
  const socialLinks = footer?.socialLinks ?? [];

  const contactAddress =
    footer?.contactAddress || "123 Heritage Lane, New Delhi, India 110001";
  const contactPhone = footer?.contactPhone || "+91 12345 67890";
  const contactEmail = footer?.contactEmail || "hello@merapind.com";

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
              {footer?.description ||
                "Empowering rural women artisans through traditional crafts and sustainable livelihood."}
            </p>

            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map((item: any) => {
                  const Icon = SOCIAL_ICONS[item.platform];
                  if (!Icon) return null;
                  return (
                    <Link
                      key={item.platform}
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
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((item: any) => (
                <li key={item.label}>
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

          {/* COLUMN 3 — GET INVOLVED */}
          <div className="text-center sm:text-left">
            <h4 className="font-heading text-base font-semibold mb-4 text-foreground">
              Get Involved
            </h4>
            <ul className="space-y-2.5 text-sm">
              {supportLinks.map((item: any) => (
                <li key={item.label}>
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
              Contact Us
            </h4>
            <ul className="space-y-3.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5 justify-center sm:justify-start">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary/70" />
                <span className="leading-relaxed">{contactAddress}</span>
              </li>
              <li className="flex items-center gap-2.5 justify-center sm:justify-start">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary/70" />
                <a
                  href={`tel:${contactPhone.replace(/\s/g, "")}`}
                  className="footer-link"
                >
                  {contactPhone}
                </a>
              </li>
              <li className="flex items-center gap-2.5 justify-center sm:justify-start">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary/70" />
                <a
                  href={`mailto:${contactEmail}`}
                  className="footer-link"
                >
                  {contactEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-border mt-10 mb-6" />

        {/* BOTTOM ROW */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-muted-foreground">
          <p>&copy; {currentYear} Mera Pind Balle Balle. All rights reserved.</p>

          <div className="flex gap-5">
            {legalLinks.length > 0 ? (
              legalLinks.map((item: any) => (
                <Link
                  key={item.label}
                  href={item.link}
                  className="hover:text-primary transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))
            ) : (
              <>
                <Link
                  href="/privacy-policy"
                  className="hover:text-primary transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-conditions"
                  className="hover:text-primary transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

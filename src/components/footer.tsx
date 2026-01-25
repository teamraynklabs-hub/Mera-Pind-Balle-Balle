"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
} from "lucide-react";

export default function Footer({ footer }: { footer?: any }) {
  const supportLinks = footer?.supportLinks ?? [];
  const quickLinks = footer?.quickLinks ?? [];
  const legalLinks = footer?.legalLinks ?? [];
  const socialLinks = footer?.socialLinks ?? [];

  return (
    <footer className="w-full bg-background border-t pt-12 mt-16">
      <div className="container mx-auto px-4">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 pb-12 text-left">

          {/* BRAND */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full overflow-hidden border shadow-sm">
                <Image src="/logo.jpeg" alt="Brand Logo" width={48} height={48} />
              </div>
              <span className="font-bold text-2xl">Mera Pind Balle Balle</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Empowering rural India with resources, inspiring stories,
              and sustainable development initiatives.
            </p>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3 text-sm">
              {supportLinks.map((item: any) => (
                <li key={item.label}>
                  <Link href={item.link} className="footer-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((item: any) => (
                <li key={item.label}>
                  <Link href={item.link} className="footer-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* LEGAL + SOCIAL */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal & Social</h3>

            <ul className="space-y-3 text-sm">
              {legalLinks.map((item: any) => (
                <li key={item.label}>
                  <Link href={item.link} className="footer-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex gap-4 mt-6">
              {socialLinks.map((item: any) => {
                const icons: any = {
                  facebook: Facebook,
                  instagram: Instagram,
                  twitter: Twitter,
                  youtube: Youtube,
                  linkedin: Linkedin,
                };
                const Icon = icons[item.platform];
                return (
                  Icon && (
                    <Link key={item.platform} href={item.link} target="_blank">
                      <Icon size={22} className="social-icon" />
                    </Link>
                  )
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Mera Pind Balle Balle. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

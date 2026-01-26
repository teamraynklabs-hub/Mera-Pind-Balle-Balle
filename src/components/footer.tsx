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
import { useEffect, useState } from "react";

export default function Footer({ footer }: { footer?: any }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const supportLinks = footer?.supportLinks ?? [];
  const quickLinks = footer?.quickLinks ?? [];
  const legalLinks = footer?.legalLinks ?? [];
  const socialLinks = footer?.socialLinks ?? [];

  if (!mounted) return null;

  const icons: any = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    youtube: Youtube,
    linkedin: Linkedin,
  };

  return (
    <footer className="w-full bg-background border-t mt-16">
      <div className="container mx-auto px-4 py-12">

        {/* MAIN GRID */}
        <div className="
          grid gap-10
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          text-center
          sm:text-left
        ">

          {/* BRAND */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full overflow-hidden border shadow-sm">
                <Image
                  src="/logo.jpeg"
                  alt="Brand Logo"
                  width={48}
                  height={48}
                  priority
                />
              </div>
              <span className="font-bold text-xl">
                Mera Pind Balle Balle
              </span>
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
                  <Link href={item.link} className="hover:text-primary transition">
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
                  <Link href={item.link} className="hover:text-primary transition">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* LEGAL + SOCIAL */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal & Social</h3>

            <ul className="space-y-3 text-sm mb-6">
              {legalLinks.map((item: any) => (
                <li key={item.label}>
                  <Link href={item.link} className="hover:text-primary transition">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* SOCIAL ICONS */}
            <div className="flex justify-center sm:justify-start gap-5">
              {socialLinks.map((item: any) => {
                const Icon = icons[item.platform];
                return (
                  Icon && (
                    <Link
                      key={item.platform}
                      href={item.link}
                      target="_blank"
                      aria-label={item.platform}
                      className="p-2 rounded-full border hover:bg-accent transition"
                    >
                      <Icon size={20} />
                    </Link>
                  )
                );
              })}
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="
          border-t mt-10 pt-5
          text-center text-xs text-muted-foreground
        ">
          © {new Date().getFullYear()} Mera Pind Balle Balle. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}

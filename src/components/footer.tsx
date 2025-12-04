"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t pt-12 mt-16">
      <div className="container mx-auto px-4">

        {/* GRID — ALWAYS LEFT (NO CENTER ANYWHERE) */}
        <div
          className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-4 
            gap-12 
            pb-12
            text-left
          "
        >

          {/* BRAND + DESCRIPTION */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full overflow-hidden border shadow-sm bg-background">
                <Image
                  src="/logo.jpeg"
                  alt="Brand Logo"
                  width={48}
                  height={48}
                  className="object-cover h-full w-full"
                />
              </div>

              <span className="font-bold text-2xl leading-none">
                Mera Pind Balle Balle
              </span>
            </div>

            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Empowering rural India with resources, inspiring stories,
              and sustainable development initiatives.
            </p>
          </div>

          {/* SUPPORT LINKS */}
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-semibold mb-4 tracking-wide">Support</h3>

            <ul className="space-y-3 text-sm">
              <li><Link href="/resources" className="footer-link">Resources</Link></li>
              <li><Link href="/distributors" className="footer-link">Distributors</Link></li>
              <li><Link href="/careers" className="footer-link">Careers</Link></li>
              <li><Link href="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </div>

          {/* QUICK LINKS */}
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-semibold mb-4 tracking-wide">Quick Links</h3>

            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="footer-link">About Us</Link></li>
              <li><Link href="/services" className="footer-link">Services</Link></li>
              <li><Link href="/products" className="footer-link">Products</Link></li>
              <li><Link href="/blog" className="footer-link">Blog</Link></li>
            </ul>
          </div>

          {/* LEGAL + SOCIAL */}
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-semibold mb-4 tracking-wide">Legal & Social</h3>

            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
              <li><Link href="/terms-conditions" className="footer-link">Terms & Conditions</Link></li>
            </ul>

            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
              <Link href="#" aria-label="Facebook">
                <Facebook size={22} className="hover:text-primary transition-all duration-200 hover:-translate-y-1" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram size={22} className="hover:text-primary transition-all duration-200 hover:-translate-y-1" />
              </Link>
              <Link href="#" aria-label="Twitter">
                <Twitter size={22} className="hover:text-primary transition-all duration-200 hover:-translate-y-1" />
              </Link>
              <Link href="#" aria-label="YouTube">
                <Youtube size={22} className="hover:text-primary transition-all duration-200 hover:-translate-y-1" />
              </Link>
              <Link href="#" aria-label="LinkedIn">
                <Linkedin size={22} className="hover:text-primary transition-all duration-200 hover:-translate-y-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t py-5 text-center text-xs md:text-sm text-muted-foreground tracking-wide">
          &copy; {new Date().getFullYear()} <span className="font-medium">Mera Pind Balle Balle</span>.
          &nbsp;All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

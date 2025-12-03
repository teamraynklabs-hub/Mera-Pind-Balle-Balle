"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/ui/toggleBtn";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { title: "Home", href: "/" },
    { title: "About Us", href: "/about" },
    { title: "Initiatives", href: "/services" },
    { title: "Products", href: "/products" },
    { title: "Stories", href: "/stories" },
    { title: "Resources", href: "/resources" },
    { title: "Distributors", href: "/distributors" },
    { title: "Careers", href: "/careers" },
    { title: "Contact", href: "/contact" },
  ];

  return (
    <header className="w-full border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpeg"
            alt="Brand Logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <span className="font-semibold text-xl tracking-tight">
            Mera Pind
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {item.title}
            </Link>
          ))}

          <ModeToggle />
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-accent"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-background border-t px-4 py-4">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm py-2 font-medium hover:text-primary transition-colors"
              >
                {item.title}
              </Link>
            ))}

            <div className="flex justify-between items-center mt-4">
              <ModeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

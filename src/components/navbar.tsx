"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/ui/toggleBtn";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { title: "Home", href: "/" },
    { title: "About Us", href: "/about" },
    { title: "Services", href: "/services" },
    { title: "Products", href: "/products" },
    { title: "Blog", href: "/blog" },
    { title: "Stories", href: "/stories" },
    { title: "Contact", href: "/contact" },
  ];

  return (
    <header className="w-full border-b bg-background/70 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full overflow-hidden border shadow-sm">
            <Image
              src="/logo.jpeg"
              alt="Brand Logo"
              width={44}
              height={44}
              priority
              suppressHydrationWarning
            />
          </div>
          <span className="font-semibold text-xl">MPBB</span>
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`text-sm font-medium relative ${
                  isActive ? "text-primary" : "hover:text-primary"
                }`}
              >
                {item.title}
                {isActive && (
                  <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
          <ModeToggle />
        </nav>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-accent"
          onClick={() => setOpen(!open)}
          suppressHydrationWarning
        >
          {mounted && (open ? <X size={24} /> : <Menu size={24} />)}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mounted && open && (
        <div className="md:hidden bg-background border-t px-4 py-4 shadow-md">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`text-sm py-2 font-medium ${
                    isActive ? "text-primary underline" : "hover:text-primary"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}

            <div className="mt-4">
              <ModeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

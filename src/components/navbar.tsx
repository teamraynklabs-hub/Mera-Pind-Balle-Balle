"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/ui/toggleBtn";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { IoSettingsSharp } from "react-icons/io5";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // NAV ITEMS
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
              className="object-cover h-full w-full"
            />
          </div>
          <span className="font-semibold text-xl tracking-tight">
            Mera Pind
          </span>
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
                className={`text-sm font-medium transition-colors relative 
                  ${isActive ? "text-primary" : "hover:text-primary"}
                `}
              >
                {item.title}

                {/* Underline for active tab */}
                {isActive && (
                  <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-primary rounded-full"></span>
                )}
              </Link>
            );
          })}

          <ModeToggle />
        </nav>

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-accent"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
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
                  className={`text-sm py-2 font-medium transition-colors 
                    ${isActive ? "text-primary underline" : "hover:text-primary"}
                  `}
                >
                  {item.title}
                </Link>
              );
            })}

            <div className="flex justify-start items-center mt-4">
              <ModeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/ui/toggleBtn";
import { Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useUserAuth } from "@/context/UserAuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { user, logout } = useUserAuth();

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
    <header className="w-full fixed top-0 z-50 bg-transparent backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* LEFT — Brand */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="h-10 w-10 rounded-full overflow-hidden border border-border/50 shadow-xs">
            <Image
              src="/logo.jpeg"
              alt="Brand Logo"
              width={40}
              height={40}
              priority
              suppressHydrationWarning
            />
          </div>
          <span
            className="hidden sm:inline text-xl font-medium tracking-wide text-[#C8941F] dark:text-[#D4A336]"
            style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
          >
            Mera Pind Balle Balle
          </span>
        </Link>

        {/* CENTER — Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`text-sm font-medium px-3 py-2 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:transition-all after:duration-200 ${
                  isActive
                    ? "text-primary after:bg-primary after:scale-x-100"
                    : "text-foreground/70 hover:text-foreground after:bg-foreground after:scale-x-0 hover:after:scale-x-100"
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT — Icons (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 shrink-0">
          <Link
            href="/cart"
            className="relative p-2 rounded-lg text-foreground/70 hover:text-foreground transition-colors"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <button
              onClick={logout}
              className="p-2 rounded-lg text-foreground/70 hover:text-foreground transition-colors"
              title={`Logout (${user.name})`}
            >
              <LogOut size={20} />
            </button>
          ) : (
            <Link
              href="/login"
              className="p-2 rounded-lg text-foreground/70 hover:text-foreground transition-colors"
              title="Login"
            >
              <User size={20} />
            </Link>
          )}

          <ModeToggle />
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-accent/50 transition-colors"
          onClick={() => setOpen(!open)}
          suppressHydrationWarning
        >
          {mounted && (open ? <X size={22} /> : <Menu size={22} />)}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mounted && open && (
        <div className="lg:hidden bg-background/80 backdrop-blur-md border-t border-border/50 px-4 py-3">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`text-sm py-2.5 px-3 font-medium transition-colors border-l-2 ${
                    isActive
                      ? "text-primary border-primary"
                      : "text-muted-foreground hover:text-foreground border-transparent hover:border-foreground"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}

            <div className="h-px bg-border my-2" />

            <div className="flex items-center gap-2 px-1">
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>
              {user ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut size={20} />
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                >
                  <User size={20} />
                </Link>
              )}
              <ModeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

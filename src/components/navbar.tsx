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
    <header className="w-full border-b bg-background/80 backdrop-blur-xl sticky top-0 z-50 shadow-xs">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-full overflow-hidden border shadow-xs">
            <Image
              src="/logo.jpeg"
              alt="Brand Logo"
              width={40}
              height={40}
              priority
              suppressHydrationWarning
            />
          </div>
          <span className="font-bold text-lg">MPBB</span>
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors relative ${
                  isActive
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {item.title}
              </Link>
            );
          })}

          <div className="w-px h-6 bg-border mx-2" />

          <Link
            href="/cart"
            className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
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
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title={`Logout (${user.name})`}
            >
              <LogOut size={20} />
            </button>
          ) : (
            <Link
              href="/login"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Login"
            >
              <User size={20} />
            </Link>
          )}

          <ModeToggle />
        </nav>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          onClick={() => setOpen(!open)}
          suppressHydrationWarning
        >
          {mounted && (open ? <X size={22} /> : <Menu size={22} />)}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mounted && open && (
        <div className="md:hidden bg-background border-t px-4 py-3 shadow-md">
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
                  className={`text-sm py-2.5 px-3 rounded-lg font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
                className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
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
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <LogOut size={20} />
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
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

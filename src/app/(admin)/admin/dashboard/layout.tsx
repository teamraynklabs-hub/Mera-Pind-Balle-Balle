"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/ui/toggleBtn";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

import {
  Menu,
  X,
  LayoutDashboard,
  Home,
  Info,
  Package,
  ShoppingCart,
  FileText,
  BookOpen,
  Users,
  Mail,
  BriefcaseBusiness,
  Notebook,
  Layers,
  ArrowLeft,
  Wrench,
  Shield,
  ScrollText,
  Navigation,
  PanelBottom,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Click outside closes sidebar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        if (open) setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // All admin navigation links — ordered logically
  const menuItems = [
    { title: "Dashboard",      href: "/admin/dashboard",               icon: <LayoutDashboard size={18} /> },
    { title: "Home Page",      href: "/admin/dashboard/home",          icon: <Home size={18} /> },
    { title: "About Page",     href: "/admin/dashboard/about",         icon: <Info size={18} /> },
    { title: "Products",       href: "/admin/dashboard/products",      icon: <Package size={18} /> },
    { title: "Orders",         href: "/admin/dashboard/orders",        icon: <ShoppingCart size={18} /> },
    { title: "Services",       href: "/admin/dashboard/services",      icon: <Wrench size={18} /> },
    { title: "Blogs",          href: "/admin/dashboard/blogs",         icon: <FileText size={18} /> },
    { title: "Stories",        href: "/admin/dashboard/stories",       icon: <BookOpen size={18} /> },
    { title: "Careers",        href: "/admin/dashboard/careers",       icon: <BriefcaseBusiness size={18} /> },
    { title: "Resources",      href: "/admin/dashboard/resources",     icon: <Layers size={18} /> },
    { title: "Contact Leads",  href: "/admin/dashboard/contact",       icon: <Mail size={18} /> },
    { title: "Distributors",   href: "/admin/dashboard/distributors",  icon: <Users size={18} /> },
    { title: "Privacy Policy", href: "/admin/dashboard/privacy-policy", icon: <Shield size={18} /> },
    { title: "Terms & Conditions", href: "/admin/dashboard/terms-conditions", icon: <ScrollText size={18} /> },
    { title: "Navbar",            href: "/admin/dashboard/navbar",            icon: <Navigation size={18} /> },
    { title: "Footer",            href: "/admin/dashboard/footer",            icon: <PanelBottom size={18} /> },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex min-h-screen bg-background">

      {/* Mobile overlay backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        ref={sidebarRef}
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-card border-r shadow-sm
          flex flex-col
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-64"}
          md:translate-x-0
        `}
      >
        {/* Header — fixed at top */}
        <div className="h-16 flex items-center justify-between px-6 border-b shrink-0">
          <Link href="/" title="Back to Website">
            <ArrowLeft size={20} className="hover:text-primary cursor-pointer" />
          </Link>

          <span className="text-lg font-bold">Admin Panel</span>

          {/* Close button on mobile */}
          <button
            onClick={() => setOpen(false)}
            className="md:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
          <div className="hidden md:block w-5" />
        </div>

        {/* Menu Items — scrollable */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
                ${isActive(item.href)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent text-foreground/80 hover:text-foreground"
                }
              `}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="truncate">{item.title}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64 min-w-0">

        {/* Mobile Topbar */}
        <header className="sticky top-0 z-20 h-14 border-b bg-background/95 backdrop-blur flex items-center justify-between px-4 md:hidden">
          <div className="flex items-center gap-4">
            <button onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu size={24} />
            </button>
            <h1 className="font-semibold text-sm truncate">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <AdminLogoutButton />
          </div>
        </header>

        {/* Desktop Topbar */}
        <header className="sticky top-0 z-20 h-12 border-b bg-background/95 backdrop-blur hidden md:flex items-center justify-end px-6 gap-3">
          <ModeToggle />
          <AdminLogoutButton />
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

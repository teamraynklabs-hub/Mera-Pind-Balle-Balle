"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  FileText,
  BookOpen,
  Users,
  Mail,
  BriefcaseBusiness,
  Notebook,
  Layers,
  ArrowLeft,
  LogOut,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  // All admin navigation links
  const menuItems = [
    { title: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
    { title: "Products", href: "/admin/dashboard/products", icon: <Package size={18} /> },
    { title: "Blogs", href: "/admin/dashboard/blogs", icon: <FileText size={18} /> },
    { title: "Stories", href: "/admin/dashboard/stories", icon: <BookOpen size={18} /> },
    { title: "Careers", href: "/admin/dashboard/careers", icon: <BriefcaseBusiness size={18} /> },
    { title: "Contact Leads", href: "/admin/dashboard/contact", icon: <Mail size={18} /> },
    { title: "Distributors", href: "/admin/dashboard/distributors", icon: <Users size={18} /> },
    { title: "Resources", href: "/admin/dashboard/resources", icon: <Layers size={18} /> },
    { title: "Services", href: "/admin/dashboard/services", icon: <Notebook size={18} /> },
    { title: "About Page", href: "/admin/dashboard/about", icon: <Notebook size={18} /> },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex min-h-screen bg-background">

      {/* SIDEBAR */}
      <aside
        ref={sidebarRef}
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-card border-r shadow-sm
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-64"}
          md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b">
          <Link href="/" title="Back to Website">
            <ArrowLeft size={20} className="hover:text-primary cursor-pointer" />
          </Link>

          <span className="text-lg font-bold">Admin Panel</span>

          <div className="w-5" />
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`
                flex items-center gap-3 p-3 rounded-md transition cursor-pointer
                ${isActive(item.href)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
                }
              `}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-6 flex items-center gap-3 w-full p-3 rounded-md text-red-500 hover:bg-red-500/10 transition cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64">

        {/* Mobile Topbar */}
        <header className="h-16 border-b bg-background flex items-center px-4 justify-between md:hidden">
          <button onClick={() => setOpen(!open)}>
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
          <h1 className="font-semibold">Admin Dashboard</h1>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Home,
  Package,
  ShoppingCart,
  FileText,
  BookOpen,
  BriefcaseBusiness,
  Mail,
  Users,
  Layers,
  Wrench,
  Info,
  Sparkles,
  Shield,
  Gauge,
  PanelTop,
} from "lucide-react";

const cards = [
  { title: "Home Page",     href: "/admin/dashboard/home",          icon: Home,              color: "from-emerald-500/20 to-emerald-600/5" },
  { title: "Products",      href: "/admin/dashboard/products",      icon: Package,           color: "from-blue-500/20 to-blue-600/5" },
  { title: "Orders",        href: "/admin/dashboard/orders",        icon: ShoppingCart,       color: "from-amber-500/20 to-amber-600/5" },
  { title: "Blogs",         href: "/admin/dashboard/blogs",         icon: FileText,          color: "from-purple-500/20 to-purple-600/5" },
  { title: "Stories",       href: "/admin/dashboard/stories",       icon: BookOpen,          color: "from-pink-500/20 to-pink-600/5" },
  { title: "Careers",       href: "/admin/dashboard/careers",       icon: BriefcaseBusiness, color: "from-indigo-500/20 to-indigo-600/5" },
  { title: "Contact Leads", href: "/admin/dashboard/contact",       icon: Mail,              color: "from-cyan-500/20 to-cyan-600/5" },
  { title: "Distributors",  href: "/admin/dashboard/distributors",  icon: Users,             color: "from-teal-500/20 to-teal-600/5" },
  { title: "Resources",     href: "/admin/dashboard/resources",     icon: Layers,            color: "from-orange-500/20 to-orange-600/5" },
  { title: "Services",      href: "/admin/dashboard/services",      icon: Wrench,            color: "from-rose-500/20 to-rose-600/5" },
  { title: "About Page",    href: "/admin/dashboard/about",         icon: Info,              color: "from-violet-500/20 to-violet-600/5" },
];

const tips = [
  { icon: PanelTop, text: "You are in full control of your website content through this admin panel." },
  { icon: Shield, text: "All changes you make here reflect on the live website instantly." },
  { icon: Gauge, text: "Use the sidebar to navigate between different sections quickly." },
  { icon: Sparkles, text: "Keep your product catalog and blog updated for better engagement." },
];

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

function AnimatedCard({ item, index }: { item: typeof cards[number]; index: number }) {
  const { ref, isVisible } = useInView(0.15);
  const Icon = item.icon;

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${index * 60}ms`,
      }}
      className={`
        transform transition-all duration-500 ease-out
        ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}
      `}
    >
      <Link
        href={item.href}
        className={`
          group relative flex flex-col items-center justify-center gap-3
          p-6 rounded-2xl border bg-card
          hover:shadow-lg hover:-translate-y-1.5 hover:border-primary/30
          transition-all duration-300 cursor-pointer block text-center
          overflow-hidden
        `}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        <div className="relative z-10 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
          <Icon size={24} className="text-primary" />
        </div>
        <span className="relative z-10 text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
          {item.title}
        </span>
      </Link>
    </div>
  );
}

export default function AdminDashboardHome() {
  const [titleVisible, setTitleVisible] = useState(false);
  const tipsView = useInView(0.2);

  useEffect(() => {
    const t = setTimeout(() => setTitleVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-10">
      {/* Hero Section */}
      <div className="text-center pt-6 sm:pt-10">
        <div
          className={`
            transform transition-all duration-700 ease-out
            ${titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
          `}
        >
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">
            Admin Dashboard
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            <span className="text-foreground">Welcome to</span>
            <br />
            <span className="admin-gradient-text">Mera Pind Balle Balle</span>
          </h1>
        </div>

        <p
          className={`
            mt-4 text-muted-foreground text-base sm:text-lg max-w-lg mx-auto
            transform transition-all duration-700 delay-300 ease-out
            ${titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
          `}
        >
          Manage your entire website from one place. Select a module below to get started.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {cards.map((item, index) => (
          <AnimatedCard key={item.href} item={item} index={index} />
        ))}
      </div>

      {/* Tips Section */}
      <div
        ref={tipsView.ref}
        className={`
          rounded-2xl border bg-card/50 p-6 sm:p-8
          transform transition-all duration-600 ease-out
          ${tipsView.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        `}
      >
        <div className="flex items-center gap-2 mb-5">
          <Sparkles size={18} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Quick Tips</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {tips.map((tip, i) => {
            const TipIcon = tip.icon;
            return (
              <div
                key={i}
                style={{ transitionDelay: `${(tipsView.isVisible ? i * 100 : 0)}ms` }}
                className={`
                  flex items-start gap-3 p-3 rounded-xl bg-background/60
                  transform transition-all duration-500 ease-out
                  ${tipsView.isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}
                `}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <TipIcon size={16} className="text-primary" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{tip.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

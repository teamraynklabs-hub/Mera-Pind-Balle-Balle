"use client";

import Link from "next/link";

export default function AdminDashboardHome() {
  const cards = [
    {
      title: "Homepage Manager",
      desc: "Manage and upload all home page content and data.",
      href: "/admin/dashboard/home",
    },
    {
      title: "Products Manager",
      desc: "Add, edit and delete products.",
      href: "/admin/dashboard/products",
    },
    {
      title: "Blog Manager",
      desc: "Publish and edit blogs.",
      href: "/admin/dashboard/blogs",
    },
    {
      title: "Stories Manager",
      desc: "Post village stories.",
      href: "/admin/dashboard/stories",
    },
    {
      title: "Careers Manager",
      desc: "Manage job listings.",
      href: "/admin/dashboard/careers",
    },
    {
      title: "Contact Leads",
      desc: "View user contact submissions.",
      href: "/admin/dashboard/contact",
    },
    {
      title: "Distributors Manager",
      desc: "Manage distributor data.",
      href: "/admin/dashboard/distributors",
    },
    {
      title: "Resources Manager",
      desc: "Edit PDF, images, and resource content.",
      href: "/admin/dashboard/resources",
    },
    {
      title: "Services Manager",
      desc: "Edit initiatives/services pages.",
      href: "/admin/dashboard/services",
    },
    {
      title: "About Page Editor",
      desc: "Edit the About Us page.",
      href: "/admin/dashboard/about",
    },
  ];

  return (
    <div className="space-y-6 animate-fadeUp">
      <h1 className="text-3xl font-bold">Welcome, Admin!</h1>
      <p className="text-muted-foreground">Manage the entire website from one place.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {cards.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="
              p-6 border rounded-xl bg-card shadow-sm 
              hover:shadow-md hover:-translate-y-1 transition-all
              cursor-pointer block
            "
          >
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

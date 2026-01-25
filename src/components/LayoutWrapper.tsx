"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import Footer from "./footer";

export default function LayoutWrapper({ children, footer }: any) {
  const pathname = usePathname();

  // hide navbar + footer inside admin pages
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}

      {children}

      {!isAdmin && <Footer footer={footer} />}
    </>
  );
}

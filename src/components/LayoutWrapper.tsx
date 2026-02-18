"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import Footer from "./footer";
import PageTransition from "./layout/PageTransition";

export default function LayoutWrapper({ children, footer }: any) {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}

      {isAdmin ? children : <PageTransition key={pathname}>{children}</PageTransition>}

      {!isAdmin && <Footer footer={footer} />}
    </>
  );
}

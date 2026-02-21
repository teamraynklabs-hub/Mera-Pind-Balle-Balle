"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageTransition from "@/components/layout/PageTransition";

export default function LayoutWrapper({ children, footer }: { children: React.ReactNode; footer?: any }) {
  const pathname = usePathname();

  return (
    <>
      <Navbar />
      <PageTransition key={pathname}>{children}</PageTransition>
      <Footer footer={footer} />
    </>
  );
}

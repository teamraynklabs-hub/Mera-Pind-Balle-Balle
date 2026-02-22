"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageTransition from "@/components/layout/PageTransition";

export default function LayoutWrapper({
  children,
  footerData,
}: {
  children: React.ReactNode;
  footerData?: any;
}) {
  const pathname = usePathname();

  return (
    <>
      <Navbar />
      <PageTransition key={pathname}>{children}</PageTransition>
      <Footer initialData={footerData} />
    </>
  );
}

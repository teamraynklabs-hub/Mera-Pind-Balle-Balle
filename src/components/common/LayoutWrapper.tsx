"use client";

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
  return (
    <>
      <Navbar />
      <PageTransition>{children}</PageTransition>
      <Footer initialData={footerData} />
    </>
  );
}

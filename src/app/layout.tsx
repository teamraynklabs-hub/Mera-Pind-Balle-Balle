import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: "Mera Pind Balle Balle - Rural Women Empowerment Web Application",
  icons: {
    icon: "/favicon.svg",
  },
  description:
    "A digital web application designed to support rural women entrepreneurs with training, production tracking, sales management, finance monitoring, and community development. It helps villages grow faster with real-time insights, easy navigation, and scalable digital tools.",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >

          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}

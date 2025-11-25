import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Mera Pind Balle Balle – Rural Women Empowerment Web Application",
  description:
    "A digital web application designed to support rural women entrepreneurs with training, production tracking, sales management, finance monitoring, and community development. It helps villages grow faster with real-time insights, easy navigation, and scalable digital tools.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

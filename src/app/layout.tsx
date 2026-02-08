import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import LayoutWrapper from "@/components/LayoutWrapper";
import { AuthSessionProvider } from "@/components/AuthSessionProvider";
import { connectDB } from "@/lib/db";
import Dashboard from "@/lib/models/Dashboard.model";

await connectDB();
const dashboard = await Dashboard.findOne({ isActive: true }).lean();
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Mera Pind Balle Balle - Rural Women Empowerment",
    template: "%s | Mera Pind Balle Balle",
  },
  description:
    "A digital web application designed to support rural women entrepreneurs with training, production tracking, sales management, finance monitoring, and community development. It helps villages grow faster with real-time insights, easy navigation, and scalable digital tools.",
  keywords: [
    "rural empowerment",
    "women entrepreneurs",
    "village development",
    "sustainable development",
    "India",
  ],
  authors: [{ name: "Mera Pind Balle Balle", url: baseUrl }],
  creator: "Mera Pind Balle Balle",
  publisher: "Mera Pind Balle Balle",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: baseUrl,
    title: "Mera Pind Balle Balle - Rural Women Empowerment",
    description:
      "A digital web application designed to support rural women entrepreneurs with training, production tracking, sales management, finance monitoring, and community development.",
    siteName: "Mera Pind Balle Balle",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Mera Pind Balle Balle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mera Pind Balle Balle - Rural Women Empowerment",
    description:
      "A digital web application designed to support rural women entrepreneurs with training, production tracking, sales management, finance monitoring, and community development.",
    images: [`${baseUrl}/og-image.png`],
    creator: "@MeraPindBalleBalle",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  alternates: {
    canonical: baseUrl,
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      
      <body>
        <AuthSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LayoutWrapper footer={dashboard?.footer}>{children}</LayoutWrapper>
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}

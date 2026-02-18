import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import LayoutWrapper from "@/components/LayoutWrapper";
import { AuthSessionProvider } from "@/components/AuthSessionProvider";
import { CartProvider } from "@/context/CartContext";
import { UserAuthProvider } from "@/context/UserAuthContext";
import { connectDB } from "@/lib/db";
import Dashboard from "@/lib/models/Dashboard.model";


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


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  await connectDB();
  const dashboardDoc = await Dashboard.findOne({ isActive: true }).lean();
  const dashboard = dashboardDoc
    ? JSON.parse(JSON.stringify(dashboardDoc))
    : null;
    
  return (
    <html lang="en" suppressHydrationWarning>

      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${baseUrl}/#organization`,
                  name: "Mera Pind Balle Balle",
                  url: baseUrl,
                  logo: {
                    "@type": "ImageObject",
                    url: `${baseUrl}/favicon.svg`,
                  },
                  description:
                    "A rural women empowerment initiative providing training, sustainable products, and community development across Indian villages.",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "A-702, Mahindra Apartments, Vikaspuri",
                    addressLocality: "New Delhi",
                    addressRegion: "Delhi",
                    postalCode: "110018",
                    addressCountry: "IN",
                  },
                  contactPoint: {
                    "@type": "ContactPoint",
                    telephone: "+91-90411-42411",
                    email: "contact@merapindballeballe.com",
                    contactType: "customer service",
                  },
                  sameAs: [],
                },
                {
                  "@type": "WebSite",
                  "@id": `${baseUrl}/#website`,
                  url: baseUrl,
                  name: "Mera Pind Balle Balle",
                  publisher: { "@id": `${baseUrl}/#organization` },
                  inLanguage: "en-IN",
                },
              ],
            }),
          }}
        />
        <AuthSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <UserAuthProvider>
              <CartProvider>
                <LayoutWrapper footer={dashboard?.footer}>{children}</LayoutWrapper>
              </CartProvider>
            </UserAuthProvider>
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}

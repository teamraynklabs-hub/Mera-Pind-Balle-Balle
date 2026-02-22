import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthSessionProvider } from "@/components/providers/AuthSessionProvider";
import { CartProvider } from "@/context/CartContext";
import { UserAuthProvider } from "@/context/UserAuthContext";


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
                    width: 512,
                    height: 512,
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
                    availableLanguage: ["English", "Hindi"],
                  },
                  sameAs: [
                    "https://www.facebook.com/merapindballeballe",
                    "https://www.instagram.com/merapindballeballe",
                    "https://twitter.com/MeraPindBB",
                    "https://www.youtube.com/@merapindballeballe",
                    "https://www.linkedin.com/company/merapindballeballe",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": `${baseUrl}/#website`,
                  url: baseUrl,
                  name: "Mera Pind Balle Balle",
                  publisher: { "@id": `${baseUrl}/#organization` },
                  inLanguage: "en-IN",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate: `${baseUrl}/products?search={search_term_string}`,
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "SiteNavigationElement",
                  "@id": `${baseUrl}/#navigation`,
                  name: "Main Navigation",
                  hasPart: [
                    { "@type": "SiteNavigationElement", name: "Home", url: baseUrl },
                    { "@type": "SiteNavigationElement", name: "About", url: `${baseUrl}/about` },
                    { "@type": "SiteNavigationElement", name: "Products", url: `${baseUrl}/products` },
                    { "@type": "SiteNavigationElement", name: "Blog", url: `${baseUrl}/blog` },
                    { "@type": "SiteNavigationElement", name: "Stories", url: `${baseUrl}/stories` },
                    { "@type": "SiteNavigationElement", name: "Contact", url: `${baseUrl}/contact` },
                    { "@type": "SiteNavigationElement", name: "Careers", url: `${baseUrl}/careers` },
                    { "@type": "SiteNavigationElement", name: "Distributors", url: `${baseUrl}/distributors` },
                  ],
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
                {children}
              </CartProvider>
            </UserAuthProvider>
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}

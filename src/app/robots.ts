import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/products", "/blog", "/stories", "/about", "/services", "/contact", "/careers", "/distributors", "/resources"],
        disallow: ["/admin", "/admin-login", "/api", "/cart", "/checkout", "/order-success", "/login", "/signup"],
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

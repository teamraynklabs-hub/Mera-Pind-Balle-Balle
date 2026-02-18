const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function breadcrumbForPage(pageName: string, pagePath: string) {
  return buildBreadcrumbJsonLd([
    { name: "Home", url: baseUrl },
    { name: pageName, url: `${baseUrl}${pagePath}` },
  ]);
}

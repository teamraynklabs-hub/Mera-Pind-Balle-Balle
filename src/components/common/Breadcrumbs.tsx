import { buildBreadcrumbJsonLd } from "@/lib/seo";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const jsonLdItems = [
    { name: "Home", url: baseUrl },
    ...items.map((item) => ({
      name: item.label,
      url: item.href ? `${baseUrl}${item.href}` : baseUrl,
    })),
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildBreadcrumbJsonLd(jsonLdItems)),
      }}
    />
  );
}

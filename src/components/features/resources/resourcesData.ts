export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  fileType: string;
  size: string;
  date: string;
  fileUrl: string;
}

export const DUMMY_RESOURCES: Resource[] = [
  {
    id: "1",
    title: "Product Catalog 2026",
    description:
      "Complete catalog of our handcrafted product collection featuring artisan-made textiles, pottery, and home decor.",
    category: "Catalog",
    fileType: "pdf",
    size: "12.5 MB",
    date: "February 2026",
    fileUrl: "#",
  },
  {
    id: "2",
    title: "Artisan Stories Collection",
    description:
      "Inspiring stories from our artisan community — meet the hands behind the craft.",
    category: "Stories",
    fileType: "pdf",
    size: "8.2 MB",
    date: "January 2026",
    fileUrl: "#",
  },
  {
    id: "3",
    title: "Care & Maintenance Guide",
    description:
      "How to care for your handcrafted products to preserve their beauty and longevity.",
    category: "Guide",
    fileType: "pdf",
    size: "2.1 MB",
    date: "December 2025",
    fileUrl: "#",
  },
  {
    id: "4",
    title: "Traditional Craft Techniques",
    description:
      "Educational material covering ancient weaving, dyeing, and embroidery techniques passed down through generations.",
    category: "Education",
    fileType: "pdf",
    size: "15.3 MB",
    date: "November 2025",
    fileUrl: "#",
  },
  {
    id: "5",
    title: "Artisan Workshop Video",
    description:
      "Behind-the-scenes look at how our artisans create beautiful handcrafted products.",
    category: "Video",
    fileType: "video",
    size: "245 MB",
    date: "January 2026",
    fileUrl: "#",
  },
  {
    id: "6",
    title: "Brand Guidelines",
    description:
      "Official brand identity guidelines including logo usage, color palette, and typography standards.",
    category: "Brand",
    fileType: "pdf",
    size: "5.8 MB",
    date: "October 2025",
    fileUrl: "#",
  },
  {
    id: "7",
    title: "Annual Impact Report 2025",
    description:
      "Comprehensive report on our social impact, sustainability metrics, and community development efforts.",
    category: "Report",
    fileType: "pdf",
    size: "18.7 MB",
    date: "January 2026",
    fileUrl: "#",
  },
  {
    id: "8",
    title: "Wholesale Catalog",
    description:
      "Bulk ordering catalog with pricing tiers for retailers and wholesale buyers.",
    category: "Catalog",
    fileType: "pdf",
    size: "9.4 MB",
    date: "December 2025",
    fileUrl: "#",
  },
  {
    id: "9",
    title: "Sustainability Report",
    description:
      "Our environmental practices, eco-friendly materials, and carbon footprint reduction initiatives.",
    category: "Report",
    fileType: "pdf",
    size: "6.2 MB",
    date: "November 2025",
    fileUrl: "#",
  },
  {
    id: "10",
    title: "Phulkari Embroidery Tutorial",
    description:
      "Step-by-step video tutorial on the traditional Phulkari embroidery technique from Punjab.",
    category: "Video",
    fileType: "video",
    size: "180 MB",
    date: "October 2025",
    fileUrl: "#",
  },
  {
    id: "11",
    title: "Village Heritage Stories",
    description:
      "A curated collection of heritage stories from the villages our artisans call home.",
    category: "Stories",
    fileType: "pdf",
    size: "7.1 MB",
    date: "September 2025",
    fileUrl: "#",
  },
  {
    id: "12",
    title: "Natural Dye Workshop Guide",
    description:
      "Learn about organic and natural dyeing methods used in our handcrafted textiles.",
    category: "Education",
    fileType: "pdf",
    size: "4.5 MB",
    date: "August 2025",
    fileUrl: "#",
  },
];

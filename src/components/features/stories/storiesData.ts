/**
 * Temporary frontend mock data for Stories page.
 * Replace with actual backend data when GET /api/stories returns
 * name, location, and featured fields.
 */

export interface StoryItem {
  id: string;
  slug: string;
  name: string;
  location: string;
  title: string;
  excerpt: string;
  image: string;
  featured: boolean;
}

export const MOCK_STORIES: StoryItem[] = [
  {
    id: "1",
    slug: "sunitas-bamboo-revolution",
    name: "Sunita Devi",
    location: "Assam, Northeast India",
    title: "Sunita's Bamboo Revolution",
    excerpt:
      "How one woman turned humble bamboo into beautiful home decor and created jobs in her village. Starting with just a few tools and traditional knowledge passed down from her grandmother, Sunita now leads a cooperative of 40 women artisans producing eco-friendly bamboo products.",
    image: "/photo1.png",
    featured: true,
  },
  {
    id: "2",
    slug: "radhas-natural-skincare-legacy",
    name: "Radha Sharma",
    location: "Manali, Himachal Pradesh",
    title: "Radha's Natural Skincare Legacy",
    excerpt:
      "Three generations of women preserving traditional beauty recipes and building a sustainable business. Radha's grandmother's herbal formulas now reach thousands of homes.",
    image: "/photo2.png",
    featured: false,
  },
  {
    id: "3",
    slug: "meeras-clay-creations-art-from-earth",
    name: "Meera Patel",
    location: "Kutch, Gujarat",
    title: "Meera's Clay Creations: Art from the Earth",
    excerpt:
      "A young widow found hope and purpose through terracotta jewelry making. Her intricate designs now sell across India, supporting her two children's education.",
    image: "/photo3.png",
    featured: false,
  },
  {
    id: "4",
    slug: "lakshmis-journey-from-village-to-empowerment",
    name: "Lakshmi Devi",
    location: "Barmer, Rajasthan",
    title: "Lakshmi's Journey: From Village to Empowerment",
    excerpt:
      "How a 35-year-old mother of three transformed her family's future through traditional weaving. Lakshmi's block-printed fabrics tell stories of Rajasthan's vibrant culture.",
    image: "/photo4.png",
    featured: false,
  },
  {
    id: "5",
    slug: "priya-organic-spice-trail",
    name: "Priya Kumari",
    location: "Wayanad, Kerala",
    title: "Priya's Organic Spice Trail",
    excerpt:
      "From a small spice garden to an organic farming collective employing 25 women. Priya proved that sustainable agriculture can be both profitable and empowering.",
    image: "/photo5.png",
    featured: false,
  },
  {
    id: "6",
    slug: "anitas-embroidery-empire",
    name: "Anita Bai",
    location: "Lucknow, Uttar Pradesh",
    title: "Anita's Embroidery Empire",
    excerpt:
      "Reviving the dying art of Chikankari embroidery while training the next generation. Anita's workshop is now a beacon of hope for 60 women artisans.",
    image: "/photo6.png",
    featured: false,
  },
];

export interface ImpactItem {
  icon: string;
  title: string;
  description: string;
}

/**
 * Temporary frontend mock data for impact section.
 * Replace with backend data when GET /api/story-impact exists.
 */
export const MOCK_IMPACT: ImpactItem[] = [
  {
    icon: "fair-wages",
    title: "Fair Wages",
    description:
      "Artisans receive 3-5x more than traditional middlemen would pay them",
  },
  {
    icon: "independence",
    title: "Economic Independence",
    description:
      "Women gain financial autonomy and decision-making power in their households",
  },
  {
    icon: "heritage",
    title: "Heritage Preservation",
    description:
      "Traditional crafts and techniques are kept alive for future generations",
  },
];

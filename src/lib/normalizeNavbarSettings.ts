export const NAVBAR_SEED_DATA = {
  brandName: "Mera Pind Balle Balle",
  logoUrl: "/logo.jpeg",
  navLinks: [
    { title: "Home", href: "/", isVisible: true },
    { title: "About Us", href: "/about", isVisible: true },
    { title: "Products", href: "/products", isVisible: true },
    { title: "Blog", href: "/blog", isVisible: true },
    { title: "Stories", href: "/stories", isVisible: true },
    { title: "Contact", href: "/contact", isVisible: true },
  ],
  showCart: true,
  showLogin: true,
  showThemeToggle: true,
};

export function normalizeNavbarSettings(raw: any) {
  if (!raw) return null;

  const seed = NAVBAR_SEED_DATA;

  return {
    brandName: raw.brandName || seed.brandName,
    logoUrl: raw.logoUrl || seed.logoUrl,
    navLinks: Array.isArray(raw.navLinks)
      ? raw.navLinks.map((l: any) => ({
          title: l.title || "",
          href: l.href || "/",
          isVisible: l.isVisible !== false,
        }))
      : seed.navLinks,
    showCart: raw.showCart !== false,
    showLogin: raw.showLogin !== false,
    showThemeToggle: raw.showThemeToggle !== false,
  };
}

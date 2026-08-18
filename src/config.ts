export const siteConfig = {
  name: "Directory",
  shortName: "DIR",
  description:
    "An independent directory for discovering and comparing established adult websites by category.",
  locale: "en",
  contactEmail: "hello@example.com",
  maxHomeSitesPerCategory: 12,
  legalNotice:
    "This website is intended only for adults who are at least 18 years old or the age of majority in their location."
} as const;

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/categories/", label: "Categories" },
  { href: "/search/", label: "Search" },
  { href: "/about/", label: "About" }
] as const;

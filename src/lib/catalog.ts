import categoriesJson from "../data/categories.json";
import sitesJson from "../data/sites.json";
import type { Category, DirectorySite } from "../types";

export const categories = [...(categoriesJson as Category[])].sort(
  (a, b) => a.order - b.order
);

export const sites = [...(sitesJson as DirectorySite[])].sort((a, b) => {
  if (a.rank !== b.rank) return a.rank - b.rank;
  return a.name.localeCompare(b.name);
});

export const categoryBySlug = new Map(
  categories.map((category) => [category.slug, category])
);

export const siteBySlug = new Map(sites.map((site) => [site.slug, site]));

export function getCategorySites(categorySlug: string) {
  return sites
    .filter((site) => site.categories.includes(categorySlug))
    .sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));
}

export function getCategoryCount(categorySlug: string) {
  return getCategorySites(categorySlug).length;
}

export function getRelatedSites(site: DirectorySite, limit = 4) {
  return sites
    .filter(
      (candidate) =>
        candidate.slug !== site.slug &&
        candidate.categories.some((slug) => site.categories.includes(slug))
    )
    .sort((a, b) => {
      const aOverlap = a.categories.filter((slug) => site.categories.includes(slug)).length;
      const bOverlap = b.categories.filter((slug) => site.categories.includes(slug)).length;
      return bOverlap - aOverlap || a.rank - b.rank;
    })
    .slice(0, limit);
}


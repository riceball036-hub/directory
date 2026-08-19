import { categories, sites } from "../lib/catalog";
import { withBase } from "../lib/urls";

export const prerender = true;

export function GET({ site }: { site: URL }) {
  const reviewPageCount = Math.ceil(sites.length / 6);
  const paths = [
    "/",
    "/reviews/",
    ...Array.from({ length: Math.max(0, reviewPageCount - 1) }, (_, index) => `/reviews/${index + 2}/`),
    "/about/",
    "/legal/terms/",
    "/legal/privacy/",
    "/legal/copyright/",
    ...categories.map((category) => `/categories/${category.slug}/`),
    ...sites.map((entry) => `/sites/${entry.slug}/`)
  ];
  const urls = paths
    .map((path) => `<url><loc>${new URL(withBase(path), site).href}</loc></url>`)
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}

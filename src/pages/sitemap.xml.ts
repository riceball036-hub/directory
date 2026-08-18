import { categories, sites } from "../lib/catalog";
import { withBase } from "../lib/urls";

export const prerender = true;

export function GET({ site }: { site: URL }) {
  const paths = [
    "/",
    "/categories/",
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

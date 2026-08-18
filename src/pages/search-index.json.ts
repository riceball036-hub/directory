import { categories, sites } from "../lib/catalog";

export const prerender = true;

export function GET() {
  const categoryNames = new Map(categories.map((category) => [category.slug, category.name]));
  const payload = sites.map((site) => ({
    slug: site.slug,
    name: site.name,
    description: site.description,
    pricing: site.pricing,
    tags: site.tags,
    categories: site.categories.map((slug) => categoryNames.get(slug) || slug)
  }));

  return new Response(JSON.stringify(payload), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400"
    }
  });
}


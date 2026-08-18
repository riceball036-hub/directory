import { readFile } from "node:fs/promises";

const categories = JSON.parse(await readFile(new URL("../src/data/categories.json", import.meta.url), "utf8"));
const sites = JSON.parse(await readFile(new URL("../src/data/sites.json", import.meta.url), "utf8"));
const errors = [];
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function duplicates(values) {
  const seen = new Set();
  return values.filter((value) => seen.size === seen.add(value).size);
}

const categorySlugs = new Set(categories.map((category) => category.slug));

for (const slug of duplicates(categories.map((category) => category.slug))) errors.push(`Duplicate category slug: ${slug}`);
for (const slug of duplicates(sites.map((site) => site.slug))) errors.push(`Duplicate site slug: ${slug}`);

for (const category of categories) {
  if (!slugPattern.test(category.slug)) errors.push(`Invalid category slug: ${category.slug}`);
  if (!category.name || !category.description || !category.intro) errors.push(`Incomplete category: ${category.slug}`);
  if (!Number.isInteger(category.order) || category.order < 1) errors.push(`Invalid category order: ${category.slug}`);
}

for (const site of sites) {
  if (!slugPattern.test(site.slug)) errors.push(`Invalid site slug: ${site.slug}`);
  if (!site.name || !site.description || !site.review) errors.push(`Incomplete site: ${site.slug}`);
  if (!Array.isArray(site.categories) || site.categories.length === 0) errors.push(`Missing categories: ${site.slug}`);
  for (const category of site.categories || []) {
    if (!categorySlugs.has(category)) errors.push(`Unknown category '${category}' on ${site.slug}`);
  }
  if (!Number.isInteger(site.rank) || site.rank < 1) errors.push(`Invalid rank on ${site.slug}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(site.verifiedAt)) errors.push(`Invalid verifiedAt on ${site.slug}`);
  try {
    const parsed = new URL(site.url);
    if (parsed.protocol !== "https:") errors.push(`Non-HTTPS URL on ${site.slug}`);
  } catch {
    errors.push(`Invalid URL on ${site.slug}`);
  }
}

if (errors.length) {
  console.error(`Catalog validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Catalog valid: ${categories.length} categories, ${sites.length} sites.`);


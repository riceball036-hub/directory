import { readFile, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: npm run import:csv -- ./path/to/sites.csv");
  process.exit(1);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const next = text[index + 1];
    if (character === '"' && quoted && next === '"') {
      field += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(field.trim());
      field = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && next === "\n") index += 1;
      row.push(field.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }
  row.push(field.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const source = await readFile(resolve(inputPath), "utf8");
const [header, ...rows] = parseCsv(source.replace(/^\uFEFF/, ""));
const normalizedHeader = header.map((column) => column.toLowerCase().trim());
const nameIndex = normalizedHeader.findIndex((column) => ["website name", "name"].includes(column));
const urlIndex = normalizedHeader.indexOf("url");
const categoryIndex = normalizedHeader.findIndex((column) => ["category", "categories"].includes(column));

if ([nameIndex, urlIndex, categoryIndex].some((index) => index < 0)) {
  console.error("CSV must contain Website Name, URL, and Category columns.");
  process.exit(1);
}

const categories = JSON.parse(await readFile(new URL("../src/data/categories.json", import.meta.url), "utf8"));
const categoryLookup = new Map(categories.flatMap((category) => [
  [category.name.toLowerCase(), category.slug],
  [category.shortName.toLowerCase(), category.slug],
  [category.slug.toLowerCase(), category.slug]
]));

const sites = rows.map((row, index) => {
  const name = row[nameIndex]?.trim();
  const categoryNames = (row[categoryIndex] || "").split("|").map((value) => value.trim()).filter(Boolean);
  const matchedCategories = categoryNames.map((value) => categoryLookup.get(value.toLowerCase())).filter(Boolean);
  if (!name || !row[urlIndex]) throw new Error(`Missing name or URL on CSV row ${index + 2}`);
  if (matchedCategories.length === 0) throw new Error(`No matching category on CSV row ${index + 2}: ${categoryNames.join(" | ")}`);
  return {
    slug: slugify(name),
    name,
    url: row[urlIndex].trim(),
    description: `Editorial summary pending for ${name}.`,
    review: `Full original review pending for ${name}.`,
    categories: [...new Set(matchedCategories)],
    tags: ["Review pending"],
    pricing: "Freemium",
    rank: index + 1,
    featured: false,
    verifiedAt: new Date().toISOString().slice(0, 10),
    linkRel: "noopener noreferrer nofollow"
  };
});

const outputUrl = new URL("../src/data/sites.json", import.meta.url);
await writeFile(outputUrl, `${JSON.stringify(sites, null, 2)}\n`, "utf8");
console.log(`Imported ${sites.length} sites from ${basename(inputPath)}.`);


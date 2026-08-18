# Directory

An original, data-driven adult website directory framework built with Astro. It borrows the useful information architecture of large directory sites—category discovery, short editorial summaries, ranked lists, detail pages, and search—without copying another site's branding, text, assets, or layout.

The repository currently uses `Directory` as a working brand and `example.com` as the placeholder domain. Both are centralized and easy to replace before launch.

## Included

- Static homepage with featured categories and ranked site cards
- Full category index and generated category pages
- Generated detail page for every directory entry
- Lazy-loaded client-side search index
- 18+ confirmation dialog stored locally in the visitor's browser
- Responsive navigation, horizontal category rails, and back-to-top progress control
- Canonical URLs, Open Graph metadata, JSON-LD, robots.txt, and generated sitemap
- Data validation for duplicate slugs, invalid URLs, missing categories, and bad ranks
- CSV importer for the existing `Website Name, URL, Category` spreadsheet format
- Cloudflare Pages-compatible static output with no server adapter required

## Local setup

```bash
nvm use
npm install
cp .env.example .env
npm run dev
```

Before production, set `SITE_URL` to the final HTTPS origin.
Set `BASE_PATH` only when the site is hosted below a subpath, such as `/directory` on GitHub Pages.

## Commands

```bash
npm run validate:data
npm run check
npm run build
npm run preview
```

## Catalog data

The site is generated from two files:

- `src/data/categories.json`
- `src/data/sites.json`

The included records are clearly marked demo entries and use `example.com`. Replace them with real, reviewed data before launch.

### Import a CSV export

Export the spreadsheet as UTF-8 CSV with these columns:

```text
Website Name,URL,Category
```

Categories may contain multiple values separated by `|`. Run:

```bash
npm run import:csv -- ./path/to/sites.csv
```

The importer matches category names to the existing category slugs and writes a normalized `src/data/sites.json`. Review the diff and run `npm run validate:data` before committing.

## Cloudflare Pages

- Framework preset: `Astro`
- Build command: `npm run build`
- Output directory: `dist`
- Node.js: `22.12.0` or newer supported even-numbered release
- Environment variable: `SITE_URL=https://your-domain.example`

## GitHub Pages

The included Pages workflow deploys every push to `main`. For this repository, the production values are:

- Site origin: `https://riceball036-hub.github.io`
- Base path: `/directory`
- Public URL: `https://riceball036-hub.github.io/directory/`

In the repository settings, select **Pages → Build and deployment → Source → GitHub Actions** once. Later pushes deploy automatically.

## Before launch

1. Replace the working brand and contact address in `src/config.ts`.
2. Set the final `SITE_URL` in Cloudflare Pages.
3. Replace all demo records and verify every outbound URL.
4. Replace placeholder legal copy with text reviewed for the target market.
5. Add only licensed logos or use text/initial marks.
6. Decide which links are editorial, affiliate, or sponsored and set each record's `linkRel` accurately.
7. Run the complete validation and build commands.

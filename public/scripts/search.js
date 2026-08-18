/**
 * @typedef {object} SearchEntry
 * @property {string} slug
 * @property {string} name
 * @property {string} url
 * @property {string} linkRel
 * @property {string} description
 * @property {string} pricing
 * @property {string[]} tags
 * @property {string[]} categories
 */

const form = document.querySelector("[data-search-form]");
const input = document.querySelector("[data-search-input]");
const resultsNode = document.querySelector("[data-search-results]");
const statusNode = document.querySelector("[data-search-status]");

if (
  form instanceof HTMLFormElement &&
  input instanceof HTMLInputElement &&
  resultsNode instanceof HTMLElement &&
  statusNode instanceof HTMLElement
) {
  const searchForm = form;
  const searchInput = input;
  const searchResults = resultsNode;
  const searchStatus = statusNode;
  /** @type {Promise<SearchEntry[]> | undefined} */
  let catalogPromise;

  /** @param {string} value */
  function escapeHtml(value) {
    /** @type {Record<string, string>} */
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    };
    return value.replace(/[&<>'"]/g, (character) => entities[character]);
  }

  function getCatalog() {
    if (!catalogPromise) {
      catalogPromise = fetch("/search-index.json").then(async (response) => {
        if (!response.ok) throw new Error("Search index unavailable");
        return /** @type {Promise<SearchEntry[]>} */ (response.json());
      });
    }
    return catalogPromise;
  }

  /** @param {SearchEntry} entry @param {string} query */
  function scoreEntry(entry, query) {
    const name = entry.name.toLowerCase();
    const haystack = [entry.description, entry.pricing, ...entry.tags, ...entry.categories]
      .join(" ")
      .toLowerCase();
    if (name === query) return 100;
    if (name.startsWith(query)) return 70;
    if (name.includes(query)) return 50;
    if (haystack.includes(query)) return 20;
    return 0;
  }

  /** @param {string} rawQuery */
  async function runSearch(rawQuery) {
    const query = rawQuery.trim().toLowerCase();
    const url = new URL(window.location.href);

    if (!query) {
      url.searchParams.delete("q");
      history.replaceState({}, "", url);
      searchResults.innerHTML = "";
      searchStatus.textContent = "Enter a term to search the catalog.";
      return;
    }

    url.searchParams.set("q", rawQuery.trim());
    history.replaceState({}, "", url);
    searchStatus.textContent = "Searching…";

    try {
      const catalog = await getCatalog();
      const matches = catalog
        .map((entry) => ({ entry, score: scoreEntry(entry, query) }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name))
        .slice(0, 100);

      searchStatus.textContent = `${matches.length} ${matches.length === 1 ? "result" : "results"} for “${rawQuery.trim()}”.`;
      searchResults.innerHTML = matches.map(({ entry }) => `
        <article class="search-result">
          <div>
            <span class="price-chip price-${entry.pricing.toLowerCase()}">${escapeHtml(entry.pricing)}</span>
            <h2 class="search-result-title">
              <a href="${escapeHtml(entry.url)}" target="_blank" rel="${escapeHtml(entry.linkRel)}">${escapeHtml(entry.name)} ↗</a>
              <a class="review-mini" href="/sites/${encodeURIComponent(entry.slug)}/">Review</a>
            </h2>
            <p>${escapeHtml(entry.description)}</p>
            <small>${entry.categories.map(escapeHtml).join(" · ")}</small>
          </div>
          <a class="outbound-link" href="${escapeHtml(entry.url)}" target="_blank" rel="${escapeHtml(entry.linkRel)}">Visit site →</a>
        </article>
      `).join("");
    } catch {
      searchStatus.textContent = "Search could not be loaded. Please try again.";
      searchResults.innerHTML = "";
    }
  }

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    runSearch(searchInput.value);
  });

  const initialQuery = new URL(window.location.href).searchParams.get("q") || "";
  if (initialQuery) {
    searchInput.value = initialQuery;
    runSearch(initialQuery);
  }
}

import { withBase } from "../lib/urls";

export const prerender = true;

export function GET({ site }: { site: URL }) {
  const body = `User-agent: *\nAllow: ${withBase("/")}\n\nSitemap: ${new URL(withBase("/sitemap.xml"), site).href}\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

import type { APIRoute } from "astro";

const getRobotsTxt = (sitemapURL: URL) => `
User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  try {
    const sitemapURL = new URL("sitemap-index.xml", site);
    return new Response(getRobotsTxt(sitemapURL));
  } catch (e) {
    // If URL creation fails, create a fallback response
    console.warn("Error creating sitemap URL. Using placeholder.", e);
    return new Response(`
User-agent: *
Allow: /

Sitemap: /sitemap-index.xml
    `);
  }
};

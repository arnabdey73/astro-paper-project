import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import vercel from "@astrojs/vercel/static";
import { SITE } from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  output: "static",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
    imageService: true,
  }),
  integrations: [
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
  ],
  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "night-owl" },
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  experimental: {
    assets: true
  },
  image: {
    service: { 
      entrypoint: 'astro/assets/services/sharp'
    },
    domains: ["blog.arnabdey.dev"],
    remotePatterns: [{ protocol: "https" }]
  },
});

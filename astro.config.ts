import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import vercel from "@astrojs/vercel";
import react from "@astrojs/react";
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
  // Configure image handling
  image: {
    domains: ["blog.arnabdey.dev"],
    remotePatterns: [{ protocol: "https" }],
  },
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    sitemap(),
    react(),
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    }
  },
});

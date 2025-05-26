import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import vercel from "@astrojs/vercel";
import react from "@astrojs/react";
import { SITE } from "./src/config";
// Explicitly use the Vercel image service for optimization
import vercelImageService from "@astrojs/vercel/image-service";

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
  // Explicitly disable built-in image optimization for /assets/images/
  image: {
    domains: ["blog.arnabdey.dev"],
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

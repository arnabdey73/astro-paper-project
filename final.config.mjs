// Simple, optimized configuration that works with Astro v5.11.0
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import { SITE } from "./src/config";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  output: "static",
  
  // Image config
  image: {
    domains: ["blog.arnabdey.dev"],
    remotePatterns: [{ protocol: "https" }]
  },
  
  // Basic integrations
  integrations: [
    tailwind({
      applyBaseStyles: false
    })
  ],
  
  // Markdown config
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
  }
});

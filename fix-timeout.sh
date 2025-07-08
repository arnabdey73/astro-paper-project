#!/bin/bash

# This script fixes the SSR timeout issue in the AstroPaper project
# by implementing optimizations identified during debugging

# Backup the original config if it doesn't exist
if [ ! -f "astro.config.ts.backup" ]; then
  cp astro.config.ts astro.config.ts.backup
  echo "✅ Original configuration backed up to astro.config.ts.backup"
fi

# Create an optimized configuration with increased timeout and modified plugins
cat > astro.config.ts << EOL
import { defineConfig } from "astro";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap(),
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
    },
    extendDefaultPlugins: true,
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
    ssr: {
      // Increase timeout to prevent SSR timeouts
      timeout: 120000,
      // Prevent potential hang for file operations
      noExternal: ["@astrojs/markdoc", "react-icons"]
    },
    build: {
      // Add specific build optimizations 
      rollupOptions: {
        // Reduce the number of simultaneous file operations
        maxParallelFileOps: 2,
      }
    },
  },
  // Increase output level for better debugging
  logLevel: "info",
});
EOL

echo "✅ Created optimized astro.config.ts with increased timeout and performance optimizations"

# Create a restoration script for convenience
cat > restore-config.sh << EOL
#!/bin/bash
if [ -f "astro.config.ts.backup" ]; then
  cp astro.config.ts.backup astro.config.ts
  echo "✅ Original astro.config.ts restored"
else
  echo "⚠️ No backup found at astro.config.ts.backup"
fi
EOL

chmod +x restore-config.sh
echo "✅ Created restore-config.sh to revert changes if needed"

echo "🚀 Configuration optimized for preventing SSR timeouts"
echo "Run 'npm run dev' to test, or use './restore-config.sh' to revert changes"

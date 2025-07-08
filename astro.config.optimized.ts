import { defineConfig } from "astro/config";
import { SITE } from "./src/config";

// Lazily load integrations to improve startup performance
const getTailwind = async () => {
  const tailwind = (await import("@astrojs/tailwind")).default;
  return tailwind({ applyBaseStyles: false });
};

const getReact = async () => {
  const react = (await import("@astrojs/react")).default;
  return react();
};

const getSitemap = async () => {
  const sitemap = (await import("@astrojs/sitemap")).default;
  return sitemap();
};

// Lazy-load markdown plugins
const getRemarkPlugins = async () => {
  const remarkToc = (await import("remark-toc")).default;
  const remarkCollapse = (await import("remark-collapse")).default;
  
  return [
    remarkToc,
    [
      remarkCollapse,
      {
        test: "Table of contents",
      },
    ],
  ];
};

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  output: "static",
  integrations: [
    await getTailwind(),
    await getReact(),
    await getSitemap(),
  ],
  markdown: {
    remarkPlugins: await getRemarkPlugins(),
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
  vite: {
    optimizeDeps: {
      // Force prebundling of problematic dependencies
      include: ['@resvg/resvg-js', 'react', 'react-dom'],
    },
    ssr: {
      // Prevent potential hang for file operations by marking packages as external
      noExternal: ["@resvg/resvg-js", "react-icons"]
    },
    build: {
      // Add specific build optimizations
      rollupOptions: {
        // Reduce the number of simultaneous file operations for better stability
        maxParallelFileOps: 3,
        // Improve chunk sizes
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Group node_modules into larger chunks for better performance
              if (id.includes('react')) {
                return 'react-vendor';
              }
              if (id.includes('@astrojs')) {
                return 'astro-vendor';
              }
              return 'vendor';
            }
          }
        }
      },
      // Better source maps
      sourcemap: false,
    },
  },
  // Increase output level for better debugging
  logLevel: "info",
});

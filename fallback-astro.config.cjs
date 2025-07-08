/**
 * Cross-version compatible Astro configuration
 * This file is designed to work with different versions of Astro
 */

// Try both import locations for defineConfig
let defineConfig;
try {
  // For newer Astro versions
  defineConfig = require('astro').defineConfig;
} catch (error) {
  try {
    // For older Astro versions
    defineConfig = require('astro/config').defineConfig;
  } catch (innerError) {
    console.error('Failed to import defineConfig from either astro or astro/config');
    console.error('Please check your Astro installation');
    process.exit(1);
  }
}

// Import safely
const SITE = require('./src/config').SITE;

// Base configuration with minimal dependencies
module.exports = defineConfig({
  site: SITE.website,
  output: "static",
  
  integrations: [],
  
  // Simple, safe defaults
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    }
  }
});

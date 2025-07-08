#!/bin/bash
# Enhanced script to diagnose Astro config timeout issues

# Print system info
echo "=== System Information ==="
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
if command -v pnpm &> /dev/null; then
  echo "PNPM version: $(pnpm -v)"
fi
echo "Operating system: $(uname -a)"
echo "Memory available: $(node -e 'console.log(require("os").totalmem() / 1024 / 1024 / 1024)') GB"

# Check if temp config file exists
if [ -f "./temp-astro.config.ts" ]; then
  echo ""
  echo "=== Starting Diagnosis ==="
  
  # Backup original config if not already backed up
  if [ ! -f "./astro.config.ts.bak" ]; then
    echo "Backing up original config..."
    cp ./astro.config.ts ./astro.config.ts.bak
  fi
  
  echo "Using minimal config for testing..."
  cp ./temp-astro.config.ts ./astro.config.ts
  
  echo ""
  echo "=== Clearing All Cache ==="
  echo "Removing .vite cache..."
  rm -rf ./node_modules/.vite
  echo "Removing .astro cache..."
  rm -rf ./node_modules/.astro
  echo "Removing dist folder..."
  rm -rf ./dist
  echo "Removing .astro build folder..."
  rm -rf ./.astro
  
  echo ""
  echo "=== Starting Dev Server with Minimal Configuration ==="
  echo "If this works without timeouts, the issue is in your original config."
  echo "Press Ctrl+C when you're done testing"
  echo ""
  
  # Run astro with increased memory and verbosity
  NODE_OPTIONS="--max-old-space-size=4096 --no-warnings" ASTRO_TELEMETRY_DISABLED=1 npx astro dev --verbose
else
  echo "Error: Temporary config file not found!"
  echo "Creating a minimal config file for testing..."
  
  # Create a minimal config file
  cat > ./temp-astro.config.ts << 'EOF'
// Ultra-minimal configuration for debugging purposes
import { defineConfig } from "astro/config";
import { SITE } from "./src/config";

// Asynchronously load tailwind to improve startup time
const getTailwind = async () => {
  const tailwind = (await import("@astrojs/tailwind")).default;
  return tailwind({ applyBaseStyles: false });
};

export default defineConfig({
  site: SITE.website,
  output: "static",
  integrations: [await getTailwind()],
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    }
  },
});
EOF
  
  echo "Temporary config file created!"
  echo "Please run this script again to use it."
fi

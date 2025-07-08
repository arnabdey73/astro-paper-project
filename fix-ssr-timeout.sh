#!/bin/bash
# Advanced script to fix Astro SSR timeout issues by iteratively testing configurations

echo "=== Astro SSR Timeout Resolution Tool ==="
echo "This script will test different configurations to fix SSR timeout errors."

# Define color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Creating minimal configuration files...${NC}"

# Create the simplest possible configuration file
cat > ./minimal-astro.config.mjs << 'EOF'
import { defineConfig } from 'astro';

export default defineConfig({
  output: "static"
});
EOF

echo -e "${GREEN}✓ Created minimal ESM config file${NC}"

# Create a backup of the original config if not already backed up
if [ ! -f ./astro.config.ts.original ]; then
  cp ./astro.config.ts ./astro.config.ts.original
  echo -e "${GREEN}✓ Backed up original config to astro.config.ts.original${NC}"
fi

echo -e "${YELLOW}Step 2: Testing minimal config...${NC}"
cp ./minimal-astro.config.mjs ./astro.config.mjs
rm -f ./astro.config.ts 2>/dev/null

# Clear caches
echo -e "${BLUE}Clearing Astro and Vite caches...${NC}"
rm -rf ./.astro ./node_modules/.astro ./node_modules/.vite 2>/dev/null

echo -e "${YELLOW}Running with minimal config (.mjs)...${NC}"
NODE_OPTIONS="--max-old-space-size=4096" npx astro dev --verbose > ./astro-test.log 2>&1 &
ASTRO_PID=$!

# Give it time to start
sleep 5

# Check if it's still running
if kill -0 $ASTRO_PID 2>/dev/null; then
  echo -e "${GREEN}✓ Success! Minimal config works.${NC}"
  kill $ASTRO_PID
  
  echo -e "${YELLOW}Step 3: Creating optimized configuration...${NC}"
  
  # Create an optimized astro.config.mjs with just the essential integrations
  cat > ./astro.config.mjs << 'EOF'
import { defineConfig } from 'astro';
import tailwind from '@astrojs/tailwind';

// No top-level await or async imports
export default defineConfig({
  output: "static",
  integrations: [
    tailwind({
      applyBaseStyles: false
    })
  ],
  markdown: {
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    }
  },
  vite: {
    ssr: {
      noExternal: ['@resvg/resvg-js', 'satori']
    },
    build: {
      minify: 'terser'
    }
  }
});
EOF
  
  echo -e "${GREEN}✓ Created optimized config${NC}"
  echo -e "${YELLOW}Testing optimized configuration...${NC}"
  
  # Clear caches again
  rm -rf ./.astro ./node_modules/.astro ./node_modules/.vite 2>/dev/null
  
  # Run Astro again
  NODE_OPTIONS="--max-old-space-size=4096" npx astro dev --verbose > ./astro-test-optimized.log 2>&1 &
  ASTRO_PID=$!
  
  # Give it time to start
  sleep 5
  
  # Check if it's still running
  if kill -0 $ASTRO_PID 2>/dev/null; then
    echo -e "${GREEN}✓ Success! Optimized config works.${NC}"
    kill $ASTRO_PID
    
    echo -e "${BLUE}=== SOLUTION FOUND ===${NC}"
    echo -e "${GREEN}The fixed configuration is now in astro.config.mjs${NC}"
    echo "You can gradually add back features to this configuration as needed."
    echo "To restore your original config: cp ./astro.config.ts.original ./astro.config.ts"
  else
    echo -e "${RED}✗ Optimized config failed.${NC}"
    echo "Check ./astro-test-optimized.log for details"
    echo "Try removing more integrations or simplifying your config further."
  fi
else
  echo -e "${RED}✗ Even minimal config failed.${NC}"
  echo "Check ./astro-test.log for errors"
  echo "This suggests a deeper issue with your Astro installation."
  echo "Try the following:"
  echo "1. Delete node_modules and reinstall: rm -rf node_modules && npm install"
  echo "2. Ensure you're using a compatible Node.js version"
  echo "3. Check if any global packages might be interfering"
fi

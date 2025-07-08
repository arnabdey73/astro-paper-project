#!/bin/bash
# Emergency script to start Astro with absolute minimal config

echo "=== Astro Emergency Recovery ==="
echo "This script will use an absolute minimal configuration to get Astro running"

# Back up original config if not already done
if [ ! -f ./astro.config.ts.bak ]; then
  echo "Backing up original configuration..."
  cp ./astro.config.ts ./astro.config.ts.bak
fi

# Copy minimal config
echo "Switching to minimal configuration..."
cp ./minimal.config.mjs ./astro.config.mjs

# Rename original file temporarily
mv ./astro.config.ts ./astro.config.ts.tmp

echo "Clearing caches..."
rm -rf ./.astro ./node_modules/.astro ./node_modules/.vite

echo "Starting Astro with minimal configuration..."
echo "Press Ctrl+C when you're done testing"
NODE_OPTIONS='--max-old-space-size=4096 --no-warnings' npx astro dev

# Restore original file
echo "Restoring original configuration..."
mv ./astro.config.ts.tmp ./astro.config.ts

echo "Done!"
echo "If this worked, consider using a simpler configuration file."

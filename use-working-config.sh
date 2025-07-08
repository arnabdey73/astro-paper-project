#!/bin/bash
# Script to switch to a reliable Astro configuration

echo "=== Astro Configuration Fixer ==="

# Back up original config if not already backed up
if [ ! -f ./astro.config.ts.original ]; then
  echo "Backing up original config..."
  cp ./astro.config.ts ./astro.config.ts.original
fi

# Clear caches
echo "Clearing caches..."
rm -rf ./.astro ./node_modules/.astro ./node_modules/.vite

# Use the working final configuration
echo "Switching to working configuration..."
cp ./final.config.mjs ./astro.config.mjs

# Temporarily move the original config
if [ -f ./astro.config.ts ]; then
  mv ./astro.config.ts ./astro.config.ts.disabled
fi

echo "Starting Astro with working configuration..."
echo "Press Ctrl+C when finished"
NODE_OPTIONS='--max-old-space-size=4096' npx astro dev

# Restore original files
echo "Configuration test complete."
read -p "Keep the working configuration? (Y/n): " keep_config
if [[ $keep_config == "n" || $keep_config == "N" ]]; then
  echo "Restoring original configuration..."
  if [ -f ./astro.config.ts.disabled ]; then
    mv ./astro.config.ts.disabled ./astro.config.ts
  fi
  rm ./astro.config.mjs
  echo "Original configuration restored."
else
  echo "Keeping working configuration."
  if [ -f ./astro.config.ts.disabled ]; then
    rm ./astro.config.ts.disabled
  fi
  echo "To permanently use this configuration, rename astro.config.mjs to astro.config.ts"
fi

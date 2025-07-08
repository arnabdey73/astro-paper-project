#!/bin/sh
# verify-build.sh - Run before deploying to verify the build

echo "🔍 Verifying build configuration..."

# Check for optimized config files that might cause conflicts
if [ -f "astro.config.optimized.ts" ]; then
  echo "⚠️  Found astro.config.optimized.ts - this may conflict with main config"
  echo "   Removing conflicting config..."
  rm -f astro.config.optimized.ts
  echo "✅ Removed conflicting config file"
fi

# Ensure TypeScript types are set up correctly
echo "🔄 Running TypeScript check..."
npx tsc --noEmit

# Clean build directories to ensure fresh build
echo "🧹 Cleaning build cache..."
rm -rf dist/ .astro/ node_modules/.vite node_modules/.astro

echo "⚙️ Running build with increased memory..."
NODE_OPTIONS='--max-old-space-size=4096 --no-warnings' npm run build

echo "✅ Build verification complete!"

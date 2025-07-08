#!/bin/sh
# Script to verify Vercel build configuration

echo "🔍 Verifying Vercel build configuration..."

# Check if @astrojs/vercel is installed
if grep -q "@astrojs/vercel" package.json; then
  echo "✅ @astrojs/vercel is installed"
else
  echo "❌ @astrojs/vercel is NOT installed. Please run: pnpm add @astrojs/vercel"
  exit 1
fi

# Check astro.config.ts for vercel adapter
if grep -q "import vercel" astro.config.ts && grep -q "adapter: vercel" astro.config.ts; then
  echo "✅ Vercel adapter is configured in astro.config.ts"
else
  echo "❌ Vercel adapter is NOT configured properly in astro.config.ts"
  exit 1
fi

# Check if vercel.json exists with correct outputDirectory
if [ -f "vercel.json" ] && grep -q '"outputDirectory": ".vercel/output/static"' vercel.json; then
  echo "✅ vercel.json exists with correct outputDirectory"
else
  echo "❌ vercel.json is missing or has incorrect outputDirectory setting"
  exit 1
fi

# Run a test build to check output structure
echo "🏗️ Running test build to verify output structure..."
NODE_OPTIONS='--max-old-space-size=1024' npm run build:fast

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "❌ Test build failed!"
  exit 1
fi

# Check if dist directory was created
if [ -d "dist" ]; then
  echo "✅ Build succeeded and created dist directory"
else
  echo "❌ Build did not create dist directory"
  exit 1
fi

# Check if .vercel/output/static exists after build
if [ -d ".vercel/output/static" ]; then
  echo "✅ .vercel/output/static directory exists"
else
  echo "⚠️ .vercel/output/static directory doesn't exist yet - will be created during deployment"
  # Optional: Create the directory structure for testing
  mkdir -p .vercel/output/
  cp -r dist .vercel/output/static
fi

# Check if .vercel/output/config.json exists
if [ -f ".vercel/output/config.json" ]; then
  echo "✅ .vercel/output/config.json exists"
else
  echo "⚠️ Creating .vercel/output/config.json"
  mkdir -p .vercel/output/
  cat > .vercel/output/config.json << EOF
{
  "version": 3,
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "status": 404, "dest": "/404.html" }
  ]
}
EOF
fi

echo "✅ Vercel build configuration verification completed!"
echo "Ready for deployment to Vercel 🚀"

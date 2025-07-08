#!/bin/sh
# Enhanced script for Vercel deployment that ensures proper output structure

# Remove any optimized config files if they exist
rm -f astro.config.optimized.ts

echo "🚀 Starting Vercel optimized build process..."

# Run the actual build command with Vercel adapter
NODE_OPTIONS='--max-old-space-size=4096 --no-warnings' astro build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "❌ Build failed! Exiting with error."
  exit 1
fi

echo "✅ Build completed successfully!"

# Ensure .vercel/output/static exists (for Vercel)
if [ -d "dist" ] && [ ! -d ".vercel/output/static" ]; then
  echo "📂 Creating Vercel output directory structure..."
  mkdir -p .vercel/output/
  cp -r dist .vercel/output/static
  echo "✅ Copied build output to Vercel's expected location"
fi

# Create config.json for Vercel
echo "📝 Creating Vercel config.json..."
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

echo "🎉 Build process completed! Ready for Vercel deployment."

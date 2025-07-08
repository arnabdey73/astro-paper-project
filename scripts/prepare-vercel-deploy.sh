# Enhanced script for ensuring proper Vercel deployment setup
# This will be run before Astro's build process

# Clear the terminal 
echo "🚀 Preparing for Vercel deployment..."

# 1. Ensure public/assets/images exists
echo "📁 Ensuring public/assets directory structure exists..."
mkdir -p public/assets/images/covers

# 2. Copy all images from src/assets/images to public/assets/images
echo "🖼️  Copying images from src/assets to public/assets..."
if [ -d "src/assets/images" ]; then
  cp -r src/assets/images/* public/assets/images/ 2>/dev/null || echo "Some files may already exist"
else
  echo "src/assets/images directory doesn't exist. Skipping copy."
fi

# 3. Prepare .vercel directory structure if needed
echo "🏗️  Setting up Vercel deployment structure..."
mkdir -p .vercel/output

# 4. Create a simple vercel.json config in case it doesn't exist
if [ ! -f ".vercel/output/config.json" ]; then
  echo "📝 Creating initial Vercel config..."
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

# Display a success message
echo "✅ Assets and Vercel configuration prepared successfully for deployment!"
echo "📋 Image paths should now use absolute paths starting with /assets/images/"
echo "   Example: /assets/images/post1.png"

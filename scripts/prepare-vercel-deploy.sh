# A simple deployment script for ensuring asset paths are correct
# This will be run before Astro's build process

# Clear the terminal 
echo "🚀 Preparing for Vercel deployment..."

# 1. Make sure public/assets/images exists
echo "📁 Ensuring public/assets directory structure exists..."
mkdir -p public/assets/images/covers

# 2. Copy all images from src/assets/images to public/assets/images
echo "🖼️  Copying images from src/assets to public/assets..."
if [ -d "src/assets/images" ]; then
  cp -r src/assets/images/* public/assets/images/ || echo "Some files may already exist"
else
  echo "src/assets/images directory doesn't exist. Skipping copy."
fi

# Display a success message
echo "✅ Assets prepared successfully for deployment!"
echo "📋 Image paths should now use absolute paths starting with /assets/images/"
echo "   Example: /assets/images/post1.png"

# Display a success message
echo "✅ Assets prepared successfully for deployment!"
echo "📋 Image paths should now use absolute paths starting with /assets/images/"
echo "   Example: /assets/images/post1.png"

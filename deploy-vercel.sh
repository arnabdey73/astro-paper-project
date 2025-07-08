#!/bin/bash
# Enhanced Vercel deployment script with optimized settings
# This script prepares and deploys your Astro site to Vercel with proper settings

# Exit immediately if any command fails
set -e

# Print colorful status messages
print_status() {
  echo -e "\033[1;36m==>\033[0m \033[1m$1\033[0m"
}

print_error() {
  echo -e "\033[1;31m==>\033[0m \033[1m$1\033[0m"
}

print_success() {
  echo -e "\033[1;32m==>\033[0m \033[1m$1\033[0m"
}

# Check for Vercel CLI installation
if ! command -v vercel &> /dev/null; then
  print_error "Vercel CLI not found!"
  print_status "Installing Vercel CLI..."
  npm install -g vercel
fi

# Run pre-deployment scripts
print_status "Preparing for deployment..."

# Run image copy script
if [ -f "./scripts/copy-images.js" ]; then
  print_status "Running image copy script..."
  node scripts/copy-images.js
else
  print_status "Image copy script not found, skipping..."
fi

# Run Vercel deploy preparation script
if [ -f "./scripts/prepare-vercel-deploy.sh" ]; then
  print_status "Running Vercel deployment preparation script..."
  sh scripts/prepare-vercel-deploy.sh
else
  print_status "Vercel preparation script not found, skipping..."
fi

# Clear cache for a clean build
print_status "Clearing cache..."
rm -rf ./.astro
rm -rf ./dist
rm -rf ./node_modules/.vite
rm -rf ./node_modules/.astro

# Build the project with optimized settings
print_status "Building project with optimized settings..."
NODE_OPTIONS="--max-old-space-size=4096 --no-warnings" ASTRO_TELEMETRY_DISABLED=1 npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  print_error "Build failed! Deployment aborted."
  exit 1
fi

print_success "Build completed successfully!"

# Deploy to Vercel
print_status "Deploying to Vercel..."
vercel deploy --prod

# Check if deployment was successful
if [ $? -ne 0 ]; then
  print_error "Deployment failed!"
  exit 1
fi

print_success "Deployment completed successfully!"
print_status "Your site is now live on Vercel!"

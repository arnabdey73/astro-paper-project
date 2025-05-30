#!/bin/bash

# Navigate to project root
cd /c/Users/mno527/OneDrive\ -\ AFRY/Documents/astro-paper-project

# Clean cache
rm -rf node_modules/.cache
rm -rf .astro

# Install dependencies if needed
npm install

# Run build
npm run build

echo "Build completed!"

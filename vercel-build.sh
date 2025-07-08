#!/bin/sh
# This script ensures that the standard astro.config.ts is used for Vercel builds

# Remove any optimized config files if they exist
rm -f astro.config.optimized.ts

# Run the actual build command
NODE_OPTIONS='--max-old-space-size=4096 --no-warnings' astro build

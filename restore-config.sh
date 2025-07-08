#!/bin/bash
# Enhanced script to restore original config after diagnosis

echo "=== Astro Configuration Restore Tool ==="

if [ -f "./astro.config.ts.bak" ]; then
  echo "Restoring original configuration..."
  cp ./astro.config.ts.bak ./astro.config.ts
  echo "Original configuration restored."
  
  # Ask if user wants to remove backup
  read -p "Remove backup file (astro.config.ts.bak)? (y/N): " remove_backup
  if [[ $remove_backup == "y" || $remove_backup == "Y" ]]; then
    rm ./astro.config.ts.bak
    echo "Backup file removed."
  fi
  
  # Ask if user wants to clean cache
  read -p "Clear cache files for a fresh start? (Y/n): " clear_cache
  if [[ $clear_cache != "n" && $clear_cache != "N" ]]; then
    echo "Clearing cache files..."
    rm -rf ./node_modules/.vite
    rm -rf ./node_modules/.astro
    rm -rf ./.astro
    echo "Cache cleared successfully."
  fi
  
  echo ""
  echo "Configuration restored successfully!"
  echo "You can now run 'npm run dev' or 'npm run build' to test with your original config."
else
  echo "Error: Backup config not found!"
  echo "If you're trying to restore your configuration but lost your backup,"
  echo "please check if you have astro.config.ts.bak in another location."
fi

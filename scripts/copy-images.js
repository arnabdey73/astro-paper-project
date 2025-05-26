// This script copies all images from src/assets/images to public/assets/images
// to ensure image references work correctly at build time

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.resolve(__dirname, '../src/assets/images');
const destDir = path.resolve(__dirname, '../public/assets/images');

// Ensure the destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Helper function to copy files recursively
function copyFilesRecursively(source, destination) {
  try {
    // Get all files and directories in the source
    const items = fs.readdirSync(source);

    for (const item of items) {
      const sourcePath = path.join(source, item);
      const destPath = path.join(destination, item);
      
      const stat = fs.statSync(sourcePath);
      
      if (stat.isDirectory()) {
        // Create the directory if it doesn't exist
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath, { recursive: true });
        }
        // Recursively copy files from subdirectory
        copyFilesRecursively(sourcePath, destPath);
      } else {
        // Copy the file if it doesn't exist or is different
        if (!fs.existsSync(destPath)) {
          fs.copyFileSync(sourcePath, destPath);
          console.log(`Copied: ${sourcePath} → ${destPath}`);
        } else {
          try {
            // Compare file contents if both exist
            const sourceContent = fs.readFileSync(sourcePath);
            const destContent = fs.readFileSync(destPath);
            if (Buffer.compare(sourceContent, destContent) !== 0) {
              fs.copyFileSync(sourcePath, destPath);
              console.log(`Updated: ${sourcePath} → ${destPath}`);
            } else {
              console.log(`Skipped (unchanged): ${sourcePath}`);
            }
          } catch (err) {
            // If comparison fails, just copy
            fs.copyFileSync(sourcePath, destPath);
            console.log(`Force copied: ${sourcePath} → ${destPath}`);
          }
        }
      }
    }
  } catch (err) {
    console.error(`Error in directory ${source}:`, err);
    // Continue with other files instead of exiting
  }
}

// Execute the copy
try {
  console.log(`Copying images from ${sourceDir} to ${destDir}...`);
  if (fs.existsSync(sourceDir)) {
    copyFilesRecursively(sourceDir, destDir);
    console.log('All images have been copied successfully!');
  } else {
    console.log(`Source directory ${sourceDir} does not exist. Skipping image copy.`);
  }
} catch (error) {
  console.error('An error occurred during image copying:', error);
  process.exit(1);
}

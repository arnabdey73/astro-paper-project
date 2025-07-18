// Convert SVG to PNG
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgPath = path.join(__dirname, '..', 'public', 'assets', 'images', 'posts-hero.svg');
const pngPath = path.join(__dirname, '..', 'public', 'assets', 'images', 'posts-hero.png');

try {
  // Check if an SVG conversion tool is available
  exec('which convert', (error, stdout) => {
    if (error) {
      console.log('ImageMagick not found, skipping PNG conversion.');
      console.log('Please manually convert the SVG to PNG or install ImageMagick.');
      return;
    }
    
    // Convert SVG to PNG using ImageMagick
    exec(`convert ${svgPath} ${pngPath}`, (error) => {
      if (error) {
        console.error('Error converting SVG to PNG:', error);
        return;
      }
      console.log('Successfully converted SVG to PNG');
    });
  });
} catch (err) {
  console.error('Error:', err);
}

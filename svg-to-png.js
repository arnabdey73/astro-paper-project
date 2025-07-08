// svg-to-png.js
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const { DOMParser } = require('xmldom');
const { JSDOM } = require('jsdom');

async function convertSvgToPng(svgPath, pngPath, width = 1200, height = 630) {
  try {
    // Read the SVG file
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    
    // Create a data URL from the SVG content
    const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;
    
    // Create a canvas with the desired dimensions
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Fill the background with a dark color
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 0, width, height);
    
    // Load the SVG image
    const image = await loadImage(svgDataUrl);
    
    // Calculate scaling to fit the SVG while maintaining aspect ratio
    const scale = Math.min(width / image.width, height / image.height);
    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;
    const x = (width - scaledWidth) / 2;
    const y = (height - scaledHeight) / 2;
    
    // Draw the SVG image onto the canvas
    ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
    
    // Save the canvas as a PNG file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(pngPath, buffer);
    
    console.log(`Successfully converted ${svgPath} to ${pngPath}`);
  } catch (error) {
    console.error('Error converting SVG to PNG:', error);
  }
}

// Convert the architecture diagram
convertSvgToPng(
  'public/assets/images/posts/openstack-devops-architecture.svg',
  'public/assets/images/posts/openstack-devops-architecture.png'
);

// Convert the infrastructure components diagram
convertSvgToPng(
  'public/assets/images/posts/openstack-infrastructure-components.svg',
  'public/assets/images/posts/openstack-infrastructure-components.png'
);

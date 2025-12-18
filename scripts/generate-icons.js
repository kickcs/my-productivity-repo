const fs = require('fs');
const path = require('path');

// Simple PNG generator for solid color icons with a star symbol
function generatePNG(size) {
  // PNG header and IHDR chunk
  const width = size;
  const height = size;

  // Create raw pixel data (RGBA)
  const pixels = [];
  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = size * 0.4;
  const innerRadius = size * 0.2;
  const points = 5;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      // Star shape calculation
      const normalizedAngle = ((angle + Math.PI) / (2 * Math.PI)) * points * 2;
      const starRadius = normalizedAngle % 2 < 1 ? outerRadius : innerRadius;
      const interpolatedRadius = innerRadius + (outerRadius - innerRadius) *
        Math.abs(1 - (normalizedAngle % 2));

      // Background is dark, star is golden
      if (distance < size * 0.45) {
        // Inside the icon area - dark background
        if (distance < interpolatedRadius * 0.8) {
          // Star area - golden color
          pixels.push(250, 204, 21, 255); // Golden yellow
        } else {
          // Background - dark
          pixels.push(23, 23, 23, 255); // Near black
        }
      } else {
        // Outside - transparent for rounded effect, or dark
        pixels.push(23, 23, 23, 255);
      }
    }
  }

  // Use a simpler approach - create a basic colored square with text indicator
  // This is a minimal valid PNG
  return createSimplePNG(size, size, pixels);
}

function createSimplePNG(width, height, pixels) {
  const { createCanvas } = require('canvas');
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Dark background
  ctx.fillStyle = '#171717';
  ctx.fillRect(0, 0, width, height);

  // Rounded rectangle
  const radius = width * 0.2;
  ctx.beginPath();
  ctx.roundRect(width * 0.05, height * 0.05, width * 0.9, height * 0.9, radius);
  ctx.fillStyle = '#171717';
  ctx.fill();

  // Star icon
  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = width * 0.3;
  const innerRadius = width * 0.15;

  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (Math.PI / 2) + (i * Math.PI / 5);
    const x = centerX + r * Math.cos(angle);
    const y = centerY - r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = '#facc15';
  ctx.fill();

  return canvas.toBuffer('image/png');
}

// Check if canvas is available
try {
  require('canvas');

  const sizes = [192, 512];
  const iconsDir = path.join(__dirname, '../public/icons');

  sizes.forEach(size => {
    const buffer = generatePNG(size);
    fs.writeFileSync(path.join(iconsDir, `icon-${size}.png`), buffer);
    console.log(`Generated icon-${size}.png`);
  });

  console.log('Icons generated successfully!');
} catch (e) {
  console.log('Canvas module not found. Creating placeholder icons...');

  // Create simple placeholder using pure Node.js
  // This creates a minimal valid PNG with solid color
  const iconsDir = path.join(__dirname, '../public/icons');

  // Minimal 1x1 PNG that can be scaled (placeholder)
  const placeholder = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
    0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, // IDAT chunk
    0x54, 0x08, 0xD7, 0x63, 0x18, 0x19, 0x18, 0x00,
    0x00, 0x01, 0x0D, 0x00, 0x01, 0x45, 0xB3, 0xAC,
    0xF5, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, // IEND chunk
    0x44, 0xAE, 0x42, 0x60, 0x82
  ]);

  fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), placeholder);
  fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), placeholder);

  console.log('Placeholder icons created. For better icons, install canvas: npm install canvas');
}

#!/usr/bin/env node
/**
 * Icon Generation Script for GreenVision
 * 
 * This script generates PWA icons from the SVG source.
 * 
 * Prerequisites:
 *   npm install sharp
 * 
 * Usage:
 *   node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is installed
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('📦 Installing sharp for image processing...');
  require('child_process').execSync('npm install sharp', { stdio: 'inherit' });
  sharp = require('sharp');
}

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SVG_PATH = path.join(PUBLIC_DIR, 'icon.svg');

const SIZES = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-16.png', size: 16 },
];

async function generateIcons() {
  console.log('🎨 Generating PWA icons from SVG...\n');

  const svgBuffer = fs.readFileSync(SVG_PATH);

  for (const { name, size } of SIZES) {
    const outputPath = path.join(PUBLIC_DIR, name);
    
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    console.log(`  ✅ Generated ${name} (${size}x${size})`);
  }

  console.log('\n🎉 All icons generated successfully!');
}

generateIcons().catch(console.error);

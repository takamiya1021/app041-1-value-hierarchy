const fs = require('fs');
const path = require('path');

// シンプルなSVGダイヤモンドアイコンを生成
function generateDiamondSVG(size) {
    const centerX = size / 2;
    const centerY = size / 2;
    const diamondSize = size * 0.6;
    
    const top = { x: centerX, y: centerY - diamondSize / 2 };
    const right = { x: centerX + diamondSize / 2, y: centerY };
    const bottom = { x: centerX, y: centerY + diamondSize / 2 };
    const left = { x: centerX - diamondSize / 2, y: centerY };
    
    const facetSize = diamondSize * 0.3;
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#a78bfa;stop-opacity:1" />
      <stop offset="30%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="60%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="facetGradient">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.8" />
      <stop offset="50%" style="stop-color:#c4b5fd;stop-opacity:0.6" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0.3" />
    </radialGradient>
    <radialGradient id="highlightGradient">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.9" />
      <stop offset="50%" style="stop-color:#ffffff;stop-opacity:0.5" />
      <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
    </radialGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="url(#bgGradient)" />
  
  <!-- Diamond body -->
  <path d="M ${top.x},${top.y} L ${right.x},${right.y} L ${bottom.x},${bottom.y} L ${left.x},${left.y} Z" 
        fill="url(#diamondGradient)" 
        stroke="#c4b5fd" 
        stroke-width="${size * 0.015}" />
  
  <!-- Central facet -->
  <path d="M ${centerX},${centerY - facetSize / 2} L ${centerX + facetSize / 2},${centerY} L ${centerX},${centerY + facetSize / 2} L ${centerX - facetSize / 2},${centerY} Z"
        fill="url(#facetGradient)" />
  
  <!-- Highlight -->
  <circle cx="${centerX - diamondSize / 6}" cy="${centerY - diamondSize / 6}" r="${diamondSize / 8}" 
          fill="url(#highlightGradient)" />
  
  <!-- Facet lines -->
  <line x1="${top.x}" y1="${top.y}" x2="${centerX}" y2="${centerY}" 
        stroke="rgba(196,181,253,0.4)" stroke-width="${size * 0.008}" />
  <line x1="${right.x}" y1="${right.y}" x2="${centerX}" y2="${centerY}" 
        stroke="rgba(196,181,253,0.4)" stroke-width="${size * 0.008}" />
  <line x1="${bottom.x}" y1="${bottom.y}" x2="${centerX}" y2="${centerY}" 
        stroke="rgba(196,181,253,0.4)" stroke-width="${size * 0.008}" />
  <line x1="${left.x}" y1="${left.y}" x2="${centerX}" y2="${centerY}" 
        stroke="rgba(196,181,253,0.4)" stroke-width="${size * 0.008}" />
</svg>`;
}

const sizes = [192, 512, 180];
const publicDir = path.join(__dirname, 'public');

console.log('Generating PWA icons...');

sizes.forEach(size => {
    const svg = generateDiamondSVG(size);
    const filename = `icon-${size}.svg`;
    const filepath = path.join(publicDir, filename);
    
    fs.writeFileSync(filepath, svg);
    console.log(`✓ Generated ${filename}`);
});

console.log('\nAll icons generated successfully!');
console.log('Note: SVG icons created. For production, convert to PNG using an online tool or ImageMagick.');

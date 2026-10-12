const { createCanvas } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function renderIconCanvas(targetSize) {
  const canvas = createCanvas(targetSize, targetSize);
  const ctx = canvas.getContext('2d');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Scale from 1024 coordinate system
  const scale = targetSize / 1024;
  ctx.scale(scale, scale);

  // 1. Draw Background Squircle
  // Matches exact gradient and rounded squircle shape of attached image
  const sqX = 128;
  const sqY = 128;
  const sqW = 768;
  const sqH = 768;
  const sqR = 196;

  const bgGrad = ctx.createLinearGradient(sqX + sqW * 0.9, sqY + sqH * 0.1, sqX + sqW * 0.1, sqY + sqH * 0.9);
  bgGrad.addColorStop(0.0, '#36E69D'); // bright mint / light emerald
  bgGrad.addColorStop(0.24, '#0CCD95'); // vibrant spring emerald
  bgGrad.addColorStop(0.52, '#00A892'); // rich teal
  bgGrad.addColorStop(0.78, '#008392'); // deep teal
  bgGrad.addColorStop(1.0, '#005A7C'); // deep ocean teal

  ctx.save();
  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.roundRect(sqX, sqY, sqW, sqH, sqR);
  ctx.fill();
  ctx.restore();

  // 2. Draw White Resume Document Base with Fold Cutout
  ctx.save();
  ctx.shadowColor = 'rgba(0, 42, 36, 0.28)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 16;
  ctx.shadowOffsetX = 0;

  const docX = 276;
  const docY = 236;
  const docW = 440;
  const docH = 548;
  const docR = 46;
  const foldSize = 136;

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(docX + docR, docY);
  ctx.lineTo(docX + docW - foldSize, docY);
  ctx.lineTo(docX + docW, docY + foldSize);
  ctx.lineTo(docX + docW, docY + docH - docR);
  ctx.quadraticCurveTo(docX + docW, docY + docH, docX + docW - docR, docY + docH);
  ctx.lineTo(docX + docR, docY + docH);
  ctx.quadraticCurveTo(docX, docY + docH, docX, docY + docH - docR);
  ctx.lineTo(docX, docY + docR);
  ctx.quadraticCurveTo(docX, docY, docX + docR, docY);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 3. Draw Fold Flap (Dog-Ear)
  ctx.save();
  ctx.shadowColor = 'rgba(0, 50, 42, 0.18)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetX = -4;
  ctx.shadowOffsetY = 8;

  const foldX = docX + docW - foldSize;
  const foldY = docY;

  const foldGrad = ctx.createLinearGradient(foldX + foldSize, foldY, foldX, foldY + foldSize);
  foldGrad.addColorStop(0.0, '#E8FCF4');
  foldGrad.addColorStop(0.5, '#C2F6E3');
  foldGrad.addColorStop(1.0, '#A0F3D3');

  ctx.fillStyle = foldGrad;
  ctx.beginPath();
  ctx.moveTo(foldX, foldY);
  ctx.lineTo(foldX, foldY + foldSize - 18);
  ctx.quadraticCurveTo(foldX, foldY + foldSize, foldX + 18, foldY + foldSize);
  ctx.lineTo(foldX + foldSize, foldY + foldSize);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 4. Draw Document Lines (Three horizontal pill bars)
  ctx.save();
  // Header Bar (vivid emerald)
  ctx.fillStyle = '#00B685';
  ctx.beginPath();
  ctx.roundRect(348, 342, 156, 48, 24);
  ctx.fill();

  // Second Bar (soft lighter mint-teal)
  ctx.fillStyle = '#7EE5C5';
  ctx.beginPath();
  ctx.roundRect(348, 436, 290, 44, 22);
  ctx.fill();

  // Third Bar (soft lighter mint-teal)
  ctx.fillStyle = '#7EE5C5';
  ctx.beginPath();
  ctx.roundRect(348, 524, 236, 44, 22);
  ctx.fill();
  ctx.restore();

  // 5. Draw Checkmark Badge (Circular badge on bottom-right)
  const badgeCX = 680;
  const badgeCY = 650;
  const badgeR = 138;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 36, 30, 0.36)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 18;
  ctx.shadowOffsetX = 0;

  const badgeGrad = ctx.createLinearGradient(badgeCX - 90, badgeCY - 90, badgeCX + 90, badgeCY + 90);
  badgeGrad.addColorStop(0.0, '#28EBA8');
  badgeGrad.addColorStop(0.42, '#07C78A');
  badgeGrad.addColorStop(1.0, '#018E5E');

  ctx.fillStyle = badgeGrad;
  ctx.beginPath();
  ctx.arc(badgeCX, badgeCY, badgeR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 6. Draw Checkmark (✓) inside badge
  ctx.save();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 40;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(badgeCX - 82, badgeCY - 8);
  ctx.lineTo(badgeCX - 32, badgeCY + 42);
  ctx.lineTo(badgeCX + 80, badgeCY - 70);
  ctx.stroke();
  ctx.restore();

  return canvas.toBuffer('image/png');
}

function generateSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="bgGrad" x1="88%" y1="10%" x2="12%" y2="90%">
      <stop offset="0%" stop-color="#36E69D" />
      <stop offset="24%" stop-color="#0CCD95" />
      <stop offset="52%" stop-color="#00A892" />
      <stop offset="78%" stop-color="#008392" />
      <stop offset="100%" stop-color="#005A7C" />
    </linearGradient>

    <filter id="docShadow" x="-20%" y="-20%" width="140%" height="145%">
      <feDropShadow dx="0" dy="16" stdDeviation="15" flood-color="#002A24" flood-opacity="0.28" />
    </filter>

    <filter id="foldShadow" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="-4" dy="8" stdDeviation="7" flood-color="#00322A" flood-opacity="0.18" />
    </filter>

    <filter id="badgeShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#00241E" flood-opacity="0.36" />
    </filter>

    <linearGradient id="badgeGrad" x1="20%" y1="15%" x2="85%" y2="90%">
      <stop offset="0%" stop-color="#28EBA8" />
      <stop offset="42%" stop-color="#07C78A" />
      <stop offset="100%" stop-color="#018E5E" />
    </linearGradient>

    <linearGradient id="foldGrad" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E8FCF4" />
      <stop offset="50%" stop-color="#C2F6E3" />
      <stop offset="100%" stop-color="#A0F3D3" />
    </linearGradient>
  </defs>

  <!-- Background Squircle -->
  <rect x="128" y="128" width="768" height="768" rx="196" ry="196" fill="url(#bgGrad)" />

  <!-- White Document Base -->
  <g filter="url(#docShadow)">
    <path d="
      M 322 236
      L 580 236
      L 716 372
      L 716 738
      A 46 46 0 0 1 670 784
      L 322 784
      A 46 46 0 0 1 276 738
      L 276 282
      A 46 46 0 0 1 322 236
      Z
    " fill="#FFFFFF" />
  </g>

  <!-- Fold Flap -->
  <g filter="url(#foldShadow)">
    <path d="
      M 580 236
      L 580 354
      A 18 18 0 0 0 598 372
      L 716 372
      Z
    " fill="url(#foldGrad)" />
  </g>

  <!-- Document Lines -->
  <rect x="348" y="342" width="156" height="48" rx="24" fill="#00B685" />
  <rect x="348" y="436" width="290" height="44" rx="22" fill="#7EE5C5" />
  <rect x="348" y="524" width="236" height="44" rx="22" fill="#7EE5C5" />

  <!-- Checkmark Badge -->
  <g filter="url(#badgeShadow)">
    <circle cx="680" cy="650" r="138" fill="url(#badgeGrad)" />
  </g>

  <!-- White Checkmark -->
  <path d="M 598 642 L 648 692 L 760 580"
        fill="none"
        stroke="#FFFFFF"
        stroke-width="40"
        stroke-linecap="round"
        stroke-linejoin="round" />
</svg>`;
}

async function main() {
  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  console.log('Generating HireLens Favicon Assets...');

  // 1. High-res 512x512 favicon.png
  const buf512 = renderIconCanvas(512);
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), buf512);
  console.log('✓ public/favicon.png created (512x512)');

  // 2. Apple Touch Icon 180x180
  const buf180 = renderIconCanvas(180);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), buf180);
  console.log('✓ public/apple-touch-icon.png created (180x180)');

  // 3. 32x32 Favicon
  const buf32 = renderIconCanvas(32);
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), buf32);
  console.log('✓ public/favicon-32x32.png created (32x32)');

  // 4. 16x16 Favicon
  const buf16 = renderIconCanvas(16);
  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), buf16);
  console.log('✓ public/favicon-16x16.png created (16x16)');

  // 5. SVG Favicon
  const svgContent = generateSvg();
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent);
  console.log('✓ public/favicon.svg created (scalable SVG)');

  // 6. Multi-resolution favicon.ico using ImageMagick convert
  const temp64 = path.join(publicDir, 'temp_64.png');
  const temp48 = path.join(publicDir, 'temp_48.png');
  fs.writeFileSync(temp64, renderIconCanvas(64));
  fs.writeFileSync(temp48, renderIconCanvas(48));

  try {
    const icoPath = path.join(publicDir, 'favicon.ico');
    execSync(`convert "${path.join(publicDir, 'favicon-16x16.png')}" "${path.join(publicDir, 'favicon-32x32.png')}" "${temp48}" "${temp64}" "${icoPath}"`);
    console.log('✓ public/favicon.ico created (multi-res 16, 32, 48, 64)');
  } catch (err) {
    console.warn('ImageMagick convert failed, copying 32x32 as fallback favicon.ico:', err.message);
    fs.copyFileSync(path.join(publicDir, 'favicon-32x32.png'), path.join(publicDir, 'favicon.ico'));
  } finally {
    if (fs.existsSync(temp64)) fs.unlinkSync(temp64);
    if (fs.existsSync(temp48)) fs.unlinkSync(temp48);
  }

  // 7. Web App Manifest
  const manifest = {
    name: 'HireLens — AI Resume Checker & Job Recommendation Platform',
    short_name: 'HireLens',
    icons: [
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png'
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png'
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      },
      {
        src: '/favicon.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ],
    theme_color: '#0D9488',
    background_color: '#FAFAF9',
    display: 'standalone'
  };
  fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));
  console.log('✓ public/site.webmanifest created');

  console.log('All favicon assets generated successfully.');
}

main().catch(err => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});

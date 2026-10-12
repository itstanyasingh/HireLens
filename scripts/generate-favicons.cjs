const { createCanvas } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function renderIconCanvas(targetSize) {
  const canvas = createCanvas(targetSize, targetSize);
  const ctx = canvas.getContext('2d');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const s = targetSize / 1024;
  ctx.scale(s, s);

  // 1. Background Squircle
  // Fills the canvas with smooth iOS squircle curves for maximum visibility at small tab sizes
  const sqX = 16;
  const sqY = 16;
  const sqW = 992;
  const sqH = 992;
  const sqR = 224;

  const bgGrad = ctx.createLinearGradient(sqX + sqW * 0.9, sqY + sqH * 0.1, sqX + sqW * 0.1, sqY + sqH * 0.9);
  bgGrad.addColorStop(0.0, '#36E69D'); // bright mint
  bgGrad.addColorStop(0.24, '#0CCD95'); // vibrant emerald
  bgGrad.addColorStop(0.52, '#00A892'); // rich teal
  bgGrad.addColorStop(0.78, '#008392'); // deep teal
  bgGrad.addColorStop(1.0, '#005A7C'); // ocean teal

  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.roundRect(sqX, sqY, sqW, sqH, sqR);
  ctx.fill();

  // 2. White Resume Document Base
  ctx.save();
  ctx.shadowColor = 'rgba(0, 35, 30, 0.28)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 18;
  ctx.shadowOffsetX = 0;

  const docX = 200;
  const docY = 150;
  const docW = 580;
  const docH = 724;
  const docR = 60;
  const foldSize = 175;

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

  // 3. Fold Flap (Dog-Ear)
  ctx.save();
  ctx.shadowColor = 'rgba(0, 45, 35, 0.18)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetX = -4;
  ctx.shadowOffsetY = 10;

  const foldX = docX + docW - foldSize;
  const foldY = docY;

  const foldGrad = ctx.createLinearGradient(foldX + foldSize, foldY, foldX, foldY + foldSize);
  foldGrad.addColorStop(0.0, '#E8FCF4');
  foldGrad.addColorStop(0.5, '#C2F6E3');
  foldGrad.addColorStop(1.0, '#A0F3D3');

  ctx.fillStyle = foldGrad;
  ctx.beginPath();
  ctx.moveTo(foldX, foldY);
  ctx.lineTo(foldX, foldY + foldSize - 22);
  ctx.quadraticCurveTo(foldX, foldY + foldSize, foldX + 22, foldY + foldSize);
  ctx.lineTo(foldX + foldSize, foldY + foldSize);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 4. Document Lines
  ctx.save();
  // Header Bar (vivid emerald)
  ctx.fillStyle = '#00B685';
  ctx.beginPath();
  ctx.roundRect(295, 290, 210, 64, 32);
  ctx.fill();

  // Line 2
  ctx.fillStyle = '#7EE5C5';
  ctx.beginPath();
  ctx.roundRect(295, 415, 380, 58, 29);
  ctx.fill();

  // Line 3
  ctx.beginPath();
  ctx.roundRect(295, 530, 310, 58, 29);
  ctx.fill();
  ctx.restore();

  // 5. Checkmark Badge
  const badgeCX = 730;
  const badgeCY = 690;
  const badgeR = 180;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 30, 25, 0.38)';
  ctx.shadowBlur = 36;
  ctx.shadowOffsetY = 20;
  ctx.shadowOffsetX = 0;

  const badgeGrad = ctx.createLinearGradient(badgeCX - 120, badgeCY - 120, badgeCX + 120, badgeCY + 120);
  badgeGrad.addColorStop(0.0, '#28EBA8');
  badgeGrad.addColorStop(0.42, '#07C78A');
  badgeGrad.addColorStop(1.0, '#018E5E');

  ctx.fillStyle = badgeGrad;
  ctx.beginPath();
  ctx.arc(badgeCX, badgeCY, badgeR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 6. Checkmark (✓)
  ctx.save();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 52;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(badgeCX - 105, badgeCY - 10);
  ctx.lineTo(badgeCX - 40, badgeCY + 55);
  ctx.lineTo(badgeCX + 105, badgeCY - 90);
  ctx.stroke();
  ctx.restore();

  return canvas.toBuffer('image/png');
}

async function main() {
  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  console.log('Generating high-visibility HireLens Favicon Assets...');

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

  // 5. Multi-resolution favicon.ico using ImageMagick convert
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

  // 6. Web App Manifest
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

  console.log('All favicon assets regenerated successfully.');
}

main().catch(err => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});

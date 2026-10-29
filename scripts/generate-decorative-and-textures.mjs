import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const PUBLIC_IMAGES = path.join(process.cwd(), 'public', 'images');

const dirs = [
  'homepage',
  'writings',
  'about',
  'decorative',
  'textures',
  'admin',
  'search',
  'errors',
];

for (const d of dirs) {
  fs.mkdirSync(path.join(PUBLIC_IMAGES, d), { recursive: true });
}

async function renderSvgToPng(svgString, outPath, width, height) {
  await sharp(Buffer.from(svgString))
    .resize(width, height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  console.log('Generated PNG:', path.relative(process.cwd(), outPath));
}

async function renderSvgToWebp(svgString, outPath, width, height, quality = 88) {
  await sharp(Buffer.from(svgString))
    .resize(width, height, { fit: 'cover' })
    .webp({ quality })
    .toFile(outPath);
  console.log('Generated WebP:', path.relative(process.cwd(), outPath));
}

async function generateDecorativeAssets() {
  const decDir = path.join(PUBLIC_IMAGES, 'decorative');

  // 1. tape-beige.png (512x180)
  await renderSvgToPng(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 180">
      <defs>
        <filter id="sh" x="-10%" y="-20%" width="120%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#59413B" flood-opacity="0.16"/>
        </filter>
        <pattern id="fibers" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M2 6 L10 8 M14 18 L22 15 M6 20 L12 14" stroke="#C8B4A6" stroke-width="0.7" opacity="0.35"/>
        </pattern>
      </defs>
      <g filter="url(#sh)">
        <path d="M24 38 L488 34 L482 48 L490 62 L480 76 L489 92 L481 108 L488 124 L482 142 L26 146 L34 130 L22 114 L32 98 L23 82 L33 66 L21 52 Z"
          fill="#EDE0D1" fill-opacity="0.78" stroke="#DCC8B6" stroke-width="1"/>
        <path d="M24 38 L488 34 L482 48 L490 62 L480 76 L489 92 L481 108 L488 124 L482 142 L26 146 L34 130 L22 114 L32 98 L23 82 L33 66 L21 52 Z"
          fill="url(#fibers)"/>
      </g>
    </svg>`,
    path.join(decDir, 'tape-beige.png'),
    512,
    180
  );

  // 2. tape-blush.png (512x180)
  await renderSvgToPng(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 180">
      <defs>
        <filter id="sh2" x="-10%" y="-20%" width="120%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#59413B" flood-opacity="0.16"/>
        </filter>
        <pattern id="fibers2" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M3 5 L12 9 M15 19 L21 14 M5 18 L11 12" stroke="#B87873" stroke-width="0.7" opacity="0.25"/>
        </pattern>
      </defs>
      <g filter="url(#sh2)">
        <path d="M26 36 L486 38 L479 52 L489 67 L480 83 L488 99 L479 115 L487 131 L480 144 L24 142 L32 127 L23 111 L33 95 L22 79 L32 63 L23 49 Z"
          fill="#DFB3AE" fill-opacity="0.76" stroke="#CFA09A" stroke-width="1"/>
        <path d="M26 36 L486 38 L479 52 L489 67 L480 83 L488 99 L479 115 L487 131 L480 144 L24 142 L32 127 L23 111 L33 95 L22 79 L32 63 L23 49 Z"
          fill="url(#fibers2)"/>
      </g>
    </svg>`,
    path.join(decDir, 'tape-blush.png'),
    512,
    180
  );

  // 3. pressed-flowers.png (600x600)
  await renderSvgToPng(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
      <defs>
        <filter id="pfShadow">
          <feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="#302622" flood-opacity="0.18"/>
        </filter>
      </defs>
      <g filter="url(#pfShadow)">
        <!-- Main stems -->
        <path d="M290 540 C285 430, 305 320, 315 160" stroke="#6E7864" stroke-width="4.5" fill="none" stroke-linecap="round"/>
        <path d="M298 440 C240 380, 210 310, 185 230" stroke="#7A846F" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M304 390 C360 340, 395 280, 420 210" stroke="#7A846F" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <!-- Pressed sage leaves -->
        <path d="M298 370 C250 360, 235 325, 275 315 C295 310, 302 345, 298 370 Z" fill="#9AA690" opacity="0.9"/>
        <path d="M308 320 C355 310, 370 275, 330 265 C310 260, 305 295, 308 320 Z" fill="#8C9982" opacity="0.9"/>
        <!-- Center pressed rose -->
        <g transform="translate(315, 145)">
          <ellipse cx="-22" cy="-8" rx="34" ry="24" transform="rotate(-25)" fill="#D8A5A0" opacity="0.92"/>
          <ellipse cx="22" cy="-8" rx="34" ry="24" transform="rotate(25)" fill="#CFA09A" opacity="0.92"/>
          <ellipse cx="0" cy="-24" rx="28" ry="34" fill="#B87873" opacity="0.9"/>
          <ellipse cx="-12" cy="14" rx="26" ry="20" transform="rotate(15)" fill="#E5C0BC" opacity="0.94"/>
          <ellipse cx="14" cy="14" rx="26" ry="20" transform="rotate(-15)" fill="#D8A5A0" opacity="0.94"/>
          <circle cx="0" cy="-2" r="10" fill="#8F5550"/>
        </g>
        <!-- Left wildflower -->
        <g transform="translate(185, 220) rotate(-22)">
          <ellipse cx="-16" cy="0" rx="22" ry="14" fill="#E8C5C0" opacity="0.9"/>
          <ellipse cx="16" cy="0" rx="22" ry="14" fill="#D8A5A0" opacity="0.9"/>
          <ellipse cx="0" cy="-16" rx="14" ry="22" fill="#B87873" opacity="0.88"/>
          <ellipse cx="0" cy="16" rx="14" ry="22" fill="#DFB3AE" opacity="0.9"/>
          <circle cx="0" cy="0" r="8" fill="#59413B"/>
        </g>
        <!-- Right wildflower -->
        <g transform="translate(420, 200) rotate(18)">
          <ellipse cx="-15" cy="0" rx="20" ry="13" fill="#D8A5A0" opacity="0.9"/>
          <ellipse cx="15" cy="0" rx="20" ry="13" fill="#E8C5C0" opacity="0.9"/>
          <ellipse cx="0" cy="-15" rx="13" ry="20" fill="#B87873" opacity="0.88"/>
          <ellipse cx="0" cy="15" rx="13" ry="20" fill="#DFB3AE" opacity="0.9"/>
          <circle cx="0" cy="0" r="7" fill="#59413B"/>
        </g>
      </g>
    </svg>`,
    path.join(decDir, 'pressed-flowers.png'),
    600,
    600
  );

  // 4. botanical-corner.png (512x512)
  await renderSvgToPng(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <g fill="none" stroke="#59413B" stroke-linecap="round" stroke-linejoin="round">
        <path d="M48 464 C70 310, 140 160, 440 56" stroke="#7A846F" stroke-width="3.5"/>
        <path d="M110 330 C95 270, 120 225, 165 250 C145 290, 125 315, 110 330 Z" fill="#A7B29E" fill-opacity="0.78" stroke="#6E7864" stroke-width="2"/>
        <path d="M175 245 C165 185, 200 145, 240 175 C215 215, 195 235, 175 245 Z" fill="#9AA690" fill-opacity="0.82" stroke="#6E7864" stroke-width="2"/>
        <path d="M260 165 C265 110, 305 85, 340 115 C315 145, 285 160, 260 165 Z" fill="#A7B29E" fill-opacity="0.78" stroke="#6E7864" stroke-width="2"/>
        <path d="M140 310 C195 320, 235 290, 210 250 C175 265, 155 290, 140 310 Z" fill="#D8A5A0" fill-opacity="0.75" stroke="#B87873" stroke-width="2"/>
        <path d="M230 210 C285 220, 325 190, 300 150 C265 165, 245 190, 230 210 Z" fill="#E5C0BC" fill-opacity="0.8" stroke="#B87873" stroke-width="2"/>
        <circle cx="385" cy="82" r="16" fill="#B87873" fill-opacity="0.85" stroke="#8F5550" stroke-width="2"/>
        <circle cx="82" cy="395" r="12" fill="#D8A5A0" fill-opacity="0.85" stroke="#B87873" stroke-width="2"/>
      </g>
    </svg>`,
    path.join(decDir, 'botanical-corner.png'),
    512,
    512
  );

  // 5. pressed-leaves.png (512x512)
  await renderSvgToPng(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <defs>
        <filter id="leafSh">
          <feDropShadow dx="1" dy="3" stdDeviation="3" flood-color="#302622" flood-opacity="0.16"/>
        </filter>
      </defs>
      <g filter="url(#leafSh)">
        <path d="M140 440 C190 340, 265 220, 370 85" stroke="#6E5A4F" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M185 365 C125 340, 115 275, 175 265 C215 260, 210 325, 185 365 Z" fill="#9AA690" opacity="0.92"/>
        <path d="M225 315 C285 330, 330 280, 290 235 C255 205, 230 275, 225 315 Z" fill="#8A7968" opacity="0.88"/>
        <path d="M265 245 C205 220, 195 155, 255 145 C295 140, 290 205, 265 245 Z" fill="#A7B29E" opacity="0.92"/>
        <path d="M310 185 C370 200, 415 150, 375 105 C340 75, 315 145, 310 185 Z" fill="#7D8C74" opacity="0.9"/>
        <path d="M350 115 C340 65, 385 45, 405 80 C415 105, 375 120, 350 115 Z" fill="#9E8274" opacity="0.88"/>
      </g>
    </svg>`,
    path.join(decDir, 'pressed-leaves.png'),
    512,
    512
  );

  // 6. small-butterfly.png (512x512)
  await renderSvgToPng(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <defs>
        <filter id="bfSh">
          <feDropShadow dx="1" dy="4" stdDeviation="4" flood-color="#302622" flood-opacity="0.18"/>
        </filter>
      </defs>
      <g filter="url(#bfSh)" transform="translate(256,256) rotate(-12)">
        <!-- Upper wings -->
        <path d="M-6 -10 C-75 -115, -185 -95, -165 -10 C-150 45, -65 35, -6 10 Z" fill="#D8A5A0" stroke="#59413B" stroke-width="3"/>
        <path d="M6 -10 C75 -115, 185 -95, 165 -10 C150 45, 65 35, 6 10 Z" fill="#D8A5A0" stroke="#59413B" stroke-width="3"/>
        <!-- Lower wings -->
        <path d="M-6 12 C-65 35, -135 110, -85 145 C-45 170, -15 95, -6 25 Z" fill="#E8C5C0" stroke="#59413B" stroke-width="3"/>
        <path d="M6 12 C65 35, 135 110, 85 145 C45 170, 15 95, 6 25 Z" fill="#E8C5C0" stroke="#59413B" stroke-width="3"/>
        <!-- Delicate wing veins -->
        <path d="M-10 -5 C-65 -55, -115 -45, -135 -15 M-10 15 C-55 55, -75 95, -65 120" stroke="#59413B" stroke-width="1.5" opacity="0.55" fill="none"/>
        <path d="M10 -5 C65 -55, 115 -45, 135 -15 M10 15 C55 55, 75 95, 65 120" stroke="#59413B" stroke-width="1.5" opacity="0.55" fill="none"/>
        <!-- Body & antennae -->
        <ellipse cx="0" cy="10" rx="7" ry="48" fill="#59413B"/>
        <path d="M-3 -35 C-18 -75, -45 -90, -55 -82 M3 -35 C18 -75, 45 -90, 55 -82" stroke="#59413B" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      </g>
    </svg>`,
    path.join(decDir, 'small-butterfly.png'),
    512,
    512
  );

  // 7. hand-drawn-heart.png (512x512)
  await renderSvgToPng(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path d="M256 398 C235 375, 108 282, 112 182 C115 122, 168 96, 214 118 C238 130, 250 154, 256 170 C264 150, 280 124, 308 115 C358 98, 404 132, 400 190 C395 278, 278 372, 256 398 Z"
        fill="#D8A5A0" fill-opacity="0.28" stroke="#59413B" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M252 388 C228 364, 122 276, 124 186" stroke="#B87873" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.7"/>
    </svg>`,
    path.join(decDir, 'hand-drawn-heart.png'),
    512,
    512
  );

  // 8. hand-drawn-sparkles.png (512x512)
  await renderSvgToPng(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <g stroke="#8F5550" stroke-linecap="round" stroke-linejoin="round" fill="#D8A5A0" fill-opacity="0.45">
        <path d="M256 76 Q256 220 112 220 Q256 220 256 364 Q256 220 400 220 Q256 220 256 76 Z" stroke-width="5"/>
        <path d="M128 330 Q128 390 68 390 Q128 390 128 450 Q128 390 188 390 Q128 390 128 330 Z" stroke-width="3.5"/>
        <path d="M392 90 Q392 135 347 135 Q392 135 392 180 Q392 135 437 135 Q392 135 392 90 Z" stroke-width="3.5"/>
        <circle cx="156" cy="128" r="6" fill="#B87873"/>
        <circle cx="368" cy="364" r="7" fill="#B87873"/>
      </g>
    </svg>`,
    path.join(decDir, 'hand-drawn-sparkles.png'),
    512,
    512
  );

  // 9. paper-note.png (600x500)
  await renderSvgToPng(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500">
      <defs>
        <filter id="noteSh" x="-10%" y="-10%" width="120%" height="125%">
          <feDropShadow dx="3" dy="8" stdDeviation="8" flood-color="#302622" flood-opacity="0.16"/>
        </filter>
      </defs>
      <g filter="url(#noteSh)">
        <path d="M48 42 L548 34 L556 180 L552 448 L420 456 L180 450 L44 454 L50 240 Z"
          fill="#FFF9F3" stroke="#E8D7CC" stroke-width="2"/>
        <!-- Subtle ruled lines -->
        <line x1="85" y1="120" x2="515" y2="117" stroke="#E8D7CC" stroke-width="1.5" opacity="0.65"/>
        <line x1="85" y1="175" x2="515" y2="172" stroke="#E8D7CC" stroke-width="1.5" opacity="0.65"/>
        <line x1="85" y1="230" x2="515" y2="227" stroke="#E8D7CC" stroke-width="1.5" opacity="0.65"/>
        <line x1="85" y1="285" x2="515" y2="282" stroke="#E8D7CC" stroke-width="1.5" opacity="0.65"/>
        <line x1="85" y1="340" x2="515" y2="337" stroke="#E8D7CC" stroke-width="1.5" opacity="0.65"/>
        <line x1="115" y1="42" x2="115" y2="452" stroke="#D8A5A0" stroke-width="1.5" opacity="0.45"/>
      </g>
    </svg>`,
    path.join(decDir, 'paper-note.png'),
    600,
    500
  );

  // 10. torn-paper-strip.png (800x220)
  await renderSvgToPng(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 220">
      <defs>
        <filter id="stripSh">
          <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#302622" flood-opacity="0.14"/>
        </filter>
      </defs>
      <path filter="url(#stripSh)"
        d="M18 45 L95 38 L165 48 L245 36 L330 46 L415 35 L495 45 L580 37 L665 46 L745 38 L782 44 L776 85 L784 125 L775 172 L705 178 L620 168 L535 180 L450 170 L365 182 L280 169 L195 179 L110 170 L22 176 L28 130 L16 88 Z"
        fill="#FBF3EA" stroke="#E8D7CC" stroke-width="1.5"/>
    </svg>`,
    path.join(decDir, 'torn-paper-strip.png'),
    800,
    220
  );

  // 11. paper-corner.png (512x512)
  await renderSvgToPng(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <defs>
        <filter id="cornerSh">
          <feDropShadow dx="2" dy="4" stdDeviation="5" flood-color="#302622" flood-opacity="0.18"/>
        </filter>
      </defs>
      <path filter="url(#cornerSh)"
        d="M24 24 L460 24 L435 68 L398 110 L365 162 L310 212 L262 268 L205 318 L155 375 L98 422 L52 465 L24 472 Z"
        fill="#FBF3EA" stroke="#E8D7CC" stroke-width="2"/>
    </svg>`,
    path.join(decDir, 'paper-corner.png'),
    512,
    512
  );

  // 12. pressed-petal.png (512x512)
  await renderSvgToPng(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <defs>
        <filter id="petSh">
          <feDropShadow dx="1" dy="3" stdDeviation="3" flood-color="#302622" flood-opacity="0.15"/>
        </filter>
      </defs>
      <g filter="url(#petSh)">
        <path d="M180 160 C130 110, 210 55, 255 115 C285 155, 225 215, 180 160 Z" fill="#D8A5A0" opacity="0.9"/>
        <path d="M320 270 C275 215, 365 165, 405 230 C430 275, 365 325, 320 270 Z" fill="#E8C5C0" opacity="0.92"/>
        <path d="M150 350 C115 305, 185 260, 225 310 C250 345, 195 395, 150 350 Z" fill="#B87873" opacity="0.86"/>
      </g>
    </svg>`,
    path.join(decDir, 'pressed-petal.png'),
    512,
    512
  );
}

async function generateTextures() {
  const texDir = path.join(PUBLIC_IMAGES, 'textures');

  // Helper for seamless organic paper SVG with turbulence filter
  const makePaperSvg = (baseHex, fiberHex, spotHex, opacity = 0.08) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
      <defs>
        <filter id="paperNoise" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="4" seed="14" stitchTiles="stitch" result="noise"/>
          <feDiffuseLighting in="noise" lighting-color="${baseHex}" surfaceScale="1.4" result="light">
            <feDistantLight azimuth="45" elevation="62"/>
          </feDiffuseLighting>
        </filter>
        <pattern id="weave" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="18" r="0.9" fill="${fiberHex}" opacity="${opacity}"/>
          <circle cx="44" cy="36" r="1.1" fill="${spotHex}" opacity="${opacity}"/>
          <path d="M8 48 Q18 44 26 51 M38 12 Q46 18 54 10" stroke="${fiberHex}" stroke-width="0.7" fill="none" opacity="${opacity}"/>
        </pattern>
      </defs>
      <rect width="1200" height="1200" fill="${baseHex}"/>
      <rect width="1200" height="1200" filter="url(#paperNoise)" opacity="0.28"/>
      <rect width="1200" height="1200" fill="url(#weave)"/>
    </svg>
  `;

  await renderSvgToWebp(makePaperSvg('#FBF3EA', '#88756D', '#B87873', 0.14), path.join(texDir, 'paper-grain.webp'), 1200, 1200);
  await renderSvgToWebp(makePaperSvg('#FFF9F3', '#C8B4A6', '#D8A5A0', 0.08), path.join(texDir, 'cream-paper.webp'), 1200, 1200);
  await renderSvgToWebp(makePaperSvg('#F3E1DC', '#B87873', '#88756D', 0.12), path.join(texDir, 'blush-paper.webp'), 1200, 1200);
  await renderSvgToWebp(makePaperSvg('#211B18', '#59413B', '#88756D', 0.16), path.join(texDir, 'dark-paper.webp'), 1200, 1200);

  // soft-watercolor.webp
  const watercolorSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
      <defs>
        <radialGradient id="wc1" cx="28%" cy="32%" r="55%">
          <stop offset="0%" stop-color="#F3E1DC" stop-opacity="0.85"/>
          <stop offset="60%" stop-color="#D8A5A0" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="#FBF3EA" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="wc2" cx="76%" cy="68%" r="52%">
          <stop offset="0%" stop-color="#E8D7CC" stop-opacity="0.8"/>
          <stop offset="65%" stop-color="#A7B29E" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#FFF9F3" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="wc3" cx="65%" cy="22%" r="42%">
          <stop offset="0%" stop-color="#F3E1DC" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="#FBF3EA" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="1200" fill="#FBF3EA"/>
      <rect width="1200" height="1200" fill="url(#wc1)"/>
      <rect width="1200" height="1200" fill="url(#wc2)"/>
      <rect width="1200" height="1200" fill="url(#wc3)"/>
    </svg>
  `;
  await renderSvgToWebp(watercolorSvg, path.join(texDir, 'soft-watercolor.webp'), 1200, 1200);
}

async function generateAdminAndSearchIllustrations() {
  // 1. admin-empty-writings.webp (800x600)
  const emptyWritingsSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <rect width="800" height="600" fill="#FBF3EA"/>
      <circle cx="400" cy="300" r="210" fill="#F3E1DC" opacity="0.65"/>
      <!-- Open Notebook -->
      <g transform="translate(400, 305) rotate(-4)">
        <rect x="-155" y="-105" width="310" height="210" rx="10" fill="#59413B"/>
        <path d="M-145 -98 L-4 -92 L-4 98 L-145 92 Z" fill="#FFF9F3" stroke="#E8D7CC" stroke-width="2"/>
        <path d="M4 -92 L145 -98 L145 92 L4 98 Z" fill="#FFF9F3" stroke="#E8D7CC" stroke-width="2"/>
        <!-- Subtle lines -->
        <line x1="-120" y1="-55" x2="-25" y2="-52" stroke="#E8D7CC" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="-120" y1="-25" x2="-25" y2="-22" stroke="#E8D7CC" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="-120" y1="5" x2="-45" y2="8" stroke="#E8D7CC" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="25" y1="-52" x2="120" y2="-55" stroke="#E8D7CC" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="25" y1="-22" x2="100" y2="-25" stroke="#E8D7CC" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Ribbon bookmark -->
        <path d="M0 95 L0 140 L12 128 L24 140 L24 95 Z" fill="#B87873"/>
      </g>
      <!-- Fountain pen -->
      <g transform="translate(495, 290) rotate(32)">
        <rect x="-7" y="-110" width="14" height="175" rx="6" fill="#59413B"/>
        <rect x="-7" y="-20" width="14" height="8" fill="#D4AF37"/>
        <polygon points="-5,65 5,65 0,92" fill="#D4AF37"/>
      </g>
    </svg>
  `;
  await renderSvgToWebp(emptyWritingsSvg, path.join(PUBLIC_IMAGES, 'admin', 'admin-empty-writings.webp'), 800, 600);

  // 2. admin-empty-media.webp (800x600)
  const emptyMediaSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <rect width="800" height="600" fill="#FBF3EA"/>
      <circle cx="400" cy="300" r="215" fill="#F3E1DC" opacity="0.6"/>
      <!-- Polaroid frame -->
      <g transform="translate(385, 300) rotate(-6)">
        <rect x="-115" y="-135" width="230" height="275" rx="6" fill="#FFF9F3" stroke="#E8D7CC" stroke-width="2"/>
        <rect x="-98" y="-118" width="196" height="196" fill="#F3E1DC"/>
        <circle cx="-35" cy="-55" r="24" fill="#D8A5A0" opacity="0.85"/>
        <path d="M-98 45 Q-30 -20 30 35 T98 20 L98 78 L-98 78 Z" fill="#B87873" opacity="0.6"/>
      </g>
      <!-- Pressed flower sprig -->
      <g transform="translate(480, 260) rotate(18)">
        <path d="M0 110 C-5 40, 10 -20, 20 -85" stroke="#7A846F" stroke-width="4" fill="none" stroke-linecap="round"/>
        <ellipse cx="20" cy="-90" rx="22" ry="15" fill="#D8A5A0"/>
        <ellipse cx="5" cy="-78" rx="18" ry="12" fill="#B87873"/>
        <circle cx="15" cy="-84" r="6" fill="#59413B"/>
      </g>
    </svg>
  `;
  await renderSvgToWebp(emptyMediaSvg, path.join(PUBLIC_IMAGES, 'admin', 'admin-empty-media.webp'), 800, 600);

  // 3. search-empty.webp (800x600)
  const searchEmptySvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <rect width="800" height="600" fill="#FBF3EA"/>
      <circle cx="400" cy="300" r="210" fill="#F3E1DC" opacity="0.55"/>
      <!-- Open book -->
      <g transform="translate(375, 315) rotate(-3)">
        <path d="M-140 -85 L0 -75 L0 95 L-140 85 Z" fill="#FFF9F3" stroke="#E8D7CC" stroke-width="2"/>
        <path d="M0 -75 L140 -85 L140 85 L0 95 Z" fill="#FFF9F3" stroke="#E8D7CC" stroke-width="2"/>
        <line x1="-115" y1="-40" x2="-25" y2="-35" stroke="#E8D7CC" stroke-width="2.5"/>
        <line x1="-115" y1="-10" x2="-35" y2="-5" stroke="#E8D7CC" stroke-width="2.5"/>
        <line x1="25" y1="-35" x2="115" y2="-40" stroke="#E8D7CC" stroke-width="2.5"/>
        <line x1="25" y1="-5" x2="95" y2="-10" stroke="#E8D7CC" stroke-width="2.5"/>
      </g>
      <!-- Vintage magnifying glass -->
      <g transform="translate(470, 275) rotate(35)">
        <circle cx="0" cy="-35" r="54" fill="#FFF9F3" fill-opacity="0.55" stroke="#B87873" stroke-width="10"/>
        <rect x="-6" y="19" width="12" height="95" rx="6" fill="#59413B"/>
      </g>
    </svg>
  `;
  await renderSvgToWebp(searchEmptySvg, path.join(PUBLIC_IMAGES, 'search', 'search-empty.webp'), 800, 600);
}

await generateDecorativeAssets();
await generateTextures();
await generateAdminAndSearchIllustrations();
console.log('All decorative PNGs, textures, and empty-state illustrations generated!');

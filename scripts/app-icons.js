// Draws the app icons (home screen, install prompt) from the Demaze chevron as a vector, so they stay sharp at any
// size: the logo PNG is only 128px. Run once when the mark or paper colour changes: `node scripts/app-icons.js`
// writes public/assets/img/icon-*.png (layout.js links them; build.js lists them in manifest.webmanifest).
'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const OUT = path.join(__dirname, '..', 'public', 'assets', 'img');
const PAPER = [0xee, 0xf0, 0xf6]; // the page's paper (theme-color in layout.js)
const FROM = [0x47, 0x8f, 0xf0]; // the logo's gradient, top-left to bottom-right (sampled from logo.png)
const TO = [0x57, 0x83, 0xf2];

// The chevron on the logo's 128px grid: the two arms meet at the tip, with the notch set deep inside.
const CHEVRON = [[0, 0], [128, 64], [0, 128], [40, 79.3], [76, 64], [40, 48.7]];

const inside = (x, y) => {
  let hit = false;
  for (let i = 0, j = CHEVRON.length - 1; i < CHEVRON.length; j = i++) {
    const [xi, yi] = CHEVRON[i], [xj, yj] = CHEVRON[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
};

// size: the icon in px; scale: the chevron's width as a share of it (maskable icons keep it inside the safe circle).
function draw(size, scale) {
  const px = Buffer.alloc(size * size * 3);
  const w = size * scale, left = (size - w) / 2 + w * 0.04, top = (size - w) / 2; // nudged right: the mass sits left
  const SS = 4;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let cover = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const u = ((x + (sx + 0.5) / SS - left) / w) * 128, v = ((y + (sy + 0.5) / SS - top) / w) * 128;
          if (inside(u, v)) cover++;
        }
      }
      const a = cover / (SS * SS);
      const u = ((x + 0.5 - left) / w) * 128, v = ((y + 0.5 - top) / w) * 128;
      const t = Math.min(1, Math.max(0, (u + v) / 170));
      for (let c = 0; c < 3; c++) {
        const ink = FROM[c] + (TO[c] - FROM[c]) * t;
        px[(y * size + x) * 3 + c] = Math.round(PAPER[c] + (ink - PAPER[c]) * a);
      }
    }
  }
  return png(size, px);
}

// A minimal PNG encoder: 8-bit RGB, one IDAT, no filtering.
const CRC = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
const crc32 = (buf) => { let c = -1; for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ -1) >>> 0; };
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};
function png(size, rgb) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 2;
  const raw = Buffer.alloc(size * (size * 3 + 1));
  for (let y = 0; y < size; y++) rgb.copy(raw, y * (size * 3 + 1) + 1, y * size * 3, (y + 1) * size * 3);
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

for (const [name, size, scale] of [['icon-180.png', 180, 0.56], ['icon-192.png', 192, 0.56], ['icon-512.png', 512, 0.56], ['icon-maskable-512.png', 512, 0.46]]) {
  fs.writeFileSync(path.join(OUT, name), draw(size, scale));
  console.log('wrote', name);
}

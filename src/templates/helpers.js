// Shared building blocks for the page templates: escaping, icons, images, buttons and site-wide constants.
'use strict';

const fs = require('fs');
const path = require('path');
const C = require('../content');

// Everything visitors can load lives in public/; this script writes the HTML pages there.
const PUBLIC = path.join(__dirname, '..', '..', 'public');

const SITE_URL = (process.env.SITE_URL || 'https://demazetech.com').replace(/\/$/, '');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const pad = (n) => String(n).padStart(2, '0');

const cal = `href="${C.calendly}" target="_blank" rel="noopener"`;

const icon = {
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  cal: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 10h18M8 3v4M16 3v4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9.5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9.75h4v11H3zM9.5 9.75h3.8v1.5h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.61 0-1.85 1.25-1.85 2.55v4.91h-4z"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78zm-1.08 16.2h1.7L7.4 4.73H5.58z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg>',
};

// Photos and project screens live in public/assets/img/work (see manifest.json for each image's variants):
// a <picture> with WebP at the listed widths and a PNG/JPEG fallback. `small` picks the avatar-sized variants.
const MANIFEST = JSON.parse(fs.readFileSync(path.join(PUBLIC, 'assets/img/work/manifest.json'), 'utf8'));

const pic = (key, alt, { sizes = '100vw', small = false, attrs = 'loading="lazy" decoding="async"', cls = '' } = {}) => {
  const m = MANIFEST[key];
  if (!m) throw new Error(`missing image ${key}`);
  const fit = m.files.filter((f) => (small ? f.w <= 200 : f.w > 200));
  const webp = fit.filter((f) => f.fmt === 'webp').sort((a, b) => a.w - b.w);
  const fb = fit.filter((f) => f.fmt !== 'webp').sort((a, b) => b.w - a.w)[0];
  const u = (f) => `./assets/img/work/${f.file}`;
  const h = Math.round((fb.w * m.h) / m.w);
  return `<picture><source type="image/webp" srcset="${webp.map((f) => `${u(f)} ${f.w}w`).join(', ')}" sizes="${sizes}"><img${cls ? ` class="${cls}"` : ''} src="${u(fb)}" alt="${esc(alt)}" width="${fb.w}" height="${h}" ${attrs}></picture>`;
};

const btn = (label, href, cls = 'btn--blue', extra = '') =>
  `<a class="btn ${cls}" href="${href}" ${extra}><span>${esc(label)}</span><i class="btn__icon">${icon.arrow}</i></a>`;

const eyebrow = (t, dark) => `<p class="eyebrow${dark ? ' eyebrow--dark' : ''}"><span class="eyebrow__dot"></span>${esc(t)}</p>`;

module.exports = { PUBLIC, SITE_URL, esc, pad, cal, icon, pic, btn, eyebrow };

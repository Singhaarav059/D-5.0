// Generates the static pages in public/ from content.js. Run: npm run build
//   src/content.js          all copy and data
//   src/pages.js            which sections each page shows
//   src/templates/*.js      the HTML for the layout and each section
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const pages = require('./pages');
const C = require('./content');
const { PUBLIC, SITE_URL } = require('./templates/helpers');

// Fingerprint local assets (./assets/...) with a hash of their contents so a deploy never serves new
// pages with stale CSS/JS; the server caches fingerprinted URLs for a year. data-src (and data-crew-src) name a module
// site.js loads later (the studio and the crew in 3D).
const fingerprints = new Map();
const fingerprint = (html) => html.replace(/(src|href|data-src)="\.\/(assets\/[^"?#]+)"/g, (m, attr, rel) => {
  if (!fingerprints.has(rel)) {
    const file = path.join(PUBLIC, rel);
    fingerprints.set(rel, fs.existsSync(file) ? crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex').slice(0, 10) : null);
  }
  const v = fingerprints.get(rel);
  return v ? `${attr}="./${rel}?v=${v}"` : m;
});

// Templates write every local URL from the site root (./assets/..., ./projects). A page one folder down
// (projects/<case>) needs them one level up, including each entry of a srcset.
const rebase = (html) => html.replace(/="\.\//g, '="../').replace(/srcset="[^"]*"/g, (m) => m.replace(/, \.\//g, ', ../'));

for (const [name, page] of Object.entries(pages)) {
  const html = name.includes('/') ? rebase(fingerprint(page)) : fingerprint(page);
  fs.mkdirSync(path.dirname(path.join(PUBLIC, name)), { recursive: true });
  fs.writeFileSync(path.join(PUBLIC, name + '.html'), html);
  console.log('wrote', name + '.html', (html.length / 1024).toFixed(1) + 'KB');
}

// The sitemap lists every indexable page (not the 404).
const urls = Object.keys(pages).filter((name) => name !== '404').map((name) => `  <url><loc>${SITE_URL}/${name === 'index' ? '' : name}</loc></url>`);
fs.writeFileSync(path.join(PUBLIC, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
console.log('wrote sitemap.xml', urls.length, 'pages');

// The web app manifest: the name and icons a phone uses when the site is added to the home screen
// (icons drawn by scripts/app-icons.js).
fs.writeFileSync(path.join(PUBLIC, 'manifest.webmanifest'), JSON.stringify({
  name: 'Demaze Technologies',
  short_name: 'Demaze',
  description: C.tagline,
  start_url: '/',
  scope: '/',
  display: 'standalone',
  background_color: '#0b0b10',
  theme_color: '#0b0b10',
  icons: [
    { src: '/assets/img/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/assets/img/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/assets/img/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}, null, 2) + '\n');
console.log('wrote manifest.webmanifest');

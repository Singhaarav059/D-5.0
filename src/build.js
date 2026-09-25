// Generates the static pages in public/ from content.js. Run: npm run build
//   src/content.js          all copy and data
//   src/pages.js            which sections each page shows
//   src/templates/*.js      the HTML for the layout and each section
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const pages = require('./pages');
const { PUBLIC } = require('./templates/helpers');

// Fingerprint local assets (./assets/...) with a hash of their contents so a deploy never serves new
// pages with stale CSS/JS; the server caches fingerprinted URLs for a year.
const fingerprints = new Map();
const fingerprint = (html) => html.replace(/(src|href)="\.\/(assets\/[^"?#]+)"/g, (m, attr, rel) => {
  if (!fingerprints.has(rel)) {
    const file = path.join(PUBLIC, rel);
    fingerprints.set(rel, fs.existsSync(file) ? crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex').slice(0, 10) : null);
  }
  const v = fingerprints.get(rel);
  return v ? `${attr}="./${rel}?v=${v}"` : m;
});

for (const [name, page] of Object.entries(pages)) {
  const html = fingerprint(page);
  fs.writeFileSync(path.join(PUBLIC, name + '.html'), html);
  console.log('wrote', name + '.html', (html.length / 1024).toFixed(1) + 'KB');
}

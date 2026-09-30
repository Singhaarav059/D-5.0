// Shared building blocks for the page templates: escaping, icons, images, buttons, split headlines and site-wide
// constants.
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

// Every project has its own case study page, at /projects/<image key> (templates/case.js).
const caseHref = (p) => `./projects/${p.image}`;

// The marker colours by name (content.js names them; site.css has the same values as tokens).
const MARK = { sun: '#ffcb45', pink: '#ff85b8', mint: '#2fd0a0', sky: '#62c1ff', lilac: '#a58bff', tomato: '#ff6242', blue: '#3d5afe' };

// Each service's colour (its dot, its demo's tag, its filter) and its drawing and marker name (templates/doodles.js).
const SVC_COLOR = { ai: MARK.lilac, web: MARK.sky, ecom: MARK.tomato, cloud: MARK.mint };
const SVC_ART = { ai: ['chip', 'lilac'], web: ['browser', 'sky'], ecom: ['bag', 'tomato'], cloud: ['cloud', 'mint'] };

const icon = {
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
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

// The smallest large WebP of a screenshot, for the blurred backdrop behind it (site.css: --shot). A url() inside a
// custom property resolves against the stylesheet that uses it (public/assets/site.css), hence no ./assets/ prefix.
const shot = (key) => {
  const f = MANIFEST[key].files.filter((x) => x.fmt === 'webp' && x.w > 200).sort((x, y) => x.w - y.w)[0];
  return `--shot:url(img/work/${f.file})`;
};

// Buttons: a pill with the label and a round arrow. `tone`: paper (light pill, blue arrow), ink (dark pill),
// blue (brand pill, white arrow), or an outline without the arrow: ghost (light line, on the night) or line (ink
// line, on a coloured panel). `magnet`: it leans toward the cursor (site.js).
const btn = (label, href, { tone = 'paper', size = '', extra = '', magnet = true } = {}) => {
  const outline = tone === 'ghost' || tone === 'line';
  return `<a class="btn btn--${tone}${size ? ` btn--${size}` : ''}" href="${href}"${extra ? ` ${extra}` : ''}${magnet && !outline ? ' data-magnet' : ''}><span>${esc(label)}</span>${outline ? '' : '<i class="btn__dot" aria-hidden="true">→</i>'}</a>`;
};

// A small uppercase label over a section's headline; `art` ([doodle, colour]) puts a drawing before it.
const kicker = (text, cls = '', art = null) => `<span class="kicker${cls ? ` ${cls}` : ''}">${art ? require('./doodles').doodle(art[0], { color: art[1], cls: 'kicker__dd' }) : ''}${esc(text)}</span>`;

// The mark under the headline word in <mark>: a short route in the maze's own language (straight runs and turns),
// drawn in by site.js once the headline has risen.
const LOOP = '<svg class="loop" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true"><path data-drawin data-delay="0.9" data-dur="900" pathLength="1" d="M3 40H62V76H138V34H197"/></svg>';

// A headline whose words rise into place one by one (site.js, [data-words]). `html` is trusted HTML from the
// templates or content.js: the words inside <em> are set in the quieter grey, a word in <mark> gets the loop.
const words = (html) => {
  const out = [];
  let quiet = false, mark = false;
  for (const tok of html.split(/(<\/?(?:em|mark)>|\s+)/)) {
    if (!tok || /^\s+$/.test(tok)) continue;
    if (tok === '<em>') { quiet = true; continue; }
    if (tok === '</em>') { quiet = false; continue; }
    if (tok === '<mark>') { mark = true; continue; }
    if (tok === '</mark>') { mark = false; continue; }
    const w = `<span class="w"><span data-w${quiet ? ' class="is-quiet"' : ''}>${tok}</span></span>`;
    out.push(mark ? `<span class="w-mark">${w}${LOOP}</span>` : w);
  }
  return out.join(' ');
};

module.exports = { PUBLIC, SITE_URL, MANIFEST, MARK, SVC_COLOR, SVC_ART, shot, esc, pad, cal, caseHref, icon, pic, btn, kicker, words };

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.join(__dirname, '..');
const cases = fs.readdirSync(path.join(root, 'public', 'projects')).filter((f) => f.endsWith('.html')).map((f) => `projects/${f.slice(0, -5)}`);
const pages = ['index', 'about-us', 'projects', 'services', 'contact', ...cases];

test('generated active pages have required metadata and local runtime scripts', () => {
  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, 'public', `${page}.html`), 'utf8');
    assert.match(html, /<html lang="en">/);
    assert.match(html, /<title>[^<]+<\/title>/);
    const desc = html.match(/<meta name="description" content="([^"]*)"/);
    assert.ok(desc, `${page} has a description`);
    const text = desc[1].replace(/&(amp|lt|gt|quot|#39|#x27);/g, '_');
    assert.ok(text.length <= 160, `${page}: description is ${text.length} characters (search shows ~160)`);
    assert.match(html, /<link rel="canonical" href="https:\/\/demazetech\.com\//);
    assert.match(html, /<meta property="og:url"/);
    assert.match(html, /<meta name="twitter:card"/);
    assert.doesNotMatch(html, /cdn\.jsdelivr\.net/);
    assert.doesNotMatch(html, /https:\/\/fonts\.googleapis\.com/);
    assert.doesNotMatch(html, /<script(?![^>]+\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>/); // (structured data is not code)
    assert.match(html, /assets\/site\.js/);
  }
});

test('generated IDs are unique and public metadata exists', () => {
  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, 'public', `${page}.html`), 'utf8');
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(new Set(ids).size, ids.length, `${page} contains duplicate IDs`);
  }
  assert.match(fs.readFileSync(path.join(root, 'public', 'robots.txt'), 'utf8'), /Sitemap:/);
  assert.match(fs.readFileSync(path.join(root, 'public', 'sitemap.xml'), 'utf8'), /<urlset/);
});

test('the server only exposes public/', () => {
  const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
  assert.match(server, /path\.join\(__dirname, 'public'\)/);
  assert.doesNotMatch(server, /fallback:\s*['"]index\.html/);
  // source, build and server code must never sit in the public root
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
  const publicFiles = walk(path.join(root, 'public')).map((f) => path.relative(path.join(root, 'public'), f));
  for (const f of publicFiles) assert.doesNotMatch(f, /^(build|content|serve|server)\.js$|\.md$|^package/, `${f} should not be public`);
});

test('pages load no third-party assets (links to other sites are fine)', () => {
  for (const page of [...pages, '404']) {
    const html = fs.readFileSync(path.join(root, 'public', `${page}.html`), 'utf8');
    assert.doesNotMatch(html, /<(?:img|script|iframe|source|video|audio)\b[^>]*\b(?:src|srcset)="https?:/i, `${page} loads an external asset`);
    assert.doesNotMatch(html, /<link\b(?=[^>]*rel="(?:stylesheet|preload|icon|modulepreload)")[^>]*href="https?:/i, `${page} links an external stylesheet/icon`);
  }
  const assets = fs.readdirSync(path.join(root, 'public', 'assets')).filter((f) => /\.(css|js)$/.test(f));
  for (const f of assets) {
    const src = fs.readFileSync(path.join(root, 'public', 'assets', f), 'utf8');
    assert.doesNotMatch(src, /url\(\s*['"]?https?:|import\s*\(?\s*['"]https?:|fetch\(\s*['"]https?:/, `${f} pulls from another domain`);
  }
  assert.match(fs.readFileSync(path.join(root, 'public', '404.html'), 'utf8'), /<meta name="robots" content="noindex">/);
});

test('every local link, anchor and asset on the pages resolves', () => {
  const publicDir = path.join(root, 'public');
  // a URL resolves from the page's own folder (case studies sit in projects/)
  const target = (page, url) => {
    const clean = path.posix.normalize(path.posix.join(path.posix.dirname(page), url.replace(/[?#].*$/, ''))).replace(/\/$/, '');
    if (clean === '.' || clean === '') return 'index.html';
    const file = path.join(publicDir, clean);
    return fs.existsSync(file) && fs.statSync(file).isFile() ? clean : `${clean}.html`;
  };
  for (const page of [...pages, '404']) {
    const html = fs.readFileSync(path.join(publicDir, `${page}.html`), 'utf8');
    const urls = [
      ...[...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((m) => m[1]),
      ...[...html.matchAll(/\bsrcset="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(/\s+/)[0])),
    ];
    for (const url of urls) {
      if (/^(?:[a-z]+:|\/\/)/i.test(url)) continue; // other sites, mailto:, tel:
      if (url.startsWith('#')) {
        if (url.length > 1) assert.ok(html.includes(`id="${url.slice(1)}"`), `${page}: ${url} has no matching id`);
        continue;
      }
      const file = target(page, url);
      assert.ok(fs.existsSync(path.join(publicDir, file)), `${page}: ${url} does not resolve to a file in public/`);
      const hash = url.split('#')[1];
      if (hash && file.endsWith('.html')) {
        assert.ok(fs.readFileSync(path.join(publicDir, file), 'utf8').includes(`id="${hash}"`), `${page}: ${url} has no matching id`);
      }
    }
  }
});

test('project cards play their reels: one chapter per feature, on home, the projects page and every case study', () => {
  const C = require('../src/content');
  const reels = (page) => [...fs.readFileSync(path.join(root, 'public', `${page}.html`), 'utf8').matchAll(/class="reel reel--\w+" data-cycle="([\d.]+)"/g)].map((m) => +m[1]);
  assert.equal(reels('projects').length, C.projects.length, 'every project has a card on the projects page');
  assert.ok(reels('index').length >= 6, 'home shows the selected work');
  for (const p of C.projects) assert.equal(reels(`projects/${p.image}`)[0], +(p.features.length * 2.6).toFixed(1), `${p.image}: its reel runs one chapter per feature`);
});

test('structured data parses and every page names the organisation', () => {
  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, 'public', `${page}.html`), 'utf8');
    const data = [...html.matchAll(/<script type="application\/ld\+json">([^<]*)<\/script>/g)].map((m) => JSON.parse(m[1]));
    assert.ok(data.some((d) => d['@type'] === 'Organization'), `${page} has no Organization data`);
    for (const d of data) assert.equal(d['@context'], 'https://schema.org', `${page}: ${d['@type']} has no @context`);
    if (page.startsWith('projects/')) assert.ok(data.some((d) => d['@type'] === 'CreativeWork'), `${page} has no case study data`);
  }
});

test('every case study has a page, and the sitemap lists every page', () => {
  const C = require('../src/content');
  assert.equal(cases.length, C.projects.length);
  const sitemap = fs.readFileSync(path.join(root, 'public', 'sitemap.xml'), 'utf8');
  for (const page of pages) assert.ok(sitemap.includes(`https://demazetech.com/${page === 'index' ? '' : page}</loc>`), `sitemap misses ${page}`);
  assert.doesNotMatch(sitemap, /404/);
});

test('the web app manifest names its icons, and they exist', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public', 'manifest.webmanifest'), 'utf8'));
  assert.ok(manifest.name && manifest.short_name && manifest.start_url);
  assert.ok(manifest.icons.some((i) => i.sizes === '512x512' && i.purpose === 'maskable'));
  for (const i of manifest.icons) assert.ok(fs.existsSync(path.join(root, 'public', i.src)), `${i.src} is missing`);
});

test('transition names are unique on every page (a duplicate cancels the card-to-page transition)', () => {
  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, 'public', `${page}.html`), 'utf8');
    const names = [...html.matchAll(/view-transition-name:\s*([\w-]+)/g)].map((m) => m[1]).filter((n) => n !== 'none');
    assert.equal(new Set(names).size, names.length, `${page} repeats a view-transition-name`);
  }
});

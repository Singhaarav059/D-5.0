'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.join(__dirname, '..');
const pages = ['index', 'about-us', 'projects', 'services', 'contact'];

test('generated active pages have required metadata and local runtime scripts', () => {
  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, 'public', `${page}.html`), 'utf8');
    assert.match(html, /<html lang="en">/);
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.match(html, /<meta name="description"/);
    assert.match(html, /<link rel="canonical" href="https:\/\/demazetech\.com\//);
    assert.match(html, /<meta property="og:url"/);
    assert.match(html, /<meta name="twitter:card"/);
    assert.doesNotMatch(html, /cdn\.jsdelivr\.net/);
    assert.doesNotMatch(html, /https:\/\/fonts\.googleapis\.com/);
    assert.doesNotMatch(html, /<script(?![^>]+\bsrc=)[^>]*>/);
    assert.match(html, /assets\/vendor\/gsap\.min\.js/);
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

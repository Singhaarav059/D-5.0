'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.join(__dirname, '..');
const pages = ['index', 'about-us', 'projects', 'services', 'contact'];

test('generated active pages have required metadata and local runtime scripts', () => {
  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, 'site', `${page}.html`), 'utf8');
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
    const html = fs.readFileSync(path.join(root, 'site', `${page}.html`), 'utf8');
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(new Set(ids).size, ids.length, `${page} contains duplicate IDs`);
  }
  assert.match(fs.readFileSync(path.join(root, 'site', 'robots.txt'), 'utf8'), /Sitemap:/);
  assert.match(fs.readFileSync(path.join(root, 'site', 'sitemap.xml'), 'utf8'), /<urlset/);
});

test('legacy entry point does not reference the repository root', () => {
  const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
  assert.match(server, /path\.join\(__dirname, 'site'\)/);
  assert.doesNotMatch(server, /fallback:\s*['"]index\.html/);
});

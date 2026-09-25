'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { createStaticServer } = require('../static-server');

async function request(server, method, requestPath, headers = {}) {
  const address = server.address();
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port: address.port, path: requestPath, method, headers }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString() }));
    });
    req.on('error', reject);
    req.end();
  });
}

test('static server protects the root and serves safe routes', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'static-server-'));
  await fs.writeFile(path.join(root, 'index.html'), '<h1>ok</h1>');
  await fs.writeFile(path.join(root, 'about.html'), 'about');
  await fs.writeFile(path.join(root, 'private.txt'), 'do not leak');
  await fs.writeFile(path.join(root, 'package.json'), '{"private":true}');
  await fs.mkdir(path.join(root, '.git'));
  await fs.writeFile(path.join(root, '.git', 'config'), '[core]');
  const server = createStaticServer({ root });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await fs.rm(root, { recursive: true, force: true });
  });

  const home = await request(server, 'GET', '/');
  assert.equal(home.status, 200);
  assert.equal(home.body, '<h1>ok</h1>');
  assert.equal(home.headers['x-content-type-options'], 'nosniff');
  assert.equal(home.headers['x-frame-options'], 'SAMEORIGIN');

  const route = await request(server, 'GET', '/about');
  assert.equal(route.status, 200);
  assert.equal(route.body, 'about');

  for (const traversal of ['/%2e%2e/private.txt', '/%2e%2e%2fprivate.txt']) {
    const response = await request(server, 'GET', traversal);
    assert.equal(response.status, 404, traversal);
  }

  for (const sensitive of ['/package.json', '/.git/config']) {
    const response = await request(server, 'GET', sensitive);
    assert.equal(response.status, 404, sensitive);
  }

  const head = await request(server, 'HEAD', '/about.html');
  assert.equal(head.status, 200);
  assert.equal(head.body, '');
  assert.equal(head.headers['content-length'], '5');

  const compressed = await request(server, 'GET', '/about.html', { 'Accept-Encoding': 'br' });
  assert.equal(compressed.status, 200);
  assert.equal(compressed.headers['content-encoding'], 'br');
  assert.ok(compressed.headers.etag);
  const cached = await request(server, 'GET', '/about.html', { 'If-None-Match': compressed.headers.etag });
  assert.equal(cached.status, 304);

  const post = await request(server, 'POST', '/');
  assert.equal(post.status, 405);
  assert.equal(post.headers.allow, 'GET, HEAD');
});

test('fingerprinted assets are cached for a year, plain ones for an hour', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'static-server-'));
  await fs.writeFile(path.join(root, 'index.html'), '<h1>ok</h1>');
  await fs.writeFile(path.join(root, 'site.css'), 'body{}');
  const server = createStaticServer({ root });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await fs.rm(root, { recursive: true, force: true });
  });

  const versioned = await request(server, 'GET', '/site.css?v=0123456789');
  assert.equal(versioned.status, 200);
  assert.match(versioned.headers['cache-control'], /max-age=31536000, immutable/);
  const plain = await request(server, 'GET', '/site.css');
  assert.equal(plain.headers['cache-control'], 'public, max-age=3600');
  const page = await request(server, 'GET', '/?v=0123456789');
  assert.equal(page.headers['cache-control'], 'no-cache');
});

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { createStaticServer } = require('../lib/static-server');
const { handleContact, resetRateLimit } = require('../lib/contact-api');

function request(server, method, requestPath, body, headers = {}) {
  const address = server.address();
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port: address.port, path: requestPath, method, headers }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString() }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

test('contact API validates submissions and never exposes delivery internals', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'contact-api-'));
  await fs.writeFile(path.join(root, 'index.html'), '<h1>ok</h1>');
  const server = createStaticServer({ root, onRequest: (req, res) => handleContact(req, res, { webhookUrl: '' }) });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await fs.rm(root, { recursive: true, force: true });
  });

  const headers = { 'Content-Type': 'application/json' };
  const valid = JSON.stringify({ name: 'Ada Lovelace', email: 'ada@example.com', subject: 'Project', message: 'A sufficiently detailed project enquiry.', website: '' });
  const unavailable = await request(server, 'POST', '/api/contact', valid, headers);
  assert.equal(unavailable.status, 503);
  assert.doesNotMatch(unavailable.body, /webhook|contact@|stack/i);

  const bot = await request(server, 'POST', '/api/contact', JSON.stringify({ name: 'Bot', email: 'bot@example.com', subject: 'Spam', message: 'A sufficiently detailed message.', website: 'filled' }), headers);
  assert.equal(bot.status, 400);

  // the stage (one of the offered values) and the company (a short line) are optional
  const brief = { name: 'Ada Lovelace', email: 'ada@example.com', subject: 'AI & ML', message: 'A sufficiently detailed project enquiry.', website: '' };
  resetRateLimit(); // (a fresh window: this test sends more than one visitor may)
  const staged = await request(server, 'POST', '/api/contact', JSON.stringify({ ...brief, stage: 'Have designs', company: 'Analytical Engines Ltd' }), headers);
  assert.equal(staged.status, 503);
  const madeUpStage = await request(server, 'POST', '/api/contact', JSON.stringify({ ...brief, stage: 'Almost done' }), headers);
  assert.equal(madeUpStage.status, 400);
  const longCompany = await request(server, 'POST', '/api/contact', JSON.stringify({ ...brief, company: 'x'.repeat(161) }), headers);
  assert.equal(longCompany.status, 400);

  const wrongType = await request(server, 'POST', '/api/contact', valid, { 'Content-Type': 'text/plain' });
  assert.equal(wrongType.status, 415);

  const method = await request(server, 'GET', '/api/contact');
  assert.equal(method.status, 405);
  assert.equal(method.headers.allow, 'POST');
});

test('contact API answers oversized and non-object bodies instead of dropping the connection or crashing', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'contact-api-'));
  await fs.writeFile(path.join(root, 'index.html'), '<h1>ok</h1>');
  const server = createStaticServer({ root, onRequest: (req, res) => handleContact(req, res, { webhookUrl: '' }) });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await fs.rm(root, { recursive: true, force: true });
  });
  const headers = { 'Content-Type': 'application/json' };
  resetRateLimit();

  const huge = await request(server, 'POST', '/api/contact', JSON.stringify({ message: 'x'.repeat(40_000) }), headers);
  assert.equal(huge.status, 413);
  assert.equal(JSON.parse(huge.body).error, 'payload_too_large');

  for (const body of ['null', '5', '[]']) {
    const odd = await request(server, 'POST', '/api/contact', body, headers);
    assert.equal(odd.status, 400, body);
  }
});

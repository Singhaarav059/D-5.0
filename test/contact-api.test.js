'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { createStaticServer } = require('../lib/static-server');
const { handleContact } = require('../lib/contact-api');

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

  const wrongType = await request(server, 'POST', '/api/contact', valid, { 'Content-Type': 'text/plain' });
  assert.equal(wrongType.status, 415);

  const method = await request(server, 'GET', '/api/contact');
  assert.equal(method.status, 405);
  assert.equal(method.headers.allow, 'POST');
});

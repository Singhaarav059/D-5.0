'use strict';

const https = require('https');
const http = require('http');
const { URL } = require('url');

const MAX_BODY_BYTES = 16 * 1024;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const attempts = new Map();

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function clientKey(req) {
  if (process.env.TRUST_PROXY === '1' && req.headers['x-forwarded-for']) {
    return req.headers['x-forwarded-for'].split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

function allowed(key) {
  const now = Date.now();
  const recent = (attempts.get(key) || []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    attempts.set(key, recent);
    return false;
  }
  recent.push(now);
  attempts.set(key, recent);
  if (attempts.size > 10_000) {
    for (const [candidate, times] of attempts) {
      if (times.every((time) => now - time >= WINDOW_MS)) attempts.delete(candidate);
    }
  }
  return true;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let total = 0;
    const chunks = [];
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      total += Buffer.byteLength(chunk);
      if (total > MAX_BODY_BYTES) {
        reject(Object.assign(new Error('Payload too large'), { statusCode: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(chunks.join('')));
    req.on('error', reject);
  });
}

function deliverWebhook(payload, target) {
  return new Promise((resolve, reject) => {
    const url = new URL(target);
    if (!['http:', 'https:'].includes(url.protocol) || (process.env.NODE_ENV === 'production' && url.protocol !== 'https:')) return reject(new Error('Unsupported webhook protocol'));
    const transport = url.protocol === 'https:' ? https : http;
    const body = JSON.stringify(payload);
    const request = transport.request(url, {
      method: 'POST',
      timeout: 5_000,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (response) => {
      response.resume();
      if (response.statusCode >= 200 && response.statusCode < 300) resolve();
      else reject(new Error(`Webhook returned ${response.statusCode}`));
    });
    request.on('timeout', () => request.destroy(new Error('Webhook timeout')));
    request.on('error', reject);
    request.end(body);
  });
}

async function handleContact(req, res, { webhookUrl = process.env.CONTACT_WEBHOOK_URL, logger = console } = {}) {
  if (req.url?.split('?', 1)[0] !== '/api/contact') return false;
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    json(res, 405, { error: 'method_not_allowed' });
    return true;
  }
  if (req.headers['content-type']?.split(';', 1)[0].trim() !== 'application/json') {
    json(res, 415, { error: 'content_type_must_be_json' });
    return true;
  }
  if (!allowed(clientKey(req))) {
    json(res, 429, { error: 'too_many_requests' });
    return true;
  }

  let data;
  try {
    data = JSON.parse(await readBody(req));
  } catch (error) {
    json(res, error.statusCode || 400, { error: error.statusCode === 413 ? 'payload_too_large' : 'invalid_json' });
    return true;
  }

  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  const subject = typeof data.subject === 'string' ? data.subject.trim() : '';
  const message = typeof data.message === 'string' ? data.message.trim() : '';
  if (data.website || name.length < 2 || name.length > 120 || subject.length > 160 || message.length < 10 || message.length > 5000 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    json(res, 400, { error: 'invalid_submission' });
    return true;
  }

  if (!webhookUrl) {
    json(res, 503, { error: 'contact_delivery_unavailable' });
    return true;
  }

  try {
    await deliverWebhook({ name, email, subject, message, receivedAt: new Date().toISOString() }, webhookUrl);
    json(res, 202, { ok: true });
  } catch (error) {
    logger.error('Contact webhook delivery failed:', error.message);
    json(res, 502, { error: 'contact_delivery_failed' });
  }
  return true;
}

module.exports = { handleContact };

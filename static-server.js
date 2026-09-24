'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

const MIME_TYPES = Object.freeze({
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
});

const SAFE_METHODS = new Set(['GET', 'HEAD']);
const MAX_URL_LENGTH = 8 * 1024;
const SECURITY_HEADERS = Object.freeze({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
});

function isWithinRoot(root, candidate) {
  return candidate === root || candidate.startsWith(`${root}${path.sep}`);
}

function sendText(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, {
    ...SECURITY_HEADERS,
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    ...headers
  });
  res.end(body);
}

function createStaticServer({ root, fallback = null, logger = console }) {
  const rootPath = path.resolve(root);
  const fallbackPath = fallback ? path.resolve(root, fallback) : null;

  if (!isWithinRoot(rootPath, fallbackPath || rootPath)) {
    throw new Error('Fallback must be inside the static root');
  }

  return http.createServer({
    maxHeaderSize: 16 * 1024,
    requestTimeout: 30_000,
    headersTimeout: 10_000,
    keepAliveTimeout: 5_000
  }, async (req, res) => {
    if (req.url && req.url.length > MAX_URL_LENGTH) {
      sendText(res, 414, 'URI Too Long\n');
      return;
    }

    if (!SAFE_METHODS.has(req.method)) {
      res.setHeader('Allow', 'GET, HEAD');
      sendText(res, 405, 'Method Not Allowed\n');
      return;
    }

    let requestedPath;
    try {
      const rawPath = (req.url || '/').split('?', 1)[0];
      requestedPath = decodeURIComponent(rawPath);
    } catch {
      sendText(res, 400, 'Bad Request\n');
      return;
    }

    if (requestedPath.includes('\0')) {
      sendText(res, 400, 'Bad Request\n');
      return;
    }

    let filePath = path.resolve(rootPath, `.${requestedPath === '/' ? '/index.html' : requestedPath}`);
    if (!isWithinRoot(rootPath, filePath)) {
      sendText(res, 404, 'Not Found\n');
      return;
    }

    try {
      let stat = await fs.promises.stat(filePath);
      if (stat.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
        stat = await fs.promises.stat(filePath);
      }
    } catch (error) {
      if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') {
        logger.error('Static file lookup failed:', error);
        sendText(res, 500, 'Internal Server Error\n');
        return;
      }

      if (!path.extname(filePath)) {
        const htmlPath = `${filePath}.html`;
        try {
          await fs.promises.stat(htmlPath);
          filePath = htmlPath;
        } catch (htmlError) {
          if (htmlError.code !== 'ENOENT' && htmlError.code !== 'ENOTDIR') {
            logger.error('Static route lookup failed:', htmlError);
            sendText(res, 500, 'Internal Server Error\n');
            return;
          }
        }
      }
    }

    if (!isWithinRoot(rootPath, filePath)) {
      sendText(res, 404, 'Not Found\n');
      return;
    }

    let stat;
    try {
      stat = await fs.promises.stat(filePath);
      if (!stat.isFile()) throw Object.assign(new Error('Not a regular file'), { code: 'EISDIR' });
      const realRoot = await fs.promises.realpath(rootPath);
      const realFile = await fs.promises.realpath(filePath);
      if (!isWithinRoot(realRoot, realFile)) {
        sendText(res, 404, 'Not Found\n');
        return;
      }
    } catch (error) {
      if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR' && error.code !== 'EISDIR') {
        logger.error('Static file validation failed:', error);
        sendText(res, 500, 'Internal Server Error\n');
        return;
      }
      if (fallbackPath) {
        filePath = fallbackPath;
        try {
          stat = await fs.promises.stat(filePath);
        } catch {
          sendText(res, 404, 'Not Found\n');
          return;
        }
      } else {
        sendText(res, 404, 'Not Found\n');
        return;
      }
    }

    const headers = {
      ...SECURITY_HEADERS,
      'Content-Type': MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Content-Length': stat.size,
      'Cache-Control': path.extname(filePath).toLowerCase() === '.html'
        ? 'no-cache'
        : 'public, max-age=3600'
    };

    res.writeHead(200, headers);
    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    const stream = fs.createReadStream(filePath);
    stream.on('error', (error) => {
      logger.error('Static file stream failed:', error);
      if (!res.headersSent) res.writeHead(500, SECURITY_HEADERS);
      res.end();
    });
    stream.pipe(res);
  });
}

function listen(server, port, host = '127.0.0.1', logger = console) {
  return server.listen(port, host, () => {
    logger.log(`Static server listening on http://${host}:${port}`);
  });
}

module.exports = { createStaticServer, listen };

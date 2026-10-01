'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const zlib = require('zlib');

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
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
});

const SAFE_METHODS = new Set(['GET', 'HEAD']);
const MAX_URL_LENGTH = 8 * 1024;
const BLOCKED_PATH = /(?:^|\/)(?:\.git|\.github|\.claude)(?:\/|$)|(?:^|\/)(?:\.env(?:\.[^/]*)?|package(?:-lock)?\.json|.*\.(?:key|pem|log))(?:$|\/)/i;
const COMPRESSIBLE_TYPES = new Set(['text/html', 'text/css', 'application/javascript', 'application/json', 'application/manifest+json', 'application/xml', 'text/plain', 'image/svg+xml']);
const SECURITY_HEADERS = Object.freeze({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Content-Security-Policy': "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'",
  // browsers keep to HTTPS for a year once they have seen the site over it (they ignore this on plain HTTP)
  'Strict-Transport-Security': 'max-age=31536000'
});

// Compressed bodies are made once per file version and kept in memory (the site is a few MB of text), instead of
// compressing at the maximum Brotli level for every request.
const COMPRESSED_CACHE_LIMIT = 64 * 1024 * 1024;
const compressed = { bytes: 0, entries: new Map() };

function compressedBody(filePath, etag, encoding) {
  const key = `${encoding}|${etag}|${filePath}`;
  let entry = compressed.entries.get(key);
  if (!entry) {
    const compress = encoding === 'br'
      ? (data) => new Promise((resolve, reject) => zlib.brotliCompress(data, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 9 } }, (e, out) => (e ? reject(e) : resolve(out))))
      : (data) => new Promise((resolve, reject) => zlib.gzip(data, { level: 9 }, (e, out) => (e ? reject(e) : resolve(out))));
    entry = fs.promises.readFile(filePath).then(compress);
    entry.then((body) => {
      compressed.bytes += body.length;
      if (compressed.bytes > COMPRESSED_CACHE_LIMIT) { compressed.entries.clear(); compressed.bytes = 0; }
    }, () => compressed.entries.delete(key));
    compressed.entries.set(key, entry);
  }
  return entry;
}

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

function createStaticServer({ root, fallback = null, notFound = null, logger = console, onRequest = null }) {
  const rootPath = path.resolve(root);
  const fallbackPath = fallback ? path.resolve(root, fallback) : null;
  // Optional branded page for unknown URLs (still a real 404 status); plain text if it is missing.
  const notFoundPath = notFound ? path.resolve(root, notFound) : null;
  const sendNotFound = async (res) => {
    let body = null;
    try { if (notFoundPath && isWithinRoot(rootPath, notFoundPath)) body = await fs.promises.readFile(notFoundPath); } catch { body = null; }
    if (!body) { sendText(res, 404, 'Not Found\n'); return; }
    res.writeHead(404, { ...SECURITY_HEADERS, 'Content-Type': 'text/html; charset=utf-8', 'Content-Length': body.length, 'Cache-Control': 'no-cache' });
    res.end(body);
  };

  if (!isWithinRoot(rootPath, fallbackPath || rootPath)) {
    throw new Error('Fallback must be inside the static root');
  }

  let realRootPromise = null;
  const realRoot = () => (realRootPromise ||= fs.promises.realpath(rootPath).catch((error) => { realRootPromise = null; throw error; }));

  return http.createServer({
    maxHeaderSize: 16 * 1024,
    requestTimeout: 30_000,
    headersTimeout: 10_000,
    keepAliveTimeout: 5_000
  }, async (req, res) => {
    try {
      await serve(req, res);
    } catch (error) {
      // one bad request must never take the process down (an unhandled rejection exits Node)
      logger.error('Request failed:', error);
      if (!res.headersSent) sendText(res, 500, 'Internal Server Error\n');
      else res.destroy();
    }
  });

  async function serve(req, res) {
    if (onRequest && await onRequest(req, res)) return;
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

    if (BLOCKED_PATH.test(requestedPath)) {
      await sendNotFound(res);
      return;
    }

    let filePath = path.resolve(rootPath, `.${requestedPath === '/' ? '/index.html' : requestedPath}`);
    if (!isWithinRoot(rootPath, filePath)) {
      await sendNotFound(res);
      return;
    }

    try {
      let stat = await fs.promises.stat(filePath);
      if (stat.isDirectory()) {
        // A folder without an index (public/projects/, the case studies) leaves its name to the page beside it
        // (projects.html), which the extensionless lookup below finds.
        filePath = path.join(filePath, 'index.html');
        try { stat = await fs.promises.stat(filePath); } catch (error) {
          if (error.code !== 'ENOENT') throw error;
          filePath = path.dirname(filePath);
          throw Object.assign(new Error('no index'), { code: 'ENOENT' });
        }
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
      await sendNotFound(res);
      return;
    }

    let stat;
    try {
      stat = await fs.promises.stat(filePath);
      if (!stat.isFile()) throw Object.assign(new Error('Not a regular file'), { code: 'EISDIR' });
      const [realRootPath, realFile] = await Promise.all([realRoot(), fs.promises.realpath(filePath)]);
      if (!isWithinRoot(realRootPath, realFile)) {
        await sendNotFound(res);
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
          await sendNotFound(res);
          return;
        }
      } else {
        await sendNotFound(res);
        return;
      }
    }

    const headers = {
      ...SECURITY_HEADERS,
      'Content-Type': MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Content-Length': stat.size,
      'ETag': `W/"${stat.size.toString(16)}-${Math.floor(stat.mtimeMs).toString(16)}"`,
      'Last-Modified': stat.mtime.toUTCString(),
      // Pages always revalidate. Assets requested with a build fingerprint (?v=<hash>, added by
      // src/build.js) never change at that URL, so they can be cached for a year.
      'Cache-Control': path.extname(filePath).toLowerCase() === '.html'
        ? 'no-cache'
        : /[?&]v=[0-9a-f]{8,}(?:&|$)/.test(req.url || '') ? 'public, max-age=31536000, immutable' : 'public, max-age=3600'
    };

    const contentType = headers['Content-Type'].split(';', 1)[0];
    const accepts = String(req.headers['accept-encoding'] || '');
    const encoding = COMPRESSIBLE_TYPES.has(contentType) && /\bbr\b/.test(accepts)
      ? 'br'
      : COMPRESSIBLE_TYPES.has(contentType) && /\bgzip\b/.test(accepts) ? 'gzip' : null;
    // a validator per encoding: a shared cache must not hand a Brotli copy's ETag to a gzip one
    if (encoding) headers.ETag = headers.ETag.replace(/"$/, `-${encoding}"`);

    // A page is "not modified" only if the browser's copy is this exact version. The ETag says so exactly; the date
    // only to the second, and a rebuild can rewrite a page twice within one second, so the date is used only when the
    // browser sends no ETag (as HTTP requires).
    const inm = req.headers['if-none-match'];
    const ims = Date.parse(req.headers['if-modified-since'] || '');
    const fresh = inm !== undefined
      ? inm.split(',').some((tag) => tag.trim() === headers.ETag || tag.trim() === '*')
      : !Number.isNaN(ims) && Math.floor(stat.mtimeMs / 1000) * 1000 <= ims;
    if (fresh) {
      res.writeHead(304, { ...SECURITY_HEADERS, ETag: headers.ETag, 'Cache-Control': headers['Cache-Control'], ...(COMPRESSIBLE_TYPES.has(headers['Content-Type'].split(';', 1)[0]) && { Vary: 'Accept-Encoding' }) });
      res.end();
      return;
    }

    // the same URL answers differently by Accept-Encoding, including the uncompressed answer
    if (COMPRESSIBLE_TYPES.has(contentType)) headers.Vary = 'Accept-Encoding';
    if (encoding) {
      headers['Content-Encoding'] = encoding;
      const body = await compressedBody(filePath, headers.ETag, encoding);
      headers['Content-Length'] = body.length;
      res.writeHead(200, headers);
      res.end(req.method === 'HEAD' ? undefined : body);
      return;
    }

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
  }
}

// Hosting platforms route traffic to the container from outside, so the server must listen on all interfaces
// there. Render sets RENDER but not NODE_ENV; without this it bound to 127.0.0.1 and Render's port scan found
// nothing. Locally it stays on 127.0.0.1 so a dev server is not exposed to the network.
const onHostingPlatform = () => process.env.NODE_ENV === 'production' || Boolean(process.env.RENDER || process.env.RAILWAY_ENVIRONMENT);

function listen(server, port, host = onHostingPlatform() ? '0.0.0.0' : '127.0.0.1', logger = console) {
  return server.listen(port, host, () => {
    logger.log(`Static server listening on http://${host}:${port}`);
  });
}

module.exports = { createStaticServer, listen };

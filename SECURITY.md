# Security policy

The server (`server.js`) exposes only `public/`. Source (`src/`), server code (`lib/`), tests, configuration and
git metadata are never served; `test/html.test.js` fails if source files end up in `public/`, and the static
server also denies dotfiles, `package*.json`, keys and logs outright.

Deploy with `NODE_ENV=production` and a platform-managed `PORT`. Keep `CONTACT_WEBHOOK_URL` (HTTPS) as a
deployment secret. Never commit webhook URLs, credentials, `.env` files, private keys or certificates.

Built-in protections: path traversal protection, sensitive-file denial, request size limits, security headers
(CSP allowing only same-origin scripts, styles, fonts and images; no framing by other sites), contact form
validation, honeypot filtering and per-IP rate limiting (set `TRUST_PROXY=1` behind a proxy).

Report suspected vulnerabilities privately to the site owner rather than opening a public issue with exploit
details.

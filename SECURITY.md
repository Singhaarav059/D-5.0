# Security policy

The production application is the static site under `site/`. Do not serve the repository root, `.git` metadata, build tooling, or documentation publicly. Deploy with `NODE_ENV=production`, `HOST=0.0.0.0`, and a platform-managed `PORT`.

Contact submissions should use an HTTPS `CONTACT_WEBHOOK_URL` managed as a deployment secret. Never commit webhook URLs, credentials, `.env` files, private keys, or certificates.

The application applies path traversal protection, sensitive-file denial, request limits, security headers, Content Security Policy enforcement, contact validation, honeypot filtering, and rate limiting. Report suspected vulnerabilities privately to the repository owner rather than opening a public issue with exploit details.

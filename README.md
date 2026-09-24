# Demaze Technologies website

This repository contains the active Demaze Technologies static website in `site/`. The production runtime serves only that directory; historical source pages and visual QA artifacts are not part of the public serving root.

## Active routes

- `/`
- `/projects`
- `/services`
- `/about-us`
- `/contact`
- `/robots.txt`
- `/sitemap.xml`

## Local development

```bash
npm ci
npm run build
npm start
```

The local server listens on `http://127.0.0.1:3100` by default. Set `PORT` to use another port. For container or cloud deployment, set `NODE_ENV=production` and `HOST=0.0.0.0`.

## Contact delivery

The contact form validates input in the browser and on the server. If `CONTACT_WEBHOOK_URL` is configured, validated submissions are delivered as JSON to that HTTPS webhook. The endpoint includes a request-size limit, honeypot field, server-side validation, and in-memory rate limiting. If delivery is not configured or unavailable, the browser offers a `mailto:` fallback for local and low-infrastructure deployments.

Copy `.env.example` to `.env` and configure the runtime values through the deployment platform’s secret/environment settings. Do not commit `.env` files or webhook credentials.

## Verification

```bash
npm run test:all
npm audit --omit=dev --audit-level=moderate
```

The test suite covers static-server traversal protection, sensitive-file denial, contact validation, generated-page metadata, canonical URLs, duplicate IDs, and local runtime asset boundaries. GitHub Actions runs the same checks for pushes to `main` and `new` and for pull requests.

## Project structure

| Path | Purpose |
| --- | --- |
| `site/` | Active generated website and public assets |
| `site/build.js` | Generates active HTML pages from `site/content.js` |
| `static-server.js` | Hardened static server with security headers and path controls |
| `contact-api.js` | Validated contact webhook adapter |
| `test/` | Backend and generated-page regression tests |
| `.github/workflows/ci.yml` | Continuous integration checks |

# Demaze Technologies website

The marketing site for Demaze Technologies. Pages are plain HTML generated from one content file, served by a
small Node.js server that also handles the contact form. There is no framework, no bundler and no runtime
dependency: everything the browser loads is self-hosted in `public/`.

## Quick start

Requirements: Node.js 20 or newer.

```bash
npm install          # no dependencies today; keeps the lockfile honest
npm run dev          # builds the pages and serves them at http://127.0.0.1:3000
```

`PORT=3100 npm run dev` picks another port.

## Project structure

```
server.js              Production entry: serves public/ and the /api/contact endpoint
lib/
  static-server.js     Static file server: security headers, CSP, caching, compression, branded 404
  contact-api.js       Contact form endpoint: validation, honeypot, rate limit, webhook delivery
src/
  content.js           ALL copy and data (projects, services, FAQ, tools, contact details)
  build.js             Page templates; writes public/*.html from content.js
public/                Everything a visitor can load (the only folder the server exposes)
  *.html               Generated pages (index, projects, services, about-us, contact, 404). Do not edit by hand.
  assets/
    site.css           All styles
    site.js            Interactions and scroll motion (GSAP + ScrollTrigger + Lenis)
    cine.js            Home hero opening + Three.js dotted globe
    visit3d.js         Contact page office map as a Three.js diorama (SVG fallback in the page)
    ink.js             "How we work" ink story (canvas)
    boot.js            Sets motion / reduced-motion classes before first paint
    fonts/, fonts.css  Self-hosted fonts (Bricolage Grotesque, Figtree)
    vendor/            Third-party libraries (GSAP, ScrollTrigger, Lenis, Three.js)
    img/work/          Project screens + founder photo (WebP + PNG/JPEG fallback) and manifest.json
    img/tech/          Technology logos used in the tools map
    img/logo.png, og.png  Brand mark and the social share image (1200x630)
  robots.txt, sitemap.xml
test/                  Automated checks (node --test)
.github/workflows/     CI: build, check generated pages are committed, tests, syntax, audit
```

## Editing the site

1. Change text or data in `src/content.js` (layout and markup live in `src/build.js`).
2. Run `npm run build` to regenerate `public/*.html`.
3. Run `npm run test:all`, then commit **both** the source change and the regenerated HTML
   (CI fails if `public/*.html` is out of date).

### Adding a project

1. Prepare the screenshot at about 1600px wide and export three files into `public/assets/img/work/`:
   `<slug>-800.webp`, `<slug>-1600.webp` (WebP, quality ~78, keep transparency) and `<slug>-720.png`
   (fallback for old browsers). Use a proper encoder such as Squoosh (squoosh.app), `cwebp` or `sharp`.
   Check the result in Chrome and Safari before committing.
2. Add an entry to `public/assets/img/work/manifest.json` with the original `w`/`h` and the three files
   (copy an existing entry as the template).
3. Add the project to `projects` in `src/content.js` with `image: '<slug>'`, then build.

The build stops with `missing image <slug>` if the manifest entry is missing.

### Adding a technology logo

Save an SVG (preferred) or PNG as `public/assets/img/tech/<name>.svg` and reference `<name>` in the `tools`
list in `src/content.js`. Items without a logo show a two-letter monogram.

### Social share image

`public/assets/img/og.png` (1200x630) is used for link previews. Replace the file to change it.

## Configuration

Set these as environment variables on the host (see `.env.example`; never commit a real `.env`).

| Variable | Used for |
| --- | --- |
| `PORT` | Port to listen on (the host usually sets this). |
| `HOST` | Bind address. Defaults to `0.0.0.0` when `NODE_ENV=production`, else `127.0.0.1`. |
| `NODE_ENV` | `production` in deployment. |
| `CONTACT_WEBHOOK_URL` | HTTPS webhook that receives validated contact submissions as JSON. **If unset, the form cannot deliver messages** and falls back to opening the visitor's email app. |
| `TRUST_PROXY` | `1` behind a proxy/load balancer so rate limiting sees the real client IP. |
| `SITE_URL` | Build time only: absolute site URL for canonical links, sitemap-style URLs and the share image. Defaults to `https://demazetech.com`. |

## Deployment (Railway)

The site runs as a single Node service: build command none needed (the generated HTML is committed), start
command `npm start`. Pushing to `main` redeploys. After the custom domain points at the service, canonical URLs
and the share image (built for `https://demazetech.com`) resolve correctly.

Caching: HTML is always revalidated; every asset link carries a content fingerprint (`?v=<hash>`, added by the
build), so assets are cached for a year and a deploy never shows stale styles.

## Checks

```bash
npm run test:all     # build + server/API tests + page checks
```

The tests cover path traversal and sensitive-file denial, the branded 404, cache headers, contact validation,
page metadata, unique IDs, that pages load **no third-party assets**, and that no source code sits in `public/`.

## Accessibility and motion

All content is real HTML; the hero opening, globe, tools map wires and ink story are decoration layered on top.
With "reduce motion" enabled the opening is skipped and scenes render in their final state. The hero opening
plays once per browser session.

## Licensing

Site code and content belong to Demaze Technologies. Bundled third-party fonts, libraries and logos are listed in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) with their licences.

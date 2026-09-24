# Demaze Technologies implementation state

## Active architecture

The production website is the static site in `site/`. Railway serves that application through `site/serve.js`; the old Framer/MOVIQ export at the repository root is historical and is not part of the active runtime.

### Active routes

- `/`
- `/projects`
- `/services`
- `/about-us`
- `/contact`
- `/robots.txt`
- `/sitemap.xml`

### Active files

| Path | Role |
|---|---|
| `site/content.js` | Website content source |
| `site/build.js` | Generates the active HTML pages |
| `site/assets/site.css` | Active site styles |
| `site/assets/site.js` | Active interactions and motion |
| `site/assets/boot.js`, `flow.js`, `liquid.js` | Active visual/runtime helpers |
| `site/serve.js` | Local/production static server |
| `contact-api.js` | Contact delivery endpoint |
| `static-server.js` | Hardened static-server implementation used by the site server |
| `test/` | Regression and security tests |

## Contact delivery

The contact form submits to `/api/contact`. The server validates requests and can forward them to `CONTACT_WEBHOOK_URL`. If delivery is unavailable, the browser falls back to opening a prefilled email.

## Verification

Run:

```bash
npm ci
npm run test:all
npm audit --omit=dev --audit-level=moderate
```

The current CI workflow runs the test suite for pushes to `main` and `new`, and for pull requests.

## Legacy source

The repository still contains historical Framer/MOVIQ source, assets, and audit material from the redesign process. They are intentionally not served by the active `site/` runtime. Do not treat those files as the production architecture.

The active design system lives under `site/assets/site.css`. Do not make visual/design changes as part of infrastructure or hygiene fixes unless explicitly requested.

## Agent guidance

When modifying the production site, start in `site/`. Inspect `site/build.js` and `site/content.js` before changing generated HTML. Do not revive or modify the historical root Framer/MOVIQ implementation unless the task explicitly concerns migration/history.

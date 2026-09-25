# Working on the code

## Branches and deploys

- `main` is the only long-lived branch and is what the live site runs: every push to `main` deploys.
- For anything bigger than a small fix, work on a short-lived branch (`fix/contact-form-copy`,
  `feat/new-case-study`) and open a pull request into `main`. CI must pass before merging.

## Before you commit

```bash
npm run test:all
```

This rebuilds `public/*.html`, syntax-checks every script and runs the tests. Commit the regenerated HTML
together with the source change that produced it; CI fails if they drift apart.

## Commits

One change per commit, so the history reads as a list of decisions and any single change can be reverted.

- Subject: imperative, capitalised, no full stop, under ~70 characters, saying what changes for the site
  ("Fix the home page founder link", "Add the CMA report case study"), not how ("Update build.js").
- Body (when the reason is not obvious): why the change was needed and anything a reviewer should check,
  wrapped at ~72 characters.
- Keep refactors separate from behaviour changes. A pure move or rename should produce identical pages;
  say so in the body.
- Never commit secrets, `.env` files or generated files other than `public/*.html`.

## Code style

- Plain Node.js (CommonJS) on the server and build side, plain browser JavaScript in `public/assets`. No framework,
  no bundler, no runtime dependencies; keep it that way unless there is a strong reason.
- All copy and data lives in `src/content.js`; templates only arrange it. Escape any content with `esc()`.
- Everything the browser loads must be self-hosted in `public/` (the Content Security Policy blocks other origins,
  and a test enforces it).
- Motion is decoration: pages must read fully with JavaScript off and with "reduce motion" on.

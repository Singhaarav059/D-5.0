# Demaze Implementation State

Read this first in a new session, then check the code — the code wins if they disagree.

## Architecture

- `index.html` is a Framer React export. React hydrates on load and discards server HTML
  that doesn't match its compiled (MOVIQ) tree, so Demaze content is applied **after**
  hydration by small override scripts in `demaze/`, via `DemazeOverride.run()` in
  `demaze/demaze-override-core.js` (bounded polling + rechecks, no unbounded loops).
- Overrides never reorder or delete React-owned sections (that crashes the reconciler).
  They append Demaze blocks inside existing sections and hide the MOVIQ children with CSS.
- Subpages (`services`, `projects`, `about-us`, `contact`) are plain static HTML.

### Files
| File | Role |
|---|---|
| `demaze/demaze-content.js` | Verified content (single source). Never invent facts. |
| `demaze/demaze-system.css` | Design system: tokens, type, nav, buttons, footer, drawer, FAQ/contact, subpage components. Linked at the **end of `<body>`** on every page so it wins cascade ties with injected `<style>` tags. |
| `assets/demaze/demaze-subpages.css` | Foundation only (fonts, reset, Lenis, mobile toggle, skip link, reduced motion). |
| `assets/demaze/demaze-shared.js` | Every page: canonical footer markup, nav scroll state, mobile drawer, subpage reveal, Lenis on subpages. |
| `demaze/demaze-blocks.js` | Shared FAQ + closing contact band (homepage override and `data-dz-block` slots on subpages). |
| `index.html` `<head>` `demaze-prepaint-gate` | Hero styles and section order/visibility. Hero CSS lives here (not JS) so the hydrated layout never shifts. |

### Homepage section → MOVIQ slot
| Visual order | Demaze section | Mounted in |
|---|---|---|
| 1 | Hero (sphere in sky) | `Hero` (`demaze-hero-override.js`) |
| 2 | Engineering Stack (list + orbit) | `Badge` (`demaze-techstack-override.js`) |
| 3 | Featured projects (sticky stack) | `Sricpt` (`demaze-showcase-override.js`) |
| 4 | Core capabilities, then How We Work | first `Tools` (`capabilities` + `process` overrides) |
| 5 | Industries (disclosure list + panel) | second `Tools` (`demaze-industries-override.js`) |
| 6 | About (copy, metrics, founder) | `Moviq vs Traditional Video` (`demaze-whydemaze-override.js`) |
| 7 | FAQ, then contact band | `Faq` (`demaze-faq-override.js`) |
Hidden: `Videos making Step`, `Products`, `Ai Powered`, every `CTA`, `Pricing`, Framer header/footer.
Blocks are mounted so DOM order equals visual order (screen readers, keyboard).

## Design rules
- One accent (`--dz-accent` #2563eb) on paper/ink. No gradient text, no rainbow palettes,
  no glass-on-glass, no pills for eyebrows (plain uppercase labels).
- Headings: Stack Sans Headline 600, tracking −0.01em (the face is tightly fitted).
  Body: Inter. Headings needing another font use `data-dz-font`.
- Motion: one-shot reveals only (`DemazeOverride.reveal` / subpage `initReveal`), never
  re-hide on scroll back; no scroll-driven layout effects; press feedback `scale(.97)`;
  everything respects `prefers-reduced-motion`.

## Known limitations
- React hydration warnings (#418/#425/#422) exist since before this work: the pre-hydration
  script rewrites MOVIQ text to avoid a flash of template copy, which the compiled bundle then
  sees as a mismatch. Real fix: republish the Framer project with Demaze content.
- Hidden MOVIQ copy still exists in the homepage HTML source (Framer SSR).
- No real booking link exists; "Book a call" leads to `/contact`, where the call option is an email.
  The contact form composes an email in the visitor's mail client (there is no backend).

## Do not reintroduce
Legacy telemetry (NEURAL ENGINE, 99.4%, Inference Precision, …), fake performance claims,
"response within 24 hours" guarantees, invented mission/vision copy, MOVIQ content, the
fake browser window around the hero sphere, legal links to pages that don't exist.

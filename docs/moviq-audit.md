# MOVIQ Live Site & Local Repository Audit (Phase 0)

**Reference URL:** https://moviq.framer.website/  
**Audit Viewports:** Desktop (1440×900), Mobile (390×844)  
**Audit Method:** Automated slow-scroll evaluation via headless Puppeteer with computed style extraction and full visual captures.

---

## 1. Executive Summary & [VERIFY] Resolutions

| Item | Spec Default | Live MoviQ Finding | Resolution (MoviQ Wins on Behavior/Order/Theme) |
|---|---|---|---|
| **Headings Typeface** | `Inter` (variable) | `"Stack Sans Headline"` (weights 300, 500, 700) with fallback to clean geometric sans | Maintain `Inter` with tightened tracking (`-0.025em`) as clean baseline for Demaze, or load `Stack Sans Headline` if desired. |
| **Max Container Width** | `1280px` | `1380px` (`calc(100vw - 60px)` at 1440px) | Demaze inner pages use `1280px`; container centered at `max-width: 1280px` prevents 1790px blowouts on 1920px screens while matching MoviQ's proportion. |
| **Section Block Padding** | 120px desktop | 100px top / 0px bottom (handled by inter-section margin or internal gaps) | Standardize to `100px–120px` block padding. |
| **Smooth Scroll (Lenis)** | Test if Lenis exists | **Confirmed: Lenis is active** (`window.lenis` present) | Smooth scrolling enabled via Lenis with sticky-safe offsets. |
| **Sticky Project Stack** | `position: sticky; top: calc(112px + i * 20px)` | MoviQ uses Framer scroll-linked transforms with sticky card stack | Pure CSS `position: sticky` with incremental depth offsets (`100px + i * 22px`) provides identical stacked depth without layout shift. |
| **Made in Framer Badge** | Present in recording | Dynamically injected by `script_main.*.mjs` into `#__framer-badge-container` | Target and remove `#__framer-badge-container { display: none !important; }`. |

---

## 2. Comprehensive 16-Section MoviQ Analysis

### Section 1: Navigation
- **MoviQ Element**: `<header data-framer-name="Desktop"> <nav data-framer-name="Nav">`
- **Screenshot**: `docs/screenshots/moviq-sec-01-Desktop.png`
- **Container Width**: Floating pill, height 72px, padding `0 12px 0 24px`, border-radius `100px`.
- **Surface**: Glassmorphism (`background: rgba(255, 255, 255, 0.1)`, `backdrop-filter: blur(10px)`, border `1px solid rgba(255, 255, 255, 0.2)`).
- **Typography**: 16px, weight 300, line-height 24px, color `#ffffff`.
- **CTA Button**: Pill button ("Get Started"), height 44px, dark gradient background, border-radius `50px`, circular white arrow chip.
- **Scroll Behavior**: Pinned floating pill (`position: fixed; top: 35px; left: 50%; transform: translateX(-50%)`). Transitions to stronger background upon scroll.
- **Mobile (390px)**: Compact pill (height 60px) with logo and 3-line animated hamburger toggle. Opens full-screen drawer.

### Section 2: Hero
- **MoviQ Element**: `section[data-framer-name="Hero"]`
- **Screenshot**: `docs/screenshots/moviq-sec-02-Hero.png`
- **Container Width**: Max-width `1380px`, height `1300px`.
- **Section Padding**: Top 160px, bottom 0px.
- **Surface**: Full-bleed photographic background with dark gradient overlay (`rgba(6,20,60,.35)` to `.55`).
- **Typography**:
  - Eyebrow Badge: Pill with dark text + price tag pill (`$29/Lifetime`).
  - H1: 72px, weight 700, line-height 80px, color `#ffffff`, 2 lines centered.
  - Paragraph: 16px, weight 300, line-height 24px, color `#ffffff`.
- **Product Peek**: Large product UI mockup overlapping the lower hero edge.
- **Motion**: Staggered fade-up reveal for badge (0.1s), headline (0.25s), paragraph (0.4s), CTAs (0.55s).

### Section 3: Trusted By (Marquee)
- **MoviQ Element**: `section[data-framer-name="Badge"]`
- **Screenshot**: `docs/screenshots/moviq-sec-03-Badge.png`
- **Container Width**: Max-width `1380px`, height 317px, padding 100px top, 30px inline.
- **Typography**: H3 label 44px (MoviQ), weight 400, line-height 56px, muted gray color `#6c7783`.
- **Layout**: Flex row logo ticker with edge alpha gradient masks.
- **Motion**: Continuous horizontal translation loop (`translateX(-50%)`), pause on hover.
- **Mobile (390px)**: Ticker continues smoothly with smaller 24px logo height.

### Section 4: Process ("Make pro videos in 3 simple steps")
- **MoviQ Element**: `section[data-framer-name="Videos making Step"]`
- **Screenshot**: `docs/screenshots/moviq-sec-04-Videos making Step.png`
- **Container Width**: Max-width `1380px`, height 800px.
- **Grid / Layout**: 3 cards desktop, flex row, gap 32px.
- **Card**: White card, 24px radius, 32px padding, top numeric pill/badge, title 22px, body 15px.
- **Motion**: Staggered upward entrance reveal (700ms ease-out), card hover translateY(-4px) with elevation shadow.
- **Mobile (390px)**: Stacks vertically into 1 column.

### Section 5: Demo Showcase ("See your script turn into a video")
- **MoviQ Element**: `section[data-framer-name="Sricpt"]`
- **Screenshot**: `docs/screenshots/moviq-sec-05-Sricpt.png`
- **Container Width**: Max-width `1380px`, height ~1700px.
- **Layout**: 12-column split layout. Left side (span 4) is sticky with H2 and CTA button. Right side (span 8) contains stacked cards.
- **Scroll Behavior**: Sticky card stacking. Cards enter from bottom, overlapping prior cards with slight exposed top edge for depth.
- **Mobile (390px)**: Unstacks into normal vertical flow; heading on top, cards stacked normally.

### Section 6: Feature Cards ("Tools to bring your ideas to life")
- **MoviQ Element**: `section[data-framer-name="Tools"][0]`
- **Screenshot**: `docs/screenshots/moviq-sec-06-Tools.png`
- **Container Width**: Max-width `1380px`, height ~1900px.
- **Grid**: 4-card / 6-card grid with icon, title, description, and feature checkmarks.
- **Motion**: Progressive horizontal unfold on scroll; transitions from compact cluster into full-width cards.
- **Mobile (390px)**: Vertical accordion / card sequence.

### Section 7: CTA Banner 1
- **MoviQ Element**: `section[data-framer-name="CTA"][0]`
- **Screenshot**: `docs/screenshots/moviq-sec-07-CTA.png`
- **Container Width**: Inset container panel, border-radius 40px, min-height 360px.
- **Surface**: Full-width photographic texture with centered H2, subcopy, and primary pill button.

### Section 8: Tabbed Feature Section ("AI Video Creation")
- **MoviQ Element**: `section[data-framer-name="Tools"][1]`
- **Screenshot**: `docs/screenshots/moviq-sec-08-Tools.png`
- **Container Width**: Max-width `1380px`.
- **Layout**: Horizontal tab bar on top; large 2-column detail panel below (left checklist, right visual graphic).
- **Interaction**: Single active tab with gradient underline. Inactive tabs have zero underline opacity. Crossfade transition on tab click.
- **Mobile (390px)**: Horizontally scrollable chip row; detail card stacks checklist above image.

### Section 9: Bento Grid ("AI-Powered UGC")
- **MoviQ Element**: `section[data-framer-name="Ai Powered"]`
- **Screenshot**: `docs/screenshots/moviq-sec-09-Ai Powered.png`
- **Container Width**: Max-width `1240px`.
- **Layout**: $2 \times 2$ grid (4 cards for Demaze values).
- **Card Styling**: 24px border-radius, 36px 32px padding, top text header, bottom visual illustration.
- **Motion**: Staggered reveal, subtle hover lift (`translateY(-4px)`).
- **Mobile (390px)**: 1 column vertical stack.

### Section 10: Gallery / Brand Story ("Products")
- **MoviQ Element**: `section[data-framer-name="Products"]`
- **Screenshot**: `docs/screenshots/moviq-sec-10-Products.png`
- **Container Width**: Max-width `1380px`.
- **Layout**: 2 columns (left narrative text and capability pills, right visual graphic).
- **Demaze Adaptation**: Houses "Who We Are" + unified Founder quote and statement directly below.

### Section 11: Comparison Table ("Moviq vs Traditional Video")
- **MoviQ Element**: `section[data-framer-name="Moviq vs Traditional Video"]`
- **Screenshot**: `docs/screenshots/moviq-sec-11-Moviq vs Traditional Video.png`
- **Container Width**: Max-width `1200px`.
- **Demaze Adaptation**: Replaced with 3 verified "Why Choose Us" benefit cards + 4-column metric counter strip ($10M+ client value, 45+ projects, 35+ squad, 6+ years).

### Section 12: CTA Banner 2
- **MoviQ Element**: `section[data-framer-name="CTA"][1]`
- **Screenshot**: `docs/screenshots/moviq-sec-12-CTA.png`
- **Demaze Adaptation**: Redundant MoviQ duplicate; omitted to preserve clean rhythm.

### Section 13: Pricing
- **MoviQ Element**: `section[data-framer-name="Pricing"]`
- **Screenshot**: `docs/screenshots/moviq-sec-13-Pricing.png`
- **Demaze Adaptation**: Omitted (Demaze offers custom enterprise scopes; logged in `docs/OPEN_ITEMS.md`).

### Section 14: Final CTA ("Reach Us At Anytime")
- **MoviQ Element**: `section[data-framer-name="CTA"][2]`
- **Screenshot**: `docs/screenshots/moviq-sec-14-CTA.png`
- **Container Width**: Inset rounded panel, radius 40px.
- **Demaze Adaptation**: Houses editorial final CTA ("Let's connect and build smarter, faster, and stronger – together.") and 3 frosted contact cards (Email, Calendly, Ahmedabad office).

### Section 15: FAQ
- **MoviQ Element**: `section[data-framer-name="Faq"]`
- **Screenshot**: `docs/screenshots/moviq-sec-15-Faq.png`
- **Container Width**: Max-width 820px centered.
- **Layout**: Accordion cards, 20px border radius, 24px padding. Plus icon rotates 45° to `×` upon expansion. Dark slate gray answer text (`#475569`).

### Section 16: Footer
- **MoviQ Element**: `footer[data-framer-name="Footer"]`
- **Screenshot**: `docs/screenshots/moviq-sec-16-Desktop.png`
- **Container Width**: Full width, `--bg-soft` surface, 1px top border.
- **Grid**: 4 columns (Brand & tagline, Navigation links, Services pillars, Direct contact info). Dynamic year copyright.

---

## 3. Local Repository Architecture Audit

1. **How the Homepage is Rendered**:
   - `index.html` was generated via Framer static export (`Framer 560da95`).
   - Contains SSR DOM tree, hydrated by `script_main.BWONtzN8.mjs` loaded from `framerusercontent.com`.
   - Post-hydration override layer (`demaze/demaze-override-core.js` + section override scripts) mutates DOM text, links, and layout safely without triggering React reconciler node removal panics.
2. **Where "Made in Framer" Badge Comes From**:
   - Injected at runtime by `script_main.BWONtzN8.mjs` into `<div id="__framer-badge-container">`.
   - Hidden via CSS rule `#__framer-badge-container { display: none !important; }`.
3. **Existing Tokens & Styling**:
   - Defined in `assets/demaze/demaze-subpages.css`:
     - `--bg: #ffffff;`
     - `--bg-soft: #f8f6fe;`
     - `--ink: #0b0e17;`
     - `--ink-2: #3f4454;`
     - `--ink-3: #6b7080;`
     - `--line: #e7e7f3;`
     - `--brand: #5b4fe9;`
     - `--brand-deep: #212251;`
     - `--brand-tint: #f0eeff;`
     - `--brand-glow: #a89eef;`
     - `--gradient-accent: linear-gradient(135deg, #2a66de 0%, #7a4fe6 50%, #c23bd0 100%);`
4. **Existing Shared Components**:
   - Floating frosted pill navigation (desktop + mobile drawer)
   - Unified footer with dynamic year
   - `<CtaBanner>` container
   - Contact cards (Email, Calendly, Office)
   - Infinite logo marquee ticker with pause-on-hover
   - Interactive FAQ accordion
   - Upward animated metrics counter
